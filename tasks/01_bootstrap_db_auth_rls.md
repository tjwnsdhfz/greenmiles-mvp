# Codex Task 01 — Bootstrap / DB / Auth / RLS

## Role

You are a senior full-stack engineer building the GreenMiles MVP foundation.

## Source documents to read first

1. `AGENTS.md`
2. `docs/02_TRD_GreenMiles.md` sections 4–9 and 20–22
3. `docs/05_DevMilestones_GreenMiles.md` Milestone 1
4. `docs/01_PRD_GreenMiles.md` sections 10–12

## Goal

Create the runnable project foundation: Next.js, Supabase, database schema, role model, initial RLS, route shells, README, and basic reward calculation unit test scaffold.

## Permissions

You may create, edit, delete, and refactor files; install dependencies; run terminal commands; create migrations; run tests; create branches; and propose PRs.

Do not deploy to production. Do not use mainnet. Do not commit `.env.local`, real API keys, service-role keys, private keys, or wallet mnemonics. Do not call paid APIs. Do not store real PII in seed data.

## Implementation requirements

### 1. Project setup

- Use Next.js App Router, TypeScript, Tailwind CSS.
- Add or prepare shadcn/ui-compatible structure.
- Add basic routes:
  - `/`
  - `/consumer/wallet`
  - `/retailer/pos`
  - `/retailer/dashboard`
  - `/farmer/products`
  - `/admin/mrv`
  - `/claim`
- Add clean Korean UI copy and status labels.

### 2. Supabase setup

- Add Supabase browser and server clients.
- Add auth helper utilities.
- Add role guard utilities for:
  - `consumer`
  - `farmer`
  - `retailer`
  - `admin`
  - `mrv_partner`

### 3. Database migrations

Create migrations for these TRD tables:

- `profiles`
- `organizations`
- `organization_members`
- `farms`
- `stores`
- `product_skus`
- `emission_factors`
- `reward_rules`
- `pos_events`
- `purchase_items`
- `receipt_submissions`
- `wallets`
- `reward_events`
- `ledger_entries`
- `mrv_batches`
- `mrv_batch_items`

Use UUID primary keys, timestamps, foreign keys, status fields, and sensible constraints. Add PostGIS support if using Supabase/Postgres locally.

### 4. RLS

Enable RLS on all user-facing tables. Add initial policies or policy stubs for:

- consumers can access only their own wallet/reward/receipt data
- farmers can manage their organization’s farms/SKUs
- retailers can manage their organization’s stores/POS/dashboard data
- admins can manage operational tables
- MRV partners can read/verify submitted MRV batches

### 5. Environment

Create `.env.example` with placeholders only.

### 6. Reward module stub

Create a deterministic reward calculation module with Haversine distance fallback, but do not fully wire it into POS yet. Add basic unit tests.

### 7. Documentation

Update `README.md` with:

- project purpose
- local setup
- environment variables
- folder structure
- commands
- current MVP scope
- forbidden production/mainnet/secrets rules

## Acceptance criteria

- Project installs and runs locally.
- All required tables exist as migrations.
- RLS is enabled on user-facing tables.
- `.env.example` exists and contains no real secrets.
- Initial route shells render without crashing.
- Reward calculation unit test exists.
- README explains how to run and what is not implemented yet.

## Tests to run

Run if available, otherwise create scripts and explain limitations:

- `npm run lint`
- `npm run typecheck`
- `npm run test`

## Final report format

Return:

1. Summary of work
2. Files created/changed
3. Tests run and results
4. Known limitations
5. Suggested next task: `tasks/02_catalog_pos_qr_claim.md`
