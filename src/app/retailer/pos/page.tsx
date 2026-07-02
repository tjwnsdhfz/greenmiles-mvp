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
        <h1>QR 구매 인증 이벤트 생성</h1>
        <p className="summary">
          실제 POS 연동 전, 유통사가 SKU와 매장을 선택해 일회성 QR claim
          토큰을 발급하는 MVP 흐름입니다.
        </p>
        <div className="demo-qr" aria-label="Mock QR code">
          GM
        </div>
        <p className="empty-state">
          샘플 이벤트: {sku.name} / {sku.storeName} / 토큰 상태 issued
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
