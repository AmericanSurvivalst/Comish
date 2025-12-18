// Push a ColdFlow lead TO HubSpot as a new Contact
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

async function getValidToken(userId, settings) {
  const expiresAt = new Date(settings.hubspot.expires_at)
  if (expiresAt < new Date()) {
    // Refresh token
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
          hubspot: {
            ...settings.hubspot,
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString()
          }
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
  
  const { userId, leadId } = req.body
  
  if (!userId || !leadId) {
    return res.status(400).json({ error: 'userId and leadId required' })
  }
  
  try {
    // Get HubSpot settings
    const { data: settingsData } = await supabase
      .from('user_settings')
      .select('settings')
      .eq('user_id', userId)
      .single()
    
    if (!settingsData?.settings?.hubspot?.connected) {
      return res.status(400).json({ error: 'HubSpot not connected' })
    }
    
    const settings = settingsData.settings
    
    // Get the lead
    const { data: lead } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single()
    
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' })
    }
    
    if (lead.hubspot_id) {
      return res.status(400).json({ error: 'Lead already exists in HubSpot', hubspot_id: lead.hubspot_id })
    }
    
    const accessToken = await getValidToken(userId, settings)
    
    // Create Contact in HubSpot
    const hubspotContact = {
      properties: {
        firstname: lead.first_name || '',
        lastname: lead.last_name || lead.email.split('@')[0],
        email: lead.email,
        company: lead.company || '',
        jobtitle: lead.title || '',
        phone: lead.phone || '',
        website: lead.website || '',
        industry: lead.industry || '',
        hs_lead_status: 'NEW'
      }
    }
    
    const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(hubspotContact)
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      console.error('HubSpot create error:', errorData)
      return res.status(500).json({ error: 'Failed to create contact in HubSpot', details: errorData })
    }
    
    const result = await response.json()
    
    // Update ColdFlow lead with HubSpot ID
    await supabase
      .from('leads')
      .update({ 
        hubspot_id: result.id,
        source: lead.source || 'ColdFlow'
      })
      .eq('id', leadId)
    
    res.json({
      success: true,
      hubspot_id: result.id,
      message: 'Lead pushed to HubSpot'
    })
    
  } catch (err) {
    console.error('HubSpot push error:', err)
    res.status(500).json({ error: err.message })
  }
}
