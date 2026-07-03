-- GreenMiles local demo seed.
-- This file is loaded by `supabase db reset` in local development only.
-- Do not use these demo users, IDs, or records in production.

insert into auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data
) values
  (
    '00000000-0000-4000-8000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'consumer.demo@greenmiles.local',
    extensions.crypt('greenmiles-demo-password', extensions.gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"display_name":"데모 소비자"}'::jsonb
  ),
  (
    '00000000-0000-4000-8000-000000000002',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'retailer.demo@greenmiles.local',
    extensions.crypt('greenmiles-demo-password', extensions.gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"display_name":"데모 유통사 담당자"}'::jsonb
  ),
  (
    '00000000-0000-4000-8000-000000000003',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'farmer.demo@greenmiles.local',
    extensions.crypt('greenmiles-demo-password', extensions.gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"display_name":"데모 생산자"}'::jsonb
  ),
  (
    '00000000-0000-4000-8000-000000000004',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'admin.demo@greenmiles.local',
    extensions.crypt('greenmiles-demo-password', extensions.gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"display_name":"데모 관리자"}'::jsonb
  ),
  (
    '00000000-0000-4000-8000-000000000005',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'mrv.demo@greenmiles.local',
    extensions.crypt('greenmiles-demo-password', extensions.gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"display_name":"데모 MRV 파트너"}'::jsonb
  )
on conflict (id) do update set
  email = excluded.email,
  encrypted_password = excluded.encrypted_password,
  email_confirmed_at = excluded.email_confirmed_at,
  updated_at = now(),
  raw_app_meta_data = excluded.raw_app_meta_data,
  raw_user_meta_data = excluded.raw_user_meta_data;

insert into public.profiles (id, role, display_name) values
  ('00000000-0000-4000-8000-000000000001', 'consumer', '데모 소비자'),
  ('00000000-0000-4000-8000-000000000002', 'retailer', '데모 유통사 담당자'),
  ('00000000-0000-4000-8000-000000000003', 'farmer', '데모 생산자'),
  ('00000000-0000-4000-8000-000000000004', 'admin', '데모 관리자'),
  ('00000000-0000-4000-8000-000000000005', 'mrv_partner', '데모 MRV 파트너')
on conflict (id) do update set
  role = excluded.role,
  display_name = excluded.display_name,
  updated_at = now();

insert into public.organizations (id, name, type) values
  ('10000000-0000-4000-8000-000000000001', '그린마켓 데모 유통사', 'retailer'),
  ('10000000-0000-4000-8000-000000000002', '로컬팜 데모 생산자 그룹', 'farm_group'),
  ('10000000-0000-4000-8000-000000000003', '그린마일즈 데모 MRV 파트너', 'mrv_partner')
on conflict (id) do update set
  name = excluded.name,
  type = excluded.type;

insert into public.organization_members (organization_id, profile_id, role_in_org) values
  ('10000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000002', 'retailer_operator'),
  ('10000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000003', 'farm_operator'),
  ('10000000-0000-4000-8000-000000000003', '00000000-0000-4000-8000-000000000005', 'mrv_reviewer')
on conflict (organization_id, profile_id) do update set
  role_in_org = excluded.role_in_org;

insert into public.farms (
  id,
  organization_id,
  name,
  location,
  certification_type,
  production_method
) values
  (
    '20000000-0000-4000-8000-000000000001',
    '10000000-0000-4000-8000-000000000002',
    '데모 로컬 토마토 농장',
    extensions.st_setsrid(extensions.st_makepoint(127.1025, 37.4010), 4326)::geography,
    '저탄소 농산물 인증',
    '스마트팜 온실 재배'
  )
on conflict (id) do update set
  organization_id = excluded.organization_id,
  name = excluded.name,
  location = excluded.location,
  certification_type = excluded.certification_type,
  production_method = excluded.production_method;

insert into public.stores (
  id,
  organization_id,
  name,
  location,
  channel_type
) values
  (
    '30000000-0000-4000-8000-000000000001',
    '10000000-0000-4000-8000-000000000001',
    '그린마켓 판교점',
    extensions.st_setsrid(extensions.st_makepoint(127.1110, 37.3947), 4326)::geography,
    'local_food_store'
  )
on conflict (id) do update set
  organization_id = excluded.organization_id,
  name = excluded.name,
  location = excluded.location,
  channel_type = excluded.channel_type;

insert into public.product_skus (
  id,
  farm_id,
  store_id,
  name,
  category,
  weight_grams,
  low_carbon_certified,
  packaging_info,
  distance_km,
  production_method,
  status
) values
  (
    '40000000-0000-4000-8000-000000000001',
    '20000000-0000-4000-8000-000000000001',
    '30000000-0000-4000-8000-000000000001',
    '로컬 저탄소 토마토 500g',
    'produce',
    500,
    true,
    '재활용 가능 종이 완충재',
    12.4,
    '스마트팜 온실 재배',
    'approved'
  ),
  (
    '40000000-0000-4000-8000-000000000002',
    '20000000-0000-4000-8000-000000000001',
    '30000000-0000-4000-8000-000000000001',
    '로컬 샐러드 채소 300g',
    'produce',
    300,
    true,
    '무라벨 포장',
    15.8,
    '수경 재배',
    'approved'
  )
on conflict (id) do update set
  farm_id = excluded.farm_id,
  store_id = excluded.store_id,
  name = excluded.name,
  category = excluded.category,
  weight_grams = excluded.weight_grams,
  low_carbon_certified = excluded.low_carbon_certified,
  packaging_info = excluded.packaging_info,
  distance_km = excluded.distance_km,
  production_method = excluded.production_method,
  status = excluded.status,
  updated_at = now();

insert into public.emission_factors (
  id,
  category,
  factor_value,
  unit,
  source
) values
  (
    '50000000-0000-4000-8000-000000000001',
    'produce',
    0.220000,
    'kgCO2e/kg',
    'MVP demo factor for local development'
  )
on conflict (id) do update set
  category = excluded.category,
  factor_value = excluded.factor_value,
  unit = excluded.unit,
  source = excluded.source,
  updated_at = now();

insert into public.reward_rules (
  id,
  rule_name,
  condition_json,
  reward_multiplier,
  is_active
) values
  (
    '60000000-0000-4000-8000-000000000001',
    'local-low-carbon-demo',
    '{"low_carbon_certified":true,"max_distance_km":50}'::jsonb,
    1.350,
    true
  )
on conflict (id) do update set
  rule_name = excluded.rule_name,
  condition_json = excluded.condition_json,
  reward_multiplier = excluded.reward_multiplier,
  is_active = excluded.is_active;

insert into public.pos_events (
  id,
  store_id,
  sku_id,
  qr_token,
  token_expires_at,
  status
) values
  (
    '70000000-0000-4000-8000-000000000001',
    '30000000-0000-4000-8000-000000000001',
    '40000000-0000-4000-8000-000000000001',
    'demo-local-tomato-claim',
    now() + interval '14 days',
    'claimed'
  ),
  (
    '70000000-0000-4000-8000-000000000002',
    '30000000-0000-4000-8000-000000000001',
    '40000000-0000-4000-8000-000000000002',
    'demo-local-salad-ready',
    now() + interval '14 days',
    'issued'
  )
on conflict (id) do update set
  store_id = excluded.store_id,
  sku_id = excluded.sku_id,
  qr_token = excluded.qr_token,
  token_expires_at = excluded.token_expires_at,
  status = excluded.status;

insert into public.purchase_items (
  id,
  consumer_id,
  pos_event_id,
  sku_id,
  quantity,
  amount_krw
) values
  (
    '80000000-0000-4000-8000-000000000001',
    '00000000-0000-4000-8000-000000000001',
    '70000000-0000-4000-8000-000000000001',
    '40000000-0000-4000-8000-000000000001',
    1,
    6900
  )
on conflict (id) do update set
  consumer_id = excluded.consumer_id,
  pos_event_id = excluded.pos_event_id,
  sku_id = excluded.sku_id,
  quantity = excluded.quantity,
  amount_krw = excluded.amount_krw;

insert into public.wallets (
  id,
  consumer_id,
  balance
) values
  (
    '90000000-0000-4000-8000-000000000001',
    '00000000-0000-4000-8000-000000000001',
    128
  )
on conflict (consumer_id) do update set
  balance = excluded.balance,
  updated_at = now();

insert into public.reward_events (
  id,
  consumer_id,
  purchase_item_id,
  reward_points,
  estimated_carbon_contribution,
  mrv_status
) values
  (
    'a0000000-0000-4000-8000-000000000001',
    '00000000-0000-4000-8000-000000000001',
    '80000000-0000-4000-8000-000000000001',
    128,
    0.184,
    'submitted'
  )
on conflict (id) do update set
  consumer_id = excluded.consumer_id,
  purchase_item_id = excluded.purchase_item_id,
  reward_points = excluded.reward_points,
  estimated_carbon_contribution = excluded.estimated_carbon_contribution,
  mrv_status = excluded.mrv_status;

insert into public.ledger_entries (
  id,
  reward_event_id,
  entry_type,
  amount,
  prev_hash,
  entry_hash
) values
  (
    'b0000000-0000-4000-8000-000000000001',
    'a0000000-0000-4000-8000-000000000001',
    'credit',
    128,
    null,
    'demo-ledger-hash-001'
  )
on conflict (id) do update set
  reward_event_id = excluded.reward_event_id,
  entry_type = excluded.entry_type,
  amount = excluded.amount,
  prev_hash = excluded.prev_hash,
  entry_hash = excluded.entry_hash;

insert into public.mrv_batches (
  id,
  batch_period_start,
  batch_period_end,
  status,
  batch_hash,
  anchor_tx_hash
) values
  (
    'c0000000-0000-4000-8000-000000000001',
    current_date - 7,
    current_date,
    'submitted',
    'demo-mrv-batch-hash-001',
    null
  )
on conflict (id) do update set
  batch_period_start = excluded.batch_period_start,
  batch_period_end = excluded.batch_period_end,
  status = excluded.status,
  batch_hash = excluded.batch_hash,
  anchor_tx_hash = excluded.anchor_tx_hash;

insert into public.mrv_batch_items (
  id,
  mrv_batch_id,
  reward_event_id,
  item_hash
) values
  (
    'd0000000-0000-4000-8000-000000000001',
    'c0000000-0000-4000-8000-000000000001',
    'a0000000-0000-4000-8000-000000000001',
    'demo-mrv-item-hash-001'
  )
on conflict (mrv_batch_id, reward_event_id) do update set
  item_hash = excluded.item_hash;
