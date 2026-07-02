import type { RecentTrip } from "@/features/dashboard/data";

type TravelMode = RecentTrip["travel_mode"];

const carKgCo2ePerKm = 0.192;

const modeFactorsKgCo2ePerKm: Record<TravelMode, number> = {
  walk: 0,
  bike: 0,
  transit: 0.041,
  carpool: 0.096,
  ev: 0.053,
  car: carKgCo2ePerKm,
};

export function estimateTripEmissions(distanceKm: number, travelMode: TravelMode) {
  const estimated = distanceKm * modeFactorsKgCo2ePerKm[travelMode];
  const baseline = distanceKm * carKgCo2ePerKm;

  return {
    estimatedCo2eKg: roundKg(estimated),
    avoidedCo2eKg: roundKg(Math.max(baseline - estimated, 0)),
  };
}

function roundKg(value: number) {
  return Math.round(value * 1000) / 1000;
}
