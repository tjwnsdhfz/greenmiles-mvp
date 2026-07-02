# Codex Task 05 — Receipt Upload / Admin Review

## Role

You are a senior full-stack engineer implementing receipt-based purchase verification and admin review.

## Source documents to read first

1. `AGENTS.md`
2. `docs/02_TRD_GreenMiles.md` section 14
3. `docs/03_UserFlow_GreenMiles.md` section 7 and exception flows
4. `docs/05_DevMilestones_GreenMiles.md` Milestone 5

## Goal

Add receipt upload as an alternative purchase verification path for stores that cannot use QR/POS flow.

## Permissions

You may create, edit, delete, and refactor files; install dependencies; run terminal commands; configure storage policies; run tests; create branches; and propose PRs.

Do not call OCR APIs unless `ENABLE_RECEIPT_OCR=true` and a valid API key is explicitly present. Do not send real user PII to external OCR services. Do not commit secrets.

## Implementation requirements

### 1. Consumer receipt upload

Implement `/consumer/receipt` or equivalent:

- upload receipt image
- create `receipt_submissions` record
- status defaults to `pending`
- show upload history and status

### 2. Storage and security

- Store files in Supabase Storage or configured storage.
- Use access policies so users can access only their own submissions.
- Admin can review all pending receipts.

### 3. Optional OCR guard

If OCR is implemented:

- disabled by default
- controlled by `ENABLE_RECEIPT_OCR`
- extracted fields are stored as structured JSON
- manual admin review remains required
- never rely solely on OCR for approval in MVP

### 4. Admin review queue

Implement `/admin/review-receipts` or equivalent:

- list pending receipts
- view submitted image and extracted/manual fields
- approve with SKU matching
- reject with required reason
- allow consumer to see rejection reason

### 5. Approval integration

On approval:

- create or link purchase item
- run reward calculation
- create reward event and ledger entry
- update wallet balance

On rejection:

- no reward is created
- rejection reason is visible to consumer

## Acceptance criteria

- Consumer can upload receipt.
- Admin can approve/reject.
- Approved receipt creates reward and wallet update.
- Rejected receipt shows reason and creates no reward.
- Storage access is protected.
- OCR is optional and off by default.

## Tests to run

- Upload permission test.
- Admin approval flow test.
- Admin rejection flow test.
- Receipt approval → reward integration test.
- Storage access isolation test.
- Run lint/typecheck/tests.

## Final report format

Return:

1. Summary
2. Receipt flow implemented
3. Files changed
4. Tests run and results
5. OCR status and limitations
6. Suggested next task: `tasks/06_mrv_blockchain_anchoring.md`
