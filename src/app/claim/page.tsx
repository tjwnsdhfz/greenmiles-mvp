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
        <h1>샘플 구매의 리워드 계산</h1>
        <p className="summary">
          DEMO · 샘플 구매액 12,000원을 시연용 규칙으로 계산합니다. QR 검증·지갑 적립은 아직 연결되지 않았습니다.
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
          샘플 claim 대상: {sku.name} / 토큰 검증과 중복 적립 차단은 아직 구현되지 않았습니다.
        </p>
        <Link className="text-link" href="/consumer/wallet">
          지갑 화면 예시 보기
        </Link>
      </section>
    </main>
  );
}
