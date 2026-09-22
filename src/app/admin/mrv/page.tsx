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
          DEMO · 아래 상태는 합성 시나리오입니다. 이 화면에서 실제 MRV 제출·검증·블록체인 기록을 실행하지 않습니다.
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
