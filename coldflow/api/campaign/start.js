// Start a sequence - creates email queue entries for all leads
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Support both sequenceId (new) and campaignId (legacy)
    const { sequenceId, campaignId, userId } = req.body
    const seqId = sequenceId || campaignId

    if (!seqId || !userId) {
      return res.status(400).json({ error: 'Missing sequenceId or userId' })
    }

    // Get sequence directly
    const { data: sequence, error: seqError } = await supabase
      .from('sequences')
      .select('*')
      .eq('id', seqId)
      .eq('user_id', userId)
      .single()

    if (seqError || !sequence) {
      return res.status(404).json({ error: 'Sequence not found' })
    }

    if (!sequence.steps?.length) {
      return res.status(400).json({ error: 'Sequence has no steps' })
    }

    // Get leads for this sequence - either by lead_ids or tag_filter
    let leads = []
    
    if (sequence.lead_ids && sequence.lead_ids.length > 0) {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', userId)
        .in('id', sequence.lead_ids)
      if (error) return res.status(500).json({ error: 'Failed to fetch leads' })
      leads = data || []
    } else if (sequence.tag_filter) {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', userId)
        .contains('tags', [sequence.tag_filter])
      if (error) return res.status(500).json({ error: 'Failed to fetch leads' })
      leads = data || []
    }

    if (leads.length === 0) {
      return res.status(400).json({ error: 'No leads attached to this sequence' })
    }

    const steps = sequence.steps || []
    const now = new Date()
    const queueEntries = []
    const progressEntries = []

    // Calculate send times for each lead and step
    for (const lead of leads) {
      // Create progress entry
      progressEntries.push({
        user_id: userId,
        campaign_id: seqId, // Using sequence ID
        lead_id: lead.id,
        current_step: 0,
        status: 'active'
      })

      // Create queue entries for each step
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i]
        
        // Calculate scheduled time
        // Day 1 = today, Day 2 = tomorrow, etc.
        const scheduledDate = new Date(now)
        scheduledDate.setDate(scheduledDate.getDate() + (step.day - 1))
        
        // Set the time
        if (step.time) {
          const [hours, minutes] = step.time.split(':')
          scheduledDate.setHours(parseInt(hours), parseInt(minutes), 0, 0)
        } else {
          scheduledDate.setHours(9, 0, 0, 0) // Default 9 AM
        }

        // If scheduled time is in the past for day 1, send in 1 minute
        if (scheduledDate < now && step.day === 1) {
          scheduledDate.setTime(now.getTime() + 60000)
        }

        queueEntries.push({
          user_id: userId,
          campaign_id: seqId, // Using sequence ID
          lead_id: lead.id,
          step_index: i,
          scheduled_for: scheduledDate.toISOString(),
          status: 'pending'
        })
      }
    }

    // Insert progress entries (upsert to handle reruns)
    const { error: progressError } = await supabase
      .from('lead_progress')
      .upsert(progressEntries, { onConflict: 'campaign_id,lead_id' })

    if (progressError) {
      console.error('Progress error:', progressError)
      // Continue anyway
    }

    // Delete any existing queue entries for this sequence (in case of restart)
    await supabase
      .from('email_queue')
      .delete()
      .eq('campaign_id', seqId)
      .eq('status', 'pending')

    // Insert queue entries in batches
    const batchSize = 100
    for (let i = 0; i < queueEntries.length; i += batchSize) {
      const batch = queueEntries.slice(i, i + batchSize)
      const { error: queueError } = await supabase
        .from('email_queue')
        .insert(batch)
      
      if (queueError) {
        console.error('Queue insert error:', queueError)
      }
    }

    // Update sequence status
    await supabase
      .from('sequences')
      .update({ 
        status: 'active',
        started_at: now.toISOString(),
        stats: { sent: 0, opened: 0, clicked: 0, replied: 0 }
      })
      .eq('id', seqId)

    return res.status(200).json({
      success: true,
      message: `Sequence started with ${leads.length} leads and ${queueEntries.length} scheduled emails`,
      leads: leads.length,
      emails: queueEntries.length,
      steps: steps.length
    })

  } catch (error) {
    console.error('Start sequence error:', error)
    return res.status(500).json({ error: error.message })
  }
}
