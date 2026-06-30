# Codex Task 07 — QA / Demo Data / README / Release Prep

## Role

You are the GreenMiles QA engineer and technical lead preparing the MVP demo.

## Source documents to read first

1. `AGENTS.md`
2. `docs/01_PRD_GreenMiles.md` sections 15–17
3. `docs/03_UserFlow_GreenMiles.md` all flows and exceptions
4. `docs/05_DevMilestones_GreenMiles.md` sections 16–17
5. `docs/02_TRD_GreenMiles.md` section 24

## Goal

Stabilize the MVP, add demo data, document setup, and verify the end-to-end GreenMiles demo flow.

## Permissions

You may create, edit, delete, and refactor files; install testing tools; run terminal commands; create tests; update README/docs; create branches; and propose PRs.

Do not deploy to production. Do not add real secrets. Do not use mainnet. Do not fabricate real MRV/VCM certification claims.

## Required demo flow

1. Admin has 5+ approved SKUs.
2. Retailer creates mock POS event and QR code.
3. Consumer scans QR and claims purchase.
4. Consumer wallet shows points and estimated carbon contribution.
5. Consumer uploads receipt.
6. Admin approves receipt.
7. Wallet updates again.
8. Retailer dashboard shows sales/reward/repeat/customer/local-food metrics.
9. Admin creates MRV batch.
10. Batch is verified.
11. Batch hash is anchored locally or on testnet.
12. UI shows “블록체인 기록 완료”.

## Implementation requirements

### 1. Demo data

Create seed/demo data:

- 3 consumer accounts or mock profiles
- 2 farmer organizations
- 2 retailer organizations
- 3 stores
- 20–30 SKUs
- multiple local and long-distance products
- active reward rules
- emission factor examples
- POS events and receipts for testing

Do not use real personal information.

### 2. QA checklist

Implement or document checks for:

- 5 roles login/access
- SKU registration/approval
- QR claim success
- duplicate/expired QR rejection
- deterministic reward calculation
- wallet display
- retailer dashboard filters
- receipt approval/rejection
- MRV batch state transitions
- blockchain anchor success/failure
- no PII on-chain
- no forbidden carbon-credit wording
- no service/private key exposure

### 3. Tests

Add or complete:

- unit tests
- integration tests
- E2E smoke test for core loop
- contract tests if blockchain module exists

### 4. README

Update README with:

- project overview
- architecture
- setup instructions
- env variables
- how to seed demo data
- how to run tests
- demo script
- known limitations
- legal wording disclaimer

### 5. Release notes

Create `docs/MVP_DEMO_SCRIPT.md` and `docs/MVP_LIMITATIONS.md`.

## Acceptance criteria

- A new developer can run the MVP from README.
- Core demo flow works end-to-end.
- QA checklist is documented and mostly automated where practical.
- No forbidden wording appears in UI strings or docs.
- No secrets are committed.

## Tests to run

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run test:e2e`
- `npx hardhat test` if contract exists

## Final report format

Return:

1. Summary
2. Demo flow status
3. QA checklist status
4. Files changed
5. Tests run and results
6. Known issues before pilot
7. Recommended next steps for user interviews/pilot
