export type RetailerSummary = {
  retailerName: string;
  storeCount: number;
  approvedSkuCount: number;
  purchaseCount: number;
  rewardPointsIssued: number;
  estimatedCarbonContributionKg: number;
  localFoodRatio: number;
  repeatCustomerRate: number;
  pendingReceiptCount: number;
  mrvReadyEvents: number;
};

export type ProductSku = {
  id: string;
  name: string;
  farmName: string;
  storeName: string;
  category: string;
  distanceKm: number;
  lowCarbonCertified: boolean;
  productionMethod: string;
  status: "pending" | "approved" | "rejected";
};

export type RewardEvent = {
  id: string;
  consumerLabel: string;
  skuName: string;
  storeName: string;
  rewardPoints: number;
  carbonContributionKg: number;
  mrvStatus: "not_submitted" | "submitted" | "verified" | "anchored";
  createdAt: string;
};

export type DashboardData = {
  summary: RetailerSummary;
  skus: ProductSku[];
  rewardEvents: RewardEvent[];
};

export const demoDashboardData: DashboardData = {
  summary: {
    retailerName: "GreenMiles Local Food Pilot",
    storeCount: 3,
    approvedSkuCount: 24,
    purchaseCount: 318,
    rewardPointsIssued: 18420,
    estimatedCarbonContributionKg: 426.8,
    localFoodRatio: 68,
    repeatCustomerRate: 37,
    pendingReceiptCount: 9,
    mrvReadyEvents: 124,
  },
  skus: [
    {
      id: "sku-001",
      name: "저탄소 딸기 500g",
      farmName: "성주 스마트팜",
      storeName: "로컬푸드 매장 A",
      category: "과일",
      distanceKm: 18,
      lowCarbonCertified: true,
      productionMethod: "스마트팜",
      status: "approved",
    },
    {
      id: "sku-002",
      name: "로컬 상추 200g",
      farmName: "팔공산 농장",
      storeName: "로컬푸드 매장 B",
      category: "채소",
      distanceKm: 12,
      lowCarbonCertified: true,
      productionMethod: "노지 저탄소",
      status: "approved",
    },
    {
      id: "sku-003",
      name: "친환경 토마토 1kg",
      farmName: "달성 유리온실",
      storeName: "온라인 장보기",
      category: "채소",
      distanceKm: 31,
      lowCarbonCertified: true,
      productionMethod: "시설원예",
      status: "approved",
    },
    {
      id: "sku-004",
      name: "장거리 수입 바나나",
      farmName: "비교 기준 상품",
      storeName: "대형마트 비교군",
      category: "과일",
      distanceKm: 3800,
      lowCarbonCertified: false,
      productionMethod: "비교군",
      status: "approved",
    },
  ],
  rewardEvents: [
    {
      id: "reward-001",
      consumerLabel: "consumer-a",
      skuName: "저탄소 딸기 500g",
      storeName: "로컬푸드 매장 A",
      rewardPoints: 820,
      carbonContributionKg: 4.8,
      mrvStatus: "anchored",
      createdAt: "2026-07-02",
    },
    {
      id: "reward-002",
      consumerLabel: "consumer-b",
      skuName: "로컬 상추 200g",
      storeName: "로컬푸드 매장 B",
      rewardPoints: 430,
      carbonContributionKg: 2.1,
      mrvStatus: "verified",
      createdAt: "2026-07-01",
    },
    {
      id: "reward-003",
      consumerLabel: "consumer-c",
      skuName: "친환경 토마토 1kg",
      storeName: "온라인 장보기",
      rewardPoints: 610,
      carbonContributionKg: 3.4,
      mrvStatus: "submitted",
      createdAt: "2026-06-30",
    },
    {
      id: "reward-004",
      consumerLabel: "consumer-a",
      skuName: "저탄소 딸기 500g",
      storeName: "로컬푸드 매장 A",
      rewardPoints: 820,
      carbonContributionKg: 4.8,
      mrvStatus: "not_submitted",
      createdAt: "2026-06-29",
    },
  ],
};
