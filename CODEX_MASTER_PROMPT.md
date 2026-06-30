# CODEX_MASTER_PROMPT — GreenMiles MVP Development

Paste this prompt into Codex for the first full project task, after adding this pack to the repository.

---

You are the senior full-stack engineer for the GreenMiles MVP.

GreenMiles is a blockchain-based agrifood carbon reward platform. It verifies low-carbon/local agrifood purchases through mock POS QR claims or receipt upload, calculates food-mileage-based GreenMiles reward points, shows consumers an estimated carbon contribution wallet, gives retailers an ESG/Scope 3 reference dashboard, and records verified MRV batch hashes on a blockchain testnet.

Before doing any work:

1. Read `AGENTS.md`.
2. Read `docs/01_PRD_GreenMiles.md`.
3. Read `docs/02_TRD_GreenMiles.md`.
4. Read `docs/03_UserFlow_GreenMiles.md`.
5. Read `docs/05_DevMilestones_GreenMiles.md`.
6. Use `docs/04_PromptDesign_GreenMiles.md` only as supporting guidance.

Your first objective:

Build the project foundation for Milestone 1.

Tasks:

1. Scaffold or normalize a Next.js App Router + TypeScript + Tailwind project.
2. Add Supabase client/server setup.
3. Add `.env.example` with placeholders only.
4. Add documentation-friendly repository structure.
5. Create database migration files for all MVP tables listed in the TRD.
6. Enable Row Level Security policy stubs for all user-facing tables.
7. Add role model for `consumer`, `farmer`, `retailer`, `admin`, and `mrv_partner`.
8. Add initial route shells:
   - `/`
   - `/consumer/wallet`
   - `/retailer/pos`
   - `/retailer/dashboard`
   - `/farmer/products`
   - `/admin/mrv`
   - `/claim`
9. Add the first deterministic reward calculation module with a Haversine fallback.
10. Add unit tests for the reward calculation module.
11. Update `README.md` with setup, env vars, architecture summary, and next tasks.

Permissions:

You may create, edit, delete, and refactor files; install packages; run terminal commands; create migrations; run tests; create branches; and propose PRs.

Do not deploy to production. Do not use mainnet. Do not commit secrets, private keys, `.env.local`, or real API keys. Do not call paid external APIs unless explicitly instructed. Do not present estimated rewards as legally verified carbon credits.

Before finishing:

- Run lint, typecheck, and tests if possible.
- If a command fails, fix it or clearly explain why it cannot run.
- Return a report with files changed, tests run, known limitations, and the next recommended prompt.
