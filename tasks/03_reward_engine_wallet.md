# Codex Task 03 — Reward Engine / Wallet / Ledger

## Role

You are a senior backend/full-stack engineer implementing the GreenMiles reward core.

## Source documents to read first

1. `AGENTS.md`
2. `docs/02_TRD_GreenMiles.md` sections 10, 11, 13, 15, 24
3. `docs/03_UserFlow_GreenMiles.md` section 8
4. `docs/05_DevMilestones_GreenMiles.md` Milestone 3

## Goal

Wire purchase verification into deterministic reward calculation, create reward events, update wallet balances, and record ledger entries.

## Permissions

You may create, edit, delete, and refactor files; install dependencies; run terminal commands; create migrations; run tests; create branches; and propose PRs.

Do not use real carbon credit issuance. Do not call paid APIs. Do not use mainnet. Do not commit secrets.

## Implementation requirements

### 1. Deterministic reward engine

Implement or complete a module that uses:

- farm-store distance
- quantity/weight
- low-carbon certification flag
- local-food distance threshold
- production method
- emission factor version
- active reward rule

Output:

- reward points
- estimated carbon contribution
- calculation snapshot
- distance used
- rule version
- factor source/version

The same input must always produce the same output.

### 2. Claim-to-reward integration

When a QR claim succeeds:

- create `reward_events`
- create `ledger_entries`
- update `wallets.balance`
- mark reward status as `not_submitted` or `estimated`
- store the full calculation snapshot

Use a database transaction to avoid partial updates.

### 3. Consumer wallet UI

Implement `/consumer/wallet`:

- current GreenMiles point balance
- total estimated carbon contribution
- recent purchases/rewards
- status badges: 예상 탄소 기여도, MRV 미제출, MRV 검증 완료, 블록체인 기록 완료
- no claim of legal carbon credit issuance

### 4. Ledger integrity

Implement ledger entries with enough metadata to audit balance changes.

If using hash chaining:

- each entry references previous hash
- current entry hash is reproducible from canonical data
- do not over-engineer beyond MVP

## Acceptance criteria

- Successful QR claim creates exactly one reward event and one ledger entry.
- Wallet balance updates correctly.
- Same input returns same reward output.
- Duplicate claim cannot create duplicate reward.
- UI uses safe wording.

## Tests to run

- Reward calculation determinism tests.
- Multiplier edge case tests.
- Claim → reward → wallet integration test.
- Duplicate claim no duplicate reward test.
- Ledger balance consistency test.
- Run lint/typecheck/tests.

## Final report format

Return:

1. Summary
2. Reward formula explanation in plain language
3. Files changed
4. Tests run and results
5. Known limitations or assumptions in `[AI 보완]` terms
6. Suggested next task: `tasks/04_retailer_esg_dashboard.md`
