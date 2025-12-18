// Tracking pixel endpoint - records email opens
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY
)

// 1x1 transparent GIF
const PIXEL = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64')

// Log activity to Salesforce (non-blocking)
async function logToSFDC(userId, leadId, activityType, subject) {
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    
    fetch(`${baseUrl}/api/sfdc/activity`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, leadId, activityType, subject })
    }).catch(() => {}) // Fire and forget
  } catch (e) {
    // Ignore - SFDC logging should never block tracking
  }
}

export default async function handler(req, res) {
  // Set headers for pixel response
  res.setHeader('Content-Type', 'image/gif')
  res.setHeader('Content-Length', PIXEL.length)
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Expires', '0')

  try {
    const { c, l, s, u, subj } = req.query // sequence_id (c), lead_id, step_index, user_id, subject

    if (c && l && u) {
      // Record the open event
      await supabase.from('tracking_events').insert({
        user_id: u,
        campaign_id: c, // This field stores sequence_id now
        lead_id: l,
        step_index: parseInt(s) || 0,
        event_type: 'open',
        ip_address: req.headers['x-forwarded-for'] || req.socket?.remoteAddress,
        user_agent: req.headers['user-agent']
      })

      // Update lead progress
      await supabase
        .from('lead_progress')
        .update({ opened: true })
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
          .update({ stats: { ...stats, opened: (stats.opened || 0) + 1 } })
          .eq('id', c)
      }
      
      // Log to Salesforce (non-blocking)
      logToSFDC(u, l, 'email_opened', subj || 'Email')
    }
  } catch (error) {
    console.error('Tracking error:', error)
    // Don't fail - still return pixel
  }

  // Always return the pixel
  return res.status(200).send(PIXEL)
}
