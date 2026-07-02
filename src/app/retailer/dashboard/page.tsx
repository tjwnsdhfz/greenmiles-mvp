import type { Metadata } from "next";
import Link from "next/link";

import { signOut } from "@/app/auth/actions";
import { demoDashboardData } from "@/features/dashboard/data";
import {
  formatNumber,
  getLocalVsLongDistance,
  getMrvBreakdown,
  getRewardTrend,
} from "@/features/dashboard/metrics";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export const metadata: Metadata = {
  title: "Retailer ESG Dashboard | GreenMiles",
  description: "GreenMiles retailer ESG dashboard MVP demo.",
};

export default function RetailerDashboardPage() {
  const data = demoDashboardData;
  const trend = getRewardTrend(data);
  const maxPoints = Math.max(...trend.map((item) => item.points), 1);
  const localMix = getLocalVsLongDistance(data);
  const mrvBreakdown = getMrvBreakdown(data);
  const isConfigured = hasSupabaseEnv();

  return (
    <main className="dashboard-shell">
      <section className="dashboard-header">
        <div>
          <p className="eyebrow">GreenMiles MVP</p>
          <h1>유통사 ESG 리워드 대시보드</h1>
          <p className="summary">
            저탄소·로컬 농식품 구매 인증 데이터를 리워드, 예상 탄소 기여도,
            MRV 상태로 연결하는 창업지원 시연용 대시보드입니다.
          </p>
        </div>
        <div className={`source-badge ${isConfigured ? "live" : "demo"}`}>
          <span>{isConfigured ? "Supabase ready" : "Demo data"}</span>
          <strong>{data.summary.retailerName}</strong>
        </div>
      </section>

      {!isConfigured ? (
        <p className="dashboard-notice">
          Supabase 환경값이 없어 현재는 데모 데이터로 표시합니다. 환경값과
          마이그레이션 적용 후 RLS 기반 실제 데이터로 전환할 수 있습니다.
        </p>
      ) : null}

      <nav className="dashboard-actions" aria-label="Dashboard actions">
        <Link href="/retailer/pos">가상 POS 이벤트</Link>
        <Link href="/claim">QR Claim 시연</Link>
        <Link href="/consumer/wallet">소비자 지갑</Link>
        <Link href="/admin/mrv">MRV 관리</Link>
        <Link href="/auth">로그인</Link>
        <form action={signOut}>
          <button type="submit">로그아웃</button>
        </form>
      </nav>

      <section className="metric-grid" aria-label="GreenMiles summary">
        <Metric label="구매 인증" value={`${formatNumber(data.summary.purchaseCount)}건`} />
        <Metric
          label="리워드 발행"
          value={`${formatNumber(data.summary.rewardPointsIssued)}P`}
        />
        <Metric
          label="예상 탄소 기여"
          value={`${formatNumber(data.summary.estimatedCarbonContributionKg, 1)}kg`}
        />
        <Metric label="로컬푸드 비중" value={`${data.summary.localFoodRatio}%`} />
      </section>

      <section className="dashboard-grid" aria-label="Retailer dashboard analysis">
        <section className="dashboard-panel trend-panel">
          <div className="section-heading">
            <span>리워드 발행 추이</span>
            <strong>최근 이벤트</strong>
          </div>
          <div className="trend-chart" aria-label="Recent reward points bars">
            {trend.map((item) => (
              <div className="trend-item" key={item.label}>
                <div className="trend-bar-wrap">
                  <div
                    className="trend-bar"
                    style={{
                      height: `${Math.max((item.points / maxPoints) * 100, 8)}%`,
                    }}
                  />
                </div>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-panel">
          <div className="section-heading">
            <span>상품 믹스</span>
            <strong>{data.summary.approvedSkuCount} approved SKUs</strong>
          </div>
          <div className="mode-list">
            {localMix.map((item) => (
              <div className="mode-row" key={item.label}>
                <div>
                  <strong>{item.label}</strong>
                  <span>{item.value} demo SKUs</span>
                </div>
                <div className="mode-meter" aria-hidden="true">
                  <span style={{ width: `${item.percent}%` }} />
                </div>
                <em>{item.percent}%</em>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-panel">
          <div className="section-heading">
            <span>MRV 상태</span>
            <strong>{data.summary.mrvReadyEvents} ready</strong>
          </div>
          <div className="impact-list">
            {mrvBreakdown.map((item) => (
              <p key={item.label}>
                <strong>{item.value}</strong>
                {item.label}
              </p>
            ))}
          </div>
        </section>

        <section className="dashboard-panel readiness-panel">
          <div className="section-heading">
            <span>파일럿 지표</span>
            <strong>창업지원 Demo</strong>
          </div>
          <ul className="readiness-list">
            <li>영수증 검토 대기 {data.summary.pendingReceiptCount}건</li>
            <li>재구매율 {data.summary.repeatCustomerRate}%</li>
            <li>블록체인에는 개인정보 없이 배치 해시만 기록</li>
          </ul>
        </section>
      </section>

      <section className="trip-panel" aria-label="Approved SKUs">
        <div className="section-heading">
          <span>승인 SKU 샘플</span>
          <strong>{data.skus.length} shown</strong>
        </div>
        <div className="trip-list">
          {data.skus.map((sku) => (
            <article className="trip-row" key={sku.id}>
              <div>
                <h2>{sku.name}</h2>
                <p>
                  {sku.farmName} / {sku.storeName} / {sku.productionMethod}
                </p>
              </div>
              <div className="trip-metrics">
                <strong>{formatNumber(sku.distanceKm)}km</strong>
                <span>{sku.lowCarbonCertified ? "저탄소 인증" : "비교군"}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <article className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}
