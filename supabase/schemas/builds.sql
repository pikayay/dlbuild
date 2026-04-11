-- Create a table for user builds
create table public.builds (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  user_id uuid not null references auth.users on delete cascade,
  hero_id integer not null,
  name text not null,
  description text,
  items jsonb not null default '{}'::jsonb,
  published boolean not null default false
);

-- Set up Row Level Security (RLS)
alter table public.builds enable row level security;

-- Policies
create policy "Users can view published builds" on public.builds
  for select using (published = true);

create policy "Users can view their own builds" on public.builds
  for select using (auth.uid() = user_id);

create policy "Users can insert their own builds" on public.builds
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own builds" on public.builds
  for update using (auth.uid() = user_id);

create policy "Users can delete their own builds" on public.builds
  for delete using (auth.uid() = user_id);

-- Trigger to update `updated_at` before any update
CREATE TRIGGER update_builds_updated_at
  BEFORE UPDATE ON public.builds
  FOR EACH ROW
  EXECUTE PROCEDURE public.update_updated_at_column();
