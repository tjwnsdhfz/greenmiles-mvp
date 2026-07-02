import type { DashboardData, RecentTrip } from "./data";

type TravelMode = RecentTrip["travel_mode"];

export const travelModeLabels: Record<TravelMode, string> = {
  walk: "Walk",
  bike: "Bike",
  transit: "Transit",
  carpool: "Carpool",
  ev: "EV",
  car: "Car",
};

export function formatNumber(value: number, digits = 0) {
  return new Intl.NumberFormat("en", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value);
}

export function getModeBreakdown(trips: RecentTrip[]) {
  const counts = trips.reduce(
    (accumulator, trip) => {
      accumulator[trip.travel_mode] += 1;
      return accumulator;
    },
    {
      walk: 0,
      bike: 0,
      transit: 0,
      carpool: 0,
      ev: 0,
      car: 0,
    } satisfies Record<TravelMode, number>,
  );

  const total = Math.max(trips.length, 1);

  return Object.entries(counts)
    .map(([mode, count]) => ({
      mode: mode as TravelMode,
      label: travelModeLabels[mode as TravelMode],
      count,
      percent: Math.round((count / total) * 100),
    }))
    .filter((item) => item.count > 0);
}

export function getDistanceTrend(trips: RecentTrip[]) {
  return [...trips]
    .sort((a, b) => a.occurred_on.localeCompare(b.occurred_on))
    .slice(-6)
    .map((trip) => ({
      label: trip.occurred_on.slice(5),
      distanceKm: trip.distance_km,
    }));
}

export function getImpactStats(data: DashboardData) {
  const averageDistance =
    data.summary.trip_count > 0
      ? data.summary.total_distance_km / data.summary.trip_count
      : 0;

  return {
    averageDistance,
    carKmAvoided: data.summary.avoided_co2e_kg / 0.192,
    treeDaysEquivalent: data.summary.avoided_co2e_kg * 45,
  };
}
