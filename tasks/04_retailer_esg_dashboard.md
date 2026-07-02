# Codex Task 04 — Retailer ESG Dashboard

## Role

You are a senior full-stack engineer and B2B SaaS dashboard builder.

## Source documents to read first

1. `AGENTS.md`
2. `docs/01_PRD_GreenMiles.md` sections 8, 9, 14, 15
3. `docs/02_TRD_GreenMiles.md` section 15
4. `docs/03_UserFlow_GreenMiles.md` section 9
5. `docs/05_DevMilestones_GreenMiles.md` Milestone 4

## Goal

Implement the retailer ESG dashboard that proves B2B SaaS value: retailers should see low-carbon/local product performance, reward activity, repeat purchases, local-food share, and Scope 3 reference metrics.

## Permissions

You may create, edit, delete, and refactor files; install dependencies; run terminal commands; create views/queries; run tests; create branches; and propose PRs.

Do not present Scope 3 estimates as official audited emissions. Do not expose consumer PII. Do not deploy to production.

## Implementation requirements

### 1. Dashboard route

Implement `/retailer/dashboard`.

### 2. Filters

Provide filters:

- date range
- store
- SKU
- category
- low-carbon certified only
- local-food threshold if available

### 3. Metrics

Include at minimum:

- total low-carbon/local product sales
- total GreenMiles points issued
- unique consumers
- repeat purchase rate
- local-food share
- estimated carbon contribution
- number of claimed purchases
- number of pending/verified/anchored reward events if available

### 4. Visualizations

Use charts for:

- daily/weekly reward points
- top SKUs by reward or sales
- local vs long-distance purchases
- status distribution

### 5. CSV export

Add CSV export for dashboard table data.

### 6. Safe labels

Use “Scope 3 참고 데이터” or “추정 참고값”, not “공식 Scope 3 인증 데이터”.

### 7. Data isolation

Retailers can only view their own organization’s stores, POS events, purchase items, and aggregate data.

## Acceptance criteria

- Dashboard renders with seeded data.
- Filters update metrics correctly.
- CSV export works.
- No consumer email/phone/raw receipt is shown.
- Scope 3 is explicitly marked as reference/estimated.

## Tests to run

- Aggregate query tests.
- Filter combination tests.
- CSV export test.
- Access-control test for retailer organization isolation.
- Run lint/typecheck/tests.

## Final report format

Return:

1. Summary
2. Dashboard metrics implemented
3. Files changed
4. Tests run and results
5. Known data limitations
6. Suggested next task: `tasks/05_receipt_upload_admin_review.md`
