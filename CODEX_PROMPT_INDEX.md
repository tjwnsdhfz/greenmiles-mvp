# CODEX_PROMPT_INDEX — GreenMiles Prompt Map

| Order | File | Purpose | Based on source docs |
|---:|---|---|---|
| 0 | `CODEX_MASTER_PROMPT.md` | First overall project prompt | PRD/TRD/User Flow/Milestones |
| 1 | `tasks/01_bootstrap_db_auth_rls.md` | Project setup, DB, Auth, RLS | TRD sections 4–9; Milestone 1 |
| 2 | `tasks/02_catalog_pos_qr_claim.md` | Product registry, mock POS, QR claim | TRD sections 8, 12, 13; User Flow 4–6; Milestone 2 |
| 3 | `tasks/03_reward_engine_wallet.md` | Reward engine, ledger, consumer wallet | TRD sections 10–11; User Flow 8; Milestone 3 |
| 4 | `tasks/04_retailer_esg_dashboard.md` | Retailer ESG dashboard and export | PRD business model; TRD 15; User Flow 9; Milestone 4 |
| 5 | `tasks/05_receipt_upload_admin_review.md` | Receipt upload, manual review, optional OCR guard | TRD 14; User Flow 7; Milestone 5 |
| 6 | `tasks/06_mrv_blockchain_anchoring.md` | MRV batches, state transitions, testnet anchor | TRD 16–17; User Flow 10; Milestone 6 |
| 7 | `tasks/07_qa_demo_readme.md` | Full QA, demo data, README, deployment prep | DevMilestones QA/demo; all docs |
| P | `CODEX_PARALLEL_TRACKS.md` | Parallel task splitting plan | DevMilestones section 14 |
| E | `CODEX_ENV_AND_SECRETS.md` | Environment/secret guidance | TRD security; AGENTS |

Use one task file per Codex session or PR. Avoid asking Codex to implement all milestones at once.
