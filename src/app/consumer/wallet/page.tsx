import type { Metadata } from "next";
import Link from "next/link";

import { demoDashboardData } from "@/features/dashboard/data";
import { formatNumber } from "@/features/dashboard/metrics";

export const metadata: Metadata = {
  title: "Consumer Wallet | GreenMiles",
};

export default function ConsumerWalletPage() {
  const balance = demoDashboardData.rewardEvents.reduce(
    (total, event) => total + event.rewardPoints,
    0,
  );
  const contribution = demoDashboardData.rewardEvents.reduce(
    (total, event) => total + event.carbonContributionKg,
    0,
  );

  return (
    <main className="auth-shell">
      <section className="auth-panel wide">
        <p className="eyebrow">소비자 지갑</p>
        <h1>GreenMiles 포인트와 예상 탄소 기여도</h1>
        <div className="metric-grid compact">
          <article className="metric-card">
            <span>포인트 잔액</span>
            <strong>{formatNumber(balance)}P</strong>
          </article>
          <article className="metric-card">
            <span>예상 탄소 기여</span>
            <strong>{formatNumber(contribution, 1)}kg</strong>
          </article>
        </div>
        <p className="empty-state">
          MVP에서는 QR claim과 영수증 승인 후 지갑 원장에 포인트가 적립되는
          흐름을 시연합니다.
        </p>
        <Link className="text-link" href="/retailer/dashboard">
          대시보드로 돌아가기
        </Link>
      </section>
    </main>
  );
}
