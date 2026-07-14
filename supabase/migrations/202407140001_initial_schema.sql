-- Initial schema for Vibecut
-- Enable RLS on all tables from the start

-- Projects table
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  created_at timestamptz default now()
);

alter table public.projects enable row level security;

create policy "Users can view their own projects"
  on public.projects for select
  using (auth.uid() = user_id);

create policy "Users can insert their own projects"
  on public.projects for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own projects"
  on public.projects for update
  using (auth.uid() = user_id);

-- Videos table
create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  project_id uuid references public.projects(id) on delete cascade,
  storage_path text not null,
  original_name text,
  status text default 'uploaded' check (status in ('uploaded', 'processing', 'done', 'error')),
  duration_seconds integer,
  created_at timestamptz default now()
);

alter table public.videos enable row level security;

create policy "Users can view their own videos"
  on public.videos for select
  using (auth.uid() = user_id);

create policy "Users can insert their own videos"
  on public.videos for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own videos"
  on public.videos for update
  using (auth.uid() = user_id);

-- Storage bucket policies (run in Supabase dashboard or via CLI)
-- create bucket 'videos' if not exists (private)
-- Then add RLS policies on storage.objects for the videos bucket
