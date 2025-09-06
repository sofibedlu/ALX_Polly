-- Script to fix missing profiles for existing users
-- Run this in your Supabase SQL Editor if you have existing users without profiles

-- First, let's see which users don't have profiles
SELECT 
  au.id,
  au.email,
  au.raw_user_meta_data,
  p.id as profile_id
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL;

-- Create profiles for users who don't have them
INSERT INTO public.profiles (id, username, name, avatar_url)
SELECT 
  au.id,
  COALESCE(
    au.raw_user_meta_data->>'username', 
    'user_' || substr(au.id::text, 1, 8)
  ) as username,
  COALESCE(
    au.raw_user_meta_data->>'name', 
    COALESCE(
      au.raw_user_meta_data->>'full_name',
      split_part(au.email, '@', 1)
    )
  ) as name,
  au.raw_user_meta_data->>'avatar_url' as avatar_url
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL;

-- Verify the fix
SELECT 
  au.id,
  au.email,
  p.username,
  p.name,
  p.created_at
FROM auth.users au
JOIN public.profiles p ON au.id = p.id
ORDER BY p.created_at DESC;
