"use client";

import { useState } from "react";
import Link from "next/link";
import { demoDashboardData, type RewardEvent } from "./data";
import { formatNumber } from "./metrics";
import { eventsCsv, filterEvents, parseRecords, summarizeEvents } from "./records";

const labels = { not_submitted: "미제출", submitted: "제출", verified: "검증", anchored: "기록" };

export default function RecordDashboard() {
  const [store, setStore] = useState("");
  const [status, setStatus] = useState("");
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [records, setRecords] = useState<RewardEvent[]>(demoDashboardData.rewardEvents);
  const [source, setSource] = useState("DEMO");
  const [importError, setImportError] = useState("");
  const [loading, setLoading] = useState(false);
  const events = filterEvents(records, store, status, query);
  const totals = summarizeEvents(events);
  const stores = [...new Set(records.map(event => event.storeName))];

  async function importFile(file?: File) {
    if (!file) return;
    setLoading(true); setImportError("");
    try {
      if (file.size > 1024 * 1024) throw new Error("1MB 이하의 JSON 파일을 선택해 주세요.");
      const imported = parseRecords(await file.text());
      setRecords(imported); setSource("USER_INPUT"); setStore(""); setStatus(""); setQuery("");
      setNotice(`${imported.length}건을 이 브라우저에서 열었습니다. 서버에 전송하거나 저장하지 않았습니다.`);
    } catch (error) { setImportError(error instanceof Error ? error.message : "파일을 열지 못했습니다."); }
    finally { setLoading(false); }
  }

  function template() {
    const url = URL.createObjectURL(new Blob([JSON.stringify(demoDashboardData.rewardEvents, null, 2)], { type: "application/json" }));
    const link = document.createElement("a"); link.href = url; link.download = "greenmiles-records-example.json"; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function download() {
    const url = URL.createObjectURL(new Blob([eventsCsv(events, source)], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url; link.download = "greenmiles-records.csv"; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice(`${events.length}건의 ${source} 기록 CSV 다운로드를 요청했습니다.`);
  }

  return <main className="dashboard-shell">
    <header className="dashboard-header">
      <div><p className="eyebrow">GreenMiles · 구매 기록 검토</p><h1>매장별 구매 기록과 리워드</h1>
        <p className="summary">매장과 처리 상태로 기록을 좁히고, 화면에 표시된 내역을 CSV로 내려받습니다.</p></div>
      <div className="source-badge demo"><span>{source === "DEMO" ? "DEMO · 합성 데이터" : "USER_INPUT · 가져온 기록"}</span><strong>{source === "DEMO" ? "실거래 연동 전" : "외부 검증 미확인"}</strong></div>
    </header>
    <p className="dashboard-notice">{source === "DEMO" ? "모든 수치는 아래 합성 샘플에서 합산합니다. 인증·MRV·블록체인 상태와 기여도는 시연용 가정입니다." : "가져온 파일의 수치와 상태를 표시합니다. 출처·인증·MRV·온체인 기록은 독립 검증하지 않았습니다. 파일은 서버에 전송하지 않으며 새로고침하면 사라집니다."}</p>
    <section className="record-filters" aria-label="내 기록 가져오기">
      <label>구매 기록 JSON<input type="file" accept=".json,application/json" disabled={loading} onChange={e => { const file = e.target.files?.[0]; e.target.value = ""; void importFile(file); }} /></label>
      <button type="button" onClick={template}>입력 예시 다운로드</button>
      <button type="button" disabled={loading} onClick={() => { setRecords(demoDashboardData.rewardEvents); setSource("DEMO"); setStore(""); setStatus(""); setQuery(""); setImportError(""); setNotice("합성 샘플로 돌아왔습니다."); }}>샘플로 돌아가기</button>
      {loading && <p role="status">파일을 확인하고 있습니다.</p>}
      {importError && <p role="alert">{importError} 기존 기록은 유지됩니다.</p>}
    </section>
    <nav className="dashboard-actions" aria-label="업무 화면">
      <Link href="/retailer/pos">POS 흐름 예시</Link><Link href="/claim">리워드 계산 예시</Link>
      <Link href="/farmer/products">상품 샘플</Link><Link href="/admin/mrv">MRV 상태 예시</Link>
      <Link href="/auth">로그인</Link>
    </nav>
    <section className="record-filters" aria-label="기록 필터">
      <label>매장<select value={store} onChange={e => setStore(e.target.value)}><option value="">전체 매장</option>{stores.map(name => <option key={name}>{name}</option>)}</select></label>
      <label>MRV 상태<select value={status} onChange={e => setStatus(e.target.value)}><option value="">전체 상태</option>{Object.entries(labels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <label>기록 검색<input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="상품명, 기록 ID, 소비자 식별자" /></label>
      <button type="button" onClick={() => { setStore(""); setStatus(""); setQuery(""); }}>필터 초기화</button>
    </section>
    <section className="metric-grid" aria-label="현재 필터 합계" aria-live="polite">
      {[["구매 기록", `${totals.count}건`], ["리워드 합계", `${formatNumber(totals.points)}P`], ["예상 탄소 기여도", `${formatNumber(totals.contribution, 3)}kg`], ["MRV 미제출", `${totals.pending}건`]].map(([label, value]) =>
        <article className="metric-card" key={label}><span>{label}</span><strong>{value}</strong></article>)}
    </section>
    <section className="dashboard-panel">
      <div className="section-heading"><h2>구매 기록</h2><button type="button" onClick={download} disabled={!events.length}>현재 목록 CSV 다운로드</button></div>
      <p role="status">{notice}</p>
      {events.length ? <div className="records-scroll" role="region" aria-label="구매 기록 표" tabIndex={0}><table className="records-table">
        <caption>{source} {events.length}건 · 표시된 수치와 상태는 독립 검증 전입니다.</caption>
        <thead><tr>{["기록 / 날짜", "매장", "상품", "포인트", "예상 기여 kg", "MRV 예시"].map(label => <th scope="col" key={label}>{label}</th>)}</tr></thead>
        <tbody>{events.map(event => <tr key={event.id}><th scope="row">{event.id}<small>{event.createdAt}</small></th><td>{event.storeName}</td><td>{event.skuName}</td><td>{formatNumber(event.rewardPoints)}</td><td>{formatNumber(event.carbonContributionKg, 3)}</td><td>{labels[event.mrvStatus]}</td></tr>)}</tbody>
      </table></div> : <p className="empty-state">조건에 맞는 기록이 없습니다. 검색어를 줄이거나 필터를 초기화하세요.</p>}
    </section>
  </main>;
}
