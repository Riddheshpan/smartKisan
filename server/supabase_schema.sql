-- 1. Create profiles table (if not exists)
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  full_name text,
  email text,
  farm_name text,
  location text,
  farming_type text,
  land_size text,

  constraint username_length check (char_length(full_name) >= 3)
);

-- 2. Add email column if it was missing (for safety)
do $$
begin
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'email') then
        alter table public.profiles add column email text;
    end if;
end $$;

-- 3. Create plots table (if not exists)
create table if not exists public.plots (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users not null,
  name text not null,
  crop text not null,
  area numeric,
  status text default 'Preparation'
);

-- 4. Enable RLS
alter table public.profiles enable row level security;
alter table public.plots enable row level security;

-- 5. Profiles Policies
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

-- 6. Plots Policies
create policy "Users can view their own plots." on plots for select using (auth.uid() = user_id);
create policy "Users can insert their own plots." on plots for insert with check (auth.uid() = user_id);
create policy "Users can update their own plots." on plots for update using (auth.uid() = user_id);
create policy "Users can delete their own plots." on plots for delete using (auth.uid() = user_id);

-- 7. Trigger Function for New Users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id, 
    coalesce(new.raw_user_meta_data->>'full_name', 'Farmer'), -- Default to 'Farmer' if missing
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

-- 8. Trigger Definition
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
