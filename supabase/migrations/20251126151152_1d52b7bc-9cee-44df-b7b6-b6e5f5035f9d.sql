-- Create bookings table
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  booking_id text unique not null,
  user_id uuid references auth.users(id) on delete cascade,
  tier_name text not null,
  fare numeric not null,
  eta integer not null,
  distance numeric not null,
  pickup_lat numeric not null,
  pickup_lng numeric not null,
  destination_lat numeric not null,
  destination_lng numeric not null,
  status text default 'confirmed' not null,
  created_at timestamptz default now() not null
);

-- Enable RLS
alter table public.bookings enable row level security;

-- Policies: Users can see their own bookings
create policy "Users can view own bookings"
  on public.bookings
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Policies: Users can insert their own bookings
create policy "Users can create own bookings"
  on public.bookings
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Policies: Users can update their own bookings
create policy "Users can update own bookings"
  on public.bookings
  for update
  to authenticated
  using (auth.uid() = user_id);

-- Allow anonymous bookings (for MVP without authentication)
create policy "Anyone can create bookings"
  on public.bookings
  for insert
  to anon
  with check (true);

create policy "Anyone can view bookings"
  on public.bookings
  for select
  to anon
  using (true);

-- Index for faster queries
create index bookings_user_id_idx on public.bookings(user_id);
create index bookings_created_at_idx on public.bookings(created_at desc);