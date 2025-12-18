// HubSpot Sync - Import Contacts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

// Refresh access token if expired
async function refreshToken(userId, settings) {
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
  
  if (!response.ok) {
    throw new Error('Token refresh failed')
  }
  
  const tokens = await response.json()
  
  // Update stored tokens
  const newSettings = {
    ...settings,
    hubspot: {
      ...settings.hubspot,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString()
    }
  }
  
  await supabase
    .from('user_settings')
    .update({ settings: newSettings })
    .eq('user_id', userId)
  
  return tokens.access_token
}

// Get valid token (refresh if needed)
async function getValidToken(userId, settings) {
  const expiresAt = new Date(settings.hubspot.expires_at)
  if (expiresAt < new Date()) {
    return await refreshToken(userId, settings)
  }
  return settings.hubspot.access_token
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  
  const { userId, filter } = req.body
  
  if (!userId) {
    return res.status(400).json({ error: 'userId required' })
  }
  
  try {
    // Get user's HubSpot settings
    const { data: settingsData, error: settingsError } = await supabase
      .from('user_settings')
      .select('settings')
      .eq('user_id', userId)
      .single()
    
    if (settingsError || !settingsData?.settings?.hubspot?.connected) {
      return res.status(400).json({ error: 'HubSpot not connected' })
    }
    
    const settings = settingsData.settings
    const accessToken = await getValidToken(userId, settings)
    
    // Fetch contacts from HubSpot
    const properties = ['firstname', 'lastname', 'email', 'company', 'jobtitle', 'phone', 'website', 'industry']
    
    const searchBody = {
      filterGroups: [{
        filters: [{
          propertyName: 'email',
          operator: 'HAS_PROPERTY'
        }]
      }],
      properties: properties,
      limit: 100
    }
    
    const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(searchBody)
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('HubSpot search error:', errorText)
      return res.status(500).json({ error: 'HubSpot search failed' })
    }
    
    const data = await response.json()
    const contacts = data.results || []
    
    // Transform to ColdFlow lead format
    const leads = contacts.map(contact => ({
      hubspot_id: contact.id,
      first_name: contact.properties.firstname || '',
      last_name: contact.properties.lastname || '',
      email: contact.properties.email,
      company: contact.properties.company || '',
      title: contact.properties.jobtitle || '',
      phone: contact.properties.phone || '',
      website: contact.properties.website || '',
      industry: contact.properties.industry || '',
      source: 'HubSpot',
      status: 'new'
    })).filter(l => l.email)
    
    // Get existing leads to check for duplicates
    const { data: existingLeads } = await supabase
      .from('leads')
      .select('email, hubspot_id')
      .eq('user_id', userId)
    
    const existingEmails = new Set((existingLeads || []).map(l => l.email?.toLowerCase()))
    const existingHubspotIds = new Set((existingLeads || []).map(l => l.hubspot_id).filter(Boolean))
    
    // Filter out duplicates
    const newLeads = leads.filter(l => 
      !existingEmails.has(l.email?.toLowerCase()) && 
      !existingHubspotIds.has(l.hubspot_id)
    )
    
    // Insert new leads
    let inserted = 0
    if (newLeads.length > 0) {
      const leadsToInsert = newLeads.map(l => ({
        ...l,
        user_id: userId,
        created_at: new Date().toISOString()
      }))
      
      const { data: insertedData, error: insertError } = await supabase
        .from('leads')
        .insert(leadsToInsert)
        .select()
      
      if (insertError) {
        console.error('Lead insert error:', insertError)
      } else {
        inserted = insertedData?.length || 0
      }
    }
    
    res.json({
      success: true,
      total: contacts.length,
      imported: inserted,
      skipped: contacts.length - inserted,
      message: `Imported ${inserted} contacts from HubSpot`
    })
    
  } catch (err) {
    console.error('HubSpot sync error:', err)
    res.status(500).json({ error: err.message })
  }
}
