"use server";

import { redirect } from "next/navigation";

import type { RecentTrip } from "@/features/dashboard/data";
import { estimateTripEmissions } from "@/features/trips/emissions";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

const travelModes = ["walk", "bike", "transit", "carpool", "ev", "car"] as const;

function redirectWithMessage(message: string) {
  redirect(`/trips/new?message=${encodeURIComponent(message)}`);
}

export async function createTrip(formData: FormData) {
  if (!hasSupabaseEnv()) {
    redirectWithMessage("Supabase env vars are required before saving trips.");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth?message=Sign in before adding a trip.");
  }

  const origin = String(formData.get("origin") ?? "").trim();
  const destination = String(formData.get("destination") ?? "").trim();
  const occurredOn = String(formData.get("occurred_on") ?? "").trim();
  const distanceKm = Number(formData.get("distance_km"));
  const travelMode = String(formData.get("travel_mode")) as RecentTrip["travel_mode"];

  if (!origin || !destination || !occurredOn) {
    redirectWithMessage("Origin, destination, and date are required.");
  }

  if (!Number.isFinite(distanceKm) || distanceKm <= 0) {
    redirectWithMessage("Distance must be greater than zero.");
  }

  if (!travelModes.includes(travelMode)) {
    redirectWithMessage("Choose a supported travel mode.");
  }

  const { estimatedCo2eKg, avoidedCo2eKg } = estimateTripEmissions(
    distanceKm,
    travelMode,
  );

  const { error } = await supabase.from("trips").insert({
    user_id: user.id,
    origin,
    destination,
    distance_km: distanceKm,
    travel_mode: travelMode,
    estimated_co2e_kg: estimatedCo2eKg,
    avoided_co2e_kg: avoidedCo2eKg,
    occurred_on: occurredOn,
  });

  if (error) {
    redirectWithMessage(error.message);
  }

  redirect("/dashboard");
}
