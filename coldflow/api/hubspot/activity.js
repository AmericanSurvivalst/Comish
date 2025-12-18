// HubSpot Activity Logger
// Creates engagement records in HubSpot for email activities
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

async function getValidToken(userId, settings) {
  const expiresAt = new Date(settings.hubspot.expires_at)
  if (expiresAt < new Date()) {
    const response = await fetch('https://api.hubapi.com/oauth/v1/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: settings.hubspot.refresh_token,
        client_id: process.env.HUBSPOT_CLIENT_ID,
        client_secret: process.env.HUBSPOT_CLIENT_SECRET
      }).toString()
    })
    
    if (!response.ok) throw new Error('Token refresh failed')
    const tokens = await response.json()
    
    await supabase
      .from('user_settings')
      .update({
        settings: {
          ...settings,
          hubspot: { ...settings.hubspot, access_token: tokens.access_token, refresh_token: tokens.refresh_token, expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString() }
        }
      })
      .eq('user_id', userId)
    
    return tokens.access_token
  }
  return settings.hubspot.access_token
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  
  const { userId, leadId, activityType, subject, description } = req.body
  
  if (!userId || !leadId || !activityType) {
    return res.status(400).json({ error: 'userId, leadId, and activityType required' })
  }
  
  try {
    // Get HubSpot settings
    const { data: settingsData } = await supabase
      .from('user_settings')
      .select('settings')
      .eq('user_id', userId)
      .single()
    
    if (!settingsData?.settings?.hubspot?.connected) {
      return res.json({ success: true, logged: false, reason: 'hubspot_not_connected' })
    }
    
    const settings = settingsData.settings
    
    // Get the lead to find HubSpot ID
    const { data: lead } = await supabase
      .from('leads')
      .select('hubspot_id, email, first_name, last_name')
      .eq('id', leadId)
      .single()
    
    if (!lead?.hubspot_id) {
      return res.json({ success: true, logged: false, reason: 'no_hubspot_link' })
    }
    
    const accessToken = await getValidToken(userId, settings)
    
    // Create a note on the contact timeline
    const noteBody = {
      properties: {
        hs_timestamp: new Date().toISOString(),
        hs_note_body: `${activityType.replace(/_/g, ' ').toUpperCase()}: ${subject || '(No Subject)'}\n\n${description || ''}`
      },
      associations: [{
        to: { id: lead.hubspot_id },
        types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 202 }] // Note to Contact
      }]
    }
    
    const response = await fetch('https://api.hubapi.com/crm/v3/objects/notes', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(noteBody)
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('HubSpot note create error:', errorText)
      return res.json({ success: true, logged: false, error: errorText })
    }
    
    const result = await response.json()
    
    res.json({
      success: true,
      logged: true,
      noteId: result.id
    })
    
  } catch (err) {
    console.error('HubSpot activity log error:', err)
    res.json({ success: true, logged: false, error: err.message })
  }
}
