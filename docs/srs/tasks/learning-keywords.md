# Learning Keywords — 생소·애매 기술 키워드 누적

> **근거**: 교육자료 이미지 2 "학습 정리" — 개발 Task 에 나타난 키워드·개념을 별도 정리하여 가이드 러닝 / 코딩멘토로 확장 학습
> **작성일**: 2026-04-18
> **초기 수집**: Phase 2 Micro 추출 (38 Task) 기반
> **업데이트 규칙**: 각 Phase Micro 세션 진행 중 발견되는 생소·애매 용어를 **append only**. 학습 완료 후 체크박스 처리.

---

## 0. 사용 방법

| 상태 | 의미 |
|---|---|
| `H` (High) | Phase 진행 블로커 — 학습 필수 · 자료 조사 시급 |
| `M` (Medium) | 구현 시 깊이 이해 필요 — 주말 1~2시간 학습 권장 |
| `L` (Low) | 참고 용어 · 구현 시 docs 참조 가능 |
| `✅` | 학습 완료 · 개념 숙지 확인 |

**권장 학습 경로**:
- H → 즉시 · 공식 docs + 1개 hands-on 튜토리얼
- M → Phase 시작 전 · 공식 docs
- L → Task 착수 시 on-the-go

---

## 1. DB / Postgres

| 키워드 | 발견 맥락 | 우선순위 | 학습 리소스 (제안) | ✅ |
|---|---|---|---|---|
| **pgTAP** | T-TEST-001 · T-TEST-002 테스트 DSL | H | https://pgtap.org/documentation.html · Supabase `db test` 가이드 | ☐ |
| **plpgsql trigger function** | T-DB-014 · 015 · 016 (`BEFORE`/`AFTER` · `NEW`/`OLD` · `RETURN NEW`) | H | Postgres docs §43 PL/pgSQL | ☐ |
| **Postgres partial index** | T-DB-018 (`WHERE is_published=true` 인덱스) | M | https://www.postgresql.org/docs/current/indexes-partial.html | ☐ |
| **Supabase RLS policies** | T-DB-019 (`CREATE POLICY ... FOR SELECT TO anon USING`) | H | https://supabase.com/docs/guides/auth/row-level-security | ☐ |
| **auth.uid() · auth.jwt() · auth.role()** | T-DB-015 (`current_setting('request.jwt.claim.sub')`) | M | Supabase Auth Context 섹션 | ☐ |
| **`citext` extension** | T-DB-003 · T-DB-004 (이메일 대소문자 무시) | L | Postgres docs contrib modules | ☐ |
| **`pgcrypto` · `gen_random_bytes`** | T-DB-003 (settings_token 256bit) | L | Postgres docs | ☐ |
| **`moddatetime` extension** | T-DB-001 (updated_at 자동 갱신) | L | Supabase 기본 제공 | ☐ |
| **`pg_stat_statements`** | T-NFR-003 (쿼리 통계) | M | Postgres docs §F.30 | ☐ |
| **Supabase migrations 워크플로** | 전 T-DB-* Task (`YYYYMMDDHHMMSS_*.sql` · `supabase db push`) | H | https://supabase.com/docs/guides/cli/local-development | ☐ |
| **`ON DELETE CASCADE` vs `SET NULL` vs `RESTRICT`** | T-DB-005·006 (CASCADE) · T-DB-008 (RESTRICT · 감사) · T-DB-009 (SET NULL) | M | Postgres docs FK constraints | ☐ |
| **Postgres `ENUM` 타입 제약** | T-DB-013 (ALTER TYPE ADD VALUE 만 가능) | L | Postgres docs 8.7 | ☐ |
| **jsonb operator `||` (concat)** | T-DB-015 (editor_pick_history append) | L | Postgres docs §9.16 | ☐ |

---

## 2. Next.js / TypeScript

| 키워드 | 발견 맥락 | 우선순위 | 학습 리소스 | ✅ |
|---|---|---|---|---|
| **`import "server-only"` 지시어** | T-API-008 (admin.ts 서버 전용 격리) | H | https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#keeping-server-only-code-out-of-the-client-environment | ☐ |
| **`@supabase/ssr` (App Router)** | T-API-008 (`createServerClient` + `cookies()`) | H | https://supabase.com/docs/guides/auth/server-side/nextjs | ☐ |
| **Next.js App Router vs Pages Router** | T-INFRA-001 (App Router 단일) | H | https://nextjs.org/docs/app | ☐ |
| **Server Components vs Client Components** | T-UI-* 전반 · `'use client'` 경계 | H | Next.js docs composition patterns | ☐ |
| **`next/font/local` + `next/font/google`** | T-INFRA-003 (Pretendard self-host) | M | https://nextjs.org/docs/app/api-reference/components/font | ☐ |
| **`images.remotePatterns` + `<Image>` optimization** | T-INFRA-014 · T-FEAT-032 | M | Next.js docs Image | ☐ |
| **`cookies()` from next/headers** | T-API-008 server client | M | Next.js docs Dynamic Functions | ☐ |
| **`revalidatePath` / `unstable_cache`** | T-NFR-002 (`/admin/dashboard` 5분 캐시) | M | Next.js docs Caching | ☐ |
| **TypeScript `strict` + `noUncheckedIndexedAccess`** | T-INFRA-001 · T-INFRA-010 | L | TS handbook Strict Mode | ☐ |
| **zod discriminated union · `.parse()` vs `.safeParse()`** | T-API-006 Gemini output schema | M | https://zod.dev/?id=discriminated-unions | ☐ |
| **`typedRoutes: true`** | T-INFRA-001 (Next.js 14 실험 기능) | L | Next.js docs | ☐ |

---

## 3. Testing / CI / Security

| 키워드 | 발견 맥락 | 우선순위 | 학습 리소스 | ✅ |
|---|---|---|---|---|
| **Playwright E2E** | T-TEST-009·010·011 · 여러 Playwright assertions | M | https://playwright.dev/docs/intro | ☐ |
| **Lighthouse CI budgets** | T-NFR-001 (`.lighthouserc.json` · GitHub Actions) | M | https://github.com/GoogleChrome/lighthouse-ci | ☐ |
| **axe-core 자동 접근성 스캔** | T-TEST-012 (WCAG 2.1 AA) | L | https://www.deque.com/axe/ | ☐ |
| **gitleaks + 커스텀 규칙** | T-NFR-014 (`.gitleaks.toml`) | M | https://github.com/gitleaks/gitleaks | ☐ |
| **`next-bundle-analyzer`** | T-API-008 (Service Role Key grep 번들) | L | https://www.npmjs.com/package/@next/bundle-analyzer | ☐ |
| **Husky + lint-staged (pre-commit hook)** | T-INFRA-010 | L | https://typicode.github.io/husky/ | ☐ |
| **`EXPLAIN ANALYZE` 해석 (Bitmap Index Scan · Seq Scan)** | T-TEST-019 · T-NFR-003 | H | Postgres docs §14 Performance Tips | ☐ |
| **HMAC signature 검증 (Loops webhook)** | T-FEAT-216-W · T-TEST-008 | M | Node crypto `createHmac` · Loops webhook docs | ☐ |
| **Vercel Preview vs Production 환경 분리** | T-INFRA-008 | L | Vercel docs Environments | ☐ |

---

## 4. Motion / UI / Animation

| 키워드 | 발견 맥락 | 우선순위 | 학습 리소스 | ✅ |
|---|---|---|---|---|
| **Framer Motion `useReducedMotion()`** | T-INFRA-004 · T-UI-308 · REQ-NF-142 | M | https://www.framer.com/motion/use-reduced-motion/ | ☐ |
| **Framer Motion `MotionConfig` 루트 provider** | T-INFRA-004 | L | Framer Motion docs | ☐ |
| **Framer Motion `useScroll` + `useTransform` (Parallax)** | T-UI-303 | M | https://www.framer.com/motion/use-scroll/ | ☐ |
| **Framer Motion `staggerChildren` variants** | T-UI-301 (Bento 리빌) | M | Framer Motion docs variants | ☐ |
| **`tailwindcss-animate` plugin** | T-INFRA-004 | L | https://github.com/jamiebuilds/tailwindcss-animate | ☐ |
| **`react-intersection-observer`** | T-INFRA-004 · 스크롤 트리거 | L | https://github.com/thebuilder/react-intersection-observer | ☐ |
| **CSS `@keyframes` + `filter: blur()` (Gradient Blob)** | T-UI-302 | L | MDN CSS filter | ☐ |
| **CSS 3D transform · `transform-style: preserve-3d`** | T-UI-304 (3D Carousel) | L | MDN 3D transforms | ☐ |
| **`prefers-reduced-motion` media query** | T-INFRA-004 · T-UI-302 | L | MDN CSS media | ☐ |
| **shadcn/ui charts (Recharts wrapper)** | T-FEAT-404-R · REQ-FUNC-404 · C-TEC-006 | M | https://ui.shadcn.com/charts | ☐ |
| **lucide-react icon library** | T-INFRA-002 | L | https://lucide.dev/ | ☐ |

---

## 5. Infra / Cron / Email

| 키워드 | 발견 맥락 | 우선순위 | 학습 리소스 | ✅ |
|---|---|---|---|---|
| **Supabase CLI (`supabase start` · `db push` · `db reset`)** | T-INFRA-005 · 모든 T-DB-* | H | https://supabase.com/docs/reference/cli | ☐ |
| **Supabase Docker Desktop 의존성** | T-INFRA-005 | L | Supabase CLI Troubleshooting | ☐ |
| **Vercel CLI · Environment Variables** | T-INFRA-008 | L | https://vercel.com/docs/cli | ☐ |
| **Vercel Cron `vercel.json`** | T-INFRA-011 | M | https://vercel.com/docs/cron-jobs | ☐ |
| **GitHub Actions `workflow_dispatch` · cron schedule** | T-INFRA-012 | M | GitHub Actions docs · cron 표현식 | ☐ |
| **GitHub Actions public repo = 무제한 분** | 본 프로젝트 현재 public | L | https://docs.github.com/en/billing/managing-billing-for-github-actions | ☐ |
| **🚨 Loops List Send API** | **T-FEAT-206-W · REQ-NF-011 블로커 해소 핵심** | **H** | https://loops.so/docs/transactional · "list send" 엔드포인트 확인 필수 | ☐ |
| **Loops webhook 서명 · `Authorization` header vs HMAC body** | T-FEAT-216-W | M | Loops webhook docs | ☐ |
| **Gemini 1.5 Flash — `@google/generative-ai` SDK** | T-API-006 | H | https://ai.google.dev/tutorials/get_started_node | ☐ |
| **Gemini Search grounding (`tools: [{googleSearch: {}}]`)** | FR-052 · ADR-009 | H | https://ai.google.dev/gemini-api/docs/grounding | ☐ |
| **Gemini YouTube video input (`fileData: youtube URL`)** | FR-052 · ADR-009 | H | https://ai.google.dev/gemini-api/docs/video-understanding | ☐ |
| **Gemini 무료 티어 한도 (분당 15 · 일 1,500)** | CON-06 · REQ-NF-120 | L | Google AI Studio docs | ☐ |
| **Naver 뉴스 API + 쿼리 파라미터** | T-API-001 | M | https://developers.naver.com/docs/serviceapi/search/news/news.md | ☐ |
| **`fast-xml-parser` (Worknet XML)** | T-API-004 | L | npm fast-xml-parser | ☐ |
| **`Readability` (Mozilla, 해외 기사 추출)** | T-API-003 | M | https://github.com/mozilla/readability | ☐ |

---

## 6. Architecture Patterns

| 키워드 | 발견 맥락 | 우선순위 | 학습 리소스 | ✅ |
|---|---|---|---|---|
| **🚨 CQRS (Command Query Responsibility Segregation)** | Task ID `-R` / `-W` suffix 전반 | **H** | Martin Fowler CQRS · Microsoft docs CQRS pattern | ☐ |
| **Provider-Agnostic Facade 패턴** | T-API-006 (translation/index.ts) · C-TEC-015 | M | Refactoring Guru · Facade pattern | ☐ |
| **Double Opt-in 이메일 인증** | T-FEAT-200-W · §50 한국 법 요건 | M | §50 정보통신망법 본문 · Mailchimp double opt-in 가이드 | ☐ |
| **Idempotency Key 패턴** | T-DB-007 (digest_date UNIQUE) | L | Stripe API idempotency 가이드 | ☐ |
| **Beacon pattern (click tracking)** | T-DB-005·006 · T-FEAT-024-W | L | MDN `navigator.sendBeacon` | ☐ |
| **Circuit Breaker / Retry with exponential backoff** | T-API-001~007 (외부 API 재시도) | M | p-retry · resilience patterns | ☐ |

---

## 7. Legal / Compliance (카고 특화)

| 키워드 | 발견 맥락 | 우선순위 | 학습 리소스 | ✅ |
|---|---|---|---|---|
| **정보통신망법 §50 (한국)** | T-FEAT-207·208·209 · CON-02·03·04 | H | 법제처 정보통신망법 본문 | ☐ |
| **`(광고)` 접두어 규약** | REQ-NF-060 | L | 방통위 가이드 | ☐ |
| **저작권 공정 이용 (뉴스 요약)** | CON-07 (본문 저장 금지 · 제목 + 2~3문장) | M | 저작권법 제35조 · 한국언론진흥재단 | ☐ |
| **OG Meta (Open Graph) — 공유 카드** | T-FEAT-218-W · REQ-FUNC-219 | L | https://ogp.me/ | ☐ |
| **JSON-LD structured data (NewsArticle · JobPosting)** | T-FEAT-023-R · T-FEAT-113-R | M | https://schema.org/NewsArticle · https://schema.org/JobPosting | ☐ |

---

## 8. 우선순위 H 요약 (Phase 2 진입 전 학습 필수)

Phase 2 실 구현 착수 전 **11년차 카고 현직자 + 중급 SW 배경** 기준으로 아래 7개는 반드시 학습:

1. **pgTAP** — T-TEST-001·002 블로커
2. **plpgsql trigger** — T-DB-014·015·016 구현 키
3. **Supabase RLS** — T-DB-019 · 보안 기초
4. **Supabase CLI 워크플로** — 모든 DB Task
5. **`import "server-only"`** — T-API-008 보안 패턴
6. **`@supabase/ssr`** — App Router cookie session
7. **EXPLAIN ANALYZE 해석** — T-TEST-019 성능 검증

**Phase 3 이후 학습 필수** (현 시점 우선순위 M 이지만 Phase 3~5 진입 블로커):

- Framer Motion `useReducedMotion()` · `useScroll` (Phase 3)
- Loops List Send API (Phase 5 · REQ-NF-011 블로커)
- Gemini SDK (Phase 4)
- CQRS 패턴 (Phase 4~5 Logic Task 전반)

---

## 9. 학습 진행 상황 (월간 업데이트)

| 월 | 학습 완료 개수 | 누적 키워드 수 | 메모 |
|---|---|---|---|
| 2026-04 | 0 / 55 | 55 | 초기 수집 |
| 2026-05 | — | — | (업데이트 예정) |
| 2026-06 | — | — | |

---

## Changelog

- **2026-04-18 v1.0**: 최초 작성. Phase 2 Micro 추출 (38 Task) 기반 55개 키워드 수집. 7 카테고리 분류. 우선순위 H/M/L.

---

**End of Learning Keywords.**
