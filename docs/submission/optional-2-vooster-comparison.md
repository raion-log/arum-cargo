# Optional 2 — 시중 바이브코딩 업스트림 도구 PRD vs 우리 과정 PRD 비교

**제출자**: 아름 카고 (Arum Cargo, 구 RAION Aviation DX Hub) 프로젝트
**대상**: 본 과정 PRD (`docs/prd/*.md` v0.3, 9개 파일)
**작성일**: 2026-04-11

---

## 1. 비교 카테고리 정의

이 비교는 Cursor·v0.dev·Bolt·Lovable 같은 **"코드 실행 바이브코딩 도구"** 가 아니라, **"아이디어를 PRD로 뽑고 → Task로 쪼개서 → 코딩 도구에 MCP로 넘기는 업스트림(upstream) 도구"** 를 대상으로 한다. 대표 도구는 아래 2개다.

| 도구 | 접근 방식 | 출력물 | 실행 연결 |
|---|---|---|---|
| **[Vooster.ai](https://www.vooster.ai/ko)** | 질문 3~5개(핵심 기능/타겟·문제/MVP 범위)에 답 → AI PM 에이전트가 PRD·TRD·Task 문서 자동 생성 | PRD + TRD + Task 문서 | MCP로 Cursor 직접 연동 |
| **[Task Master](https://github.com/eyaltoledano/claude-task-master)** | 사용자가 `.taskmaster/docs/prd.txt` 직접 작성 → Claude가 `tasks.json` + `task_*.txt` 로 분해 | `tasks.json` + 개별 태스크 파일 | MCP로 Cursor/Windsurf/Roo 연동 |
| **CodeGuide·Databutton류** | 위저드 입력 → 템플릿 기반 PRD | 1~2페이지 PRD | 수동 복사 |

---

## 2. Vooster류 도구의 PRD 구조 (확인된 내용)

### 2.1 Vooster
공식 사이트([www.vooster.ai/ko](https://www.vooster.ai/ko))와 블로그 [바이브 코딩이란?](https://www.vooster.ai/ko/blog/what-is-vibe-coding), [바이브코딩 추천 툴 5가지](https://www.vooster.ai/ko/blog/top-5-vibe-coding-tools) 및 외부 리뷰([GPTers](https://www.gpters.org/dev/post/create-alzalsen-prd-vooster-BrgC1pY9ayXjGTE), [AI PICK](https://aipick.kr/ko/community/ai-tool/354)) 에 따르면:

- **입력**: "이 서비스의 핵심 기능은?" / "누가 쓸 건가요? 어떤 문제를 해결하나요?" / "MVP에는 어떤 기능만 담을 건가요?" 3~5개 질문
- **출력**: PRD / TRD / Task 3종 문서를 "뚝딱" 생성
- **포지셔닝**: "AI PM 에이전트 — 바이브코딩을 시작하는 가장 체계적인 방법"
- **실행 연결**: MCP로 Cursor에 직접 전달
- **구조**: 상세 섹션 구성은 공식적으로 공개되지 않음. 리뷰 글에서 "초안을 뚝딱 만들어준다" 수준으로만 기술됨

### 2.2 Task Master (오픈소스 — 실제 템플릿 확인 가능)

`assets/example_prd.txt` 의 섹션 구조가 공개되어 있다:

```
1. Overview                  — 문제·타겟·가치 (1~2단락)
2. Core Features             — 기능 나열 + 왜 중요한지 + 어떻게 작동하는지
3. User Experience           — 페르소나, 주요 흐름, UX 고려사항
4. Technical Architecture    — 시스템 구성, 데이터 모델, API, 인프라
5. Development Roadmap       — MVP, 향후 개선 (단계별)
6. Logical Dependency Chain  — 개발 순서
7. Risks and Mitigations
8. Appendix
```

→ **핵심 관찰**: Task Master는 Vooster보다 구조화되어 있지만 **여전히 단일 파일(`prd.txt`) 1개**이며, 총 8개 섹션·일반적으로 1~5페이지 분량이다.

---

## 3. 구조 비교표

| 차원 | Vooster / Task Master류 | 우리 과정 PRD (아름 카고 v0.3) |
|---|---|---|
| **파일 수** | 단일 파일 (prd.txt 1개) | **9개 파일** (`00-overview` + 01~07 도메인 챕터 + `99-quality-review`) |
| **상류 문서(Source of Truth)** | 없음 — 사용자가 답한 3~5개 질문이 곧 원천 | [`16-vps.md`](../references/16-vps.md) Value Proposition Sheet가 PRD 작성 *전에* 고정. 추가로 [`11-tam-sam-som`](../references/11-tam-sam-som.md) / [`13-personas`](../references/13-personas.md) / [`15-aos-dos-opportunity`](../references/15-aos-dos-opportunity.md) / [`09-news-sources`](../references/09-news-sources.md) 가 PRD의 근거가 됨 |
| **페르소나 해상도** | "User Experience" 섹션 안에 단락 서술. 이름·연차·하루 일과 없는 경우가 대부분 | **C1 이지훈** — 3년차 콘솔사 영업, 하루 일과(08:00 출근길 → 12:30 점심 → 18:30 퇴근), 정보 소비 채널(네이버 카페·LinkedIn·카고프레스), JTBD 4개, 이직 타이밍, 모바일 vs 데스크탑 비율까지 ([`13-personas.md`](../references/13-personas.md)) |
| **KPI / NSM 근거** | "Development Roadmap"에 일정만. North Star Metric 개념 자체가 템플릿에 없음 | **WAU 500 / 4주 유지율 ≥40%** + 각 지표에 외부 벤치마크 출처(Amplitude NSM Playbook / Reforge Growth Series / Morning Brew 2020 Axios 인터뷰 / Substack·Beehiiv 표준) 명시. 관리자 대시보드에서 런타임 툴팁으로 노출 |
| **Acceptance Criteria** | 자유서술 ("사용자가 X 할 수 있다") | **Given-When-Then** 3~5개/스토리. 테스트 재현 가능 ([`01`](../prd/01-a-side-academy-career.md), [`02`](../prd/02-i-side-information.md), [`05`](../prd/05-email-growth-loop.md)) |
| **NFR 수치** | 추상적 ("빠르게", "안정적으로") | Lighthouse ≥90, LCP ≤2.5s, 야간 발송 21-08 KST 블록, RLS 정책, Loops contacts 1,600 (80%) 경보 등 구체 수치 |
| **법적 준수** | 없음 (Risks 섹션에 한 줄 정도) | 정보통신망법 §50 체크리스트 — 더블 옵트인, `(광고)` 접두어, 원클릭 수신거부, 발신자 정보 ([`05`](../prd/05-email-growth-loop.md)) |
| **의사결정 기록 (ADR)** | 없음. 모델이 왜 그렇게 생성했는지 사후 추적 불가 | ADR-001~008, 특히 [`ADR-008 Cargo-First Pivot`](../references/ADR-008-pivot-to-cargo-first.md) 에 "왜 승무원을 버리고 카고로 갔는지" Context / Options / Decision / Consequences / Review Trigger 5필드 |
| **품질 검토 레이어** | 없음. 생성물 = 바로 산출물 | [`99-quality-review.md`](../prd/99-quality-review.md) — 10개 차원(Desirability·Viability·Feasibility·Measurability + 카고정합·페르소나·수익화 제거) 점수표, v0.2→v0.3에서 평균 88→96 |
| **미결 항목(Open Questions)** | 없음 | [`docs/open-questions.md`](../open-questions.md) — OQ-C1/C2/D1/R16~R20 등 "아직 결정 못 한 것"을 명시적으로 트래킹, 각 항목에 해결 시점 명시 |
| **버전 진화** | 세션마다 덮어쓰기. 이전 버전 유실 | 각 파일 Changelog + ADR로 "왜 바뀌었는지" 영구 기록 (v0.1 → v0.2 → v0.3 카고 피벗) |
| **실행 연결** | MCP로 Cursor에 자동 전달 | 사람이 Phase 단위 승인 게이트 통과 후 진입 ([`07-roadmap-milestones.md`](../prd/07-roadmap-milestones.md)) |

---

## 4. 공정한 양면 분석

### 4.1 Vooster류 도구가 잘하는 것

- **속도**: 질문 답변 → PRD·Task·Cursor 연결까지 수십 분. 우리 방식은 Phase 0~1에 수 일.
- **진입 장벽**: "VPS가 뭐예요?" "ADR이 뭐예요?" 같은 방법론 학습 없이 바로 PM 수준 산출물.
- **탐색적 MVP**: 아이디어 10개 중 뭐가 살지 모를 때 빠르게 프로토타입으로 찍어내기에 최적.
- **1인 개발자 친화**: Cursor까지 바로 연결되는 파이프라인이 이미 깔려 있어서 "기획서 쓰고 붙여넣기" 의 마찰이 없음.

### 4.2 우리 방식이 잘하는 것

- **피벗 복기 가능성**: 승무원→카고 피벗 같은 큰 의사결정이 [`ADR-008`](../references/ADR-008-pivot-to-cargo-first.md) 에 남아, 6개월 뒤 "그때 왜 이렇게 했지?"에 답할 수 있음. Vooster는 이전 세션이 덮어쓰여 불가능.
- **도메인 신뢰도**: 11년차 현직자가 C1 이지훈에게 에디터 Pick을 내놓기 위한 "무엇을 쓰지 말아야 하나(금지어 '종합'·'당신답게')" 까지 내려옴. Vooster가 생성한 일반적인 PRD로는 이 층이 안 내려옴.
- **법적 규제가 있는 도메인**: 정보통신망법 §50, 뉴스 저작권, 워크넷/사람인 ToS — 위반 시 실제 페널티가 있는 항목. Vooster 템플릿은 "법적 체크리스트" 섹션을 권장하지 않음.
- **장기 히스토리 누적**: Phase 5.5~7까지 5개 Phase 동안 의사결정이 쌓여야 하는 프로젝트. 1회성 MVP가 아님.
- **리뷰 트리거의 사전 정의**: "Loops contacts 1,600 도달 시 유료 전환 재검토", "WAU 500 미달 + 4주 유지율 <30% 시 NSM 재검토" 같은 **미래의 재검토 조건을 현재 고정**. Vooster류는 이 개념 자체가 없음.

---

## 5. 한 줄 차이

> **Vooster류의 PRD는 "AI 코딩 도구에 넘기기 위한 입력 프롬프트"** 에 가깝고,
> **우리 과정의 PRD는 "피벗과 재검토가 일어났을 때 되돌아가는 거버넌스 문서"** 다.
>
> 전자는 1파일이고 후자는 9파일이 서로를 참조한다. 전자는 빠르고 후자는 느리다. **사용자에게 신뢰도를 걸고 공개해야 할 서비스** (11년차 현직자가 익명으로 운영하는 아름 카고 같은 경우) 라면 후자의 오버헤드를 감수할 가치가 있고, **아이디어 탐색 단계의 개인 실험** 이라면 전자가 더 합리적이다.

---

## 6. 우리 PRD가 Vooster류에서 "빌려올 수 있는 것"

본 비교는 우위를 주장하려는 게 아니라 *상호보완*을 찾는 데 의의가 있다. Vooster류에서 우리가 벤치마크할 요소:

- **MCP 연결**: Task Master의 `tasks.json` 포맷은 우리가 Phase 2 진입 시 벤치마크할 수 있음. [`07-roadmap-milestones.md §3`](../prd/07-roadmap-milestones.md) 의 Phase 2 DoD를 Task Master 호환 `tasks.json` 으로 export하면 Cursor 연결이 즉시 가능해짐.
- **위저드식 진입**: 신규 팀원이 합류했을 때 VPS→PRD 체인 전체를 읽는 건 부담스러움. [`00-overview.md §1`](../prd/00-overview.md) 를 "3문항 요약 (핵심 기능 / 타겟·문제 / MVP 범위)" 포맷으로 병행 제공하면 Vooster식 속도감을 얻을 수 있음.
- **Task 자동 분해**: ADR-008 같은 큰 결정이 파생시키는 실제 작업(9파일 재작성)을 사람이 수동으로 나눴지만, Task Master 연동 시 이 부분도 자동화 가능.

---

## 7. 참고 자료

- [Vooster.ai 공식 한국어 페이지](https://www.vooster.ai/ko)
- [Vooster 블로그 — 바이브 코딩이란?](https://www.vooster.ai/ko/blog/what-is-vibe-coding)
- [Vooster 블로그 — 바이브코딩 추천 툴 5가지](https://www.vooster.ai/ko/blog/top-5-vibe-coding-tools)
- [Vooster AI로 알잘딱깔센 PRD 작성하기 (GPTers 리뷰)](https://www.gpters.org/dev/post/create-alzalsen-prd-vooster-BrgC1pY9ayXjGTE)
- [코딩 전에 기획서부터? Vooster가 다 해줌! (AI PICK 리뷰)](https://aipick.kr/ko/community/ai-tool/354)
- [Task Master: Claude를 사용한 PRD-to-Task 시스템 (PyTorchKR)](https://discuss.pytorch.kr/t/task-master-claude-ai-prd-to-task/7108)
- [Task Master GitHub 저장소](https://github.com/eyaltoledano/claude-task-master)
- 본 프로젝트 원본: [`docs/prd/`](../prd/) · [`docs/references/`](../references/) · [`CLAUDE.md`](../../CLAUDE.md)
