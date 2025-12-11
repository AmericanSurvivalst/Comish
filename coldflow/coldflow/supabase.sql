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

CREATE TABLE IF NOT EXISTS campaigns (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, name TEXT NOT NULL, sequence_id UUID REFERENCES sequences(id) ON DELETE SET NULL, tag_filter UUID, status TEXT DEFAULT 'draft', stats JSONB DEFAULT '{"sent":0,"opened":0,"clicked":0,"replied":0}', created_at TIMESTAMPTZ DEFAULT NOW());
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "campaigns_policy" ON campaigns FOR ALL USING (auth.uid() = user_id);
