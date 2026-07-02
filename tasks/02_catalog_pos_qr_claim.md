# Codex Task 02 — Product Registry / Mock POS / QR Claim

## Role

You are a senior full-stack engineer implementing the GreenMiles purchase-verification foundation.

## Source documents to read first

1. `AGENTS.md`
2. `docs/02_TRD_GreenMiles.md` sections 8.4–8.10, 12, 13, 18
3. `docs/03_UserFlow_GreenMiles.md` sections 4–6 and 11
4. `docs/05_DevMilestones_GreenMiles.md` Milestone 2

## Goal

Implement SKU registry, farm/store data, mock POS purchase event creation, one-time QR claim token, and claim validation. Do not implement real POS API integration.

## Permissions

You may create, edit, delete, and refactor files; install dependencies; run terminal commands; create migrations; run tests; create branches; and propose PRs.

Do not deploy to production. Do not use mainnet. Do not commit secrets. Do not call paid APIs. Do not implement real large-retailer POS integration.

## Implementation requirements

### 1. Product/SKU registry

Implement farmer/admin-facing SKU registration based on `product_skus`, `farms`, and `stores`.

Minimum fields:

- product name
- category
- weight
- farm/origin
- target store/sales channel if applicable
- low-carbon certification flag
- production method
- packaging info
- status: `pending`, `approved`, `rejected`

### 2. Farm/store location

- Store latitude/longitude and/or PostGIS geography data.
- Calculate or prepare distance between farm and store.
- If PostGIS is unavailable in local dev, use a fallback calculation but keep DB model compatible.

### 3. Mock POS event

Implement `/retailer/pos` flow:

- retailer selects store
- retailer selects one or more approved SKU items
- retailer enters quantity/amount
- system creates a `pos_event`
- system creates `purchase_items` linked to the event
- system generates a one-time claim token
- system stores only a token hash, not raw token
- system shows a QR code pointing to `/claim?token=<raw_token>`

### 4. QR claim flow

Implement `/claim` flow:

- consumer must be logged in
- validate token hash
- reject expired token
- reject duplicate/claimed token
- mark event as claimed atomically
- defer reward creation to Task 03 if not yet ready, but prepare clean integration point

### 5. Seed data

Add seed data:

- at least 2 farms
- at least 2 stores
- at least 20 SKUs
- at least 1 retailer org
- at least 1 farmer org

Use fake/demo data only.

## Acceptance criteria

- SKU registration works for farmer/admin roles.
- Retailer can create mock POS purchase events.
- QR code is generated for a claim token.
- Consumer can open `/claim?token=...` and pass validation.
- Duplicate claim is rejected.
- Expired claim is rejected.
- Raw claim token is not stored in DB.

## Tests to run

- Unit test token hashing/validation.
- Integration or E2E test successful claim validation.
- Test duplicate claim rejection.
- Test expired token rejection.
- Run lint/typecheck/tests.

## Final report format

Return:

1. Summary of implementation
2. Data model changes
3. Files changed
4. Tests run and results
5. Known limitations
6. Suggested next task: `tasks/03_reward_engine_wallet.md`
