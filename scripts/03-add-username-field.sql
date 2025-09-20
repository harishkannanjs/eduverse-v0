-- Add username field to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;

-- Create index for faster username lookups
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- Update RLS policies to allow username-based queries
CREATE POLICY "profiles_select_by_username" ON public.profiles FOR SELECT USING (true);

-- Add constraint to ensure username is lowercase and alphanumeric with underscores
ALTER TABLE public.profiles ADD CONSTRAINT username_format CHECK (
  username IS NULL OR (
    username ~ '^[a-z0-9_]+$' AND 
    length(username) >= 3 AND 
    length(username) <= 30
  )
);
