# TRD: GreenMiles

> 블록체인 기반 농식품 탄소배출권 리워드 플랫폼 — Technical Requirement Document

---

## 목차

1. 문서 개요
2. 기술 목표
3. 전체 시스템 아키텍처
4. 권장 기술 스택
5. 프론트엔드 구조
6. 백엔드 구조
7. 데이터베이스 구조
8. 주요 테이블 설계
9. 역할 기반 권한 설계
10. 리워드 계산 로직 설명
11. 푸드 마일리지 기반 인센티브 구조
12. QR claim token 구조
13. 중복 claim 방지 방식
14. 영수증 업로드 및 검증 방식
15. 유통사 ESG 대시보드 데이터 집계 방식
16. MRV batch 생성 방식
17. 블록체인 해시 앵커링 방식
18. 외부 API 연동 방식
19. 성능 요구사항
20. 보안 요구사항
21. 개인정보 보호 요구사항
22. 법적/운영적 제약 조건
23. 확장성 고려사항
24. 테스트 요구사항
25. 핵심 요약
26. 다음 액션

---

## 1. 문서 개요

본 문서는 그린마일즈(GreenMiles) MVP의 기술적 요구사항, 시스템 구조, 데이터 구조, 보안·운영 제약을 정의한다. 실제 개발자가 구현 가능한 수준으로 구체적으로 작성하되, 코드 샘플은 포함하지 않는다. 데이터베이스 필드는 표로 정리하며, 블록체인은 메인넷이 아닌 테스트넷 또는 로컬 환경을 기준으로 한다. 실제 탄소배출권의 발행·거래·상쇄는 MVP 범위에서 제외하며, MRV/VCM 연계 가능성으로만 표현한다.

---

## 2. 기술 목표

| 목표 | 설명 |
|---|---|
| 빠른 MVP 검증 | 가상 POS, QR, 영수증 인증을 중심으로 빠르게 구현 가능한 구조 채택 |
| 권한 분리 | 소비자, 농가, 유통사, 관리자, MRV 파트너 간 명확한 권한 분리 |
| 데이터 신뢰성 | 리워드 계산의 결정성, 중복 claim 방지, 원장 무결성 확보 |
| 점진적 신뢰 구조 | 오프체인 데이터와 온체인 해시 앵커링을 분리하여 실제 배출권 발행 이전 단계에서도 데이터 위변조 가능성을 낮춤 |
| 확장 가능한 구조 | 향후 실제 POS API, VCM 파트너 연동을 고려한 모듈화 설계 |

---

## 3. 전체 시스템 아키텍처

그린마일즈는 다음 4개 레이어로 구성된다.

| 레이어 | 구성 요소 | 설명 |
|---|---|---|
| 클라이언트 레이어 | 소비자 웹앱(모바일 중심), 유통사/관리자 대시보드(데스크톱 중심) | Next.js 기반 단일 코드베이스, 역할별 화면 분기 |
| 애플리케이션 레이어 | Server Actions / Route Handlers, Supabase Edge Functions `[AI 보완]` | 리워드 계산, QR claim 처리, 대시보드 집계 로직 수행 |
| 데이터 레이어 | Supabase Postgres (RLS 적용), Supabase Storage | 트랜잭션 데이터, 영수증 이미지, 원장 데이터 저장 |
| 신뢰 레이어 | MRV 배치 처리 모듈, 블록체인 테스트넷 앵커링 | 검증 대상 데이터의 해시 기록을 통한 무결성 증명 |

데이터 흐름은 "구매 인증(QR/영수증) → 리워드 계산 → 원장 기록 → 대시보드 집계 → MRV 배치 → 온체인 해시 앵커링" 순서로 진행되며, 각 단계는 독립적으로 재시도 가능하도록 설계한다 `[AI 보완]`.

---

## 4. 권장 기술 스택

| 영역 | 기술 | 비고 |
|---|---|---|
| 프론트엔드 | Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, Recharts | `[AI 보완]` |
| 백엔드 | Next.js Server Actions/Route Handlers, Supabase Edge Functions | `[AI 보완]` |
| 데이터베이스 | Supabase Postgres, Row Level Security, PostGIS | `[AI 보완]` |
| 인증 | Supabase Auth | `[AI 보완]` |
| 파일 저장 | Supabase Storage | `[AI 보완]` |
| 인프라 | Vercel, Supabase hosted project | `[AI 보완]` |
| 블록체인 | Solidity, Hardhat, OpenZeppelin, ethers.js, Polygon Amoy 테스트넷 | `[AI 보완]`, 메인넷 배포 금지 |
| QR/스캔 | QR 생성 라이브러리, 브라우저 QR 스캔 라이브러리 | `[AI 보완]` |
| OCR | OpenAI Vision 또는 영수증 OCR API | `[AI 보완]`, MVP는 수동 승인 우선 |
| 지도/거리 계산 | PostGIS 거리 계산, Kakao Local/Directions 또는 Google Maps API | `[AI 보완]` |
| 테스트 | Vitest, Playwright, Hardhat contract tests | `[AI 보완]` |

---

## 5. 프론트엔드 구조

| 영역 | 구성 |
|---|---|
| 라우팅 구조 | 역할 기반 라우트 분리: `/consumer`, `/retailer`, `/farmer`, `/admin` (경로명 예시) |
| 상태 관리 | 서버 컴포넌트 우선, 클라이언트 상태는 최소화 `[AI 보완]` |
| 디자인 시스템 | shadcn/ui 기반 컴포넌트, 클린테크 톤(그린/화이트/네이비) 적용 |
| 반응형 대응 | 소비자 화면은 모바일 우선, 유통사/관리자 화면은 데스크톱 우선 + 모바일 대응 |
| 데이터 시각화 | Recharts를 활용한 유통사 대시보드 차트(판매량, 재구매율 추이 등) |

---

## 6. 백엔드 구조

| 모듈 | 책임 |
|---|---|
| Auth 모듈 | 회원가입/로그인, 역할(role) 할당 |
| Catalog 모듈 | SKU/농장/매장 등록 및 관리 |
| POS 모듈 | 가상 POS 이벤트 생성, QR 토큰 발급 |
| Claim 모듈 | QR claim 처리, 영수증 업로드 접수 |
| Reward Engine 모듈 | 푸드 마일리지·인증 여부 기반 리워드 계산 |
| Wallet 모듈 | 소비자 포인트 잔액, 이력 관리 |
| Dashboard 모듈 | 유통사 ESG 데이터 집계 |
| MRV 모듈 | 배치 생성, 상태 관리 |
| Anchoring 모듈 | 배치 해시 생성 및 테스트넷 기록 |
| Admin 모듈 | 상품 승인, 영수증 검토, 배출계수/정책 관리 |

각 모듈은 가능한 독립적으로 호출 가능하도록 설계하여, Codex 등 AI 개발 도구에 기능 단위로 작업을 분배할 수 있도록 한다.

---

## 7. 데이터베이스 구조

데이터베이스는 Supabase Postgres를 기준으로 하며, Row Level Security(RLS)를 통해 역할별 데이터 접근을 제한한다. 개인정보 및 구매 상세 내역은 온체인에 저장하지 않으며, 블록체인에는 MRV 배치 해시와 메타데이터 URI만 기록한다.

---

## 8. 주요 테이블 설계

### 8.1 profiles (사용자 프로필)

| 필드 | 타입 | 설명 |
|---|---|---|
| id | uuid | Auth 사용자 ID (PK) |
| role | text | consumer/farmer/retailer/admin/mrv_partner |
| display_name | text | 표시 이름 |
| created_at | timestamp | 생성일시 |

### 8.2 organizations (조직)

| 필드 | 타입 | 설명 |
|---|---|---|
| id | uuid | PK |
| name | text | 조직명(유통사/농가 단체 등) |
| type | text | retailer/farm_group/mrv_partner 등 |
| created_at | timestamp | 생성일시 |

### 8.3 organization_members (조직 구성원)

| 필드 | 타입 | 설명 |
|---|---|---|
| id | uuid | PK |
| organization_id | uuid | organizations FK |
| profile_id | uuid | profiles FK |
| role_in_org | text | 조직 내 역할 |

### 8.4 farms (농장/생산자)

| 필드 | 타입 | 설명 |
|---|---|---|
| id | uuid | PK |
| organization_id | uuid | organizations FK (`[AI 보완]` nullable) |
| name | text | 농장명 |
| location | geography(Point) | PostGIS 좌표 |
| certification_type | text | 저탄소 인증 종류 `[AI 보완]` |
| production_method | text | 생산 방식 |

### 8.5 stores (판매처)

| 필드 | 타입 | 설명 |
|---|---|---|
| id | uuid | PK |
| organization_id | uuid | organizations FK |
| name | text | 매장명 |
| location | geography(Point) | PostGIS 좌표 |
| channel_type | text | 로컬푸드매장/중소형유통/대형마트/온라인 |

### 8.6 product_skus (상품 SKU)

| 필드 | 타입 | 설명 |
|---|---|---|
| id | uuid | PK |
| farm_id | uuid | farms FK |
| store_id | uuid | stores FK |
| name | text | 상품명 |
| category | text | 카테고리 |
| weight | numeric | 중량 |
| low_carbon_certified | boolean | 저탄소 인증 여부 |
| packaging_info | text | 포장 정보 |
| distance_km | numeric | 산지-판매처 운송거리 (PostGIS 계산 결과 캐시) |
| status | text | pending/approved/rejected |

### 8.7 emission_factors (배출계수)

| 필드 | 타입 | 설명 |
|---|---|---|
| id | uuid | PK |
| category | text | 적용 카테고리 |
| factor_value | numeric | 배출계수 값 |
| unit | text | 단위 |
| source | text | 출처 `[AI 보완]` |
| updated_at | timestamp | 갱신일시 |

### 8.8 reward_rules (리워드 정책)

| 필드 | 타입 | 설명 |
|---|---|---|
| id | uuid | PK |
| rule_name | text | 정책명 |
| condition_json | jsonb | 적용 조건(운송거리, 인증여부 등) |
| reward_multiplier | numeric | 가중치 |
| is_active | boolean | 활성 여부 |

### 8.9 pos_events (가상 POS 이벤트)

| 필드 | 타입 | 설명 |
|---|---|---|
| id | uuid | PK |
| store_id | uuid | stores FK |
| sku_id | uuid | product_skus FK |
| qr_token | text | QR claim 토큰 |
| token_expires_at | timestamp | 토큰 만료시각 |
| status | text | issued/claimed/expired |
| created_at | timestamp | 생성일시 |

### 8.10 purchase_items (구매 항목)

| 필드 | 타입 | 설명 |
|---|---|---|
| id | uuid | PK |
| pos_event_id | uuid | pos_events FK (nullable) |
| receipt_submission_id | uuid | receipt_submissions FK (nullable) |
| sku_id | uuid | product_skus FK |
| quantity | numeric | 구매 수량 |
| amount | numeric | 구매 금액 |

### 8.11 receipt_submissions (영수증 제출)

| 필드 | 타입 | 설명 |
|---|---|---|
| id | uuid | PK |
| consumer_id | uuid | profiles FK |
| image_url | text | Storage 경로 |
| ocr_extracted_json | jsonb | OCR 추출 결과 `[AI 보완]` |
| status | text | pending/approved/rejected |
| reviewed_by | uuid | admin profile FK |
| created_at | timestamp | 생성일시 |

### 8.12 wallets (소비자 지갑)

| 필드 | 타입 | 설명 |
|---|---|---|
| id | uuid | PK |
| consumer_id | uuid | profiles FK |
| balance | numeric | 포인트 잔액 |
| updated_at | timestamp | 갱신일시 |

### 8.13 reward_events (리워드 이벤트)

| 필드 | 타입 | 설명 |
|---|---|---|
| id | uuid | PK |
| consumer_id | uuid | profiles FK |
| purchase_item_id | uuid | purchase_items FK |
| reward_points | numeric | 산정된 포인트 |
| estimated_carbon_contribution | numeric | 예상 탄소 기여도 |
| mrv_status | text | not_submitted/submitted/verified/rejected |
| created_at | timestamp | 생성일시 |

### 8.14 ledger_entries (원장 기록)

| 필드 | 타입 | 설명 |
|---|---|---|
| id | uuid | PK |
| reward_event_id | uuid | reward_events FK |
| entry_type | text | credit/adjustment |
| amount | numeric | 변동량 |
| prev_hash | text | 이전 항목 해시 `[AI 보완]` |
| entry_hash | text | 현재 항목 해시 `[AI 보완]` |
| created_at | timestamp | 생성일시 |

### 8.15 mrv_batches (MRV 배치)

| 필드 | 타입 | 설명 |
|---|---|---|
| id | uuid | PK |
| batch_period_start | date | 배치 시작일 |
| batch_period_end | date | 배치 종료일 |
| status | text | draft/submitted/verified/anchored/rejected |
| batch_hash | text | 배치 전체 해시 |
| anchor_tx_hash | text | 온체인 트랜잭션 해시 |
| created_at | timestamp | 생성일시 |

### 8.16 mrv_batch_items (MRV 배치 항목)

| 필드 | 타입 | 설명 |
|---|---|---|
| id | uuid | PK |
| mrv_batch_id | uuid | mrv_batches FK |
| reward_event_id | uuid | reward_events FK |
| item_hash | text | 개별 항목 해시 |

---

## 9. 역할 기반 권한 설계

| 역할 | 주요 권한 |
|---|---|
| consumer | 본인 지갑/이력 조회, QR claim, 영수증 업로드 |
| farmer | 본인 농장/SKU 등록 및 수정 요청, 판매 반응 조회(제한적) |
| retailer | 매장/SKU 등록, 가상 POS 이벤트 생성, 대시보드 조회 |
| admin | 전체 데이터 조회, 상품 승인, 영수증 검토, 배출계수/정책 관리, MRV 상태 관리 |
| mrv_partner | MRV 배치 조회 및 검증 상태 변경(제한적 권한) |

RLS 정책은 각 테이블에 대해 "본인 소유 데이터" 또는 "소속 조직 데이터"만 조회/수정 가능하도록 구성하며, admin은 모든 테이블에 대해 별도 정책으로 전체 접근 권한을 가진다 `[AI 보완]`.

---

## 10. 리워드 계산 로직 설명

리워드는 다음 요소를 결합하여 산정한다.

1. 기준 포인트: 구매 금액 또는 수량 기반 기본 포인트
2. 운송거리 가중치: 산지-판매처 거리(PostGIS 계산)가 짧을수록 가중치 상승
3. 저탄소 인증 가중치: 인증 여부에 따른 추가 가중치
4. 생산 방식 가중치: 스마트팜/저탄소 농법 등 생산 방식에 따른 가중치 `[AI 보완]`
5. 배출계수 반영: emission_factors 테이블의 카테고리별 계수를 활용해 예상 탄소 기여도 산출

계산 결과는 reward_events 테이블에 reward_points와 estimated_carbon_contribution으로 각각 기록되며, 동일 입력에 대해 항상 동일한 결과가 나오도록 결정적(deterministic) 로직으로 구현한다.

---

## 11. 푸드 마일리지 기반 인센티브 구조

| 조건 | 가중치 방향 |
|---|---|
| 운송거리가 짧을수록 | 가중치 상승 |
| 저탄소 인증 상품 | 가중치 상승 |
| 로컬푸드 상품 | 가중치 상승 |
| 저탄소 생산 방식(스마트팜 등) | 가중치 상승 |
| 인증 정보 미비 SKU | 기본 가중치만 적용, 추가 가중치 미부여 |

가중치 산식의 구체적 계수는 emission_factors 및 reward_rules 테이블을 통해 운영 중 조정 가능하도록 설계한다 `[AI 보완]`.

---

## 12. QR claim token 구조

| 항목 | 설명 |
|---|---|
| 토큰 형식 | 무작위 고유 문자열(UUID 기반) `[AI 보완]` |
| 연결 데이터 | pos_event_id, sku_id, store_id |
| 유효기간 | 발급 후 일정 시간(`[AI 보완]` 예: 24시간) 내 claim 필요 |
| 1회성 | claim 완료 시 status를 claimed로 변경하여 재사용 방지 |
| 검증 절차 | claim 요청 시 토큰 유효성, 만료 여부, 중복 사용 여부를 서버에서 검증 |

---

## 13. 중복 claim 방지 방식

- QR 토큰은 1회만 claim 가능하며, claim 성공 시 즉시 status를 claimed로 갱신한다.
- 동일 pos_event_id에 대한 중복 claim 요청은 서버 측에서 거부한다.
- 영수증 업로드의 경우, 동일 영수증 이미지 해시 또는 (판매처+구매일시+금액) 조합의 중복 여부를 관리자 검토 시 확인한다 `[AI 보완]`.
- 모든 claim 처리는 데이터베이스 트랜잭션 내에서 원자적으로 처리하여 동시 요청에 의한 중복 적립을 방지한다.

---

## 14. 영수증 업로드 및 검증 방식

| 단계 | 설명 |
|---|---|
| 업로드 | 소비자가 영수증 이미지를 Storage에 업로드하고 receipt_submissions 레코드 생성 |
| OCR 보조 추출(선택) | OCR API를 통해 판매처, 구매일시, 상품명, 금액을 추출하여 참고 데이터로 저장 `[AI 보완]` |
| 관리자 검토 | MVP에서는 관리자가 1차적으로 수동 검토 및 승인/반려 처리 |
| 승인 시 처리 | 승인된 영수증은 purchase_items 레코드로 변환되어 리워드 계산 로직으로 전달 |
| 반려 시 처리 | 반려 사유를 소비자에게 안내하고 재제출 가능하도록 안내 |

---

## 15. 유통사 ESG 대시보드 데이터 집계 방식

| 집계 항목 | 산출 방식 |
|---|---|
| 저탄소 상품 판매량 | 기간/매장/SKU/카테고리 필터 기준 purchase_items 집계 |
| 리워드 발행량 | 기간별 reward_events 합산 |
| 고객 재구매율 | 동일 consumer_id의 기간 내 재구매 비율 계산 |
| 로컬푸드 전환율 | 전체 판매 대비 로컬푸드/저탄소 인증 상품 판매 비중 |
| Scope 3 참고 데이터 | emission_factors와 판매 데이터를 결합한 참고용 배출량 추정치(공식 인증 아님을 명시) |

집계는 일/주/월 단위 배치 또는 쿼리 시점 실시간 집계 중 MVP 단계에서는 쿼리 시점 집계를 우선한다 `[AI 보완]`.

---

## 16. MRV batch 생성 방식

1. 관리자가 특정 기간(예: 1주~1개월)의 reward_events 중 검증 대상을 선택한다.
2. 선택된 이벤트들을 mrv_batches 레코드로 묶고, 각 항목의 item_hash를 생성하여 mrv_batch_items에 저장한다.
3. 전체 배치에 대한 batch_hash를 생성한다(개별 item_hash들의 결합 해시) `[AI 보완]`.
4. MRV 파트너 또는 관리자가 배치 상태를 submitted → verified로 변경한다.
5. verified 상태의 배치는 블록체인 앵커링 대상이 된다.

---

## 17. 블록체인 해시 앵커링 방식

| 항목 | 설명 |
|---|---|
| 네트워크 | Polygon Amoy 테스트넷(또는 동등 테스트넷) `[AI 보완]`, 메인넷 배포 금지 |
| 기록 대상 | mrv_batches의 batch_hash 및 메타데이터 URI만 기록 |
| 저장하지 않는 것 | 개인정보, 구매 상세 내역, 영수증 이미지 원본 |
| 트랜잭션 결과 | anchor_tx_hash를 mrv_batches에 저장, 상태를 anchored로 갱신 |
| 실패 처리 | 앵커링 실패 시 상태를 verified로 유지하고 재시도 큐에 등록 `[AI 보완]` |
| 표현 규칙 | "탄소배출권 발행 완료"가 아닌 "블록체인 기록 완료"로 표현 |

---

## 18. 외부 API 연동 방식

| 연동 대상 | 방식 | MVP 범위 |
|---|---|---|
| POS API | 실제 연동 대신 가상 POS 이벤트 생성 기능으로 대체 | 가상 POS만 구현 |
| QR 인증 | 자체 QR 생성/스캔 라이브러리 활용 | 구현 |
| 영수증 OCR | 외부 OCR API 연동 가능하나 수동 승인 우선 | 보조 기능 |
| 지도/거리 계산 | PostGIS 또는 외부 지도 API로 산지-판매처 거리 계산 | 구현 |
| VCM/MRV 파트너 | 데이터 포맷 정의 수준, 실제 계약/정산 연동은 제외 | `[추정]` |
| 블록체인 테스트넷 | RPC 연동을 통한 해시 기록 | 구현 |
| CSV/리포트 Export | 대시보드 데이터를 CSV로 내보내기 | `[AI 보완]` |

---

## 19. 성능 요구사항

| 항목 | 요구사항 |
|---|---|
| QR claim 응답 시간 | 평균 2초 이내 `[AI 보완]` |
| 대시보드 집계 조회 | 평균 3초 이내(파일럿 데이터 규모 기준) `[AI 보완]` |
| 동시 사용자 | MVP 기준 동시 접속 50명 수준 대응 `[추정]` |
| 블록체인 앵커링 | 비동기 처리, 사용자 대기 없이 백그라운드 처리 |

---

## 20. 보안 요구사항

- service role key, private key 등 민감 정보는 클라이언트에 노출하지 않는다.
- 모든 API 요청은 인증된 세션 기준으로 권한을 검증한다.
- RLS를 통해 데이터베이스 레벨에서도 권한을 이중으로 검증한다.
- QR 토큰은 추측 불가능한 무작위 값으로 생성한다.
- 관리자 기능은 별도 역할 검증을 거쳐야 접근 가능하다.

---

## 21. 개인정보 보호 요구사항

- 개인정보 및 구매 상세 내역은 블록체인(온체인)에 저장하지 않는다.
- 영수증 이미지 등 민감 파일은 파일 스토리지에 저장하고 접근 권한을 제한한다.
- 블록체인에는 MRV 배치 해시와 메타데이터 URI만 기록한다.
- 소비자 식별 정보는 내부 DB에서도 최소 수집 원칙을 따른다 `[AI 보완]`.

---

## 22. 법적/운영적 제약 조건

- 실제 법정 탄소배출권의 발행, 거래, 상쇄는 MVP 범위에서 수행하지 않는다.
- "MRV 검증 완료", "블록체인 기록 완료"는 데이터 처리 상태를 의미하며, 공식 탄소크레딧 발급을 의미하지 않는다.
- 블록체인은 테스트넷 또는 로컬 환경에서 운영하며, 메인넷 배포는 본 MVP 범위에서 제외한다.
- 모든 사용자 인터페이스에서 리워드를 "탄소배출권"이 아닌 "GreenMiles 리워드 포인트"로 표기한다.

---

## 23. 확장성 고려사항

- 가상 POS 모듈은 향후 실제 POS API 어댑터로 교체 가능한 인터페이스로 설계한다 `[AI 보완]`.
- emission_factors, reward_rules는 운영 중 조정 가능한 설정 테이블로 분리한다.
- MRV 배치 구조는 향후 실제 VCM 파트너 연동 시 동일한 데이터 포맷을 활용할 수 있도록 설계한다.
- 블록체인 컨트랙트는 메인넷 전환 시 동일한 인터페이스로 재배포 가능하도록 작성한다 `[추정]`.

---

## 24. 테스트 요구사항

| 테스트 영역 | 항목 |
|---|---|
| 단위 테스트 | 리워드 계산 로직의 결정성 검증 |
| 통합 테스트 | QR claim → 리워드 적립 → 지갑 반영 전체 흐름 검증 |
| 권한 테스트 | 역할별 RLS 정책 정상 동작 검증 |
| 중복 방지 테스트 | 동시 요청 시 중복 claim 방지 검증 |
| 블록체인 테스트 | 테스트넷 앵커링 트랜잭션 성공/실패 케이스 검증 |
| 보안 테스트 | 민감 키 노출 여부, 권한 우회 가능성 점검 |

---

## 핵심 요약

TRD는 그린마일즈 MVP의 시스템 아키텍처, 16개 핵심 테이블 설계, 역할 기반 권한 구조, 리워드 계산 로직, QR/영수증 인증 방식, MRV 배치 및 블록체인 테스트넷 앵커링 방식을 정의한다. 개인정보와 구매 상세 데이터는 온체인에 저장하지 않으며, 모든 블록체인 작업은 테스트넷 기준으로 설계된다. 실제 탄소배출권 발행은 MVP 범위에서 명시적으로 제외한다.

## 다음 액션

1. 본 TRD를 기준으로 Supabase 스키마 마이그레이션 설계
2. 리워드 계산 로직의 구체적 산식과 가중치 값 확정 (`[AI 보완]` 항목 검토)
3. QR/영수증 claim 플로우를 User Flow 문서와 교차 검증
4. Development Milestones 문서의 기술 작업 단위와 정합성 확인
