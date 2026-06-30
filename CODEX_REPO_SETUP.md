# CODEX_REPO_SETUP — How to Use This Pack

## 1. Recommended GitHub repository structure

Create a repository such as:

```text
greenmiles-mvp/
  AGENTS.md
  CODEX_MASTER_PROMPT.md
  CODEX_REPO_SETUP.md
  tasks/
  docs/
```

Copy this entire pack into the repository root.

## 2. Start with these files

- `AGENTS.md`: persistent project instructions for Codex
- `CODEX_MASTER_PROMPT.md`: first prompt to paste into Codex
- `tasks/01_bootstrap_db_auth_rls.md`: first implementation task prompt
- `docs/01_PRD_GreenMiles.md` to `docs/05_DevMilestones_GreenMiles.md`: source documentation

## 3. Suggested Codex execution order

1. Run `CODEX_MASTER_PROMPT.md` or `tasks/01_bootstrap_db_auth_rls.md`.
2. Review generated repository, migrations, and tests.
3. Run `tasks/02_catalog_pos_qr_claim.md`.
4. Run `tasks/03_reward_engine_wallet.md`.
5. Run `tasks/04_retailer_esg_dashboard.md`.
6. Run `tasks/05_receipt_upload_admin_review.md`.
7. Run `tasks/06_mrv_blockchain_anchoring.md`.
8. Run `tasks/07_qa_demo_readme.md`.

## 4. Codex permissions to grant

Allow:

- File creation/edit/delete
- Dependency installation
- Terminal command execution
- Tests and builds
- Branch creation and PR proposal
- Local/testnet blockchain scripts

Do not allow without explicit manual approval:

- Production deployment
- Mainnet deployment
- Real API cost usage
- Secret or private key commit
- External transmission of real PII

## 5. Environment strategy

Start with local/staging only. Do not provide real production keys initially.

Use `.env.example` placeholders first. Add real staging values only after the project skeleton and migrations are reviewed.

## 6. Review checklist after each Codex task

- Did Codex follow `AGENTS.md`?
- Did it avoid forbidden carbon-credit wording?
- Did it update tests?
- Did it run lint/typecheck/tests?
- Did it avoid secrets?
- Did it document known limitations?
- Does the next task depend on unreviewed assumptions?

