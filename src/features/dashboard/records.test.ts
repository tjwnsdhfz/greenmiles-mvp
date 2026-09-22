import { describe, expect, it } from "vitest";
import { demoDashboardData } from "./data";
import { eventsCsv, filterEvents, parseRecords, summarizeEvents } from "./records";
import { getLocalVsLongDistance } from "./metrics";
describe("reviewable dashboard records", () => {
  it("imports real user records without promoting their evidence state", () => {
    const input = JSON.stringify(demoDashboardData.rewardEvents);
    expect(parseRecords(input)).toEqual(demoDashboardData.rewardEvents);
    expect(eventsCsv(parseRecords(input), "USER_INPUT")).toContain('"USER_INPUT"');
  });
  it.each([
    null, {}, [null], [{ ...demoDashboardData.rewardEvents[0], rewardPoints: -1 }],
    [{ ...demoDashboardData.rewardEvents[0], carbonContributionKg: "not a number" }],
    [{ ...demoDashboardData.rewardEvents[0], createdAt: "2026-02-30" }],
    [{ ...demoDashboardData.rewardEvents[0], mrvStatus: "certified" }],
    [demoDashboardData.rewardEvents[0], demoDashboardData.rewardEvents[0]],
  ])("rejects malformed import before replacing displayed data", value => {
    expect(() => parseRecords(JSON.stringify(value))).toThrow();
  });
  it("totals are computed from the displayed subset", () => {
    const event = demoDashboardData.rewardEvents[0];
    const filtered = filterEvents(demoDashboardData.rewardEvents, event.storeName, event.mrvStatus, event.id);
    expect(filtered).toEqual([event]);
    expect(summarizeEvents(filtered)).toMatchObject({ count: 1, points: event.rewardPoints, contribution: event.carbonContributionKg });
  });
  it("handles empty search results without fabricated totals or NaN", () => {
    expect(summarizeEvents([])).toEqual({ count: 0, points: 0, contribution: 0, pending: 0 });
    expect(getLocalVsLongDistance({ ...demoDashboardData, skus: [] }).every(item => item.percent === 0)).toBe(true);
  });
  it("exports only selected records, with demo label, escaped quotes and formula protection", () => {
    const event = { ...demoDashboardData.rewardEvents[0], skuName: '=HYPERLINK("https://example.org")' };
    const csv = eventsCsv([event]);
    expect(csv).toContain('"DEMO"');
    expect(csv).toContain("'=HYPERLINK");
    expect(csv).toContain('""https://example.org""');
    expect(csv.split("\r\n")).toHaveLength(2);
  });
});
