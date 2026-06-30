# CODEX_PARALLEL_TRACKS — Parallel Work Plan for Codex

Use this only after Milestone 1 is stable.

## Track A — DB/Auth/RLS

Foundation track. Must be completed before other tracks merge.

Output:

- Migrations
- RLS policies
- seed data
- auth helpers
- role guards

## Track B — Catalog/POS/QR/Claim

Depends on Track A.

Output:

- SKU registry
- farm/store registry
- mock POS event creation
- QR claim token flow
- duplicate/expired claim prevention

## Track C — Reward Engine/Wallet

Depends on Track A and purchase model from Track B.

Output:

- deterministic reward calculation
- calculation snapshots
- wallet and ledger entries
- consumer wallet page

## Track D — Retailer Dashboard

Can start after Track A and basic purchase/reward data contracts are stable.

Output:

- dashboard metrics
- filters
- charts
- CSV export
- Scope 3 reference labeling

## Track E — Receipt/Admin Review

Can run in parallel with Track D after Track A.

Output:

- receipt upload
- storage policies
- admin review queue
- approval/rejection flow
- optional OCR stub with env flag

## Track F — MRV/Blockchain

Start after reward events are stable.

Output:

- MRV batch state machine
- canonical hashing
- anchor contract
- local/testnet deployment script
- anchor retry handling

## Track G — QA/Demo/Docs

Final integration track.

Output:

- seed demo data
- E2E tests
- README
- demo script
- QA checklist results
