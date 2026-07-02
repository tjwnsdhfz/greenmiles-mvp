import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/lib/database.types";

import { requireSupabaseEnv } from "./env";

export function createClient() {
  const { supabaseUrl, supabaseAnonKey } = requireSupabaseEnv();

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}
