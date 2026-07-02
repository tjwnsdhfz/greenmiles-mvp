# Dashboard Plan

This document prepares the GreenMiles dashboard implementation without expanding the MVP beyond the auth/RLS foundation.

## Dashboard Purpose

The dashboard should help a founder, reviewer, or authenticated user answer:

- How many trips have I logged?
- How many kilometers have I tracked?
- How much CO2e have I avoided?
- What were my most recent trips?
- Is my account/data setup ready?

## Initial Data Sources

- `public.trips`
- `public.trip_dashboard_summary`
- Supabase Auth user session

The dashboard must read only rows visible to the current authenticated user through RLS. Do not add admin-level aggregate access in the MVP.

## First Screen Scope

The first dashboard screen should include:

- Summary metrics.
- Recent trips table/list.
- Recent distance bars.
- Travel-mode mix.
- CO2e impact proxy.
- Demo data fallback when Supabase env vars or user sessions are missing.
- Empty state when live user data has no trips.

Out of scope for the first dashboard pass:

- Charts with date-range controls.
- Rewards or gamification.
- Team/fleet views.
- Map-based route rendering.
- Admin analytics.

## Implementation Notes

- Keep dashboard data access in `src/features/dashboard/data.ts`.
- Keep demo data in `src/features/dashboard/demo-data.ts` so the portfolio build is presentable before Supabase is configured.
- Keep derived metrics in `src/features/dashboard/metrics.ts`.
- Keep Supabase table/view types in `src/lib/database.types.ts` until generated types are wired.
- Add charting only after the summary and recent-trip read path is stable.
