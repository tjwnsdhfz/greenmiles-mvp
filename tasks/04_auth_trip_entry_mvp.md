# 04 Auth and Trip Entry MVP

## Goal

Add the minimum live MVP workflow around the dashboard: sign in, create an account, save a trip, and return to dashboard metrics.

## Scope

- Add Supabase email/password auth route.
- Add server actions for sign-in, sign-up, and sign-out.
- Add authenticated trip-entry route.
- Estimate trip CO2e and avoided CO2e before insert.
- Keep dashboard demo mode available when Supabase is not configured.

## Implemented Files

- `src/app/auth/page.tsx`
- `src/app/auth/actions.ts`
- `src/app/trips/new/page.tsx`
- `src/app/trips/new/actions.ts`
- `src/features/trips/emissions.ts`
- `src/app/dashboard/page.tsx`
- `src/app/globals.css`

## Verification

```powershell
npm run typecheck
npm run build
npm audit --omit=dev
```

Manual route checks:

- `/dashboard` renders demo data without Supabase env vars.
- `/auth` renders the sign-in/sign-up form.
- `/trips/new` renders the trip form and disables saving without Supabase/user session.
- With Supabase configured, signing in and saving a trip inserts into `public.trips` under the current user.
