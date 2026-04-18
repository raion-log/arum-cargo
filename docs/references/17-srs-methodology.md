# 17. PRD → SRS 전환 방법론 (Arum Cargo)

> **버전**: v0.1 · **최종 업데이트**: 2026-04-17 · **Owner**: Founder (사용자)
> **근거**: Spec-Driven Development 교육자료 (2026-04-17 첨부) + ISO/IEC/IEEE 29148:2018
> **목적**: 이 문서는 "왜 PRD만으로는 부족한가"에 대한 타당성과, PRD 9개 → SRS 로 확장할 때의 매핑 규칙을 고정한다. 앞으로 SRS 초안을 작성하거나 플랜을 짤 때 **이 문서를 최상위 컨텍스트로 사용**한다.

---

## 0. 요약 한 줄

> PRD는 "고객·시장에 가치를 전달하는 구조와 목표"를, SRS는 "시스템이 반드시 수행해야 할 동작·품질을 테스트 가능한 단위로 쪼갠 것"이다. **PRD만으로 AI 에이전트에게 개발을 맡기면 소프트웨어 레이어가 깜깜이 상태가 된다.**

---

## 1. 왜 SRS 인가? — 타당성 (교육자료 핵심)

PRD 이후에 굳이 SRS를 쓰는 이유는 세 가지로 정리된다. 핵심은 **"불확실성의 확실한 통제"**.

### 1.1 Business Logic — 투자 결정과 신뢰의 근거
- **외부적 목적 (사업비 확보)**: 정부 지원금·VC 투자 등 외부 자본 획득 시 필수 제출 자료. "설득의 도구."
- **내부적 목적 (리스크 관리)**: 자기 자본이라도, 1차 검증(시장성·수익성)을 통해 **막연한 기대가 아닌 데이터 기반 확신**으로 투자하기 위한 근거.

**아름 카고 적용**:
- 현재는 Founder 자기자본·시간 투자 수준. 그러나 Phase 5 WAU 500 돌파 시점에는 **제휴 문의·기관 상담**이 실제 발생하는 국면 (OQ-B3).
- 그때 "ADR-008 + PRD 9개 + SRS" 세트가 "이 프로젝트는 감이 아닌 구조 위에서 실행되고 있다"는 증빙이 된다.
- 따라서 외부 자본 유치가 당장 목표가 아니어도, **장래 옵션을 열어두기 위한 투자**로 SRS를 작성한다.

### 1.2 Governance & Execution — 관리 리스크의 최소화
- **책임 경영**: 계획 없이 진행 = 관리 리스크 방치. 상세 설계는 자원을 효율적으로 사용하겠다는 **약속이자 증거**.
- **의사결정의 정교화**: 비즈니스 실행자가 감이 아닌 탄탄한 근거 위에서 제품 방향 결정 → 시장 실패 확률을 낮춘다.

**아름 카고 적용**:
- 1인 운영 MVP라도 ADR + PRD + SRS 라인을 지키는 이유: **2년 뒤 미래의 본인(또는 최초 협업자)**이 "왜 Loops를 골랐는지 / 왜 Freighter 키워드를 제외했는지 / 왜 인스타 크롤링을 금지했는지"를 재구성할 수 있어야 함.
- 특히 규제·법적 제약(정보통신망법 §50 더블 옵트인, 비카고 직군 차단)은 NFR·Acceptance Criteria에 박혀 있지 않으면 **구현 단계에서 누락되기 쉽다**.

### 1.3 AI Orchestration — 에이전틱 개발의 핵심 동력
- **완벽한 컨텍스트 제공**: SRS를 통해 도출된 명확한 Task 단위(`REQ-FUNC-023` 같은 ID)는 AI와 소통할 때 모호함을 제거하는 **최상급 컨텍스트**.
- **작업의 엄밀성 확보**: 인류의 지식을 학습한 AI를 제대로 활용하려면, 각 단계의 작업을 엄밀하고 수준 높게 통제해야 하는데 그 유일한 수단이 **정교한 기획 문서**.

**아름 카고 적용**:
- 본 프로젝트는 **Claude Code 기반 에이전틱 개발**이 전제. "REQ-FUNC-023 구현해줘" 같은 재사용 가능한 단위 명령이 가능해지는 것이 SRS의 실질 가치.
- `Source` 컬럼이 PRD 앵커를 가리키고, `Verification` 컬럼이 테스트 전략을 명시하면 — AI가 구현 + 테스트 작성 + 수용 기준 검증까지 한 번에 처리할 수 있다.

### 결론: 왜 SRS를 하는가?

| 측면 | 결과물이 주는 것 |
|---|---|
| 자본 | 돈 쓸 이유를 만든다 (투자 유치·제휴 설득) |
| 프로세스 | 낭비 없는 실행 경로 확보 (리스크 관리·의사결정) |
| 기술 | AI가 실수를 최소화하는 **정확한 입력값** |

---

## 2. SRS 표준: ISO/IEC/IEEE 29148:2018

IEEE 830-1998은 폐기. 현행 표준은 **ISO/IEC/IEEE 29148:2018** (2011년 발행, 2018 개정). 핵심 차이:

| 항목 | IEEE 830-1998 (폐기) | ISO/IEC/IEEE 29148:2018 (사용 중) |
|---|---|---|
| 요구사항 ID | 필수 아님 | **모든 요구사항에 ID 부여 필수** |
| 추적성 | 명시 없음 | 요구사항↔설계↔검증 **명시적 추적성 요구** |
| 검증 방법 | 포괄적·짧음 | **Inspection / Test / Analysis / Demonstration** 명확 정의 |
| 승인 기준 | 없음 | **각 요구사항마다 Acceptance Criteria 필수** |
| 이해관계자 정의 | 별도 섹션 없음 | 역할과 책임 명확 정의 |
| 비기능 요구사항 | 제한적 언급 | 성능·보안·신뢰성 등 **품질 속성 상세 정의** |

**본 프로젝트는 29148:2018 양식을 따른다.** 무료 다운로드 링크: 29148-2018-ISOIECIEEE.pdf (교육자료 첨부 기준).

---

## 3. FR vs NFR — 두 축 구분

| 구분 | Functional Requirements (FR) | Non-Functional Requirements (NFR) |
|---|---|---|
| 질문 | 시스템이 **무엇을** 해야 하는가? | 시스템이 **얼마나 잘** 수행해야 하는가? |
| 예시 | "구독자는 이메일로 매일 다이제스트를 수신할 수 있어야 한다" | "p95 응답 1초 이내 / 가용성 99.9%" |
| ID 접두 | `REQ-FUNC-XXX` | `REQ-NF-XXX` |
| 검증 유형 | 주로 Test (unit/integration/E2E) | 주로 Analysis (부하·보안·감사로그) |

아름 카고의 **NFR 후보 (이미 PRD에 수치 존재)**:
- 다이제스트 크론 07:00 KST 발송 (정보통신망법 §50 야간 발송 금지)
- Loops.so 무료 티어 2,000 contacts 상한
- OpenAI 월 예산 $5 캡
- 가용성·응답시간은 PRD v0.3에서 수치화 누락 → SRS 작성 시 **보수적 기본값**(p95 2s / 가용성 99% MVP 기준) 제안하고 사용자 승인 받을 것.

---

## 4. PRD → SRS 매핑 표 (9개 섹션)

본 프로젝트 PRD 9개 (`docs/prd/00~07, 99`) → SRS 섹션 변환 규칙:

| PRD 섹션 | → SRS 섹션 | 매핑 요점 |
|---|---|---|
| **1. 개요·목표** (Purpose, Desired Outcome, North Star) | 1. Introduction + 4.2 NFR | "왜 필요?" → Purpose / "어디까지 책임?" → Scope / "어떤 지표?" → 측정가능한 것은 NFR로 이관 |
| **2. 사용자·페르소나** (C1 이지훈 등) | 2. Stakeholders + 1.3 Definitions | 페르소나는 스토리텔링 단위 → SRS에서는 **역할(Role) 단위**로 정리 (End User, Admin, Content Editor 등). JTBD·AOS·DOS 용어는 1.3 Definitions |
| **3. 사용자 스토리·AC** ("As a ... I want ...") | 4.1 Functional Requirements | Story → 요구사항의 **Source** (출처) / AC (Given·When·Then) → SRS의 **Acceptance Criteria / Verification** |
| **4. 기능 요구사항 F1~F6** | 4.1 Functional Requirements | F1(카고 뉴스) 같은 기능 모듈을 **1:N REQ-FUNC로 분해**. 예: F1 → REQ-FUNC-010 (키워드 ingest), 011 (dedup), 012 (번역). MSCW 우선순위 → SRS Priority 컬럼 그대로 매핑 |
| **5. NFR** (PRD §5 성능·가용성·보안·비용) | 4.2 Non-Functional Requirements | 숫자 그대로 ID만 부여. 예: `REQ-NF-001: OpenAI 월 비용 ≤ $5` |
| **6. 데이터·인터페이스** | 3. System Context + 6. Appendix | API 엔드포인트 목록 → 3절 / 외부 시스템(Naver, Loops, Supabase, OpenAI) → "External Systems" 표 / 엔티티(posts, jobs, subscribers) → Appendix 6.2 Data Model |
| **7. 범위·리스크·가정** | 1.2 Scope + Assumptions and Constraints | In: F1·F2·F4·F6 등 / Out: 모바일 앱·다국어 / 리스크는 제약사항·배경정보로 간단 언급 + 별도 Risk 문서 링크 |
| **8. 실험·롤아웃·측정** | Appendix 6.x Validation Plan (개요) | A/B·베타 채널은 그로스 문서 쪽. SRS에는 "검증 계획 개요"만. H1/H2 통과율 지표는 NFR과 연계 |
| **9. 근거 (Proof)** | References | 인터뷰·JTBD·TAM/SAM/SOM·AOS/DOS 분석 등은 `[REF-01]`, `[REF-02]` ID 부여하고 각 REQ의 `Source` 컬럼에 REF-XX 링크 |

---

## 5. REQ-FUNC 템플릿 (9개 필수 컬럼)

각 Functional Requirement은 아래 9컬럼 표로 관리:

| 컬럼 | 내용 | 예시 |
|---|---|---|
| **ID** | 네임스페이스 규칙 (§7 참조) | `REQ-FUNC-010` |
| **Title** | 한 줄 제목 | 카고 14 키워드 네이버 뉴스 ingest |
| **Source** | PRD 앵커 / F번호 / REF ID | `docs/prd/02-i-side-information.md#f1-카고-뉴스` / F1 / REF-09 |
| **Priority** | Must / Should / Could / Won't | Must Have |
| **Type** | Functional / Interface / Constraint | Functional |
| **Verification** | 검증 방법 (Test/Analysis/Inspection/Demo) | 1) unit test (키워드 파서) 2) integration test (Naver API mock) 3) E2E (실제 ingest cron) |
| **Acceptance Criteria** | Given/When/Then 요약 또는 AC-XXX-1 링크 | AC-010-1, AC-010-2, AC-010-3 |
| **Status** | Proposed / Approved / Implemented / Verified | Proposed |
| **Owner** | Role 단위 | Solo (Founder) |

---

## 6. Sequence Diagram — AI 에이전틱 개발의 필살기

여러 설계 문서 중 (UseCase / ERD / CLD / Component Diagram / Sequence Diagram) **Sequence Diagram이 AI 협업에서 가장 효과적**. 이유:
- 시간 순서 + 참여 액터 + 메시지 페이로드를 한 화면에 표현
- 평문 "Program Scenario 5~6단계" → 다이어그램 변환이 용이
- AI가 "3번 단계 구현해줘" 식으로 cherry-pick 가능

### SRS 내 배치 위치
- **3.4 인터랙션 시퀀스** — 핵심 기능, 간결한 5단계 버전
- **6.3 상세 인터랙션 모델** — alt 분기·failure path·internal check 포함 11단계 확장 버전

### 아름 카고 필수 Sequence Diagram 후보 (SRS 작성 시 이 5개는 반드시 포함)

1. **이메일 구독 플로우**: 구독 폼 → 더블 옵트인 메일 발송 → 확인 클릭 → 활성화 (정보통신망법 §50 준수 입증)
2. **매일 아침 카고 뉴스 파이프라인**: cron trigger → Naver API ingest → dedup → 해외 기사 GPT 번역 → DB insert → Loops digest 발송 (07:00 KST)
3. **관리자 로그인 (Magic Link)**: 이메일 입력 → Supabase magic link 발송 → 토큰 클릭 → `admin_users` 화이트리스트 검증 → 세션 생성
4. **에디터 Pick 반영**: 관리자 `/admin/pick` 작성 → 다음 다이제스트 본문에 삽입 → 구독자 수신
5. **비카고 직군 공고 차단**: 채용 ingest → `block_non_cargo_titles` DB 트리거 → "승무원|객실|조종사..." 매칭 시 raise exception → ingest 실패 로깅

### 작성 방식 (2단계)
1. **1단계 (초안 5단계)**: Program Scenario 평문으로 5~6단계 작성 → 기본 Sequence Diagram (Actor 간 메시지 흐름만)
2. **2단계 (확장 11단계)**: alt 분기 (성공/실패), internal check (잔액 확인 같은), external API 호출 파라미터까지 명시한 확장판

---

## 7. 본 프로젝트 적용 방침

### 7.1 디렉토리 구조
- **SRS 문서 위치**: `docs/srs/` (신규 생성 예정)
  - `00-overview.md` — Purpose / Scope / Definitions
  - `01-stakeholders.md` — End User(C1) / Admin(Founder) / External(Loops, Naver, Supabase) Role 정리
  - `02-system-context.md` — 3절 System Context + Interfaces + Sequence Diagram
  - `03-functional-requirements.md` — REQ-FUNC 전체 표
  - `04-non-functional-requirements.md` — REQ-NF 전체 표
  - `05-assumptions-constraints.md` — §50 / 2,000 contacts / $5 cap / 비카고 차단 등 제약
  - `06-appendix.md` — API Endpoint List, Data Model, Validation Plan, References (REF-XX)

### 7.2 ID 네임스페이스 규칙

| 범위 | 접두 | PRD 출처 |
|---|---|---|
| 카고 뉴스 ingest/렌더링 | `REQ-FUNC-0XX` | PRD 02 (I-Side) |
| 채용 (A-Side) | `REQ-FUNC-1XX` | PRD 01 |
| 이메일 성장 루프 | `REQ-FUNC-2XX` | PRD 05 |
| UI/UX (메인·/news·/employers·/about) | `REQ-FUNC-3XX` | PRD 06 |
| 관리자 대시보드·운영 | `REQ-FUNC-4XX` | PRD 07 Phase 5 |
| 데이터 모델·외부 API | `REQ-FUNC-5XX` | PRD 03, 04 |
| 성능·가용성·보안·법적 준수 | `REQ-NF-0XX` | PRD §5 전반 |
| References | `REF-0XX` | PRD §9 / docs/references/*.md |

### 7.3 Status 용어 (4단계)
1. **Proposed** — 초안 작성 완료, 사용자 승인 전
2. **Approved** — 사용자 승인 완료, 구현 대기
3. **Implemented** — 코드 반영 + 단위 테스트 통과
4. **Verified** — Acceptance Criteria 통과 확인 (E2E + 실제 환경 검증)

---

## 8. SRS 초안 작성 시 체크리스트 (future Claude를 위해)

- [ ] 모든 REQ-FUNC에 9개 컬럼이 채워져 있는가?
- [ ] `Source` 컬럼이 PRD 앵커 링크로 연결되어 있는가? (예: `docs/prd/02-i-side-information.md#f1-카고-뉴스`)
- [ ] NFR의 숫자 기준이 PRD §5 값과 **일치**하는가? (불일치 시 PRD가 진실. 차이 발견 시 사용자에게 보고)
- [ ] 핵심 5개 시나리오 (§6)에 Sequence Diagram 초안(최소 5단계)이 있는가?
- [ ] ADR-001~008에 대한 References 항목이 있는가?
- [ ] 다음 제약이 Assumptions and Constraints 섹션에 **명시적**으로 박혀 있는가?
  - 비카고 직군 차단 (`block_non_cargo_titles` 트리거 존재)
  - 정보통신망법 §50 (더블 옵트인, `(광고)` 접두어, 야간 금지, 수신거부)
  - Loops 2,000 contacts 무료 상한 + Phase 5 이후 Resend 폴백 조건
  - OpenAI 월 $5 예산 캡
  - 실명·회사명·학교명·직책 미노출 원칙
  - 인스타 크롤링 금지
- [ ] Priority 분포가 과도하지 않은가? (Must Have이 전체의 50% 넘으면 MVP 범위가 흐려짐 — 재검토)
- [ ] Verification에 "Inspection/Test/Analysis/Demonstration" 중 하나가 명시되어 있는가?

---

## Changelog

- **2026-04-17 v0.1**: 최초 작성. 2026-04-17 Spec-Driven Development 교육자료 + ISO/IEC/IEEE 29148:2018 기준으로 PRD → SRS 전환 방법론 고착화. 본 문서는 향후 `docs/srs/*` 작성 시 최상위 컨텍스트로 사용됨.
