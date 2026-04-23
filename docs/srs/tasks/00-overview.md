# SRS Task Extraction — Overview & Methodology

> **목적**: 본 문서는 SRS-001 Rev 1.0 Baseline 을 AI 에이전트용 개발 Task 로 추출하는 **방법론·규약·템플릿**을 고정한다. 앞으로 Task 를 새로 만들거나 확장할 때는 반드시 이 문서가 상위 컨텍스트이며, 규약 변경 시 이 파일의 Revision 을 먼저 올린다.
>
> **근거**: 첨부 교육자료 "SRS → 개발 Task 추출" (2026-04-18, 이미지 7장)
> **베이스라인**: [SRS Rev 1.0](../SRS-001-arum-cargo.md) (2026-04-18)
> **작성일**: 2026-04-18 · **작성자**: Claude (Requirements Engineer)

---

## 0. Baseline 요약

| 항목 | 값 |
|---|---|
| SRS 버전 | **Rev 1.0 (Baseline)** |
| REQ-FUNC | 101 row (108 unique ID, §4.1) |
| REQ-NF | 99 row (87 unique ID, §4.2) — Rev 1.1 cleanup 대상 |
| CON | 12 (§1.2.3) |
| C-TEC | 25 (§1.2.4) |
| 외부 시스템 | 9종 (Naver · 국내 RSS · 해외 RSS · Gemini · Worknet · Saramin · Loops · Supabase · Vercel) |
| Phase | 2 (셋업) / 3 (UI Mock) / 4 (API 연동) / 5 (이메일 + 대시보드) / 5.5·6·7 (MVP 외) |
| Out-of-Scope | 승무원·지상직·조종사·모바일앱·수익화·Phase 5.5+ 기능 (승격 금지) |

---

## 1. Pipeline: Macro → Micro (안티패턴 회피)

> 방대한 SRS 문서에 대해 AI 에이전트에게 **단일 프롬프트로 "모든 태스크와 상세 내용을 한 번에 뽑아줘"** 라고 요구하는 것은 **안티 패턴**이다. (교육자료 §4)

본 프로젝트는 **2단 파이프라인**으로 분리한다.

| 단계 | 산출물 | 깊이 | 대상 파일 |
|---|---|---|---|
| **Macro** (전체 구조 식별) | Task ID · 제목 · Step · 관련 REQ · Priority · Phase 만 | **얕음** (인벤토리) | `01-macro-inventory.md` |
| **Micro** (개별 상세 추출) | 풀버전 템플릿 (Summary / Context / Breakdown / AC / Constraints / DoD / Dep) | **깊음** (Task 1개씩) | `phase-{N}-tasks.md` (Phase별 분리) |

### 1.1 Few-Shot 확장 전략

Micro 단계는 각 Phase 파일의 **처음 5~8개 Task** 를 모범 템플릿으로 작성한 뒤, 나머지는 동일 스타일로 확장한다. AI 에이전트가 "참고 예시 → 반복 적용" 패턴으로 빠르게 작업 가능.

### 1.2 세션 분할

한 세션에서 한 Phase 의 Micro 만 처리한다. 여러 Phase 를 섞으면 컨텍스트 혼탁·"너무 헷갈림" 재발 리스크.

---

## 2. 4단계 추출 레시피 (Step 1~4)

교육자료 §3 "AI 에이전트용 4단계 레시피" 를 그대로 따른다.

| Step | 이름 | 목적 | 우선순위 |
|---|---|---|---|
| **Step 1** | **Contract & Data** | DB 테이블 · API DTO · Mock fixture 같은 **구조화 태스크**를 최우선 도출. SSOT 기반. | **최우선** (모든 Phase 선행) |
| **Step 2** | **Logic (CQRS Read/Write)** | 상태 변경 여부로 Read(Query) vs Write(Command) 를 **별개 Task** 로 분리. 닫힌 문맥 보장. | Phase 2~5 본체 |
| **Step 3** | **Test (AC → TDD)** | SRS 의 Acceptance Criteria 를 **테스트 코드 작성 Task** 로 변환. 자동 채점표. | Step 2 와 동시 (또는 직후) |
| **Step 4** | **NFR + Dependency** | 성능·보안·가용성 설정을 Infra/DevOps Task 로 · 전체 Task 간 `Blocks` / `Depends on` 매핑 | 전체 Task 도출 완료 후 |

### Step 1 대상

1. **DB Task** — SRS §6.2 ERD 기반 테이블·트리거·RLS 마이그레이션 파일
2. **API Contract Task** — 외부 API client (`src/lib/api/{service}-client.ts`) + zod schema
3. **Mock 데이터 Task** — Phase 3 UI 병렬 개발용 fixture JSON

### Step 2 대상

- **Read (Query) Task** — 데이터 조회 로직 (`[Feature/Query]` 라벨)
- **Write (Command) Task** — DB 상태 변경 로직 + 입력 검증 (`[Feature/Command]` 라벨)

### Step 3 대상

- **TDD 기반 테스트 시나리오 Task** — Given/When/Then 포맷 테스트 코드 파일 단위로 Task 발급
- Step 2 Feature Task 의 Definition of Done 체크리스트 항목으로 교차 참조

### Step 4 대상

- **Infra 및 보안/성능 Task** — 응답 속도·로깅·권한·비용 캡
- **Dependency 설정** — 이슈 간 `Blocks` / `Depends on` (오케스트레이션 핵심)

---

## 3. 3 핵심 원리

| # | 원리 | 구현 규약 |
|---|---|---|
| **1** | **기능(Functional) 명세보다 데이터·통신 계약(Contract) 명세를 먼저 추출** | Step 1 Task 가 Step 2 Task 의 선행 조건 · `T-FEAT-*` 은 반드시 `T-DB-*` / `T-API-*` 의존 표시 |
| **2** | **단일 요구사항을 상태 변경 여부에 따라 닫힌 문맥으로 쪼개기 (CQRS)** | `T-FEAT-{ID}-R` (Read) / `T-FEAT-{ID}-W` (Write) suffix 로 분리. 한 Task 는 한 목적만 |
| **3** | **인수 조건(AC)을 테스트 코드 Task 로 변환** | 각 `T-FEAT-*` 은 대응 `T-TEST-*` 존재해야 함. DoD 에 "테스트 통과" 명시 |

---

## 4. Task 추출 체크리스트

모든 REQ 한 개를 Task 로 쪼갤 때 아래 4질문을 반복한다 (교육자료 §3 체크리스트).

- [ ] **[Contract]** 이 기능을 구현하기 위해 필요한 DB 테이블·API DTO Task 가 발급되었는가?
- [ ] **[Logic]** 비즈니스 로직이 Read(조회) 와 Write(변경) 로 나누어 Task 가 발급되었는가?
- [ ] **[Test]** 이 기능이 완료됐음을 AI 가 스스로 증명할 수 있는 테스트 코드 Task 가 존재하는가?
- [ ] **[NFR]** 이 기능의 성능·보안을 보장하기 위한 설정 Task 가 누락되지 않았는가?

---

## 5. Task ID Convention

### 5.1 Prefix

| Prefix | 용도 | 대응 Step |
|---|---|---|
| `T-DB-XXX` | Supabase 테이블·인덱스·RLS 정책·트리거 마이그레이션 | Step 1 |
| `T-API-XXX` | 외부 API client + zod parser (Naver·Gemini·Loops·Worknet·Saramin·Supabase·Vercel Analytics) | Step 1 |
| `T-MOCK-XXX` | Fixture JSON / 시드 데이터 | Step 1 |
| `T-FEAT-XXX-R` | 비즈니스 로직 Read/Query (상태 불변) | Step 2 |
| `T-FEAT-XXX-W` | 비즈니스 로직 Write/Command (상태 변경) | Step 2 |
| `T-UI-XXX` | 화면·컴포넌트 (Phase 3 Mock + Phase 4~5 실데이터 연결 포함) | Step 2 (UI 레이어) |
| `T-TEST-XXX` | 테스트 코드 작성 Task (unit / integration / E2E / sec / a11y / perf / legal) | Step 3 |
| `T-NFR-XXX` | 성능·가용성·보안·비용·법적 NFR 엔지니어링 Task | Step 4 |
| `T-INFRA-XXX` | Vercel·GitHub Actions·env·CI/CD·도메인 | Step 4 |

### 5.2 Numbering

- 3자리 0-padded (`001`, `010`, `100`)
- Phase 별로 연속 번호 (Phase 2 범위 · Phase 3 범위 등 겹치지 않도록 Macro 인벤토리에서 선할당)
- CQRS suffix `-R` / `-W` 는 Feature Task 에만. 한 Feature 가 Read+Write 둘 다 필요하면 2개로 쪼갬

### 5.3 Cross-Reference

각 Task 는 아래 컬럼을 필수 포함:
- **SRS 참조**: `docs/srs/SRS-001-arum-cargo.md#req-func-015`
- **PRD 참조**: `docs/prd/02-i-side-information.md#f1-카고-뉴스` 같은 앵커 링크
- **관련 ADR**: ADR-001~008 중 해당 결정

---

## 6. Task 템플릿 2종

### 6.1 간결 템플릿 (Macro inventory 행 단위 — `01-macro-inventory.md` 에서 사용)

```markdown
| T-DB-001 | news_articles 테이블 + 인덱스 + RLS 마이그레이션 | Step 1 | REQ-FUNC-500·501 / REQ-NF-008 | Must | 2 |
```

### 6.2 풀버전 템플릿 (Phase Micro 파일에서 사용 — GitHub Issue 템플릿과 호환)

````markdown
---
name: Feature Task
about: SRS Rev 1.0 기반 구체적 개발 태스크
title: "[Feature] T-FEAT-015-W: 해외 기사 Gemini 번역 파이프라인 (Write)"
labels: ['feature', 'backend', 'priority:must', 'phase:4', 'step:2']
assignees: ''
---

## 🎯 Summary
- Task ID: T-FEAT-015-W
- 기능명: 해외 기사 Gemini 1.5 Flash 한글 요약 (Write/Command)
- 목적: 해외 카고 RSS 원문을 Gemini 어댑터로 요약하여 `news_articles` 에 `is_translated=true` 로 저장.

## 🔗 References (Spec & Context)
> 💡 AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.

- SRS 요구사항: [`SRS-001#req-func-015`](../SRS-001-arum-cargo.md)
- 기술 제약: [`SRS-001#c-tec-015`](../SRS-001-arum-cargo.md) (Gemini facade, Provider-Agnostic)
- 비기능 요구: [`SRS-001#req-nf-014`](../SRS-001-arum-cargo.md) (p95 ≤ 4s), [`SRS-001#req-nf-120`](../SRS-001-arum-cargo.md) (Gemini $0)
- PRD 앵커: [`PRD 02 §4`](../../prd/02-i-side-information.md)
- ADR: [`ADR-007 Amended`](../../adr/ADR-007-translation-gpt-4o-mini.md)
- 데이터 모델: [`SRS-001#erd-news-articles`](../SRS-001-arum-cargo.md)

## ✅ Task Breakdown (실행 계획)
- [ ] `src/lib/api/translation/index.ts` facade 구조 (TranslationProvider 타입 · switch)
- [ ] `src/lib/api/translation/gemini.ts` adapter 구현 (`@google/generative-ai@^0.21` 사용)
- [ ] zod 출력 스키마 정의 (50~500자 한국어 · 카고 용어 괄호 병기)
- [ ] system prompt 템플릿 + temperature=0.2 + max_tokens=500 고정
- [ ] 일일 쿼터(1,500 req) enforce 로직 (`ingest_logs.notes='quota_exceeded'` 분기)
- [ ] `is_translated` 플래그 업데이트 로직
- [ ] Hallucination 탐지 (REQ-FUNC-016 dependency 확인)

## 📋 Acceptance Criteria (BDD / GWT)

### Scenario 1: 정상 번역
- **Given**: `TRANSLATION_PROVIDER=gemini` · 유효 `GOOGLE_GENERATIVE_AI_API_KEY` · 해외 영문 카고 기사 title + body
- **When**: `translate(title, body)` 호출
- **Then**: 50~500자 한국어 요약 반환 · 한국어 문자 비율 ≥ 50% · `is_translated=true` 로 `news_articles` 업데이트

### Scenario 2: 쿼터 초과
- **Given**: 오늘 Gemini 호출 누적 1,500회 도달
- **When**: 번역 함수 호출 직전 쿼터 체크
- **Then**: 호출 skip · `ingest_logs.notes='quota_exceeded'` · 제목만 DB 저장 · `is_translated=false`

### Scenario 3: 환각 검출
- **Given**: 번역 결과에 원문에 없는 2자리 이상 숫자 토큰 포함
- **When**: post-validation 실행
- **Then**: 결과 drop · `ingest_logs.notes='hallucination_drop'` · `is_translated=false`

## ⚙️ Technical & Non-Functional Constraints
- **성능**: p95 ≤ 4s per article (REQ-NF-014)
- **비용**: Gemini 무료 티어 $0 유지 (REQ-NF-120 · 일 1,500 req)
- **타입 안전**: 모든 응답 zod parse 필수 (C-TEC-009)
- **보안**: `GOOGLE_GENERATIVE_AI_API_KEY` 서버 전용 env · 클라이언트 bundle 에 노출 금지 (C-TEC-008)
- **Provider Isolation**: `openai` / `anthropic` 어댑터 미구현 — env 지정 시 `throw new Error('adapter not implemented')` 반환

## ✔️ Definition of Done (DoD)
- [ ] 모든 Acceptance Criteria 를 충족하는 테스트 통과 (→ T-TEST-015 참조)
- [ ] 단위 테스트 (`gemini.test.ts` zod schema 검증) 통과
- [ ] 통합 테스트 (`translation-pipeline.integration.test.ts` Gemini mock) 통과
- [ ] ESLint · TypeScript strict · gitleaks CI 경고 0
- [ ] `OPENAI_*` env 참조 코드 0 (본 Task 가 기본 Provider 를 바꾸는 것이 아님을 확인)

## 🔗 Dependencies & Blockers
- **Depends on**: T-DB-003 (`news_articles.is_translated` 컬럼) · T-API-001 (Gemini client 뼈대)
- **Blocks**: T-FEAT-012-W (해외 RSS ingest 파이프라인 최종 결합) · T-TEST-015 (AC 테스트)
````

---

## 7. 사후 검토 프레임

각 Phase Micro 완료 후 즉시 실행 (교육자료 §5).

### 7.1 3대 기준 재검토 (SRS 검토와 동일)

| 기준 | 질문 |
|---|---|
| **개발 난이도** | MVP 단계에 적절한가? 11년차 카고 현직자 + Claude Code 에이전틱 개발 프로필로 감당 가능한가? |
| **기술 스택** | 복잡성 과잉 없는가? 오픈소스·무료 티어 범위 유지되는가? |
| **운영 비용** | C-COST-001 (월 ₩100,000) 초과 요인 추가되지 않았는가? |

### 7.2 "의도치 않은 Task 확장" 체크

> 이정도 단계에서는 의도치 않은 내용이 거의 나오지 않긴 하지만, 직접 작성한 프롬프트에 따라 **의도치 않은 TASK 확장은 없었는지** 등을 다시 검토합니다. (교육자료)

구체적으로:

- [ ] **Out-of-Scope 품목이 Task 로 섞이지 않았는가?** (승무원/조종사/지상직/모바일앱/수익화/Phase 5.5+ 기능/다국어)
- [ ] **CON-01~12 위반 Task 가 섞이지 않았는가?** (§50 야간 발송·비카고 차단·인스타 크롤링 등)
- [ ] **C-TEC-001~025 스택 외 도구가 Task 에 등장하지 않는가?** (Tremor/GSAP/Prisma/Vercel AI SDK 등)
- [ ] **REQ-NF 목표 숫자 외의 임의 수치가 Task 에 등장하지 않는가?** (SLA·쿼터·예산 caps)

### 7.3 산출물

`docs/srs/tasks/reviews/phase-{N}-review.md` 파일 1개씩. 3대 기준 · 확장 체크 결과 · 학습 키워드 누적.

---

## 8. 학습 키워드 수집 규칙

> 추출된 개발 Task들에 대해 **생소한 부분·애매한 부분** 이 있다면 ⇒ 가이드 러닝 또는 개인화 코딩멘토를 통해 상세한 기술 키워드 개념을 파악하세요! (교육자료 이미지 2)

### 8.1 수집 방식

- Phase Micro 작업 중 발견되는 **생소·애매** 기술 키워드를 즉시 `learning-keywords.md` 에 append
- 컬럼: 키워드 · 발견 맥락 Task ID · 학습 우선순위 (H/M/L) · 학습 완료 체크

### 8.2 예상 키워드 샘플 (사전 파악)

- CQRS pattern (Step 2 분리 개념)
- Supabase RLS 정책 · `auth.uid()` 문맥
- Loops **List Send API** (REQ-NF-011 구현 방식)
- Gemini Generative AI SDK 구조 (`@google/generative-ai`)
- zod discriminated union (API response 타입 가드)
- Playwright (E2E Test Task)
- Vercel `unstable_cache` · ISR revalidation
- k6 부하 테스트 스크립트

### 8.3 판정 기준 (교육자료 이미지 2)

| 상태 | 의미 |
|---|---|
| **개발 계획 키워드에 대해 학습/고민/분석 지점을 정리함** | ✅ "오늘 작업 충분히 훌륭" |
| **개발 계획의 포괄적 범주에 대한 확신을 얻음** | ✅ "오늘 작업 대성공" |

---

## 9. 파일 구조 (3층 구조)

**Layer 1 — 사용자 추적** (12 Checkpoint, 제품 마일스톤)
**Layer 2 — AI 에이전트 실행** (150 Task canonical 6-컬럼)
**Layer 3 — 구현 상세** (풀 GitHub Issue 템플릿)

```
docs/srs/tasks/
├── 00-overview.md                # (이 파일) 방법론·규약 고정
├── CHECKPOINTS.md                # Layer 1 — 사용자 추적 12 CP
├── TASKS.md                      # Layer 2 — AI 에이전트 150 Task canonical
├── 01-macro-inventory.md         # Layer 2 alternate view (Step 기반, TASKS.md 로 대체 권장)
├── phase-2-tasks.md              # Layer 3 — Phase 2 상세 38/38
├── phase-3-tasks.md              # Layer 3 — Phase 3 상세 (추가 예정)
├── phase-4-tasks.md              # Layer 3 — Phase 4 상세 (추가 예정)
├── phase-5-tasks.md              # Layer 3 — Phase 5 상세 (추가 예정)
├── learning-keywords.md          # 생소 키워드 누적
└── reviews/
    ├── phase-2-review.md         # Phase 2 완료 후 사후 검토
    ├── phase-3-review.md
    ├── phase-4-review.md
    └── phase-5-review.md
```

---

## 10. 다음 세션 가이드 (Future Claude 용)

각 Phase Micro 세션 진입 시 수행 절차:

1. **본 `00-overview.md` 를 상위 컨텍스트로 읽기**
2. **`01-macro-inventory.md` 에서 해당 Phase 의 Task 행 전부 스캔**
3. **첫 5~8개 Micro Task 작성** — 풀버전 템플릿 사용 · 모든 필수 컬럼 채움
4. **사용자 리뷰 요청** — 톤·디테일·범위 확인
5. **동일 스타일로 나머지 Task 확장** — Few-Shot 복제
6. **`reviews/phase-{N}-review.md` 작성** — 3대 기준 · 확장 체크 · 학습 키워드
7. **`learning-keywords.md` append** (세션 중 발견된 생소 용어)

**금지 사항**:
- Macro 인벤토리에 없는 신규 Task 즉흥 추가 (→ 먼저 inventory 업데이트 · 사용자 승인)
- Out-of-Scope 품목 Task 생성
- CON/C-TEC/REQ-NF 목표치를 임의 변경한 Task
- 한 Task 에 Read + Write 를 섞어 기술 (CQRS 원칙 위반)

---

## Changelog

- **2026-04-18 v1.0**: 최초 작성. 교육자료 "SRS → 개발 Task 추출" 이미지 7장(4단계 레시피 + 3 핵심원리 + 4 체크리스트 + Macro/Micro 2단 파이프라인 + Few-Shot 전략 + 사후 검토 + 학습 정리) 전부 반영. SRS Rev 1.0 Baseline 에 종속.

---

**End of Overview.**
