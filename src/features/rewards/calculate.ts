export type RewardInput = {
  amountKrw: number;
  distanceKm: number;
  lowCarbonCertified: boolean;
  localFood: boolean;
};

export type RewardResult = {
  rewardPoints: number;
  estimatedCarbonContributionKg: number;
  multiplier: number;
};

export function calculateReward(input: RewardInput): RewardResult {
  const basePoints = Math.floor(input.amountKrw * 0.01);
  const localMultiplier = input.localFood ? 1.4 : 1;
  const certificationMultiplier = input.lowCarbonCertified ? 1.35 : 1;
  const distanceMultiplier = input.distanceKm <= 50 ? 1.25 : input.distanceKm <= 200 ? 1 : 0.7;
  const multiplier = round(localMultiplier * certificationMultiplier * distanceMultiplier, 2);
  const rewardPoints = Math.max(Math.round(basePoints * multiplier), 1);
  const baselineKg = input.distanceKm * 0.00018;
  const localReductionRatio = input.localFood ? 0.42 : 0.08;
  const certificationReductionRatio = input.lowCarbonCertified ? 0.28 : 0;

  return {
    rewardPoints,
    estimatedCarbonContributionKg: round(
      baselineKg * (localReductionRatio + certificationReductionRatio),
      3,
    ),
    multiplier,
  };
}

export function haversineDistanceKm(
  origin: { lat: number; lon: number },
  destination: { lat: number; lon: number },
) {
  const earthRadiusKm = 6371;
  const dLat = toRadians(destination.lat - origin.lat);
  const dLon = toRadians(destination.lon - origin.lon);
  const lat1 = toRadians(origin.lat);
  const lat2 = toRadians(destination.lat);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return round(earthRadiusKm * c, 2);
}

function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

function round(value: number, digits: number) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}
