import type { Metadata } from "next";
import Link from "next/link";

import { demoDashboardData } from "@/features/dashboard/data";

export const metadata: Metadata = {
  title: "Farmer Products | GreenMiles",
};

export default function FarmerProductsPage() {
  return (
    <main className="dashboard-shell">
      <section className="dashboard-header">
        <div>
          <p className="eyebrow">생산자 상품</p>
          <h1>저탄소 SKU 등록 현황</h1>
          <p className="summary">
            DEMO · 등록·승인 기능 연결 전의 상품 샘플입니다. 표시된 농가·인증 상태는 실제 등록 또는 인증 증빙이 아닙니다.
          </p>
        </div>
        <Link className="secondary-action" href="/retailer/dashboard">
          대시보드
        </Link>
      </section>
      <section className="trip-panel">
        <div className="trip-list">
          {demoDashboardData.skus.map((sku) => (
            <article className="trip-row" key={sku.id}>
              <div>
                <h2>{sku.name}</h2>
                <p>
                  {sku.farmName} / {sku.category} / {sku.productionMethod}
                </p>
              </div>
              <div className="trip-metrics">
                <strong>{sku.status}</strong>
                <span>{sku.lowCarbonCertified ? "저탄소 인증" : "비인증"}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
