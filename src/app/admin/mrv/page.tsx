import type { Metadata } from "next";
import Link from "next/link";

import { demoDashboardData } from "@/features/dashboard/data";
import { getMrvBreakdown } from "@/features/dashboard/metrics";

export const metadata: Metadata = {
  title: "MRV Admin | GreenMiles",
};

export default function AdminMrvPage() {
  const mrv = getMrvBreakdown(demoDashboardData);

  return (
    <main className="auth-shell">
      <section className="auth-panel wide">
        <p className="eyebrow">관리자 MRV</p>
        <h1>검증 배치와 블록체인 기록 상태</h1>
        <p className="summary">
          MVP에서는 개인정보나 구매 상세 내역을 온체인에 저장하지 않고, 검증된
          배치 해시만 테스트넷 또는 로컬 앵커링 대상으로 다룹니다.
        </p>
        <div className="impact-list">
          {mrv.map((item) => (
            <p key={item.label}>
              <strong>{item.value}</strong>
              {item.label}
            </p>
          ))}
        </div>
        <Link className="text-link" href="/retailer/dashboard">
          대시보드로 돌아가기
        </Link>
      </section>
    </main>
  );
}
