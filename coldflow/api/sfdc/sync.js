// Salesforce Sync - Import Leads/Contacts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

// Refresh access token if expired
async function refreshToken(userId, settings) {
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
  
  if (!response.ok) {
    throw new Error('Token refresh failed')
  }
  
  const tokens = await response.json()
  
  // Update stored token
  const newSettings = {
    ...settings,
    sfdc: {
      ...settings.sfdc,
      access_token: tokens.access_token,
      ...(tokens.refresh_token && { refresh_token: tokens.refresh_token })
    }
  }
  
  await supabase
    .from('user_settings')
    .update({ settings: newSettings })
    .eq('user_id', userId)
  
  return tokens.access_token
}

// Make SFDC API call with auto-refresh
async function sfdcFetch(url, accessToken, userId, settings) {
  let response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  })
  
  // If unauthorized, try refresh
  if (response.status === 401) {
    const newToken = await refreshToken(userId, settings)
    response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${newToken}` }
    })
  }
  
  return response
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  
  const { userId, objectType = 'Lead', filter } = req.body
  
  if (!userId) {
    return res.status(400).json({ error: 'userId required' })
  }
  
  try {
    // Get user's SFDC settings
    const { data: settingsData, error: settingsError } = await supabase
      .from('user_settings')
      .select('settings')
      .eq('user_id', userId)
      .single()
    
    if (settingsError || !settingsData?.settings?.sfdc?.connected) {
      return res.status(400).json({ error: 'Salesforce not connected' })
    }
    
    const settings = settingsData.settings
    const sfdc = settings.sfdc
    
    // Build SOQL query
    let soql
    if (objectType === 'Lead') {
      soql = `
        SELECT Id, FirstName, LastName, Email, Company, Title, Phone, 
               LeadSource, Status, Industry, Website, Description,
               Street, City, State, PostalCode, Country
        FROM Lead 
        WHERE Email != null
        ${filter ? `AND ${filter}` : ''}
        ORDER BY CreatedDate DESC
        LIMIT 200
      `.trim().replace(/\s+/g, ' ')
    } else if (objectType === 'Contact') {
      soql = `
        SELECT Id, FirstName, LastName, Email, Account.Name, Title, Phone,
               LeadSource, Department, MailingStreet, MailingCity, 
               MailingState, MailingPostalCode, MailingCountry
        FROM Contact
        WHERE Email != null
        ${filter ? `AND ${filter}` : ''}
        ORDER BY CreatedDate DESC
        LIMIT 200
      `.trim().replace(/\s+/g, ' ')
    } else {
      return res.status(400).json({ error: 'Invalid objectType. Use Lead or Contact' })
    }
    
    const queryUrl = `${sfdc.instance_url}/services/data/v59.0/query?q=${encodeURIComponent(soql)}`
    
    const response = await sfdcFetch(queryUrl, sfdc.access_token, userId, settings)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('SFDC query error:', errorText)
      return res.status(500).json({ error: 'Salesforce query failed' })
    }
    
    const data = await response.json()
    const records = data.records || []
    
    // Transform to ColdFlow lead format
    const leads = records.map(record => ({
      sfdc_id: record.Id,
      sfdc_type: objectType,
      first_name: record.FirstName || '',
      last_name: record.LastName || '',
      email: record.Email,
      company: objectType === 'Contact' ? record.Account?.Name : record.Company,
      title: record.Title,
      phone: record.Phone,
      source: record.LeadSource || 'Salesforce',
      industry: record.Industry,
      website: record.Website,
      status: 'new'
    })).filter(l => l.email) // Only keep records with email
    
    // Get existing leads to check for duplicates
    const { data: existingLeads } = await supabase
      .from('leads')
      .select('email, sfdc_id')
      .eq('user_id', userId)
    
    const existingEmails = new Set((existingLeads || []).map(l => l.email?.toLowerCase()))
    const existingSfdcIds = new Set((existingLeads || []).map(l => l.sfdc_id).filter(Boolean))
    
    // Filter out duplicates
    const newLeads = leads.filter(l => 
      !existingEmails.has(l.email?.toLowerCase()) && 
      !existingSfdcIds.has(l.sfdc_id)
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
      total: records.length,
      imported: inserted,
      skipped: records.length - inserted,
      message: `Imported ${inserted} ${objectType}s from Salesforce`
    })
    
  } catch (err) {
    console.error('SFDC sync error:', err)
    res.status(500).json({ error: err.message })
  }
}
