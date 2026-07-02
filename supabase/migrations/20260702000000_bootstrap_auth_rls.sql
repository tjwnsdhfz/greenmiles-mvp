create extension if not exists pgcrypto with schema extensions;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  origin text not null,
  destination text not null,
  distance_km numeric(10, 2) not null check (distance_km > 0),
  travel_mode text not null check (
    travel_mode in ('walk', 'bike', 'transit', 'carpool', 'ev', 'car')
  ),
  estimated_co2e_kg numeric(10, 3) check (
    estimated_co2e_kg is null or estimated_co2e_kg >= 0
  ),
  avoided_co2e_kg numeric(10, 3) check (
    avoided_co2e_kg is null or avoided_co2e_kg >= 0
  ),
  occurred_on date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index trips_user_id_idx on public.trips(user_id);
create index trips_user_occurred_on_idx on public.trips(user_id, occurred_on desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger set_trips_updated_at
before update on public.trips
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'display_name',
      new.raw_user_meta_data ->> 'full_name'
    )
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.trips enable row level security;

create policy "Profiles are viewable by owner"
on public.profiles
for select
using ((select auth.uid()) = id);

create policy "Users can insert own profile"
on public.profiles
for insert
with check ((select auth.uid()) = id);

create policy "Users can update own profile"
on public.profiles
for update
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "Trips are viewable by owner"
on public.trips
for select
using ((select auth.uid()) = user_id);

create policy "Users can create own trips"
on public.trips
for insert
with check ((select auth.uid()) = user_id);

create policy "Users can update own trips"
on public.trips
for update
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete own trips"
on public.trips
for delete
using ((select auth.uid()) = user_id);

comment on table public.profiles is 'One profile row per Supabase auth user.';
comment on table public.trips is 'Per-user GreenMiles trip records protected by RLS.';
comment on column public.trips.travel_mode is 'Allowed values: walk, bike, transit, carpool, ev, car.';
