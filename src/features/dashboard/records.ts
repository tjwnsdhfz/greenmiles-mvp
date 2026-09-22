import type { RewardEvent } from "./data";

export function filterEvents(events: RewardEvent[], store: string, status: string, query: string) {
  const term = query.trim().toLocaleLowerCase("ko-KR");
  return events.filter(event =>
    (!store || event.storeName === store) &&
    (!status || event.mrvStatus === status) &&
    (!term || [event.id, event.skuName, event.consumerLabel].some(value => value.toLocaleLowerCase("ko-KR").includes(term)))
  );
}

export function summarizeEvents(events: RewardEvent[]) {
  return {
    count: events.length,
    points: events.reduce((total, event) => total + event.rewardPoints, 0),
    contribution: events.reduce((total, event) => total + event.carbonContributionKg, 0),
    pending: events.filter(event => event.mrvStatus === "not_submitted").length,
  };
}

export function eventsCsv(events: RewardEvent[], source = "DEMO") {
  const cell = (value: string | number) => {
    let text = String(value);
    // Spreadsheet applications may execute cells beginning with a formula prefix.
    if (/^[\s]*[=+@-]/.test(text)) text = "'" + text;
    return '"' + text.replaceAll('"', '""') + '"';
  };
  return "\uFEFF" + [
    ["데이터 구분", "기록 ID", "일자", "매장", "상품", "포인트", "예상 탄소 기여도 kg", "MRV 상태"],
    ...events.map(event => [source, event.id, event.createdAt, event.storeName, event.skuName, event.rewardPoints, event.carbonContributionKg, event.mrvStatus]),
  ].map(row => row.map(cell).join(",")).join("\r\n");
}

export function parseRecords(text: string): RewardEvent[] {
  let records: unknown;
  try { records = JSON.parse(text); }
  catch { throw new Error("JSON 형식을 읽지 못했습니다. 입력 예시 파일과 비교해 주세요."); }
  if (!Array.isArray(records) || records.length > 5000) throw new Error("구매 기록 배열을 사용해 주세요. 최대 5,000건까지 검토할 수 있습니다.");
  const ids = new Set<string>();
  return records.map((value, index) => {
    if (!value || typeof value !== "object") throw new Error(`${index + 1}행: 기록 형식을 확인해 주세요.`);
    const row = value as Record<string, unknown>;
    for (const key of ["id", "consumerLabel", "skuName", "storeName", "createdAt"]) {
      if (typeof row[key] !== "string" || !row[key].trim() || row[key].length > 300) throw new Error(`${index + 1}행: ${key} 값을 확인해 주세요.`);
    }
    const date = String(row.createdAt);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date) throw new Error(`${index + 1}행: 날짜는 YYYY-MM-DD 형식의 실제 날짜여야 합니다.`);
    if (!Number.isSafeInteger(row.rewardPoints) || Number(row.rewardPoints) < 0 || Number(row.rewardPoints) > 1e12 ||
      typeof row.carbonContributionKg !== "number" || !Number.isFinite(row.carbonContributionKg) ||
      row.carbonContributionKg < 0 || row.carbonContributionKg > 1e9) throw new Error(`${index + 1}행: 포인트·기여도 수치를 확인해 주세요.`);
    if (!["not_submitted", "submitted", "verified", "anchored"].includes(String(row.mrvStatus))) throw new Error(`${index + 1}행: MRV 상태 값을 확인해 주세요.`);
    if (ids.has(String(row.id))) throw new Error(`${index + 1}행: 중복 기록 ID입니다.`);
    ids.add(String(row.id));
    return { id: String(row.id), consumerLabel: String(row.consumerLabel), skuName: String(row.skuName),
      storeName: String(row.storeName), createdAt: date, rewardPoints: Number(row.rewardPoints),
      carbonContributionKg: row.carbonContributionKg, mrvStatus: row.mrvStatus as RewardEvent["mrvStatus"] };
  });
}
