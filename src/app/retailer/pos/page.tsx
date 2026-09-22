import type { Metadata } from "next";
import Link from "next/link";

import { demoDashboardData } from "@/features/dashboard/data";

export const metadata: Metadata = {
  title: "Mock POS | GreenMiles",
};

export default function RetailerPosPage() {
  const sku = demoDashboardData.skus[0];

  return (
    <main className="auth-shell">
      <section className="auth-panel wide">
        <p className="eyebrow">가상 POS</p>
        <h1>POS 구매 인증 흐름 예시</h1>
        <p className="summary">
          DEMO · 합성 샘플입니다. 이 화면에서는 구매 이벤트나 QR 토큰을 발급하지 않습니다.
        </p>
        <div className="demo-qr" aria-label="Mock QR code">
          GM
        </div>
        <p className="empty-state">
          샘플 이벤트: {sku.name} / {sku.storeName} / 토큰 미발급 · 화면 예시
        </p>
        <div className="form-actions">
          <Link className="secondary-action" href="/claim">
            소비자 claim 화면 열기
          </Link>
          <Link className="secondary-action" href="/retailer/dashboard">
            대시보드
          </Link>
        </div>
      </section>
    </main>
  );
}
