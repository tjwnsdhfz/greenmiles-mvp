# 01 Bootstrap DB, Auth, and RLS

## Goal

Create the foundation for GreenMiles accounts and per-user data isolation before building feature UI.

## Scope

- Initialize the app repository.
- Add Supabase client/server session plumbing.
- Add Supabase local config.
- Create initial database migration.
- Enable RLS on user-owned tables.
- Document local verification steps.

## Implemented Files

- `src/lib/supabase/env.ts`
- `src/lib/supabase/client.ts`
- `src/lib/supabase/server.ts`
- `middleware.ts`
- `supabase/config.toml`
- `supabase/migrations/20260702000000_bootstrap_auth_rls.sql`

## Database Objects

- `public.profiles`
- `public.trips`
- `public.set_updated_at()`
- `public.handle_new_user()`
- Trigger on `auth.users` to create profiles
- Owner-only RLS policies for profiles and trips

## Manual Verification

After Supabase CLI setup:

```powershell
supabase start
supabase db reset
```

Confirm:

- A new auth user creates one profile row.
- A user can select/update only their own profile.
- A user can insert/select/update/delete only their own trips.
- Anonymous users cannot read profile or trip rows.

## Completion Criteria

- `npm run typecheck` passes.
- `npm run build` passes.
- Migration applies cleanly in a Supabase environment.
- The app starts locally and reports whether Supabase env vars are configured.
