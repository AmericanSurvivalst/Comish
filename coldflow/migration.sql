-- MIGRATION: Add campaign functionality to sequences table
-- Run this in Supabase SQL Editor

-- Add new columns to sequences table
ALTER TABLE sequences ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft';
ALTER TABLE sequences ADD COLUMN IF NOT EXISTS lead_ids JSONB DEFAULT '[]';
ALTER TABLE sequences ADD COLUMN IF NOT EXISTS tag_filter UUID;
ALTER TABLE sequences ADD COLUMN IF NOT EXISTS stats JSONB DEFAULT '{"sent":0,"opened":0,"clicked":0,"replied":0}';
ALTER TABLE sequences ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ;

-- Set default status for existing sequences
UPDATE sequences SET status = 'draft' WHERE status IS NULL;
UPDATE sequences SET lead_ids = '[]' WHERE lead_ids IS NULL;
UPDATE sequences SET stats = '{"sent":0,"opened":0,"clicked":0,"replied":0}' WHERE stats IS NULL;

-- Index for active sequences
CREATE INDEX IF NOT EXISTS idx_sequences_status ON sequences(status) WHERE status = 'active';

-- SALESFORCE INTEGRATION
-- Add Salesforce tracking fields to leads
ALTER TABLE leads ADD COLUMN IF NOT EXISTS sfdc_id TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS sfdc_type TEXT; -- 'Lead' or 'Contact'
ALTER TABLE leads ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'manual';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS industry TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS website TEXT;

-- Index for SFDC lookups
CREATE INDEX IF NOT EXISTS idx_leads_sfdc_id ON leads(sfdc_id) WHERE sfdc_id IS NOT NULL;

-- HUBSPOT INTEGRATION
ALTER TABLE leads ADD COLUMN IF NOT EXISTS hubspot_id TEXT;
CREATE INDEX IF NOT EXISTS idx_leads_hubspot_id ON leads(hubspot_id) WHERE hubspot_id IS NOT NULL;

-- Create user_settings table if not exists (for storing OAuth tokens)
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS on user_settings
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own settings
CREATE POLICY IF NOT EXISTS "Users can view own settings" ON user_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert own settings" ON user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update own settings" ON user_settings
  FOR UPDATE USING (auth.uid() = user_id);
