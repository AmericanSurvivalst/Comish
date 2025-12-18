// Salesforce OAuth Callback
// Exchanges auth code for access token

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export default async function handler(req, res) {
  const { code, state, error } = req.query
  
  if (error) {
    console.error('SFDC OAuth error:', error)
    return res.redirect('/?sfdc_error=' + encodeURIComponent(error))
  }
  
  if (!code) {
    return res.redirect('/?sfdc_error=no_code')
  }
  
  // Decode state to get user ID
  let userId
  try {
    const stateData = JSON.parse(Buffer.from(state, 'base64').toString())
    userId = stateData.userId
  } catch (e) {
    return res.redirect('/?sfdc_error=invalid_state')
  }
  
  const clientId = process.env.SFDC_CLIENT_ID
  const clientSecret = process.env.SFDC_CLIENT_SECRET
  const redirectUri = process.env.SFDC_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/sfdc/callback`
  
  const baseUrl = process.env.SFDC_SANDBOX === 'true'
    ? 'https://test.salesforce.com'
    : 'https://login.salesforce.com'
  
  try {
    // Exchange code for tokens
    const tokenResponse = await fetch(`${baseUrl}/services/oauth2/token`, {
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
      console.error('SFDC token error:', errorText)
      return res.redirect('/?sfdc_error=token_exchange_failed')
    }
    
    const tokens = await tokenResponse.json()
    
    // Get user info from Salesforce
    const userInfoResponse = await fetch(`${tokens.instance_url}/services/oauth2/userinfo`, {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`
      }
    })
    
    let userInfo = {}
    if (userInfoResponse.ok) {
      userInfo = await userInfoResponse.json()
    }
    
    // Get org info
    const orgResponse = await fetch(`${tokens.instance_url}/services/data/v59.0/sobjects/Organization/${tokens.id?.split('/')[0] || ''}`, {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`
      }
    })
    
    let orgName = userInfo.organization_id || 'Salesforce Org'
    
    // Store tokens in user's settings
    // First get current settings
    const { data: currentSettings } = await supabase
      .from('user_settings')
      .select('settings')
      .eq('user_id', userId)
      .single()
    
    const existingSettings = currentSettings?.settings || {}
    
    const newSettings = {
      ...existingSettings,
      sfdc: {
        connected: true,
        instance_url: tokens.instance_url,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        user_id: userInfo.user_id,
        username: userInfo.preferred_username || userInfo.email,
        org_name: userInfo.organization_id,
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
      console.error('Failed to save SFDC settings:', upsertError)
      return res.redirect('/?sfdc_error=save_failed')
    }
    
    // Success - redirect back to app
    res.redirect('/?sfdc_connected=true')
    
  } catch (err) {
    console.error('SFDC callback error:', err)
    res.redirect('/?sfdc_error=' + encodeURIComponent(err.message))
  }
}
