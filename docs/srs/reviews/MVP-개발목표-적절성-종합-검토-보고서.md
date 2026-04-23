# MVP 개발목표 적절성 종합 검토 보고서

**대상 문서**: `docs/srs/SRS-001-arum-cargo.md` Rev 0.9.2 → Rev 1.0 승격 검토
**검토 프레임**: 첨부 교육자료 "SRS 도출 검토 및 보강" (2026-04-18, 5 이미지)
**검토 기준**: 개발 난이도(MVP 단계 적절성) · 기술 스택(복잡성·오픈소스) · 운영 소요 비용 + PoC 3단 분류
**검토자**: Claude (Requirements Engineer)
**승인자**: Arum Cargo Founder (Product Owner / Technical Lead 겸임)
**검토일**: 2026-04-18

---

## 0. Executive Summary

Rev 0.9.2 SRS는 **전반적으로 구현 가능**하나 **운영 비용 관점에서 3가지 하드 모순**과 **기술 스택 복잡성 1가지 오버헤드**가 발견되어 Rev 1.0 베이스라인 전 5건의 수정을 권고했고 모두 승인되어 반영되었다.

| 항목 | 판정 | Rev 1.0 조치 |
|---|---|---|
| 개발 난이도 | ✅ 적절 (Claude Code 에이전틱 개발 + 11년차 카고 현직자 프로필 일치) | 해당 없음 |
| 기술 스택 복잡성 | ⚠️ Provider-Agnostic 3-adapter 과함 | **Gemini 1종 단순화** (C-TEC-015) |
| 운영 비용 | 🔴 OpenAI $5 cap · Vercel 60s digest · Loops 2K cliff 3건 모순 | **Gemini $0 / Loops List Send / 1,500 Resend 트리거** |
| MVP 가치전달 훼손 | ❌ 없음 (5대 Pain 전부 보존) | 해당 없음 |

**결론**: Rev 0.9.2 → Rev 1.0 승격. Phase 2(Next.js 프로젝트 셋업) 진입 가능.

---

## 1. 사용자 프로필 적합성 (교육자료 이미지 4)

### 1.1 대상 프로필

| 축 | 값 |
|---|---|
| 도메인 배경 | 11년차 항공 화물 현직자 (AWB / ULD / TAC Index / 콘솔·포워더 영업 실무 전문가) |
| SW 개발 배경 | **"엔지니어링 지식을 투입하며 AI 생성 결과물을 개선할 수 있는 MVP 개발 작업"** (이미지 4 option 2) |
| 개발 모드 | Claude Code 에이전틱 개발 (Anthropic 공식 CLI) |
| 인프라 예산 | 완전 무료 티어 (C-COST-001 월 ₩100,000 상한) |

### 1.2 SRS 적절성 판정

| 영역 | 판정 | 근거 |
|---|---|---|
| Next.js 14 + Supabase + Tailwind + shadcn | ✅ | AI 코드 생성 친화적 · 문서 풍부 · 단일 배포 |
| Framer Motion + CSS 3D 애니메이션 | ✅ | 선언적 API · `useReducedMotion` 1줄 · ADR-006 review trigger 존재 |
| `supabase start` 로컬 DB | ✅ | prod/local 동일 Postgres → RLS·트리거 마이그레이션 버그 최소화 |
| Raw SQL 마이그레이션 | ✅ | `block_non_cargo_titles` 트리거 등 Postgres-specific 기능 명시 (Prisma 차단) |
| Provider-Agnostic LLM 3-adapter | ⚠️ **과함** | 어댑터 2개(openai/anthropic) 구현·테스트 오버헤드 · MVP에 불필요. **Gemini 1종으로 단순화** (Rev 1.0 반영) |
| Admin Research Copilot 4-provider (C-TEC-025) | ✅ | 이미 Phase 5.5+ 로 예약됨 · MVP 스코프 외 |

---

## 2. 기술 스택 비교 (교육자료 이미지 2)

### 2.1 교육자료 예시 vs 우리 C-TEC

| 항목 | 교육자료 예시 | 우리 C-TEC (Rev 0.9.2) | Rev 1.0 결정 |
|---|---|---|---|
| Next.js App Router 단일 | ✓ | C-TEC-001 ✓ | **일치, 유지** |
| Server Actions / Route Handlers | ✓ | C-TEC-007 ✓ | **일치, 유지** |
| Tailwind + shadcn/ui | ✓ | C-TEC-002 ✓ | **일치, 유지** |
| Vercel + Git Push 자동 배포 | ✓ | C-TEC-019 ✓ | **일치, 유지** |
| Vercel AI SDK | **사용** | **금지** | **발산 → 금지 유지**. 벤더 lock-in 회피 · 직접 SDK가 더 명확 (`OPENAI_MONTHLY_BUDGET_CAP_USD` 같은 세밀 제어·zod parse·`assertNoHallucination` 필요) |
| LLM 기본 Provider | **Gemini** | **OpenAI GPT-4o-mini** | **발산 → Gemini 전환**. 비용 모순 해소 (§3.3 참조) |
| 로컬 DB | **Prisma + SQLite** | `supabase start` (로컬 Postgres) | **발산 → Supabase 유지**. DDL/트리거/RLS가 prod와 동일 엔진이어야 마이그레이션 버그 0 |
| ORM | **Prisma** | **Raw SQL 마이그레이션** | **발산 → Raw SQL 유지**. `block_non_cargo_titles` 같은 Postgres-specific 트리거가 CON-05 / REQ-NF-067 이행의 핵심 |

### 2.2 발산 항목 요약 판정

교육자료는 **일반 예시**이며 본 프로젝트의 제약(법적 §50 / 비카고 차단 / 에디터 Pick Moat)은 더 엄격한 도구 선택을 요구한다. Vercel AI SDK 금지 / Raw SQL / 로컬 Supabase 발산은 **유지**하고, LLM Provider 발산만 **Gemini로 재정렬**한다 (비용 근거, §3.3).

---

## 3. 3대 검토 기준 (교육자료 이미지 1)

### 3.1 개발 난이도 (MVP 단계 적절성) — 적절 + 1건 단순화

| 영역 | 판정 | 조치 |
|---|---|---|
| 풀스택 Next.js + Supabase + Tailwind + shadcn | ✅ | 유지 |
| Framer Motion 애니메이션 (ADR-006) | ✅ | 유지 (review trigger "베타 30% 부정" 존재) |
| **Provider-Agnostic LLM (C-TEC-015)** | ⚠️ 과함 | **Gemini 어댑터 1종만 구현**, facade 구조 유지 |
| 하이브리드 크론 (Vercel + GHA) | ✅ | 유지 (ADR-002) |
| 관리자 shadcn/ui charts 8 카드 | ✅ | 유지 (C-TEC-006 단일화) |

### 3.2 기술 스택 복잡성·오픈소스 — 전부 무료/오픈소스

모든 레이어 무료 티어 또는 오픈소스로 커버. §3.1 Provider-Agnostic 단순화 외 별도 복잡성 리스크 없음.

### 3.3 운영 소요 비용 — **3가지 하드 모순 → 전부 해소**

| # | 모순 | Rev 0.9.2 상태 | Rev 1.0 해소 방안 |
|---|---|---|---|
| **M1** | OpenAI $5 cap vs 실제 ~$6–7 at 500 WAU (하루 15–20건 × $0.01) | C-COST-002 · CON-06 · REQ-NF-120 에 $5 하드 캡 | **Gemini 1.5 Flash 무료 티어로 기본값 교체**. 분당 15 req / 일 1,500 req — 하루 20건은 여유. `openai` 는 Phase 5.5+ 옵션. |
| **M2** | Vercel Hobby 60s 함수 타임아웃 vs daily-digest ≤55s @ 500 구독자 (수학적 불가) | REQ-NF-011 structural blocker | **Loops List Send API 위임**으로 단일 호출 → Loops 내부 큐 사용. 위임 실패 시 100명 chunk × 5회 분할 cron 폴백. REQ-NF-011 주석으로 명시. |
| **M3** | Loops 2,000 contacts vs WAU 500 + 공유 루프 확장 | CON-01 · REQ-NF-122 에 1,800(90%) 단일 임계만 | **1,500(75%) 알림 → Resend 전환 준비 착수 + 1,800(90%) 전환 완료** 2단 임계로 분리. DNS 인증 72h 여유 확보. |

### 3.4 월 비용 재계산 (Rev 1.0)

| 항목 | Rev 0.9.2 | Rev 1.0 |
|---|---|---|
| OpenAI | ≤ $5 (= ₩7,500) | $0 (Gemini 무료) |
| Supabase Free | $0 | $0 |
| Vercel Hobby | $0 | $0 |
| Loops Free | $0 (≤1,800 contacts) | $0 (≤1,500 contacts, 1,500~1,800 Resend prep 기간) |
| GitHub Actions | $0 (public repo unlimited) | $0 |
| **합계** | **₩7,500 / 월** | **₩0 / 월** |

C-COST-001 월 ₩100,000 상한 대비 사용률: **0%**.

---

## 4. PoC 3단 분류 (교육자료 이미지 1)

### 4.1 분류 기준 정의

| 기호 | 구분 | 기준 |
|---|---|---|
| ➕ | **현 단계 증명 필수** | MVP 5대 Pain 해결 검증 + 법적/규제 리스크 + Moat(차별화). 빠지면 제품 가치 부재 |
| ➖ | **현 단계 증명 불가** | Phase 5+ 운영·시장 데이터 확보 후에만 측정 가능. 코드로 증명 불가 → `docs/open-questions.md` 또는 Phase 5+ 운영 Task로 이관 |
| ⏭️ | **Dummy 대체 가능** | 외부 API·운영 데이터 없이 stub/fixture/콘솔 로그로 플로우 검증 가능. Phase 2~3에서 실 API 없이 진행 |

### 4.2 카테고리별 샘플 분류

| 카테고리 | ➕ 증명 필수 예시 | ➖ 증명 불가 예시 | ⏭️ Dummy 대체 예시 |
|---|---|---|---|
| **뉴스 ingest** | EXCLUDE_RE 필터 · Gemini zod parse 성공률 · dedupe_hash | 해외 기사 번역 품질 OQ-R17 결과 (운영 실측 필요) | Naver/RSS → JSON fixture 20건 · Gemini → 사전 번역 배열 |
| **채용** | `block_non_cargo_titles` 트리거 DB insert 차단 | 주간 신규 승인 공고 ≥20건 (운영 KPI) | 워크넷/사람인 → fixture · 신뢰도 점수 → 하드코딩 |
| **이메일** | 더블 옵트인 상태 전이 · (광고) 접두어 · 수신거부 렌더 | 오픈률 35% · CTR 8% · WAU 500 · 4주 유지율 40% | Loops 실발송 → 콘솔 로그 + HTML 파일 저장 (로컬 미리보기) |
| **법적 §50** | **OQ-M6 실발송 검증 (Phase 5 진입 블로커)** | — | 야간 차단 403 은 `/api/cron` 로컬 시간 조작으로 증명 가능 |
| **에디터 Pick** | 인라인 에디터 save · history 감사 로그 트리거 | 에디터 Pick 커버리지 ≥60% (4주 운영 후) | 샘플 5개 사용자 검수 (OQ-C2) |
| **관리자 대시보드** | Magic Link 화이트리스트 + middleware 차단 | KPI 카드 수치 정합성 (실 구독자 확보 후) | Vercel Analytics / Loops API → mock JSON · 카드 렌더만 확인 |
| **성능 NFR** | Lighthouse 모바일 80+ (Phase 3 mock 단계에서 증명 가능) | p95 TTFB ≤600ms 실측 (프로덕션 트래픽 필요) | k6 / locust 로컬 합성 부하 |

### 4.3 분류 적용 운영 규칙

- **개발 Task 작성 시**: ➕ 요구사항만 Phase 2~5 스코프 포함. ➖ 은 `docs/open-questions.md` 또는 Phase 5+ 운영 섹션으로 이관. ⏭️ 은 fixture / mock / stub 파일 경로를 Task 문서에 명시.
- **증명 불가 항목을 개발 Task와 섞지 않는다** — 개발 완료 판정이 모호해지기 때문.

---

## 5. MVP 가치전달 훼손 여부 (교육자료 이미지 3)

### 5.1 5대 Pain 재확인 후 Rev 1.0 수정안 영향

| Pain | 수정안 영향 | 훼손 여부 |
|---|---|---|
| **P04** 지인 추천 의존 이직 → 카고 채용 허브 | 없음 (ingest 파이프라인 그대로) | ❌ 없음 |
| **P01** 뉴스 파편화 | 없음 | ❌ 없음 |
| **P03** 채용 신뢰도 | 없음 | ❌ 없음 |
| **P02** 해외 영문 장벽 | Gemini 전환 → 한국어 번역 품질 재검증 필요 | ⚠️ Phase 4 OQ-R17 A/B 실험에 Gemini 샘플 포함 필수 |
| **P05** 에디터 Pick Moat | 없음 (C-TEC-016 "공개 콘텐츠에 LLM 산출물 직접 게시 금지" 원칙 유지) | ❌ 없음 |

### 5.2 결론

Rev 1.0 수정 5건 (Gemini 전환 · Loops List Send · Resend 조기 트리거 · REQ 레퍼런스 업데이트 · Amendment Triggers 선언) **전부 MVP 5대 Pain 가치전달에 훼손 없음**. 단 **P02 Gemini 번역 품질은 Phase 4 OQ-R17 A/B 실험 범위 확장 필수** (OpenAI 샘플 + Gemini 샘플 양쪽 수집).

---

## 6. Rev 1.0 반영 사항 (Before → After)

| 항목 | Rev 0.9.2 Before | Rev 1.0 After |
|---|---|---|
| Revision label | "0.9.2 (Iteration — v1.0 확정 전 내부 보완판)" | **"1.0 (Baseline — Phase 2 구현 착수 가능)"** |
| 헤더 Amendment Triggers | 없음 | OQ-M6 / OQ-R17 / Supabase 500MB / Loops 1,500 명시 |
| C-TEC-015 | Provider-Agnostic 3-adapter 기본 openai | **Gemini facade + Gemini 1.5 Flash 단일 어댑터**, openai/anthropic Phase 5.5+ |
| C-COST-002 | OpenAI 월 $5 cap (고정) | **gemini = $0 기본**, openai 선택 시 $5 cap 재적용 |
| CON-01 | Phase 6 Resend 전환 | **1,500 도달 시 Resend prep 착수** + Phase 5 후반 / Phase 6 전환 |
| CON-06 | OpenAI $5 초과 시 skip | **Gemini 일 1,500 req 무료 기본**, openai 선택 시 $5 cap 재활성화 |
| §1.2.1 Scope 서술 | "GPT-4o-mini 기반 해외 영문 기사 한글 요약" | "**Gemini 1.5 Flash 기반** ... (Provider 교체 가능, C-TEC-015)" |
| §2 Stakeholders External | "OpenAI GPT-4o-mini · 월 $5 비용 상한" | "**Gemini 1.5 Flash** (MVP 기본) · 무료 티어" |
| REQ-FUNC-015 | "MVP 기본 `openai` = `gpt-4o-mini`" | "**MVP 기본 `TRANSLATION_PROVIDER=gemini`**" |
| REQ-FUNC-017 | OpenAI 월 예산 상한 $5 enforcement | 번역 Provider 예산/쿼터 상한 enforcement (provider-agnostic 로직) |
| REQ-NF-011 | ≤ 55s (구조적 불가 at 500 WAU) | ≤ 55s per invocation + **Loops List Send API 위임 구현 방식 명시** |
| REQ-NF-014 | OpenAI GPT-4o-mini 번역 p95 | 번역 Provider p95 (MVP 기본 Gemini 1.5 Flash) |
| REQ-NF-120 | OpenAI ≤ $5 / 월 | **gemini = $0** / openai ≤ $5 / 월 |
| REQ-NF-122 | ≤ 1,800 (90%) 단일 임계 | **알림 1,500(75%) → Resend 준비 / 하드 1,800(90%) → Resend 완료** |
| §6.1.b External API 표 | OpenAI endpoint | **Gemini (MVP 기본) endpoint** `generativelanguage.googleapis.com/v1beta/...` |
| §6.8 환경 변수 | `OPENAI_API_KEY` · `OPENAI_MONTHLY_BUDGET_CAP_USD` | **`TRANSLATION_PROVIDER` + `GOOGLE_GENERATIVE_AI_API_KEY`** (MVP 필수) + 기존 OPENAI_* (Phase 5.5+ 옵션) |
| Changelog | Rev 0.9.2 항목 | **Rev 1.0 항목 prepend** (7개 변경 + Known residue + 링크) |
| Approval 섹션 | "Rev 0.9 검토 중 ⏳" | **"Rev 1.0 승인 2026-04-18"** (3개 서명) |

총 17개 수술적 편집 적용. 파일 구조·섹션 넘버링·diagram 순서 변경 없음.

---

## 7. Rev 1.1 로 이관한 Known Residue

| 항목 | 이유 | 해소 시점 |
|---|---|---|
| §3.1.a / §3.2 / §6.1 Mermaid diagrams 내 `OpenAI GPT-4o-mini` 라벨 일부 | 역사적 컨텍스트 · Phase 4 구현 시 실제 Provider 확정 후 전면 갱신이 효율적 | **Rev 1.0.1 or 1.1** (Phase 4 진입 시) |
| REQ 카운트 드리프트 (헤더 "69 REQ-FUNC · 67 REQ-NF" vs 실측 101 row · 99 row / 87 unique) | Rev 0.9.2 "PRD 역반영" 중 발생한 드리프트. 정합 cleanup 은 별도 세션 필요 | **Rev 1.1** cleanup 세션 |
| ADR-007 파일명 `ADR-007-translation-gpt-4o-mini.md` | 파일 rename 은 Git history 혼란 야기 · 내부 내용만 Amendment 대상 | Phase 4 진입 전 ADR Amendment |
| CLAUDE.md §4 기술 스택 표 LLM 기본값 | 현재 "Provider-Agnostic (`TRANSLATION_PROVIDER` env, MVP 기본 `openai`)" 서술 | 본 Rev 1.0 승격 직후 CLAUDE.md 동기화 (별도 PR) |

---

## 8. 방법론 준수 체크리스트 (교육자료 이미지 1~5)

- [x] **이미지 1 검토 기준 3종**: 개발 난이도·기술 스택·운영 비용 전부 적용 (§3)
- [x] **이미지 1 PoC 3단 분류**: 증명 필수 / 증명 불가 / Dummy 대체 분류 기준 정의 + 카테고리별 샘플 (§4)
- [x] **이미지 2 기술 스택 비교**: 교육자료 예시 vs 우리 SRS 발산 항목 표 작성 (§2)
- [x] **이미지 3 MVP 가치전달 훼손 검토**: 5대 Pain 매핑 표 (§5)
- [x] **이미지 4 난이도·구현 효율성 통합 검토**: 사용자 프로필 적합성 + 비용 효율성 + 개발 속도 관점 (§1, §3)
- [x] **이미지 4 "파일 수정 전 채팅 응답"**: 직전 사용자 세션에서 채팅 리뷰 선 완료 후 사용자 승인 획득 (D1~D6)
- [x] **이미지 5 Diff 보고서**: `reviews/v0.9.2-vs-v1.0-diff.md` 별도 파일로 작성 (3관점 표)

---

## 9. 다음 단계

1. **Phase 2 진입** — Next.js 14 프로젝트 셋업 (`web/` 디렉토리) · [PRD 07 §3](../../prd/07-roadmap-milestones.md)
2. **CLAUDE.md 동기화** — §4 기술 스택 표의 LLM Provider 서술 업데이트 (Provider-Agnostic → Gemini 기본)
3. **SRS REQ Status 전환** — Phase 2~5 진행 중 각 REQ Status 를 `Proposed → Implemented → Verified` 로 개별 전이
4. **Rev 1.1 Amendment 준비** — OQ-M6 (Phase 5 직전) · OQ-R17 (Phase 4) 실증 결과 수집 후 Amendment + `v1.0-vs-v1.1-diff.md`
5. **개발 Task 추출** — 본 Rev 1.0 베이스라인 기반으로 §4 PoC 3단 분류를 REQ-FUNC 전수 적용한 Task 목록 작성 (다음 세션)

---

**End of Report.**
