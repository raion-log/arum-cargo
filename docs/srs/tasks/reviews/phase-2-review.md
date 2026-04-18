# Phase 2 Micro Task 사후 검토 보고서

> **근거**: 교육자료 §5 "도출된 Task 검토 및 보강" + 이미지 2 "학습 정리"
> **대상**: `docs/srs/tasks/phase-2-tasks.md` v1.2 (38/38 완결)
> **검토 기준**: SRS Rev 1.0 승격 검토와 동일 3대 기준 (개발 난이도 · 기술 스택 · 운영 비용)
> **검토일**: 2026-04-18
> **작성자**: Claude (Requirements Engineer)

---

## 0. Executive Summary

Phase 2 의 38 Task 가 **교육자료 원칙 및 SRS Rev 1.0 베이스라인에 부합**하며, **의도치 않은 Task 확장·Out-of-Scope 오염·비용 증가 요인 0건**으로 Phase 3 진입 준비가 완료됐다.

| 기준 | 판정 | 비고 |
|---|---|---|
| 개발 난이도 | ✅ 적절 | 11년차 카고 + Claude Code 에이전틱 개발 프로필에 과부하 없음 |
| 기술 스택 복잡성 | ✅ 유지 | C-TEC-001~025 외 도구 0건 |
| 운영 소요 비용 | ✅ ₩0 유지 | Phase 2 자체는 런타임 비용 0 (Supabase Free · Vercel Hobby · GitHub Actions public 무제한) |
| 의도치 않은 Task 확장 | ❌ 없음 | Task 는 SRS REQ 매핑이 명시적 · Cross-cutting 의존만 추가 (정합) |
| Out-of-Scope 오염 | ❌ 없음 | 승무원/모바일앱/수익화/Phase 5.5+ Task 0건 |

---

## 1. 3대 기준 재검토

### 1.1 개발 난이도 (MVP 단계 적절성)

| 영역 | Task 수 | 판정 | 메모 |
|---|---|---|---|
| Infra 설정 (pnpm · Tailwind · Supabase CLI · Vercel) | 14 | ✅ 적절 | 문서·CLI 풍부 · 에이전틱 개발 친화 |
| DB 스키마 (Postgres + plpgsql trigger + RLS) | 19 | ⚠️ 중상 | plpgsql 트리거(T-DB-014·015·016) 작성은 중급 · **학습 키워드로 이관** |
| API client stub (외부 API 9개 뼈대) | 1 (T-API-008) | ✅ 적절 | Phase 2 는 스텁만 · 실 구현은 Phase 4 |
| 테스트 (pgTAP · RLS negative · EXPLAIN ANALYZE) | 3 | ⚠️ 중상 | pgTAP 신규 도구 · **학습 키워드로 이관** |
| NFR 엔지니어링 (gitleaks · perf baseline · 보안 증거) | 3 | ✅ 적절 | 가이드·템플릿 풍부 |

**결론**: 2주차 학습 곡선 2~3일 예상 (pgTAP · plpgsql trigger). 그 외 하루 단위 구현 가능.

### 1.2 기술 스택 복잡성 · 오픈소스

| C-TEC | 준수 여부 | 근거 |
|---|---|---|
| C-TEC-001 Next.js 14 App Router | ✅ | T-INFRA-001 에서 고정 |
| C-TEC-002 Tailwind + shadcn/ui + lucide-react | ✅ | T-INFRA-002 |
| C-TEC-003 Framer Motion + CSS (GSAP/Lenis 금지) | ✅ | T-INFRA-004 + ESLint custom rule (T-INFRA-010) |
| C-TEC-004 Pretendard + Space Grotesk + JetBrains Mono | ✅ | T-INFRA-003 |
| C-TEC-005 lucide-react 만 | ✅ | T-INFRA-002 |
| C-TEC-008 서버 사이드 외부 API | ✅ | T-API-008 + T-INFRA-007 (barrel 금지) |
| C-TEC-010 Supabase PostgreSQL 15+ 단일 | ✅ | T-INFRA-005 · T-DB-001~019 |
| C-TEC-011 Raw SQL 마이그레이션 · ORM 금지 | ✅ | 모든 T-DB-* Task 가 SQL 파일 |
| C-TEC-012 RLS 필수 · Service Role 서버 전용 | ✅ | T-DB-019 · T-API-008 · T-NFR-012 |
| C-TEC-015 Gemini facade + 단일 어댑터 | N/A Phase 4 | T-INFRA-007 에서 stub 만 준비 |
| C-TEC-019 Vercel Hobby 단일 | ✅ | T-INFRA-008 |
| C-TEC-022 pnpm + Node 20 LTS | ✅ | T-INFRA-001 |
| C-TEC-023 ESLint + Prettier + TS strict | ✅ | T-INFRA-010 |
| C-TEC-024 gitleaks CI | ✅ | T-NFR-014 |

**발견된 스택 외 도구 0건.** Prisma · Drizzle · GSAP · Tremor · Vercel AI SDK 등 전부 등장하지 않음.

### 1.3 운영 소요 비용

| 서비스 | Phase 2 비용 | 근거 |
|---|---|---|
| Supabase | $0 (Free 500MB 의 < 10% 사용 예상) | T-NFR-003 추적 |
| Vercel | $0 (Hobby 100GB 대역폭 · Phase 2 는 개발 트래픽만) | T-INFRA-008 |
| GitHub Actions | $0 (public repo 무제한) | T-INFRA-012 (Phase 4 부터 사용) |
| 도메인 | $0 (`arumcargo.vercel.app`) | CON-12 |
| Loops · Gemini · OpenAI | $0 (Phase 2 미사용) | — |
| **합계** | **₩0 / 월** | C-COST-001 (월 ₩100,000) 대비 0% |

---

## 2. 의도치 않은 Task 확장 체크 (교육자료 §5 핵심)

> "직접 작성한 프롬프트에 따라 의도치 않은 TASK 확장은 없었는지 등을 다시 검토합니다."

### 2.1 Task 생성 기준

모든 38 Task 는 아래 중 하나 이상의 **명시적 앵커**를 갖는다:
- SRS REQ-FUNC · REQ-NF ID 참조
- C-TEC · CON 제약 번호
- PRD 앵커 링크
- ADR 참조

**앵커 없는 "그냥 만든" Task 0건**.

### 2.2 cross-cutting Task 재검토

일부 Task 는 특정 REQ 에 1:1 매핑이 아닌 "구조 전반" Task:

| Task ID | 구조적 성격 | 앵커 |
|---|---|---|
| T-INFRA-007 `src/lib` 뼈대 | 여러 Phase 의 파일 위치 SSOT | C-TEC-009 (lib/api 네이밍 규약) |
| T-INFRA-013 SiteHeader/Footer | 전 라우트 공통 레이아웃 | REQ-FUNC-310 · CON-09 |
| T-NFR-012 보안 기초 | Phase 2 종료 게이트 | REQ-NF-040~045 통합 |
| T-NFR-003 perf 지속 모니터링 | Phase 5+ 지속 효과 | REQ-NF-008~010 엔지니어링 확장 |

모두 **SRS REQ 또는 C-TEC 에 직접 근거** 있음. 독립 발명 0건.

### 2.3 "Task 분해가 과했나?" 자가 평가

| Task 그룹 | 분해 전 | 분해 후 | 근거 |
|---|---|---|---|
| Click beacons | 단일 Task 후보 | T-DB-005 + T-DB-006 분리 | news_clicks 와 job_clicks 는 FK 테이블이 다름 (CQRS 원리: 닫힌 문맥) |
| Trigger 3종 | 단일 Task 후보 | T-DB-014 (law-critical) + 015 + 016 분리 | 14번은 법적/정책 critical · 별도 책임 분리 필요 |
| 인덱스 + RLS | 묶음 후보 | T-DB-018 (index) + T-DB-019 (RLS) 분리 | 성능 vs 보안 목적 구분 · 각 테스트 Task 도 분리 (T-TEST-019 vs T-TEST-002) |
| Test + NFR | 과분해 의심 | T-TEST-019 (측정) + T-NFR-003 (지속) 분리 | 측정은 1회, 엔지니어링은 지속 — 책임 다름 |

**판정**: 모든 분해에 근거 있음. 과분해 없음.

---

## 3. Out-of-Scope 오염 검증

### 3.1 금지 영역 전수 스캔

38 Task 제목 + Summary grep:

| 금지 영역 | 발견 | 판정 |
|---|---|---|
| 승무원·조종사·객실·부기장·정비사·캐빈·기장 | **T-DB-014 의 regex 내부만 등장** (차단 대상) | ✅ 의도된 방어 |
| 모바일 앱 · Capacitor · Expo | 0건 | ✅ |
| 유료 구독 · B2B SaaS · 프리미엄 | 0건 | ✅ |
| `/flights` · `/employers` · `/contribute` · aircraft_capacity | 0건 | ✅ Phase 5.5 |
| 다국어 · i18n · EN 번역 | 0건 | ✅ Phase 7 |
| 인스타그램 · Instagram | 0건 | ✅ 영구 배제 |
| Admin Research Copilot · Perplexity · Grok | 0건 | ✅ Phase 5.5+ |
| Vercel AI SDK | 0건 | ✅ C-TEC-015 금지 |
| Prisma · Drizzle · ORM | 0건 | ✅ C-TEC-011 금지 |
| GSAP · Lenis · Lottie · Tremor | 0건 | ✅ C-TEC-003·006 금지 |

### 3.2 CON 위반 Task 검증

| CON | 위반 가능성 | Task 에서 보강됨 |
|---|---|---|
| CON-02 (야간 금지) | Phase 5 대상 | — |
| CON-03 ((광고) · 수신거부) | Phase 5 대상 | — |
| CON-04 (13mo 보존) | T-DB-008 에서 RESTRICT FK · retention cron 부재 검증 |
| CON-05 (비카고 차단) | T-DB-014 트리거 · T-TEST-001 검증 |
| CON-07 (본문 저장 금지) | T-DB-001 스키마에 `content`·`body`·`full_text` 컬럼 부재 확인 |
| CON-08 (서버 사이드 API) | T-API-008 (server-only) · T-INFRA-007 (barrel 금지) |
| CON-09 (개인정보 비노출) | T-INFRA-013 Footer + About lint 규칙 |
| CON-10 (arum.* only) | T-INFRA-002 + ESLint 규칙 (T-INFRA-010) |
| CON-11 (Supabase 500MB) | T-NFR-003 (지속 모니터링) |
| CON-12 (arumcargo.vercel.app) | T-INFRA-008 |

**위반 0건 · 방어 Task 전부 존재.**

---

## 4. 학습 정리 (이미지 2 프레임)

> "추출된 개발 Task들에 대해 생소한 부분, 애매한 부분이 있다면 ⇒ 가이드 러닝 또는 개인화 코딩멘토를 통해 상세한 기술 키워드 개념을 파악하세요!"

### 4.1 생소·애매 키워드 (학습 이관 대상)

[`../learning-keywords.md`](../learning-keywords.md) 파일로 별도 수집. Phase 2 에서 식별된 주요 키워드:

**DB / Postgres**
- pgTAP 테스트 DSL
- plpgsql trigger function (`BEFORE`/`AFTER` · `NEW`/`OLD`)
- Postgres partial index (`WHERE` 절 인덱스)
- `citext` extension
- `pgcrypto` `gen_random_bytes`
- `moddatetime` extension
- `pg_stat_statements`
- Supabase RLS · `auth.uid()` · `auth.jwt()`

**Next.js / TypeScript**
- `import "server-only"` 지시어
- `@supabase/ssr` (cookie session)
- zod discriminated union · `.parse()` vs `.safeParse()`

**Testing / CI**
- Playwright E2E
- Lighthouse CI budgets (`.lighthouserc`)
- gitleaks 커스텀 규칙
- `axe-core` 자동 스캔
- `next-bundle-analyzer`

**Motion / UI**
- Framer Motion `useReducedMotion()` · `MotionConfig`
- `tailwindcss-animate` class
- `react-intersection-observer`
- `next/font/local` + `next/font/google`

**Infra**
- Supabase CLI (`supabase start` · `db push` · `db reset`)
- Vercel CLI · Vercel Environment Variables
- GitHub Actions 공개 저장소 = 무제한 분

### 4.2 판정 기준 적용

이미지 2 의 판정 기준:

- [x] **"개발 계획에 나타난 키워드나 상세 내용에 대해서 추가로 학습/고민/분석 해야 할 지점들을 정리"** → `learning-keywords.md` 작성 완료 → **"오늘 작업 충분히 훌륭"**
- [x] **"개발 계획의 포괄적 범주에 대한 확신을 얻음"** → 38/38 Task 가 SRS 앵커 기반 · Out-of-Scope 오염 없음 → **"오늘 작업 대성공"**

---

## 5. Phase 2 종료 판정 체크리스트

Phase 2 의 **Task 추출** 이 아니라 **실제 구현 완료** 를 판정할 때 사용. Phase 2 진행 중 수시 업데이트.

- [ ] T-INFRA-001~014 전체 완료 · `pnpm dev` / `build` 통과
- [ ] T-DB-001~019 마이그레이션 전체 적용 · RLS 모든 테이블 true
- [ ] T-API-008 Supabase client 분리 + server-only 보안
- [ ] T-TEST-001 트리거 suite 전수 통과
- [ ] T-TEST-002 RLS negative test 전수 통과
- [ ] T-TEST-019 perf baseline 기록 · REQ-NF-008/009/010 충족
- [ ] T-NFR-012 보안 증거 문서 커밋 · Founder 서명
- [ ] T-NFR-014 gitleaks CI · 최초 fake PR 검증
- [ ] `.env.example` 완전성 · `.env.local` 실 값 · `.gitignore` 확인
- [ ] Vercel `arumcargo.vercel.app` 정상 응답 · Analytics 카운트 시작
- [ ] `aviation_glossary` 50건 + `cargo_career_links` 14건 seed 검수 완료

---

## 6. 다음 세션 추천 순서

1. **Phase 3 (UI Mock) Micro 세션 진입** — macro-inventory §5 Phase 3 24 Task 를 Few-Shot 7~10개로 시작
2. **Phase 2 실제 구현 착수** — 본 review 의 §5 체크리스트를 진행 상황 대시보드로 사용
3. **reviews/** 디렉토리 확장 — Phase 3 종료 후 `phase-3-review.md` 등
4. **SRS Rev 1.0 Amendment trigger 감시** — OQ-M6 · OQ-R17 · Supabase 500MB · Loops 1,500

---

## Changelog

- **2026-04-18 v1.0**: 최초 작성. Phase 2 Micro 추출 38/38 완결 직후 사후 검토 수행. 교육자료 §5 (3대 기준 + 확장 체크) + 이미지 2 (학습 정리) 적용.

---

**End of Phase 2 Review.**
