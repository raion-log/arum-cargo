# Arum Cargo — Checkpoints (사용자 추적용)

> **목적**: 150 Task 가 촘촘해서 사용자(Founder)가 전체 진행을 한눈에 보기 어려움. 12 Checkpoint 로 그룹핑하여 **사용자는 CP 12개만 추적**, AI 에이전트는 CP 하위 상세 Task 를 실행.
> **3층 구조**: CHECKPOINTS.md (사용자) → [`TASKS.md`](./TASKS.md) (AI 에이전트 150) → [`phase-N-tasks.md`](./phase-2-tasks.md) (풀 템플릿 상세)
> **베이스라인**: SRS Rev 1.0
> **작성일**: 2026-04-19

---

## 0. 왜 Checkpoint 인가

150 Task 는 AI 에이전트 배치 작업 단위로 적정하지만, **사용자가 GitHub Project 에서 150 이슈를 직접 보면 피로도 과함**. Checkpoint 는 **"제품 능력이 한 단위로 사용 가능해지는 지점"** — 사용자는 이 지점만 체크하면 프로젝트 진행을 판단할 수 있다.

| 층 | 파일 | 단위 | 사용자 |
|---|---|---|---|
| **Checkpoint** | `CHECKPOINTS.md` (이 파일) | 제품 능력 마일스톤 | **Founder (추적)** |
| Task 목록 | `TASKS.md` | 150 canonical Task | AI 에이전트 (실행) |
| 상세 명세 | `phase-N-tasks.md` | 풀 GitHub Issue 템플릿 | AI 에이전트 (구현) |

---

## 1. 전체 Checkpoint 현황

| CP | 이름 | Phase | 포함 Task | 게이트? | 진행도 |
|---|---|---|---|---|---|
| **CP-01** | Project Foundation | 2 | 13 | — | 0% |
| **CP-02** | Data Model Baseline | 2 | 20 | — | 0% |
| **CP-03** | 🚪 Phase 2 Quality Gate | 2 | 6 | ✅ 필수 | 0% |
| **CP-04** | Mock UI 렌더 | 3 | 19 (Rev 1.1 −FR-027) | — | 0% |
| **CP-05** | 🚪 Phase 3 Quality Gate | 3 | 4 | ✅ 필수 | 0% |
| **CP-06** | News Ingest Live | 4 | 10 | — | 0% |
| **CP-07** | Jobs Ingest Live | 4 | 10 | — | 0% |
| **CP-08** | Admin Workflow (뉴스/채용 승인) | 4 | 9 (Rev 1.1 −FR-023·−FR-052) | — | 0% |
| **CP-09** | 🚪 Phase 4 Quality Gate | 4 | 10 | ✅ 필수 | 0% |
| **CP-10** | Email Growth Loop Live | 5 | 12 (Rev 1.1 −FR-039) | — | 0% |
| **CP-11** | Admin Dashboard Live | 5 | 10 | — | 0% |
| **CP-12** | 🏁 MVP 완성 (Phase 5 Quality Gate) | 5 | 14 | ✅ 최종 | 0% |

**합계**: 12 CP · 140 Task (비 quality-gate 부분은 일부 Task 공유/재활용 반영)

**🚪 게이트 CP**: CP-03 · CP-05 · CP-09 · CP-12 — 통과 못하면 다음 Phase 진입 금지.

---

## 2. CP 상세

### CP-01 · Project Foundation

**완료 기준**: `pnpm dev` 로컬 성공 + Vercel 배포 URL 200 응답 + CI lint/typecheck 통과

**포함 Task (13)**:
- INFRA-001 Next.js 14 init
- INFRA-002 Tailwind + arum.* + shadcn/ui
- INFRA-003 3종 폰트
- INFRA-004 Framer Motion + motion libs
- INFRA-005 Supabase 프로젝트 + CLI (cross-cutting blocker)
- INFRA-006 migration 네이밍 CI
- INFRA-007 src/lib 뼈대 + barrel 금지
- INFRA-008 Vercel 배포 + Analytics
- INFRA-009 .env.example SSOT
- INFRA-010 ESLint + Prettier + TS strict + Husky
- INFRA-013 SiteHeader/Footer + 사업자정보
- INFRA-014 next.config remotePatterns
- API-008 Supabase client 분리

### CP-02 · Data Model Baseline

**완료 기준**: 12 테이블 생성 + RLS 활성 + 트리거 3종 + 인덱스 7종 + 글로서리 50건 + 채용사 14건 시드 + enum 3종

**포함 Task (20)**:
- DB-001~019 (19 마이그레이션)
- MOCK-006 (aviation_glossary seed JSON)

### CP-03 · 🚪 Phase 2 Quality Gate

**완료 기준**: DB 트리거 pgTAP 통과 + RLS negative test 통과 + SQL p95 baseline 기록 + 보안 증거 문서 + gitleaks CI

**포함 Task (6)**:
- TEST-001 트리거 pgTAP suite
- TEST-002 RLS negative test
- TEST-019 SQL EXPLAIN ANALYZE
- NFR-003 SQL 성능 지속 모니터링
- NFR-012 보안 기초 (RLS + Service Role + Magic Link)
- NFR-014 gitleaks + TLS

### CP-04 · Mock UI 렌더

**완료 기준**: 모든 화면 mock 데이터로 렌더 + 반응형 320~1920px + Bento + Parallax + Blob + 3D Carousel `/about` 하단

**포함 Task (20)**:
- MOCK-001~005 (5 mock fixtures)
- UI-001~009 (9 UI 컴포넌트)
- FR-005 /news 피드 쿼리 (mock 데이터 연결)
- FR-011 썸네일 remotePatterns
- FR-013 카테고리 quota UI 경고
- FR-018·019·020 /jobs 필터·URL 동기화·정렬
- FR-025 /jobs 빈 상태
- FR-027 2~5년차 하이라이트

### CP-05 · 🚪 Phase 3 Quality Gate

**완료 기준**: Lighthouse Performance ≥80 · Accessibility ≥90 · axe 0 critical · reduced-motion 동작 · 폰트 ≤100KB

**포함 Task (4)**:
- TEST-009 /news /jobs Playwright E2E
- TEST-012 axe + 키보드 네비게이션
- TEST-013 Lighthouse CI budget
- TEST-015 prefers-reduced-motion emulation
- NFR-001 Lighthouse CI 성능 예산
- NFR-021 WCAG AA + 360px 모바일

### CP-06 · News Ingest Live

**완료 기준**: 실제 카고 뉴스 20건 이상 `/news` 노출 · 해외 기사 Gemini 번역 5건 이상 · 카테고리 분류 작동

**포함 Task (10)**:
- API-001 Naver News client
- API-002 국내 RSS parser 4종
- API-003 해외 RSS + Readability
- API-006 Gemini facade + adapter
- FR-001 뉴스 ingest 파이프라인
- FR-002 뉴스 품질 필터 (exclude + dedupe + 환각)
- FR-003 Gemini 번역 + 쿼터
- FR-004 카테고리 분류 + quota
- FR-006 /news/[slug] 상세 + JSON-LD
- FR-012 ingest 실패 스냅샷 fallback

### CP-07 · Jobs Ingest Live

**완료 기준**: 실제 승인 카고 공고 10건 이상 `/jobs` 노출 · 비카고 DB 트리거 차단 작동 · 신뢰도 자동 계산

**포함 Task (10)**:
- API-004 Worknet XML client
- API-005 Saramin client
- INFRA-012 GitHub Actions 워크플로 3종
- FR-014 워크넷 ingest
- FR-015 사람인 secondary + dedupe
- FR-016 exclude regex ingest 필터
- FR-017 source_trust_score 계산
- FR-021 /jobs/[slug] 상세
- FR-024 마감 7일 자동 archived
- FR-026 공고 클릭 beacon

### CP-08 · Admin Workflow (뉴스/채용 승인)

**완료 기준**: 관리자가 뉴스 에디터 Pick 작성 → 승인 → 이메일 블록 렌더 E2E · 채용 승인 큐 동작

**포함 Task (9, Rev 1.1 −2)**:
- FR-007 뉴스 클릭 beacon
- FR-008 에디터 Pick 저장 + history (Gemini 초안 + Founder 편집 하이브리드 · C-TEC-016)
- FR-009 에디터 Pick 이메일 HTML 빌더
- FR-010 용어 SSR 래핑
- FR-022 /admin/jobs 승인 큐
- ~~FR-023 일괄 승인 단축키~~ — Rev 1.1 제거
- FR-044 /admin/news 에디터 Pick 작성 (Phase 5 일부 선행)
- FR-048 ingest_logs 기록
- FR-049 CRON_SECRET middleware
- FR-050 last_active_at 자동 갱신
- ~~FR-052 Gemini YouTube grounding~~ — Rev 1.1 철회 (Phase 5.5+ C-TEC-025 복귀)

### CP-09 · 🚪 Phase 4 Quality Gate

**완료 기준**: 환각 탐지 · dedupe · exclude regex 전수 통과 · Gemini 오역률 ≤10% · 비카고 scope 보호 실증

**포함 Task (10)**:
- TEST-003 뉴스 ingest integration + E2E
- TEST-004 Gemini adapter + 환각 unit
- TEST-005 Worknet/Saramin + EXCLUDE_RE 30 케이스
- TEST-011 에디터 Pick workflow E2E
- TEST-016 Hallucination unit
- TEST-017 Dedupe hash unit
- TEST-018 Editor Pick 140자 unit
- NFR-005 ingest-cron ≤50s
- NFR-007 Gemini p95 ≤4s
- NFR-016 비카고 scope 이중 방어

### CP-10 · Email Growth Loop Live

**완료 기준**: 본인 이메일로 end-to-end 구독 → 확인 → 다이제스트 수신 · (광고) + 수신거부 렌더 · 야간 차단

**포함 Task (13)**:
- API-007 Loops transactional + List Send + webhook HMAC
- INFRA-011 vercel.json Cron (07:00 KST)
- FR-028 /api/subscribe 더블 옵트인
- FR-029 verification_token 24h
- FR-030 daily-digest cron (Loops List Send)
- FR-031 야간 발송 차단
- FR-032 (광고) subject + footer
- FR-033 /unsubscribe 원클릭
- FR-034 settings GET
- FR-035 settings PATCH + rate limit
- FR-036 카테고리 매칭 + quota
- FR-037 매칭 0건 skip + 확장 안내
- FR-038 Loops webhook + HMAC
- FR-039 공유 루프 referrer + OG
- FR-051 subscription_events 13개월 보존

### CP-11 · Admin Dashboard Live

**완료 기준**: Magic Link 로그인 → `/admin/dashboard` 8 KPI 카드 shadcn/ui charts 렌더 · Vercel Analytics + Loops + Supabase 3 소스 통합

**포함 Task (10)**:
- API-009 Vercel Analytics client
- DB-017 archive_expired_jobs 함수
- FR-040 /admin/login Magic Link
- FR-041 /admin/:path* middleware
- FR-042 /admin/dashboard 8 KPI
- FR-043 /api/admin/metrics 3소스 집계
- FR-044 /admin/news 에디터 Pick (CP-08 과 공유)
- FR-045 Pick 커버리지 경고 알림
- FR-046 WAU 쿼리
- FR-047 4주 유지율 코호트

### CP-12 · 🏁 MVP 완성 (Phase 5 Quality Gate)

**완료 기준**: §50 법적 준수 실측 통과 + Loops §50 검증 (OQ-M6) + webhook HMAC + p95 SLA + WAU 측정 파이프라인 · **Phase 5 DoD 전체 충족**

**포함 Task (14)**:
- TEST-006 Subscribe 더블 옵트인 E2E (본인 이메일)
- TEST-007 Daily digest + 야간 차단
- TEST-008 Loops webhook HMAC unit
- TEST-010 /admin Magic Link 보호 E2E
- TEST-014 이메일 §50 legal compliance
- TEST-020 k6 부하 테스트
- NFR-002 /admin/dashboard p95 ≤2s
- NFR-004 daily-digest ≤55s
- NFR-006 /api/subscribe p95 ≤500ms
- NFR-008 Loops webhook 응답
- NFR-009 5xx 에러율 모니터링
- NFR-010 성공률 SLO (subscribe 99.5% · digest 98%)
- NFR-011 RPO/RTO 백업
- NFR-013 rate limits + CRON_SECRET + HMAC
- NFR-015 §50 legal suite (OQ-M6 실증)
- NFR-017 콘텐츠 품질 지표
- NFR-018 Growth KPI 계기판
- NFR-019 비용 캡 (Gemini · Supabase · Loops)
- NFR-020 API quota 모니터링
- NFR-022 운영 규약

---

## 3. 진행 추적 방법

### 사용자 루틴 (Founder 용)

1. **주간 리뷰 (매주 금요일)**: 본 파일 §1 현황 표에서 진행도 % 업데이트
2. **CP 완료 시**: 해당 CP 의 "완료 기준" 전부 충족 확인 → 0% → 100%
3. **Quality Gate (🚪) 도달 시**: 절대 skip 금지. 통과 증거(테스트 로그·문서·스크린샷)를 PR 에 첨부.

### AI 에이전트 루틴

1. 새 세션 진입 시: 본 파일 → TASKS.md → phase-N-tasks.md 순 읽기
2. 미완료 가장 빠른 CP 의 Task 부터 구현
3. CP 내 Task 가 전부 상세 명세되어 있지 않으면, 교육자료 Stage 2 프롬프트로 5개씩 상세 명세 추가

### 병렬 가능 여부

- **CP-01 · CP-02 병렬 가능** (INFRA-005 완료 후)
- **CP-06 · CP-07 · CP-08 병렬 가능** (Phase 4 내)
- **CP-10 · CP-11 병렬 가능** (Phase 5 내)
- Quality Gate (🚪) 는 순차 — skip 금지

---

## 4. 총 예상 기간

| Phase | CP | 예상 기간 (solo + Claude Code) |
|---|---|---|
| Phase 2 | CP-01·02·03 | 2~3주 |
| Phase 3 | CP-04·05 | 2주 |
| Phase 4 | CP-06·07·08·09 | 3~4주 |
| Phase 5 | CP-10·11·12 | 3주 |
| **MVP 총** | — | **10~12주** |

Phase 5+ 운영 (WAU 500 달성) 은 CP 외 · 별도 지표 추적.

---

## Changelog

- **2026-04-19 v1.0**: 최초 작성. 150 Task 를 12 CP 로 그룹핑. 사용자(Founder) 추적 부담 감소 · AI 에이전트 실행 granularity 는 유지. 3층 구조(CP/Task/상세) 확립.

---

**End of Checkpoints.**
