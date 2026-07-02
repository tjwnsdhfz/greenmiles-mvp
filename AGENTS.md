# AGENTS.md — GreenMiles Codex Project Guidance

## 0. Read this first

This repository is for **GreenMiles**, a blockchain-based agrifood carbon reward platform. Codex must read and follow this file before any task.

Before implementing, check the local documentation in this order:

1. `docs/01_PRD_GreenMiles.md` — product scope, business model, MVP/exclusions
2. `docs/02_TRD_GreenMiles.md` — technical requirements, tables, roles, security
3. `docs/03_UserFlow_GreenMiles.md` — user flows and exception flows
4. `docs/05_DevMilestones_GreenMiles.md` — milestone order and completion criteria
5. `docs/04_PromptDesign_GreenMiles.md` — prompt patterns and guardrails

If any requirement conflicts, follow this priority: **Security/legal constraints > TRD > User Flow > PRD > Milestones > Prompt Design**.

---

## 1. Product context

GreenMiles connects low-carbon/local agrifood purchase data with POS or QR/receipt verification. It provides:

- Consumers: GreenMiles reward points, purchase history, estimated carbon contribution, MRV status
- Retailers: ESG/Scope 3 reference dashboard, low-carbon sales, reward issuance, repeat purchase metrics
- Farmers/producers: SKU registry for low-carbon/local products, origin/certification/production data
- Admin/MRV partners: receipt review, reward verification, MRV batch creation, blockchain hash anchoring

The MVP must prove this loop:

**SKU registration → mock POS/QR or receipt purchase verification → deterministic reward calculation → wallet ledger update → retailer ESG dashboard aggregation → MRV batch → blockchain testnet hash anchoring**

---

## 2. Non-negotiable product wording rules

Never say or implement language implying that MVP rewards are legally issued carbon credits.

Use these labels:

- `estimated`: 예상 탄소 기여도
- `not_submitted`: MRV 미제출
- `submitted`: MRV 제출 완료
- `verified`: MRV 검증 완료
- `rejected`: MRV 반려
- `anchored`: 블록체인 기록 완료
- `GreenMiles reward points`: GreenMiles 리워드 포인트

Forbidden wording in UI, docs, comments, seed data, and README:

- “법정 탄소배출권 지급 완료”
- “공식 탄소크레딧 발급 완료”
- “실제 배출권 거래 완료”
- “탄소 상쇄 완료” unless backed by formal MRV/VCM partner verification outside this MVP

---

## 3. MVP scope

Implement:

1. Auth and role-based access for `consumer`, `farmer`, `retailer`, `admin`, `mrv_partner`
2. Product/SKU carbon registry
3. Farm/store geographic data and distance calculation
4. Mock POS event creation
5. One-time QR claim token flow
6. Receipt upload and manual admin review
7. Deterministic food-mileage reward engine
8. Consumer wallet and ledger
9. Retailer ESG dashboard
10. MRV batch creation and state transitions
11. Testnet-only blockchain batch hash anchoring
12. QA/demo data and README

Exclude from MVP:

- Real large-retailer POS API integration
- Legal carbon credit issuance/trading/retirement
- Mainnet deployment
- Native mobile app
- Fully automated OCR pipeline as a hard dependency
- Production payment/settlement

---

## 4. Preferred technical stack

Use unless the repository already contains a strong alternative:

- Frontend: Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, Recharts
- Backend: Next.js Route Handlers / Server Actions, Supabase server client
- Database/Auth/Storage: Supabase Postgres, Supabase Auth, Row Level Security, Supabase Storage
- Geo: PostGIS for farm-store distance; Haversine fallback in tests
- QR: QR generation library plus browser QR scanning library if needed
- Validation: Zod
- Testing: Vitest, Playwright, Hardhat tests
- Blockchain: Solidity, Hardhat, OpenZeppelin, ethers.js, Polygon Amoy or local Hardhat only
- Deployment: Vercel preview + Supabase staging project

---

## 5. Repository layout

Aim for this structure:

```text
app/
  (auth)/
  consumer/
  retailer/
  farmer/
  admin/
  claim/
components/
  ui/
  dashboards/
  forms/
  charts/
lib/
  supabase/
  rewards/
  mrv/
  blockchain/
  auth/
  validators/
types/
supabase/
  migrations/
  seed/
contracts/
scripts/
tests/
  unit/
  e2e/
docs/
```

If the repository structure already differs, preserve existing conventions and document any deviation.

---

## 6. Environment variables

Create `.env.example`. Never create or commit `.env.local` unless explicitly asked, and never include real values.

Required placeholders:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
ENABLE_RECEIPT_OCR=false
OPENAI_API_KEY=
POLYGON_AMOY_RPC_URL=
POLYGON_AMOY_PRIVATE_KEY=
GREENMILES_ANCHOR_CONTRACT_ADDRESS=
```

Rules:

- `SUPABASE_SERVICE_ROLE_KEY` must only be used server-side.
- `POLYGON_AMOY_PRIVATE_KEY` must only be used for testnet scripts.
- Never add mainnet private key env names unless explicitly instructed.
- OCR must be disabled by default.

---

## 7. Database requirements

Create migrations for these tables, based on `docs/02_TRD_GreenMiles.md`:

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

Enable RLS on all user-facing tables.

Role access summary:

- `consumer`: own profile, wallet, reward events, receipt submissions, claim flow
- `farmer`: own organization farms/SKUs/certificates and limited sales feedback
- `retailer`: own organization stores, POS events, purchase items, dashboard aggregates
- `admin`: operational review and management across all tables
- `mrv_partner`: submitted MRV batches and assigned verification actions

---

## 8. Implementation standards

- Use TypeScript strictly; avoid `any` unless justified in comments.
- Validate external inputs with Zod or equivalent.
- Make reward calculations deterministic and auditable.
- Store calculation snapshots with every reward event.
- Use transactions for claim → reward → ledger → wallet updates.
- Prevent duplicate QR claims with DB constraints and transaction-level checks.
- Use clear Korean UX copy for user-visible labels.
- Do not store PII, receipt originals, purchase details, or emails on-chain.
- Blockchain should store only `batch_hash`, metadata URI, actor, timestamp, and transaction hash.

---

## 9. Required tests

Each implementation task should add or update relevant tests.

Minimum required tests by MVP completion:

- Reward calculation determinism
- Reward multiplier edge cases
- QR claim success
- Duplicate QR claim rejection
- Expired QR claim rejection
- Receipt approval → reward generation
- Receipt rejection reason flow
- Role-based access restrictions
- Retailer dashboard aggregate correctness
- MRV status transitions
- Blockchain anchor success/failure handling on local/testnet
- No client-side exposure of service/private keys

Run, or create, these scripts:

```text
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npx hardhat test
```

If scripts are unavailable, add them or report why they cannot run.

---

## 10. Permission boundaries for Codex

Allowed:

- Create, edit, delete, and refactor files
- Install dependencies
- Run terminal commands
- Create Supabase migrations
- Write tests
- Run lint/typecheck/test/build
- Create branches and propose PRs
- Write local/testnet blockchain code

Not allowed without explicit confirmation:

- Production deployment
- Mainnet deployment
- Real API cost usage at scale
- Committing secrets or `.env.local`
- Sending real user PII to external APIs
- Using real carbon credit issuance, trading, or retirement flows
- Hardcoding private keys or service-role keys

---

## 11. Done definition

A task is done only when:

1. The requested files/features are implemented.
2. User-facing Korean copy follows the wording rules.
3. Tests are added or updated.
4. `lint`, `typecheck`, and relevant tests are run, or failures are clearly reported.
5. README or docs are updated if setup/behavior changed.
6. The final response includes:
   - Summary of changes
   - Files changed
   - Tests run and results
   - Known limitations
   - Recommended next task

