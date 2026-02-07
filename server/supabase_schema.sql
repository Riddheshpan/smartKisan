-- Add email column if it doesn't exist (safe for existing tables)
do $$
begin
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'email') then
        alter table public.profiles add column email text;
    end if;
end $$;

-- Create a table for public profiles (if not exists)
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  full_name text,
  email text, -- Added email field
  farm_name text,
  location text,
  farming_type text,
  land_size text,

  constraint username_length check (char_length(full_name) >= 3)
);

-- ... (RLS policies remain same, but good to re-run) ...

-- AUTOMATIC PROFILE CREATION TRIGGER
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id, 
    coalesce(new.raw_user_meta_data->>'full_name', 'Farmer'), -- Default to 'Farmer' if name missing
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Create a table for plots
create table if not exists public.plots (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users not null,
  name text not null,
  crop text not null,
  area numeric,
  status text default 'Preparation'
);

-- Set up RLS for plots
alter table public.plots enable row level security;

create policy "Users can view their own plots."
  on plots for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own plots."
  on plots for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own plots."
  on plots for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own plots."
  on plots for delete
  using ( auth.uid() = user_id );

-- AUTOMATIC PROFILE CREATION TRIGGER
-- This ensures that when a user signs up via Auth, a row is created in public.profiles
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
