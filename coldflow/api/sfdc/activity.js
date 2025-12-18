// Salesforce Activity Logger
// Creates Task records in Salesforce for email activities

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

// Refresh token helper
async function getValidToken(userId, settings) {
  // Try existing token first
  const testUrl = `${settings.sfdc.instance_url}/services/data/v59.0/limits`
  const testResponse = await fetch(testUrl, {
    headers: { 'Authorization': `Bearer ${settings.sfdc.access_token}` }
  })
  
  if (testResponse.ok) {
    return settings.sfdc.access_token
  }
  
  // Refresh if needed
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
  
  const { 
    userId, 
    leadId,        // ColdFlow lead ID
    activityType,  // 'email_sent', 'email_opened', 'email_clicked', 'email_replied'
    subject,
    description 
  } = req.body
  
  if (!userId || !leadId || !activityType) {
    return res.status(400).json({ error: 'userId, leadId, and activityType required' })
  }
  
  try {
    // Get user's SFDC settings
    const { data: settingsData } = await supabase
      .from('user_settings')
      .select('settings')
      .eq('user_id', userId)
      .single()
    
    if (!settingsData?.settings?.sfdc?.connected) {
      // SFDC not connected - silently skip
      return res.json({ success: true, logged: false, reason: 'sfdc_not_connected' })
    }
    
    const settings = settingsData.settings
    
    // Get the lead to find SFDC ID
    const { data: lead } = await supabase
      .from('leads')
      .select('sfdc_id, sfdc_type, email, first_name, last_name')
      .eq('id', leadId)
      .single()
    
    if (!lead?.sfdc_id) {
      // Lead doesn't have SFDC link - silently skip
      return res.json({ success: true, logged: false, reason: 'no_sfdc_link' })
    }
    
    // Get valid access token
    const accessToken = await getValidToken(userId, settings)
    
    // Determine WhoId field based on SFDC object type
    const whoIdField = lead.sfdc_type === 'Contact' ? 'WhoId' : 'WhoId' // Both use WhoId for Tasks
    
    // Map activity type to Task status and subject
    const activityMap = {
      email_sent: { status: 'Completed', type: 'Email', prefix: 'Email Sent:' },
      email_opened: { status: 'Completed', type: 'Email', prefix: 'Email Opened:' },
      email_clicked: { status: 'Completed', type: 'Email', prefix: 'Link Clicked:' },
      email_replied: { status: 'Completed', type: 'Email', prefix: 'Reply Received:' },
      task_created: { status: 'Not Started', type: 'Call', prefix: '' }  // Action task - not completed
    }
    
    const mapping = activityMap[activityType] || { status: 'Completed', type: 'Other', prefix: 'Activity:' }
    
    // For task_created, use the subject directly without prefix
    const taskSubject = activityType === 'task_created' 
      ? (subject || 'Follow up').substring(0, 255)
      : `${mapping.prefix} ${subject || '(No Subject)'}`.substring(0, 255)
    
    // Create Task in Salesforce
    const taskData = {
      Subject: taskSubject,
      Status: mapping.status,
      Priority: activityType === 'task_created' ? (req.body.priority || 'Normal') : 'Normal',
      Type: mapping.type,
      Description: description || `${activityType.replace(/_/g, ' ')} via ColdFlow`,
      ActivityDate: new Date().toISOString().split('T')[0],
      [whoIdField]: lead.sfdc_id
    }
    
    const createUrl = `${settings.sfdc.instance_url}/services/data/v59.0/sobjects/Task`
    
    const response = await fetch(createUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(taskData)
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('SFDC Task create error:', errorText)
      // Don't fail the request - SFDC logging is secondary
      return res.json({ success: true, logged: false, error: errorText })
    }
    
    const result = await response.json()
    
    res.json({
      success: true,
      logged: true,
      taskId: result.id
    })
    
  } catch (err) {
    console.error('SFDC activity log error:', err)
    // Don't fail - SFDC logging should not block main flow
    res.json({ success: true, logged: false, error: err.message })
  }
}
