import { describe, expect, it } from "vitest";

import { calculateReward, haversineDistanceKm } from "./calculate";

describe("calculateReward", () => {
  it("rewards local low-carbon products more than long-distance uncertified products", () => {
    const localCertified = calculateReward({
      amountKrw: 12000,
      distanceKm: 18,
      lowCarbonCertified: true,
      localFood: true,
    });
    const longDistance = calculateReward({
      amountKrw: 12000,
      distanceKm: 3800,
      lowCarbonCertified: false,
      localFood: false,
    });

    expect(localCertified.rewardPoints).toBeGreaterThan(longDistance.rewardPoints);
    expect(localCertified.estimatedCarbonContributionKg).toBeGreaterThan(0);
  });

  it("calculates deterministic haversine distance", () => {
    const distance = haversineDistanceKm(
      { lat: 35.8714, lon: 128.6014 },
      { lat: 35.2383, lon: 128.6924 },
    );

    expect(distance).toBeCloseTo(70.88, 1);
  });
});
