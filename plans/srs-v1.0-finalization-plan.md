# SRS v1.0 Finalization Plan (AI 작업용)

**목적**: Claude Code(또는 후속 AI 에이전트)가 본 문서를 컨텍스트로 받아 SRS Rev 0.9.2 → Rev 1.0 승격 작업을 **재실행 가능**하도록 작성된 AI-직접-명령 계획서.
**근거**: 첨부 교육자료 "SRS 도출 검토 및 보강" (2026-04-18, 5 이미지) 중 이미지 5 "AI 작업용 계획서"
**작성일**: 2026-04-18
**상태**: ✅ 적용 완료 (본 문서는 사후 기록 + Rev 1.1 준비 가이드)

---

## 0. Scope

이 plan은 두 가지 역할을 동시에 수행한다:

| 역할 | 내용 |
|---|---|
| **사후 기록** (Rev 1.0 적용 완료) | Rev 0.9.2 → Rev 1.0 에서 어떤 위치를 어떤 내용으로 수정했는지 AI 에이전트 재현 가능 수준으로 명시 |
| **사전 가이드** (Rev 1.1 준비) | OQ-M6 / OQ-R17 / Supabase 500MB / Loops 1,500 도달 시 동일 methodology 로 Rev 1.1 Amendment 작성 가능하도록 템플릿 제공 |

---

## 1. Rev 1.0 에서 적용된 17개 편집 (완료)

모든 편집은 `docs/srs/SRS-001-arum-cargo.md` 한 파일에 대한 Edit tool 호출로 수행되었다. 각 편집은 unique old_string 기반으로 충돌 없이 병렬 적용 가능.

### 1.1 Revision label + Amendment Triggers 블록

**Target**: 파일 헤더 (line 3 + line 10 근처)

**Before**:
```
Revision: 0.9.2 (Iteration — v1.0 확정 전 내부 보완판 · PRD 역반영 완료)
```
**After**:
```
Revision: 1.0 (Baseline — Phase 2 구현 착수 가능)
```

그리고 `> **Owner**:` 라인 뒤에 Amendment Triggers blockquote 4항목 추가 (OQ-M6 · OQ-R17 · Supabase 500MB · Loops 1,500).

### 1.2 §1.2.1 In-Scope 서술 (line 36)

"GPT-4o-mini 기반 해외 영문 기사 한글 요약" → **"Gemini 1.5 Flash 기반 해외 영문 기사 한글 요약 (Provider 교체 가능, C-TEC-015)"**

### 1.3 §1.2.3 Assumptions CON-01 / CON-06

- **CON-01**: Loops 전환 트리거를 "Phase 6 에서 Resend" 단일에서 **"1,500 contacts 도달 시 Resend 전환 준비(DNS 인증 72h 여유) 착수 · Phase 5 후반 또는 Phase 6 전환"** 2단으로 확장.
- **CON-06**: OpenAI $5 cap 단일 → **Gemini 1.5 Flash 무료 티어 (분당 15 req · 일 1,500 req) 기본 + `TRANSLATION_PROVIDER=openai` 선택 시만 $5 cap 재활성화** provider-agnostic 서술로 전환.

### 1.4 §1.2.4 C-TEC-015 (Translation)

Rev 0.9.2 "`openai | gemini | anthropic` 3-adapter, MVP 기본 openai" → Rev 1.0 **"Gemini facade + Gemini 1.5 Flash 단일 어댑터, `openai` / `anthropic` 는 Phase 5.5+ OQ-R17 실측 결과에 따라 도입 (MVP 미구현 · env 지정 시 런타임 에러)"**.

### 1.5 §1.2.5 C-COST-002

"OpenAI GPT-4o-mini 월 비용 ≤ US$5" → **"번역 Provider 월 비용 — 기본 `gemini` = $0 (무료 티어) / `openai` 선택 시 ≤ US$5 재적용"**

### 1.6 §2 Stakeholders External — OpenAI 라인

"**External — OpenAI GPT-4o-mini** · 월 $5 비용 상한" → **"External — Gemini 1.5 Flash (MVP 기본 Provider, C-TEC-015) · 무료 티어 (분당 15 req / 일 1,500 req), Google Generative AI API"**

### 1.7 §4.1 REQ-FUNC-015 / REQ-FUNC-017

- **REQ-FUNC-015**: 제목 "Provider-Agnostic" → **"Gemini MVP · Provider-Agnostic facade"**, Verification 을 gemini adapter / gemini mock 중심으로 재작성.
- **REQ-FUNC-017**: 제목 "OpenAI 월 예산 상한 $5 enforcement" → **"번역 Provider 예산/쿼터 상한 enforcement"**, 로직을 provider 값에 따른 분기로 재작성.

### 1.8 §4.2 REQ-NF-011 / 014 / 120 / 122

- **REQ-NF-011**: 목표 값 뒤에 **"구현 방식: Loops List Send API 위임 (단일 호출, Loops 내부 큐). 위임 실패 시 폴백: 100명 chunk × 5분 간격 5회 분할 cron"** 추가. M2 모순 해소 근거.
- **REQ-NF-014**: "OpenAI GPT-4o-mini 번역 p95" → **"번역 Provider p95 응답 (MVP 기본 Gemini 1.5 Flash)"**
- **REQ-NF-120**: "OpenAI 월 비용 ≤ $5 / 월" → **"번역 Provider 월 비용 — MVP 기본 `gemini` = $0 / `openai` 선택 시 ≤ $5 / 월"**
- **REQ-NF-122**: "≤ 1,800 (2,000 대비 90%)" → **"알림 임계: 1,500 (75%) → Resend 전환 준비 착수 · 하드 상한: 1,800 (90%) → Resend 전환 완료"** 2단 임계.

### 1.9 §6.1.b External API 표

OpenAI endpoint 행 → **Gemini endpoint** `POST generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent` · 한도 "일 1,500 req 무료".

### 1.10 §6.8 환경 변수 참조

```diff
- | `OPENAI_API_KEY` | GPT-4o-mini 번역 | REQ-FUNC-015 |
- | `OPENAI_MONTHLY_BUDGET_CAP_USD` | 월 $5 상한 | REQ-FUNC-017, REQ-NF-120 |
+ | `TRANSLATION_PROVIDER` | 번역 Provider 선택 (`gemini` 기본 / `openai` `anthropic` Phase 5.5+) | C-TEC-015, REQ-FUNC-015 |
+ | `GOOGLE_GENERATIVE_AI_API_KEY` | Gemini 1.5 Flash 번역 (MVP 기본) | REQ-FUNC-015 |
+ | `OPENAI_API_KEY` | (Phase 5.5+ 옵션) `TRANSLATION_PROVIDER=openai` 선택 시 | REQ-FUNC-015 |
+ | `OPENAI_MONTHLY_BUDGET_CAP_USD` | `openai` 선택 시 월 $5 상한 | REQ-FUNC-017, REQ-NF-120 |
```

### 1.11 Changelog prepend Rev 1.0 entry

`## Changelog` 아래 Rev 0.9.2 항목 앞에 Rev 1.0 entry 삽입. 7개 변경 요약 + Known residue 3건 + 관련 보고서 3 파일 링크.

### 1.12 Approval 섹션

3개 역할(Product Owner · Requirements Engineer · Technical Lead) 모두 **"2026-04-18 · ✅ Rev 1.0 서명"** 으로 업데이트. "다음 단계" 문단도 "사용자 본인이 초안 검토" → "Phase 2 진입 가능 + Amendment Trigger 도달 시 Rev 1.1 신규 발행" 으로 전환.

---

## 2. Rev 1.1 Amendment 준비 (사전 가이드)

Rev 1.0 Amendment Triggers 4종 중 하나라도 도달하면 아래 절차로 Rev 1.1 Amendment 를 수행한다.

### 2.1 공통 절차

1. **본 plan 문서의 이 섹션 (§2.X)** 에서 해당 Trigger 의 변경 범위 템플릿 확인
2. **PRD 원본 (`docs/prd/*.md`)** 을 먼저 수정 (SRS-PRD 단방향 의존 원칙)
3. **SRS Rev 1.1** 작성 — 헤더 Rev 1.1 + Amendment 날짜 · 원인 · 관련 Trigger 기록
4. **`docs/srs/reviews/v1.0-vs-v1.1-diff.md`** 3관점 비교표 작성 (기술 스택 명확성 / MVP 가치전달 / 기타)
5. **Approval 섹션** 재서명

### 2.2 OQ-M6 (Loops §50 필드 주입 검증) Trigger

**조건**: Phase 5 진입 직전 Loops 실발송 테스트 결과 `(광고)` 접두어 · 원클릭 수신거부 · 발신자 정보 · 야간 차단 4항목 중 **1개라도 실패**.

**Amendment 범위**:
- **CON-01**: Loops 전환 → Resend + 자체 도메인 확정 (`arumcargo.com` 구매 결정 동반)
- **C-TEC-014**: "Loops.so Transactional 전용" → "**Resend + 자체 도메인**" 로 교체. 단, Loops 라이브러리 코드 삭제 전 `src/lib/email/loops.ts` 를 `resend.ts` 로 교체 가능한 facade 구조 유지.
- **REQ-FUNC-200 / 206 / 216**: Loops endpoint 호출 → Resend endpoint 호출로 교체. HMAC webhook 검증 로직 Resend webhook signature 로 교체.
- **REQ-NF-060 ~ 063** (§50 준수): 구현 책임이 Loops → Resend 이동. Acceptance Criteria 재작성.
- **ADR-001** Amendment: Status → "Superseded" + ADR-001-amendment-1 신규 발행.
- **환경 변수**: `LOOPS_API_KEY` / `LOOPS_WEBHOOK_SECRET` → `RESEND_API_KEY` / `RESEND_WEBHOOK_SECRET`. `.env.example` 업데이트.

### 2.3 OQ-R17 (해외 번역 Provider A/B) Trigger

**조건**: Phase 4 번역 실측 데이터로 Gemini 품질이 **수용 기준(한국어 비율 ≥50%, 카고 용어 괄호 병기, 오역 < 10%)** 에 미달.

**Amendment 범위**:
- **C-TEC-015**: 단일 어댑터(Gemini) → **이중/삼중 어댑터** 복원. `TRANSLATION_PROVIDER` env 에 `openai` / `anthropic` 실제 구현 추가.
- **C-COST-002**: 활성화된 Provider 에 따른 월 예산 섹션 재작성.
- **REQ-NF-120**: Provider 별 월 비용 목표 재기술.
- **의존성**: `@google/generative-ai` 외 `openai@4.x` 또는 `@anthropic-ai/sdk` 추가.
- **ADR-007** Amendment: Status → "Amended-R2" + 번역 Provider 실측 데이터 첨부.

### 2.4 Supabase 500MB 근접 Trigger

**조건**: Phase 5.5 진입 시 `flights_snapshots.raw jsonb` + `ingest_logs` + `news_articles` 누적 ≥ **400MB (80%)** 임박.

**Amendment 범위**:
- **CON-11 / C-COST-003 / REQ-NF-121**: Supabase 무료 500MB → Pro $25/mo + 8GB.
- 또는 대체 스키마: `flights_snapshots.raw` jsonb → 정규화 테이블 + 압축 + 90일 retention.
- **ADR (신규)**: Supabase Pro 전환 vs 대체 DB (Neon Free · PlanetScale 등) 비교.

### 2.5 Loops 1,500 contacts 도달 Trigger

**조건**: WAU 성장으로 Loops verified contacts ≥ 1,500 도달.

**Amendment 범위**:
- 1,500 도달 즉시: `ADR-001` review trigger fire → Resend 전환 준비 착수 (DNS 인증 · 도메인 구매 · 템플릿 이식).
- 1,800 도달 전까지: Dual-send 검증 기간 (Loops + Resend 병행 발송 테스트).
- 1,800 도달 시: Resend 전환 완료 → CON-01 / C-TEC-014 업데이트.
- 이 경우 OQ-M6 통과(Loops §50 주입 성공) 전제라도 **Resend 전환이 최종 상태**.

---

## 3. 본 Methodology 의 반복 사용

교육자료 "SRS 검토 및 보강" 5 이미지의 프레임은 **Rev 1.0 외에도 Rev 1.1 / Rev 2.0 등 차후 Amendment 에서 동일하게 적용**한다. 절차:

1. **이미지 4 난이도 검토 프롬프트 실행** — 파일 수정 전 채팅 응답으로 현 SRS 의 개발 난이도 · 시스템/비용 효율성 재검토
2. **이미지 1 PoC 3단 분류 적용** — 변경 영향권 REQ 에 대해 증명 필수/불가/Dummy 재분류
3. **이미지 2 기술 스택 재점검** — 외부 환경 변화(모델 퇴출·Vercel 정책 변경 등) 반영
4. **이미지 3 MVP 가치전달 훼손 체크** — 5대 Pain 매핑 표 갱신
5. **이미지 5 diff 보고서 작성** — 3관점 비교표 (기술 스택 명확성 / MVP 목표 · 가치전달 / 기타)

이 5단계를 준수하면 SRS 신뢰도가 Revision 간 단절 없이 유지된다.

---

## 4. 본 plan 의 후속 작업 (별도 세션에서 진행)

1. **CLAUDE.md §4 기술 스택 표** — LLM 기본 Provider 서술 "`openai`" → "`gemini`" 동기화 (1줄 수정)
2. **`docs/references/13-personas.md` 등 PRD 참조** — 간접 참조된 "OpenAI" / "GPT-4o-mini" 문자열 전수 검토 (읽기 전용 영향 파악)
3. **SRS Task 추출** — Rev 1.0 베이스라인 확정 후 PoC 3단 분류를 REQ-FUNC 101개 전수 적용하여 Phase 2~5 개발 Task 목록 작성

---

**End of Plan.**
