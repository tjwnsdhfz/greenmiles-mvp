import type { Metadata } from "next";
import RecordDashboard from "@/features/dashboard/record-dashboard";
export const metadata: Metadata = {
  title: "구매 기록 검토 | GreenMiles",
  description: "합성 샘플 구매 기록의 매장·상태별 필터와 CSV 내보내기",
};
export default function RetailerDashboardPage() { return <RecordDashboard />; }
