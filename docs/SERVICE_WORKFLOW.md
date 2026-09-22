# Purchase record review workflow

## Supported completion path
Open a JSON purchase array or GreenMiles v1 backup (1MB, up to 5,000 rows), validate all rows, filter and inspect derived totals, edit a review copy, export the filtered CSV and the complete reusable JSON backup. Optional explicit device storage can be reopened after reload. There is no automatic persistence or upload of these records.

Edits never change the original file or an operational ledger. Edited records become MRV `not_submitted`; importing statuses does not verify them. Synthetic example backups keep their DEMO label even after reopening. Imported user arrays are USER_INPUT, not verified evidence. One-step undo recovers the prior record set after import, sample switching or editing.

## Checks and evidence
28 unit tests pass, including backup round trips, evidence labels, validation and edit isolation. TypeScript and production build pass. Browser checks: edit one record, save/reload/restore, JSON export/import, CSV download, malformed input leaves current records, mobile375 width matches document width, desktop1440 inspected. CSV and JSON contents were reopened outside the app.

## Run / hosting
`npm ci`, `npm run check`, `npm run start -- -H 0.0.0.0 -p 3000`. Render existing account, Node Free, build `npm ci && npm run build`, start `npm run start -- -H 0.0.0.0 -p $PORT`. No database, AI or new paid service is required for the record-review flow. Supabase authentication and server workflows remain separately configured features; do not label them deployed because the review screen works.

Cost assumption: 1,000 sessions/month, one page load each, records processed locally; incremental API cost0. Render free instance hours are shared across the account (750h/month), bandwidth5GB, pipeline500min. Free instances sleep and may pause when shared quota is exhausted. No paid overage or uptime promise. Observe aggregate usage before adding traffic. This is an evidence-review tool; no customer or paid demand is validated.

## Recovery / next test
Revert the merge by PR or select previous successful Render deployment. Users can import downloaded JSON to recover work; keep original source files. Device storage is local to the browser and is not a secure team database. Proposed next validation: five retailer users complete a real monthly review and report time saved, data-format friction and willingness to pay. POS/MRV/blockchain example pages are not live integrations.
