-- Run in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS tags (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, name TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW());
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tags_policy" ON tags FOR ALL USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS sequences (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, name TEXT NOT NULL, steps JSONB DEFAULT '[]', created_at TIMESTAMPTZ DEFAULT NOW());
ALTER TABLE sequences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sequences_policy" ON sequences FOR ALL USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS leads (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, first_name TEXT, last_name TEXT, email TEXT NOT NULL, company TEXT, tags JSONB DEFAULT '[]', status TEXT DEFAULT 'new', created_at TIMESTAMPTZ DEFAULT NOW());
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "leads_policy" ON leads FOR ALL USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS campaigns (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, name TEXT NOT NULL, sequence_id UUID REFERENCES sequences(id) ON DELETE SET NULL, tag_filter UUID, status TEXT DEFAULT 'draft', stats JSONB DEFAULT '{"sent":0,"opened":0,"clicked":0,"replied":0}', started_at TIMESTAMPTZ, created_at TIMESTAMPTZ DEFAULT NOW());
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "campaigns_policy" ON campaigns FOR ALL USING (auth.uid() = user_id);

-- Email queue for scheduled sends
CREATE TABLE IF NOT EXISTS email_queue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  step_index INTEGER NOT NULL,
  scheduled_for TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, sent, failed, skipped
  sent_at TIMESTAMPTZ,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE email_queue ENABLE ROW LEVEL SECURITY;
CREATE POLICY "email_queue_policy" ON email_queue FOR ALL USING (auth.uid() = user_id);
CREATE INDEX idx_email_queue_scheduled ON email_queue(scheduled_for) WHERE status = 'pending';
CREATE INDEX idx_email_queue_campaign ON email_queue(campaign_id);

-- Tracking events (opens, clicks, replies)
CREATE TABLE IF NOT EXISTS tracking_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  step_index INTEGER,
  event_type TEXT NOT NULL, -- open, click, reply
  link_url TEXT, -- for clicks
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE tracking_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tracking_events_policy" ON tracking_events FOR ALL USING (auth.uid() = user_id);
-- Public insert for tracking pixel/links (no auth required)
CREATE POLICY "tracking_events_insert" ON tracking_events FOR INSERT WITH CHECK (true);
CREATE INDEX idx_tracking_campaign ON tracking_events(campaign_id);
CREATE INDEX idx_tracking_lead ON tracking_events(lead_id);

-- Lead campaign progress (tracks where each lead is in each campaign)
CREATE TABLE IF NOT EXISTS lead_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  current_step INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active', -- active, completed, paused, unsubscribed
  last_sent_at TIMESTAMPTZ,
  opened BOOLEAN DEFAULT false,
  clicked BOOLEAN DEFAULT false,
  replied BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(campaign_id, lead_id)
);
ALTER TABLE lead_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lead_progress_policy" ON lead_progress FOR ALL USING (auth.uid() = user_id);
CREATE INDEX idx_progress_campaign ON lead_progress(campaign_id);

-- User Gmail tokens (separate from settings for security)
CREATE TABLE IF NOT EXISTS gmail_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE gmail_tokens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "gmail_tokens_policy" ON gmail_tokens FOR ALL USING (auth.uid() = user_id);
