// Campaign processor - processes email queue and sends scheduled emails
// Call via cron job every 5 minutes or use Vercel Cron
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY
)

// Log activity to Salesforce (non-blocking)
async function logToSFDC(baseUrl, userId, leadId, activityType, subject, description) {
  try {
    fetch(`${baseUrl}/api/sfdc/activity`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, leadId, activityType, subject, description })
    }).catch(() => {}) // Fire and forget
  } catch (e) {
    // Ignore - SFDC logging should never block email sending
  }
}

// Send email via Gmail API
async function sendGmail(accessToken, fromEmail, to, subject, htmlBody) {
  const boundary = 'boundary_' + Date.now()
  
  const emailParts = [
    `To: ${to}`,
    `From: ${fromEmail}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset=UTF-8',
    '',
    htmlBody.replace(/<[^>]*>/g, ''), // Strip HTML for plain text version
    '',
    `--${boundary}`,
    'Content-Type: text/html; charset=UTF-8',
    '',
    htmlBody,
    '',
    `--${boundary}--`
  ]
  
  const email = emailParts.join('\r\n')
  const encodedEmail = Buffer.from(email)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ raw: encodedEmail })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Gmail API error')
  }

  return await response.json()
}

// Wrap links for click tracking
function wrapLinks(html, baseUrl, campaignId, leadId, stepIndex, userId) {
  return html.replace(
    /href="(https?:\/\/[^"]+)"/g,
    (match, url) => {
      const trackUrl = `${baseUrl}/api/track/click?c=${campaignId}&l=${leadId}&s=${stepIndex}&u=${userId}&url=${encodeURIComponent(url)}`
      return `href="${trackUrl}"`
    }
  )
}

// Add tracking pixel
function addTrackingPixel(html, baseUrl, campaignId, leadId, stepIndex, userId) {
  const pixel = `<img src="${baseUrl}/api/track/open?c=${campaignId}&l=${leadId}&s=${stepIndex}&u=${userId}" width="1" height="1" style="display:none" />`
  
  // Add before closing body tag, or at end
  if (html.includes('</body>')) {
    return html.replace('</body>', `${pixel}</body>`)
  }
  return html + pixel
}

// Replace merge tags
function replaceMergeTags(text, lead) {
  return text
    .replace(/\{\{firstName\}\}/g, lead.first_name || '')
    .replace(/\{\{lastName\}\}/g, lead.last_name || '')
    .replace(/\{\{company\}\}/g, lead.company || '')
    .replace(/\{\{email\}\}/g, lead.email || '')
    .replace(/\{\{name\}\}/g, `${lead.first_name || ''} ${lead.last_name || ''}`.trim())
}

export default async function handler(req, res) {
  // Verify cron secret (optional security)
  const cronSecret = req.headers['authorization']
  if (process.env.CRON_SECRET && cronSecret !== `Bearer ${process.env.CRON_SECRET}`) {
    // Allow without secret for testing, but log warning
    console.warn('Cron secret mismatch or missing')
  }

  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : process.env.BASE_URL || 'http://localhost:3000'

  const results = {
    processed: 0,
    sent: 0,
    failed: 0,
    skipped: 0,
    errors: []
  }

  try {
    // Get pending emails that are due
    const now = new Date().toISOString()
    const { data: pendingEmails, error: queueError } = await supabase
      .from('email_queue')
      .select(`
        *,
        campaigns (*),
        leads (*)
      `)
      .eq('status', 'pending')
      .lte('scheduled_for', now)
      .limit(50) // Process in batches

    if (queueError) {
      throw queueError
    }

    if (!pendingEmails || pendingEmails.length === 0) {
      return res.status(200).json({ message: 'No pending emails', ...results })
    }

    // Group by user to batch token lookups
    const userIds = [...new Set(pendingEmails.map(e => e.user_id))]
    
    // Get Gmail tokens for all users
    const { data: tokens } = await supabase
      .from('gmail_tokens')
      .select('*')
      .in('user_id', userIds)
    
    const tokenMap = {}
    tokens?.forEach(t => { tokenMap[t.user_id] = t })

    // Get sequences directly (campaign_id field now stores sequence IDs)
    const sequenceIds = [...new Set(pendingEmails.map(e => e.campaign_id))]
    const { data: sequences } = await supabase
      .from('sequences')
      .select('*')
      .in('id', sequenceIds)
    
    const sequenceMap = {}
    sequences?.forEach(s => { sequenceMap[s.id] = s })

    // Process each email
    for (const email of pendingEmails) {
      results.processed++
      
      try {
        const token = tokenMap[email.user_id]
        const sequence = sequenceMap[email.campaign_id]
        const lead = email.leads
        
        if (!token || !token.access_token) {
          await supabase
            .from('email_queue')
            .update({ status: 'failed', error: 'Gmail not connected' })
            .eq('id', email.id)
          results.failed++
          results.errors.push({ id: email.id, error: 'Gmail not connected' })
          continue
        }

        // Check if token expired
        if (new Date(token.expires_at) < new Date()) {
          await supabase
            .from('email_queue')
            .update({ status: 'failed', error: 'Gmail token expired' })
            .eq('id', email.id)
          results.failed++
          results.errors.push({ id: email.id, error: 'Token expired' })
          continue
        }

        if (!sequence) {
          await supabase
            .from('email_queue')
            .update({ status: 'failed', error: 'Sequence not found' })
            .eq('id', email.id)
          results.failed++
          continue
        }

        const step = sequence.steps?.[email.step_index]
        
        if (!step) {
          await supabase
            .from('email_queue')
            .update({ status: 'skipped', error: 'Step not found' })
            .eq('id', email.id)
          results.skipped++
          continue
        }

        // Check conditions (if_opened, if_not_opened, etc.)
        if (step.condition && step.condition !== 'none') {
          const { data: progress } = await supabase
            .from('lead_progress')
            .select('*')
            .eq('campaign_id', email.campaign_id)
            .eq('lead_id', email.lead_id)
            .single()

          if (progress) {
            if (step.condition === 'if_opened' && !progress.opened) {
              await supabase
                .from('email_queue')
                .update({ status: 'skipped', error: 'Condition not met: not opened' })
                .eq('id', email.id)
              results.skipped++
              continue
            }
            if (step.condition === 'if_not_opened' && progress.opened) {
              await supabase
                .from('email_queue')
                .update({ status: 'skipped', error: 'Condition not met: was opened' })
                .eq('id', email.id)
              results.skipped++
              continue
            }
            if (step.condition === 'if_clicked' && !progress.clicked) {
              await supabase
                .from('email_queue')
                .update({ status: 'skipped', error: 'Condition not met: not clicked' })
                .eq('id', email.id)
              results.skipped++
              continue
            }
            if (step.condition === 'if_not_clicked' && progress.clicked) {
              await supabase
                .from('email_queue')
                .update({ status: 'skipped', error: 'Condition not met: was clicked' })
                .eq('id', email.id)
              results.skipped++
              continue
            }
            if (step.condition === 'if_replied' && !progress.replied) {
              await supabase
                .from('email_queue')
                .update({ status: 'skipped', error: 'Condition not met: not replied' })
                .eq('id', email.id)
              results.skipped++
              continue
            }
            if (step.condition === 'if_not_replied' && progress.replied) {
              await supabase
                .from('email_queue')
                .update({ status: 'skipped', error: 'Condition not met: was replied' })
                .eq('id', email.id)
              results.skipped++
              continue
            }
          }
        }

        // Prepare content with merge tags
        let subject = replaceMergeTags(step.subject, lead)
        let body = replaceMergeTags(step.body || '', lead)
        
        // Handle different step types
        if (step.type === 'task') {
          // CREATE TASK IN SALESFORCE
          try {
            const taskRes = await fetch(`${baseUrl}/api/sfdc/activity`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: email.user_id,
                leadId: email.lead_id,
                activityType: 'task_created',
                subject: subject,
                description: body || `Task from ColdFlow sequence: ${sequence.name}`
              })
            })
            
            const taskResult = await taskRes.json()
            
            if (taskResult.logged) {
              // Task created successfully
              await supabase
                .from('email_queue')
                .update({ status: 'sent', sent_at: new Date().toISOString() })
                .eq('id', email.id)
              
              // Update lead progress
              await supabase
                .from('lead_progress')
                .update({ 
                  current_step: email.step_index + 1,
                  last_sent_at: new Date().toISOString()
                })
                .eq('campaign_id', email.campaign_id)
                .eq('lead_id', email.lead_id)
              
              results.sent++
            } else {
              // Task creation failed (maybe no SFDC connection)
              await supabase
                .from('email_queue')
                .update({ status: 'failed', error: taskResult.reason || 'Failed to create SFDC task' })
                .eq('id', email.id)
              results.failed++
              results.errors.push({ id: email.id, error: 'SFDC task creation failed' })
            }
          } catch (taskErr) {
            await supabase
              .from('email_queue')
              .update({ status: 'failed', error: taskErr.message })
              .eq('id', email.id)
            results.failed++
            results.errors.push({ id: email.id, error: taskErr.message })
          }
          continue // Skip email sending
        }
        
        // SEND EMAIL (default behavior)
        // Convert plain text to HTML if needed
        if (!body.includes('<')) {
          body = body.split('\n').map(line => `<p>${line || '&nbsp;'}</p>`).join('')
        }
        
        // Add tracking
        body = wrapLinks(body, baseUrl, email.campaign_id, email.lead_id, email.step_index, email.user_id)
        body = addTrackingPixel(body, baseUrl, email.campaign_id, email.lead_id, email.step_index, email.user_id)

        // Send the email
        await sendGmail(token.access_token, token.email, lead.email, subject, body)

        // Update queue status
        await supabase
          .from('email_queue')
          .update({ status: 'sent', sent_at: new Date().toISOString() })
          .eq('id', email.id)

        // Update lead progress
        await supabase
          .from('lead_progress')
          .update({ 
            current_step: email.step_index + 1,
            last_sent_at: new Date().toISOString()
          })
          .eq('campaign_id', email.campaign_id)
          .eq('lead_id', email.lead_id)

        // Update sequence stats
        const stats = sequence.stats || {}
        await supabase
          .from('sequences')
          .update({ stats: { ...stats, sent: (stats.sent || 0) + 1 } })
          .eq('id', sequence.id)

        // Update sequence step stats
        const updatedSteps = [...(sequence.steps || [])]
        if (updatedSteps[email.step_index]) {
          updatedSteps[email.step_index].sent = (updatedSteps[email.step_index].sent || 0) + 1
        }
        await supabase
          .from('sequences')
          .update({ steps: updatedSteps })
          .eq('id', sequence.id)

        // Log to Salesforce (non-blocking)
        logToSFDC(baseUrl, email.user_id, email.lead_id, 'email_sent', subject, body.replace(/<[^>]*>/g, '').substring(0, 500))

        results.sent++

      } catch (error) {
        console.error('Error processing email:', email.id, error)
        await supabase
          .from('email_queue')
          .update({ status: 'failed', error: error.message })
          .eq('id', email.id)
        results.failed++
        results.errors.push({ id: email.id, error: error.message })
      }
    }

    return res.status(200).json({ 
      message: 'Processing complete',
      ...results
    })

  } catch (error) {
    console.error('Sequence processor error:', error)
    return res.status(500).json({ error: error.message, ...results })
  }
}
