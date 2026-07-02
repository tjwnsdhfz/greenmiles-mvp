# Codex Task 06 — MRV Batch / Blockchain Testnet Anchoring

## Role

You are a senior backend and blockchain engineer implementing GreenMiles MRV batch hashing and testnet anchoring.

## Source documents to read first

1. `AGENTS.md`
2. `docs/02_TRD_GreenMiles.md` sections 16, 17, 20–22
3. `docs/03_UserFlow_GreenMiles.md` section 10 and exception flows
4. `docs/05_DevMilestones_GreenMiles.md` Milestone 6

## Goal

Implement MRV batch creation, state transitions, canonical hashing, and testnet-only blockchain hash anchoring.

## Permissions

You may create, edit, delete, and refactor files; install blockchain dependencies; run local Hardhat tests; write testnet deployment scripts; create branches; and propose PRs.

Do not deploy to mainnet. Do not add mainnet config. Do not store PII or purchase details on-chain. Do not commit private keys.

## Implementation requirements

### 1. MRV state machine

Implement states:

- `draft`
- `submitted`
- `verified`
- `rejected`
- `anchored`

Valid transitions:

- draft → submitted
- submitted → verified
- submitted → rejected
- verified → anchored
- verified → retry pending if anchor fails

### 2. Batch creation

Admin selects eligible `reward_events`.

Create:

- `mrv_batches`
- `mrv_batch_items`
- item hashes
- batch hash
- metadata URI or storage path

### 3. Canonical hashing

Create reusable hashing utilities:

- stable JSON serialization
- item hash generation
- batch hash generation
- reproducible output for same input

### 4. Blockchain contract

Create a testnet/local contract that:

- uses role-based authorization
- anchors batch hashes
- rejects duplicate batch hashes
- emits an event for successful anchor

Do not implement token issuance or trading.

### 5. Anchoring service

Implement app-side anchor action/script:

- takes verified batch
- submits batch hash + metadata URI
- stores transaction hash
- marks batch as anchored if success
- records failure and allows retry if failed

### 6. UI

Admin/MRV page should show:

- batch status
- batch hash
- selected event count
- verifier
- transaction hash if anchored
- retry option for failed anchoring

## Acceptance criteria

- Admin can create MRV batch from eligible reward events.
- MRV partner/admin can verify or reject.
- Verified batch can be anchored locally or testnet-ready.
- Duplicate batch hashes are rejected.
- No PII or purchase detail is on-chain.
- UI uses “블록체인 기록 완료”, not carbon credit issuance wording.

## Tests to run

- Hash determinism tests.
- State transition tests.
- Contract tests for access control, duplicate rejection, event emission.
- Anchor failure retry test.
- Run lint/typecheck/tests and Hardhat tests.

## Final report format

Return:

1. Summary
2. MRV state machine implemented
3. Contract/anchoring approach
4. Files changed
5. Tests run and results
6. Known limitations
7. Suggested next task: `tasks/07_qa_demo_readme.md`
