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
  if (!Number.isSafeInteger(input.amountKrw) || input.amountKrw < 0) {
    throw new RangeError("구매 금액은 0 이상의 안전한 원 단위 정수여야 합니다.");
  }
  if (!Number.isFinite(input.distanceKm) || input.distanceKm < 0) {
    throw new RangeError("운송 거리는 0 이상의 유한한 수여야 합니다.");
  }
  const basePoints = Math.floor(input.amountKrw * 0.01);
  const localMultiplier = input.localFood ? 1.4 : 1;
  const certificationMultiplier = input.lowCarbonCertified ? 1.35 : 1;
  const distanceMultiplier = input.distanceKm <= 50 ? 1.25 : input.distanceKm <= 200 ? 1 : 0.7;
  const multiplier = round(localMultiplier * certificationMultiplier * distanceMultiplier, 2);
  const rewardPoints = input.amountKrw === 0 ? 0 : Math.max(Math.round(basePoints * multiplier), 1);
  const baselineKg = input.distanceKm * 0.00018;
  const localReductionRatio = input.localFood ? 0.42 : 0.08;
  const certificationReductionRatio = input.lowCarbonCertified ? 0.28 : 0;

  return {
    rewardPoints,
    estimatedCarbonContributionKg: round(
      input.amountKrw === 0 ? 0 : baselineKg * (localReductionRatio + certificationReductionRatio),
      3,
    ),
    multiplier,
  };
}

export function haversineDistanceKm(
  origin: { lat: number; lon: number },
  destination: { lat: number; lon: number },
) {
  for (const point of [origin, destination]) {
    if (!Number.isFinite(point.lat) || !Number.isFinite(point.lon) || Math.abs(point.lat) > 90 || Math.abs(point.lon) > 180) {
      throw new RangeError("위도와 경도의 범위를 확인하세요.");
    }
  }
  const earthRadiusKm = 6371;
  const dLat = toRadians(destination.lat - origin.lat);
  const dLon = toRadians(destination.lon - origin.lon);
  const lat1 = toRadians(origin.lat);
  const lat2 = toRadians(destination.lat);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  const bounded = Math.min(1, Math.max(0, a));
  const c = 2 * Math.atan2(Math.sqrt(bounded), Math.sqrt(1 - bounded));

  return round(earthRadiusKm * c, 2);
}

function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

function round(value: number, digits: number) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}
