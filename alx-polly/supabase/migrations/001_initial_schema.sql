-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE poll_status AS ENUM ('active', 'expired', 'draft');
CREATE TYPE vote_type AS ENUM ('single', 'multiple');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Polls table
CREATE TABLE public.polls (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status poll_status DEFAULT 'active',
  is_public BOOLEAN DEFAULT true,
  allow_multiple_votes BOOLEAN DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT polls_title_length CHECK (char_length(title) >= 3),
  CONSTRAINT polls_description_length CHECK (char_length(description) <= 1000)
);

-- Poll options table
CREATE TABLE public.poll_options (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  poll_id UUID REFERENCES public.polls(id) ON DELETE CASCADE NOT NULL,
  text VARCHAR(100) NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT poll_options_text_length CHECK (char_length(text) >= 1),
  CONSTRAINT poll_options_unique_order UNIQUE (poll_id, order_index)
);

-- Votes table
CREATE TABLE public.votes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  poll_id UUID REFERENCES public.polls(id) ON DELETE CASCADE NOT NULL,
  option_id UUID REFERENCES public.poll_options(id) ON DELETE CASCADE NOT NULL,
  voter_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT votes_unique_vote_per_option UNIQUE (poll_id, option_id, voter_id)
);

-- Create indexes for better performance
CREATE INDEX idx_polls_author_id ON public.polls(author_id);
CREATE INDEX idx_polls_status ON public.polls(status);
CREATE INDEX idx_polls_is_public ON public.polls(is_public);
CREATE INDEX idx_polls_created_at ON public.polls(created_at DESC);
CREATE INDEX idx_polls_expires_at ON public.polls(expires_at);

CREATE INDEX idx_poll_options_poll_id ON public.poll_options(poll_id);
CREATE INDEX idx_poll_options_order ON public.poll_options(poll_id, order_index);

CREATE INDEX idx_votes_poll_id ON public.votes(poll_id);
CREATE INDEX idx_votes_option_id ON public.votes(option_id);
CREATE INDEX idx_votes_voter_id ON public.votes(voter_id);
CREATE INDEX idx_votes_created_at ON public.votes(created_at DESC);

-- Create a view for poll statistics
CREATE VIEW public.poll_stats AS
SELECT 
  p.id,
  p.title,
  p.description,
  p.author_id,
  p.status,
  p.is_public,
  p.allow_multiple_votes,
  p.expires_at,
  p.created_at,
  p.updated_at,
  COUNT(DISTINCT v.id) as total_votes,
  COUNT(DISTINCT po.id) as option_count,
  CASE 
    WHEN p.expires_at IS NULL THEN 'active'
    WHEN p.expires_at > NOW() THEN 'active'
    ELSE 'expired'
  END as computed_status
FROM public.polls p
LEFT JOIN public.poll_options po ON p.id = po.poll_id
LEFT JOIN public.votes v ON p.id = v.poll_id
GROUP BY p.id, p.title, p.description, p.author_id, p.status, p.is_public, p.allow_multiple_votes, p.expires_at, p.created_at, p.updated_at;

-- Create a view for option statistics
CREATE VIEW public.option_stats AS
SELECT 
  po.id,
  po.poll_id,
  po.text,
  po.order_index,
  po.created_at,
  COUNT(v.id) as vote_count,
  CASE 
    WHEN (SELECT COUNT(DISTINCT v2.id) FROM public.votes v2 WHERE v2.poll_id = po.poll_id) = 0 
    THEN 0 
    ELSE ROUND(
      (COUNT(v.id)::DECIMAL / NULLIF((SELECT COUNT(DISTINCT v2.id) FROM public.votes v2 WHERE v2.poll_id = po.poll_id), 0)) * 100, 
      2
    )
  END as vote_percentage
FROM public.poll_options po
LEFT JOIN public.votes v ON po.id = v.option_id
GROUP BY po.id, po.poll_id, po.text, po.order_index, po.created_at;

-- Row Level Security (RLS) policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Polls policies
CREATE POLICY "Anyone can view public polls" ON public.polls
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view own polls" ON public.polls
  FOR SELECT USING (auth.uid() = author_id);

CREATE POLICY "Authenticated users can create polls" ON public.polls
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own polls" ON public.polls
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own polls" ON public.polls
  FOR DELETE USING (auth.uid() = author_id);

-- Poll options policies
CREATE POLICY "Anyone can view poll options for public polls" ON public.poll_options
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.polls p 
      WHERE p.id = poll_id AND p.is_public = true
    )
  );

CREATE POLICY "Users can view poll options for own polls" ON public.poll_options
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.polls p 
      WHERE p.id = poll_id AND p.author_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage options for own polls" ON public.poll_options
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.polls p 
      WHERE p.id = poll_id AND p.author_id = auth.uid()
    )
  );

-- Votes policies
CREATE POLICY "Users can view votes for public polls" ON public.votes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.polls p 
      WHERE p.id = poll_id AND p.is_public = true
    )
  );

CREATE POLICY "Users can view votes for own polls" ON public.votes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.polls p 
      WHERE p.id = poll_id AND p.author_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can vote on public polls" ON public.votes
  FOR INSERT WITH CHECK (
    auth.uid() = voter_id AND
    EXISTS (
      SELECT 1 FROM public.polls p 
      WHERE p.id = poll_id AND p.is_public = true AND p.status = 'active'
    )
  );

CREATE POLICY "Users can delete own votes" ON public.votes
  FOR DELETE USING (auth.uid() = voter_id);

-- Functions for updating timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER handle_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_polls
  BEFORE UPDATE ON public.polls
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update poll status based on expiration
CREATE OR REPLACE FUNCTION public.update_poll_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Update polls that have expired
  UPDATE public.polls 
  SET status = 'expired'
  WHERE expires_at IS NOT NULL 
    AND expires_at <= NOW() 
    AND status = 'active';
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to update poll status (requires pg_cron extension)
-- This would be set up in Supabase dashboard or via SQL:
-- SELECT cron.schedule('update-poll-status', '*/5 * * * *', 'SELECT public.update_poll_status();');

-- Function to get poll with all options and vote counts
CREATE OR REPLACE FUNCTION public.get_poll_with_stats(poll_uuid UUID)
RETURNS TABLE (
  poll_id UUID,
  title VARCHAR,
  description TEXT,
  author_id UUID,
  author_name VARCHAR,
  author_username VARCHAR,
  status poll_status,
  is_public BOOLEAN,
  allow_multiple_votes BOOLEAN,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  total_votes BIGINT,
  option_id UUID,
  option_text VARCHAR,
  option_order INTEGER,
  option_votes BIGINT,
  option_percentage NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id as poll_id,
    p.title,
    p.description,
    p.author_id,
    pr.name as author_name,
    pr.username as author_username,
    p.status,
    p.is_public,
    p.allow_multiple_votes,
    p.expires_at,
    p.created_at,
    p.updated_at,
    COUNT(DISTINCT v.id) as total_votes,
    po.id as option_id,
    po.text as option_text,
    po.order_index as option_order,
    COUNT(DISTINCT v.id) as option_votes,
    CASE 
      WHEN COUNT(DISTINCT v.id) = 0 THEN 0
      ELSE ROUND(
        (COUNT(DISTINCT v.id)::DECIMAL / NULLIF(COUNT(DISTINCT v.id), 0)) * 100, 
        2
      )
    END as option_percentage
  FROM public.polls p
  JOIN public.profiles pr ON p.author_id = pr.id
  LEFT JOIN public.poll_options po ON p.id = po.poll_id
  LEFT JOIN public.votes v ON p.id = v.poll_id
  WHERE p.id = poll_uuid
  GROUP BY p.id, p.title, p.description, p.author_id, pr.name, pr.username, 
           p.status, p.is_public, p.allow_multiple_votes, p.expires_at, 
           p.created_at, p.updated_at, po.id, po.text, po.order_index
  ORDER BY po.order_index;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
