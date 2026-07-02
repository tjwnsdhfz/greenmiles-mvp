import type { Metadata } from "next";
import Link from "next/link";

import { demoDashboardData } from "@/features/dashboard/data";
import { calculateReward } from "@/features/rewards/calculate";

export const metadata: Metadata = {
  title: "QR Claim | GreenMiles",
};

export default function ClaimPage() {
  const sku = demoDashboardData.skus[0];
  const reward = calculateReward({
    amountKrw: 12000,
    distanceKm: sku.distanceKm,
    lowCarbonCertified: sku.lowCarbonCertified,
    localFood: sku.distanceKm <= 50,
  });

  return (
    <main className="auth-shell">
      <section className="auth-panel wide">
        <p className="eyebrow">QR Claim</p>
        <h1>구매 인증과 리워드 적립</h1>
        <p className="summary">
          소비자가 QR을 스캔하면 SKU, 매장, 토큰 상태를 검증하고 결정적
          리워드 계산 결과를 지갑에 적립합니다.
        </p>
        <div className="metric-grid compact">
          <article className="metric-card">
            <span>예상 리워드</span>
            <strong>{reward.rewardPoints}P</strong>
          </article>
          <article className="metric-card">
            <span>예상 탄소 기여</span>
            <strong>{reward.estimatedCarbonContributionKg}kg</strong>
          </article>
        </div>
        <p className="empty-state">
          샘플 claim 대상: {sku.name} / 중복 claim은 POS 토큰 상태로 차단합니다.
        </p>
        <Link className="text-link" href="/consumer/wallet">
          지갑에서 확인
        </Link>
      </section>
    </main>
  );
}
