// HubSpot OAuth Callback
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export default async function handler(req, res) {
  const { code, state, error } = req.query
  
  if (error) {
    console.error('HubSpot OAuth error:', error)
    return res.redirect('/?hubspot_error=' + encodeURIComponent(error))
  }
  
  if (!code) {
    return res.redirect('/?hubspot_error=no_code')
  }
  
  // Decode state to get user ID
  let userId
  try {
    const stateData = JSON.parse(Buffer.from(state, 'base64').toString())
    userId = stateData.userId
  } catch (e) {
    return res.redirect('/?hubspot_error=invalid_state')
  }
  
  const clientId = process.env.HUBSPOT_CLIENT_ID
  const clientSecret = process.env.HUBSPOT_CLIENT_SECRET
  const redirectUri = process.env.HUBSPOT_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/hubspot/callback`
  
  try {
    // Exchange code for tokens
    const tokenResponse = await fetch('https://api.hubapi.com/oauth/v1/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri
      }).toString()
    })
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error('HubSpot token error:', errorText)
      return res.redirect('/?hubspot_error=token_exchange_failed')
    }
    
    const tokens = await tokenResponse.json()
    
    // Get account info
    const accountResponse = await fetch('https://api.hubapi.com/oauth/v1/access-tokens/' + tokens.access_token)
    let accountInfo = {}
    if (accountResponse.ok) {
      accountInfo = await accountResponse.json()
    }
    
    // Get current settings
    const { data: currentSettings } = await supabase
      .from('user_settings')
      .select('settings')
      .eq('user_id', userId)
      .single()
    
    const existingSettings = currentSettings?.settings || {}
    
    const newSettings = {
      ...existingSettings,
      hubspot: {
        connected: true,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_in: tokens.expires_in,
        expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
        hub_id: accountInfo.hub_id,
        hub_domain: accountInfo.hub_domain,
        user_email: accountInfo.user,
        connected_at: new Date().toISOString()
      }
    }
    
    // Upsert settings
    const { error: upsertError } = await supabase
      .from('user_settings')
      .upsert({
        user_id: userId,
        settings: newSettings,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
    
    if (upsertError) {
      console.error('Failed to save HubSpot settings:', upsertError)
      return res.redirect('/?hubspot_error=save_failed')
    }
    
    res.redirect('/?hubspot_connected=true')
    
  } catch (err) {
    console.error('HubSpot callback error:', err)
    res.redirect('/?hubspot_error=' + encodeURIComponent(err.message))
  }
}
