// Click tracking endpoint - records link clicks and redirects
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY
)

// Log activity to Salesforce (non-blocking)
async function logToSFDC(userId, leadId, activityType, subject, description) {
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    
    fetch(`${baseUrl}/api/sfdc/activity`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, leadId, activityType, subject, description })
    }).catch(() => {}) // Fire and forget
  } catch (e) {
    // Ignore - SFDC logging should never block tracking
  }
}

export default async function handler(req, res) {
  try {
    const { c, l, s, u, url, subj } = req.query // sequence_id (c), lead_id, step_index, user_id, destination url, subject

    if (!url) {
      return res.status(400).send('Missing URL')
    }

    // Decode the destination URL
    const destination = decodeURIComponent(url)

    if (c && l && u) {
      // Record the click event
      await supabase.from('tracking_events').insert({
        user_id: u,
        campaign_id: c, // This field stores sequence_id now
        lead_id: l,
        step_index: parseInt(s) || 0,
        event_type: 'click',
        link_url: destination,
        ip_address: req.headers['x-forwarded-for'] || req.socket?.remoteAddress,
        user_agent: req.headers['user-agent']
      })

      // Update lead progress
      await supabase
        .from('lead_progress')
        .update({ clicked: true })
        .eq('campaign_id', c)
        .eq('lead_id', l)

      // Update sequence stats
      const { data: sequence } = await supabase
        .from('sequences')
        .select('stats')
        .eq('id', c)
        .single()

      if (sequence) {
        const stats = sequence.stats || {}
        await supabase
          .from('sequences')
          .update({ stats: { ...stats, clicked: (stats.clicked || 0) + 1 } })
          .eq('id', c)
      }
      
      // Log to Salesforce (non-blocking)
      logToSFDC(u, l, 'email_clicked', subj || 'Email', `Clicked link: ${destination}`)
    }

    // Redirect to the actual destination
    return res.redirect(302, destination)

  } catch (error) {
    console.error('Click tracking error:', error)
    // If there's an error, try to redirect anyway
    const url = req.query.url
    if (url) {
      return res.redirect(302, decodeURIComponent(url))
    }
    return res.status(500).send('Error')
  }
}
