# Phase 2 Tasks — Next.js 프로젝트 셋업 (Micro)

> **목적**: Phase 2 의 33 Task 중 **Few-Shot 표준 템플릿 7개**를 모범으로 작성. 나머지 Phase 2 Task 는 다음 세션에서 동일 스타일로 확장.
> **상위 컨텍스트**: [`00-overview.md`](./00-overview.md) 방법론 · [`01-macro-inventory.md`](./01-macro-inventory.md) 전체 인벤토리
> **베이스라인**: [SRS Rev 1.0](../SRS-001-arum-cargo.md)
> **Phase 2 DoD 원본**: [PRD 07 §3.2](../../prd/07-roadmap-milestones.md)
> **작성일**: 2026-04-18 · **Few-Shot 샘플 수**: 7 / 33

---

## 0. Phase 2 Task 전체 요약 (Macro → Micro 매핑)

Phase 2 의 33 Task 는 아래 3 블록으로 착수 순서가 정해진다:

| 블록 | Task ID | 실행 순서 |
|---|---|---|
| **A. 기반 인프라** (블로커 제거) | T-INFRA-001 ~ 010, 013, 014 | **1주차** — 프로젝트 init · Supabase 연결 · CI 게이트 |
| **B. DB 스키마 + 시드** (가장 큰 선행 Task) | T-DB-001 ~ 019 + T-MOCK-006 + T-API-008 | **1~2주차** — migrations 전체 작성 · RLS · 트리거 · seed |
| **C. 품질 게이트** (Phase 2 종료 판정용) | T-TEST-001·002·019 + T-NFR-003·012·014 | **2주차 말** — Phase 2 DoD 검증 |

본 파일에서 아래 **Few-Shot 샘플 7개** 를 먼저 완성 (A/B/C 각 블록에서 골고루 선정):
- **A 블록**: T-INFRA-001 · T-INFRA-005
- **B 블록**: T-DB-001 · T-DB-014 · T-API-008
- **C 블록**: T-TEST-001 · T-NFR-014

나머지 26 Task 는 동일 템플릿 · 동일 톤으로 다음 세션에서 확장.

---

## Few-Shot Sample 1 / 7

````markdown
---
name: Infra Task
about: SRS Rev 1.0 기반 Next.js 프로젝트 초기화
title: "[Infra] T-INFRA-001: web/ Next.js 14 App Router + TypeScript strict + pnpm 초기화"
labels: ['infra', 'phase:2', 'step:4', 'priority:must']
assignees: ''
---

## 🎯 Summary
- Task ID: T-INFRA-001
- 기능명: `web/` 디렉토리에 Next.js 14 (App Router) + TypeScript strict + pnpm + Node.js 20 LTS 를 초기화한다.
- 목적: 모든 후속 Phase 2~5 Task 의 실행 기반이 되는 단일 풀스택 프로젝트 뼈대 확보.

## 🔗 References (Spec & Context)
> 💡 AI Agent & Dev Note: 작업 시작 전 아래 문서를 Read/Evaluate 할 것.

- SRS C-TEC-001 (Next.js App Router 단일, Pages Router 금지): [`SRS-001#c-tec-001`](../SRS-001-arum-cargo.md)
- SRS C-TEC-022 (pnpm + Node 20 LTS 고정): [`SRS-001#c-tec-022`](../SRS-001-arum-cargo.md)
- SRS C-TEC-023 (ESLint + Prettier + TS strict CI 게이트): [`SRS-001#c-tec-023`](../SRS-001-arum-cargo.md)
- PRD 00 §3.2 (web/ 디렉토리 구조): [`PRD 00`](../../prd/00-overview.md)
- PRD 07 §3.2 Phase 2 DoD: [`PRD 07`](../../prd/07-roadmap-milestones.md)

## ✅ Task Breakdown (실행 계획)
- [ ] 프로젝트 루트에서 `pnpm create next-app@14 web --typescript --app --tailwind --eslint --src-dir --import-alias "@/*"` 실행
- [ ] `web/package.json` engines `"node": "20.x"` · `"pnpm": "9.x"` 명시
- [ ] `web/tsconfig.json` `"strict": true` + `"noUncheckedIndexedAccess": true` + `"noImplicitOverride": true` 확인
- [ ] `.nvmrc` 에 `20` 기록 (프로젝트 루트)
- [ ] `web/next.config.mjs` 에 `reactStrictMode: true` + `experimental.typedRoutes: true`
- [ ] `web/src/app/layout.tsx` 기본 레이아웃 · `web/src/app/page.tsx` 빈 랜딩
- [ ] `.gitignore` 에 `.next/` · `node_modules/` · `.env*.local` 포함 확인
- [ ] 로컬 `pnpm dev` 로 `http://localhost:3000` 정상 렌더 확인

## 📋 Acceptance Criteria (BDD / GWT)

### Scenario 1: 빌드·타입체크 통과
- **Given**: `web/` 초기화 완료 · `pnpm install` 실행
- **When**: `pnpm --filter web typecheck && pnpm --filter web build` 실행
- **Then**: 0 에러 · 빌드 아티팩트 `web/.next/` 생성

### Scenario 2: 로컬 개발 서버 기동
- **Given**: `pnpm dev` 실행
- **When**: `http://localhost:3000` 접근
- **Then**: 200 응답 · 빈 랜딩 페이지 렌더 · 콘솔 Warning 0

### Scenario 3: Pages Router 금지 규약
- **Given**: `web/src/` 디렉토리 스캔
- **When**: `pages/` 디렉토리 존재 여부 확인
- **Then**: `pages/` 부재 · `app/` 만 존재

## ⚙️ Technical & Non-Functional Constraints
- **타입 안전**: TS strict 필수 (C-TEC-023)
- **패키지 매니저**: pnpm 고정 (npm·yarn CI 에서 실패 처리)
- **Node 버전**: 20 LTS 만 허용 (`.nvmrc` + `engines`)
- **App Router 강제**: Pages Router 혼용 시 PR 차단 (ESLint 규칙 T-INFRA-010 에서 설정)

## ✔️ Definition of Done (DoD)
- [ ] 모든 Acceptance Criteria 충족
- [ ] `pnpm dev` · `pnpm build` · `pnpm typecheck` 로컬 통과
- [ ] README (최소) · `web/package.json` 커밋
- [ ] Vercel 프로젝트 연결 전 단계까지 완료 (Vercel 배포는 T-INFRA-008)

## 🔗 Dependencies & Blockers
- **Depends on**: 없음 (최초 선행)
- **Blocks**: T-INFRA-002 (Tailwind · shadcn init) · T-INFRA-007 (src/lib 뼈대) · T-INFRA-010 (CI lint) · **Phase 2 전체**
````

---

## Few-Shot Sample 2 / 7

````markdown
---
name: Infra Task
about: SRS Rev 1.0 기반 Supabase 프로젝트 생성 + 로컬 CLI 연결
title: "[Infra] T-INFRA-005: Supabase 프로젝트 생성 + 로컬 supabase start CLI 연결"
labels: ['infra', 'phase:2', 'step:4', 'priority:must', 'blocker']
assignees: ''
---

## 🎯 Summary
- Task ID: T-INFRA-005
- 기능명: Supabase 원격 프로젝트 생성 + 로컬 개발용 `supabase start` Docker 스택 연결. Service Role Key / Anon Key / DB URL 확보.
- 목적: **T-DB-001~019 전체의 cross-cutting blocker 해제**. 로컬·프로덕션 동일 Postgres 엔진으로 마이그레이션 안정성 확보.

## 🔗 References (Spec & Context)
> 💡 AI Agent & Dev Note: 작업 시작 전 아래 문서를 Read/Evaluate 할 것.

- SRS C-TEC-010 (Supabase PostgreSQL 15+ 단일 · 로컬 `supabase start`): [`SRS-001#c-tec-010`](../SRS-001-arum-cargo.md)
- SRS C-TEC-011 (migrations 네이밍 · ORM 자동 마이그레이션 금지): [`SRS-001#c-tec-011`](../SRS-001-arum-cargo.md)
- SRS C-TEC-012 (RLS 필수 + Service Role Key 서버 전용): [`SRS-001#c-tec-012`](../SRS-001-arum-cargo.md)
- PRD 03 (데이터 모델): [`PRD 03`](../../prd/03-data-model.md)
- ADR-003 (Supabase 무인증 MVP): [`ADR-003`](../../adr/ADR-003-no-auth-mvp-email-token-only.md)
- Supabase CLI docs: https://supabase.com/docs/guides/cli (version ≥ 1.180)

## ✅ Task Breakdown (실행 계획)
- [ ] Supabase 계정에서 신규 프로젝트 `arumcargo-prod` 생성 (region: `ap-northeast-2` Seoul 권장)
- [ ] DB Password · Service Role Key · Anon Key · Project URL 수집 → 1Password·`.env.local` 안전 기록
- [ ] `brew install supabase/tap/supabase` 또는 npm 글로벌 설치
- [ ] 프로젝트 루트에서 `supabase init` 실행 → `supabase/` 디렉토리 생성
- [ ] `supabase link --project-ref <ref>` 로 원격 연결
- [ ] `supabase start` 로컬 Docker 스택 기동 (Postgres + Studio + Kong + Auth + Storage)
- [ ] `supabase/config.toml` 확인 — `[auth] otp_expiry = 3600` (REQ-FUNC-403 Magic Link 1h)
- [ ] `web/.env.local` 에 `NEXT_PUBLIC_SUPABASE_URL` · `NEXT_PUBLIC_SUPABASE_ANON_KEY` · `SUPABASE_SERVICE_ROLE_KEY` 기록 (T-INFRA-009 `.env.example` 와 key 이름 일치)
- [ ] `supabase db push --dry-run` 으로 로컬·원격 스키마 동기화 준비 확인

## 📋 Acceptance Criteria (BDD / GWT)

### Scenario 1: 로컬 Supabase 기동
- **Given**: Docker Desktop 실행 중 · Supabase CLI 설치 완료
- **When**: `supabase start`
- **Then**: `API URL: http://localhost:54321` · `DB URL: postgresql://postgres:postgres@localhost:54322/postgres` · `Studio URL: http://localhost:54323` 출력 · 모든 서비스 `healthy` 상태

### Scenario 2: 원격 프로젝트 연결
- **Given**: Supabase 원격 프로젝트 생성 완료
- **When**: `supabase link --project-ref <ref>` 후 `supabase db pull`
- **Then**: 원격 스키마 덤프 성공 · `supabase/migrations/` 내 `00000000000000_remote_schema.sql` 생성

### Scenario 3: 서버/클라이언트 Key 분리
- **Given**: `.env.local` 작성 완료
- **When**: grep 으로 `SUPABASE_SERVICE_ROLE_KEY` 가 `NEXT_PUBLIC_` prefix 로 노출되었는지 검사
- **Then**: Service Role Key 가 `NEXT_PUBLIC_*` 접두사와 함께 등장 0건

## ⚙️ Technical & Non-Functional Constraints
- **region**: Seoul (`ap-northeast-2`) 고정 — 국내 사용자 레이턴시 최소화
- **보안**: Service Role Key 는 서버 env 전용 (REQ-NF-043·044 / CON-08). 클라이언트 번들 노출 시 T-TEST-002 / T-NFR-014 에서 실패
- **버전**: Postgres 15 이상 · Supabase CLI ≥ 1.180
- **로컬=프로덕션 동일 엔진**: Prisma + SQLite 같은 대체 조합 금지 (C-TEC-010)

## ✔️ Definition of Done (DoD)
- [ ] 모든 Acceptance Criteria 충족
- [ ] `supabase start` / `supabase stop` 정상 동작
- [ ] `supabase db push --dry-run` warning 0 (마이그레이션 준비 완료)
- [ ] Supabase Studio Dashboard 에서 테이블 0개 확인 (아직 마이그레이션 미실행)
- [ ] 1Password 또는 동등 보안 도구에 Service Role Key 백업
- [ ] `.env.local` git 무시 확인 (`.gitignore` 포함)

## 🔗 Dependencies & Blockers
- **Depends on**: T-INFRA-001 (Next.js init)
- **Blocks**: **T-DB-001 ~ T-DB-019 전체 · T-API-008 Supabase clients · T-INFRA-007 lib 뼈대**

## ⚠️ Cross-cutting Blocker 경고
본 Task 는 Phase 2 B 블록 (DB 19개) 전체의 선행 조건이다. 지연 시 Phase 2 전체 지연 리스크.
````

---

## Few-Shot Sample 3 / 7

````markdown
---
name: DB Task
about: SRS Rev 1.0 기반 news_articles 테이블 마이그레이션
title: "[DB] T-DB-001: news_articles 테이블 + 컬럼 constraints 마이그레이션"
labels: ['db', 'phase:2', 'step:1', 'priority:must']
assignees: ''
---

## 🎯 Summary
- Task ID: T-DB-001
- 기능명: `news_articles` 테이블 마이그레이션 — PK · 컬럼 · `editor_pick` ≤ 140자 / `summary` 20~500자 CHECK · `published_at` 인덱스는 T-DB-018 에서 별도 발급.
- 목적: 카고 뉴스 I-Side 기능 전체의 저장소 확보. Step 1 Contract SSOT.

## 🔗 References (Spec & Context)
> 💡 AI Agent & Dev Note: 작업 시작 전 아래 문서를 Read/Evaluate 할 것.

- SRS REQ-FUNC-025 (editor_pick ≤ 140자 · tone enum): [`SRS-001#req-func-025`](../SRS-001-arum-cargo.md)
- SRS REQ-FUNC-501 (anon SELECT `is_published=true` only · RLS 는 T-DB-019 에서 적용): [`SRS-001#req-func-501`](../SRS-001-arum-cargo.md)
- SRS CON-07 (본문 저장 금지 · summary ≤ 500): [`SRS-001#con-07`](../SRS-001-arum-cargo.md)
- PRD 03 §4.3 news_articles 스키마: [`PRD 03`](../../prd/03-data-model.md)
- SRS §6.2 ERD news_articles entity: [`SRS-001#erd`](../SRS-001-arum-cargo.md)

## ✅ Task Breakdown (실행 계획)
- [ ] 마이그레이션 파일 생성: `supabase/migrations/20260419000001_create_news_articles.sql`
- [ ] Enum dependency 확인 — `news_category` 와 `editor_pick_tone` 은 T-DB-013 선행
- [ ] 컬럼 정의:
  - `id uuid PRIMARY KEY DEFAULT gen_random_uuid()`
  - `source_name text NOT NULL`
  - `source_url text UNIQUE NOT NULL`
  - `title text NOT NULL`
  - `summary text CHECK (char_length(summary) BETWEEN 20 AND 500)`
  - `category news_category NOT NULL`
  - `tags text[] DEFAULT '{}'`
  - `published_at timestamptz NOT NULL`
  - `is_published boolean NOT NULL DEFAULT false`
  - `is_translated boolean NOT NULL DEFAULT false`
  - `editor_pick text CHECK (char_length(editor_pick) <= 140)`
  - `editor_pick_tone editor_pick_tone`
  - `editor_pick_at timestamptz`
  - `editor_pick_history jsonb DEFAULT '[]'::jsonb`
  - `dedupe_hash text UNIQUE NOT NULL`
  - `thumbnail_url text`
  - `created_at timestamptz NOT NULL DEFAULT now()`
  - `updated_at timestamptz NOT NULL DEFAULT now()`
- [ ] `updated_at` 자동 갱신 trigger 연결 (기존 `moddatetime` extension 사용 또는 별도 함수)
- [ ] 주석 (COMMENT ON COLUMN) 추가 — `editor_pick`, `editor_pick_history`, `dedupe_hash` 의미 명시
- [ ] `supabase db push` 실행 후 로컬 Studio 에서 테이블 검증
- [ ] 원격은 Phase 2 후반 일괄 배포

## 📋 Acceptance Criteria (BDD / GWT)

### Scenario 1: 정상 INSERT
- **Given**: `source_name='cargopress'`, `source_url='https://...'`, `title='...'`, `summary` 21자, `category='cargo-market'`, `published_at=now()`, `dedupe_hash='sha256-...'`
- **When**: INSERT
- **Then**: 성공 · 자동 `id` 생성 · `is_published=false` · `is_translated=false` · `editor_pick_history='[]'`

### Scenario 2: editor_pick 길이 초과 차단
- **Given**: 위 + `editor_pick` 141자 문자열
- **When**: INSERT 시도
- **Then**: `CHECK constraint "news_articles_editor_pick_check"` 위반 에러

### Scenario 3: summary 최소 길이 미달 차단
- **Given**: `summary` 19자
- **When**: INSERT 시도
- **Then**: CHECK 위반 에러

### Scenario 4: dedupe_hash 중복 차단
- **Given**: 동일 `dedupe_hash` 로 2회 INSERT
- **When**: 2번째 INSERT
- **Then**: UNIQUE 위반 → `on conflict do nothing` 사용 시 skip (REQ-FUNC-014 에서 검증)

### Scenario 5: 본문 저장 금지 확인
- **Given**: 테이블 스키마 inspect
- **When**: `content` · `body` · `full_text` 컬럼 검색
- **Then**: 부재 (CON-07 본문 저장 금지)

## ⚙️ Technical & Non-Functional Constraints
- **Postgres-specific**: CHECK constraint · UNIQUE · ENUM · jsonb · `gen_random_uuid()` 사용 (C-TEC-010·011)
- **ORM 금지**: 본 마이그레이션은 **Raw SQL 전용**. Prisma / Kysely 자동생성 금지 (C-TEC-011)
- **네이밍 규약**: `YYYYMMDDHHMMSS_*.sql` 형식 고정 (REQ-NF-163)
- **RLS**: 본 Task 는 RLS 를 `enable` 하지 않음 (T-DB-019 에서 일괄 처리)

## ✔️ Definition of Done (DoD)
- [ ] 모든 Acceptance Criteria 충족
- [ ] `supabase db reset && supabase db push` 로 깨끗한 DB 에서 성공 적용
- [ ] 로컬 Studio 에서 테이블 구조 · CHECK · UNIQUE 시각 확인
- [ ] 마이그레이션 `up`/`down` 쌍 확인 (rollback 가능)
- [ ] 테스트 Task T-TEST-001·002 실행 시 본 테이블 대상 테스트 통과

## 🔗 Dependencies & Blockers
- **Depends on**: T-INFRA-005 (Supabase 프로젝트) · T-DB-013 (enum 선행)
- **Blocks**: T-DB-015 (log_editor_pick_change 트리거) · T-DB-018 (인덱스) · T-DB-019 (RLS) · T-FEAT-010-W 이후 이어지는 Write Task 전부 · T-MOCK-001 fixture 스키마 정합성 검증
````

---

## Few-Shot Sample 4 / 7

````markdown
---
name: DB Task (Trigger - Law Critical)
about: SRS Rev 1.0 기반 비카고 제목 approved 차단 트리거
title: "[DB] T-DB-014: block_non_cargo_titles 트리거 — 비카고 제목 approved 차단"
labels: ['db', 'phase:2', 'step:1', 'priority:must', 'law-critical']
assignees: ''
---

## 🎯 Summary
- Task ID: T-DB-014
- 기능명: `job_posts` 의 title 이 승무원·조종사·객실·부기장·항공정비·정비사·기장 중 하나라도 매칭되면 `status='approved'` 로 전이할 수 없도록 DB 레벨에서 RAISE EXCEPTION.
- 목적: **ADR-008 Cargo-First Pivot 의 DB-레벨 최종 방어선**. ingest 레벨 EXCLUDE_RE 필터(T-FEAT-102-W)와 이중 방어 구조.

## 🔗 References (Spec & Context)
> 💡 AI Agent & Dev Note: 본 Task 는 **법적·정책적 리스크가 큰 law-critical Task**. ingest 필터가 실수로 우회되어도 DB 가 최종 거부해야 함.

- SRS REQ-FUNC-103 (DB 트리거 block_non_cargo_titles): [`SRS-001#req-func-103`](../SRS-001-arum-cargo.md)
- SRS CON-05 (비카고 직군 승격 금지): [`SRS-001#con-05`](../SRS-001-arum-cargo.md)
- SRS REQ-NF-067 (비카고 approved 0건 보장): [`SRS-001#req-nf-067`](../SRS-001-arum-cargo.md)
- ADR-008 (Cargo-First Pivot): [`ADR-008`](../../references/ADR-008-pivot-to-cargo-first.md)
- PRD 03 §4.5: [`PRD 03`](../../prd/03-data-model.md)

## ✅ Task Breakdown (실행 계획)
- [ ] 마이그레이션 파일 생성: `supabase/migrations/20260419000020_trigger_block_non_cargo_titles.sql`
- [ ] 정규식 정의 — `'(승무원|객실|조종사|부기장|항공정비|정비사|기장|캐빈)'` (case-insensitive `~*`)
- [ ] Trigger function 작성:
```sql
CREATE OR REPLACE FUNCTION block_non_cargo_titles()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.status = 'approved' AND (
    NEW.title ~* '(승무원|객실|조종사|부기장|항공정비|정비사|기장|캐빈)'
  ) THEN
    RAISE EXCEPTION
      'Non-cargo title forbidden (ADR-008 / CON-05): %', NEW.title
      USING ERRCODE = 'check_violation',
            HINT = 'Use cargo_job_category. Non-cargo jobs are Out-of-Scope for MVP.';
  END IF;
  RETURN NEW;
END;
$$;
```
- [ ] Trigger 등록:
```sql
DROP TRIGGER IF EXISTS trg_block_non_cargo_titles ON job_posts;
CREATE TRIGGER trg_block_non_cargo_titles
BEFORE INSERT OR UPDATE OF status ON job_posts
FOR EACH ROW
EXECUTE FUNCTION block_non_cargo_titles();
```
- [ ] companyName 도 검사할지 검토 (현재 REQ-FUNC-103 은 title 만 · ingest 필터 T-FEAT-102-W 가 companyName 까지 커버)
- [ ] 로컬 `supabase db push` 로 적용 후 수동 negative test (아래 Scenario 2·3) 즉시 확인

## 📋 Acceptance Criteria (BDD / GWT)

### Scenario 1: 정상 카고 공고 승인
- **Given**: `title='대한항공카고 영업 대리급'`, `status='pending'`
- **When**: `UPDATE job_posts SET status='approved' WHERE id=...`
- **Then**: 성공 · `status` 변경 완료

### Scenario 2: 비카고 (승무원) 승인 차단
- **Given**: `title='캐빈 승무원 공채 2026'`, `status='pending'`
- **When**: `UPDATE ... SET status='approved'`
- **Then**: `RAISE EXCEPTION` 발생 · 메시지에 'Non-cargo title forbidden (ADR-008 / CON-05)' 포함 · status 변경 실패

### Scenario 3: 비카고 (조종사/부기장) 승인 차단
- **Given**: `title='B777 부기장 채용'` 또는 `title='조종사 훈련생 모집'`
- **When**: `UPDATE ... SET status='approved'`
- **Then**: Exception · 차단

### Scenario 4: INSERT 단계에서도 차단
- **Given**: ingest 가 실수로 `INSERT ... title='정비사 긴급 채용', status='approved'` 시도
- **When**: INSERT
- **Then**: Exception (INSERT trigger BEFORE 도 발동)

### Scenario 5: 카테고리 어긋난 경우 (trigger 범위 밖)
- **Given**: `title='항공화물 영업'`, `cargo_category='sales'` 정상 · 어떤 키워드도 매칭 안 됨
- **When**: `UPDATE ... SET status='approved'`
- **Then**: 정상 (현 trigger 는 title regex 만 검사)

## ⚙️ Technical & Non-Functional Constraints
- **언어**: plpgsql (C-TEC-010·011)
- **정규식**: Postgres `~*` case-insensitive + 한국어 유니코드 범위
- **Exception 명확성**: 에러 메시지에 **CON-05 · ADR-008 참조** 필수 (향후 디버깅/감사 추적성)
- **성능**: BEFORE 트리거 · title 필드만 검사 → O(1) 수준 · approved 전이 빈도 낮음 (운영 영향 0에 가까움)
- **변경 불가**: 본 트리거 로직 변경은 ADR-008 amendment + SRS Rev 1.1 선행 필수

## ✔️ Definition of Done (DoD)
- [ ] 모든 Acceptance Criteria 충족
- [ ] T-TEST-001 (트리거 suite) 에서 Scenario 2·3·4 모두 exception 발생 검증 통과
- [ ] `supabase db reset && supabase db push` 에서 깨끗히 적용
- [ ] 에러 메시지 한국어 포함 여부 확인 (한국어 운영진 디버깅용)
- [ ] 관리자 UI (T-FEAT-114-W) 에서 사용자 친화적 에러 표시 확인 (승인 버튼 클릭 → "비카고 직군은 승인 불가" 토스트)
- [ ] `EXCLUDE_RE` 와 정규식 중복 여부 검증 (ingest 필터 T-FEAT-102-W 와 동일 패턴)

## 🔗 Dependencies & Blockers
- **Depends on**: T-DB-002 (`job_posts` 테이블) · T-DB-013 (`job_status` enum)
- **Blocks**: T-FEAT-114-W (관리자 승인 큐) · T-TEST-001 (트리거 테스트) · T-NFR-016 (scope 보호 검증)

## 🚨 Law/Policy Critical
- 이 Task 가 무력화되면 ADR-008 Cargo-First Pivot 이 DB 레벨에서 파탄. 본 트리거 삭제·비활성화 PR 은 **반드시 사용자(Founder) 명시 승인** 필수.
- Loops §50 NFR 수준의 법적 준수 아님 (정책 self-constraint). 단 제휴 협상 단계에서 "카고 전문 매체"로 포지셔닝 하려면 반드시 유지.
````

---

## Few-Shot Sample 5 / 7

````markdown
---
name: API Contract Task
about: SRS Rev 1.0 기반 Supabase client 분리 (anon + service_role)
title: "[API] T-API-008: Supabase client 분리 — src/lib/supabase/{client,admin}.ts + 번들 분리 규약"
labels: ['api', 'contract', 'phase:2', 'step:1', 'priority:must', 'security']
assignees: ''
---

## 🎯 Summary
- Task ID: T-API-008
- 기능명: Supabase JS 클라이언트를 **anon (브라우저)** 과 **service_role (서버 전용)** 두 모듈로 분리한다.
- 목적: 모든 후속 T-FEAT-* Task 가 올바른 클라이언트를 선택하도록 표준 모듈 확보. Service Role Key 의 클라이언트 번들 노출 원천 차단.

## 🔗 References (Spec & Context)
> 💡 AI Agent & Dev Note: Service Role Key 가 클라이언트 번들에 한 번이라도 포함되면 **전체 DB 노출**. 절대 `'use client'` 파일에서 `admin.ts` import 금지.

- SRS REQ-FUNC-500 (전 테이블 RLS 활성): [`SRS-001#req-func-500`](../SRS-001-arum-cargo.md)
- SRS REQ-FUNC-504 (admin_users service_role only): [`SRS-001#req-func-504`](../SRS-001-arum-cargo.md)
- SRS REQ-FUNC-507 (SUPABASE_SERVICE_ROLE_KEY 클라 부재): [`SRS-001#req-func-507`](../SRS-001-arum-cargo.md)
- SRS REQ-NF-043 (Service Role Key 클라 번들 0건): [`SRS-001#req-nf-043`](../SRS-001-arum-cargo.md)
- SRS C-TEC-012 (RLS 필수 + Service Role 서버 전용): [`SRS-001#c-tec-012`](../SRS-001-arum-cargo.md)
- SRS CON-08 (외부 API 서버 사이드 전용): [`SRS-001#con-08`](../SRS-001-arum-cargo.md)

## ✅ Task Breakdown (실행 계획)
- [ ] `web/src/lib/supabase/client.ts` 작성 — 브라우저용 anon client
  - `createBrowserClient` from `@supabase/ssr`
  - `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` 만 참조
  - top-of-file 주석 `// BROWSER: anon key only. RLS enforces row visibility.`
- [ ] `web/src/lib/supabase/server.ts` 작성 — App Router 서버 컴포넌트용 (anon + cookie 세션)
  - `createServerClient` from `@supabase/ssr`
  - `cookies()` next/headers 연동
- [ ] `web/src/lib/supabase/admin.ts` 작성 — 서버 전용 service_role client
  - 파일 상단 `// SERVER-ONLY: import from 'use client' files is a security bug.`
  - `import "server-only"` 지시어 **최상단** 필수 (Next.js 번들러가 클라 번들 포함 시 컴파일 에러)
  - `createClient` with `SUPABASE_SERVICE_ROLE_KEY` + `auth: { persistSession: false }`
- [ ] `web/src/lib/supabase/types.ts` — `Database` 타입 generation 지시
  - `supabase gen types typescript --local > src/lib/supabase/database.types.ts` 스크립트
  - `package.json` script `"db:types": "supabase gen types typescript --local > src/lib/supabase/database.types.ts"`
- [ ] `@supabase/ssr` + `@supabase/supabase-js` 설치
- [ ] Barrel export `web/src/lib/supabase/index.ts` 금지 (실수로 admin 이 client bundle 섞일 위험)

## 📋 Acceptance Criteria (BDD / GWT)

### Scenario 1: 클라이언트 컴포넌트에서 admin import 차단
- **Given**: `'use client'` 지시어 파일에서 `import { adminClient } from '@/lib/supabase/admin'`
- **When**: `pnpm build`
- **Then**: 번들러 에러 "cannot import 'server-only' from client component" → 빌드 실패

### Scenario 2: 서버 컴포넌트 anon 쿼리
- **Given**: `app/news/page.tsx` (Server Component)
- **When**: `const supabase = createServerClient(); await supabase.from('news_articles').select(...)`
- **Then**: anon key 로 RLS 통과 · `is_published=true` 만 반환

### Scenario 3: Route Handler service_role 쿼리
- **Given**: `app/api/admin/users/route.ts` (Server route)
- **When**: `import { adminClient } from '@/lib/supabase/admin'; await adminClient.from('admin_users').select()`
- **Then**: service_role 로 RLS bypass · 모든 row 반환

### Scenario 4: 번들 분석 — service_role key 미노출
- **Given**: `pnpm build` 완료
- **When**: `.next/static/` 디렉토리 grep `SUPABASE_SERVICE_ROLE_KEY`
- **Then**: 매치 0건

## ⚙️ Technical & Non-Functional Constraints
- **`import "server-only"`** — Next.js 15+ 에서 동일 방식 유지
- **`@supabase/ssr`** 사용 (App Router 표준 · Cookie-based session)
- **클라이언트 번들 최소화**: admin 모듈은 dynamic import 도 금지 (파일 최상단에 server-only 선언)
- **Type 안전**: `Database` generic 필수 적용 — 모든 쿼리 결과 타입 안전

## ✔️ Definition of Done (DoD)
- [ ] 모든 Acceptance Criteria 충족
- [ ] T-TEST-002 (RLS negative test) 에서 anon 쿼리 제한 확인
- [ ] `pnpm build` 번들 분석 서명 (`next-bundle-analyzer` 선택적)
- [ ] gitleaks CI 에서 `SUPABASE_SERVICE_ROLE_KEY` 커밋 감지 검증
- [ ] README 또는 `src/lib/supabase/README.md` 에 "admin.ts 는 server-only" 규약 명시

## 🔗 Dependencies & Blockers
- **Depends on**: T-INFRA-005 (Supabase 프로젝트 키 확보) · T-INFRA-007 (`src/lib` 디렉토리 뼈대) · T-INFRA-009 (`.env.example` 키 정의)
- **Blocks**: **T-FEAT-* 서버 로직 전체** · T-FEAT-402-W middleware · T-FEAT-404-R admin dashboard
````

---

## Few-Shot Sample 6 / 7

````markdown
---
name: Test Task
about: SRS Rev 1.0 기반 DB 트리거 3종 테스트 suite
title: "[Test] T-TEST-001: DB 트리거 suite — block_non_cargo_titles · log_editor_pick_change · update_subscriber_last_active"
labels: ['test', 'phase:2', 'step:3', 'priority:must']
assignees: ''
---

## 🎯 Summary
- Task ID: T-TEST-001
- 기능명: Phase 2 에서 적용되는 3 트리거의 AC 를 pgTAP 또는 pytest+psycopg2 로 자동화.
- 목적: 교육자료 원리 3 "인수 조건을 자동화된 피드백 루프로 변환" — AI 에이전트가 트리거 Task 완료 여부를 스스로 증명.

## 🔗 References (Spec & Context)
- SRS REQ-FUNC-103 block_non_cargo_titles Verification: [`SRS-001#req-func-103`](../SRS-001-arum-cargo.md)
- SRS REQ-FUNC-026 log_editor_pick_change Verification: [`SRS-001#req-func-026`](../SRS-001-arum-cargo.md)
- SRS REQ-FUNC-217 update_subscriber_last_active Verification: [`SRS-001#req-func-217`](../SRS-001-arum-cargo.md)
- 대응 Feature Task: T-DB-014 · T-DB-015 · T-DB-016
- pgTAP docs: https://pgtap.org/documentation.html

## ✅ Task Breakdown (실행 계획)
- [ ] 테스트 러너 선택 — **pgTAP 권장** (Supabase 공식 지원) · 대안: Node `pg` + Vitest
- [ ] `supabase/tests/triggers/block_non_cargo_titles.test.sql` 작성 — 4 시나리오
- [ ] `supabase/tests/triggers/log_editor_pick_change.test.sql` — 2 시나리오
- [ ] `supabase/tests/triggers/update_subscriber_last_active.test.sql` — 2 시나리오
- [ ] `supabase db test` (또는 `npx pg-tap-test`) 를 `package.json` script 로 추가 — `"test:db": "supabase db test"`
- [ ] GitHub Actions workflow `.github/workflows/db-tests.yml` — PR 시 Supabase 로컬 기동 후 실행

## 📋 Acceptance Criteria (BDD / GWT) — 각 트리거별

### block_non_cargo_titles (4)
- **UT-014-1 정상 카고 승인** — title='대한항공카고 영업' · UPDATE status='approved' → 성공
- **UT-014-2 승무원 차단** — title='캐빈 승무원 공채' · UPDATE → exception 'Non-cargo title forbidden'
- **UT-014-3 부기장 차단** — title='B777 부기장' → exception
- **UT-014-4 INSERT 단계 차단** — INSERT (status='approved', title='정비사 채용') → exception

### log_editor_pick_change (2)
- **UT-015-1 이력 append** — editor_pick 1회 UPDATE 후 editor_pick_history 배열 길이 1 · 이전 값 포함
- **UT-015-2 3회 수정** — 3회 연속 UPDATE 후 editor_pick_history 배열 길이 3 · 시각 순 정렬

### update_subscriber_last_active (2)
- **UT-016-1 opened 이벤트** — email_events INSERT type='opened' · `subscribers.last_active_at` = event.occurred_at
- **UT-016-2 clicked 이벤트** — type='clicked' 동일 동작

## ⚙️ Technical & Non-Functional Constraints
- **격리**: 각 test 는 `BEGIN; ... ROLLBACK;` 트랜잭션 안에서 실행 · 다른 테스트 영향 없음
- **CI 게이트**: 모든 시나리오 통과가 PR merge 필수 조건 (C-TEC-023)
- **실행 시간**: 로컬 Supabase 기동 포함 ≤ 60s

## ✔️ Definition of Done (DoD)
- [ ] 모든 8 시나리오 통과
- [ ] `pnpm test:db` 커맨드로 로컬 전체 실행
- [ ] GitHub Actions PR 워크플로에서 실행되며 실패 시 PR 블록
- [ ] 테스트 커버리지 문서화 — `supabase/tests/README.md` 에 시나리오 → REQ 매핑

## 🔗 Dependencies & Blockers
- **Depends on**: T-DB-014 · T-DB-015 · T-DB-016 (테스트 대상 트리거)
- **Blocks**: Phase 2 C 블록 품질 게이트 통과 · Phase 3 진입
````

---

## Few-Shot Sample 7 / 7

````markdown
---
name: NFR Task
about: SRS Rev 1.0 기반 gitleaks CI + TLS 1.2+ 강제
title: "[NFR] T-NFR-014: gitleaks secret scan CI + TLS 1.2+ 강제"
labels: ['nfr', 'security', 'phase:2', 'step:4', 'priority:must']
assignees: ''
---

## 🎯 Summary
- Task ID: T-NFR-014
- 기능명: `gitleaks` 를 CI 파이프라인에 통합하여 API 키·secret 커밋을 PR 단계에서 자동 차단 + Vercel·Supabase·Loops 전 연결을 TLS 1.2+ 만 허용.
- 목적: REQ-NF-050 · REQ-NF-051 보안 기초 NFR 이행. Phase 2 품질 게이트 중 보안 파트.

## 🔗 References (Spec & Context)
- SRS REQ-NF-050 (API 키 코드 내 0건): [`SRS-001#req-nf-050`](../SRS-001-arum-cargo.md)
- SRS REQ-NF-051 (TLS 1.2+ 전 연결): [`SRS-001#req-nf-051`](../SRS-001-arum-cargo.md)
- SRS C-TEC-024 (gitleaks CI): [`SRS-001#c-tec-024`](../SRS-001-arum-cargo.md)
- SRS CON-08 (API 키 서버 전용): [`SRS-001#con-08`](../SRS-001-arum-cargo.md)
- gitleaks docs: https://github.com/gitleaks/gitleaks

## ✅ Task Breakdown (실행 계획)
- [ ] `.gitleaks.toml` 작성 — 프로젝트 커스텀 규칙 (TRANSLATION_PROVIDER 값 등 false positive 제외)
- [ ] `.github/workflows/security.yml` 추가 — `gitleaks-action@v2` 사용 · PR 및 push 트리거
- [ ] Pre-commit hook 옵션 제공 (`lefthook` 또는 `husky` · 로컬 실패 우선 감지)
- [ ] Vercel 대시보드 `HTTPS Only: ON` 확인
- [ ] Supabase·Loops·Google Generative AI REST 호출은 전부 `https://` 로 하드코딩되어 있는지 grep
- [ ] 테스트용 fake secret commit 시도 → 차단 검증 (별도 throwaway branch)
- [ ] 문서화 — `SECURITY.md` 에 gitleaks · HTTPS 규약 · 제보 채널

## 📋 Acceptance Criteria (BDD / GWT)

### Scenario 1: fake secret 커밋 차단
- **Given**: PR 브랜치에 `web/test-leak.ts` 에 `const KEY = "sk-proj-1234567890abcdefghij..."` 커밋
- **When**: GitHub Actions 실행
- **Then**: `gitleaks-action` 실패 → PR merge 차단 · 리뷰어에게 알림

### Scenario 2: 정상 env 참조 통과
- **Given**: `process.env.GOOGLE_GENERATIVE_AI_API_KEY` 참조 코드
- **When**: CI 실행
- **Then**: 통과 (secret 값 아닌 env 참조)

### Scenario 3: `.env.example` 의 key 이름 통과
- **Given**: `.env.example` 에 `GOOGLE_GENERATIVE_AI_API_KEY=your-key-here`
- **When**: CI 실행
- **Then**: 통과 (placeholder 값은 허용 — `.gitleaksignore` 에 명시)

### Scenario 4: HTTPS 연결만 허용
- **Given**: 프로젝트 전체 `http://` (non-TLS) 검색
- **When**: grep 실행 (단, `localhost` 제외)
- **Then**: 매치 0건

## ⚙️ Technical & Non-Functional Constraints
- **CI 실행 시간**: ≤ 2 분 (gitleaks 기본 빠름)
- **False positive 관리**: `.gitleaksignore` 와 커스텀 규칙으로 관리 · 수시 튜닝
- **로컬 fallback**: pre-commit hook 은 선택 사항이지만 권장
- **TLS**: Vercel·Supabase 는 기본 HTTPS 전용 · 본 Task 는 코드 내 하드코딩 URL 점검이 핵심

## ✔️ Definition of Done (DoD)
- [ ] 모든 Acceptance Criteria 충족
- [ ] 실제 PR 에서 fake secret 커밋 1회 시도 후 차단 로그 캡처
- [ ] `SECURITY.md` 작성 · 레포 Settings → "Security" 에 연결
- [ ] gitleaks 버전 고정 (renovate·dependabot 로 업데이트 추적)

## 🔗 Dependencies & Blockers
- **Depends on**: T-INFRA-010 (ESLint/Prettier CI 파이프라인 기반)
- **Blocks**: Phase 2 품질 게이트 통과 · 모든 후속 Phase (secret 관련 Task 는 이 게이트에 의존)
````

---

## 1. 나머지 Phase 2 Task 목록 (26개 · 다음 세션 확장 대상)

다음 세션에서 위 7개와 동일 풀버전 템플릿·동일 톤으로 확장할 Phase 2 Task:

### A. 기반 인프라 (10)
- T-INFRA-002 Tailwind + arum.* + shadcn/ui
- T-INFRA-003 Pretendard + Space Grotesk + JetBrains Mono 폰트
- T-INFRA-004 Framer Motion + tailwindcss-animate + react-intersection-observer
- T-INFRA-006 migrations 네이밍 규약 CI
- T-INFRA-007 src/lib/supabase + src/lib/api 뼈대 (T-API-008 일부 중첩 — 참조)
- T-INFRA-008 Vercel 프로젝트 + arumcargo.vercel.app 배포
- T-INFRA-009 .env.example 전체 키
- T-INFRA-010 ESLint + Prettier + TS strict CI
- T-INFRA-013 SiteHeader · SiteFooter 기본 레이아웃
- T-INFRA-014 next.config.js remotePatterns

### B. DB 스키마 + 시드 (16)
- T-DB-002 job_posts 테이블
- T-DB-003 subscribers 테이블
- T-DB-004 admin_users 테이블
- T-DB-005 news_clicks
- T-DB-006 job_clicks
- T-DB-007 daily_digests
- T-DB-008 subscription_events
- T-DB-009 email_events
- T-DB-010 ingest_logs
- T-DB-011 aviation_glossary + 50건 시드
- T-DB-012 cargo_career_links + 14건 시드
- T-DB-013 Enum 3종
- T-DB-015 log_editor_pick_change 트리거
- T-DB-016 update_subscriber_last_active 트리거
- T-DB-018 인덱스 일괄
- T-DB-019 RLS 정책 일괄
- T-MOCK-006 aviation_glossary seed JSON (T-DB-011 보조)

### C. 품질 게이트 (추가 Test + NFR)
- T-TEST-002 RLS negative test suite
- T-TEST-019 SQL 인덱스 EXPLAIN ANALYZE
- T-NFR-003 SQL 인덱스 성능 검증
- T-NFR-012 보안 기초 (RLS + Service Role + Magic Link)

---

## 2. Phase 2 완료 판정 체크리스트 (PRD 07 §3.2 정합)

본 파일의 33 Task 전체가 완료되면 아래가 자동 충족됨:

- [ ] `pnpm dev` 로컬 서버 구동 (T-INFRA-001)
- [ ] `pnpm build`·`pnpm typecheck` 통과 (T-INFRA-001·010)
- [ ] Supabase 모든 테이블 생성 + RLS 적용 (T-DB-001~019)
- [ ] v0.3 enum 3종 생성 (T-DB-013)
- [ ] 트리거 3종 적용 (T-DB-014·015·016) + 테스트 통과 (T-TEST-001)
- [ ] 시드 데이터 (T-DB-011·012 · T-MOCK-006)
- [ ] Vercel 배포 URL 접속 (T-INFRA-008)
- [ ] `.env.example` 전체 키 + `.env.local` 로컬 (T-INFRA-009)
- [ ] 인덱스 생성 + 성능 검증 (T-DB-018 · T-TEST-019 · T-NFR-003)
- [ ] gitleaks CI + HTTPS 강제 (T-NFR-014)

---

## 3. 다음 세션 가이드

**본 파일로 세션 진입 시**:

1. 본 파일 + `00-overview.md` + `01-macro-inventory.md` 세 파일 상위 컨텍스트로 읽기
2. 위 §1 "나머지 Phase 2 Task 목록" 26개 중 **상위 10개부터** 동일 풀버전 템플릿으로 작성
3. 10개 완료 후 사용자 리뷰 → 톤·디테일 조정
4. 남은 16개 동일 스타일로 마무리
5. `reviews/phase-2-review.md` 작성 (교육자료 §5 3대 기준 + 확장 체크 + 학습 키워드)
6. `learning-keywords.md` 에 세션 중 발견된 생소 용어 append

**확장 시 유지할 규약**:
- `---` YAML frontmatter 필수 (`name` · `title` · `labels` · `assignees`)
- 7개 고정 섹션: Summary / References / Breakdown / AC / Constraints / DoD / Dependencies
- AC 는 최소 3 Scenario (정상 · 실패 · 경계)
- DoD 의 체크리스트는 AC 충족 외 **테스트 통과 · CI 통과 · 문서 항목** 포함

---

## Changelog

- **2026-04-18 v1.0**: 최초 작성. Phase 2 의 33 Task 중 Few-Shot 대표 7개 풀 템플릿 샘플로 작성. 나머지 26 Task 는 다음 세션 확장 예정.

---

**End of Phase 2 Tasks (Few-Shot).**
