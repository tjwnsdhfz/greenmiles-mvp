"use client";

import { useState } from "react";
import Link from "next/link";
import { demoDashboardData, type RewardEvent } from "./data";
import { formatNumber } from "./metrics";
import { eventsCsv, filterEvents, summarizeEvents } from "./records";

import RecordEditor from "./record-editor";
import { readRecordFile, writeRecordFile, reviseRecord, LOCAL_RECORD_KEY, type RecordSource, type RecordFile } from "./record-files";

const labels = { not_submitted: "미제출", submitted: "제출", verified: "검증", anchored: "기록" };

export default function RecordDashboard() {
  const [store, setStore] = useState("");
  const [status, setStatus] = useState("");
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [records, setRecords] = useState<RewardEvent[]>(demoDashboardData.rewardEvents);
  const [source, setSource] = useState<RecordSource>("DEMO");
  const [importError, setImportError] = useState("");
  const [loading, setLoading] = useState(false);
  const [editing,setEditing]=useState<RewardEvent|null>(null);
  const [previous,setPrevious]=useState<RecordFile|null>(null);
  function replace(file:RecordFile) { setPrevious({records,source});setRecords(file.records);setSource(file.source);setEditing(null);setStore("");setStatus("");setQuery(""); }
  function backup(local=false) {
    try { const text=writeRecordFile(records,source);
      if(local) { localStorage.setItem(LOCAL_RECORD_KEY,text);setNotice("이 기기에 사본을 저장했습니다. 공용 기기에서는 파일 백업을 이용하세요."); }
      else { saveFile(text,"greenmiles-review.json","application/json");setNotice("전체 기록 백업을 내려받았습니다. JSON 가져오기로 다시 열 수 있습니다."); }
    } catch(reason) { setImportError(reason instanceof Error?reason.message:"저장 공간이 부족합니다. 파일 백업을 이용하세요."); }
  }
  function restore() { try { const text=localStorage.getItem(LOCAL_RECORD_KEY);if(!text)throw new Error("이 기기에 저장한 사본이 없습니다.");replace(readRecordFile(text));setImportError("");setNotice("기기에 저장한 사본을 열었습니다."); }catch(reason){setImportError(reason instanceof Error?reason.message:"사본을 열지 못했습니다.");} }
  function saveFile(text:string,name:string,type:string) { const url=URL.createObjectURL(new Blob([text],{type}));const link=document.createElement("a");link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000); }
  const events = filterEvents(records, store, status, query);
  const totals = summarizeEvents(events);
  const stores = [...new Set(records.map(event => event.storeName))];

  async function importFile(file?: File) {
    if (!file) return;
    setLoading(true); setImportError("");
    try {
      if (file.size > 1024 * 1024) throw new Error("1MB 이하의 JSON 파일을 선택해 주세요.");
      const imported = readRecordFile(await file.text());
      replace(imported);
      setNotice(`${imported.records.length}건을 이 브라우저에서 열었습니다. 서버에 전송하거나 저장하지 않았습니다.`);
    } catch (error) { setImportError(error instanceof Error ? error.message : "파일을 열지 못했습니다."); }
    finally { setLoading(false); }
  }

  function template() { saveFile(writeRecordFile(demoDashboardData.rewardEvents,"DEMO"),"greenmiles-records-example.json","application/json"); }

  function download() {
    const url = URL.createObjectURL(new Blob([eventsCsv(events, source)], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url; link.download = "greenmiles-records.csv"; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice(`${events.length}건의 ${source} 기록 CSV 다운로드를 요청했습니다.`);
  }

  return <main className="dashboard-shell">
    <header className="dashboard-header">
      <div><p className="eyebrow">GreenMiles · 구매 기록 검토</p><h1>구매 기록을 정리하고,<br/>검토할 근거를 남기세요.</h1>
        <p className="summary">JSON 파일을 열고, 잘못된 기록을 수정한 뒤 CSV와 재사용 가능한 백업으로 보관하세요.</p></div>
      <div className="source-badge demo"><span>{source === "DEMO" ? "DEMO · 합성 데이터" : "USER_INPUT · 가져온 기록"}</span><strong>{source === "DEMO" ? "실거래 연동 전" : "외부 검증 미확인"}</strong></div>
    </header>
    <p className="dashboard-notice">{source === "DEMO" ? "모든 수치는 아래 합성 샘플에서 합산합니다. 인증·MRV·블록체인 상태와 기여도는 시연용 가정입니다." : "가져온 파일의 수치와 상태를 표시합니다. 출처·인증·MRV·온체인 기록은 독립 검증하지 않았습니다. 파일은 서버에 전송하지 않습니다. 새로고침 전에 파일 백업 또는 기기 저장을 선택하세요."}</p>
    <ol className="workflow-steps"><li><b>1</b> 내 기록 열기 <span>JSON · 1MB · 최대 5,000건</span></li><li><b>2</b> 확인하고 수정 <span>필터와 합계로 검토</span></li><li><b>3</b> 결과 보관 <span>CSV 공유 · JSON 재사용</span></li></ol>
    <section className="record-filters" aria-label="내 기록 가져오기">
      <label>구매 기록 JSON<input type="file" accept=".json,application/json" disabled={loading} onChange={e => { const file = e.target.files?.[0]; e.target.value = ""; void importFile(file); }} /></label>
      <button type="button" onClick={template}>입력 예시 다운로드</button>
      <button type="button" disabled={loading} onClick={() => { replace({records:demoDashboardData.rewardEvents,source:"DEMO"}); setStore(""); setStatus(""); setQuery(""); setImportError(""); setNotice("합성 샘플로 돌아왔습니다."); }}>샘플로 돌아가기</button>
      {loading && <p role="status">파일을 확인하고 있습니다.</p>}
      {importError && <p role="alert">{importError} 기존 기록은 유지됩니다.</p>}
    </section>
    <div className="record-storage"><button onClick={()=>backup()}>전체 기록 JSON 백업</button><button onClick={()=>backup(true)}>이 기기에 사본 저장</button><button onClick={restore}>저장한 사본 열기</button><button disabled={!previous} onClick={()=>{if(previous){setRecords(previous.records);setSource(previous.source);setPrevious(null);setEditing(null);setStore("");setStatus("");setQuery("");setNotice("바로 전 기록으로 돌아왔습니다.");}}}>이전 기록으로 되돌리기</button></div>
    <p className="storage-help">기기 저장은 이 브라우저에서만 유지됩니다. 공용 기기에서는 파일 백업을 선택하세요. 자동으로 저장하거나 서버로 전송하지 않습니다.</p>
    {editing&&<RecordEditor key={editing.id} record={editing} onCancel={()=>setEditing(null)} onSave={row=>{const revised=reviseRecord(records,row);replace({records:revised,source});setNotice(`${row.id} 사본을 수정했습니다. MRV 미제출 상태로 검토하세요.`);}}/>}
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
        <thead><tr>{["기록 / 날짜", "매장", "상품", "포인트", "예상 기여 kg", "파일의 MRV 상태", "수정"].map(label => <th scope="col" key={label}>{label}</th>)}</tr></thead>
        <tbody>{events.map(event => <tr key={event.id}><th scope="row">{event.id}<small>{event.createdAt}</small></th><td>{event.storeName}</td><td>{event.skuName}</td><td>{formatNumber(event.rewardPoints)}</td><td>{formatNumber(event.carbonContributionKg, 3)}</td><td>{labels[event.mrvStatus]}</td><td><button aria-label={`${event.id} 수정`} onClick={()=>setEditing(event)}>수정</button></td></tr>)}</tbody>
      </table></div> : <p className="empty-state">조건에 맞는 기록이 없습니다. 검색어를 줄이거나 필터를 초기화하세요.</p>}
    </section>
  </main>;
}
