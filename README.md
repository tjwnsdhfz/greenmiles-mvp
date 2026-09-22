# GreenMiles MVP

GreenMiles is a dashboard-first MVP for a low-carbon/local agri-food reward platform. It demonstrates how SKU, virtual POS/QR purchase claims, GreenMiles points, estimated carbon contribution, retailer ESG metrics, receipt review, and MRV/testnet anchoring can fit into one startup-support prototype.

The MVP does not issue legal carbon credits or execute blockchain anchoring. MRV status in the dashboard is a field supplied by the sample or imported file, not independently verified evidence.

## Stack

- Next.js App Router
- TypeScript
- Supabase Auth, Postgres, RLS, Storage-ready structure
- npm
- Vitest for deterministic reward logic tests

## Current Demo Routes

- `/` redirects to `/retailer/dashboard`
- `/retailer/dashboard`: local purchase-record JSON import, filtering, derived totals, and CSV export
- `/retailer/pos`: mock POS/QR event screen
- `/claim`: consumer QR claim demo
- `/consumer/wallet`: consumer reward wallet demo
- `/farmer/products`: producer SKU registration/status shell
- `/admin/mrv`: MRV batch/status shell
- `/auth`: Supabase email/password sign-in/sign-up

The dashboard always starts with labeled demo records. Users can import their own JSON locally; these records remain in browser memory and reset on refresh. Configuring Supabase does not connect the dashboard to live records. Migrations and authentication scaffolding exist, but production integration and RLS behavior still require validation.

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
```

Apply locally after installing the Supabase CLI:

```powershell
supabase start
supabase db reset
```

or for a linked hosted project:

```powershell
supabase link --project-ref <project-ref>
supabase db push
```

## Development Commands

```powershell
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

## 2026-09-22 품질 점검

변경 내용, 재현한 문제, 검증 범위와 남은 한계: [품질 점검 기록](docs/QUALITY_AUDIT_20260922.md).
