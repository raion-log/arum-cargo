# 아름 카고 (Arum Cargo) — 용어 사전 & 입문 가이드

> **버전**: v0.3 (Cargo-First Pivot — [ADR-008](./adr/ADR-008-pivot-to-cargo-first.md))
> 프로젝트(구 RAION Aviation DX Hub → 현 아름 카고)에 나오는 모든 줄임말·전문용어·프로젝트 고유 코드를 쉬운 말로 풀어놓은 사전.
> 처음 프로젝트를 보는 사람(또는 과거의 나)이 30분 안에 전체 흐름을 이해할 수 있게.
>
> 자매 문서: [10-aviation-glossary.md](./references/10-aviation-glossary.md) — 항공·물류 **전문 용어** 전용
> 이 파일은 **프로젝트 용어·줄임말 + 엔지니어링·기획 약어** 모음.

---

## 1. 이 프로젝트 한 줄 요약

**"한국 항공 화물 업계 현직자(콘솔사·포워더·항공사 화물 부서)를 위해 매일 아침 업계 뉴스 + 채용 공고를 11년차 현직자 시선으로 정리해주는 이메일·웹"** 만드는 프로젝트.

비유: **"항공 화물 업계 사람들만을 위한 출근길 5분 아침 신문"**

### 브랜드: 아름 카고 (Arum Cargo)

- **아름** = 한국어 "아름답다" = "나답다". 항공 화물 업계 안에서 **나답게** 일할 수 있는 공간.
- **카고** = Cargo, 화물. MVP는 화물에 집중. Phase 7 이후 "아름 (Arum)"으로 전체 항공 생태계로 확장.
- **(주)한아름종합물류(hanaleum.com)와 구분** 위해 "한" 접두어 제거하고 "아름 카고"로 분리.
- MVP 도메인: `arumcargo.vercel.app` (무료, Phase 5에서 운영)

---

## 2. A-Side / I-Side — v0.3 카고 재정의

> **v0.3 변경**: 기존 L-Side(물류·화물)는 별도 영역이 아니라 프로젝트 **전체**의 중심이 됨 (Cargo-First 피벗).

| 줄임말 | v0.3 의미 | 쉬운 설명 |
|---|---|---|
| **A-Side** | **화물 채용** (Academy → Cargo Career로 재정의) | 콘솔사·포워더·항공사 화물 부서 채용 + 큐레이션 + 신뢰도 점수 |
| **I-Side** | **화물 정보** (Information) | 국내외 항공 화물 뉴스 + 에디터 Pick (11년차 현직자 시선) + 운항(Phase 5.5) |

```
          아름 카고 (Arum Cargo)
          ┌──────────────┬──────────────┐
          │ A-Side       │ I-Side       │
          │ 카고 채용    │ 카고 정보     │
          └──────────────┴──────────────┘
                ↑                ↑
         C1 2~5년차        C1·C2·C3
         콘솔사 영업      출근길 5분 뉴스
         + B1 HR          + 에디터 Pick
         (Phase 5.5)
```

**MVP Phase 5에서 만드는 건**: 뉴스 다이제스트 + 채용 큐레이션 + 이메일 구독. **전부 카고 중심.**
**Phase 5.5 추가**: `/employers` + 운항 화면 + 기종 capacity.
**Phase 6~7**: 커뮤니티 (Remember 벤치마크) + 모바일 앱 + "아름" 브랜드 확장.

---

## 3. 비즈니스 모델 — "수익화 없음 · 자연 성장만" (v0.3)

> **v0.3 변경 ([ADR-008](./adr/ADR-008-pivot-to-cargo-first.md))**: 수익화 축(유료 구독·B2B SaaS·프리미엄·커미션)을 **전면 제거**. 성장 축만 남김.

```
[에디터 Pick 품질]  ← 11년차 현직자 시선이 유일한 Moat
        ↓
[입소문 + 유기적 성장]  ← 지금 목표 (WAU 500 → 8,000)
        ↓
[자연 광고 유입]  ← 제휴 항공사·학원·포워더가 먼저 연락 오는 구조
```

### 왜 수익화를 아예 뺐나

- **돈을 벌려는 순간 판단이 흐려진다**: 유료 전환을 목표로 두면 콘텐츠가 낚시성으로 변질. 현직자 시선의 순수성이 Moat인데 이게 망가짐.
- **버티컬 커뮤니티는 신뢰가 자산**: 화물 업계는 좁다. 한 번 "광고 같다"는 평판이 생기면 회복 불가.
- **성장 자체가 당분간 유일한 목표**: WAU 500 → 1,500 → 3,500 → 8,000 (Phase 5 → 7). 이게 되면 그 다음에 무엇을 할지는 그때 결정.
- **자연 유입 채널은 열려있음**: 구독자 숫자가 일정 이상 쌓이면 항공사·학원·포워더가 먼저 "제휴할 수 있나요?" 라고 연락 오는 구조. 이걸 기다림.

### North Star KPI — "WAU 500명" (Phase 5)

- **WAU (Weekly Active Subscribers)**: 지난 7일 내 이메일 오픈 또는 사이트 재방문한 verified 구독자 수
- 근거: Amplitude NSM Playbook · Reforge Growth Series · Morning Brew Axios 2020 인터뷰 · Substack/Beehiiv 표준
- 상세: [../references/16-vps.md](./references/16-vps.md) §3

---

## 4. 🎯 프로젝트 기획·관리 줄임말

| 줄임말 | 영어 풀네임 | 한글 이름 | 한마디로 |
|---|---|---|---|
| **PRD** | **P**roduct **R**equirements **D**ocument | 제품 요구사항 문서 | "뭘 만들지" 설명서 |
| **VPS** | **V**alue **P**roposition **S**heet | 가치 제안 시트 | "왜 만들지" 한 장 요약 |
| **ADR** | **A**rchitecture **D**ecision **R**ecord | 아키텍처 결정 기록 | "왜 이렇게 결정했지" 메모 |
| **MVP** | **M**inimum **V**iable **P**roduct | 최소 기능 제품 | "일단 이것만 먼저" |
| **KPI** | **K**ey **P**erformance **I**ndicator | 핵심 성과 지표 | "성공했는지 재는 숫자" |
| **North Star KPI** | — | 북극성 지표 | "가장 중요한 단 하나의 숫자" |
| **JTBD** | **J**obs **T**o **B**e **D**one | 해결하려는 일 | "사용자가 이 서비스로 하고 싶은 일" |
| **OKR** | **O**bjective & **K**ey **R**esult | 목표와 핵심 결과 | "이 목표를 이렇게 재겠다" (본 프로젝트엔 안 쓰임) |
| **MoSCoW** | **Mo**st·**S**hould·**Co**uld·**W**on't have | 꼭·하면좋음·해도됨·안함 | 4단계 우선순위 분류 |
| **DoD** | **D**efinition **o**f **D**one | 완료 기준 | "이걸 다 해야 끝난 거" 체크리스트 |
| **AC** | **A**cceptance **C**riteria | 수용 기준 | "이거 되면 통과" 검사 항목 |
| **G/W/T** | **G**iven / **W**hen / **T**hen | 이런상황/이러면/이렇게돼야 | AC 작성 포맷 |
| **OQ** | **O**pen **Q**uestion | 열린 질문 | "아직 결정 못한 것" (우리 프로젝트 용어) |
| **SSOT** | **S**ingle **S**ource **O**f **T**ruth | 단일 진실 소스 | "이 파일만 진실로 친다" 원칙 |

---

## 5. 🛠 기술·엔지니어링 줄임말

| 줄임말 | 영어 풀네임 | 한글 이름 | 한마디로 |
|---|---|---|---|
| **NFR** | **N**on-**F**unctional **R**equirements | 비기능 요구사항 | "기능 말고" 속도·보안·안정성 요구 |
| **SLO** | **S**ervice **L**evel **O**bjective | 서비스 수준 목표 | "99% 안 끊긴다" 같은 목표치 |
| **SLI** | **S**ervice **L**evel **I**ndicator | 서비스 수준 지표 | SLO를 재는 실제 측정값 |
| **SLA** | **S**ervice **L**evel **A**greement | 서비스 수준 협약 | 고객과의 법적 계약 (MVP엔 없음) |
| **RTO** | **R**ecovery **T**ime **O**bjective | 복구 시간 목표 | "망가지면 N시간 안에 복구" |
| **RPO** | **R**ecovery **P**oint **O**bjective | 복구 지점 목표 | "망가지면 N시간치 데이터는 잃어도 OK" |
| **RLS** | **R**ow **L**evel **S**ecurity | 행 단위 보안 | "내 데이터는 나만 볼 수 있게" DB 잠금 |
| **PITR** | **P**oint **I**n **T**ime **R**ecovery | 특정 시점 복구 | "어제 3시로 되돌리기" DB 기능 |
| **API** | **A**pplication **P**rogramming **I**nterface | 응용 프로그램 통로 | 다른 서비스랑 대화하는 창구 |
| **MCP** | **M**odel **C**ontext **P**rotocol | 모델 컨텍스트 프로토콜 | AI가 도구랑 대화하는 규칙 (Claude Code 관련) |
| **CRUD** | **C**reate/**R**ead/**U**pdate/**D**elete | 생성·읽기·수정·삭제 | DB 기본 4동작 |
| **CI** | **C**ontinuous **I**ntegration | 지속적 통합 | 코드 바뀔 때마다 자동 테스트 |
| **CD** | **C**ontinuous **D**eployment | 지속적 배포 | 통과하면 자동 배포 |
| **ISR** | **I**ncremental **S**tatic **R**egeneration | 점진적 정적 재생성 | Next.js 페이지 캐싱 방식 |
| **DX** | **D**igital e**X**perience / **D**eveloper e**X**perience | 디지털 경험 / 개발자 경험 | 프로젝트 이름 "Aviation DX Hub"에서 사용 |
| **DB** | **D**ata**b**ase | 데이터베이스 | 정보 저장 창고 |
| **ORM** | **O**bject **R**elational **M**apping | 객체 관계 매핑 | 코드로 DB 조작하는 도구 |
| **JWT** | **J**SON **W**eb **T**oken | 제이슨 웹 토큰 | 로그인 인증 티켓 형식 |
| **ENV** | **Env**ironment Variable | 환경 변수 | 비밀번호·API 키 저장 공간 |

---

## 6. 🎨 UI · 디자인 · 성능 줄임말

| 줄임말 | 영어 풀네임 | 한글 이름 | 한마디로 |
|---|---|---|---|
| **UI** | **U**ser **I**nterface | 사용자 인터페이스 | "눈에 보이는 화면" |
| **UX** | **U**ser e**X**perience | 사용자 경험 | "써보면 느끼는 기분" |
| **IA** | **I**nformation **A**rchitecture | 정보 구조 | "메뉴·페이지 배치" |
| **SEO** | **S**earch **E**ngine **O**ptimization | 검색엔진 최적화 | 구글에서 잘 나오게 하기 |
| **LCP** | **L**argest **C**ontentful **P**aint | 최대 요소 표시 시간 | 페이지의 큰 그림이 뜨는 속도 |
| **CLS** | **C**umulative **L**ayout **S**hift | 누적 레이아웃 이동 | 페이지가 덜컥덜컥 움직이는 정도 |
| **INP** | **I**nteraction to **N**ext **P**aint | 인터랙션 반응 시간 | 눌렀을 때 반응 속도 |
| **TTFB** | **T**ime **T**o **F**irst **B**yte | 첫 바이트까지 시간 | 서버가 첫 응답 보내는 속도 |
| **FCP** | **F**irst **C**ontentful **P**aint | 첫 콘텐츠 표시 시간 | 뭔가 처음 보이기 시작하는 시점 |
| **FOUT** | **F**lash **O**f **U**nstyled **T**ext | 폰트 적용 전 깜빡임 | 커스텀 폰트 로드 전 기본 폰트 보이는 순간 |
| **WCAG** | **W**eb **C**ontent **A**ccessibility **G**uidelines | 웹 접근성 지침 | "장애인도 쓸 수 있게" 국제 기준 |
| **CTA** | **C**all **T**o **A**ction | 행동 유도 문구 | "지금 구독하기" 같은 버튼 문구 |
| **CTR** | **C**lick **T**hrough **R**ate | 클릭률 | "100명 중 몇 명이 눌렀나" |
| **OG** | **O**pen **G**raph | 오픈 그래프 | SNS 공유 미리보기 규격 |
| **DAU** | **D**aily **A**ctive **U**sers | 일 활성 사용자 | "하루에 몇 명 왔나" |
| **MAU** | **M**onthly **A**ctive **U**sers | 월 활성 사용자 | "한 달에 몇 명 왔나" |

---

## 7. 📊 시장·사용자 분석 줄임말

| 줄임말 | 영어 풀네임 | 한글 이름 | 한마디로 |
|---|---|---|---|
| **TAM** | **T**otal **A**ddressable **M**arket | 전체 시장 규모 | "이 분야 전 세계 시장 크기" |
| **SAM** | **S**erviceable **A**ddressable **M**arket | 유효 시장 | "우리가 도달 가능한 범위" |
| **SOM** | **S**erviceable **O**btainable **M**arket | 획득 가능 시장 | "실제로 먹을 수 있는 크기" |
| **CJM** | **C**ustomer **J**ourney **M**ap | 고객 여정 지도 | "사용자가 처음부터 끝까지 겪는 흐름" |
| **AOS** | **A**rea **O**f **S**atisfaction | 만족 영역 | "이미 만족한 부분" |
| **DOS** | **D**egree **O**f **S**atisfaction (Opportunity) | 기회 점수 | "불만족할수록 기회가 큼" 점수화 |
| **KSF** | **K**ey **S**uccess **F**actor | 핵심 성공 요인 | "이거 있어야 성공함" |
| **BM** | **B**usiness **M**odel | 비즈니스 모델 | "어떻게 돈 벌 건지" |
| **B2C** | **B**usiness **t**o **C**onsumer | 기업→개인 | 일반 사용자 대상 서비스 |
| **B2B** | **B**usiness **t**o **B**usiness | 기업→기업 | 회사 대상 서비스 |
| **LTV** | **L**ife**t**ime **V**alue | 고객 생애 가치 | "한 명한테서 총 얼마 벌 수 있나" |
| **CAC** | **C**ustomer **A**cquisition **C**ost | 고객 획득 비용 | "한 명 모으는 데 얼마 드나" |
| **ICP** | **I**deal **C**ustomer **P**rofile | 이상적 고객상 | "딱 이런 사람한테 팔고 싶다" |

---

## 8. ✈️ 항공 화물 전문용어 (v0.3 카고 중심 확장)

더 상세한 버전: [10-aviation-glossary.md](./references/10-aviation-glossary.md)

### 8.1 일반 항공
| 줄임말 | 영어 풀네임 | 한글 이름 | 한마디로 |
|---|---|---|---|
| **KAC** | **K**orea **A**irports **C**orporation | 한국공항공사 | 김포·제주·김해 등 지방 공항 운영 |
| **IIAC** | **I**ncheon **I**nternational **A**irport **C**orporation | 인천국제공항공사 | 인천공항만 운영 |
| **LCC** | **L**ow **C**ost **C**arrier | 저비용 항공사 | 제주항공·티웨이·진에어 등 |
| **FSC** | **F**ull **S**ervice **C**arrier | 풀 서비스 항공사 | 대한항공·아시아나 |
| **ICAO** | **I**nternational **C**ivil **A**viation **O**rganization | 국제민간항공기구 | UN 산하 항공 국제기구 |
| **IATA** | **I**nternational **A**ir **T**ransport **A**ssociation | 국제항공운송협회 | 항공사 연합체 |
| **UBIKAIS** | Ubiquitous Korea Airport Information System | 유비쿼터스 공항 정보 시스템 | 국토부 운영 운항 정보 사이트 |
| **FR24** | **F**light**r**adar**24** | 플라이트레이더24 | 전 세계 실시간 비행 추적 사이트 |
| **Slot** | — | 운항 슬롯 | 공항 이착륙 시간대 권리 |

### 8.2 화물 전문 ⭐ (v0.3 신규)
| 용어 | 영어 | 한글 | 한마디로 |
|---|---|---|---|
| **AWB** | **A**ir **W**ay**b**ill | 항공화물운송장 | 화물 운송 계약서·추적 번호 |
| **Freighter** | — | 화물기 | 화물 전용 항공기 (예: B747F, B777F) |
| **PAX** | Passenger aircraft | 여객기 | 사람 + 하부 belly에 화물도 실림 |
| **Belly / Lower Deck** | — | 하부 화물칸 | 여객기 아래쪽 화물 공간. 전체 화물 물동량의 절반 이상 |
| **Main Deck** | — | 메인 데크 | 화물기 위쪽 층. 무거운 화물·대형 ULD 탑재 |
| **Combi** | Combination | 혼합기 | 여객 + 메인 데크 화물 동시 운영 기종 |
| **ULD** | **U**nit **L**oad **D**evice | 단위 적재 용기 | 표준화된 항공 화물 컨테이너·팔레트 |
| **AKE (LD-3)** | — | AKE 컨테이너 | 가장 흔한 소형 컨테이너. belly에 주로 들어감 |
| **PMC / PAG** | — | PMC·PAG 팔레트 | 메인 데크용 대형 팔레트 |
| **BAI** | **B**altic **A**ir Freight Index | 발틱 항공화물 지수 | 주간 항공화물 운임 지수 (유가 + 수요 반영) |
| **TAC Index** | **T**AC (Tradewise Air Cargo) Index | TAC 지수 | 주요 항로 항공화물 운임 벤치마크 |
| **Consolidator** | — | 콘솔사 | 여러 화주의 화물을 하나로 묶어 항공사에 예약하는 중간 사업자. 아름 카고 C1 소속 |
| **Forwarder** | Freight Forwarder | 포워더 (국제물류주선업) | 화주의 의뢰를 받아 항공사·콘솔사에 예약하는 업체. 판토스·CJ대한통운 등 |
| **3PL** | **T**hird-**P**arty **L**ogistics | 3자 물류 | 화주의 물류 기능을 통째로 대행하는 업체 |
| **Belly Cargo** | — | 벨리카고 | 여객기 하부에 적재된 화물 |
| **APM** | **A**ircraft **P**erformance **M**anual (aka ACM) | 항공기 성능 매뉴얼 | Airbus·Boeing이 무료 공개하는 기종 스펙 문서. capacity 시드 출처 |
| **ATPL** | **A**irline **T**ransport **P**ilot **L**icense | 운송용 조종사 자격 | 여객기 조종 면허 (카고 MVP와는 무관, 참고용) |
| **ADS-B** | **A**utomatic **D**ependent **S**urveillance-**B**roadcast | 자동종속감시방송 | 비행기 위치 자동 방송 시스템 |

---

## 9. 🔑 우리 프로젝트 고유 코드

### Pain 번호 (P01 ~ P14) — v0.3 카고 재추출
"항공 화물 업계 Pain 14개"를 번호로 추적.
상세: [15-aos-dos-opportunity.md](./references/15-aos-dos-opportunity.md)

| 코드 | 내용 | MVP Top 5? |
|---|---|---|
| **P04** 🥇 | 지인 추천 의존 이직 경로 (C1 + B1 양면 고통) | ✅ |
| **P01** | 업계 뉴스 단절 (카고프레스·Loadstar 파편) | ✅ |
| **P03** | 채용 파편·신뢰도 부재 (학원 광고 혼입) | ✅ |
| **P02** | 해외 카고 영문 자료 장벽 | ✅ |
| **P05** | "나만 모르는 불안" — 현직자 시선 부재 (Moat 핵심) | ✅ |
| P08 | B1 인재풀 부족 → Phase 5.5 `/employers` | Phase 5.5 |
| P10 | 기종별 capacity 정보 산재 → Phase 5.5 | Phase 5.5 |
| P11 | 운항 출도착 정보 불투명 → Phase 5.5 | Phase 5.5 |
| P12 | 실시간 운임 데이터 (TAC Index) → Phase 5.5 | Phase 5.5 |
| P13 | 화물 직군 커뮤니티 부재 → Phase 6 (Remember 벤치마크) | Phase 6 |
| P14 | 해외 진출 정보 부재 → Phase 6+ | Phase 6+ |

### 페르소나 (v0.3 — C1 핀포인트 중심)
핵심 사용자 가상 캐릭터 7명 (Core 3 + Adjacent 1 + B-side 1 + Non-user 2).
상세: [13-personas.md](./references/13-personas.md)

| 코드 | 이름 | 역할 |
|---|---|---|
| **C1** ⭐ | **이지훈** | **3년차 콘솔사 영업·오퍼 (핀포인트)** |
| C2 | 박서연 | 1년차 화물 신입 |
| C3 | 김태영 | 8년차 포워더 팀장 |
| A1 | 정하늘 | 한서대·인하대·한국항공대 4학년 |
| B1 | 최혜진 | 포워더 인사 담당 6년차 (Phase 5.5) |
| N1 | (비타겟) | 승무원 취준생 — 본 서비스 비대상 |
| N2 | (비타겟) | 항공 마니아 일반인 — 본 서비스 비대상 |

### User Story 번호 (US-*)
PRD에서 사용자 시나리오 추적용.

| 프리픽스 | 의미 | 사용 PRD |
|---|---|---|
| **US-A1~A3** | A-Side (채용) User Story | [01-a-side-academy-career.md](./prd/01-a-side-academy-career.md) |
| **US-I1~I4** | I-Side (정보) User Story | [02-i-side-information.md](./prd/02-i-side-information.md) |
| **US-E1~E2** | Email 구독 User Story | [05-email-growth-loop.md](./prd/05-email-growth-loop.md) |

### Decision 번호 (D1 ~ D8)
프로젝트 중 내린 핵심 결정 8개.
상세: `~/.claude/plans/snuggly-humming-adleman.md`

| 코드 | 내용 |
|---|---|
| **D1** | 이메일 발송 하루 1회 (밤 수집 → 아침 07시 발송) |
| **D2** | 뉴스 수집 2회/일 (밤·점심) |
| **D3** | 운항 데이터는 간단 테이블 + 딥링크 (실시간 맵 X) |
| **D4** | MVP에 Auth 없음 (토큰 기반만) |
| **D5** | 채용 공고 하이브리드 큐레이션 (자동 수집 → 수동 승인) |
| **D6** | Cron 하이브리드 (Vercel + GitHub Actions) |
| **D7** | 디자인은 Premium Animated · 오렌지 금지 · 블루 팔레트 |
| **D8** | 획득 채널 6종 (SNS·카페·갤·제휴·SEO·Instagram) |

### Open Question 카테고리 (OQ-*)
아직 결정 못한 질문들.
상세: [open-questions.md](./open-questions.md)

| 프리픽스 | 의미 | 예시 |
|---|---|---|
| **OQ-B** | **B**usiness (사업) | OQ-B3: 도메인 구매 결정 |
| **OQ-M** | **M**onetization/임플리멘테이션 | OQ-M1: LLM 선택, OQ-M6: Loops.so §50 준수 |
| **OQ-R** | **R**esearch (리서치) | OQ-R17: 번역 A/B 테스트 |

### ADR 번호 (ADR-001 ~ ADR-008)
핵심 기술·디자인·전략 결정 기록.
상세: [docs/adr/](./adr/)

| 코드 | 내용 |
|---|---|
| **ADR-001** | 이메일 서비스 = Loops.so (Resend 대신) |
| **ADR-002** | 운항 데이터 = KAC + IIAC (AviationStack 대신) |
| **ADR-003** | MVP 무인증 + 이메일 토큰 (D4) |
| **ADR-004** | 채용 큐레이션 하이브리드 (pending/approved/rejected) |
| **ADR-005** | Cron 하이브리드 (Vercel + GitHub Actions) |
| **ADR-006** | 디자인 방향 = Premium Animated (Lenis + GSAP + 3D Carousel) |
| **ADR-007** | 번역 엔진 = OpenAI GPT-4o-mini |
| **ADR-008** ⭐ | **Cargo-First 전략 피벗 (아름 카고)** |

### Phase (0 ~ 7) — v0.3 재정의

| Phase | 단계 | 상태 |
|---|---|---|
| **0** | 레퍼런스·자료 조사 | ✅ |
| **0.5** | 전략·사용자 분석 | ✅ |
| **0.7** | VPS + ADR 정제 | ✅ |
| **1** | **PRD v0.3 카고 피벗 전면 재작성** | 🔄 현재 |
| **2** | Next.js 셋업 + 디자인 시스템 | |
| **3** | UI + Mock 데이터 | |
| **4** | 외부 API 연동 (카고 뉴스/채용) | |
| **5** | Supabase + Loops.so + 이메일 구독 → **아름 카고 MVP 완성** 🏁 | |
| **5.5** | `/employers` + 운항 + 기종 capacity + 피드백 폼 | |
| **6** | 승진·이직 타임라인 + 익명 라운지 (Remember 벤치마크) | |
| **7** | 모바일 앱 + "아름" 브랜드 확장 | |

---

## 10. 📚 프로젝트 읽는 순서 가이드

### 🟢 Level 1 — "5분만에 감 잡기" (이 3개만)

1. **[CLAUDE.md](../CLAUDE.md)** — 프로젝트 기본 규칙
2. **[docs/prd/00-overview.md](./prd/00-overview.md)** — 전체 그림
3. **[docs/prd/07-roadmap-milestones.md](./prd/07-roadmap-milestones.md)** — 언제 뭐 할지

→ 이 3개만 읽어도 **"이 프로젝트 뭐하는 건지"는 다 이해됨.**

### 🟡 Level 2 — "왜 이런 결정을 했는지"

4. **[docs/references/15-aos-dos-opportunity.md](./references/15-aos-dos-opportunity.md)** — 14개 문제 중 Top 5 선정 근거
5. **[docs/references/13-personas.md](./references/13-personas.md)** — 사용자 5명 가상 캐릭터
6. **[docs/references/16-vps.md](./references/16-vps.md)** — "왜 만드는지" 한 장 요약
7. **[docs/prd/99-quality-review.md](./prd/99-quality-review.md)** — PRD 품질 점검 성적표

### 🔵 Level 3 — "실제로 뭘 만드는지 상세"

8. **[docs/prd/01-a-side-academy-career.md](./prd/01-a-side-academy-career.md)** — 채용 페이지
9. **[docs/prd/02-i-side-information.md](./prd/02-i-side-information.md)** — 뉴스·운항 페이지
10. **[docs/prd/06-ui-ux-spec.md](./prd/06-ui-ux-spec.md)** — 디자인·색·폰트

### 🟣 Level 4 — "엔지니어링 상세" (개발 시작할 때)

11. **[docs/prd/03-data-model.md](./prd/03-data-model.md)** — 데이터 저장 구조
12. **[docs/prd/04-api-integration.md](./prd/04-api-integration.md)** — 외부 서비스 연결
13. **[docs/prd/05-email-growth-loop.md](./prd/05-email-growth-loop.md)** — 이메일 시스템
14. **[docs/adr/](./adr/)** — 기술 결정 기록 7개

---

## 11. 자주 헷갈리는 것들 (FAQ)

### ❓ "왜 '아름 카고'인가? (v0.3 신규)"

**1. 왜 카고(화물)로 피벗했나?**
- 이 프로젝트의 창립자는 **11년차 항공 화물 현직자** (2015년 5월~, 한서대 항공교통물류학과 졸업).
- 기존 v0.2는 승무원·지상직·조종사 중심이었지만, 창립자의 실제 강점은 화물이고, 본인이 가장 잘 알고 신뢰도를 확보할 수 있는 영역이 화물.
- 익명으로 시작해도 **11년차 도메인 지식** 자체가 차별화.
- 상세: [ADR-008](./adr/ADR-008-pivot-to-cargo-first.md)

**2. 왜 "아름"인가?**
- 한국어 "아름답다" = "나답다". 항공 화물 업계 안에서 **나답게** 일할 수 있는 공간이 되었으면 좋겠다는 뜻.
- 카고(cargo)는 MVP 범위. 나중에 "아름"으로 전체 항공 생태계로 확장 (Phase 7).

**3. 한아름종합물류랑 같은 거야?**
- 아니다. **(주)한아름종합물류 (hanaleum.com)** 와는 전혀 무관.
- 브랜드 혼동을 피하기 위해 "한" 접두어를 빼고 "아름 카고"로 분리.
- 푸터에 법인 구분 명시 예정.

### ❓ "왜 승무원·지상직을 버렸어?"

- 버린 게 아니라 **비스코프**로 옮겼다 (Phase 7 "아름" 확장 시 재검토).
- 이유: 창립자의 실제 강점 영역이 아님 + 승무원·지상직 시장은 경쟁이 이미 치열함(학원·카페·공식 채용 페이지가 성숙) + 11년차 도메인 지식이 통하지 않음.
- 반면 **화물 버티컬은 100% 공백**이다. Loadstar 한글 요약, 카고프레스 큐레이션, 콘솔사 채용 통합 — 아무도 안 한다.

### ❓ "PRD랑 ADR이랑 VPS랑 뭐가 다른 거야?"

레고로 비유하면:

- **VPS** = "이 레고 세트가 왜 멋진지" 박스 표지 문구. *1장짜리 홍보.*
- **PRD** = "어떤 부품이 들어있고 어떻게 조립하는지" 설명서. *두꺼운 책.*
- **ADR** = "왜 빨간 블록 말고 파란 블록 썼는지" 메모. *결정할 때마다 한 장씩.*

### ❓ "Phase가 왜 이렇게 많아?"

한 번에 다 못 만드니까 나눠놓은 것:
- **Phase 0~1**: "만들기 전 계획" (숙제 계획표 짜기)
- **Phase 2~3**: "기본 모양 만들기" (뼈대 + 가짜 데이터로 화면)
- **Phase 4**: "진짜 데이터 연결" (외부 뉴스·채용 API)
- **Phase 5**: "이메일 자동화"
- **Phase 5+**: "사람들 모으기" (100명 목표)

### ❓ "v0.1 → v0.2는 뭐야?"

PRD의 **버전**. 책 1쇄·2쇄 같은 것.
- **v0.1** = 초안. 대충 써본 것.
- **v0.2** = 수정본. 품질 점검하고 더 엄격하게 다시 쓴 것.

이게 바로 과제에서 요구한 **"초안 + 수정본"**.

---

## Changelog

- **2026-04-11 v0.3**: Cargo-First Pivot 반영 ([ADR-008](./adr/ADR-008-pivot-to-cargo-first.md)). 프로젝트명 "아름 카고 (Arum Cargo)" 확정. §1 한 줄 요약 화물 중심, §2 A-Side/I-Side 카고 재정의(L-Side 별도 영역 삭제), §3 수익화 축 전면 제거 후 North Star WAU 중심으로 재작성, §8 화물 전문용어 (Freighter·Belly·ULD·AKE·PMC·BAI·TAC Index·Consolidator·Forwarder·3PL·APM) 신규, §9 Pain/페르소나 v0.3 업데이트 (C1 이지훈 핀포인트), ADR 목록 ADR-008 추가, Phase 5.5~7 명시, §11 FAQ에 "왜 아름 카고인가?" + "왜 승무원을 버렸나?" 추가.
- 2026-04-11 v0.1: 최초 작성 (승무원 중심). **v0.3에서 카고 피벗으로 대체됨.**
