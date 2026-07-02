# 02 Prepare Dashboard Development

## Goal

Prepare the app for dashboard creation by adding a demo-ready route, typed data access, and a dashboard read model.

## Scope

- Add a dashboard planning document.
- Add typed database definitions for the initial schema.
- Add a dashboard summary view migration.
- Add server-side dashboard data queries.
- Add demo data and derived dashboard metrics.
- Add a `/dashboard` route that works without Supabase and switches to live user data when available.
- Redirect the root route to `/dashboard` for portfolio demos.

## Implemented Files

- `docs/DASHBOARD_PLAN.md`
- `src/lib/database.types.ts`
- `src/features/dashboard/data.ts`
- `src/features/dashboard/demo-data.ts`
- `src/features/dashboard/metrics.ts`
- `src/app/dashboard/page.tsx`
- `supabase/migrations/20260702001000_dashboard_read_model.sql`

## Completion Criteria

- `npm run typecheck` passes.
- `npm run build` passes.
- `npm audit --omit=dev` reports no vulnerabilities.
- `/dashboard` renders demo data without Supabase env vars.
- `/dashboard` can load user-owned trip data once Supabase is configured.
