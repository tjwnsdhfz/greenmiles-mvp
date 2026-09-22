import type { RewardEvent } from "./data";
import { parseRecords } from "./records";

export type RecordSource = "DEMO" | "USER_INPUT";
export type RecordFile = { records: RewardEvent[]; source: RecordSource };
export const LOCAL_RECORD_KEY = "greenmiles-review-v1";

export function readRecordFile(text: string): RecordFile {
  if (new TextEncoder().encode(text).length > 1024 * 1024) throw new Error("기록 파일은 1MB 이하로 준비해 주세요.");
  let value: unknown;
  try { value = JSON.parse(text); } catch { throw new Error("JSON 형식을 읽지 못했습니다. 입력 예시와 비교해 주세요."); }
  if (Array.isArray(value)) return { records: parseRecords(text), source: "USER_INPUT" };
  const file = value as Record<string, unknown> | null;
  if (!file || file.format !== "greenmiles-review" || file.version !== 1 || !["DEMO", "USER_INPUT"].includes(String(file.source))) throw new Error("지원하는 구매 기록 배열 또는 GreenMiles v1 백업을 선택해 주세요.");
  return { records: parseRecords(JSON.stringify(file.records)), source: file.source as RecordSource };
}

export function writeRecordFile(records: RewardEvent[], source: RecordSource): string {
  const text = JSON.stringify({format:"greenmiles-review",version:1,source,records:parseRecords(JSON.stringify(records))}, null, 2);
  if (new TextEncoder().encode(text).length > 1024 * 1024) throw new Error("백업이 1MB를 넘습니다. 입력 건수를 줄여 주세요. 현재 기록은 유지됩니다.");
  return text;
}

export function reviseRecord(records: RewardEvent[], record: RewardEvent): RewardEvent[] {
  if (!records.some(row => row.id === record.id)) throw new Error("수정할 기록을 찾지 못했습니다.");
  return parseRecords(JSON.stringify(records.map(row => row.id === record.id ? {...record,mrvStatus:"not_submitted"} : row)));
}
