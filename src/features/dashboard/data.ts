import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/database.types";

export type DashboardSummary =
  Database["public"]["Views"]["trip_dashboard_summary"]["Row"];

export type RecentTrip = Pick<
  Database["public"]["Tables"]["trips"]["Row"],
  | "id"
  | "origin"
  | "destination"
  | "distance_km"
  | "travel_mode"
  | "estimated_co2e_kg"
  | "avoided_co2e_kg"
  | "occurred_on"
>;

export type DashboardData = {
  summary: DashboardSummary;
  recentTrips: RecentTrip[];
};

const emptySummary = (userId: string): DashboardSummary => ({
  user_id: userId,
  trip_count: 0,
  total_distance_km: 0,
  estimated_co2e_kg: 0,
  avoided_co2e_kg: 0,
  last_trip_on: null,
});

export async function getDashboardData(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<DashboardData> {
  const [summaryResult, tripsResult] = await Promise.all([
    supabase
      .from("trip_dashboard_summary")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle(),
    supabase
      .from("trips")
      .select(
        "id, origin, destination, distance_km, travel_mode, estimated_co2e_kg, avoided_co2e_kg, occurred_on",
      )
      .eq("user_id", userId)
      .order("occurred_on", { ascending: false })
      .limit(5),
  ]);

  if (summaryResult.error) {
    throw new Error(`Failed to load dashboard summary: ${summaryResult.error.message}`);
  }

  if (tripsResult.error) {
    throw new Error(`Failed to load recent trips: ${tripsResult.error.message}`);
  }

  return {
    summary: summaryResult.data ?? emptySummary(userId),
    recentTrips: tripsResult.data ?? [],
  };
}
