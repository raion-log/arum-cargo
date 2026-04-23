# Phase 2 Tasks — Next.js 프로젝트 셋업 (Micro)

> **목적**: Phase 2 의 33 Task 중 **Few-Shot 표준 템플릿 7개**를 모범으로 작성. 나머지 Phase 2 Task 는 다음 세션에서 동일 스타일로 확장.
> **상위 컨텍스트**: [`00-overview.md`](./00-overview.md) 방법론 · [`01-macro-inventory.md`](./01-macro-inventory.md) 전체 인벤토리
> **베이스라인**: [SRS Rev 1.0](../SRS-001-arum-cargo.md)
> **Phase 2 DoD 원본**: [PRD 07 §3.2](../../prd/07-roadmap-milestones.md)
> **작성일**: 2026-04-18 · **Few-Shot 샘플 수**: **38 / 38 ✅ 완성** (Wave 1: 7 · Wave 2: 10 · Wave 3: 21)
> **Note**: Phase 2 총 Task 수 실측 38개. Macro inventory 의 claim 33 과 drift 있음 — Rev 1.1 cleanup 대상 (본 파일이 authoritative)

---

## 0. Phase 2 Task 전체 요약 (Macro → Micro 매핑)

Phase 2 의 33 Task 는 아래 3 블록으로 착수 순서가 정해진다:

| 블록 | Task ID | 실행 순서 |
|---|---|---|
| **A. 기반 인프라** (블로커 제거) | T-INFRA-001 ~ 010, 013, 014 | **1주차** — 프로젝트 init · Supabase 연결 · CI 게이트 |
| **B. DB 스키마 + 시드** (가장 큰 선행 Task) | T-DB-001 ~ 019 + T-MOCK-006 + T-API-008 | **1~2주차** — migrations 전체 작성 · RLS · 트리거 · seed |
| **C. 품질 게이트** (Phase 2 종료 판정용) | T-TEST-001·002·019 + T-NFR-003·012·014 | **2주차 말** — Phase 2 DoD 검증 |

본 파일에서 **Phase 2 의 38 Task 전체** 완성 (3 wave 누적):
- **Wave 1 (7) · A 블록**: T-INFRA-001 · T-INFRA-005
- **Wave 1 (7) · B 블록**: T-DB-001 · T-DB-014 · T-API-008
- **Wave 1 (7) · C 블록**: T-TEST-001 · T-NFR-014
- **Wave 2 (10) · A 블록**: T-INFRA-009 · T-INFRA-010 · T-INFRA-002
- **Wave 2 (10) · B 블록**: T-DB-013 · T-DB-002 · T-DB-003 · T-DB-004 · T-DB-011 · T-DB-018 · T-DB-019
- **Wave 3 (21) · A 블록**: T-INFRA-003 · T-INFRA-004 · T-INFRA-006 · T-INFRA-007 · T-INFRA-008 · T-INFRA-013 · T-INFRA-014
- **Wave 3 (21) · B 블록**: T-DB-005 · T-DB-006 · T-DB-007 · T-DB-008 · T-DB-009 · T-DB-010 · T-DB-012 · T-DB-015 · T-DB-016 · T-MOCK-006
- **Wave 3 (21) · C 블록**: T-TEST-002 · T-TEST-019 · T-NFR-003 · T-NFR-012

**Phase 2 Micro 추출 완료**. 사후 검토: [`reviews/phase-2-review.md`](./reviews/phase-2-review.md)

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

## Few-Shot Sample 8 / 17

````markdown
---
name: Infra Task
about: SRS Rev 1.0 기반 .env.example 전체 키 정의
title: "[Infra] T-INFRA-009: .env.example 전체 키 + Phase 배분 주석"
labels: ['infra', 'phase:2', 'step:4', 'priority:must']
assignees: ''
---

## 🎯 Summary
- Task ID: T-INFRA-009
- 기능명: 모든 Phase 2~5 Task 가 참조할 환경 변수의 **키 이름 + 용도 주석** 을 `.env.example` 에 확정.
- 목적: 프로젝트 SSOT 환경 변수 목록. 신규 Task 가 임의 키 도입 시 본 파일을 먼저 수정하고 PR 리뷰 받도록 강제.

## 🔗 References
- SRS §6.8 환경 변수 참조 (전체 키 리스트): [`SRS-001#env-vars`](../SRS-001-arum-cargo.md)
- CLAUDE.md §6 환경 변수: [`CLAUDE.md`](../../../CLAUDE.md)
- CON-08 (API 키 서버 전용): [`SRS-001#con-08`](../SRS-001-arum-cargo.md)

## ✅ Task Breakdown
- [ ] 프로젝트 루트 `.env.example` 작성 (값은 placeholder `your-key-here`)
- [ ] 섹션별 그룹화:
  - `# [External APIs]` — NAVER_CLIENT_ID/SECRET, WORKNET_API_KEY, SARAMIN_API_KEY
  - `# [LLM / Translation]` — TRANSLATION_PROVIDER=gemini, GOOGLE_GENERATIVE_AI_API_KEY, (Phase 5.5+) OPENAI_API_KEY, OPENAI_MONTHLY_BUDGET_CAP_USD
  - `# [Supabase]` — NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
  - `# [Email / Loops.so]` — LOOPS_API_KEY, LOOPS_WEBHOOK_SECRET
  - `# [Cron Protection]` — CRON_SECRET
  - `# [Vercel Analytics]` — VERCEL_API_TOKEN, VERCEL_TEAM_ID, VERCEL_PROJECT_ID
  - `# [Admin]` — ADMIN_EMAIL_WHITELIST (쉼표 구분)
  - `# [Phase 5.5+] (MVP 미사용)` — KAC_SERVICE_KEY, IIAC_SERVICE_KEY
- [ ] 각 키 뒤 인라인 주석으로 Phase·관련 REQ ID 표기 (예: `# Phase 4 / REQ-FUNC-010`)
- [ ] `web/.env.local` 은 `.gitignore` 확인 (절대 커밋 금지)
- [ ] README 에 `.env.local` 생성 가이드 링크 추가

## 📋 Acceptance Criteria
- **Scenario 1 — 키 완전성**: SRS §6.8 에 선언된 모든 키가 `.env.example` 에 등장 (grep 일치율 100%)
- **Scenario 2 — 값 placeholder**: 실제 secret 값 포함 0건 (gitleaks CI 통과)
- **Scenario 3 — 순서 안정**: Phase 2 → Phase 5.5+ 순 그룹 정렬 · 재정렬 diff PR 차단 규약 문서화
- **Scenario 4 — MVP 필수 vs 옵션 구분**: `OPENAI_*` 는 `# (Phase 5.5+ 옵션)` 주석 · `GOOGLE_GENERATIVE_AI_API_KEY` 는 무주석 필수

## ⚙️ Technical & Non-Functional Constraints
- **보안**: 실제 값 커밋 금지 (T-NFR-014 gitleaks 가 검증)
- **일관성**: SRS Rev 1.1 에서 키 추가/제거 시 본 파일 선행 수정 (PRD 단방향 의존과 동일 원칙)

## ✔️ DoD
- [ ] 모든 AC 충족 + gitleaks CI 통과
- [ ] `web/.env.local` 실 값으로 로컬 `pnpm dev` 성공 확인 (T-INFRA-005 연계)
- [ ] CLAUDE.md §6 와 diff 0 (문서 정합성)

## 🔗 Dependencies & Blockers
- **Depends on**: T-INFRA-001 (프로젝트 구조)
- **Blocks**: T-INFRA-005 / T-API-* 전체 / T-FEAT-* 전체 (env 참조 기반)
````

---

## Few-Shot Sample 9 / 17

````markdown
---
name: Infra Task
about: SRS Rev 1.0 기반 ESLint + Prettier + TypeScript strict CI 파이프라인
title: "[Infra] T-INFRA-010: ESLint + Prettier + TS strict + Husky pre-commit + PR 머지 게이트"
labels: ['infra', 'phase:2', 'step:4', 'priority:must', 'ci']
assignees: ''
---

## 🎯 Summary
- Task ID: T-INFRA-010
- 기능명: 코드 품질 자동 게이트 — 로컬 pre-commit + GitHub Actions PR 차단.
- 목적: 에이전틱 개발에서 AI 생성 코드의 일관성·안전성 자동 검증. PR merge 전 필수 통과.

## 🔗 References
- SRS C-TEC-023 (ESLint + Prettier + TS strict 필수 · CI 게이트): [`SRS-001#c-tec-023`](../SRS-001-arum-cargo.md)
- SRS REQ-NF-161 (zod parse 100% + ESLint 규칙): [`SRS-001#req-nf-161`](../SRS-001-arum-cargo.md)
- SRS REQ-NF-162 (클라이언트 외부 API 직접 fetch 금지 ESLint 규칙): [`SRS-001#req-nf-162`](../SRS-001-arum-cargo.md)

## ✅ Task Breakdown
- [ ] `web/.eslintrc.json` — `next/core-web-vitals` + `@typescript-eslint/strict` + `eslint-plugin-tailwindcss` + custom rule: client 파일에서 `@/lib/supabase/admin` import 금지
- [ ] `web/.prettierrc` — `{ "singleQuote": true, "semi": false, "printWidth": 100 }` (또는 프로젝트 선호)
- [ ] `web/tsconfig.json` — `strict: true` + `noUncheckedIndexedAccess: true` + `noImplicitOverride: true` + `exactOptionalPropertyTypes: true`
- [ ] `package.json` scripts: `lint` / `lint:fix` / `typecheck` / `format` / `format:check`
- [ ] `.github/workflows/ci.yml` — `typecheck` + `lint` + `format:check` + `test` step
- [ ] Husky + lint-staged (선택) — pre-commit 자동 lint/format
- [ ] PR status checks required 설정 (GitHub branch protection)

## 📋 Acceptance Criteria
- **Scenario 1 — 에러 통과 거부**: 고의로 `any` 타입 + 세미콜론 실수 커밋 시도 → CI 실패 → PR merge 차단
- **Scenario 2 — TailwindCSS classname 정렬**: 무질서 classname 자동 재정렬 (Prettier plugin)
- **Scenario 3 — 클라 → admin 금지 규칙**: `'use client'` 파일에서 `admin.ts` import 시 ESLint error
- **Scenario 4 — 포맷 일관성**: 모든 기여자의 diff 가 프로젝트 포맷 규약과 동일

## ⚙️ Technical & Non-Functional Constraints
- **CI 시간**: ≤ 3분 (lint 1분 + typecheck 1분 + test 1분 내외)
- **로컬 fallback**: Husky 는 선택 · CI 는 필수
- **규칙 튜닝**: 과도한 규칙으로 개발 속도 저하 금지 · 3개월마다 재검토

## ✔️ DoD
- [ ] AC 4종 모두 검증 (fake PR 1회 생성하여 실패 확인)
- [ ] main · dev 브랜치 GitHub Ruleset 에 `typecheck` · `lint` required status 추가
- [ ] 기존 `chore` 커밋 전부 CI 통과 상태 유지

## 🔗 Dependencies & Blockers
- **Depends on**: T-INFRA-001
- **Blocks**: T-NFR-014 (gitleaks CI 통합 전제) · 모든 후속 PR
````

---

## Few-Shot Sample 10 / 17

````markdown
---
name: Infra Task
about: SRS Rev 1.0 기반 Tailwind + arum.* tokens + shadcn/ui 초기화
title: "[Infra] T-INFRA-002: Tailwind + arum.* 토큰 네임스페이스 + shadcn/ui + lucide-react"
labels: ['infra', 'phase:2', 'step:4', 'priority:must', 'ui']
assignees: ''
---

## 🎯 Summary
- Task ID: T-INFRA-002
- 기능명: Tailwind config 에 `arum.*` 색상·타이포 토큰 · shadcn/ui CLI 초기화 · lucide-react 아이콘 라이브러리 고정.
- 목적: 모든 T-UI-* Task 의 디자인 토큰 SSOT. `raion.*` 잔재 금지 (CON-10).

## 🔗 References
- SRS REQ-FUNC-300 (Tailwind arum.* 네임스페이스): [`SRS-001#req-func-300`](../SRS-001-arum-cargo.md)
- SRS CON-10 (arum.* only, raion.* 금지): [`SRS-001#con-10`](../SRS-001-arum-cargo.md)
- SRS C-TEC-002 (Tailwind + shadcn/ui + lucide-react): [`SRS-001#c-tec-002`](../SRS-001-arum-cargo.md)
- SRS C-TEC-005 (lucide-react 고정): [`SRS-001#c-tec-005`](../SRS-001-arum-cargo.md)
- PRD 06 §2 디자인 토큰: [`PRD 06`](../../prd/06-ui-ux-spec.md)

## ✅ Task Breakdown
- [ ] `web/tailwind.config.ts` — `theme.extend.colors.arum`:
  - `ink` · `navy` · `slate` · `sky` · `blue` · `blob` · `cloud` · `mist` · `fog` · `urgent` · `success` · `pick`
  - 각 색상 HEX 값은 PRD 06 §2 표 기준
- [ ] `theme.extend.fontFamily`: `sans: ['Pretendard Variable', ...]`, `display: ['Space Grotesk', ...]`, `mono: ['JetBrains Mono', ...]`
- [ ] `content` glob: `./src/**/*.{ts,tsx}`
- [ ] shadcn/ui CLI 초기화: `pnpm dlx shadcn@latest init` · style=default · baseColor=neutral · cssVars=true
- [ ] 초기 필수 컴포넌트 설치: Button · Card · Badge · Tabs · Dialog · Input · Label · Form · Select · Checkbox · Tooltip · Popover · Separator · Skeleton · Sonner (toast) · Chart
- [ ] lucide-react 설치 + 샘플 import 확인
- [ ] `tailwindcss-animate` + `react-intersection-observer` 설치 (T-INFRA-004 prep)
- [ ] ESLint 규칙 `eslint-plugin-tailwindcss` 로 `raion-*` classname 감지 → error

## 📋 Acceptance Criteria
- **Scenario 1 — arum.* 렌더**: `<div className="bg-arum-sky text-arum-ink">test</div>` 가 Tailwind 빌드 포함되어 렌더
- **Scenario 2 — raion.* 차단**: `className="bg-raion-sky"` 사용 시 ESLint error + 빌드 미포함
- **Scenario 3 — shadcn/ui 컴포넌트 렌더**: `<Button variant="default">` 정상 렌더 · 키보드 포커스 ring 노출
- **Scenario 4 — 아이콘**: `<Rocket className="h-4 w-4" />` from `lucide-react` 정상 표시

## ⚙️ Technical & Non-Functional Constraints
- **버전 고정**: `tailwindcss@3.x` · `shadcn@latest (CLI)` · `lucide-react` 최신
- **다크모드**: `class` 전략 (추후 `/` 랜딩 다크톤 조정 시)
- **토큰 네임스페이스 단일**: `arum.*` 외 금지 · Heroicons·Material Icons 혼용 금지 (C-TEC-005)

## ✔️ DoD
- [ ] AC 4종 충족
- [ ] `pnpm build` 시 Tailwind JIT warning 0
- [ ] shadcn/ui 컴포넌트 16종 모두 `src/components/ui/` 에 설치
- [ ] Storybook 없이 `app/_dev/page.tsx` (Phase 2 임시) 에서 컴포넌트 스모크 테스트 가능

## 🔗 Dependencies & Blockers
- **Depends on**: T-INFRA-001
- **Blocks**: **T-UI-* 전체** · T-INFRA-004 (Framer Motion 통합) · T-INFRA-013 (SiteHeader/Footer)
````

---

## Few-Shot Sample 11 / 17

````markdown
---
name: DB Task (Enum)
about: SRS Rev 1.0 기반 Postgres ENUM 3종 마이그레이션
title: "[DB] T-DB-013: Enum 3종 — news_category, cargo_job_category, editor_pick_tone"
labels: ['db', 'phase:2', 'step:1', 'priority:must']
assignees: ''
---

## 🎯 Summary
- Task ID: T-DB-013
- 기능명: 3개 Postgres ENUM 타입 생성 — `news_category` (6) · `cargo_job_category` (7) · `editor_pick_tone` (3).
- 목적: 모든 테이블 컬럼이 참조하는 타입 선행. T-DB-001·002 의 선결 조건.

## 🔗 References
- SRS REQ-FUNC-018 (news_category 6): [`SRS-001#req-func-018`](../SRS-001-arum-cargo.md)
- SRS REQ-FUNC-025 (editor_pick_tone 3): [`SRS-001#req-func-025`](../SRS-001-arum-cargo.md)
- SRS REQ-FUNC-105 (cargo_job_category 7): [`SRS-001#req-func-105`](../SRS-001-arum-cargo.md)
- PRD 03 Enum 정의: [`PRD 03`](../../prd/03-data-model.md)

## ✅ Task Breakdown
- [ ] `supabase/migrations/20260419000002_create_enums.sql` 생성
- [ ] Enum 3종 DDL:
```sql
CREATE TYPE news_category AS ENUM (
  'cargo-market', 'cargo-ops', 'cargo-company',
  'cargo-policy', 'airport-cargo', 'big-aviation'
);

CREATE TYPE cargo_job_category AS ENUM (
  'sales', 'ops', 'customs', 'imex',
  'intl_logistics', 'airport_ground', 'other_cargo'
);

CREATE TYPE editor_pick_tone AS ENUM (
  'OBSERVATION', 'ACTION_ITEM', 'CONTEXT'
);
```
- [ ] 타임스탬프 파일명 `20260419000002_*.sql` 로 T-DB-001 (`00001_news_articles`) 와 순서 분리
- [ ] Rollback 고려: `DROP TYPE IF EXISTS ... CASCADE` 별도 `down` 스크립트 (Supabase CLI 관습)
- [ ] Supabase 타입 자동 생성 스크립트 `db:types` 실행 후 `database.types.ts` 에 enum 반영 확인

## 📋 Acceptance Criteria
- **Scenario 1 — 생성 성공**: `supabase db reset && supabase db push` 후 `SELECT unnest(enum_range(null::news_category))` 6개 반환
- **Scenario 2 — 잘못된 값 차단**: `INSERT news_articles (category) VALUES ('invalid-cat')` → invalid_text_representation 에러
- **Scenario 3 — TypeScript 생성**: `database.types.ts` 에 `news_category: "cargo-market" | "cargo-ops" | ...` union type 존재
- **Scenario 4 — 추가/변경 Amendment**: 값 추가는 `ALTER TYPE ... ADD VALUE` 로만 (신규 마이그레이션 파일)

## ⚙️ Technical & Non-Functional Constraints
- **Postgres ENUM 제약**: 값 순서 변경·삭제 불가 (ALTER TYPE ADD 만 가능)
- **값 확장 규칙**: Amendment 필요 시 새 마이그레이션 파일 · 기존 enum 수정 금지
- **네이밍**: 언더스코어_스네이크 case · 값은 프로젝트 관습상 하이픈·대문자 혼합 허용 (기존 PRD 03 일치)

## ✔️ DoD
- [ ] AC 4종 충족
- [ ] 마이그레이션 적용 후 T-DB-001·T-DB-002 성공 여부 smoke
- [ ] `database.types.ts` 재생성 커밋

## 🔗 Dependencies & Blockers
- **Depends on**: T-INFRA-005 (Supabase 프로젝트)
- **Blocks**: T-DB-001 (news_articles category) · T-DB-002 (job_posts cargo_job_category) · 에디터 Pick 필드 사용 전체
````

---

## Few-Shot Sample 12 / 17

````markdown
---
name: DB Task
about: SRS Rev 1.0 기반 job_posts 테이블 마이그레이션
title: "[DB] T-DB-002: job_posts 테이블 + 거부 이유 enum + source_trust_score"
labels: ['db', 'phase:2', 'step:1', 'priority:must']
assignees: ''
---

## 🎯 Summary
- Task ID: T-DB-002
- 기능명: 카고 채용 공고 저장 테이블. `cargo_job_category` enum · `job_status` enum · `rejection_reason` enum · `source_trust_score` numeric 포함.
- 목적: A-Side 전체 기능의 DB 기반.

## 🔗 References
- SRS REQ-FUNC-105·106·115 (enum/status/reject): [`SRS-001`](../SRS-001-arum-cargo.md)
- SRS REQ-FUNC-502 (anon SELECT approved only): [`SRS-001#req-func-502`](../SRS-001-arum-cargo.md)
- SRS REQ-FUNC-104 (source_trust_score 1.0~5.0): [`SRS-001#req-func-104`](../SRS-001-arum-cargo.md)
- PRD 03 §4.4 job_posts: [`PRD 03`](../../prd/03-data-model.md)

## ✅ Task Breakdown
- [ ] `supabase/migrations/20260419000003_create_job_posts.sql`
- [ ] `job_status` enum 신설: `pending` · `approved` · `rejected` · `archived`
- [ ] `rejection_reason` enum 신설: `non_cargo` · `academy_ad` · `trust_unknown` · `duplicate` · `other`
- [ ] 컬럼 정의:
  - `id uuid PK`
  - `source_name text NOT NULL` (worknet/saramin)
  - `source_url text UNIQUE NOT NULL`
  - `title text NOT NULL`
  - `company_name text NOT NULL`
  - `summary text CHECK (char_length(summary) BETWEEN 20 AND 500)`
  - `cargo_category cargo_job_category NOT NULL`
  - `location text`
  - `employment_type text`
  - `years_experience_min int`
  - `years_experience_max int`
  - `deadline timestamptz`
  - `posted_at timestamptz NOT NULL`
  - `source_trust_score numeric(3,1) NOT NULL DEFAULT 1.0 CHECK (source_trust_score BETWEEN 0 AND 5.0)`
  - `status job_status NOT NULL DEFAULT 'pending'`
  - `rejection_reason rejection_reason`
  - `rejected_at timestamptz`
  - `approved_at timestamptz`
  - `dedupe_hash text UNIQUE NOT NULL`
  - `created_at` / `updated_at` (moddatetime)

## 📋 Acceptance Criteria
- **Scenario 1 — pending 삽입**: INSERT 정상 (status 기본 'pending')
- **Scenario 2 — approved 전이 후 비카고 제목**: T-DB-014 트리거가 차단 → exception
- **Scenario 3 — trust_score 범위**: 5.5 입력 시 CHECK 위반
- **Scenario 4 — dedupe_hash 중복**: 동일 hash INSERT 시도 → UNIQUE 위반
- **Scenario 5 — rejection_reason enum**: 'invalid_reason' 입력 시 에러

## ⚙️ Technical & Non-Functional Constraints
- **트리거 연계**: T-DB-014 `block_non_cargo_titles` 가 본 테이블에서 fire
- **인덱스**: T-DB-018 에서 `(status, deadline)` · `(cargo_category, status, trust DESC)` 추가
- **RLS**: T-DB-019 에서 `approved` 만 anon 접근 허용

## ✔️ DoD
- [ ] AC 5종 충족
- [ ] T-DB-014 · T-DB-018 · T-DB-019 의 선행 조건으로 성공 적용

## 🔗 Dependencies & Blockers
- **Depends on**: T-INFRA-005 · T-DB-013 (`cargo_job_category`)
- **Blocks**: T-DB-014 · T-DB-018 · T-DB-019 · T-FEAT-100-W · T-FEAT-114-W · T-MOCK-002
````

---

## Few-Shot Sample 13 / 17

````markdown
---
name: DB Task
about: SRS Rev 1.0 기반 subscribers 테이블 + settings_token 생성 default
title: "[DB] T-DB-003: subscribers 테이블 + 256bit settings_token + 13개월 보존 기반"
labels: ['db', 'phase:2', 'step:1', 'priority:must', 'legal']
assignees: ''
---

## 🎯 Summary
- Task ID: T-DB-003
- 기능명: 구독자 계정 테이블. 더블 옵트인 · 수신거부 토큰 · §50 동의 기록 포함.
- 목적: Email Growth Loop 전체의 저장소.

## 🔗 References
- SRS REQ-FUNC-503 (anon SELECT 차단 INSERT만): [`SRS-001#req-func-503`](../SRS-001-arum-cargo.md)
- SRS REQ-FUNC-505 (settings_token 256bit): [`SRS-001#req-func-505`](../SRS-001-arum-cargo.md)
- SRS CON-04 (consented_at/ip/ua · 13mo): [`SRS-001#con-04`](../SRS-001-arum-cargo.md)
- PRD 03 §4.1 subscribers: [`PRD 03`](../../prd/03-data-model.md)

## ✅ Task Breakdown
- [ ] `supabase/migrations/20260419000004_create_subscribers.sql`
- [ ] `subscriber_status` enum: `pending` · `verified` · `unsubscribed`
- [ ] 컬럼:
  - `id uuid PK`
  - `email citext UNIQUE NOT NULL` (대소문자 무시 비교; `CREATE EXTENSION citext` 선행)
  - `status subscriber_status NOT NULL DEFAULT 'pending'`
  - `verification_token text UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex')`
  - `verification_sent_at timestamptz`
  - `verified_at timestamptz`
  - `settings_token text UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex')`
  - `interest_categories text[] DEFAULT '{}'`
  - `consented_at timestamptz NOT NULL DEFAULT now()`
  - `ip inet`
  - `user_agent text`
  - `last_active_at timestamptz`
  - `unsubscribed_at timestamptz`
  - `referrer_subscriber_id uuid REFERENCES subscribers(id) ON DELETE SET NULL`
  - `created_at` / `updated_at`
- [ ] `CREATE EXTENSION IF NOT EXISTS citext` 선행
- [ ] `CREATE EXTENSION IF NOT EXISTS pgcrypto` (`gen_random_bytes` 용)

## 📋 Acceptance Criteria
- **Scenario 1 — 기본 INSERT**: email 제공 시 자동으로 verification/settings token 64자 hex 생성
- **Scenario 2 — email 대소문자 무시**: `Test@Example.com` · `test@example.com` 이 UNIQUE 충돌
- **Scenario 3 — settings_token 엔트로피**: 2개 row 의 token 이 서로 다름 (통계적 검증)
- **Scenario 4 — referrer FK**: 존재하지 않는 referrer_id 참조 시 FK 위반

## ⚙️ Technical & Non-Functional Constraints
- **citext 확장**: DB 레벨에서 email 대소문자 통합 (ILIKE 오버헤드 회피)
- **pgcrypto**: Supabase 기본 제공 · 확장 없이 `gen_random_bytes` 사용 불가
- **13mo 보존**: retention cron 미설치 (CON-04 현 단계는 "삭제 금지"만)
- **RLS**: T-DB-019 에서 anon INSERT 만 허용 · SELECT/UPDATE/DELETE 전부 차단

## ✔️ DoD
- [ ] AC 4종 충족
- [ ] citext + pgcrypto 확장 생성 로그 남김
- [ ] T-FEAT-200-W 더블 옵트인 로직에서 본 테이블 INSERT 성공

## 🔗 Dependencies & Blockers
- **Depends on**: T-INFRA-005
- **Blocks**: T-DB-008 · T-DB-009 (FK) · T-DB-019 · T-FEAT-200-W · T-FEAT-201-W
````

---

## Few-Shot Sample 14 / 17

````markdown
---
name: DB Task
about: SRS Rev 1.0 기반 admin_users 화이트리스트 테이블
title: "[DB] T-DB-004: admin_users 테이블 + role enum + service_role only RLS"
labels: ['db', 'phase:2', 'step:1', 'priority:must', 'security']
assignees: ''
---

## 🎯 Summary
- Task ID: T-DB-004
- 기능명: 관리자 Magic Link 로그인 화이트리스트.
- 목적: `/admin/*` 접근 제어 + Supabase Auth OTP 전에 이메일 존재 여부 체크.

## 🔗 References
- SRS REQ-FUNC-400 (admin_users 테이블): [`SRS-001#req-func-400`](../SRS-001-arum-cargo.md)
- SRS REQ-FUNC-504 (service_role only): [`SRS-001#req-func-504`](../SRS-001-arum-cargo.md)
- SRS C-TEC-013 (Magic Link + 화이트리스트): [`SRS-001#c-tec-013`](../SRS-001-arum-cargo.md)

## ✅ Task Breakdown
- [ ] `supabase/migrations/20260419000005_create_admin_users.sql`
- [ ] `admin_role` enum: `admin` · `editor`
- [ ] 컬럼:
  - `id uuid PK`
  - `email citext UNIQUE NOT NULL`
  - `role admin_role NOT NULL DEFAULT 'editor'`
  - `is_active boolean NOT NULL DEFAULT true`
  - `created_at` / `updated_at`
- [ ] ADMIN_EMAIL_WHITELIST env 에서 초기 시드 1건 INSERT (예: founder 이메일 · Phase 2 후 수동 입력)
- [ ] RLS: `ENABLE` · 기본 deny · `service_role` bypass 만 (T-DB-019 에서 일괄 적용)

## 📋 Acceptance Criteria
- **Scenario 1 — anon 접근 차단**: anon key 로 SELECT → 0 rows / INSERT/UPDATE/DELETE 전부 403
- **Scenario 2 — service_role 접근**: admin client 로 `SELECT * FROM admin_users` → 전 row 반환
- **Scenario 3 — role enum 검증**: `INSERT (role) VALUES ('superuser')` → invalid_text_representation
- **Scenario 4 — 시드 email 존재**: 마이그레이션 후 ADMIN_EMAIL_WHITELIST 의 첫 값이 admin role 로 존재

## ⚙️ Technical & Non-Functional Constraints
- **service_role 전용**: anon 은 RLS 로 절대 차단 · middleware 에서 Magic Link OTP 는 `service_role` 측 함수로 존재 체크
- **시드 방식**: migration SQL 에서 `INSERT ... ON CONFLICT (email) DO NOTHING` · env 참조는 `vault` 미사용이면 수동 seed 또는 별도 CLI 명령

## ✔️ DoD
- [ ] AC 4종 충족
- [ ] T-FEAT-401-W 구현 시 `/admin/login` 입력 이메일이 본 테이블에 없으면 403 반환 확인

## 🔗 Dependencies & Blockers
- **Depends on**: T-INFRA-005
- **Blocks**: T-DB-019 (RLS) · T-FEAT-401-W (Magic Link) · T-FEAT-402-W (middleware)
````

---

## Few-Shot Sample 15 / 17

````markdown
---
name: DB Task (Seed)
about: SRS Rev 1.0 기반 aviation_glossary 테이블 + 50건 카고 용어 시드
title: "[DB] T-DB-011: aviation_glossary 테이블 + 50건 카고 용어 seed (AWB·ULD·TAC·Belly 등)"
labels: ['db', 'phase:2', 'step:1', 'priority:must', 'seed']
assignees: ''
---

## 🎯 Summary
- Task ID: T-DB-011
- 기능명: `<AviationTerm term="AWB">` 툴팁이 참조할 항공·카고 용어 사전.
- 목적: P02 해외 영문 장벽 완화 · 현직자 voice 용어 접근성 (P05 Moat 보조).

## 🔗 References
- SRS REQ-FUNC-030 (50건 시드): [`SRS-001#req-func-030`](../SRS-001-arum-cargo.md)
- SRS REQ-FUNC-029 (AviationTerm 컴포넌트): [`SRS-001#req-func-029`](../SRS-001-arum-cargo.md)
- PRD 03 §6.2 + §1.3 Definitions: [`PRD 03`](../../prd/03-data-model.md)
- references/10-aviation-glossary.md: [`references/10`](../../references/10-aviation-glossary.md)

## ✅ Task Breakdown
- [ ] `supabase/migrations/20260419000011_create_aviation_glossary.sql`
- [ ] 컬럼:
  - `id uuid PK`
  - `term text UNIQUE NOT NULL` (예: "AWB")
  - `full_name_en text NOT NULL` ("Air Waybill")
  - `name_ko text NOT NULL` ("항공화물운송장")
  - `definition text NOT NULL` (1~2문장 정의)
  - `example text` (1줄 예시)
  - `category text` (`document` · `equipment` · `index` · `org` · `role` · `operation`)
  - `created_at` / `updated_at`
- [ ] 시드 50건 SQL INSERT — 카고 중심:
  - **문서**: AWB · HAWB · MAWB · SLI · CI · PL · COO · DG Decl · MSDS · NOC (10)
  - **장비**: ULD · AKE · AAP · PMC · PAG · PAJ · AKN · RKN · AYF · RAP (10)
  - **지수/운임**: TAC Index · BAI · WFR · FSC · SSC · GRI · PSS · CW · DW · CGD (10)
  - **기종/운영**: Freighter · Combi · Belly Cargo · Main Deck · Lower Deck · Widebody · Narrowbody · Pallet · Loose Cargo · Build-up (10)
  - **조직/역할**: Consolidator (콘솔사) · Forwarder · 3PL · 4PL · NVOCC · IAC · RFS · GHA · CTO · OHFS (10)
- [ ] 각 용어 definition 은 한국어로 1~2문장 · 11년차 현직자 voice 반영
- [ ] `category` 컬럼으로 툴팁 스타일 구분 옵션 (향후 UI 분기용)

## 📋 Acceptance Criteria
- **Scenario 1 — 행 개수**: `SELECT COUNT(*) FROM aviation_glossary` = 50
- **Scenario 2 — 필수 용어 존재**: `SELECT term FROM aviation_glossary WHERE term IN ('AWB','ULD','TAC Index','Belly Cargo','Consolidator','Forwarder')` 6 rows
- **Scenario 3 — 중복 방지**: 동일 term 재시드 시 `ON CONFLICT (term) DO NOTHING`
- **Scenario 4 — 한국어 번역 정확성**: `AWB` → `항공화물운송장` · `ULD` → `단위 적재용기` (사용자 검수)

## ⚙️ Technical & Non-Functional Constraints
- **사용자 검수 필수**: 11년차 현직자 voice 정합성 확인 후 커밋 (자동 번역 금지)
- **seed 파일 분리 옵션**: `supabase/seed.sql` 또는 마이그레이션 내장 — Supabase CLI 관습 따름
- **확장 가능**: 신규 용어 추가는 새 마이그레이션 (DELETE·UPDATE 대신 INSERT)

## ✔️ DoD
- [ ] AC 4종 충족
- [ ] 사용자(Founder) term/번역 50건 검수 완료
- [ ] T-FEAT-031-R (용어 자동 래핑) 의 seed 입력으로 사용 가능

## 🔗 Dependencies & Blockers
- **Depends on**: T-INFRA-005 · T-DB-013 (category 가 enum 으로 승격 시) — 현재는 text 로 시작
- **Blocks**: T-FEAT-031-R · T-UI-029 (AviationTerm 컴포넌트 렌더)
````

---

## Few-Shot Sample 16 / 17

````markdown
---
name: DB Task (Indexes)
about: SRS Rev 1.0 기반 인덱스 일괄 마이그레이션
title: "[DB] T-DB-018: 인덱스 일괄 — published_at · editor_pick · last_active_at · approved 등 7종"
labels: ['db', 'phase:2', 'step:1', 'priority:must', 'performance']
assignees: ''
---

## 🎯 Summary
- Task ID: T-DB-018
- 기능명: 주요 쿼리 p95 성능을 위한 인덱스 일괄 생성.
- 목적: REQ-NF-008 (뉴스 목록 200ms) · REQ-NF-009 (채용 300ms) · REQ-NF-010 (WAU 100ms) 충족.

## 🔗 References
- SRS REQ-NF-008 (뉴스 p95 200ms): [`SRS-001#req-nf-008`](../SRS-001-arum-cargo.md)
- SRS REQ-NF-009 (채용 p95 300ms): [`SRS-001#req-nf-009`](../SRS-001-arum-cargo.md)
- SRS REQ-NF-010 (WAU p95 100ms): [`SRS-001#req-nf-010`](../SRS-001-arum-cargo.md)
- PRD 03 §8: [`PRD 03`](../../prd/03-data-model.md)

## ✅ Task Breakdown
- [ ] `supabase/migrations/20260419000018_indexes.sql`
- [ ] 인덱스 7종:
```sql
-- 뉴스
CREATE INDEX idx_news_articles_is_published_published_at
  ON news_articles (is_published, published_at DESC)
  WHERE is_published = true;

CREATE INDEX idx_news_articles_editor_pick
  ON news_articles (editor_pick_at DESC)
  WHERE editor_pick IS NOT NULL;

CREATE INDEX idx_news_articles_category_published
  ON news_articles (category, published_at DESC)
  WHERE is_published = true;

-- 채용
CREATE INDEX idx_job_posts_status_deadline
  ON job_posts (status, deadline)
  WHERE status = 'approved';

CREATE INDEX idx_job_posts_category_trust
  ON job_posts (cargo_category, source_trust_score DESC, deadline)
  WHERE status = 'approved';

-- 구독자
CREATE INDEX idx_subscribers_last_active
  ON subscribers (last_active_at DESC)
  WHERE status = 'verified';

-- ingest_logs 로테이션
CREATE INDEX idx_ingest_logs_started_at
  ON ingest_logs (started_at DESC);
```
- [ ] partial index 문법 확인 (WHERE 절 조건부 인덱스) — 저장 공간 절약

## 📋 Acceptance Criteria
- **Scenario 1 — EXPLAIN ANALYZE 통과**: 10,000 row 시드 후 `SELECT ... FROM news_articles WHERE is_published=true ORDER BY published_at DESC LIMIT 5` → Bitmap Index Scan 사용 · p95 ≤ 200ms
- **Scenario 2 — 채용 필터**: 100,000 row 시드 + `cargo_category='sales' AND status='approved'` 정렬 → p95 ≤ 300ms
- **Scenario 3 — WAU**: `COUNT(*) FROM subscribers WHERE status='verified' AND last_active_at >= now() - interval '7 days'` → p95 ≤ 100ms
- **Scenario 4 — 인덱스 존재**: `\di+` 로 7개 인덱스 모두 확인

## ⚙️ Technical & Non-Functional Constraints
- **partial index**: WHERE 절로 저장 공간·쓰기 오버헤드 최소화
- **Supabase Free 500MB**: 인덱스 크기 포함 전체 DB ≤ 500MB 유지 (REQ-NF-121)
- **시드 필요**: AC 검증은 10k~100k row 시드 후 `ANALYZE` 재계산 필수

## ✔️ DoD
- [ ] AC 4종 EXPLAIN ANALYZE 로그 첨부 (T-TEST-019 결과)
- [ ] Supabase 대시보드 DB 사용량 Phase 2 종료 시 ≤ 100MB

## 🔗 Dependencies & Blockers
- **Depends on**: T-DB-001 · T-DB-002 · T-DB-003 · T-DB-010
- **Blocks**: T-TEST-019 · T-NFR-003 · Phase 2 성능 게이트
````

---

## Few-Shot Sample 17 / 17

````markdown
---
name: DB Task (RLS)
about: SRS Rev 1.0 기반 RLS 정책 일괄 적용
title: "[DB] T-DB-019: RLS 정책 일괄 — 전 테이블 rls:true + 공개 범위 정책 + negative test 준비"
labels: ['db', 'phase:2', 'step:1', 'priority:must', 'security']
assignees: ''
---

## 🎯 Summary
- Task ID: T-DB-019
- 기능명: Supabase 모든 테이블 RLS 활성화 + 테이블별 anon/authenticated/service_role 정책 선언.
- 목적: REQ-FUNC-500~504 보안 요구 일괄 충족. T-TEST-002 negative test 의 선행.

## 🔗 References
- SRS REQ-FUNC-500 (전 테이블 RLS): [`SRS-001#req-func-500`](../SRS-001-arum-cargo.md)
- SRS REQ-FUNC-501·502·503·504 (테이블별 정책): [`SRS-001#req-func-501`](../SRS-001-arum-cargo.md)
- SRS C-TEC-012 (RLS 필수 + Service Role 서버 전용): [`SRS-001#c-tec-012`](../SRS-001-arum-cargo.md)

## ✅ Task Breakdown
- [ ] `supabase/migrations/20260419000019_rls_policies.sql`
- [ ] 모든 테이블 RLS 활성:
```sql
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_digests ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingest_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE aviation_glossary ENABLE ROW LEVEL SECURITY;
ALTER TABLE cargo_career_links ENABLE ROW LEVEL SECURITY;
```
- [ ] 정책 선언:
```sql
-- news: anon 은 is_published=true 만
CREATE POLICY news_read_published ON news_articles
  FOR SELECT TO anon USING (is_published = true);

-- jobs: anon 은 status='approved' 만
CREATE POLICY jobs_read_approved ON job_posts
  FOR SELECT TO anon USING (status = 'approved');

-- subscribers: anon INSERT 만 (구독)
CREATE POLICY subscribers_insert_anon ON subscribers
  FOR INSERT TO anon WITH CHECK (true);
-- SELECT·UPDATE·DELETE 정책 부재 → 전부 deny

-- admin_users: anon 전체 차단 (policy 없음 → RLS deny)
-- (service_role 는 RLS bypass, 정책 선언 불필요)

-- glossary · career_links: anon SELECT 전체 허용
CREATE POLICY glossary_read_all ON aviation_glossary
  FOR SELECT TO anon USING (true);
CREATE POLICY career_links_read_all ON cargo_career_links
  FOR SELECT TO anon USING (true);

-- news_clicks · job_clicks: anon INSERT 만 (beacon)
CREATE POLICY news_clicks_insert ON news_clicks
  FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY job_clicks_insert ON job_clicks
  FOR INSERT TO anon WITH CHECK (true);

-- daily_digests · subscription_events · email_events · ingest_logs:
--   anon 접근 차단, service_role 만 (정책 부재 → deny)
```

## 📋 Acceptance Criteria
- **Scenario 1 — RLS 활성화 전수**: `\dt+` 출력에서 모든 테이블 `rls: true`
- **Scenario 2 — anon 뉴스 비공개 차단**: `SET role 'anon'; SELECT * FROM news_articles WHERE is_published=false` → 0 rows
- **Scenario 3 — anon 채용 approved 외 차단**: `status!='approved'` 0 rows
- **Scenario 4 — admin_users anon 차단**: 어떤 CRUD도 0 rows 또는 403
- **Scenario 5 — glossary anon 공개**: 50 rows 반환
- **Scenario 6 — service_role bypass**: admin client 로 모든 테이블 전 row 접근 가능

## ⚙️ Technical & Non-Functional Constraints
- **RLS 원칙**: "deny by default" — 정책 없으면 anon 차단
- **service_role**: RLS bypass (Supabase 기본)
- **authenticated**: 현재 MVP 에서 미사용 (관리자는 service_role 로 API 호출)

## ✔️ DoD
- [ ] AC 6종 검증 (T-TEST-002 negative test 로 자동화)
- [ ] Supabase Dashboard → Policies 탭에서 시각 확인
- [ ] Phase 2 품질 게이트 통과 (보안 기초)

## 🔗 Dependencies & Blockers
- **Depends on**: T-DB-001 ~ T-DB-012 (모든 테이블 존재)
- **Blocks**: T-TEST-002 · T-NFR-012 · Phase 2 종료 판정

---

## Few-Shot Sample 18 / 38

````markdown
---
name: Infra Task
title: "[Infra] T-INFRA-003: Pretendard + Space Grotesk + JetBrains Mono 3종 폰트 로딩"
labels: ['infra', 'phase:2', 'step:4', 'priority:must']
---

## 🎯 Summary
- Task ID: T-INFRA-003 · 3종 폰트를 `next/font` 로 self-host + 페이로드 ≤100KB · CLS ≤0.1 유지

## 🔗 References
- SRS REQ-FUNC-305 / REQ-NF-144 · C-TEC-004 · PRD 06 §3 타이포 시스템

## ✅ Task Breakdown
- [ ] `web/src/app/fonts.ts` — `next/font/local` 또는 `next/font/google` 로 3종 로딩
- [ ] Pretendard Variable (`.woff2` self-host, `subset=korean` 필수)
- [ ] Space Grotesk (Google Fonts `display: 'swap'`)
- [ ] JetBrains Mono (Google Fonts `display: 'swap'`)
- [ ] CSS 변수 `--font-sans` / `--font-display` / `--font-mono` 루트 주입
- [ ] `tailwind.config.ts` fontFamily 에 CSS 변수 연결
- [ ] `app/layout.tsx` `<html>` 에 `className={fonts.variable}` 적용

## 📋 Acceptance Criteria
- **S1**: 초기 로딩 Network 탭에서 폰트 payload 총합 ≤ 100KB
- **S2**: Lighthouse CLS ≤ 0.1 (폰트 swap 으로 인한 shift 최소화)
- **S3**: 한글 본문 글리프 정상 렌더 (Pretendard Korean subset 확인)
- **S4**: 숫자 타이포그래피 (운임·AWB 번호) Space Grotesk 적용 확인

## ⚙️ Constraints
- Google Fonts 임의 추가 금지 (C-TEC-004) · 변경 시 CLAUDE.md 동기화

## ✔️ DoD
- [ ] AC 4종 충족 · Lighthouse 모바일 Performance ≥80

## 🔗 Dependencies
- Depends: T-INFRA-001 · Blocks: 모든 UI Task (T-UI-*)
````

---

## Few-Shot Sample 19 / 38

````markdown
---
name: Infra Task
title: "[Infra] T-INFRA-004: Framer Motion + tailwindcss-animate + react-intersection-observer 설치"
labels: ['infra', 'phase:2', 'step:4', 'priority:must']
---

## 🎯 Summary
- Task ID: T-INFRA-004 · 모션 스택 3종 설치 + `useReducedMotion()` 글로벌 훅 준비

## 🔗 References
- SRS C-TEC-003 · REQ-FUNC-308 · REQ-NF-142 · PRD 06 §4

## ✅ Task Breakdown
- [ ] `pnpm add framer-motion@^11 tailwindcss-animate react-intersection-observer`
- [ ] `web/src/lib/motion/provider.tsx` — `MotionConfig` 루트 provider (`reducedMotion="user"`)
- [ ] `web/src/lib/motion/use-arum-motion.ts` — 공통 스태거 variants 노출
- [ ] `tailwind.config.ts` plugins 배열에 `require("tailwindcss-animate")`
- [ ] GSAP · Lenis · Lottie · WebGL 라이브러리 설치 PR 차단 ESLint custom rule (T-INFRA-010 와 연계)

## 📋 Acceptance Criteria
- **S1**: `import { motion } from 'framer-motion'` 정상 동작
- **S2**: OS `prefers-reduced-motion: reduce` 설정 시 `useReducedMotion()` true 반환
- **S3**: `tailwindcss-animate` class (`animate-in`, `fade-in-0`) 적용 확인
- **S4**: `IntersectionObserver` polyfill 없이 최신 브라우저 동작 (iOS Safari 14+)

## ⚙️ Constraints
- 번들: Framer Motion ≤ 40KB (tree-shake 후) · GSAP 금지 (C-TEC-003)

## ✔️ DoD
- [ ] AC 4종 충족 · `pnpm build` 번들 사이즈 검증

## 🔗 Dependencies
- Depends: T-INFRA-001 · T-INFRA-002 · Blocks: T-UI-301·302·303·304
````

---

## Few-Shot Sample 20 / 38

````markdown
---
name: Infra Task
title: "[Infra] T-INFRA-006: supabase/migrations YYYYMMDDHHMMSS 네이밍 규약 CI 강제"
labels: ['infra', 'phase:2', 'step:4', 'priority:must', 'ci']
---

## 🎯 Summary
- Task ID: T-INFRA-006 · 마이그레이션 파일명 규약 CI 검증으로 순서 오류 방지

## 🔗 References
- SRS C-TEC-011 · REQ-NF-163 · PRD 03 §1 마이그레이션 규약

## ✅ Task Breakdown
- [ ] `scripts/check-migration-naming.ts` — 정규식 `/^\d{14}_[a-z0-9_]+\.sql$/` 검증
- [ ] `.github/workflows/ci.yml` 에 step 추가 — `supabase/migrations/*.sql` 전수 검사
- [ ] Timestamp prefix 가 과거 커밋보다 작으면 warning (경고만 · block 하지 않음)
- [ ] `supabase/migrations/README.md` — 새 마이그레이션 추가 방법 가이드

## 📋 Acceptance Criteria
- **S1**: `create_users.sql` (timestamp 없음) → CI 실패
- **S2**: `20260419000001_news_articles.sql` (정상) → 통과
- **S3**: `20251231000001_old.sql` (미래 → 현재보다 과거) → warning 출력만
- **S4**: 대문자·공백 포함 파일명 → CI 실패

## ⚙️ Constraints
- ORM 자동 생성 마이그레이션 금지 (C-TEC-011) · Raw SQL 만 허용

## ✔️ DoD
- [ ] AC 4종 검증 · fake PR 로 규약 위반 테스트 1회

## 🔗 Dependencies
- Depends: T-INFRA-010 (CI pipeline) · Blocks: 모든 T-DB-* (네이밍 준수 확인)
````

---

## Few-Shot Sample 21 / 38

````markdown
---
name: Infra Task
title: "[Infra] T-INFRA-007: src/lib/supabase + src/lib/api 디렉토리 뼈대 + barrel 금지 규약"
labels: ['infra', 'phase:2', 'step:4', 'priority:must']
---

## 🎯 Summary
- Task ID: T-INFRA-007 · `src/lib/` 하위 서비스별 모듈 뼈대 + barrel export 금지 규약 확정
- 목적: T-API-008 (Supabase clients) 이외 나머지 API client 파일들의 위치·네이밍 SSOT

## 🔗 References
- SRS C-TEC-009 (외부 API client 네이밍) · CON-08

## ✅ Task Breakdown
- [ ] `web/src/lib/supabase/` — T-API-008 에서 이미 다룸 (client.ts · server.ts · admin.ts · database.types.ts)
- [ ] `web/src/lib/api/` 디렉토리 + 빈 client 파일 스텁:
  - `naver-client.ts` · `rss-client.ts` · `worknet-client.ts` · `saramin-client.ts`
  - `translation/index.ts` (facade) · `translation/gemini.ts` (adapter)
  - `loops-client.ts` · `vercel-analytics-client.ts`
- [ ] 각 스텁: `export async function {...}Fetch(): Promise<never> { throw new Error('not implemented') }`
- [ ] `web/src/lib/email/` — Loops templates HTML builder 디렉토리 (stub)
- [ ] `web/src/lib/cargo/` — 카고 도메인 유틸 (aviation term wrapper · trust score · exclude regex) stub
- [ ] **Barrel export (`index.ts` 재노출) 금지** — 각 파일 직접 import 강제 (admin.ts 실수 import 방지)

## 📋 Acceptance Criteria
- **S1**: 디렉토리 구조 tree 출력이 PRD 07 §3.1 scope 5번과 일치
- **S2**: stub 함수 호출 시 `Error('not implemented')` throw 확인
- **S3**: `src/lib/supabase/index.ts` · `src/lib/api/index.ts` 파일 부재 (barrel 금지)
- **S4**: ESLint 규칙으로 `import ... from '@/lib/api'` (디렉토리 직접 import) 금지

## ⚙️ Constraints
- 각 client 파일 상단 주석에 관련 REQ-FUNC ID · Phase 명시
- zod schema 파일은 각 client 내부 co-locate (별도 `schemas/` 금지)

## ✔️ DoD
- [ ] AC 4종 충족 · Phase 4 진입 시 stub 구현 교체 Task 로 이어짐

## 🔗 Dependencies
- Depends: T-INFRA-001 · Blocks: T-API-001 ~ 007 · 009 (실 구현)
````

---

## Few-Shot Sample 22 / 38

````markdown
---
name: Infra Task
title: "[Infra] T-INFRA-008: Vercel 프로젝트 생성 + arumcargo.vercel.app + Analytics 활성"
labels: ['infra', 'phase:2', 'step:4', 'priority:must']
---

## 🎯 Summary
- Task ID: T-INFRA-008 · Vercel Hobby 프로젝트 + Git push 자동 배포 + 기본 도메인 `arumcargo.vercel.app`

## 🔗 References
- SRS C-TEC-019 · C-TEC-020 · CON-12 · PRD 07 §3.1

## ✅ Task Breakdown
- [ ] Vercel 계정에서 GitHub `raion-log/arum-cargo` 연결
- [ ] Root Directory: `web/` · Framework: Next.js · Build: `pnpm build`
- [ ] Project name: `arumcargo` → 자동 도메인 `arumcargo.vercel.app`
- [ ] Environment Variables 설정 (`.env.local` 키 전부 · Production · Preview)
- [ ] Vercel Analytics 활성화 (Settings → Analytics)
- [ ] Vercel Speed Insights 옵션 활성
- [ ] Branch 배포 규칙: `main` → Production · `dev` → Preview
- [ ] Deployment Protection 설정 확인 (Preview 비밀번호 옵션 off — 테스터 접근 용이)

## 📋 Acceptance Criteria
- **S1**: `git push origin dev` → Vercel Preview URL 자동 생성 (2분 이내 배포)
- **S2**: `arumcargo.vercel.app` GET 200 응답
- **S3**: Vercel Analytics Dashboard 에서 MUV 카운트 시작
- **S4**: Production env 에서 Supabase 쿼리 성공 (Phase 2 후반)

## ⚙️ Constraints
- Vercel Hobby 무료 티어 · 유료 전환 시 C-COST-001 승인 필요
- 커스텀 도메인 전환은 CON-12 조건 (WAU 500 or 제휴 문의)

## ✔️ DoD
- [ ] AC 4종 충족 · 실제 배포 URL 1회 접속 로그 남김

## 🔗 Dependencies
- Depends: T-INFRA-001 · T-INFRA-009 (env.example) · T-INFRA-005 (Supabase keys)
- Blocks: 실 환경 QA · 테스터 베타 참여
````

---

## Few-Shot Sample 23 / 38

````markdown
---
name: Infra Task
title: "[Infra] T-INFRA-013: SiteHeader · SiteFooter 기본 레이아웃 + 사업자정보 footer"
labels: ['infra', 'phase:2', 'step:4', 'priority:must', 'legal']
---

## 🎯 Summary
- Task ID: T-INFRA-013 · 전 화면 공통 헤더·푸터 레이아웃. Footer 에 §50 발신자 정보 필수.

## 🔗 References
- SRS REQ-FUNC-310 (법정 페이지 링크) · CON-09 (실명 비노출)
- PRD 06 §5 레이아웃

## ✅ Task Breakdown
- [ ] `web/src/components/layout/site-header.tsx` — 로고 (`아름 카고`) · 내비 (뉴스 · 채용 · About) · 구독 CTA
- [ ] `web/src/components/layout/site-footer.tsx`:
  - 저작권 (© 2026 Arum Cargo)
  - `/privacy` · `/terms` 링크
  - 사업자등록번호 · 주소 · 이메일 · 연락처 (env 또는 config 에서 주입)
  - 한아름종합물류 구분 문구: "본 서비스는 (주)한아름종합물류와 무관합니다"
- [ ] `app/layout.tsx` 루트에 `<SiteHeader />` · `<SiteFooter />` 배치
- [ ] 모바일 반응형 (햄버거 메뉴) · 360px 최소폭 지원
- [ ] About 페이지에 실명·회사명 노출 금지 lint 규칙 추가 (T-INFRA-010 연계)

## 📋 Acceptance Criteria
- **S1**: 모든 라우트 접근 시 헤더·푸터 렌더링
- **S2**: Footer grep 으로 사업자정보 4항목 문자열 존재
- **S3**: 한아름종합물류 구분 문구 노출
- **S4**: 모바일 360px 에서 레이아웃 붕괴 없음

## ⚙️ Constraints
- About 페이지 + 푸터 어디에도 Founder 실명·회사·학교 문자열 부재 (CON-09)
- 사업자정보는 env 로 주입 — 실 값은 `.env.local` / Vercel env

## ✔️ DoD
- [ ] AC 4종 충족 · axe DevTools 0 critical · 법률 자문 후 문구 확정 (T-INFRA-009 env 키 중 `NEXT_PUBLIC_BUSINESS_INFO` 도입 검토)

## 🔗 Dependencies
- Depends: T-INFRA-001 · T-INFRA-002 · T-INFRA-003 · Blocks: Phase 3 UI Task 전체
````

---

## Few-Shot Sample 24 / 38

````markdown
---
name: Infra Task
title: "[Infra] T-INFRA-014: next.config.js remotePatterns — 썸네일 직접 링크 허용 도메인"
labels: ['infra', 'phase:2', 'step:4', 'priority:should']
---

## 🎯 Summary
- Task ID: T-INFRA-014 · 뉴스 썸네일 외부 직접 로드를 위한 허용 도메인 화이트리스트

## 🔗 References
- SRS REQ-FUNC-032 · REQ-FUNC-311 · PRD 02 §3.4

## ✅ Task Breakdown
- [ ] `web/next.config.mjs` `images.remotePatterns` 추가:
  - 카고프레스 · Loadstar · Air Cargo News UK · FlightGlobal · Naver 뉴스 CDN · Worknet · Saramin
  - 각 도메인 패턴: `{ protocol: 'https', hostname: '*.example.com' }`
- [ ] `images.unoptimized: true` 옵션은 **금지** (Vercel Image Optimization 사용)
- [ ] 알 수 없는 도메인 fallback: placeholder 이미지 (`/images/placeholder-cargo.svg`)
- [ ] 월 1회 RSS 피드 헬스체크로 신규 도메인 감지 시 업데이트

## 📋 Acceptance Criteria
- **S1**: 허용 도메인 썸네일 `<Image>` 렌더 성공
- **S2**: 미허용 도메인 요청 시 Next.js 400 에러 → placeholder 로 대체
- **S3**: CLS ≤ 0.1 (이미지 로드 시 layout shift 없음)

## ⚙️ Constraints
- 원본 저장 금지 (CON-07) · Vercel CDN 캐시만 허용
- 신규 도메인 추가 시 법적 공정 이용 범위 재확인

## ✔️ DoD
- [ ] AC 3종 충족 · Lighthouse 이미지 관련 score 통과

## 🔗 Dependencies
- Depends: T-INFRA-001 · Blocks: T-UI-* 뉴스 카드 렌더링
````

---

## Few-Shot Sample 25 / 38

````markdown
---
name: DB Task
title: "[DB] T-DB-005: news_clicks 테이블 (beacon tracking)"
labels: ['db', 'phase:2', 'step:1', 'priority:must']
---

## 🎯 Summary
- Task ID: T-DB-005 · 외부 원문 클릭 beacon 수신용 테이블

## 🔗 References
- SRS REQ-FUNC-024 · REQ-FUNC-119 (job_clicks 와 대칭)
- PRD 04 §9 분석 테이블

## ✅ Task Breakdown
- [ ] `supabase/migrations/20260419000005_create_news_clicks.sql`
- [ ] 컬럼:
  - `id uuid PK`
  - `news_article_id uuid NOT NULL REFERENCES news_articles(id) ON DELETE CASCADE`
  - `subscriber_id uuid REFERENCES subscribers(id) ON DELETE SET NULL` (NULL=비구독자)
  - `clicked_at timestamptz NOT NULL DEFAULT now()`
  - `user_agent text` · `ip inet` · `referrer text`
- [ ] 인덱스: `(news_article_id, clicked_at DESC)`
- [ ] RLS: anon INSERT 만 (T-DB-019 일괄 적용)

## 📋 Acceptance Criteria
- **S1**: anon INSERT 성공 · SELECT 차단
- **S2**: FK 없는 news_article_id 는 참조 무결성 위반
- **S3**: ON DELETE CASCADE 동작 (news 삭제 시 clicks 자동 삭제)

## ⚙️ Constraints
- PII 최소화: IP 는 로그로만 · 90일 retention (REQ-NF-165)

## ✔️ DoD
- [ ] AC 3종 + `/api/news/click/[id]` beacon endpoint 연동 준비

## 🔗 Dependencies
- Depends: T-DB-001 · T-DB-003 · Blocks: T-FEAT-024-W
````

---

## Few-Shot Sample 26 / 38

````markdown
---
name: DB Task
title: "[DB] T-DB-006: job_clicks 테이블 (beacon tracking)"
labels: ['db', 'phase:2', 'step:1', 'priority:must']
---

## 🎯 Summary
- Task ID: T-DB-006 · 채용 공고 외부 원문 클릭 beacon. news_clicks 와 대칭 구조.

## 🔗 References
- SRS REQ-FUNC-119 · PRD 04 §9

## ✅ Task Breakdown
- [ ] `supabase/migrations/20260419000006_create_job_clicks.sql`
- [ ] 컬럼: `id` · `job_post_id uuid REFERENCES job_posts ON DELETE CASCADE` · `subscriber_id (null ok)` · `clicked_at` · `user_agent` · `ip` · `referrer`
- [ ] 인덱스 `(job_post_id, clicked_at DESC)`
- [ ] RLS anon INSERT 만

## 📋 AC
- **S1~S3**: news_clicks 와 동일 패턴 (FK · CASCADE · anon INSERT 허용)

## ⚙️ Constraints
- Job 신뢰도 지표 (click-through) 분석에 사용 · Phase 5+ 대시보드 KPI

## ✔️ DoD
- [ ] AC 3종 · `/api/jobs/click/[id]` 연동 준비

## 🔗 Dependencies
- Depends: T-DB-002 · T-DB-003 · Blocks: T-FEAT-119-W
````

---

## Few-Shot Sample 27 / 38

````markdown
---
name: DB Task
title: "[DB] T-DB-007: daily_digests 테이블 + digest_date UNIQUE idempotency"
labels: ['db', 'phase:2', 'step:1', 'priority:must']
---

## 🎯 Summary
- Task ID: T-DB-007 · 일 1회 다이제스트 발송 기록 + 멱등성 보장

## 🔗 References
- SRS REQ-FUNC-212 · PRD 05 §5.3

## ✅ Task Breakdown
- [ ] `20260419000007_create_daily_digests.sql`
- [ ] `digest_status` enum: `pending` · `sent` · `partial` · `failed`
- [ ] 컬럼:
  - `id uuid PK`
  - `digest_date date UNIQUE NOT NULL` (**멱등성 키 — 같은 날 2회 호출 차단**)
  - `status digest_status NOT NULL DEFAULT 'pending'`
  - `news_article_ids uuid[] NOT NULL DEFAULT '{}'` (발송 포함 뉴스 ID)
  - `job_post_ids uuid[] NOT NULL DEFAULT '{}'`
  - `subscriber_count int NOT NULL DEFAULT 0`
  - `sent_count int NOT NULL DEFAULT 0`
  - `loops_send_id text` (Loops List Send 응답)
  - `notes text`
  - `started_at` · `finished_at` · `created_at`

## 📋 AC
- **S1**: 같은 `digest_date` 로 2회 INSERT → UNIQUE 위반
- **S2**: status enum invalid 값 차단
- **S3**: retention 7일 cron (REQ-NF-165 와 유사하나 digest 는 7일)

## ⚙️ Constraints
- Loops List Send API 위임 구조에서 `loops_send_id` 가 핵심 추적 ID (REQ-NF-011)

## ✔️ DoD
- [ ] AC 3종 · T-FEAT-206-W (daily-digest cron) 연동 준비

## 🔗 Dependencies
- Depends: T-INFRA-005 · Blocks: T-FEAT-206-W · T-FEAT-215-W
````

---

## Few-Shot Sample 28 / 38

````markdown
---
name: DB Task
title: "[DB] T-DB-008: subscription_events 테이블 + 13개월 보존 (정보통신망법 §50)"
labels: ['db', 'phase:2', 'step:1', 'priority:must', 'legal']
---

## 🎯 Summary
- Task ID: T-DB-008 · 동의·수신거부 이력 감사 로그 · 13개월 이상 보존

## 🔗 References
- SRS REQ-FUNC-509 · CON-04 · 정보통신망법 §50

## ✅ Task Breakdown
- [ ] `20260419000008_create_subscription_events.sql`
- [ ] `event_type` enum: `consented` · `verified` · `unsubscribed` · `settings_changed` · `reactivated`
- [ ] 컬럼:
  - `id uuid PK`
  - `subscriber_id uuid NOT NULL REFERENCES subscribers(id) ON DELETE RESTRICT` (**RESTRICT — 감사 기록 보존**)
  - `event_type event_type NOT NULL`
  - `occurred_at timestamptz NOT NULL DEFAULT now()`
  - `ip inet` · `user_agent text`
  - `metadata jsonb DEFAULT '{}'` (변경 전후 값 등)
- [ ] 인덱스 `(subscriber_id, occurred_at DESC)` · `(event_type, occurred_at DESC)`
- [ ] **retention cron 부재 검증** — 13개월 경과 행도 삭제 금지 (REQ-FUNC-509)

## 📋 AC
- **S1**: subscriber 삭제 시도 → RESTRICT 로 차단 (감사 기록 손실 방지)
- **S2**: 5 event_type 값만 허용
- **S3**: 13개월 경과 row 가 여전히 존재 (manual 검증)

## ⚙️ Constraints
- Personal data retention ≥ 13mo (§50) · 개인정보처리방침에 명시
- anon SELECT 전면 차단 (T-DB-019)

## ✔️ DoD
- [ ] AC 3종 충족 · 개인정보처리방침 초안 연계

## 🔗 Dependencies
- Depends: T-DB-003 · Blocks: T-FEAT-209-W · T-FEAT-210-W · T-NFR-015
````

---

## Few-Shot Sample 29 / 38

````markdown
---
name: DB Task
title: "[DB] T-DB-009: email_events 테이블 + Loops webhook FK"
labels: ['db', 'phase:2', 'step:1', 'priority:must']
---

## 🎯 Summary
- Task ID: T-DB-009 · Loops 이메일 이벤트 수신 저장 · WAU 집계의 핵심 입력원

## 🔗 References
- SRS REQ-FUNC-216 · REQ-FUNC-217 · PRD 05 §11

## ✅ Task Breakdown
- [ ] `20260419000009_create_email_events.sql`
- [ ] `email_event_type` enum: `sent` · `delivered` · `opened` · `clicked` · `bounced` · `complained`
- [ ] 컬럼:
  - `id uuid PK`
  - `subscriber_id uuid REFERENCES subscribers(id) ON DELETE SET NULL`
  - `loops_message_id text NOT NULL`
  - `event_type email_event_type NOT NULL`
  - `occurred_at timestamptz NOT NULL`
  - `received_at timestamptz NOT NULL DEFAULT now()` (webhook 수신 시각)
  - `metadata jsonb DEFAULT '{}'`
- [ ] 인덱스 `(subscriber_id, event_type, occurred_at DESC)` — WAU 쿼리용 · `(loops_message_id)` — webhook 중복 방지
- [ ] UNIQUE `(loops_message_id, event_type, occurred_at)` — webhook 재전송 중복 차단

## 📋 AC
- **S1**: webhook 중복 수신 시 UNIQUE 위반 → `on conflict do nothing` 안전 처리
- **S2**: trigger T-DB-016 발동 → `subscribers.last_active_at` 자동 갱신 (opened/clicked 이벤트)
- **S3**: subscriber 삭제 시 event 는 보존 (SET NULL)

## ⚙️ Constraints
- Loops 무료 티어 webhook 지연 ≤ 5분 (REQ-NF-024)

## ✔️ DoD
- [ ] AC 3종 · T-FEAT-216-W (webhook receiver) 연동

## 🔗 Dependencies
- Depends: T-DB-003 · Blocks: T-DB-016 · T-FEAT-216-W · T-FEAT-408-R (WAU 쿼리)
````

---

## Few-Shot Sample 30 / 38

````markdown
---
name: DB Task
title: "[DB] T-DB-010: ingest_logs 테이블 + 90일 retention + status enum"
labels: ['db', 'phase:2', 'step:1', 'priority:must']
---

## 🎯 Summary
- Task ID: T-DB-010 · 모든 cron/ingest 실행 감사 로그 · 실패 알림·KPI 계측 기반

## 🔗 References
- SRS REQ-FUNC-508 · REQ-NF-165 (90일 retention) · PRD 04 §13

## ✅ Task Breakdown
- [ ] `20260419000010_create_ingest_logs.sql`
- [ ] `ingest_source` enum: `naver` · `rss_domestic` · `rss_overseas` · `worknet` · `saramin` · `gemini` · `daily_digest` · `webhook_loops`
- [ ] `ingest_status` enum: `running` · `success` · `partial` · `failed`
- [ ] 컬럼:
  - `id uuid PK`
  - `source ingest_source NOT NULL`
  - `status ingest_status NOT NULL DEFAULT 'running'`
  - `started_at timestamptz NOT NULL DEFAULT now()`
  - `finished_at timestamptz`
  - `records_total int DEFAULT 0` · `records_new int` · `records_skipped int` · `records_error int`
  - `notes text` (환각 · 쿼터 초과 · 예외 메시지)
  - `raw jsonb` (디버깅용 외부 응답 snapshot · 옵션)
- [ ] 인덱스 `(source, started_at DESC)` · `(status, started_at DESC)` (T-DB-018 에 포함)
- [ ] `supabase/functions/cleanup_ingest_logs/index.ts` (Supabase Edge Function or pg_cron) — 90일 경과 row DELETE

## 📋 AC
- **S1**: 각 cron 시작 시 status='running' INSERT → 종료 시 UPDATE
- **S2**: 90일 경과 row cleanup cron 실행 → 대상 삭제
- **S3**: 실패율 집계 쿼리 성능 ≤ 100ms (월간 데이터셋)

## ⚙️ Constraints
- raw jsonb 는 선택 저장 · Supabase 500MB 초과 리스크 시 비활성
- 90일 cleanup 은 pg_cron extension 또는 Supabase Scheduled Functions

## ✔️ DoD
- [ ] AC 3종 + 90일 cleanup 실제 실행 1회 검증

## 🔗 Dependencies
- Depends: T-INFRA-005 · Blocks: T-FEAT-508-W · T-FEAT-506-W · T-NFR-022 · 모든 cron Task
````

---

## Few-Shot Sample 31 / 38

````markdown
---
name: DB Task (Seed)
title: "[DB] T-DB-012: cargo_career_links 테이블 + 14개 카고 기업 공식 채용 시드"
labels: ['db', 'phase:2', 'step:1', 'priority:must', 'seed']
---

## 🎯 Summary
- Task ID: T-DB-012 · 카고 14개 기업 공식 채용 페이지 딥링크 시드 (UI 딥링크 그리드 뒷받침)

## 🔗 References
- SRS REQ-FUNC-112 · PRD 06 §5 + §6.1

## ✅ Task Breakdown
- [ ] `20260419000012_create_cargo_career_links.sql`
- [ ] 컬럼:
  - `id uuid PK`
  - `company_name text UNIQUE NOT NULL`
  - `company_en text`
  - `career_url text NOT NULL`
  - `logo_url text`
  - `category text` (`airline_cargo` · `forwarder` · `consolidator` · `ground_handling`)
  - `display_order int NOT NULL DEFAULT 100`
  - `is_active boolean NOT NULL DEFAULT true`
  - `created_at` / `updated_at`
- [ ] 14개 시드:
  1. 대한항공카고 · 2. 아시아나카고 · 3. 에어인천 · 4. 서울항공 · 5. 우정항공 · 6. 트리플크라운 (항공사 카고)
  7. 판토스 · 8. CJ대한통운 · 9. 한진 · 10. 코스모항운 · 11. 세방 · 12. 동방 (포워더/콘솔)
  13. 스위스포트 · 14. KAS (지상조업)
- [ ] 각 `career_url` 은 **공식 채용 페이지 딥링크** (2026-04-18 기준 검증 필수 — OQ-R3/R4 연계)
- [ ] RLS: anon SELECT 공개 (T-DB-019)

## 📋 AC
- **S1**: `SELECT COUNT(*) WHERE is_active=true` = 14
- **S2**: `company_name` UNIQUE 위반 재시드 차단
- **S3**: 14개 URL 각각 200 응답 검증 (manual Phase 2 진입 직전)
- **S4**: `/jobs` 화면에서 14 Bento 카드 렌더링 (T-UI-112 연계)

## ⚙️ Constraints
- URL 변경 시 월 1회 헬스체크 · 404 발견 시 `is_active=false` 전환
- 14개 외 추가는 제휴 문의 발생 시점에 검토

## ✔️ DoD
- [ ] AC 4종 충족 · 14개 URL manual 검증 완료

## 🔗 Dependencies
- Depends: T-INFRA-005 · Blocks: T-UI-112 · T-FEAT-112
````

---

## Few-Shot Sample 32 / 38

````markdown
---
name: DB Task (Trigger)
title: "[DB] T-DB-015: log_editor_pick_change 트리거 — 에디터 Pick 수정 이력 자동 기록"
labels: ['db', 'phase:2', 'step:1', 'priority:must']
---

## 🎯 Summary
- Task ID: T-DB-015 · `news_articles.editor_pick` UPDATE 시 이전 값·tone·작성자·시각을 `editor_pick_history` jsonb 배열에 append

## 🔗 References
- SRS REQ-FUNC-026 · PRD 03 §5.3

## ✅ Task Breakdown
- [ ] `20260419000015_trigger_log_editor_pick_change.sql`
- [ ] Trigger function:
```sql
CREATE OR REPLACE FUNCTION log_editor_pick_change()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.editor_pick IS DISTINCT FROM NEW.editor_pick THEN
    NEW.editor_pick_history := COALESCE(OLD.editor_pick_history, '[]'::jsonb) ||
      jsonb_build_object(
        'previous_pick', OLD.editor_pick,
        'previous_tone', OLD.editor_pick_tone,
        'changed_at', now(),
        'changed_by', current_setting('request.jwt.claim.sub', true)
      );
  END IF;
  RETURN NEW;
END;
$$;
```
- [ ] Trigger 등록 BEFORE UPDATE ON news_articles FOR EACH ROW

## 📋 AC
- **S1**: editor_pick 1회 수정 → history 배열 길이 1 (이전 값 포함)
- **S2**: 3회 연속 수정 → 길이 3 · 시각 순서 정렬
- **S3**: editor_pick 변경 없는 UPDATE → history 변화 없음
- **S4**: `changed_by` 에 admin JWT sub 기록 (Magic Link 세션 연결)

## ⚙️ Constraints
- BEFORE 트리거 (NEW 수정 가능) · AFTER 는 사용 불가
- JWT sub 을 못 가져오면 NULL · 본 Task 에서는 throw 하지 않음

## ✔️ DoD
- [ ] AC 4종 충족 · T-TEST-001 suite 에 통합

## 🔗 Dependencies
- Depends: T-DB-001 · T-DB-004 · Blocks: T-FEAT-025-W · T-FEAT-407-W
````

---

## Few-Shot Sample 33 / 38

````markdown
---
name: DB Task (Trigger)
title: "[DB] T-DB-016: update_subscriber_last_active 트리거 — email_events → subscribers.last_active_at"
labels: ['db', 'phase:2', 'step:1', 'priority:must']
---

## 🎯 Summary
- Task ID: T-DB-016 · `email_events` INSERT (`opened` · `clicked`) 시 대응 subscriber 의 `last_active_at` 을 event.occurred_at 으로 갱신 — WAU 집계의 핵심

## 🔗 References
- SRS REQ-FUNC-217 · REQ-NF-010 · PRD 05 §11

## ✅ Task Breakdown
- [ ] `20260419000016_trigger_update_subscriber_last_active.sql`
- [ ] Trigger function:
```sql
CREATE OR REPLACE FUNCTION update_subscriber_last_active()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.event_type IN ('opened', 'clicked') AND NEW.subscriber_id IS NOT NULL THEN
    UPDATE subscribers
    SET last_active_at = GREATEST(COALESCE(last_active_at, 'epoch'::timestamptz), NEW.occurred_at)
    WHERE id = NEW.subscriber_id;
  END IF;
  RETURN NEW;
END;
$$;
```
- [ ] Trigger 등록 AFTER INSERT ON email_events

## 📋 AC
- **S1**: `opened` INSERT → subscribers.last_active_at 갱신
- **S2**: `clicked` INSERT → 동일
- **S3**: `sent` · `delivered` INSERT → last_active_at 변화 없음 (opened/clicked 만)
- **S4**: GREATEST 로직 — 오래된 event 재수신 시 더 최근 시각 유지

## ⚙️ Constraints
- AFTER 트리거 (UPDATE 는 별도 쿼리)
- GREATEST 는 webhook 순서 역전 방어 (재전송 지연)

## ✔️ DoD
- [ ] AC 4종 충족 · T-TEST-001 suite 에 통합 · T-FEAT-408-R (WAU 쿼리) 정합성 확인

## 🔗 Dependencies
- Depends: T-DB-003 · T-DB-009 · Blocks: T-FEAT-408-R · T-FEAT-409-R · T-FEAT-216-W
````

---

## Few-Shot Sample 34 / 38

````markdown
---
name: Mock Data Task
title: "[Mock] T-MOCK-006: aviation_glossary seed JSON 50건 (T-DB-011 보조 데이터 파일)"
labels: ['mock', 'phase:2', 'step:1', 'priority:must', 'seed']
---

## 🎯 Summary
- Task ID: T-MOCK-006 · `aviation_glossary` 테이블 시드용 JSON 파일 산출 · 11년차 현직자 voice 검증 필수

## 🔗 References
- SRS REQ-FUNC-030 · T-DB-011 (테이블 스키마)

## ✅ Task Breakdown
- [ ] `supabase/seed/aviation_glossary.json` 파일 작성 (50건)
- [ ] 스키마: `{ term, full_name_en, name_ko, definition, example, category }` 배열
- [ ] 카테고리 분포 (T-DB-011 참조): 문서 10 · 장비 10 · 지수/운임 10 · 기종/운영 10 · 조직/역할 10
- [ ] 각 entry:
  - `definition`: 1~2문장 · 한국어 · 카고 현직자 voice
  - `example`: 1줄 · 실 업무 상황 (예: "AWB 123-45678901 조회해서 상태 확인")
- [ ] Supabase CLI seed 스크립트: `supabase db seed --file aviation_glossary.json`
- [ ] 또는 SQL INSERT 파일 `supabase/migrations/20260419000011_seed_glossary.sql` 로 내장 (마이그레이션 방식 선호)

## 📋 AC
- **S1**: JSON 파싱 성공 · 50건 정합
- **S2**: 모든 entry 의 definition 길이 ≥ 10자 · example 존재
- **S3**: 한국어 번역 정확성 — 사용자(Founder) 50건 검수 승인
- **S4**: `supabase db reset` 후 50 rows 존재

## ⚙️ Constraints
- 번역 자동화 금지 (현직자 voice 중요) · Gemini 로 생성한 초안도 반드시 검수 후 커밋
- 재시드 시 `ON CONFLICT (term) DO NOTHING`

## ✔️ DoD
- [ ] AC 4종 · Founder 50건 검수 증거 커밋 메시지에 포함

## 🔗 Dependencies
- Depends: T-DB-011 · Blocks: T-FEAT-031-R · T-UI-029
````

---

## Few-Shot Sample 35 / 38

````markdown
---
name: Test Task
title: "[Test] T-TEST-002: RLS negative test suite — anon/service_role 격리 증명"
labels: ['test', 'phase:2', 'step:3', 'priority:must', 'security']
---

## 🎯 Summary
- Task ID: T-TEST-002 · anon · authenticated · service_role 3개 role 로 각 테이블 CRUD 시도하여 RLS 정책 negative test 로 증명

## 🔗 References
- SRS REQ-FUNC-500~504 · REQ-NF-040~044 · T-DB-019

## ✅ Task Breakdown
- [ ] `supabase/tests/rls/news_articles.test.sql` · `job_posts.test.sql` · `subscribers.test.sql` · `admin_users.test.sql` · `glossary.test.sql`
- [ ] 각 테이블별 시나리오:
  - anon INSERT 허용 여부
  - anon SELECT 차단/공개 범위
  - anon UPDATE/DELETE 차단
  - authenticated (로그인 사용자) 행동
  - service_role bypass 확인
- [ ] pgTAP `results_eq` · `throws_ok` 활용

## 📋 AC
- **news_articles**: anon SELECT `is_published=false` → 0 rows · anon INSERT → denied · service_role 전체 허용
- **job_posts**: anon SELECT `status!='approved'` → 0 rows · anon INSERT → denied
- **subscribers**: anon INSERT → 성공 · anon SELECT → 0 rows (이메일 유출 방지)
- **admin_users**: anon 모든 CRUD → denied
- **aviation_glossary · cargo_career_links**: anon SELECT → 전 row · anon INSERT/UPDATE → denied
- **news_clicks · job_clicks**: anon INSERT → 성공 · anon SELECT → 0 rows
- **daily_digests · subscription_events · email_events · ingest_logs**: anon 모든 CRUD → denied

## ⚙️ Constraints
- 각 test 는 BEGIN/ROLLBACK 트랜잭션 격리
- CI 시간 ≤ 2분 (pgTAP 빠름)
- PR 머지 전 필수 통과 (보안 critical)

## ✔️ DoD
- [ ] 모든 시나리오 통과 · CI 게이트 설정

## 🔗 Dependencies
- Depends: T-DB-019 (RLS 정책) · 모든 T-DB-001~012 (테이블)
- Blocks: Phase 2 종료 판정 · Phase 3 진입
````

---

## Few-Shot Sample 36 / 38

````markdown
---
name: Test Task (Performance)
title: "[Test] T-TEST-019: SQL 인덱스 EXPLAIN ANALYZE — p95 목표 달성 검증"
labels: ['test', 'phase:2', 'step:3', 'priority:must', 'performance']
---

## 🎯 Summary
- Task ID: T-TEST-019 · 주요 쿼리 3종의 EXPLAIN ANALYZE 결과가 REQ-NF-008/009/010 목표 충족 증명

## 🔗 References
- SRS REQ-NF-008 (뉴스 200ms) · REQ-NF-009 (채용 300ms) · REQ-NF-010 (WAU 100ms)
- T-DB-018 (인덱스) · T-NFR-003 (NFR 엔지니어링 Task)

## ✅ Task Breakdown
- [ ] 시드 스크립트 `supabase/tests/perf/seed.sql` — `news_articles` 10k · `job_posts` 100k · `subscribers` 1k · `email_events` 10k
- [ ] `ANALYZE` 실행 (통계 갱신)
- [ ] 3개 쿼리 각 10회 실행 + p95 계산:
  - 뉴스 피드: `SELECT * FROM news_articles WHERE is_published=true ORDER BY published_at DESC LIMIT 5`
  - 채용 필터: `SELECT * FROM job_posts WHERE cargo_category='sales' AND status='approved' ORDER BY source_trust_score DESC, deadline LIMIT 20`
  - WAU: `SELECT COUNT(*) FROM subscribers WHERE status='verified' AND last_active_at >= now() - interval '7 days'`
- [ ] EXPLAIN ANALYZE 결과가 Bitmap Index Scan / Index Scan 사용 (Seq Scan 배제) 확인
- [ ] 결과를 `docs/srs/tasks/reviews/perf-baseline-phase-2.md` 에 기록

## 📋 AC
- **S1**: 뉴스 피드 p95 ≤ 200ms
- **S2**: 채용 필터 p95 ≤ 300ms
- **S3**: WAU 쿼리 p95 ≤ 100ms
- **S4**: 세 쿼리 모두 Index Scan 사용 (Seq Scan fallback 차단)

## ⚙️ Constraints
- Supabase Free 리소스 한계 고려 · 로컬 Docker 스택에서 먼저 검증
- 시드 후 DB 크기 ≤ 100MB (Supabase Free 500MB 의 20%)

## ✔️ DoD
- [ ] AC 4종 · baseline 기록 커밋

## 🔗 Dependencies
- Depends: T-DB-018 · T-DB-001·002·003 · Blocks: T-NFR-003 (NFR 엔지니어링 완료 판정)
````

---

## Few-Shot Sample 37 / 38

````markdown
---
name: NFR Task
title: "[NFR] T-NFR-003: SQL 인덱스 성능 NFR 엔지니어링 — 지속 모니터링 파이프라인"
labels: ['nfr', 'phase:2', 'step:4', 'priority:must', 'performance']
---

## 🎯 Summary
- Task ID: T-NFR-003 · Phase 2 이후에도 인덱스 성능을 지속 측정·알림할 수 있는 엔지니어링 장치

## 🔗 References
- SRS REQ-NF-008·009·010 · T-TEST-019 (초기 baseline)

## ✅ Task Breakdown
- [ ] Supabase `pg_stat_statements` extension 활성화
- [ ] 월 1회 정기 `scripts/perf-audit.ts` — 핵심 3 쿼리의 mean/p95/p99 수집
- [ ] 임계치 초과 시 Loops `tpl-admin-alert` 로 알림 (T-FEAT-411 연계)
- [ ] 결과를 `ingest_logs` 에 `source='perf_audit'` 로 기록 (T-DB-010 재사용)
- [ ] GitHub Actions 월 1회 cron 또는 Vercel Cron 추가 (Phase 5 이후)

## 📋 AC
- **S1**: `pg_stat_statements` 쿼리 가능
- **S2**: perf-audit 스크립트 실행 → 3 쿼리 통계 출력
- **S3**: 의도적 Seq Scan 시나리오 생성 → 알림 트리거
- **S4**: 1달 데이터 축적 후 트렌드 분석 가능

## ⚙️ Constraints
- Supabase Free 플랜에서 `pg_stat_statements` 지원 확인 필요
- 분석 결과는 Founder 만 열람 (개인정보 없음)

## ✔️ DoD
- [ ] AC 4종 · baseline report 커밋

## 🔗 Dependencies
- Depends: T-DB-010 · T-DB-018 · T-TEST-019 · Blocks: Phase 5+ 지속 운영
````

---

## Few-Shot Sample 38 / 38

````markdown
---
name: NFR Task
title: "[NFR] T-NFR-012: 보안 기초 엔지니어링 — RLS + Service Role + Magic Link 1h 만료"
labels: ['nfr', 'phase:2', 'step:4', 'priority:must', 'security']
---

## 🎯 Summary
- Task ID: T-NFR-012 · Phase 2 종료 전 보안 기초 3요소(RLS · Service Role 격리 · Magic Link 1h) 엔지니어링 완성 + 증거 문서화

## 🔗 References
- SRS REQ-NF-040~045 · C-TEC-012 · C-TEC-013 · T-DB-019 · T-API-008

## ✅ Task Breakdown
- [ ] **RLS 인벤토리**: Supabase Dashboard → Policies 전수 캡처 · 12 테이블 전부 `rls: true` 문서화
- [ ] **Service Role 검증**: `pnpm build` 후 `.next/static/` grep `SUPABASE_SERVICE_ROLE_KEY` → 0건 스냅샷
- [ ] **Magic Link 1h**: Supabase Dashboard `Auth → Providers → Email` OTP Expiry = 3600초 스크린샷
- [ ] **ADMIN_EMAIL_WHITELIST**: `admin_users` 테이블에 Founder 이메일만 시드 확인
- [ ] 보안 체크리스트 문서: `docs/srs/tasks/reviews/phase-2-security-evidence.md`
  - RLS 정책 인벤토리
  - Service Role 격리 증거 (번들 grep 결과)
  - Magic Link 설정 스크린샷 링크
  - gitleaks CI 최초 실행 로그 링크 (T-NFR-014)
  - TLS 1.2+ 강제 검증 (Vercel 기본)

## 📋 AC
- **S1**: 12 테이블 전부 RLS 활성
- **S2**: 클라이언트 번들에 Service Role Key 문자열 0건
- **S3**: Magic Link OTP expiry ≤ 3600초
- **S4**: admin_users 시드 이메일 1건 이상

## ⚙️ Constraints
- 보안 기초는 Phase 2 종료 블로커 · 불통과 시 Phase 3 진입 금지
- 증거 문서는 커밋 가능 (secret 제외)

## ✔️ DoD
- [ ] AC 4종 충족 · 보안 체크리스트 문서 커밋 · 사용자(Founder) 서명

## 🔗 Dependencies
- Depends: T-DB-019 · T-API-008 · T-DB-004 · T-NFR-014 (gitleaks)
- Blocks: **Phase 2 종료 판정** · Phase 3 진입

---

## 1. Phase 2 Micro 추출 완료 ✅

위 38개 Task 가 Phase 2 의 전체 Micro 추출물. 별도 확장 대상 없음.

**다음 단계**:
1. Phase 2 사후 검토: [`reviews/phase-2-review.md`](./reviews/phase-2-review.md)
2. 학습 키워드 수집: [`learning-keywords.md`](./learning-keywords.md)
3. Phase 3 (UI Mock) Micro 세션 진입

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

- **2026-04-18 v1.2 (Wave 3 완결)**: Few-Shot 21개 추가 (Sample 18~38). 커버리지 17/38 → **38/38 ✅**. Phase 2 Micro 추출 완료. Wave 3 구성:
  - A 블록 +7: T-INFRA-003 (폰트) · 004 (motion libs) · 006 (migration naming CI) · 007 (lib 뼈대) · 008 (Vercel) · 013 (SiteHeader/Footer) · 014 (remotePatterns)
  - B 블록 +10: T-DB-005·006 (clicks) · 007 (daily_digests 멱등성) · 008 (subscription_events 13mo §50) · 009 (email_events webhook) · 010 (ingest_logs) · 012 (cargo_career_links 14개 시드) · 015·016 (트리거 2종) · T-MOCK-006 (glossary seed JSON)
  - C 블록 +4: T-TEST-002 (RLS negative suite) · T-TEST-019 (EXPLAIN ANALYZE) · T-NFR-003 (perf 지속) · T-NFR-012 (보안 기초)
- **2026-04-18 v1.1 (Wave 2)**: Few-Shot 10개 추가 (Sample 8~17). 커버리지 7/33 → 17/38.
- **2026-04-18 v1.0 (Wave 1)**: 최초 작성. Phase 2 대표 7개 Few-Shot.

---

**End of Phase 2 Tasks (Few-Shot).**
