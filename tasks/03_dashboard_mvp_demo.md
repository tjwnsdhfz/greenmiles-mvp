# 03 Dashboard MVP Demo

## Goal

Make GreenMiles presentable for startup-support review and GitHub portfolio use with a working dashboard-first MVP.

## Scope

- Root route redirects to `/dashboard`.
- `/dashboard` renders meaningful demo data without external services.
- Dashboard shows core metrics, recent distance, travel mix, impact proxy, and recent trips.
- Supabase-backed live data remains available when environment values and user sessions are configured.

## Implemented Files

- `src/app/page.tsx`
- `src/app/dashboard/page.tsx`
- `src/app/globals.css`
- `src/features/dashboard/demo-data.ts`
- `src/features/dashboard/metrics.ts`

## Verification

```powershell
npm run typecheck
npm run build
npm audit --omit=dev
```

Manual route checks:

- `http://localhost:3000` redirects to `/dashboard`.
- `http://localhost:3000/dashboard` returns `200`.
- The dashboard includes demo-data metrics when Supabase env vars are absent.
