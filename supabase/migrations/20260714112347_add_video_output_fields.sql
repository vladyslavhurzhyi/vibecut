-- Add output fields to videos table for processed results

alter table public.videos 
  add column if not exists output_path text,
  add column if not exists processed_at timestamptz,
  add column if not exists error_message text;

-- Update status check to be more flexible (in case we add more states later)
-- (keeping existing check for now)