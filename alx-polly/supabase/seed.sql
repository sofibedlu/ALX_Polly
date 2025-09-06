-- Seed data for development and testing
-- This file contains sample data to help with development and testing

-- Insert sample profiles (these would normally be created via auth signup)
-- Note: In production, profiles are created automatically via the trigger
INSERT INTO public.profiles (id, username, name, avatar_url) VALUES
  ('11111111-1111-1111-1111-111111111111', 'johndoe', 'John Doe', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'),
  ('22222222-2222-2222-2222-222222222222', 'janesmith', 'Jane Smith', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'),
  ('33333333-3333-3333-3333-333333333333', 'mikejohnson', 'Mike Johnson', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'),
  ('44444444-4444-4444-4444-444444444444', 'sarahwilson', 'Sarah Wilson', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face')
ON CONFLICT (id) DO NOTHING;

-- Insert sample polls
INSERT INTO public.polls (id, title, description, author_id, status, is_public, allow_multiple_votes, expires_at) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'What should we have for lunch?', 'Team lunch decision for this Friday. Please vote for your preference!', '11111111-1111-1111-1111-111111111111', 'active', true, false, NOW() + INTERVAL '7 days'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Best programming language for web development?', 'What do you think is the best language for building modern web applications?', '22222222-2222-2222-2222-222222222222', 'active', true, true, NOW() + INTERVAL '14 days'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Office temperature preference', 'What temperature should we set the office AC to?', '33333333-3333-3333-3333-333333333333', 'active', false, false, NOW() + INTERVAL '3 days'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Weekend activity planning', 'What should we do this weekend?', '44444444-4444-4444-4444-444444444444', 'active', true, true, NOW() + INTERVAL '2 days'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Project deadline extension', 'Should we extend the project deadline by one week?', '11111111-1111-1111-1111-111111111111', 'expired', true, false, NOW() - INTERVAL '1 day');

-- Insert poll options
INSERT INTO public.poll_options (poll_id, text, order_index) VALUES
  -- Lunch poll options
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Pizza', 1),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Sushi', 2),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Burgers', 3),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Salad', 4),
  
  -- Programming language poll options
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'JavaScript/TypeScript', 1),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Python', 2),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Java', 3),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Go', 4),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Rust', 5),
  
  -- Office temperature poll options
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '68°F (20°C)', 1),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '70°F (21°C)', 2),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '72°F (22°C)', 3),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '74°F (23°C)', 4),
  
  -- Weekend activity poll options
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Hiking', 1),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Movie night', 2),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Beach day', 3),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Game night', 4),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Restaurant dinner', 5),
  
  -- Project deadline poll options
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Yes, extend by one week', 1),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'No, keep current deadline', 2),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Extend by two weeks', 3);

-- Insert sample votes
INSERT INTO public.votes (poll_id, option_id, voter_id) VALUES
  -- Lunch poll votes
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', (SELECT id FROM public.poll_options WHERE poll_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' AND text = 'Pizza'), '11111111-1111-1111-1111-111111111111'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', (SELECT id FROM public.poll_options WHERE poll_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' AND text = 'Pizza'), '22222222-2222-2222-2222-222222222222'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', (SELECT id FROM public.poll_options WHERE poll_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' AND text = 'Pizza'), '33333333-3333-3333-3333-333333333333'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', (SELECT id FROM public.poll_options WHERE poll_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' AND text = 'Sushi'), '44444444-4444-4444-4444-444444444444'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', (SELECT id FROM public.poll_options WHERE poll_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' AND text = 'Burgers'), '11111111-1111-1111-1111-111111111111'),
  
  -- Programming language poll votes (multiple votes allowed)
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', (SELECT id FROM public.poll_options WHERE poll_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' AND text = 'JavaScript/TypeScript'), '11111111-1111-1111-1111-111111111111'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', (SELECT id FROM public.poll_options WHERE poll_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' AND text = 'JavaScript/TypeScript'), '22222222-2222-2222-2222-222222222222'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', (SELECT id FROM public.poll_options WHERE poll_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' AND text = 'JavaScript/TypeScript'), '33333333-3333-3333-3333-333333333333'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', (SELECT id FROM public.poll_options WHERE poll_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' AND text = 'Python'), '11111111-1111-1111-1111-111111111111'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', (SELECT id FROM public.poll_options WHERE poll_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' AND text = 'Python'), '44444444-4444-4444-4444-444444444444'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', (SELECT id FROM public.poll_options WHERE poll_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' AND text = 'Go'), '22222222-2222-2222-2222-222222222222'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', (SELECT id FROM public.poll_options WHERE poll_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' AND text = 'Rust'), '33333333-3333-3333-3333-333333333333'),
  
  -- Office temperature poll votes
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', (SELECT id FROM public.poll_options WHERE poll_id = 'cccccccc-cccc-cccc-cccc-cccccccccccc' AND text = '70°F (21°C)'), '11111111-1111-1111-1111-111111111111'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', (SELECT id FROM public.poll_options WHERE poll_id = 'cccccccc-cccc-cccc-cccc-cccccccccccc' AND text = '72°F (22°C)'), '22222222-2222-2222-2222-222222222222'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', (SELECT id FROM public.poll_options WHERE poll_id = 'cccccccc-cccc-cccc-cccc-cccccccccccc' AND text = '72°F (22°C)'), '33333333-3333-3333-3333-333333333333'),
  
  -- Weekend activity poll votes (multiple votes allowed)
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', (SELECT id FROM public.poll_options WHERE poll_id = 'dddddddd-dddd-dddd-dddd-dddddddddddd' AND text = 'Hiking'), '11111111-1111-1111-1111-111111111111'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', (SELECT id FROM public.poll_options WHERE poll_id = 'dddddddd-dddd-dddd-dddd-dddddddddddd' AND text = 'Hiking'), '22222222-2222-2222-2222-222222222222'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', (SELECT id FROM public.poll_options WHERE poll_id = 'dddddddd-dddd-dddd-dddd-dddddddddddd' AND text = 'Movie night'), '11111111-1111-1111-1111-111111111111'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', (SELECT id FROM public.poll_options WHERE poll_id = 'dddddddd-dddd-dddd-dddd-dddddddddddd' AND text = 'Beach day'), '33333333-3333-3333-3333-333333333333'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', (SELECT id FROM public.poll_options WHERE poll_id = 'dddddddd-dddd-dddd-dddd-dddddddddddd' AND text = 'Game night'), '44444444-4444-4444-4444-444444444444'),
  
  -- Project deadline poll votes (expired poll)
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', (SELECT id FROM public.poll_options WHERE poll_id = 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee' AND text = 'Yes, extend by one week'), '11111111-1111-1111-1111-111111111111'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', (SELECT id FROM public.poll_options WHERE poll_id = 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee' AND text = 'Yes, extend by one week'), '22222222-2222-2222-2222-222222222222'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', (SELECT id FROM public.poll_options WHERE poll_id = 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee' AND text = 'No, keep current deadline'), '33333333-3333-3333-3333-333333333333'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', (SELECT id FROM public.poll_options WHERE poll_id = 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee' AND text = 'Extend by two weeks'), '44444444-4444-4444-4444-444444444444');
