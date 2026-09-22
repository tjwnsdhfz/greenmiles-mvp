import { describe, expect, it } from "vitest";

import { calculateReward, haversineDistanceKm } from "./calculate";

describe("calculateReward", () => {
  it("does not award points or estimated contribution for a zero-value purchase", () => {
    expect(calculateReward({ amountKrw: 0, distanceKm: 10, lowCarbonCertified: true, localFood: true }))
      .toMatchObject({ rewardPoints: 0, estimatedCarbonContributionKg: 0 });
  });
  it.each([-1, NaN, Infinity, 1.5])("rejects invalid purchase amount %s", amountKrw => {
    expect(() => calculateReward({ amountKrw, distanceKm: 10, lowCarbonCertified: false, localFood: true })).toThrow(RangeError);
  });
  it.each([-1, NaN, Infinity])("rejects invalid distance %s", distanceKm => {
    expect(() => calculateReward({ amountKrw: 100, distanceKm, lowCarbonCertified: false, localFood: true })).toThrow(RangeError);
  });
  it("rejects invalid coordinates and supports antipodal coordinates", () => {
    expect(() => haversineDistanceKm({ lat: 91, lon: 0 }, { lat: 0, lon: 0 })).toThrow(RangeError);
    expect(haversineDistanceKm({ lat: 0, lon: 0 }, { lat: 0, lon: 180 })).toBeCloseTo(20015.09, 1);
  });
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
