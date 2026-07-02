# GreenMiles

GreenMiles is a Supabase-backed MVP for tracking trips, mileage, and future sustainability calculations. It is structured as a portfolio-ready founder demo: the dashboard works with built-in demo data first, then switches to Supabase-backed user data when auth and environment values are configured.

## Stack

- Next.js App Router
- TypeScript
- Supabase Auth, Postgres, and RLS
- npm

## MVP Scope

In scope for the MVP:

- Authenticated user sessions.
- Per-user data isolation through Supabase RLS.
- User profiles created from Supabase Auth users.
- A small trips table that can support later mileage and CO2e calculations.
- A dashboard demo for trips, green distance, mode mix, and avoided CO2e.

Out of scope for this milestone:

- Rewards, payments, marketplaces, or admin workflows.
- Native mobile apps.
- Complex route optimization.
- Production marketing pages.

## Local Setup

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. The root route redirects to `/dashboard`.

Fill `.env.local` with Supabase values before testing real auth sessions. Without those values, the dashboard uses built-in demo data for portfolio and startup-support presentations.

## Supabase

The first migration is:

```text
supabase/migrations/20260702000000_bootstrap_auth_rls.sql
```

Apply it with the Supabase CLI after linking or starting a local project:

```powershell
supabase start
supabase db reset
```

or, for a linked remote project:

```powershell
supabase link --project-ref <project-ref>
supabase db push
```

## Development Checks

```powershell
npm run typecheck
npm run build
```

## Dashboard Demo

Dashboard implementation and read-model setup live in:

- `docs/DASHBOARD_PLAN.md`
- `tasks/02_prepare_dashboard.md`
- `src/features/dashboard/data.ts`
- `src/features/dashboard/demo-data.ts`
- `src/features/dashboard/metrics.ts`
- `src/app/dashboard/page.tsx`

The route `/dashboard` renders a demo-ready dashboard without Supabase and uses RLS-scoped live data after Supabase sign-in is wired.

## MVP User Flow

- `/dashboard`: portfolio-ready dashboard with demo data fallback.
- `/auth`: Supabase email/password sign-in and sign-up.
- `/trips/new`: authenticated trip entry with CO2e and avoided-emission estimates.

Trip saving requires Supabase env vars and an authenticated user. Demo dashboard viewing does not.

## Laptop/Desktop Sync

This `greenmiles/` directory is the actual app repository. Use Git to move work between machines. Do not sync active development state through OneDrive.

See:

- `docs/LOCAL_DEV_SYNC.md`
- `docs/GIT_WORKFLOW.md`
- `docs/GITHUB_PORTFOLIO.md`
