# Arum Cargo — Milestone 분할 (M1/M2/M3)

> **목적**: 146 Task 를 **3 Milestone 으로 묶어 순차 배포**. 한 번에 전체 완성 대신 각 M 완료 시점에 비공개 리뷰용 Vercel URL 로 실 동작 확인.
> **근거**: 2026-04-19 사용자 결정 — "큰 덩어리 3개 → 프런트엔드 배포 → 로컬 실험 → 완성분만 릴리즈"
> **작성일**: 2026-04-19

---

## 0. 원칙

| 원칙 | 의미 |
|---|---|
| **각 M 은 stand-alone 동작** | M1 만으로도 Vercel URL 에서 화면 전체 렌더됨 (Mock 데이터 기반) |
| **비공개 리뷰용 배포** | 일반 사용자 공개 X · "Coming Soon" 표시 X · 사용자 본인 + 초청 리뷰어만 URL 공유 |
| **로컬 실험 → 완성분만 릴리즈** | `localhost:3000` 에서 실험 · 완성된 feature 만 `git push` → Vercel 자동 배포 |
| **법적 압박 최소화** | 공개 배포 아니므로 §50 (이메일 발송) 은 M3 내부 테스트 한정 — 본인 수신함만 |
| **화려한 홈 UI 포함** (사용자 결정) | M1 부터 Bento + Parallax + Gradient Blob + 3D Carousel 전부 포함 |

---

## 1. Milestone 현황

| M | 이름 | 기간 | Task 수 | 배포 상태 | 게이트 |
|---|---|---|---|---|---|
| **M1** | **프런트엔드 뼈대 + 화려한 홈 + Mock 화면** | 2주 | ~35 | Vercel 리뷰용 URL · 200 응답 · 화면 전체 렌더 | Lighthouse 80+ · 반응형 320px~1920px · reduced-motion |
| **M2** | **Jobs Engine (실 DB + ingest)** | 3주 | ~40 | 실 카고 공고 필터링 `/jobs` 동작 · 관리자 승인 큐 | 비카고 차단 트리거 · RLS 12 테이블 · 트러스트 스코어 |
| **M3** | **News + Email + Admin Dashboard** | 4주 | ~60 | 🏁 MVP 완성 · 더블 옵트인 · 07:00 digest · 4 KPI | §50 Loops 검증 (OQ-M6) · Gemini 번역 품질 · daily-digest 타임아웃 ≤55s |

**합계**: 9주 (MVP) + 15 NFR/Test 분산 · 전 세션 리뷰 Founder 판단.

---

## 2. M1 — 프런트엔드 뼈대 + 화려한 홈 + Mock 화면

### 목적
사용자(Founder) + 초청 리뷰어가 Vercel URL 에 접속해 **"아 이런 분위기구나"** 를 즉시 체감. 화면 전부 렌더 + Mock 데이터로 리스트·필터·툴팁 다 동작. DB/이메일/외부 API 일절 없음.

### 포함 범위

**인프라 기반** (14):
- INFRA-001 Next.js 14 init
- INFRA-002 Tailwind + arum.* + shadcn/ui
- INFRA-003 Pretendard + Space Grotesk + JetBrains Mono 폰트
- INFRA-004 Framer Motion + tailwindcss-animate + intersection-observer
- INFRA-007 src/lib 뼈대
- INFRA-008 Vercel 배포 (비공개 리뷰 URL)
- INFRA-009 .env.example (Supabase/Loops 는 placeholder · 사용 안 함)
- INFRA-010 ESLint + Prettier + TS strict + Husky + gitleaks
- INFRA-013 SiteHeader/Footer (사업자정보는 "추후 확정" 더미)
- INFRA-014 next.config remotePatterns
- (INFRA-005 Supabase CLI 선택: M1 에서 설치만 · 연결은 M2)
- (INFRA-006 마이그레이션 CI 는 M2 로 유예)
- (INFRA-011 Vercel Cron · INFRA-012 GHA: M3 로 유예)

**UI 전체** (9):
- UI-001 Bento Grid 홈 Hero (Metric-Live 제외 · Job-Spotlight 확대 + 14사 preview 카드)
- UI-002 Gradient Blob 배경 (CSS-first)
- UI-003 Scroll Parallax Hero (3-layer)
- UI-004 **3D Carousel `/about` 하단** (사용자 명시 유지)
- UI-005 에디터 Pick 카드 (좌측 바 + 톤 라벨)
- UI-006 `<AviationTerm>` 툴팁 (hover + tap + 키보드)
- UI-007 D-3 urgent 배지 + 신뢰도 Star 아이콘
- UI-008 14사 공식 딥링크 Bento 카드
- UI-009 About (1줄 자기소개) + `/privacy` + `/terms` 법정 (더미 컨텐츠)

**Mock 데이터 + 정적 파일** (6):
- MOCK-001 news_articles mock 20건
- MOCK-002 job_posts mock 10건
- MOCK-003 에디터 Pick 샘플 5건
- MOCK-004 subscribers + daily_digests mock (미리보기)
- MOCK-005 Admin KPI mock
- MOCK-006 aviation_glossary 50건 JSON (Supabase 없이 정적 파일)

**Read 로직 (Mock 기반)** (6):
- FR-005 /news 피드 쿼리 (mock 파일 import)
- FR-006 /news/[slug] 상세 + JSON-LD (mock)
- FR-010 용어 SSR 자동 래핑
- FR-011 썸네일 remotePatterns
- FR-018·019·020 /jobs 피드 + 필터 + 정렬 (mock)
- FR-025 /jobs 빈 상태 UI

**품질 게이트** (4):
- TEST-009 Playwright E2E (필터·정렬·툴팁)
- TEST-012 axe + 키보드 네비게이션
- TEST-013 Lighthouse CI budget (LCP 2.5s · CLS 0.1 · INP 200ms)
- TEST-015 prefers-reduced-motion emulation
- NFR-001 Lighthouse 성능 예산 · NFR-021 WCAG AA + 360px + 폰트 100KB

### 완료 기준 (M1 DoD)

- [ ] `pnpm dev` 로컬 200 응답 · 모든 화면 렌더
- [ ] `pnpm build` · `pnpm typecheck` · `pnpm lint` 통과
- [ ] Vercel 비공개 리뷰 URL 배포 완료 · 200 응답
- [ ] `/` Bento + Parallax + Blob 작동 + 스태거드 리빌
- [ ] `/about` 3D Carousel 작동 + 자기소개 1줄
- [ ] `/companies` 14 딥링크 그리드 (외부 이동 `_blank noopener`)
- [ ] `/jobs` Mock 10건 카드 + 카테고리/정렬/빈 상태
- [ ] `/news` Mock 20건 + 카테고리 탭 + 에디터 Pick 카드 시각 분리
- [ ] `/news/[slug]` 상세 + 용어 툴팁 동작
- [ ] Lighthouse 모바일 Perf ≥ 80 · Accessibility ≥ 90
- [ ] reduced-motion 에서 애니메이션 비활성
- [ ] axe DevTools 0 critical

### 배포 전략

- Vercel Dashboard → Deployment Protection **"Vercel Authentication"** 활성 (비공개)
- 또는 기본 `arumcargo.vercel.app` 공개 URL 그대로 · "리뷰용" 맥락은 About 페이지 상단 배너로 명시
- `main` branch 는 리뷰 확정 후 · `dev` 가 Vercel Preview 주력

### M1 에서 **하지 않을 것** (M2/M3 유예)

- Supabase 연결 · 실 DB 쿼리
- 워크넷/사람인/Naver 실 API 호출
- Gemini 번역 호출
- Loops 이메일 발송
- 관리자 Magic Link 로그인
- daily-digest cron
- 4 KPI 실데이터 대시보드
- 13개월 이벤트 보존
- gitleaks Fake PR 실측 (M1 끝나고 M2 진입 직전)

---

## 3. M2 — Jobs Engine (실 DB + ingest)

### 목적
취준생 Primary (A1) 의 **핵심 가치 = 카고 전용 채용 필터** 를 실데이터로 동작시킨다. Mock → Supabase 전환 + 워크넷/사람인 실 ingest + 비카고 차단 트리거 실증.

### 포함 범위

**인프라 추가**:
- INFRA-005 Supabase 프로젝트 생성 + 로컬 `supabase start`
- INFRA-006 migrations 네이밍 CI
- INFRA-012 GitHub Actions 워크플로 3종 (ingest-jobs 활성)

**DB 전체** (19):
- DB-001~019 (모든 테이블 + enum + 트리거 + 인덱스 + RLS)

**API 외부 연동** (4):
- API-004 Worknet XML client
- API-005 Saramin client
- API-008 Supabase client 분리 (anon + service_role)
- API-009 Vercel Analytics client (기본 세팅만)

**Jobs 로직** (5):
- FR-014 워크넷 ingest
- FR-015 사람인 secondary + dedupe
- FR-016 exclude regex ingest 필터
- FR-017 source_trust_score 계산
- FR-022 /admin/jobs 승인 큐
- FR-024 마감 7일 자동 archived
- FR-026 공고 클릭 beacon

**Admin 진입**:
- FR-040 /admin/login Magic Link
- FR-041 middleware /admin/:path*
- FR-044 /admin/news 에디터 Pick 작성 (빈 구조만 · News 은 M3)

**품질 게이트 추가**:
- TEST-001 DB 트리거 pgTAP suite
- TEST-002 RLS negative test suite
- TEST-005 Worknet/Saramin + EXCLUDE_RE 30 케이스
- TEST-010 /admin Magic Link 보호 E2E
- TEST-019 SQL EXPLAIN ANALYZE
- NFR-003 SQL 인덱스 성능
- NFR-012 보안 기초 (RLS + Service Role + Magic Link)
- NFR-014 gitleaks CI
- NFR-016 비카고 scope 이중 방어

### 완료 기준 (M2 DoD)

- [ ] Supabase 모든 테이블 + RLS 활성 + 트리거 3종 적용
- [ ] 워크넷 실 API 로 카고 공고 수집 성공 (실제 10건 이상 DB INSERT)
- [ ] 사람인 secondary + dedupe 동작
- [ ] 비카고 (승무원/조종사 등) DB 트리거 차단 실증 (수동 INSERT 테스트)
- [ ] `/jobs` 실데이터 10건 이상 + 필터 동작 + 트러스트 스코어 Star 표시
- [ ] `/admin/jobs` 승인 큐 pending → approved 동작
- [ ] Magic Link 로 관리자 로그인 + middleware 404 확인
- [ ] RLS negative test 전수 통과
- [ ] SQL p95 목표 충족 (뉴스 200ms · 채용 300ms · WAU 100ms)

---

## 4. M3 — News + Email + Admin Dashboard (🏁 MVP)

### 목적
WAU 생성 엔진 가동. 에디터 Pick hybrid (Gemini 초안 + 사람 편집) · 더블 옵트인 구독 · 07:00 daily-digest · 4 KPI 대시보드. **§50 Loops 검증 여기서 실증**.

### 포함 범위

**인프라 추가**:
- INFRA-011 vercel.json Cron (0 22 * * * = 07:00 KST)

**API**:
- API-001 Naver News API
- API-002 국내 RSS Best Effort (카고프레스 HTML parse)
- API-003 해외 RSS (Loadstar / ACN UK / FlightGlobal)
- API-006 Gemini 1.5 Flash facade + adapter
- API-007 Loops transactional + List Send + webhook HMAC

**News 로직**:
- FR-001 뉴스 ingest 통합
- FR-002 품질 필터 (exclude + dedupe + 환각)
- FR-003 Gemini 번역 + 쿼터
- FR-004 카테고리 분류 + quota
- FR-007 뉴스 클릭 beacon
- FR-008 에디터 Pick 저장 + history (hybrid · C-TEC-016)
- FR-009 에디터 Pick 이메일 HTML 빌더
- FR-012 ingest 실패 fallback
- FR-013 카테고리 quota UI 경고

**Email**:
- FR-028 /api/subscribe 더블 옵트인
- FR-029 verification_token 24h
- FR-030 daily-digest cron (Loops List Send)
- FR-031 야간 발송 차단
- FR-032 (광고) subject + footer
- FR-033 /unsubscribe 원클릭
- FR-034·035 settings GET + PATCH
- FR-036 카테고리 매칭 + quota
- FR-037 매칭 0건 skip
- FR-038 Loops webhook + HMAC

**Admin Dashboard**:
- FR-042 /admin/dashboard 4 KPI (WAU · /jobs 클릭률 · 14 딥링크 이탈률 · Pick 커버리지)
- FR-043 /api/admin/metrics 3소스 집계
- FR-045 Pick 커버리지 경고 + tpl-admin-alert
- FR-046 WAU 쿼리
- FR-047 4주 유지율 코호트
- FR-048 ingest_logs 기록
- FR-049 CRON_SECRET middleware
- FR-050 last_active_at 자동 갱신
- FR-051 subscription_events 13개월 보존

**품질 게이트 최종**:
- TEST-003 뉴스 ingest integration + E2E
- TEST-004 Gemini adapter + 환각 unit
- TEST-006 Subscribe 더블 옵트인 E2E
- TEST-007 Daily digest + 야간 차단
- TEST-008 Loops webhook HMAC
- TEST-011 에디터 Pick workflow E2E
- TEST-014 §50 legal compliance
- TEST-016 Hallucination unit
- TEST-017 Dedupe hash unit
- TEST-018 Editor Pick 140자 unit
- TEST-020 k6 부하 테스트
- NFR-002/004/005/006/007/008 성능 전체
- NFR-009/010/011 가용성 + 백업
- NFR-013 rate limits + CRON_SECRET + HMAC
- NFR-015 §50 legal suite (OQ-M6 실증)
- NFR-017/018/019/020/022 콘텐츠 품질 + Growth + 비용 + 운영 규약

### 완료 기준 (M3 DoD · MVP 완성)

- [ ] 본인 이메일로 end-to-end 구독 → 확인 → 다이제스트 수신
- [ ] Gemini 번역 5건 이상 성공 · 카고 용어 괄호 병기 확인
- [ ] 에디터 Pick hybrid 플로우: Gemini 초안 생성 → Founder 편집 → 승인 → 이메일 포함
- [ ] daily-digest 07:00 KST 자동 발송 (Vercel Cron)
- [ ] §50 준수 실측: (광고) subject · 원클릭 수신거부 · 발신자정보 · 야간 차단
- [ ] Loops webhook HMAC 검증 동작
- [ ] 4 KPI 대시보드 실데이터 렌더
- [ ] Magic Link 로그인 + admin_users 화이트리스트
- [ ] 부하 테스트 `/api/subscribe` p95 ≤ 500ms
- [ ] OQ-M6 (Loops §50) 결과 기록 · 실패 시 Rev 1.2 Amendment 발동

---

## 5. Milestone → CP 매핑 참조

기존 12 CP 는 M 태그로 그룹핑:

| CP | 원래 내용 | Milestone |
|---|---|---|
| CP-01 Project Foundation | Infra 전반 | **M1 부분** (14 중 11 M1 · 나머지 M2/M3) |
| CP-02 Data Model Baseline | DB 19 + RLS | **M2** |
| CP-03 🚪 Phase 2 Quality Gate | Test + NFR | **M2 종료 게이트** |
| CP-04 Mock UI 렌더 | UI + Mock | **M1** |
| CP-05 🚪 Phase 3 Quality Gate | Lighthouse · a11y · motion | **M1 종료 게이트** |
| CP-06 News Ingest Live | 뉴스 파이프 | **M3** |
| CP-07 Jobs Ingest Live | 채용 파이프 | **M2** |
| CP-08 Admin Workflow | 에디터 Pick + 승인 큐 | **M2 일부 + M3 일부** |
| CP-09 🚪 Phase 4 Quality Gate | 환각·dedupe·scope | **M3 중간 게이트** |
| CP-10 Email Growth Loop Live | 구독·digest | **M3** |
| CP-11 Admin Dashboard Live | 4 KPI | **M3** |
| CP-12 🏁 Phase 5 Quality Gate | MVP 완성 | **M3 종료 게이트** |

---

## Changelog

- **2026-04-19 v1.0**: 최초 작성. 사용자 결정 "큰 덩어리 3개 → 프런트엔드 배포 → 로컬 실험 → 완성분 릴리즈" 반영. M1 범위 "Static" 이 아닌 "**풀 프런트엔드 + 화려한 홈 UI · Mock 데이터**" 로 수정 (사용자 재정의). Coming Soon 표시 불필요 (비공개 리뷰용).

---

**End of Milestones.**
