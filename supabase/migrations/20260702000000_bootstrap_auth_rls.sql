create extension if not exists pgcrypto with schema extensions;
create extension if not exists postgis with schema extensions;

create type public.user_role as enum ('consumer', 'farmer', 'retailer', 'admin', 'mrv_partner');
create type public.organization_type as enum ('retailer', 'farm_group', 'mrv_partner');
create type public.review_status as enum ('pending', 'approved', 'rejected');
create type public.pos_status as enum ('issued', 'claimed', 'expired');
create type public.mrv_status as enum ('not_submitted', 'submitted', 'verified', 'anchored', 'rejected');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null default 'consumer',
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type public.organization_type not null,
  created_at timestamptz not null default now()
);

create table public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role_in_org text not null default 'member',
  created_at timestamptz not null default now(),
  unique (organization_id, profile_id)
);

create table public.farms (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete set null,
  name text not null,
  location geography(Point, 4326),
  certification_type text,
  production_method text,
  created_at timestamptz not null default now()
);

create table public.stores (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  location geography(Point, 4326),
  channel_type text not null default 'local_food_store',
  created_at timestamptz not null default now()
);

create table public.product_skus (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid references public.farms(id) on delete set null,
  store_id uuid references public.stores(id) on delete set null,
  name text not null,
  category text not null,
  weight_grams numeric(12, 2),
  low_carbon_certified boolean not null default false,
  packaging_info text,
  distance_km numeric(10, 2) not null default 0,
  production_method text,
  status public.review_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.emission_factors (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  factor_value numeric(12, 6) not null,
  unit text not null,
  source text,
  updated_at timestamptz not null default now()
);

create table public.reward_rules (
  id uuid primary key default gen_random_uuid(),
  rule_name text not null,
  condition_json jsonb not null default '{}'::jsonb,
  reward_multiplier numeric(8, 3) not null default 1,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.pos_events (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  sku_id uuid not null references public.product_skus(id) on delete restrict,
  qr_token text not null unique default encode(gen_random_bytes(24), 'hex'),
  token_expires_at timestamptz not null default (now() + interval '24 hours'),
  status public.pos_status not null default 'issued',
  created_at timestamptz not null default now()
);

create table public.receipt_submissions (
  id uuid primary key default gen_random_uuid(),
  consumer_id uuid not null references public.profiles(id) on delete cascade,
  image_url text,
  ocr_extracted_json jsonb,
  status public.review_status not null default 'pending',
  reviewed_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.purchase_items (
  id uuid primary key default gen_random_uuid(),
  consumer_id uuid not null references public.profiles(id) on delete cascade,
  pos_event_id uuid references public.pos_events(id) on delete set null,
  receipt_submission_id uuid references public.receipt_submissions(id) on delete set null,
  sku_id uuid not null references public.product_skus(id) on delete restrict,
  quantity numeric(12, 3) not null default 1,
  amount_krw numeric(12, 2) not null default 0,
  created_at timestamptz not null default now()
);

create table public.wallets (
  id uuid primary key default gen_random_uuid(),
  consumer_id uuid not null unique references public.profiles(id) on delete cascade,
  balance numeric(14, 2) not null default 0,
  updated_at timestamptz not null default now()
);

create table public.reward_events (
  id uuid primary key default gen_random_uuid(),
  consumer_id uuid not null references public.profiles(id) on delete cascade,
  purchase_item_id uuid references public.purchase_items(id) on delete set null,
  reward_points numeric(14, 2) not null default 0,
  estimated_carbon_contribution numeric(14, 3) not null default 0,
  mrv_status public.mrv_status not null default 'not_submitted',
  created_at timestamptz not null default now()
);

create table public.ledger_entries (
  id uuid primary key default gen_random_uuid(),
  reward_event_id uuid references public.reward_events(id) on delete set null,
  entry_type text not null check (entry_type in ('credit', 'adjustment')),
  amount numeric(14, 2) not null,
  prev_hash text,
  entry_hash text not null,
  created_at timestamptz not null default now()
);

create table public.mrv_batches (
  id uuid primary key default gen_random_uuid(),
  batch_period_start date not null,
  batch_period_end date not null,
  status public.mrv_status not null default 'not_submitted',
  batch_hash text,
  anchor_tx_hash text,
  created_at timestamptz not null default now()
);

create table public.mrv_batch_items (
  id uuid primary key default gen_random_uuid(),
  mrv_batch_id uuid not null references public.mrv_batches(id) on delete cascade,
  reward_event_id uuid not null references public.reward_events(id) on delete cascade,
  item_hash text not null,
  unique (mrv_batch_id, reward_event_id)
);

create index organization_members_profile_idx on public.organization_members(profile_id);
create index product_skus_store_idx on public.product_skus(store_id);
create index pos_events_qr_token_idx on public.pos_events(qr_token);
create index purchase_items_consumer_idx on public.purchase_items(consumer_id);
create index reward_events_consumer_idx on public.reward_events(consumer_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger set_product_skus_updated_at before update on public.product_skus
for each row execute function public.set_updated_at();
create trigger set_receipt_submissions_updated_at before update on public.receipt_submissions
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
    coalesce(new.raw_user_meta_data ->> 'display_name', new.raw_user_meta_data ->> 'full_name')
  )
  on conflict (id) do nothing;

  insert into public.wallets (consumer_id)
  values (new.id)
  on conflict (consumer_id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

create or replace function public.is_org_member(target_org uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.organization_members
    where organization_id = target_org and profile_id = (select auth.uid())
  );
$$;

alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.farms enable row level security;
alter table public.stores enable row level security;
alter table public.product_skus enable row level security;
alter table public.emission_factors enable row level security;
alter table public.reward_rules enable row level security;
alter table public.pos_events enable row level security;
alter table public.receipt_submissions enable row level security;
alter table public.purchase_items enable row level security;
alter table public.wallets enable row level security;
alter table public.reward_events enable row level security;
alter table public.ledger_entries enable row level security;
alter table public.mrv_batches enable row level security;
alter table public.mrv_batch_items enable row level security;

create policy "own profile or admin" on public.profiles
for select using (id = (select auth.uid()) or public.is_admin());
create policy "own profile update" on public.profiles
for update using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy "org members read organizations" on public.organizations
for select using (public.is_admin() or public.is_org_member(id));

create policy "members read own memberships" on public.organization_members
for select using (public.is_admin() or profile_id = (select auth.uid()) or public.is_org_member(organization_id));

create policy "org members read farms" on public.farms
for select using (public.is_admin() or organization_id is null or public.is_org_member(organization_id));

create policy "org members manage farms" on public.farms
for all using (public.is_admin() or public.is_org_member(organization_id))
with check (public.is_admin() or organization_id is null or public.is_org_member(organization_id));

create policy "org members read stores" on public.stores
for select using (public.is_admin() or public.is_org_member(organization_id));

create policy "org members manage stores" on public.stores
for all using (public.is_admin() or public.is_org_member(organization_id))
with check (public.is_admin() or public.is_org_member(organization_id));

create policy "approved skus readable" on public.product_skus
for select using (status = 'approved' or public.is_admin());

create policy "store members manage skus" on public.product_skus
for all using (
  public.is_admin() or exists (
    select 1 from public.stores
    where stores.id = product_skus.store_id and public.is_org_member(stores.organization_id)
  )
) with check (
  public.is_admin() or exists (
    select 1 from public.stores
    where stores.id = product_skus.store_id and public.is_org_member(stores.organization_id)
  )
);

create policy "emission factors readable" on public.emission_factors
for select using (true);
create policy "reward rules readable" on public.reward_rules
for select using (is_active or public.is_admin());

create policy "store members manage pos events" on public.pos_events
for all using (
  public.is_admin() or exists (
    select 1 from public.stores
    where stores.id = pos_events.store_id and public.is_org_member(stores.organization_id)
  )
) with check (
  public.is_admin() or exists (
    select 1 from public.stores
    where stores.id = pos_events.store_id and public.is_org_member(stores.organization_id)
  )
);

create policy "consumers read own receipts" on public.receipt_submissions
for select using (public.is_admin() or consumer_id = (select auth.uid()));
create policy "consumers insert own receipts" on public.receipt_submissions
for insert with check (consumer_id = (select auth.uid()));

create policy "consumers read own purchase items" on public.purchase_items
for select using (public.is_admin() or consumer_id = (select auth.uid()));
create policy "consumers insert own purchase items" on public.purchase_items
for insert with check (consumer_id = (select auth.uid()));

create policy "consumers read own wallet" on public.wallets
for select using (public.is_admin() or consumer_id = (select auth.uid()));

create policy "consumers read own rewards" on public.reward_events
for select using (public.is_admin() or consumer_id = (select auth.uid()));

create policy "ledger visible to owner through reward" on public.ledger_entries
for select using (
  public.is_admin() or exists (
    select 1 from public.reward_events
    where reward_events.id = ledger_entries.reward_event_id
      and reward_events.consumer_id = (select auth.uid())
  )
);

create policy "mrv partners read batches" on public.mrv_batches
for select using (
  public.is_admin() or exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid()) and profiles.role = 'mrv_partner'
  )
);

create policy "mrv partners read batch items" on public.mrv_batch_items
for select using (
  public.is_admin() or exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid()) and profiles.role = 'mrv_partner'
  )
);

comment on table public.reward_events is 'GreenMiles point events and estimated carbon contribution records. Not legal carbon credits.';
comment on table public.mrv_batches is 'Off-chain MRV batch metadata. Only batch hashes are intended for testnet anchoring.';
