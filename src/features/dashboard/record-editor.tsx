"use client";
import { useState } from "react";
import type { RewardEvent } from "./data";

export default function RecordEditor({record,onSave,onCancel}: {record:RewardEvent;onSave:(row:RewardEvent)=>void;onCancel:()=>void}) {
  const [draft,setDraft]=useState(record);
  const [error,setError]=useState("");
  return <form className="record-editor" onSubmit={e=>{e.preventDefault();try{onSave(draft);}catch(reason){setError(reason instanceof Error?reason.message:"수정 내용을 확인해 주세요.");}}}>
    <div className="section-heading"><h2>검토용 사본 수정 · {record.id}</h2><button type="button" onClick={onCancel}>수정 취소</button></div>
    <p>원본 파일과 서버 원장은 바뀌지 않습니다. 수정한 기록의 MRV 상태는 미제출로 돌아갑니다.</p>
    <div className="record-filters">
      <label>매장명<input required maxLength={300} value={draft.storeName} onChange={e=>setDraft({...draft,storeName:e.target.value})}/></label>
      <label>상품명<input required maxLength={300} value={draft.skuName} onChange={e=>setDraft({...draft,skuName:e.target.value})}/></label>
      <label>일자<input required type="date" value={draft.createdAt} onChange={e=>setDraft({...draft,createdAt:e.target.value})}/></label>
      <label>리워드 포인트<input required type="number" min="0" max="1000000000000" step="1" value={Number.isNaN(draft.rewardPoints)?"":draft.rewardPoints} onChange={e=>setDraft({...draft,rewardPoints:e.target.value===""?NaN:Number(e.target.value)})}/></label>
      <label>예상 기여도 kg<input required type="number" min="0" max="1000000000" step="any" value={Number.isNaN(draft.carbonContributionKg)?"":draft.carbonContributionKg} onChange={e=>setDraft({...draft,carbonContributionKg:e.target.value===""?NaN:Number(e.target.value)})}/></label>
    </div>
    {error&&<p role="alert">{error}</p>}
    <button type="submit">수정 적용</button>
  </form>;
}
