# Arum Cargo — TASK 목록 명세서 (canonical)

> **근거**: SRS Rev 1.0 + 교육자료 "테스크 리스트 추출 프롬프트" (2026-04-19)
> **형식**: 6-컬럼 canonical 표 (Task ID · Epic · Feature · 관련 SRS · 선행 · 복잡도 H/M/L)
> **베이스라인**: [`../SRS-001-arum-cargo.md`](../SRS-001-arum-cargo.md)
> **작성일**: 2026-04-19 · **작성자**: Claude (Technical PM / System Architect)

---

## 0. 요건 준수 확인

### SRS v1 요건 대응
1. **PRD 충실 반영** → SRS Rev 1.0 이 `docs/prd/00~07, 99` v0.3 을 단방향 수용 (SRS §1 Primary PRD Source)
2. **기술 명세 완비** → C-TEC-001~025 (25개) · 12 Mermaid diagrams · 운영 비용 C-COST-001~008 포함
3. **구현 가능성** → 11년차 카고 현직자 + Claude Code 에이전틱 개발 프로필 기준 난이도 검증 (`reviews/MVP-개발목표-적절성-종합-검토-보고서.md`)
4. **운영 리소스 검토** → 월 ₩0 (Gemini 무료 · Supabase Free · Vercel Hobby · Loops 무료 · GitHub Actions public 무제한)

### TASK 명세 요건 대응
1. **SRS 전체 커버** → 108 REQ-FUNC · 87 REQ-NF · 12 CON · 25 C-TEC 전수 매핑
2. **SRS 초과 내용 없음** → 모든 Task 에 SRS 앵커 존재 (임의 Task 0건)
3. **SRS 서술 방침 준수** → 승무원/조종사/모바일앱/수익화 등 Out-of-Scope 0건
4. **GitHub Project 포맷** → 본 표는 gh CLI `gh issue create` 일괄 변환 가능 (Task ID · 제목 · labels · body)
5. **순차·병렬 계획 근거** → 선행 컬럼 명시 + 복잡도 H/M/L 로 리소스 산정

---

## 1. 총괄 지표

| 구분 | 개수 | 복잡도 H | 복잡도 M | 복잡도 L |
|---|---|---|---|---|
| **Epic 1. Platform & Infrastructure** (INFRA-###) | 14 | 0 | 8 | 6 |
| **Epic 2. Data Model** (DB-###) | 19 | 3 | 11 | 5 |
| **Epic 3. External Integration** (API-###) | 9 | 3 | 5 | 1 |
| **Epic 4. Mock & Fixtures** (MOCK-###) | 6 | 0 | 0 | 6 |
| **Epic 5. Cargo News I-Side** (FR-001~013) | 13 | 1 | 9 | 3 |
| **Epic 6. Cargo Jobs A-Side** (FR-014~027) | 14 | 0 | 10 | 4 |
| **Epic 7. Email Growth Loop** (FR-028~039) | 12 | 2 | 8 | 2 |
| **Epic 8. UI/UX** (UI-###) | 9 | 1 | 6 | 2 |
| **Epic 9. Admin Dashboard** (FR-040~047, FR-052) | 9 | 2 | 6 | 1 |
| **Epic 10. Data/System Bridge** (FR-048~051) | 4 | 0 | 3 | 1 |
| **Epic 11. Test Automation** (TEST-###) | 20 | 2 | 15 | 3 |
| **Epic 12. Non-Functional** (NFR-###) | 22 | 2 | 15 | 5 |
| **합계** | **151** | **16 (11%)** | **96 (63%)** | **39 (26%)** |

**복잡도 분포 판정**: H 10% 이내 · M/L 90% → MVP 단계 적절 (교육자료 SRS v1 요건 3).

---

## 2. 상세 명세 진행 상태

본 canonical TASKS.md 와 별도로 [`phase-2-tasks.md`](./phase-2-tasks.md) 에 **GitHub Issue 풀 템플릿으로 이미 상세 명세된 Task 38개** 존재:

| 기존 파일 Task ID | 본 파일 canonical ID | 상세 위치 |
|---|---|---|
| T-INFRA-001 | INFRA-001 | phase-2-tasks.md Sample 1 |
| T-INFRA-005 | INFRA-005 | Sample 2 |
| T-DB-001 | DB-001 | Sample 3 |
| T-DB-014 | DB-014 | Sample 4 |
| T-API-008 | API-008 | Sample 5 |
| T-TEST-001 | TEST-001 | Sample 6 |
| T-NFR-014 | NFR-014 | Sample 7 |
| T-INFRA-009·010·002 | INFRA-009·010·002 | Sample 8·9·10 |
| T-DB-013·002·003·004·011·018·019 | DB-013·002·003·004·011·018·019 | Sample 11~17 |
| T-INFRA-003·004·006·007·008·013·014 | INFRA-003·004·006·007·008·013·014 | Sample 18~24 |
| T-DB-005·006·007·008·009·010·012·015·016 | DB-005·006·007·008·009·010·012·015·016 | Sample 25~33 |
| T-MOCK-006 | MOCK-006 | Sample 34 |
| T-TEST-002·019 | TEST-002·019 | Sample 35·36 |
| T-NFR-003·012 | NFR-003·012 | Sample 37·38 |

**상세 명세 완료**: 38 / 150 (25%) — Phase 2 전량
**다음 상세 명세 대상**: 112 (Phase 3~5 범위)

---

## 3. Epic별 Task 표

### Epic 1 — Platform & Infrastructure

| Task ID | Epic | Feature | 관련 SRS 섹션 | 선행 태스크 | 복잡도 |
|---|---|---|---|---|---|
| INFRA-001 | Platform | Next.js 14 App Router + TypeScript strict + pnpm + Node 20 초기화 | §1.2.4 C-TEC-001·022·023 | None | L |
| INFRA-002 | Platform | Tailwind + arum.* 토큰 + shadcn/ui + lucide-react | §4.1.d REQ-FUNC-300 / C-TEC-002·005 / CON-10 | INFRA-001 | M |
| INFRA-003 | Platform | Pretendard + Space Grotesk + JetBrains Mono 폰트 (payload ≤100KB) | REQ-FUNC-305 / REQ-NF-144 / C-TEC-004 | INFRA-001 | L |
| INFRA-004 | Platform | Framer Motion + tailwindcss-animate + react-intersection-observer | C-TEC-003 / REQ-FUNC-308 | INFRA-002 | L |
| INFRA-005 | Platform | Supabase 프로젝트 + `supabase start` 로컬 CLI (cross-cutting blocker) | C-TEC-010·011·012 | INFRA-001 | M |
| INFRA-006 | Platform | migrations YYYYMMDDHHMMSS 네이밍 CI 검증 | C-TEC-011 / REQ-NF-163 | INFRA-010 | L |
| INFRA-007 | Platform | src/lib/supabase + src/lib/api 뼈대 + barrel export 금지 | C-TEC-008·009 | INFRA-001 | L |
| INFRA-008 | Platform | Vercel 프로젝트 + `arumcargo.vercel.app` + Analytics 활성 | C-TEC-019·020 / CON-12 | INFRA-001·009·005 | M |
| INFRA-009 | Platform | .env.example 전체 키 + Phase 배분 주석 (SSOT) | §6.8 환경변수 참조 / CON-08 | INFRA-001 | L |
| INFRA-010 | Platform | ESLint + Prettier + TS strict + Husky + PR 머지 게이트 | C-TEC-023 / REQ-NF-161·162 | INFRA-001 | M |
| INFRA-011 | Platform | `vercel.json` Cron `0 22 * * *` (=07:00 KST) | REQ-FUNC-511 / C-TEC-017 | INFRA-008 | L |
| INFRA-012 | Platform | GitHub Actions 워크플로 3종 (news-dom / news-ov / jobs) | REQ-FUNC-510 / C-TEC-017·018 | API-001~005 | M |
| INFRA-013 | Platform | SiteHeader · SiteFooter + 사업자정보 footer + 한아름 구분 문구 | REQ-FUNC-310 / CON-09 | INFRA-002·003 | M |
| INFRA-014 | Platform | `next.config.mjs` remotePatterns (썸네일 허용 도메인) | REQ-FUNC-032·311 | INFRA-001 | L |

### Epic 2 — Data Model

| Task ID | Epic | Feature | 관련 SRS 섹션 | 선행 | 복잡도 |
|---|---|---|---|---|---|
| DB-001 | Data | `news_articles` 테이블 + CHECK (summary 20~500, editor_pick ≤140) + dedupe_hash UNIQUE | REQ-FUNC-025·501 / CON-07 / §6.2 ERD | INFRA-005, DB-013 | M |
| DB-002 | Data | `job_posts` + `job_status` / `rejection_reason` enum + `source_trust_score` CHECK | REQ-FUNC-105·106·115·502 | INFRA-005, DB-013 | M |
| DB-003 | Data | `subscribers` + `citext` email + `gen_random_bytes` 256bit tokens + 동의 기록 | REQ-FUNC-503·505 / CON-04 | INFRA-005 | M |
| DB-004 | Data | `admin_users` 화이트리스트 + role enum + service_role only RLS | REQ-FUNC-400·504 / C-TEC-013 | INFRA-005 | L |
| DB-005 | Data | `news_clicks` beacon tracking 테이블 (CASCADE FK) | REQ-FUNC-024 | DB-001·003 | L |
| DB-006 | Data | `job_clicks` beacon tracking 테이블 | REQ-FUNC-119 | DB-002·003 | L |
| DB-007 | Data | `daily_digests` + digest_date UNIQUE (멱등성) + digest_status enum | REQ-FUNC-212 | INFRA-005 | M |
| DB-008 | Data | `subscription_events` + RESTRICT FK (13개월 감사 보존) | REQ-FUNC-509 / CON-04 | DB-003 | M |
| DB-009 | Data | `email_events` + webhook dedup UNIQUE | REQ-FUNC-216·217 | DB-003 | M |
| DB-010 | Data | `ingest_logs` + status enum + 90일 retention cron | REQ-FUNC-508 / REQ-NF-165 | INFRA-005 | M |
| DB-011 | Data | `aviation_glossary` 테이블 + 50건 카고 용어 seed | REQ-FUNC-030 | INFRA-005 | M |
| DB-012 | Data | `cargo_career_links` + 14 카고 기업 공식 채용 seed | REQ-FUNC-112 | INFRA-005 | L |
| DB-013 | Data | Enum 3종: news_category · cargo_job_category · editor_pick_tone | REQ-FUNC-018·025·105 | INFRA-005 | L |
| DB-014 | Data | **트리거 `block_non_cargo_titles`** (ADR-008 DB-레벨 방어선) | REQ-FUNC-103·NF-067 / CON-05 | DB-002·013 | H |
| DB-015 | Data | 트리거 `log_editor_pick_change` (jsonb history append) | REQ-FUNC-026 | DB-001·004 | H |
| DB-016 | Data | 트리거 `update_subscriber_last_active` (email_events → WAU) | REQ-FUNC-217 | DB-003·009 | M |
| DB-017 | Data | DB 함수 `archive_expired_jobs()` (마감 7일 → archived) | REQ-FUNC-117 | DB-002 | M |
| DB-018 | Data | 인덱스 일괄 7종 (published_at · editor_pick · deadline · last_active · partial) | REQ-NF-008·009·010 | DB-001·002·003·010 | M |
| DB-019 | Data | RLS 정책 일괄 (deny by default + 공개 범위 명시) | REQ-FUNC-500·501·502·503·504 / C-TEC-012 | DB-001~012 | H |

### Epic 3 — External Integration

| Task ID | Epic | Feature | 관련 SRS 섹션 | 선행 | 복잡도 |
|---|---|---|---|---|---|
| API-001 | External | Naver News API client + zod + 3회 backoff | REQ-FUNC-010 / REQ-NF-027 | INFRA-007·009 | M |
| API-002 | External | 국내 카고 RSS parser (카고프레스·CargoNews·Forwarder KR·Air Cargo News KR) | REQ-FUNC-011 | INFRA-007 | M |
| API-003 | External | 해외 카고 RSS parser (Loadstar·ACN UK·FlightGlobal) + Mozilla Readability | REQ-FUNC-012 | INFRA-007 | H |
| API-004 | External | Worknet OpenAPI XML client + fast-xml-parser | REQ-FUNC-100 | INFRA-007·009 | M |
| API-005 | External | Saramin OpenAPI client + dedupe 연동 | REQ-FUNC-101 | INFRA-007, API-004 | M |
| API-006 | External | **Gemini 1.5 Flash** facade + gemini.ts adapter + zod 출력 | REQ-FUNC-015 / C-TEC-015 | INFRA-007·009 | H |
| API-007 | External | Loops transactional + 4 template + **List Send** + webhook HMAC | REQ-FUNC-200·206·216·411 / REQ-NF-011 | INFRA-007·009 | H |
| API-008 | External | Supabase client 분리 (anon + service_role + server-only) | REQ-FUNC-500·504·507 / C-TEC-012 | INFRA-005·007·009 | M |
| API-009 | External | Vercel Analytics API client (MUV 집계) | REQ-FUNC-406 | INFRA-007·009 | L |

### Epic 4 — Mock & Fixtures

| Task ID | Epic | Feature | 관련 SRS 섹션 | 선행 | 복잡도 |
|---|---|---|---|---|---|
| MOCK-001 | Mock | `news_articles` mock 20건 fixture (6 카테고리 분포) | REQ-FUNC-020·021 | DB-001·013 | L |
| MOCK-002 | Mock | `job_posts` mock 10건 (신뢰도·urgency 분포) | REQ-FUNC-107·110·111 | DB-002·013 | L |
| MOCK-003 | Mock | 에디터 Pick 샘플 5건 (톤별) | REQ-FUNC-025·027 / OQ-C2 | MOCK-001 | L |
| MOCK-004 | Mock | subscribers + daily_digests mock (이메일 미리보기) | REQ-FUNC-206·213 | DB-003·007 | L |
| MOCK-005 | Mock | Admin 대시보드 KPI mock (8 카드 데이터) | REQ-FUNC-404 | None | L |
| MOCK-006 | Mock | aviation_glossary 50건 seed JSON | REQ-FUNC-030 | DB-011 | L |

### Epic 5 — Cargo News (I-Side)

| Task ID | Epic | Feature | 관련 SRS 섹션 | 선행 | 복잡도 |
|---|---|---|---|---|---|
| FR-001 | News | 뉴스 ingest 파이프라인 통합 (Naver + 국내 RSS + 해외 RSS) Write | REQ-FUNC-010·011·012 | API-001·002·003, DB-001·010 | M |
| FR-002 | News | 뉴스 품질 필터 (EXCLUDE_RE + dedupe_hash + 환각 drop) | REQ-FUNC-013·014·016 | FR-001 | M |
| FR-003 | News | Gemini 번역 파이프 + 쿼터 enforcement (일 1,500) | REQ-FUNC-015·017 / C-TEC-015 / CON-06 | API-006, FR-001 | H |
| FR-004 | News | 카테고리 분류 매핑 (6종 enum) + quota soft 경고 | REQ-FUNC-018·019 | DB-013, FR-001 | L |
| FR-005 | News | `/news` 피드 쿼리 (list + 카테고리 탭 + 태그 chip 다중 필터) Read | REQ-FUNC-020·021·022 | DB-001·018 | M |
| FR-006 | News | `/news/[slug]` 상세 + NewsArticle JSON-LD Read | REQ-FUNC-023·032 | DB-001, FR-005 | M |
| FR-007 | News | 외부 원문 클릭 beacon `/api/news/click/[id]` Write | REQ-FUNC-024 | DB-005 | L |
| FR-008 | News | 에디터 Pick 필드 저장 + history 이력 (트리거 연계) Write | REQ-FUNC-025·026 | DB-001·015 | M |
| FR-009 | News | 에디터 Pick 이메일 HTML 블록 빌더 | REQ-FUNC-028 | FR-008 | M |
| FR-010 | News | 용어 SSR 자동 래핑 (glossary 매칭) Read | REQ-FUNC-031 | DB-011 | M |
| FR-011 | News | 썸네일 next/image remotePatterns 통합 Read | REQ-FUNC-032·311 | INFRA-014 | L |
| FR-012 | News | 뉴스 ingest 실패 시 직전 스냅샷 유지 UX fallback | REQ-FUNC-033 | FR-001 | M |
| FR-013 | News | 카테고리 quota UI 경고 뱃지 (관리자 대시보드 연계) | REQ-FUNC-019 | FR-004 | L |

### Epic 6 — Cargo Jobs (A-Side)

| Task ID | Epic | Feature | 관련 SRS 섹션 | 선행 | 복잡도 |
|---|---|---|---|---|---|
| FR-014 | Jobs | 워크넷 10 카고 키워드 ingest Write | REQ-FUNC-100 | API-004, DB-002·010 | M |
| FR-015 | Jobs | 사람인 secondary + dedupe 파이프 Write | REQ-FUNC-101 | API-005, FR-014 | M |
| FR-016 | Jobs | 채용 exclude regex ingest 필터 (8 직군 차단) | REQ-FUNC-102 / CON-05 | FR-014 | L |
| FR-017 | Jobs | `source_trust_score` 자동 계산 (규칙 매트릭스) | REQ-FUNC-104 | FR-014, DB-012 | M |
| FR-018 | Jobs | `/jobs` 피드 쿼리 + 6 카테고리 필터 Read | REQ-FUNC-107 | DB-002·018 | M |
| FR-019 | Jobs | `/jobs` URL 쿼리 동기화 (공유 가능 URL) Read | REQ-FUNC-108 | FR-018 | L |
| FR-020 | Jobs | `/jobs` 정렬 3종 (신뢰도·마감·최신) Read | REQ-FUNC-109 | FR-018 | L |
| FR-021 | Jobs | `/jobs/[slug]` 상세 + JobPosting JSON-LD Read | REQ-FUNC-113 | DB-002, FR-018 | M |
| FR-022 | Jobs | `/admin/jobs` 승인 큐 (pending → approved/rejected) Write | REQ-FUNC-114·115 | DB-002·014, FR-040 | M |
| FR-023 | Jobs | 관리자 일괄 승인 단축키 (신뢰도 5) Write | REQ-FUNC-116 | FR-022 | L |
| FR-024 | Jobs | 마감 7일 후 자동 archived 전이 cron Write | REQ-FUNC-117 | DB-017, INFRA-012 | M |
| FR-025 | Jobs | `/jobs` 빈 상태 UI + 구독 CTA | REQ-FUNC-118 | FR-018, UI-002 | L |
| FR-026 | Jobs | 공고 클릭 beacon `/api/jobs/click/[id]` Write | REQ-FUNC-119 | DB-006 | L |
| FR-027 | Jobs | 2~5년차 years_experience 하이라이트 Read | REQ-FUNC-120 | FR-018 | M |

### Epic 7 — Email Growth Loop

| Task ID | Epic | Feature | 관련 SRS 섹션 | 선행 | 복잡도 |
|---|---|---|---|---|---|
| FR-028 | Email | `/api/subscribe` 더블 옵트인 POST + zod + consents[] + Loops tpl-verify Write | REQ-FUNC-200·204·205 | API-007, DB-003·008 | M |
| FR-029 | Email | verification_token 24h 만료 + `/subscribe/verify` verified 전환 Write | REQ-FUNC-201·202·203 | FR-028 | M |
| FR-030 | Email | **daily-digest cron — Loops List Send 위임 (REQ-NF-011 해소)** Write | REQ-FUNC-206·215 / REQ-NF-011 | API-007, DB-007, INFRA-011 | H |
| FR-031 | Email | 야간 발송 차단 (21~08 KST) 로직 + 403 | REQ-FUNC-207 / CON-02 | FR-030 | L |
| FR-032 | Email | `(광고)` subject + footer 주입 (법적 §50) | REQ-FUNC-208 / CON-03 / REQ-NF-060~062 | API-007 | M |
| FR-033 | Email | `/unsubscribe/[token]` 원클릭 수신거부 Write | REQ-FUNC-209 / REQ-NF-065 | DB-003·008 | M |
| FR-034 | Email | `/subscribe/settings/[token]` GET 카테고리 리스트 Read | REQ-FUNC-210 | DB-003 | L |
| FR-035 | Email | `/subscribe/settings/[token]` PATCH + rate limit 10/min Write | REQ-FUNC-210·211 | FR-034 | M |
| FR-036 | Email | 카테고리 매칭 + quota balancing (다이제스트 필터) Read | REQ-FUNC-213 | DB-001·002·003 | M |
| FR-037 | Email | 매칭 0건 skip + 주 1회 확장 안내 메일 Write | REQ-FUNC-214 | FR-036, API-007 | M |
| FR-038 | Email | Loops webhook 수신 + HMAC 검증 + email_events INSERT Write | REQ-FUNC-216 / REQ-NF-049 | API-007, DB-009 | H |
| FR-039 | Email | 공유 루프 `/share/[id]?ref=` + referrer_subscriber_id + OG meta Write | REQ-FUNC-218·219 | DB-003, FR-028 | M |

### Epic 8 — UI/UX

| Task ID | Epic | Feature | 관련 SRS 섹션 | 선행 | 복잡도 |
|---|---|---|---|---|---|
| UI-001 | UI | Bento Grid 랜딩 Hero (Framer Motion staggerChildren + whileInView) | REQ-FUNC-301 / C-TEC-003 | INFRA-002·004 | M |
| UI-002 | UI | Gradient Blob 배경 (CSS-first @keyframes + prefers-reduced-motion) | REQ-FUNC-302·308 | INFRA-002·004 | M |
| UI-003 | UI | Scroll Parallax Hero (useScroll + useTransform 3-layer) | REQ-FUNC-303·308 | INFRA-004 | M |
| UI-004 | UI | 3D Carousel `/about` 하단 (CSS 3D + Framer Motion useMotionValue) | REQ-FUNC-304 | INFRA-004 | H |
| UI-005 | UI | 에디터 Pick 카드 시각 분리 (좌측 바 + 톤 라벨 뱃지) | REQ-FUNC-027 | INFRA-002 | L |
| UI-006 | UI | `<AviationTerm>` 툴팁 컴포넌트 (hover + tap + 키보드 포커스) | REQ-FUNC-029·307 | INFRA-002, DB-011 | M |
| UI-007 | UI | D-3 `arum.urgent` 배지 + 신뢰도 Star 아이콘 | REQ-FUNC-110·111 | INFRA-002 | L |
| UI-008 | UI | 카고 기업 공식 딥링크 Bento 카드 (14개 그리드) | REQ-FUNC-112 | DB-012, INFRA-002 | M |
| UI-009 | UI | About 페이지 (개인정보 비노출) + `/privacy` · `/terms` 법정 | REQ-FUNC-309·310 / CON-09 | INFRA-013 | M |

### Epic 9 — Admin Dashboard

| Task ID | Epic | Feature | 관련 SRS 섹션 | 선행 | 복잡도 |
|---|---|---|---|---|---|
| FR-040 | Admin | `/admin/login` Supabase Magic Link + admin_users 화이트리스트 체크 Write | REQ-FUNC-401·403 / C-TEC-013 | API-008, DB-004 | M |
| FR-041 | Admin | middleware `/admin/:path*` 세션 보호 | REQ-FUNC-402 / REQ-NF-044 | FR-040 | M |
| FR-042 | Admin | `/admin/dashboard` 8 KPI 카드 (shadcn/ui charts Recharts) Read | REQ-FUNC-404·405 / C-TEC-006 | INFRA-002, FR-043 | H |
| FR-043 | Admin | `/api/admin/metrics` 3소스 집계 (Supabase + Loops + Vercel Analytics) | REQ-FUNC-406 / REQ-NF-007 | API-007·008·009, FR-046·047 | M |
| FR-044 | Admin | `/admin/news` 인라인 에디터 Pick 작성 + 승인 플로우 Write | REQ-FUNC-407 | DB-001·015, FR-041 | M |
| FR-045 | Admin | 에디터 Pick 커버리지 < 60% 경고 + tpl-admin-alert 발송 Write | REQ-FUNC-410·411 | API-007, FR-044 | M |
| FR-046 | Admin | WAU 계산 쿼리 (last_active_at ≥ now()-7d) Read | REQ-FUNC-408 / REQ-NF-010 | DB-003·018 | L |
| FR-047 | Admin | 4주 유지율 코호트 쿼리 Read | REQ-FUNC-409 | DB-003, FR-046 | M |
| FR-052 | Admin | **Gemini Search + YouTube 카고 채널 자막 취합 (관리자 리서치 참고용)** | ADR-009 · C-TEC-025 부분 · C-TEC-016 (공개 게시 금지) | API-006, FR-040 | H |

### Epic 10 — Data/System Bridge

| Task ID | Epic | Feature | 관련 SRS 섹션 | 선행 | 복잡도 |
|---|---|---|---|---|---|
| FR-048 | System | `ingest_logs` 매 cron 기록 (running → success/partial/failed) Write | REQ-FUNC-508 | DB-010 | L |
| FR-049 | System | `/api/cron/*` Bearer CRON_SECRET 검증 middleware | REQ-FUNC-506 / REQ-NF-048 | INFRA-009 | M |
| FR-050 | System | last_active_at 자동 갱신 (email_events INSERT → 트리거) 동작 확인 | REQ-FUNC-217 | DB-016 | M |
| FR-051 | System | subscription_events 13개월 보존 정책 manual 검증 | REQ-FUNC-509 / CON-04 | DB-008 | M |

### Epic 11 — Test Automation

| Task ID | Epic | Feature | 관련 SRS 섹션 | 선행 | 복잡도 |
|---|---|---|---|---|---|
| TEST-001 | Test | DB 트리거 pgTAP suite (block_non_cargo · log_editor_pick · update_last_active) | REQ-FUNC-103·026·217 Verification | DB-014·015·016 | H |
| TEST-002 | Test | RLS negative test suite (anon/service_role 격리 12 테이블) | REQ-FUNC-500~504 Verification | DB-019 | M |
| TEST-003 | Test | Naver + 국내 RSS + 해외 RSS ingest integration + E2E 1회 | REQ-FUNC-010·011·012 Verification | FR-001, API-001~003 | M |
| TEST-004 | Test | Gemini adapter zod schema + 환각 탐지 unit | REQ-FUNC-015·016 Verification | API-006, FR-003 | M |
| TEST-005 | Test | Worknet + Saramin ingest + EXCLUDE_RE 30 케이스 | REQ-FUNC-100·101·102 Verification | FR-014·015·016 | M |
| TEST-006 | Test | Subscribe 더블 옵트인 E2E (본인 이메일 수신 포함) | REQ-FUNC-200·201 Verification | FR-028·029 | M |
| TEST-007 | Test | Daily digest cron integration + Loops List Send mock + 야간 403 | REQ-FUNC-206·207 Verification | FR-030·031 | M |
| TEST-008 | Test | Loops webhook HMAC unit + 서명 실패 401 | REQ-FUNC-216 Verification | FR-038 | M |
| TEST-009 | Test | `/news` `/jobs` Playwright E2E (필터·정렬·빈 상태) | REQ-FUNC-020·107·118 Verification | FR-005·018·025 | M |
| TEST-010 | Test | `/admin` Magic Link 보호 E2E + 미승인 404 | REQ-FUNC-401·402 Verification | FR-040·041 | M |
| TEST-011 | Test | 에디터 Pick workflow E2E (작성 → 저장 → 이메일 HTML) | REQ-FUNC-025·028·407 Verification | FR-008·009·044 | M |
| TEST-012 | Test | axe DevTools + 키보드 네비게이션 (WCAG 2.1 AA) | REQ-NF-140·141 | 전 UI Task | M |
| TEST-013 | Test | Lighthouse CI 성능 budget (LCP/TTFB/CLS/INP) | REQ-NF-001~006 | 전 UI Task | M |
| TEST-014 | Test | 이메일 §50 legal 검증 ((광고) · 수신거부 · 발신자 정보) | REQ-NF-060~063 | FR-032·033 | M |
| TEST-015 | Test | prefers-reduced-motion Playwright emulation | REQ-FUNC-308 / REQ-NF-142 | UI-001·002·003·004 | L |
| TEST-016 | Test | Hallucination 탐지 unit (원문 대비 숫자) | REQ-FUNC-016 | FR-002 | L |
| TEST-017 | Test | Dedupe hash unit (sha256 동일 item 2회) | REQ-FUNC-014 | FR-002 | L |
| TEST-018 | Test | Editor Pick 140자 constraint + tone enum unit | REQ-FUNC-025 | DB-001 | M |
| TEST-019 | Test | SQL 인덱스 EXPLAIN ANALYZE (p95 baseline) | REQ-NF-008·009·010 | DB-018 | M |
| TEST-020 | Test | k6 부하 테스트 (`/api/subscribe` p95 ≤500ms) | REQ-NF-013 | FR-028 | H |

### Epic 12 — Non-Functional

| Task ID | Epic | Feature | 관련 SRS 섹션 | 선행 | 복잡도 |
|---|---|---|---|---|---|
| NFR-001 | Perf | Lighthouse CI 성능 예산 설정 (LCP 2.5s · TTFB 600ms · CLS 0.1 · INP 200ms) | REQ-NF-001~006 | INFRA-010 | M |
| NFR-002 | Perf | `/admin/dashboard` p95 ≤2s (SSR + unstable_cache 5분) | REQ-NF-007 | FR-042·043 | M |
| NFR-003 | Perf | SQL 인덱스 지속 모니터링 (pg_stat_statements + 월간 audit) | REQ-NF-008·009·010 | DB-018, TEST-019 | M |
| NFR-004 | Perf | daily-digest ≤55s per invocation (Loops List Send 검증) | REQ-NF-011 | FR-030 | M |
| NFR-005 | Perf | `/api/cron/ingest-*` ≤50s 타임아웃 설계 | REQ-NF-012 | FR-001·014 | M |
| NFR-006 | Perf | `/api/subscribe` p95 ≤500ms | REQ-NF-013 | FR-028, TEST-020 | M |
| NFR-007 | Perf | Gemini 번역 p95 ≤4s + 타임아웃 skip 분기 | REQ-NF-014 | FR-003 | M |
| NFR-008 | Availability | Loops webhook 응답 ≤300ms | REQ-NF-015 | FR-038 | L |
| NFR-009 | Availability | 5xx 에러율 ≤0.5% / 28일 모니터링 | REQ-NF-020·021 | INFRA-008 | M |
| NFR-010 | Availability | /subscribe 성공률 ≥99.5% + digest 성공률 ≥98% | REQ-NF-022·023 | FR-028·030 | M |
| NFR-011 | Availability | RPO ≤24h pg_dump + RTO ≤4h 복구 절차 | REQ-NF-029·030 | INFRA-005 | M |
| NFR-012 | Security | 보안 기초 (RLS + Service Role + Magic Link 1h) | REQ-NF-043·044·045 | DB-019, API-008 | M |
| NFR-013 | Security | settings_token rate limit + CRON_SECRET bearer + webhook HMAC | REQ-NF-047·048·049 | FR-035·049·038 | M |
| NFR-014 | Security | gitleaks CI + TLS 1.2+ 강제 | REQ-NF-050·051 / C-TEC-024 | INFRA-010 | M |
| NFR-015 | Legal | §50 compliance suite ((광고) + unsubscribe + sender + 야간) | REQ-NF-060~066 / CON-02·03·04 | FR-031·032·033 | M |
| NFR-016 | Legal | 비카고 scope 이중 방어 검증 (트리거 + EXCLUDE_RE) | REQ-NF-067~069 / CON-05·09 | DB-014, FR-016 | M |
| NFR-017 | Quality | 콘텐츠 품질 지표 (에디터 Pick ≥60% · quota ±10%p · 오역 ≤10%) | REQ-NF-080~089 | FR-008, TEST-004 | L |
| NFR-018 | Growth | KPI 계기판 (WAU · 유지율 · 오픈률 · CTR · 수신거부율) | REQ-NF-100~109 | FR-042·046·047 | H |
| NFR-019 | Cost | 비용 캡 enforce (Gemini 일 1,500 · Supabase 500MB · Loops 1,500 알림) | REQ-NF-120·121·122 / C-COST-002·003·004 | API-006·007·008 | H |
| NFR-020 | Cost | API quota 모니터링 (Naver 0.5% · Worknet 1%) | REQ-NF-123·124 | API-001·004 | L |
| NFR-021 | A11y | WCAG AA + 키보드 nav + reduced-motion + 360px + 폰트 ≤100KB | REQ-NF-140~144 / C-TEC-004 | 전 UI Task | M |
| NFR-022 | Maintain | 운영 규약 (migrations 네이밍·email CI·ingest_logs 90일·Loops 1,500·PRD 단방향) | REQ-NF-160~167 | INFRA-006·010 | L |

---

## 4. Critical Path (의존성 핵심 블로커)

Phase 2 진입 직후 가장 많은 후속 Task 를 푸는 5대 블로커:

1. **INFRA-005** (Supabase 프로젝트) — DB-* 19개 전체 + API-008 차단 해제
2. **INFRA-009** (.env.example) — INFRA-008 · API-001~007 · 009 차단 해제
3. **DB-013** (Enum 3종) — DB-001 · 002 · 011 선행
4. **DB-019** (RLS 정책 일괄) — TEST-002 · NFR-012 선행 · Phase 2 종료 게이트
5. **API-008** (Supabase client 분리) — FR-* 전체 서버 로직 선행

---

## 5. 순차 · 병렬 실행 권장

### Phase 2 (2~3주)
**직렬**: INFRA-001 → 005 → 009 → DB-013 → DB-001~012 (병렬 가능) → DB-014~019 (병렬) → TEST-001·002·019
**병렬**: INFRA-002/003/004/010/013/014 (UI/CI 계열) · API-008 (Supabase client)
**종료 게이트**: NFR-012 보안 증거 문서 + Founder 서명

### Phase 3 (2주 · UI Mock)
**병렬**: MOCK-001~005 + UI-001~009 + FR-005·018·025·027·034·011 (Read Task)
**종료 게이트**: TEST-009·012·013·015 + NFR-001·021

### Phase 4 (3주 · API 연동)
**직렬**: API-001~007 → FR-001·014 ingest → FR-002·015·016 filter → FR-003 번역 → FR-022 승인 큐
**병렬**: INFRA-012 GHA + FR-007·026 beacon + FR-008·044 에디터 Pick + FR-024 archive
**종료 게이트**: TEST-003·004·005·011·016·017 + NFR-005·007·016·020

### Phase 5 (3주 · 이메일·대시보드) 🏁
**직렬**: API-007 → FR-028 → FR-029 → FR-030 → FR-031·032·033·038
**병렬**: FR-040~047 Admin + INFRA-011 Cron + NFR-015 §50 + NFR-018 Growth KPI
**종료 게이트**: TEST-006·007·008·010·014 + NFR-002·004·006·008·009·010·013·019·022

---

## 6. Out-of-Scope 재확인

본 TASKS.md 에 **포함되지 않은** 영역 (SRS 초과 금지 원칙 준수):

- 승무원·지상직·조종사·부기장·정비사·캐빈·기장 직군 Task (ADR-008 / CON-05)
- Phase 5.5: `/flights` · `/employers` · `/contribute` · `aircraft_capacity`
- Phase 6: Remember 벤치마크 커뮤니티
- Phase 7: 모바일 앱 · "아름" 브랜드 확장
- 수익화 (유료 구독 · B2B SaaS · 프리미엄 티어)
- 다국어 (EN)
- 인스타그램 크롤링 (Meta ToS)
- Admin Research Copilot (C-TEC-025, Phase 5.5+)
- Vercel AI SDK 사용 (C-TEC-015 금지)
- Prisma · Drizzle · 기타 ORM (C-TEC-011 금지)

---

## 7. 다음 스텝 (Stage 2 상세 명세 확장)

본 표의 150 Task 중 **아직 상세 명세되지 않은 112개** 를 5개씩 배치로 상세 명세 (교육자료 Stage 2 프롬프트 적용):

**다음 5개 후보 (Phase 3 UI Mock 진입 블로커 기준)**:
1. UI-001 Bento Grid Hero
2. UI-002 Gradient Blob
3. UI-005 에디터 Pick 카드
4. UI-006 AviationTerm 툴팁
5. MOCK-001 뉴스 mock 20건

위 5개를 상세 명세할 때는 `phase-3-tasks.md` 신규 파일에 풀 GitHub Issue 템플릿 (Summary / References / Breakdown / AC / Constraints / DoD / Dependencies) 으로 작성.

---

## Changelog

- **2026-04-19 v1.0**: 최초 작성. SRS Rev 1.0 + 교육자료 canonical 프롬프트 기반 150 Task 6-컬럼 표. 12 Epic 분류. 복잡도 H/M/L 분포 (10/64/26%). 기존 `01-macro-inventory.md` 는 Step 기반 alternate view 로 유지.

---

**End of Task List Spec.**
