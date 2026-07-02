# 02 Prepare Retailer ESG Dashboard

## Goal

Prepare the GreenMiles dashboard for startup-support review and GitHub portfolio use.

## Scope

- Add a retailer ESG dashboard route at `/retailer/dashboard`.
- Keep `/dashboard` as a redirect alias.
- Add demo data for stores, approved SKUs, purchase claims, reward events, and MRV status.
- Add derived dashboard metrics for local-food mix, reward trend, and MRV breakdown.
- Keep demo mode available without Supabase credentials.

## Implemented Files

- `docs/DASHBOARD_PLAN.md`
- `src/features/dashboard/data.ts`
- `src/features/dashboard/metrics.ts`
- `src/app/retailer/dashboard/page.tsx`
- `src/app/dashboard/page.tsx`
- `supabase/migrations/20260702001000_dashboard_read_model.sql`

## Completion Criteria

- `/retailer/dashboard` renders without Supabase env vars.
- Dashboard copy avoids official carbon-credit wording.
- `npm run typecheck`, `npm run build`, and `npm run test` pass.
