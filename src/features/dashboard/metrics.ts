import type { DashboardData } from "./data";

export function formatNumber(value: number, digits = 0) {
  return new Intl.NumberFormat("ko-KR", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value);
}

export function getLocalVsLongDistance(data: DashboardData) {
  const local = data.skus.filter((sku) => sku.distanceKm <= 50).length;
  const longDistance = data.skus.length - local;

  return [
    { label: "로컬푸드", value: local, percent: Math.round((local / data.skus.length) * 100) },
    {
      label: "장거리/비교군",
      value: longDistance,
      percent: Math.round((longDistance / data.skus.length) * 100),
    },
  ];
}

export function getRewardTrend(data: DashboardData) {
  return [...data.rewardEvents]
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .map((event) => ({
      label: event.createdAt.slice(5),
      points: event.rewardPoints,
    }));
}

export function getMrvBreakdown(data: DashboardData) {
  const counts = data.rewardEvents.reduce(
    (accumulator, event) => {
      accumulator[event.mrvStatus] += 1;
      return accumulator;
    },
    {
      not_submitted: 0,
      submitted: 0,
      verified: 0,
      anchored: 0,
    },
  );

  return [
    { label: "대기", value: counts.not_submitted },
    { label: "제출", value: counts.submitted },
    { label: "검증", value: counts.verified },
    { label: "블록체인 기록 완료", value: counts.anchored },
  ].filter((item) => item.value > 0);
}
