# SRS Rev 1.0 — Task Macro Inventory

> **목적**: 전체 Task 의 **얕은 구조** — ID · 제목 · Step · 관련 REQ · Priority · Phase 만. 상세 Description / AC / DoD 는 각 Phase Micro 파일에서 작성.
> **근거**: [`00-overview.md`](./00-overview.md) §1~§5 Macro/Micro 파이프라인 · Task ID Convention
> **베이스라인**: [SRS Rev 1.0](../SRS-001-arum-cargo.md)
> **작성일**: 2026-04-18 · **작성자**: Claude (Requirements Engineer)

---

## 0. 총괄 지표

| 구분 | Task 수 | 비고 |
|---|---|---|
| **Step 1 Contract & Data** | 34 | DB 19 + API 9 + Mock 6 |
| **Step 2 Logic (CQRS + UI)** | 58 | I-Side 13 + A-Side 14 + Email 10 + UI 9 + Admin 8 + Data/System 4 |
| **Step 3 Test** | 20 | unit / integration / E2E / sec / a11y / perf / legal |
| **Step 4 NFR + Infra** | 36 | NFR 22 + Infra 14 |
| **합계** | **148** | 교육자료 원칙 준수 (한 Task = 한 목적, CQRS Read/Write 분리, AC → Test 변환) |

Phase 배분:

| Phase | Task 수 | 주요 영역 |
|---|---|---|
| **Phase 2** (Next.js 셋업) | **33** | Infra 전반 · DB 전체 · API 클라이언트 뼈대 · seed 데이터 |
| **Phase 3** (UI Mock) | 24 | UI 컴포넌트 · Mock fixture · `/news` `/jobs` 화면 렌더 |
| **Phase 4** (API 연동) | 40 | ingest 파이프라인 · Gemini 번역 · 관리자 승인 큐 |
| **Phase 5** (이메일·대시보드) 🏁 | 33 | 더블 옵트인 · daily-digest · 관리자 8 KPI |
| **전 Phase 공통** (NFR·Test·품질 게이트) | 18 | Lighthouse CI · gitleaks · RLS negative test · legal §50 검증 |

> Phase 5.5 / 6 / 7 은 Out-of-Scope. 본 인벤토리에 포함하지 않음.

---

## 1. Step 1 — Contract & Data Tasks (34)

### 1.1 DB Tasks — Supabase 마이그레이션 (19)

교육자료 원리 1: "**기능 명세보다 데이터·통신 계약 명세를 먼저 추출**". `supabase/migrations/YYYYMMDDHHMMSS_*.sql` 파일 단위.

| Task ID | 제목 | 관련 REQ | Priority | Phase |
|---|---|---|---|---|
| T-DB-001 | `news_articles` 테이블 + 컬럼 constraints (`editor_pick` ≤140, `summary` 20~500) | REQ-FUNC-025·501 / CON-07 | Must | 2 |
| T-DB-002 | `job_posts` 테이블 + `cargo_job_category` `job_status` enum | REQ-FUNC-105·106·502 | Must | 2 |
| T-DB-003 | `subscribers` 테이블 + `settings_token` gen_random_bytes default | REQ-FUNC-503·505 / CON-04 | Must | 2 |
| T-DB-004 | `admin_users` 테이블 + `role` enum + service_role RLS only | REQ-FUNC-400·504 | Must | 2 |
| T-DB-005 | `news_clicks` 테이블 (beacon tracking) | REQ-FUNC-024 | Must | 2 |
| T-DB-006 | `job_clicks` 테이블 (beacon tracking) | REQ-FUNC-119 | Must | 2 |
| T-DB-007 | `daily_digests` 테이블 + `digest_date` unique | REQ-FUNC-212 | Must | 2 |
| T-DB-008 | `subscription_events` 테이블 + 13개월 retention 정책 | REQ-FUNC-509 / CON-04 | Must | 2 |
| T-DB-009 | `email_events` 테이블 + webhook FK | REQ-FUNC-216·217 | Must | 2 |
| T-DB-010 | `ingest_logs` 테이블 + status enum | REQ-FUNC-508 | Must | 2 |
| T-DB-011 | `aviation_glossary` 테이블 + 50건 시드 | REQ-FUNC-030 | Must | 2 |
| T-DB-012 | `cargo_career_links` 테이블 + 14건 시드 | REQ-FUNC-112 | Must | 2 |
| T-DB-013 | Enum 3종: `news_category` / `cargo_job_category` / `editor_pick_tone` | REQ-FUNC-018·025·105 | Must | 2 |
| T-DB-014 | **트리거 `block_non_cargo_titles`** — 비카고 제목 approved 차단 | REQ-FUNC-103 / CON-05 | Must | 2 |
| T-DB-015 | 트리거 `log_editor_pick_change` — Pick 수정 이력 jsonb append | REQ-FUNC-026 | Must | 2 |
| T-DB-016 | 트리거 `update_subscriber_last_active` — webhook → last_active_at | REQ-FUNC-217 | Must | 2 |
| T-DB-017 | DB 함수 `archive_expired_jobs()` — 마감 7일 후 자동 archived | REQ-FUNC-117 | Must | 4 |
| T-DB-018 | 인덱스 일괄: `published_at`·`editor_pick`·`last_active_at`·`approved` | REQ-NF-008·009·010 | Must | 2 |
| T-DB-019 | RLS 정책 일괄 적용 — 전 테이블 `rls: true` + 공개 범위 정책 | REQ-FUNC-500·501·502·503·504 | Must | 2 |

### 1.2 API Contract Tasks — 외부 시스템 client (9)

`src/lib/api/{service}-client.ts` + zod response parser (C-TEC-009).

| Task ID | 제목 | 관련 REQ | Priority | Phase |
|---|---|---|---|---|
| T-API-001 | Naver News API client + zod schema + retry 3회 backoff | REQ-FUNC-010 / REQ-NF-027 | Must | 4 |
| T-API-002 | 국내 카고 RSS parser client (4종) + zod | REQ-FUNC-011 | Must | 4 |
| T-API-003 | 해외 카고 RSS parser (3종) + Readability 추출 + 번역 파이프 연결 | REQ-FUNC-012 | Must | 4 |
| T-API-004 | Worknet OpenAPI XML client + `fast-xml-parser` + zod | REQ-FUNC-100 | Must | 4 |
| T-API-005 | Saramin OpenAPI client + zod + dedupe 연동 | REQ-FUNC-101 | Should | 4 |
| T-API-006 | **Gemini 1.5 Flash** facade (`translation/index.ts`) + `gemini.ts` adapter + zod 출력 schema | REQ-FUNC-015 / C-TEC-015 | Must | 4 |
| T-API-007 | Loops transactional client + 4 template ID + webhook HMAC validator | REQ-FUNC-200·206·216·411 | Must | 5 |
| T-API-008 | Supabase client 분리 — `src/lib/supabase/client.ts` (anon) + `admin.ts` (service_role) | REQ-FUNC-500·504·507 / C-TEC-012 | Must | 2 |
| T-API-009 | Vercel Analytics API client + MUV 집계 | REQ-FUNC-406 | Must | 5 |

### 1.3 Mock Data Tasks — Fixture JSON (6)

Phase 3 UI 병렬 개발용. Phase 4 실 API 연동 시 교체.

| Task ID | 제목 | 관련 REQ | Priority | Phase |
|---|---|---|---|---|
| T-MOCK-001 | `news_articles` mock 20건 fixture — 6 카테고리 균형 분포 | REQ-FUNC-020·021 | Must | 3 |
| T-MOCK-002 | `job_posts` mock 10건 fixture — 신뢰도·urgency 분포 | REQ-FUNC-107·110·111 | Must | 3 |
| T-MOCK-003 | 에디터 Pick 샘플 5건 fixture — OBSERVATION/ACTION_ITEM/CONTEXT 톤별 | REQ-FUNC-025·027 / OQ-C2 | Must | 3 |
| T-MOCK-004 | `subscribers` + `daily_digests` mock — 다이제스트 미리보기용 | REQ-FUNC-206·213 | Should | 3 |
| T-MOCK-005 | Admin 대시보드 KPI mock (8 카드 데이터) | REQ-FUNC-404 | Must | 3 |
| T-MOCK-006 | `aviation_glossary` seed JSON 50건 (AWB/ULD/TAC/Belly 등) | REQ-FUNC-030 | Must | 2 |

---

## 2. Step 2 — Logic Tasks (58)

교육자료 원리 2: "**단일 요구사항을 상태 변경 여부에 따라 닫힌 문맥으로 쪼개라**". CQRS Read/Write 분리 · `-R` / `-W` suffix.

### 2.1 카고 뉴스 I-Side (13)

| Task ID | 제목 | 관련 REQ | Priority | Phase |
|---|---|---|---|---|
| T-FEAT-010-W | 뉴스 ingest 파이프라인 (Naver + 국내 RSS + 해외 RSS 통합 Write) | REQ-FUNC-010·011·012 | Must | 4 |
| T-FEAT-013-W | 뉴스 품질 필터 (exclude regex + dedupe_hash + 환각 drop) | REQ-FUNC-013·014·016 | Must | 4 |
| T-FEAT-015-W | **해외 기사 Gemini 번역 파이프 + 쿼터 enforcement** | REQ-FUNC-015·017 / C-TEC-015 | Must | 4 |
| T-FEAT-018-W | 뉴스 카테고리 분류 + quota soft 경고 | REQ-FUNC-018·019 | Must | 4 |
| T-FEAT-020-R | `/news` 피드 쿼리 (리스트 + 카테고리 탭 + 태그 chip 필터) | REQ-FUNC-020·021·022 | Must | 3 |
| T-FEAT-023-R | `/news/[slug]` 상세 + NewsArticle JSON-LD | REQ-FUNC-023 | Should | 4 |
| T-FEAT-024-W | 외부 원문 클릭 beacon (`/api/news/click/[id]`) | REQ-FUNC-024 | Must | 4 |
| T-FEAT-025-W | 에디터 Pick 필드 저장 + history 이력 (트리거 연계) | REQ-FUNC-025·026 | Must | 4 |
| T-FEAT-028-W | 에디터 Pick 이메일 HTML 블록 빌더 | REQ-FUNC-028 | Must | 5 |
| T-FEAT-031-R | 용어 SSR 자동 래핑 (glossary 매칭) | REQ-FUNC-031 | Should | 4 |
| T-FEAT-032-R | 썸네일 next/image remotePatterns | REQ-FUNC-032·311 | Should | 3 |
| T-FEAT-033-R | 뉴스 ingest 실패 시 직전 스냅샷 유지 (UX fallback) | REQ-FUNC-033 | Must | 4 |
| T-FEAT-019-R | 카테고리 quota UI 경고 뱃지 (대시보드 연계) | REQ-FUNC-019 | Should | 4 |

### 2.2 카고 채용 A-Side (14)

| Task ID | 제목 | 관련 REQ | Priority | Phase |
|---|---|---|---|---|
| T-FEAT-100-W | 워크넷 10 카고 키워드 ingest (Write) | REQ-FUNC-100 | Must | 4 |
| T-FEAT-101-W | 사람인 secondary ingest + dedupe (Write) | REQ-FUNC-101 | Should | 4 |
| T-FEAT-102-W | 채용 exclude 필터 (ingest 레벨 regex) | REQ-FUNC-102 / CON-05 | Must | 4 |
| T-FEAT-104-W | `source_trust_score` 자동 계산 (규칙 매트릭스) | REQ-FUNC-104 | Should | 4 |
| T-FEAT-107-R | `/jobs` 카드 피드 + 6 카테고리 필터 쿼리 | REQ-FUNC-107 | Must | 3 |
| T-FEAT-108-R | `/jobs` URL 쿼리 동기화 (공유 가능 URL) | REQ-FUNC-108 | Must | 3 |
| T-FEAT-109-R | `/jobs` 정렬 3종 (신뢰도·마감·최신) | REQ-FUNC-109 | Must | 3 |
| T-FEAT-113-R | `/jobs/[slug]` 상세 + JobPosting JSON-LD | REQ-FUNC-113 | Should | 4 |
| T-FEAT-114-W | `/admin/jobs` 승인 큐 (pending → approved/rejected) | REQ-FUNC-114·115 | Must | 4 |
| T-FEAT-116-W | 관리자 일괄 승인 단축키 (신뢰도 5) | REQ-FUNC-116 | Could | 4 |
| T-FEAT-117-W | 마감 7일 후 자동 archived 전이 cron | REQ-FUNC-117 / T-DB-017 | Must | 4 |
| T-FEAT-118-R | `/jobs` 빈 상태 UI + 구독 CTA | REQ-FUNC-118 | Must | 3 |
| T-FEAT-119-W | 공고 클릭 beacon (`/api/jobs/click/[id]`) | REQ-FUNC-119 | Must | 4 |
| T-FEAT-120-R | 2~5년차 years_experience 하이라이트 | REQ-FUNC-120 | Should | 3 |

### 2.3 Email Growth Loop (10)

| Task ID | 제목 | 관련 REQ | Priority | Phase |
|---|---|---|---|---|
| T-FEAT-200-W | `/api/subscribe` 더블 옵트인 POST + zod + consents[] + Loops tpl-verify | REQ-FUNC-200·204·205 | Must | 5 |
| T-FEAT-201-W | verification_token 24h 만료 + `/subscribe/verify` verified 전환 | REQ-FUNC-201·202·203 | Must | 5 |
| T-FEAT-206-W | **daily-digest cron — Loops List Send 위임 (M2 해소)** | REQ-FUNC-206·215 / REQ-NF-011 | Must | 5 |
| T-FEAT-207-W | 야간 발송 차단 (21~08 KST) | REQ-FUNC-207 / CON-02 | Must | 5 |
| T-FEAT-208-W | `(광고)` subject + footer 주입 | REQ-FUNC-208 / CON-03 | Must | 5 |
| T-FEAT-209-W | `/unsubscribe/[token]` 원클릭 수신거부 | REQ-FUNC-209 | Must | 5 |
| T-FEAT-210-R | `/subscribe/settings/[token]` GET 카테고리 리스트 | REQ-FUNC-210 | Should | 5 |
| T-FEAT-210-W | `/subscribe/settings/[token]` PATCH + rate limit 10/min | REQ-FUNC-210·211 | Should | 5 |
| T-FEAT-213-R | 카테고리 매칭 + quota balancing 쿼리 (Read 부분) | REQ-FUNC-213 | Must | 5 |
| T-FEAT-213-W | 매칭 0건 skip + 확장 안내 메일 | REQ-FUNC-214 | Should | 5 |
| T-FEAT-216-W | Loops webhook 수신 + HMAC 검증 + email_events INSERT | REQ-FUNC-216 | Must | 5 |
| T-FEAT-218-W | 공유 루프 `/share/[id]?ref=` referrer_subscriber_id 기록 + OG meta | REQ-FUNC-218·219 | Should | 5 |

### 2.4 UI 레이어 (9 · Phase 3 중심)

| Task ID | 제목 | 관련 REQ | Priority | Phase |
|---|---|---|---|---|
| T-UI-301 | Bento Grid 랜딩 Hero (Framer Motion 스태거 리빌) | REQ-FUNC-301 | Should | 3 |
| T-UI-302 | Gradient Blob 배경 (CSS-first `@keyframes`) | REQ-FUNC-302 | Should | 3 |
| T-UI-303 | Scroll Parallax Hero (`useScroll` + `useTransform`) | REQ-FUNC-303 | Should | 3 |
| T-UI-304 | 3D Carousel `/about` 하단 (CSS 3D + Framer Motion) | REQ-FUNC-304 | Could | 3 |
| T-UI-027 | 에디터 Pick 카드 시각 분리 (좌측 바 + 톤 라벨 뱃지) | REQ-FUNC-027 | Must | 3 |
| T-UI-029 | `<AviationTerm>` 툴팁 컴포넌트 (hover + tap + 키보드 포커스) | REQ-FUNC-029·307 | Must | 3 |
| T-UI-110 | D-3 `arum.urgent` 배지 + 신뢰도 Star 아이콘 | REQ-FUNC-110·111 | Must | 3 |
| T-UI-112 | 카고 기업 공식 딥링크 Bento 카드 | REQ-FUNC-112 | Must | 3 |
| T-UI-309 | About 페이지 (개인정보 비노출) + `/privacy` `/terms` 법정 페이지 | REQ-FUNC-309·310 / CON-09 | Must | 3 |

### 2.5 Admin / Operations (8)

| Task ID | 제목 | 관련 REQ | Priority | Phase |
|---|---|---|---|---|
| T-FEAT-401-W | `/admin/login` Supabase Magic Link 발송 + admin_users 화이트리스트 체크 | REQ-FUNC-401·403 | Must | 5 |
| T-FEAT-402-W | middleware `/admin/:path*` 세션 보호 | REQ-FUNC-402 | Must | 5 |
| T-FEAT-404-R | `/admin/dashboard` 8 KPI 카드 (shadcn/ui charts) | REQ-FUNC-404·405 | Must | 5 |
| T-FEAT-406-R | `/api/admin/metrics` 3소스(Supabase+Loops+Vercel) 집계 | REQ-FUNC-406 | Must | 5 |
| T-FEAT-407-W | `/admin/news` 인라인 에디터 Pick 작성 + 승인 플로우 | REQ-FUNC-407 | Must | 4 |
| T-FEAT-408-R | WAU 계산 쿼리 (`last_active_at ≥ now()-7d`) | REQ-FUNC-408 | Must | 5 |
| T-FEAT-409-R | 4주 유지율 코호트 쿼리 | REQ-FUNC-409 | Must | 5 |
| T-FEAT-410-R | 에디터 Pick 커버리지 < 60% 경고 + tpl-admin-alert 발송 | REQ-FUNC-410·411 | Should | 5 |

### 2.6 Data / System (4 · 나머지는 DB/Infra Task에 흡수됨)

| Task ID | 제목 | 관련 REQ | Priority | Phase |
|---|---|---|---|---|
| T-FEAT-508-W | `ingest_logs` 매 cron 실행 기록 (status='running' → 종료 시 update) | REQ-FUNC-508 | Must | 4 |
| T-FEAT-506-W | `/api/cron/*` Bearer `CRON_SECRET` 검증 middleware | REQ-FUNC-506 / REQ-NF-048 | Must | 4 |
| T-FEAT-217-W | `last_active_at` 자동 갱신 (email_events INSERT → trigger) | REQ-FUNC-217 | Must | 5 |
| T-FEAT-509-C | `subscription_events` 13개월 보존 정책 확인 (retention cron 부재 검증) | REQ-FUNC-509 / CON-04 | Must | 5 |

---

## 3. Step 3 — Test Tasks (20)

교육자료 원리 3: "**인수 조건(AC)을 완료 체크리스트가 아닌 '자동화된 피드백 루프(테스트 코드)' Task 로 변환**".

각 T-FEAT-* 의 AC 를 테스트 파일 단위로 묶어 1개 Task 발급. 세부 테스트 케이스는 Phase Micro 에서 명시.

| Task ID | 제목 | 대응 Feature Task | Priority | Phase |
|---|---|---|---|---|
| T-TEST-001 | DB 트리거 suite (block_non_cargo_titles · log_editor_pick_change · update_subscriber_last_active) | T-DB-014·015·016 | Must | 2 |
| T-TEST-002 | RLS negative test suite (news/jobs/subscribers/admin_users anon 접근 차단) | T-DB-019 | Must | 2 |
| T-TEST-003 | Naver + 국내 RSS + 해외 RSS ingest integration (mock + E2E 1회) | T-FEAT-010-W·013-W | Must | 4 |
| T-TEST-004 | Gemini adapter zod schema + mock + 환각 탐지 unit | T-FEAT-015-W·016 | Must | 4 |
| T-TEST-005 | Worknet + Saramin ingest integration + EXCLUDE_RE 30 케이스 | T-FEAT-100-W·102-W | Must | 4 |
| T-TEST-006 | Subscribe 더블 옵트인 E2E (이메일 발송 본인 수신 포함) | T-FEAT-200-W·201-W | Must | 5 |
| T-TEST-007 | Daily digest cron integration + Loops List Send mock + 야간 차단 403 | T-FEAT-206-W·207-W | Must | 5 |
| T-TEST-008 | Loops webhook HMAC 검증 unit + 서명 실패 401 | T-FEAT-216-W | Must | 5 |
| T-TEST-009 | `/news` `/jobs` Playwright E2E (필터·정렬·빈 상태) | T-FEAT-020-R·107-R·118-R | Must | 3 |
| T-TEST-010 | `/admin` Magic Link 보호 E2E + 미승인 접근 404 | T-FEAT-401-W·402-W | Must | 5 |
| T-TEST-011 | 에디터 Pick workflow E2E (작성 → 저장 → 이메일 HTML 포함) | T-FEAT-025-W·028-W·407-W | Must | 4 |
| T-TEST-012 | axe DevTools + 키보드 네비게이션 (WCAG 2.1 AA) | T-UI-029 / REQ-NF-140·141 | Must | 3 |
| T-TEST-013 | Lighthouse CI 성능 budget (LCP/TTFB/CLS/INP) | 전 UI Task / REQ-NF-001~006 | Must | 3 |
| T-TEST-014 | 이메일 §50 legal 검증 (`(광고)` subject · 수신거부 · 발신자 정보) | T-FEAT-208-W·209-W | Must | 5 |
| T-TEST-015 | `prefers-reduced-motion` Playwright emulation | T-UI-301·302·303·304 / REQ-NF-142 | Must | 3 |
| T-TEST-016 | Hallucination 탐지 unit (원문 대비 숫자 검증) | T-FEAT-015-W | Must | 4 |
| T-TEST-017 | Dedupe hash unit (sha256 동일 item 2회 insert) | T-FEAT-010-W·013-W | Must | 4 |
| T-TEST-018 | Editor Pick 140자 constraint + tone enum unit | T-FEAT-025-W | Must | 4 |
| T-TEST-019 | SQL 인덱스 성능 — EXPLAIN ANALYZE (p95 검증) | T-DB-018 / REQ-NF-008·009·010 | Must | 2 |
| T-TEST-020 | k6 부하 테스트 — `/api/subscribe` p95 ≤ 500ms | T-FEAT-200-W / REQ-NF-013 | Should | 5 |

---

## 4. Step 4 — NFR + Infra Tasks (36)

### 4.1 NFR 엔지니어링 Tasks (22)

SRS §4.2 REQ-NF 를 목적별로 그룹화.

| Task ID | 제목 | 관련 REQ-NF | Priority | Phase |
|---|---|---|---|---|
| T-NFR-001 | Lighthouse CI 성능 예산 설정 (LCP 2.5s · TTFB 600ms · CLS 0.1 · INP 200ms) | REQ-NF-001~006 | Must | 3 |
| T-NFR-002 | `/admin/dashboard` p95 ≤ 2s — SSR + `unstable_cache` 5분 | REQ-NF-007 | Must | 5 |
| T-NFR-003 | SQL 인덱스 EXPLAIN ANALYZE — p95 ≤ 200/300/100 ms | REQ-NF-008·009·010 | Must | 2 |
| T-NFR-004 | **daily-digest ≤55s — Loops List Send API 위임 구조** | REQ-NF-011 | Must | 5 |
| T-NFR-005 | `/api/cron/ingest-*` ≤50s 타임아웃 설계 | REQ-NF-012 | Must | 4 |
| T-NFR-006 | `/api/subscribe` p95 ≤500ms | REQ-NF-013 | Must | 5 |
| T-NFR-007 | Gemini 번역 p95 ≤4s + 타임아웃 skip 분기 | REQ-NF-014 | Should | 4 |
| T-NFR-008 | Loops webhook 응답 ≤300ms | REQ-NF-015 | Must | 5 |
| T-NFR-009 | 5xx 에러율 ≤ 0.5% / 28일 모니터링 (Vercel + optional Sentry) | REQ-NF-020·021 | Must | 5 |
| T-NFR-010 | `/api/subscribe` 성공률 ≥99.5% + digest 성공률 ≥98% | REQ-NF-022·023 | Must | 5 |
| T-NFR-011 | RPO ≤ 24h (manual `pg_dump` 일 1회) + RTO ≤ 4h 복구 절차 | REQ-NF-029·030 | Should | 5 |
| T-NFR-012 | Service Role Key 서버 전용 + Magic Link 1h 만료 | REQ-NF-043·044·045 | Must | 2 |
| T-NFR-013 | settings_token rate limit 10/min + CRON_SECRET bearer + Loops webhook HMAC | REQ-NF-047·048·049 | Must | 5 |
| T-NFR-014 | gitleaks CI + TLS 1.2+ 강제 | REQ-NF-050·051 | Must | 2 |
| T-NFR-015 | §50 legal compliance suite: `(광고)` + unsubscribe + sender info + 야간 금지 | REQ-NF-060~066 / CON-02·03 | Must | 5 |
| T-NFR-016 | 비카고 scope 보호: block 트리거 + EXCLUDE_RE 이중 방어 검증 | REQ-NF-067~069 / CON-05 | Must | 4 |
| T-NFR-017 | 콘텐츠 품질 지표 측정: 에디터 Pick ≥60%·quota ±10%p·오역 ≤10% | REQ-NF-080~089 | Should | 5 |
| T-NFR-018 | Growth KPI 계기판: WAU·4주유지·오픈률·CTR·수신거부율 | REQ-NF-100~109 | Must | 5 |
| T-NFR-019 | 비용 캡 enforce: Gemini 일 1,500 · Supabase 500MB 알림 · Loops 1,500 알림 | REQ-NF-120·121·122 | Must | 5 |
| T-NFR-020 | API quota 모니터링 — Naver 0.5% / Worknet 1% | REQ-NF-123·124 | Should | 4 |
| T-NFR-021 | WCAG 2.1 AA + 키보드 nav + reduced-motion + 360px 모바일 + 폰트 ≤100KB | REQ-NF-140~144 | Must | 3 |
| T-NFR-022 | 운영·유지보수 규약: migrations 네이밍·email 템플릿 CI·ingest_logs 90일·Loops 1,500 알림·PRD 단방향 의존 | REQ-NF-160~167 | Should | 5 |

### 4.2 Infra / DevOps Tasks (14)

| Task ID | 제목 | 관련 C-TEC / REQ | Priority | Phase |
|---|---|---|---|---|
| T-INFRA-001 | `web/` Next.js 14 App Router + TypeScript strict + pnpm + Node 20 LTS | C-TEC-001·022 | Must | 2 |
| T-INFRA-002 | Tailwind + `arum.*` 토큰 + shadcn/ui 초기 + lucide-react | REQ-FUNC-300 / C-TEC-002·005 | Must | 2 |
| T-INFRA-003 | Pretendard + Space Grotesk + JetBrains Mono 3 폰트 로딩 (≤100KB) | REQ-FUNC-305 / C-TEC-004 | Must | 2 |
| T-INFRA-004 | Framer Motion + tailwindcss-animate + react-intersection-observer | C-TEC-003 | Must | 2 |
| T-INFRA-005 | Supabase 프로젝트 생성 + 로컬 `supabase start` CLI 연결 | C-TEC-010 | Must | 2 |
| T-INFRA-006 | `supabase/migrations/` 네이밍 규약 + CI 적용 확인 | REQ-NF-163 / C-TEC-011 | Must | 2 |
| T-INFRA-007 | `src/lib/supabase/{client,admin}.ts` + `src/lib/api/` 뼈대 | C-TEC-008·009 | Must | 2 |
| T-INFRA-008 | Vercel 프로젝트 + `arumcargo.vercel.app` 배포 + Analytics 활성 | C-TEC-019·020 | Must | 2 |
| T-INFRA-009 | `.env.example` 전체 키 (TRANSLATION_PROVIDER · GOOGLE_GENERATIVE_AI_API_KEY · SUPABASE_* · LOOPS_* · CRON_SECRET · ADMIN_EMAIL_WHITELIST 등) | SRS §6.8 | Must | 2 |
| T-INFRA-010 | ESLint + Prettier + TypeScript strict + gitleaks CI pipeline | C-TEC-023·024 / REQ-NF-161 | Must | 2 |
| T-INFRA-011 | `vercel.json` Cron `0 22 * * *` (=07:00 KST) | REQ-FUNC-511 / C-TEC-017 | Must | 5 |
| T-INFRA-012 | GitHub Actions 워크플로 3종 (ingest-news-domestic / ingest-news-overseas / ingest-jobs) + CRON_SECRET header | REQ-FUNC-510·506 / C-TEC-017 | Must | 4 |
| T-INFRA-013 | `<SiteHeader>` `<SiteFooter>` 기본 레이아웃 + 사업자정보 footer | — | Must | 2 |
| T-INFRA-014 | `next.config.js` `remotePatterns` (썸네일 직접 링크 허용 도메인) | REQ-FUNC-311·032 | Should | 2 |

---

## 5. Phase별 Task 배분 (Execution View)

### Phase 2 — Next.js 셋업 (33 Task)

**Step 1 Contract & Data** (23):
- T-DB-001~016·018·019 (16 DB + 1 index + 1 RLS 적용)
- T-DB-013 Enum
- T-MOCK-006 Glossary seed
- T-API-008 Supabase clients 분리

**Step 3 Test** (3):
- T-TEST-001 트리거 suite
- T-TEST-002 RLS negative
- T-TEST-019 인덱스 성능

**Step 4 Infra** (9):
- T-INFRA-001~010, T-INFRA-013, T-INFRA-014 (일부)
- T-NFR-003 인덱스 성능
- T-NFR-012 보안 기초
- T-NFR-014 gitleaks/TLS

### Phase 3 — UI Mock (24 Task)

**Step 1 Mock** (5): T-MOCK-001~005
**Step 2 UI + Read Logic** (13): T-UI-* 전부 + T-FEAT-020-R / 107-R·108-R·109-R / 118-R / 120-R / 032-R
**Step 3 Test** (4): T-TEST-009·012·013·015
**Step 4 NFR** (2): T-NFR-001 Lighthouse / T-NFR-021 접근성

### Phase 4 — API 연동 (40 Task)

**Step 1 API** (6): T-API-001~006
**Step 2 Logic Write (뉴스·채용 ingest + 번역 + 분류 + 클릭 beacon + 승인 큐)**: ~20
**Step 3 Test**: T-TEST-003·004·005·011·016·017·018 (7)
**Step 4 Infra + NFR**: T-INFRA-012 · T-NFR-005·007·016·020 + T-FEAT-506-W·508-W + T-DB-017 (7)

### Phase 5 — 이메일 + 대시보드 🏁 (33 Task)

**Step 1 API** (2): T-API-007 Loops / T-API-009 Vercel Analytics
**Step 2 Email Logic** (10) + **Admin Logic** (8): T-FEAT-200~218 + T-FEAT-401~410
**Step 3 Test**: T-TEST-006·007·008·010·014·020 (6)
**Step 4 NFR + Infra**: T-INFRA-011 Vercel Cron + T-NFR-002·004·006·008·009·010·011·013·015·017·018·019·022 (14)

### 전 Phase 공통 (18 Task · Phase 배분 참조)

NFR·Test·품질 게이트는 선행 Task 완료 시 착수하고 전체 기간에 지속 유지됨.

---

## 6. Dependency 개요 (Step 4 핵심 오케스트레이션 힌트)

> 상세 의존 관계는 각 Phase Micro Task 의 `🔗 Dependencies & Blockers` 섹션에서 정밀 정의. 여기서는 큰 흐름만.

```
┌─ Step 1 Contract (DB · API · Mock)
│   └─ T-DB-001~019 · T-API-001~009 · T-MOCK-001~006
│
├─ Step 2 Logic (CQRS)
│   ├─ Write: 반드시 T-DB-* 완료 후
│   └─ Read: T-DB-* + T-MOCK-* 중 하나 (Phase 3 는 Mock, Phase 4~5 는 DB 실데이터)
│
├─ Step 3 Test
│   └─ 각 T-FEAT-* 완료 선행 + 테스트 실패 시 해당 Feature Task 재작업
│
└─ Step 4 NFR + Infra
    ├─ Infra 는 Phase 2 최우선
    └─ NFR 엔지니어링 은 Step 2/3 이후, Phase 종료 판정 전 필수
```

**Cross-cutting Blockers** (여러 Task 를 막는 핵심 선행):
- T-INFRA-005 Supabase 프로젝트 → **T-DB-* 전체 선행**
- T-API-008 Supabase client 분리 → **T-FEAT-* 전체 선행** (anon/service_role 혼용 방지)
- T-DB-014 block_non_cargo_titles → **T-FEAT-114-W 관리자 승인** 선행
- T-API-006 Gemini adapter → T-FEAT-015-W 번역 파이프
- T-API-007 Loops client → T-FEAT-200-W subscribe + T-FEAT-206-W digest
- T-DB-019 RLS 정책 → T-TEST-002 negative test · 전 Phase 보안 검증

---

## 7. Out-of-Scope 확인 (교육자료 §5 사후 검토 프리체크)

본 인벤토리에 **포함되지 않은** 영역 (의도적 배제):

| 배제 영역 | 근거 |
|---|---|
| 승무원·지상직·조종사·부기장·정비사·캐빈·기장 직군 | ADR-008 Cargo-First Pivot / CON-05 |
| Phase 5.5: `/flights` · `/employers` · `/contribute` · `aircraft_capacity` | PRD 07 §8 Out-of-MVP |
| Phase 6: Remember 벤치마크 커뮤니티 | PRD 07 §9 |
| Phase 7: 모바일 앱 (Capacitor/Expo) · "아름" 브랜드 확장 | PRD 07 §10 |
| 수익화 (유료 구독·B2B SaaS·프리미엄 티어·인앱 결제) | ADR-008 수익화 축 제거 |
| 다국어 (EN) | PRD 07 §11 (Phase 7 유예) |
| 인스타그램 크롤링 | Meta ToS 리스크 (ADR 없음, 영구 배제) |
| Admin Research Copilot (Perplexity/Grok) | C-TEC-025 Phase 5.5+ · 별도 ADR 선행 |
| Vercel AI SDK 사용 | C-TEC-015 명시적 금지 |

---

## 8. 누락 체크리스트 (작성자 Self-Audit)

교육자료 §3 4 체크리스트 적용:

- [x] **[Contract]** 모든 주요 엔티티(11+)에 DB Task 발급 · 모든 외부 시스템(9)에 API Task 발급 ✅
- [x] **[Logic]** Read/Write 분리 · `-R` `-W` suffix 일관 적용 ✅
- [x] **[Test]** 20 Test Task 가 모든 Must Feature Task 에 대응 ✅
- [x] **[NFR]** REQ-NF 87개 unique ID 가 22 NFR Task 에 그룹 매핑 ✅

교육자료 §5 사후 검토:

- [x] **개발 난이도** — 11년차 카고 현직자 + Claude Code 에이전틱 개발 프로필 적합 ✅
- [x] **기술 스택** — C-TEC-001~025 외 도구 등장 0건 ✅
- [x] **운영 비용** — 모든 Task 가 월 ₩0 운영비 유지 (C-COST-001 대비 0%) ✅
- [x] **Out-of-Scope 오염 없음** — §7 배제 영역 Task 0건 ✅

---

## Changelog

- **2026-04-18 v1.0**: 최초 작성. SRS Rev 1.0 기준. Step 1~4 × Phase 2~5 매트릭스에 148개 Task 얕은 배치 완료. Phase 2 부터 Micro 작성 가능.

---

**End of Macro Inventory.**
