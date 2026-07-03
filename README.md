# GreenMiles MVP

GreenMiles is a dashboard-first MVP for a low-carbon/local agri-food reward platform. It demonstrates how SKU, virtual POS/QR purchase claims, GreenMiles points, estimated carbon contribution, retailer ESG metrics, receipt review, and MRV/testnet anchoring can fit into one startup-support prototype.

The MVP is intentionally careful with wording: it does not issue legal carbon credits. UI and docs use "GreenMiles points", "estimated carbon contribution", "MRV status", and "blockchain record complete".

## Stack

- Next.js App Router
- TypeScript
- Supabase Auth, Postgres, RLS, Storage-ready structure
- npm
- Vitest for deterministic reward logic tests

## Current Demo Routes

- `/` redirects to `/retailer/dashboard`
- `/retailer/dashboard`: portfolio-ready retailer ESG dashboard
- `/retailer/pos`: mock POS/QR event screen
- `/claim`: consumer QR claim demo
- `/consumer/wallet`: consumer reward wallet demo
- `/farmer/products`: producer SKU registration/status shell
- `/admin/mrv`: MRV batch/status shell
- `/auth`: Supabase email/password sign-in/sign-up

The dashboard works with built-in demo data when Supabase is not configured. Supabase migrations define the live-data path.

## MVP Scope

In scope:

- Authenticated profile foundation and roles: `consumer`, `farmer`, `retailer`, `admin`, `mrv_partner`
- TRD-aligned Supabase schema and initial RLS policies
- Low-carbon/local product SKU model
- Virtual POS / QR claim concept
- Deterministic reward calculation module
- Consumer wallet, retailer ESG dashboard, farmer SKU, admin MRV route shells
- Demo data for startup-support and GitHub portfolio review

Out of scope for this MVP:

- Legal carbon-credit issuance, trading, or offset claims
- Mainnet blockchain deployment
- Real POS API integration
- Paid OCR/API calls
- Real personal information or real MRV certification claims

## Local Setup

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

Fill `.env.local` with Supabase values before testing real auth sessions. Without those values, the demo routes still render.

## Supabase

Migrations:

```text
supabase/migrations/20260702000000_bootstrap_auth_rls.sql
supabase/migrations/20260702001000_dashboard_read_model.sql
supabase/seed.sql
supabase/rls_smoke.sql
```

Apply locally after installing the Supabase CLI:

```powershell
supabase start
supabase db reset
```

`supabase db reset` applies the migrations and loads `supabase/seed.sql` for local demo accounts and sample data. The seed data is local-development only and uses `*.demo@greenmiles.local` addresses with a shared demo password.

After reset, run the RLS smoke checks against your local database:

```powershell
psql $env:DATABASE_URL -f supabase/rls_smoke.sql
```

or for a linked hosted project:

```powershell
supabase link --project-ref <project-ref>
supabase db push
```

Do not push local demo seed users into a production or pilot Supabase project.

## Development Commands

```powershell
npm run db:verify
npm run typecheck
npm run build
npm run test
npm audit --omit=dev
```

## Repository Docs

- `docs/01_PRD_GreenMiles.md`
- `docs/02_TRD_GreenMiles.md`
- `docs/03_UserFlow_GreenMiles.md`
- `docs/05_DevMilestones_GreenMiles.md`
- `docs/DASHBOARD_PLAN.md`
- `docs/GITHUB_PORTFOLIO.md`
- `docs/MVP_DEMO_SCRIPT.md`
- `docs/MVP_LIMITATIONS.md`

## Safety Rules

- Do not commit `.env.local`, real API keys, service-role keys, private keys, or wallet mnemonics.
- Do not deploy to production or mainnet from this MVP.
- Do not store real PII in seed/demo data.
- Do not represent GreenMiles points as official carbon credits.
