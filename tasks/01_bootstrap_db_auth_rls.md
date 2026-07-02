# Codex Task 01 — Bootstrap / DB / Auth / RLS

## Goal

Create the runnable GreenMiles MVP foundation: Next.js, Supabase, database schema, role model, initial RLS, route shells, README, and deterministic reward calculation test scaffold.

## Source Documents

1. `AGENTS.md`
2. `docs/02_TRD_GreenMiles.md` sections 4-9 and 20-22
3. `docs/05_DevMilestones_GreenMiles.md` Milestone 1
4. `docs/01_PRD_GreenMiles.md` sections 10-12

## Implemented Scope

- Next.js App Router + TypeScript project foundation.
- Supabase browser/server clients.
- Supabase migrations for TRD core tables:
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
- Initial RLS policies for consumer-owned data, organization-scoped retailer/farmer data, admin access, and MRV partner read paths.
- Route shells:
  - `/`
  - `/consumer/wallet`
  - `/retailer/pos`
  - `/retailer/dashboard`
  - `/farmer/products`
  - `/admin/mrv`
  - `/claim`
  - `/auth`
- Deterministic reward calculation module with Haversine fallback.
- Unit tests for reward calculation.

## Safety Constraints

- No production deploy.
- No mainnet blockchain usage.
- No real secrets or private keys.
- No real PII in demo data.
- No legal carbon-credit issuance wording.

## Acceptance Criteria

- Project installs and runs locally.
- Required TRD tables exist in migrations.
- RLS is enabled on user-facing tables.
- `.env.example` exists and contains placeholders only.
- Route shells render without crashing.
- Reward calculation unit test exists.
- README explains setup, scope, limitations, and forbidden production/mainnet/secrets rules.

## Tests

```powershell
npm run typecheck
npm run build
npm run test
npm audit --omit=dev
```

## Suggested Next Task

`tasks/02_catalog_pos_qr_claim.md`
