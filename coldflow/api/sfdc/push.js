// Push a ColdFlow lead TO Salesforce as a new Lead
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

async function getValidToken(userId, settings) {
  const testUrl = `${settings.sfdc.instance_url}/services/data/v59.0/limits`
  const testResponse = await fetch(testUrl, {
    headers: { 'Authorization': `Bearer ${settings.sfdc.access_token}` }
  })
  
  if (testResponse.ok) {
    return settings.sfdc.access_token
  }
  
  // Refresh
  const baseUrl = process.env.SFDC_SANDBOX === 'true'
    ? 'https://test.salesforce.com'
    : 'https://login.salesforce.com'
  
  const response = await fetch(`${baseUrl}/services/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: settings.sfdc.refresh_token,
      client_id: process.env.SFDC_CLIENT_ID,
      client_secret: process.env.SFDC_CLIENT_SECRET
    }).toString()
  })
  
  if (!response.ok) throw new Error('Token refresh failed')
  
  const tokens = await response.json()
  
  await supabase
    .from('user_settings')
    .update({
      settings: {
        ...settings,
        sfdc: { ...settings.sfdc, access_token: tokens.access_token }
      }
    })
    .eq('user_id', userId)
  
  return tokens.access_token
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
    // Get SFDC settings
    const { data: settingsData } = await supabase
      .from('user_settings')
      .select('settings')
      .eq('user_id', userId)
      .single()
    
    if (!settingsData?.settings?.sfdc?.connected) {
      return res.status(400).json({ error: 'Salesforce not connected' })
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
    
    if (lead.sfdc_id) {
      return res.status(400).json({ error: 'Lead already exists in Salesforce', sfdc_id: lead.sfdc_id })
    }
    
    const accessToken = await getValidToken(userId, settings)
    
    // Create Lead in Salesforce
    const sfdcLead = {
      FirstName: lead.first_name || '',
      LastName: lead.last_name || lead.email.split('@')[0], // SFDC requires LastName
      Email: lead.email,
      Company: lead.company || '[Not Provided]', // SFDC requires Company
      Title: lead.title || '',
      Phone: lead.phone || '',
      Website: lead.website || '',
      Industry: lead.industry || '',
      LeadSource: 'ColdFlow',
      Description: `Imported from ColdFlow on ${new Date().toISOString()}`
    }
    
    const createUrl = `${settings.sfdc.instance_url}/services/data/v59.0/sobjects/Lead`
    
    const response = await fetch(createUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sfdcLead)
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      console.error('SFDC create error:', errorData)
      return res.status(500).json({ error: 'Failed to create lead in Salesforce', details: errorData })
    }
    
    const result = await response.json()
    
    // Update ColdFlow lead with SFDC ID
    await supabase
      .from('leads')
      .update({ 
        sfdc_id: result.id, 
        sfdc_type: 'Lead',
        source: lead.source || 'ColdFlow'
      })
      .eq('id', leadId)
    
    res.json({
      success: true,
      sfdc_id: result.id,
      message: 'Lead pushed to Salesforce'
    })
    
  } catch (err) {
    console.error('SFDC push error:', err)
    res.status(500).json({ error: err.message })
  }
}
