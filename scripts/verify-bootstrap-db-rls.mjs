import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const migration = readFileSync(
  join(root, "supabase", "migrations", "20260702000000_bootstrap_auth_rls.sql"),
  "utf8",
).toLowerCase();
const dashboardMigration = readFileSync(
  join(root, "supabase", "migrations", "20260702001000_dashboard_read_model.sql"),
  "utf8",
).toLowerCase();
const seed = readFileSync(join(root, "supabase", "seed.sql"), "utf8").toLowerCase();
const rlsSmoke = readFileSync(join(root, "supabase", "rls_smoke.sql"), "utf8").toLowerCase();
const envExample = readFileSync(join(root, ".env.example"), "utf8");

const requiredTables = [
  "profiles",
  "organizations",
  "organization_members",
  "farms",
  "stores",
  "product_skus",
  "emission_factors",
  "reward_rules",
  "pos_events",
  "purchase_items",
  "receipt_submissions",
  "wallets",
  "reward_events",
  "ledger_entries",
  "mrv_batches",
  "mrv_batch_items",
];

const requiredRoles = ["consumer", "farmer", "retailer", "admin", "mrv_partner"];
const requiredSeedMarkers = [
  "consumer.demo@greenmiles.local",
  "retailer.demo@greenmiles.local",
  "farmer.demo@greenmiles.local",
  "admin.demo@greenmiles.local",
  "mrv.demo@greenmiles.local",
  "demo-local-tomato-claim",
  "demo-mrv-batch-hash-001",
];

const requiredRlsSmokeMarkers = [
  "consumer should see exactly one own wallet",
  "consumer should not see retailer stores",
  "retailer should see one organization store",
  "mrv partner should see one submitted batch",
  "admin should see five demo profiles",
];

const requiredEnvKeys = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_APP_URL",
  "ENABLE_RECEIPT_OCR",
  "OPENAI_API_KEY",
  "POLYGON_AMOY_RPC_URL",
  "POLYGON_AMOY_PRIVATE_KEY",
  "GREENMILES_ANCHOR_CONTRACT_ADDRESS",
];

const forbiddenExactPhrases = [
  "법정 탄소배출권 지급 완료",
  "공식 탄소크레딧 발급 완료",
  "실제 배출권 거래 완료",
  "상쇄권 소각 완료",
];

const failures = [];

for (const table of requiredTables) {
  if (!migration.includes(`create table public.${table}`)) {
    failures.push(`Missing table migration: ${table}`);
  }
  if (!migration.includes(`alter table public.${table} enable row level security`)) {
    failures.push(`Missing RLS enable statement: ${table}`);
  }
}

for (const role of requiredRoles) {
  if (!migration.includes(`'${role}'`)) {
    failures.push(`Missing user role enum value: ${role}`);
  }
}

for (const marker of requiredSeedMarkers) {
  if (!seed.includes(marker)) {
    failures.push(`Missing seed marker: ${marker}`);
  }
}

for (const marker of requiredRlsSmokeMarkers) {
  if (!rlsSmoke.includes(marker)) {
    failures.push(`Missing RLS smoke marker: ${marker}`);
  }
}

for (const key of requiredEnvKeys) {
  if (!new RegExp(`^${key}=`, "m").test(envExample)) {
    failures.push(`Missing .env.example key: ${key}`);
  }
}

if (!dashboardMigration.includes("with (security_invoker = true)")) {
  failures.push("Dashboard read model must use security_invoker=true");
}

if (!dashboardMigration.includes("public.is_org_member(stores.organization_id)")) {
  failures.push("Dashboard read model must remain organization-scoped");
}

for (const phrase of forbiddenExactPhrases) {
  if (
    migration.includes(phrase.toLowerCase()) ||
    seed.includes(phrase.toLowerCase()) ||
    rlsSmoke.includes(phrase.toLowerCase())
  ) {
    failures.push(`Forbidden carbon-credit wording found: ${phrase}`);
  }
}

const privateKeyLine = envExample
  .split(/\r?\n/)
  .find((line) => line.startsWith("POLYGON_AMOY_PRIVATE_KEY="));
if (privateKeyLine && privateKeyLine.trim() !== "POLYGON_AMOY_PRIVATE_KEY=") {
  failures.push("POLYGON_AMOY_PRIVATE_KEY must be an empty placeholder in .env.example");
}

if (failures.length > 0) {
  console.error(["DB/Auth/RLS bootstrap verification failed:", ...failures].join("\n- "));
  process.exit(1);
}

console.log(
  `DB/Auth/RLS bootstrap verification passed for ${requiredTables.length} tables, ${requiredRoles.length} roles, ${requiredSeedMarkers.length} seed markers, and ${requiredRlsSmokeMarkers.length} RLS smoke markers.`,
);
