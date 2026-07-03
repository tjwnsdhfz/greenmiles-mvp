-- GreenMiles local RLS smoke checks.
-- Run after `supabase db reset`:
--   psql "$DATABASE_URL" -f supabase/rls_smoke.sql

begin;

set local role authenticated;

set local request.jwt.claim.sub = '00000000-0000-4000-8000-000000000001';
set local request.jwt.claim.role = 'authenticated';

do $$
declare
  own_wallet_count integer;
  visible_store_count integer;
begin
  select count(*) into own_wallet_count from public.wallets;
  if own_wallet_count <> 1 then
    raise exception 'consumer should see exactly one own wallet, got %', own_wallet_count;
  end if;

  select count(*) into visible_store_count from public.stores;
  if visible_store_count <> 0 then
    raise exception 'consumer should not see retailer stores, got %', visible_store_count;
  end if;
end $$;

set local request.jwt.claim.sub = '00000000-0000-4000-8000-000000000002';

do $$
declare
  visible_store_count integer;
  visible_pos_count integer;
  visible_wallet_count integer;
begin
  select count(*) into visible_store_count from public.stores;
  if visible_store_count <> 1 then
    raise exception 'retailer should see one organization store, got %', visible_store_count;
  end if;

  select count(*) into visible_pos_count from public.pos_events;
  if visible_pos_count <> 2 then
    raise exception 'retailer should see two organization POS events, got %', visible_pos_count;
  end if;

  select count(*) into visible_wallet_count from public.wallets;
  if visible_wallet_count <> 0 then
    raise exception 'retailer should not see consumer wallets, got %', visible_wallet_count;
  end if;
end $$;

set local request.jwt.claim.sub = '00000000-0000-4000-8000-000000000005';

do $$
declare
  visible_batch_count integer;
begin
  select count(*) into visible_batch_count from public.mrv_batches;
  if visible_batch_count <> 1 then
    raise exception 'MRV partner should see one submitted batch, got %', visible_batch_count;
  end if;
end $$;

set local request.jwt.claim.sub = '00000000-0000-4000-8000-000000000004';

do $$
declare
  profile_count integer;
  reward_count integer;
begin
  select count(*) into profile_count from public.profiles;
  if profile_count <> 5 then
    raise exception 'admin should see five demo profiles, got %', profile_count;
  end if;

  select count(*) into reward_count from public.reward_events;
  if reward_count <> 1 then
    raise exception 'admin should see one reward event, got %', reward_count;
  end if;
end $$;

rollback;
