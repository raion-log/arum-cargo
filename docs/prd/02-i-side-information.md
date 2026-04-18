# PRD 02 — I-Side (정보 대시보드 · 카고 뉴스 + 에디터 Pick)

> 아름 카고 I-Side: **항공 화물 업계 현직자가 매일 아침 정리해주는 뉴스 허브**.
> 앵커: [00-overview.md](./00-overview.md) · 데이터 모델: [03-data-model.md](./03-data-model.md) · API: [04-api-integration.md](./04-api-integration.md) · 원천: [16-vps.md](../references/16-vps.md)

**버전**: v0.3 · **관련 ADR**: [ADR-008 Cargo Pivot](../adr/ADR-008-pivot-to-cargo-first.md), [ADR-007 Translation GPT-4o-mini](../adr/ADR-007-translation-gpt-4o-mini.md), [ADR-006 Premium Animated](../adr/ADR-006-design-premium-animated.md), [ADR-002 Flight KAC+IIAC](../adr/ADR-002-flight-data-kac-iiac-over-aviationstack.md)

---

## 0. v0.3 요약 (Cargo Pivot)

- **스코프 전환**: 승무원·정비·기종 뉴스 중심 → **화물 70% + 큰 항공 뉴스 30%**. Phase 5 MVP는 카고 뉴스 + 에디터 Pick + 채용만.
- **차별화 축 재정의**: "통합 뉴스 뷰"(누구나 할 수 있음) → **"11년차 현직자가 매일 쓰는 에디터 Pick"** (누구도 못 함). P05 "현직자 시선 부재"가 공백 100% 영역.
- **운항/기종 섹션 → Phase 5.5로 전량 이동**: MVP는 뉴스 + 채용에만 집중. Phase 5.5 진입 시 `/flights` + `aircraft_capacity` 피드백 폼 추가.
- **담당 Pain 재매핑**: (v0.2) P05 통합 + P06 영문 → **(v0.3) P01 뉴스 큐레이션 + P02 해외 카고 번역 + P05 현직자 시선**.
- **페르소나 이동**: (v0.2) C3 이수진 / C4 최민호 / C5 정유리 → **(v0.3) C1 이지훈 (핀포인트) / C2 박서연 (1년차) / C3 김태영 (팀장)**.

---

## 1. 담당 Pain & 개선 목표 (Top 5 중 3개)

VPS §1 [16-vps.md](../references/16-vps.md), AOS/DOS [15-aos-dos-opportunity.md](../references/15-aos-dos-opportunity.md) §5 원천.

| Pain | 설명 | AOS/DOS | 실패 KPI (현행) | **개선 목표** | 담당 기능 |
|---|---|---|---|---|---|
| **P01** | 화물 뉴스 파편·큐레이션 부재 | 3.0 / **2.7** | 현직자 평균 3~5 채널(카고프레스·Loadstar·카톡 공유·네이버·링크드인), 월 누락 체감 50%+ | 채널 **1개**, 누락 체감 **≤ 15%**, 하루 5분 내 소화 | §3 `/news` 카드 피드 |
| **P02** | 해외 카고 뉴스 영문·시차 장벽 | 3.2 / **2.1** | 소화율 ~30% (Loadstar/Air Cargo News 영문), 응답자 70%+ "영어 버거움" | 소화율 **≥ 85%**, 한글 3줄 요약, 24시간 내 국내 전달 | §4 GPT-4o-mini 번역 파이프라인 |
| **P05** | 현직자 시선·맥락 부재 (100% 공백) | 3.2 / **2.1** | 기존 매체는 팩트만 전달, "이게 왜 중요한지"를 업계 시선으로 설명해주는 창구 없음 | **에디터 Pick** 태그 노출, 현직자 voice CTR **+15%p** vs 팩트-only (OQ-R16) | §5 에디터 Pick 시스템 |

근거: [15-aos-dos-opportunity.md](../references/15-aos-dos-opportunity.md) §5 Top 5 Pain, [16-vps.md §1](../references/16-vps.md), [16-vps.md §6 Differential](../references/16-vps.md).

**비고 (Pain 제외 근거)**:
- P03 채용 파편 → [01-a-side-academy-career.md](./01-a-side-academy-career.md) 담당.
- P04 지인 추천 의존 → 01 PRD + 공유 루프(05 PRD).

---

## 2. User Stories + Given-When-Then AC

JTBD 원천: [16-vps.md §2](../references/16-vps.md) J-01 ~ J-03.

### US-I1 (C1 이지훈 — 3년차 콘솔사 영업, J-01 앵커) ★ Primary

> "출근길 지하철 7:00 5분. 오늘 카고 업계에 뭐 터졌는지 5장만 딱 보고 싶다. 화물은 카고프레스·Loadstar 다 돌아다녀야 하는데 그게 지겹다. 누가 '야 오늘 이거 알아둬' 한 줄 찔러주면 좋겠다."

| # | 상태 | Given | When | Then |
|---|---|---|---|---|
| I1-1 | ✅ | 승인된 카고 뉴스 ≥ 5건 존재 (금일) | `/news` 진입 | 최신순 카드 5장 + 각 카드에 1줄 에디터 Pick 뱃지 (있을 시), LCP ≤ 2.5s |
| I1-2 | ✅ | 카테고리 `cargo-market` 선택 | 필터 적용 | URL `?cat=cargo-market` 동기화 + 서버 렌더 + 카테고리 색상 뱃지 |
| I1-3 | ✅ | 카드 클릭 | 원문 링크 클릭 | `/api/news/click/[id]` beacon + 새 탭 `noopener noreferrer` |
| I1-4 | ✅ | 카드 "에디터 Pick ✏️" 뱃지 | 뱃지 hover (desktop) / 탭 (mobile) | 현직자 voice 1~2문장 툴팁 즉시 노출 |
| I1-F1 | ❌ | 수집 전체 실패 (`ingest_logs.status='failed'`) | 사용자 `/news` 진입 | 직전 성공 스냅샷 + "마지막 업데이트 HH:MM" 배너. 절대 빈 화면 금지 |
| I1-F2 | ❌ | 네이버 API rate limit 초과 | cron 실행 | 지수 백오프(3회) + GitHub Actions job failure로 관리자 이메일 알림 |
| I1-F3 | ❌ | 카테고리 `{불명}` 값 | URL 조작 | 서버 zod 검증 실패 → 빈 필터 fallback, 정상 리스트 렌더 |
| I1-F4 | ❌ | 승무원·객실·조종사 키워드 포함 기사 수집 | ingest 필터링 | 자동 제외 (스코프 이탈 방지, §3.1 exclude list) |

### US-I2 (C2 박서연 — 1년차 신입, J-02)

> "어제 회의에서 'TAC Index 올랐다' 얘기 나왔는데 뭔 말인지 모르겠다. 기사 본문 중에 전문 용어 뜨면 호버만으로 뭔지 알려주면 좋겠다. 업계 입문 1년차한테는 용어 장벽이 젤 큼."

| # | 상태 | Given | When | Then |
|---|---|---|---|---|
| I2-1 | ✅ | 카드 본문에 `AWB`·`ULD`·`TAC Index` 등 전문 용어 등장 | 렌더 | `<AviationTerm term="AWB" />` 자동 래핑 (서버 측 파싱) + 밑줄 스타일 |
| I2-2 | ✅ | 용어 hover (desktop) / 탭 (mobile) | 툴팁 열림 | 영문 풀네임 + 한글 정의 + 1줄 예시. shadcn/ui `<Tooltip>` |
| I2-3 | ✅ | 용어 클릭 | `/glossary#awb` 이동 (Phase 1 후반) | 전체 용어집 페이지 앵커 스크롤 |
| I2-F1 | ❌ | DB에 없는 용어 (`HAL1234`) | 렌더 | 일반 텍스트로 렌더, 래핑 스킵 (오류 아님) |
| I2-F2 | ❌ | `prefers-reduced-motion` | 툴팁 전환 | 페이드 애니메이션 제거, 즉시 표시 |

### US-I3 (C3 김태영 — 8년차 포워더 팀장, J-03)

> "나는 하루 종일 본업이 바쁜데 업계 큰 흐름은 놓치면 안 된다. 일주일에 3~4번 퇴근길에 '이번주 주요 이슈' 수준으로 요약 훑고, 해외 소스(Loadstar·Air Cargo News UK)는 한글로 보고 싶다. 영어 읽을 시간 없음."

| # | 상태 | Given | When | Then |
|---|---|---|---|---|
| I3-1 | ✅ | 해외 영문 기사 ≥ 5건 수집 | GPT-4o-mini 파이프라인 실행 | 각 기사 `summary` 50~500자 한국어 (한국어 비율 ≥ 80%) + `is_translated=true` |
| I3-2 | ✅ | 번역 성공 기사 | `/news?lang=en` 필터 | 한글 요약 + 🌐 배지 + 원문 링크 표시 + 출처명 (Loadstar / Air Cargo News / FlightGlobal Cargo) |
| I3-3 | ✅ | 전문 용어 등장 | GPT 시스템 프롬프트 | `AWB (항공화물운송장)`, `ULD (단위탑재용기)`, `TAC Index (Baltic Air Freight Index)` 괄호 병기 |
| I3-4 | ✅ | 에디터 Pick 포함 카드 | 카드 노출 | 팀장 시선에서 "이건 우리 노선에 영향 있음/없음" 한 줄 추가 (OQ-R16) |
| I3-F1 | ❌ | OpenAI API 500/timeout | 번역 호출 | 재시도 2회 후 `is_translated=false`, `summary`=원문 제목만. 해당 카드는 "제목만" 배지로 표시 (사실 왜곡 금지) |
| I3-F2 | ❌ | `monthly_budget_cap` ($5) 초과 | 번역 호출 직전 | skip + `ingest_logs.notes='budget_exceeded'` 기록, 영문 제목만 저장 |
| I3-F3 | ❌ | zod 검증 실패 (길이·한국어 비율·환각 탐지) | 저장 전 | 결과 drop + fallback `is_translated=false` |

---

## 3. 뉴스 피드 (`/news`) — P01 해결

### 3.1 데이터 소스 ([09-news-sources.md v0.3 §1~§5](../references/09-news-sources.md))

**v0.3 핵심 교체**: 기존 승무원·대한항공 인사 중심 → 카고 전문 매체 중심.

| 소스 | 역할 | 호출 빈도 | 비고 |
|---|---|---|---|
| 네이버 뉴스 검색 API | 국내 카고 primary | 2회/일 (KST 06:00, 18:00, GitHub Actions) | 키워드 배치: `항공화물`·`항공운송`·`화물기`·`항공물류`·`포워더`·`콘솔사`·`AWB`·`국제물류`·`TAC Index`·`BAI`·`대한항공카고`·`아시아나카고` |
| 카고프레스 RSS | 국내 카고 매체 | 2회/일 | cargopress.kr (OQ-R3 RSS URL 확인) |
| CargoNews RSS | 국내 카고 매체 | 2회/일 | cargonews.co.kr |
| Forwarder KR RSS | 국내 카고 매체 | 2회/일 | OQ-R3 확인 |
| Air Cargo News KR RSS | 국내 카고 매체 | 2회/일 | — |
| Loadstar RSS ⭐ | 해외 primary | 2회/일 | `https://theloadstar.com/feed/` |
| Air Cargo News UK RSS ⭐ | 해외 primary | 2회/일 | `https://www.aircargonews.net/feed/` |
| FlightGlobal Cargo RSS | 해외 secondary | 2회/일 | `https://www.flightglobal.com/cargo/rss` (OQ-R3 확인) |
| IATA Cargo News | 해외 secondary | 주 1회 | 정책·규제 업데이트 |
| GPT-4o-mini | 해외 기사 한글 요약 | ingest 시 1회/article | ADR-007 |

**자동 제외 키워드 (Exclude List)**: `승무원` `객실` `지상직` `조종사` `부기장` `항공정비` → 스코프 이탈 방지. [09-news-sources.md v0.3 §7](../references/09-news-sources.md) 기준.

**큰 항공 뉴스 30% 할당량**: `big-aviation` 카테고리로 분리. 카테고리 배분: `cargo-market 25% + cargo-ops 20% + cargo-company 15% + cargo-policy 10% + airport-cargo 10% + big-aviation 30%`. 서버 사이드에서 일 배분 소프트 쿼터 적용.

### 3.2 카드 구성 (v0.3)

```
┌──────────────────────────────────────────────┐
│ [썸네일 이미지 (출처 서버 직접 링크)]          │
│                                               │
│ 🏷️ cargo-market  🏷️ 🌐 해외                  │
│                                               │
│ Asia-Europe air cargo rates climb 12% WoW    │
│ (한글 요약) 아시아-유럽 노선 항공화물 요율이 │
│ 전주 대비 12% 상승. TAC Index 3,420 기록...  │
│                                               │
│ ✏️ 에디터 Pick                                │
│ └ "이번 주 우리 포워더들 계약 재협상 타이밍   │
│    잡아야 할 숫자임. 크리스마스 성수기 전에   │
│    락인 걸어두는 게 유리."                   │
│                                               │
│ 📰 Loadstar  ⏰ 3h  [원문 ↗]                  │
└──────────────────────────────────────────────┘
```

필드 ([03-data-model.md](./03-data-model.md) `news_articles` 테이블):
- `title` (원문 제목 — 해외는 영문 유지)
- `summary` (2~3문장 — 국내는 원문 발췌, 해외는 GPT-4o-mini 생성 한글)
- `editor_pick` (nullable text, 1~2 문장 현직자 voice — §5 별도 시스템)
- `editor_pick_tone` (enum, `OBSERVATION` / `ACTION_ITEM` / `CONTEXT` / null)
- `thumbnail_url` (출처 서버 직접 링크, `next.config.js remotePatterns` 허용)
- `source_name` (Loadstar / Air Cargo News / 카고프레스 / ...)
- `source_url` (원문 외부 링크)
- `category` (enum: `cargo-market` `cargo-ops` `cargo-company` `cargo-policy` `airport-cargo` `big-aviation`)
- `tags[]` (보조 태그: `대한항공카고` `아시아나카고` `TAC Index` `BAI` `ULD` `Freighter` 등)
- `published_at` / `collected_at`
- `is_translated` (boolean)
- `original_language` (ko / en / ...)

### 3.3 필터 & 정렬

- **카테고리 탭** (단일 선택 + "전체"): `전체 / 시장 / 운영 / 회사 / 정책 / 공항 / 항공 일반`. URL `?cat=...` 동기화.
- **보조 태그 chip** (다중 선택): `?tags=TAC,대한항공카고`
- **정렬**: 최신순 (기본). 인기순은 Phase 5 후반 `news_clicks` 기반.
- **기간**: 오늘 / 7일 / 30일

### 3.4 법적 제약 ([CLAUDE.md §5.1](../../CLAUDE.md))

- **원문 본문 저장 금지**. `summary`는 최대 2~3문장.
- **출처명 필수 노출**. 카드 하단 + 상세 페이지 모두. 해외 매체도 동일.
- **썸네일 직접 링크** (원본 서버). 캐싱·다운로드 금지 (MVP).
- **에디터 Pick은 원문 요약의 연장이 아닌 독립 창작물**. 현직자 Opinion이므로 카드에 명확히 "✏️ 에디터 Pick" 레이블로 분리, 사실/의견 혼동 금지.
- **저작권 리스크** ([OQ-R4](../open-questions.md)): Loadstar / Air Cargo News UK의 RSS 전문 허용 여부 확인 필요. 기본값은 "제목 + 3문장 요약 + 링크" 공정이용 가정.

---

## 4. 해외 카고 뉴스 한글 요약 (LLM Provider-Agnostic · MVP 기본 OpenAI GPT-4o-mini) — P02 해결

> **2026-04-18 개정**: 이 섹션의 모든 LLM 호출은 `src/lib/api/translation/` facade + adapter 구조를 통과하며, `TRANSLATION_PROVIDER` 환경변수(`openai | gemini | anthropic`)로 런타임 교체 가능하다. MVP 기본값 `openai` (= `gpt-4o-mini`). 아래 예시 코드·비용 추정은 기본 Provider 기준이며, adapter 교체 시 system prompt·zod 스키마·환각 탐지는 동일 재사용한다. 근거: [ADR-007 Amendment](../adr/ADR-007-translation-gpt-4o-mini.md), [SRS C-TEC-015](../srs/SRS-001-arum-cargo.md).

### 4.1 파이프라인

```
[RSS 수집 (Loadstar · Air Cargo News UK · FlightGlobal Cargo)]
    ↓
[영문 본문 추출 (rss-parser content:encoded 또는 Readability)]
    ↓
[TRANSLATION_PROVIDER env 확인 → adapter 라우팅]
    ↓
[LLM 호출 (기본: gpt-4o-mini, temperature=0.2, max_tokens=500)]
  system: """너는 항공 화물 업계 전문 번역가다.
           아래 영문 기사를 한국어 3문장 이내로 요약해라.
           카고 전문 용어는 영어 원문을 괄호로 병기해라.
           예: AWB (항공화물운송장), ULD (단위탑재용기),
               TAC Index (Baltic Air Freight Index),
               belly cargo (여객기 하부 화물).
           사실만 요약. 과장·추측 금지."""
  user: {title + body}
    ↓
[응답 zod 검증]
  - 길이 50~500자
  - 한국어 비율 ≥ 80%
  - 환각 탐지 (원문에 없는 고유명사 거부)
    ↓
[저장] news_articles.summary, is_translated=true
```

### 4.2 비용 추정 (v0.3 카고 볼륨)

- GPT-4o-mini: input $0.15/1M tokens, output $0.60/1M tokens
- 기사당 평균: input 1,500 tokens + output 300 tokens ≈ **$0.0004**
- 하루 해외 카고 기사 10~20건 → 월 300~600건 × $0.0004 ≈ **월 $0.12 ~ $0.24**
- 월 예산 상한 $5 설정 ([04-api-integration.md](./04-api-integration.md) `monthly_budget_cap` 환경변수). 20배 여유.

### 4.3 품질 검증 (OQ-R16 연계)

- Phase 4 초기: 해외 기사 10건 수동 오역·과장 검수 → 오역 ≤ 1건 목표
- Phase 5 이후: 사용자 신고 버튼 ("번역이 이상해요") + Loops.so 트랜잭셔널 알림

---

## 5. 에디터 Pick (P05 해결) — **v0.3 신규 핵심 차별화**

### 5.1 왜 신규인가

[15-aos-dos-opportunity.md §5 Top 5](../references/15-aos-dos-opportunity.md) P05 "현직자 시선·맥락 부재"는 **공백 100%** 영역. 카고프레스·Loadstar는 팩트만, 네이버 카페는 잡담 수준. "11년차 현직자가 '이게 왜 중요한지' 한 줄로 찔러주는" 포맷은 업계 공백.

### 5.2 작성 원칙 (Voice Guide)

- **관점**: 11년차 항공 화물 영업·오퍼 현직자의 1인칭 voice. "내가 어제 현장에서 본 거로는..." "우리 쪽 창고에선..." 같은 디테일 허용.
- **톤**: 친근·직설. 이모지·꾸밈 최소. 업계 친구가 카톡 보내는 톤.
- **길이**: 1~2 문장. 최대 140자.
- **금지어**: `종합` `정리` `총망라` `핵심 요약` (매체 톤과 혼동). 대신 "이건" "우리 쪽" "지금" "이번 주" 같은 구체.
- **금지어**: "당신답게" "여러분" (강의 톤). 대신 "나답게" "우리".
- **3가지 tone 분류** (`editor_pick_tone`):
  - `OBSERVATION` — "이거 원래 이런 숫자 아니었는데"
  - `ACTION_ITEM` — "이번 주 이거 한 번 체크해두는 게 좋음"
  - `CONTEXT` — "왜 이 뉴스가 지금 터졌냐면"

### 5.3 운영 프로세스

- **적용 비율**: 수집된 카드 중 **50~70%**에 Pick 부착 (전부 X, 완성도 유지). 소프트 목표 60%.
- **작성자**: MVP는 사용자 본인 단독. Phase 6 커뮤니티 확장 시 검증된 기여자 확대.
- **작성 도구**: `/admin/news` 관리자 화면 인라인 에디터. 카드 승인과 동시에 Pick 입력. 승인 없이 게시 불가.
- **수정 이력**: `editor_pick_history` JSONB 배열에 수정본 저장, 공개 화면은 최신만 노출.

### 5.4 화면 렌더

- 카드 내부 Pick 섹션은 본문 summary와 **시각적으로 분리** (좌측 세로 바 + 살짝 들여쓴 배경).
- 뱃지 `✏️ 에디터 Pick` + tone 라벨(`관찰` / `체크 포인트` / `맥락`).
- Pick이 없는 카드는 해당 섹션 자체 비노출 (빈 div 금지).

### 5.5 품질 지표

- **작성률**: 주간 승인 카드 중 Pick 비율 ≥ 60%
- **CTR 향상**: Pick 있는 카드 vs 없는 카드 원문 클릭률 (OQ-R16 Phase 4 A/B)
- **사용자 체감**: 4주 구독자 설문 "에디터 Pick이 있어서 계속 읽는다" 긍정 ≥ 70%

---

## 6. 항공·카고 용어 툴팁 컴포넌트

[10-aviation-glossary.md](../references/10-aviation-glossary.md) 기반. 전역 재사용.

### 6.1 사용 예시

```tsx
<p>
  이번 주 <AviationTerm term="TAC Index" />가 3,420을 기록하며 <AviationTerm term="AWB" /> 발행량도 동반 증가했다.
  주요 원인은 <AviationTerm term="Belly Cargo" /> 회복세.
</p>
```

### 6.2 컴포넌트 시그니처

```tsx
// web/src/components/aviation-term.tsx
interface AviationTermProps {
  term: string;              // "AWB" / "ULD" / "TAC Index" / "Freighter" ...
  children?: React.ReactNode; // 커스텀 표시 텍스트 (기본: term)
}
```

- Desktop: mouse hover → shadcn/ui `<Tooltip>`
- Mobile: tap → `<Popover>` (iOS 더블탭 회피)
- 내용: 영문 풀네임 + 한글 정의 + 1줄 예시
- 데이터 소스: `aviation_glossary` 테이블 (Phase 5 초기 시드 50개, 카고 중심)
- 자동 래핑: 서버 측 렌더 시 기사 `summary` 텍스트에서 glossary 용어 매칭 → 자동 `<AviationTerm>` 래핑. 이스케이프 문자 처리 주의.

### 6.3 Phase 5 후반 `/glossary` 페이지

- 전체 용어 검색·카테고리 분류 (일반 항공 / 화물 전문)
- URL `/glossary#awb` 앵커 지원
- [docs/glossary.md v0.3 §8](../glossary.md) 8.2 카고 용어 50개 시드 기반

---

## 7. SEO (NewsArticle schema)

`/news/[slug]` 페이지에 구조화 데이터 주입:

```json
{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": "...",
  "datePublished": "...",
  "author": { "@type": "Organization", "name": "아름 카고" },
  "publisher": { "@type": "Organization", "name": "아름 카고 (Arum Cargo)" },
  "description": "...",
  "image": ["..."]
}
```

**주의**: Google News는 원문 출처를 우선 노출하므로 색인 경쟁력 제한적. 롱테일 카고 키워드 (`항공화물 요율 2026` `TAC Index 전망` `대한항공카고 채용`) 중심 SEO 기대.

---

## 8. 알려진 제약 · 위험

| 위험 | 완화 |
|---|---|
| 네이버 뉴스 API 25,000 req/일 한도 | 카고 키워드 12개 × 2회/일 = 24 req. 한도의 0.1% |
| 카고프레스/CargoNews RSS 접속 불안정 | 실패 시 다음 배치 재시도, `ingest_logs` 로깅, 실패율 상한 시 관리자 이메일 |
| GPT-4o-mini 응답 품질 편차 | 시스템 프롬프트 고정 + zod 검증 + 주간 수동 검수 |
| Loadstar/Air Cargo News 저작권 ([OQ-R4](../open-questions.md)) | "제목 + 3문장 요약 + 원문 링크" 고수, 본문 저장 금지. 에디터 Pick은 독립 창작. |
| 에디터 Pick 작성 지속성 (1인 운영) | 주간 최소 작성량 20~30 Pick. 실패 시 지연 공지 + 자동 발행 건너뜀 |
| 에디터 Pick 오류·오보 리스크 | 익명 운영이지만 현직자 voice이므로 사실 오류 즉시 정정. `editor_pick_history` 수정 이력 추적 |
| 승무원·조종사 키워드 유입 | exclude list + 카테고리 quota로 자동 차단 |

---

## 9. MoSCoW 우선순위

| 분류 | 기능 | 근거 |
|---|---|---|
| **Must** | `/news` 카드 그리드 + 카테고리 탭 + 태그 chip | P01 해결 필수 |
| **Must** | 네이버 뉴스 카고 키워드 + 국내 RSS 수집 (하루 2회) | 데이터 공급 |
| **Must** | 해외 RSS (Loadstar·Air Cargo News UK·FlightGlobal Cargo) + GPT-4o-mini 번역 | P02 해결 |
| **Must** | `is_translated` 플래그 + 실패 시 원문 제목 fallback | I3-F1 안전망 |
| **Must** | `monthly_budget_cap` ($5) 환경변수 + skip 로직 | ADR-007 비용 제어 |
| **Must** | zod 검증 (길이 50~500자, 한국어 비율 ≥ 80%) | 환각·오역 가드 |
| **Must** | **`editor_pick` 필드 + `/admin/news` 인라인 에디터** | **P05 해결 핵심 (v0.3 신규)** |
| **Must** | `editor_pick_tone` enum 3종 + tone 라벨 렌더 | 에디터 Pick 정체성 |
| **Must** | 승무원·조종사·정비 exclude 키워드 필터 | 스코프 이탈 방지 |
| **Must** | `<AviationTerm>` 컴포넌트 + 카고 용어 50개 시드 | C2 이해 장벽 |
| **Should** | `/news/[slug]` + NewsArticle schema (SEO) | 자연 유입 |
| **Should** | 썸네일 `next/image` `remotePatterns` 허용 도메인 | 성능·UX |
| **Should** | OQ-R16 에디터 Pick A/B feature flag | Phase 4 실험 |
| **Should** | 에디터 Pick 작성률 대시보드 카드 (관리자) | 주간 모니터링 |
| **Could** | 인기순 정렬 (`news_clicks` 기반) | Phase 5 후반 |
| **Could** | `/glossary` 검색 페이지 | Phase 5 후반 |
| **Won't (Phase 5)** | `/flights` 운항 테이블 | **Phase 5.5** §10으로 이동 |
| **Won't (Phase 5)** | 기종 capacity 뱃지·피드백 폼 | **Phase 5.5** §10으로 이동 |
| **Won't** | 실시간 운항 WebSocket / Three.js 맵 | Phase 6+ |
| **Won't** | 뉴스 원문 본문 저장 | 저작권 (CLAUDE.md §5.1) |
| **Won't** | 다국어(EN) 번역 역방향 | Phase 6+ |

---

## 10. Phase 5.5 섹션 (MVP 완성 후)

> v0.3에서 **운항/기종 전체를 Phase 5.5로 이동**. Phase 5 MVP 범위 아님. 여기는 설계 예약.

### 10.1 `/flights` 운항 요약 테이블 (Phase 5.5)

**원칙**: 간단 테이블 + UBIKAIS/FR24 딥링크. 3D 맵·WebGL 스트리밍 전부 Phase 6+ 유예.

**데이터 소스** ([09-news-sources.md v0.3 §6](../references/09-news-sources.md)):

| 소스 | 커버리지 | 호출 빈도 |
|---|---|---|
| 인천공항공사(IIAC) API | ICN 출도착 | 2회/일 |
| 한국공항공사(KAC) API | GMP·CJU·PUS·TAE·KWJ·CJJ·MWX | 2회/일 |
| UBIKAIS 딥링크 | 편명별 상세 | 클라이언트 URL 생성 |
| FlightRadar24 딥링크 | 편명·항적 | 클라이언트 URL 생성 |

**화면**:

```
/flights  (Phase 5.5)
┌──────────────────────────────────────────────────────────────┐
│ 공항: [ICN] [GMP] [PUS] ...                                   │
│ [오늘의 출발] [오늘의 도착]                                     │
│ □ 화물기만 (main deck freighter)  □ belly 포함                │
├──────────────────────────────────────────────────────────────┤
│ 편명    항공사    목적지  예정   실제  상태  기종 뱃지  링크    │
│ KE259   KE Cargo  ORD    14:30  14:32 정시  [B77F] 🟢  [↗][↗]│
│ OZ341   아시아나   HKG    15:10  15:45 지연  [B77W] 🔵  [↗][↗]│
│ 8K761   에어인천   TPE    16:00   —    취소  [B738] 🟡  [↗][↗]│
└──────────────────────────────────────────────────────────────┘
기종 뱃지 hover → 툴팁 "Boeing 777F · Freighter, max payload 102t"
```

**운송 성격 색상**:
- 🟢 `Freighter` (순수 화물기, main deck)
- 🔵 `PAX` (여객기, belly 화물 가능)
- 🟡 `Combi` (혼재)
- 필터 토글 "화물기만" → `deck_type = 'freighter'` 필터

### 10.2 `aircraft_capacity` 테이블 (Phase 5.5 2단계)

**1단계 (Phase 5.5 진입)**: 정적 TS 파일 `web/src/data/aircraft-types.ts`
- 주요 30개 기종 ICAO → 이름 · PAX/CGO/Combi 라벨만
- 배포 속도 우선. Supabase 테이블 불필요.

**2단계 (Phase 5.5 확장)**: Supabase 테이블 ([03-data-model.md](./03-data-model.md))

| 컬럼 | 타입 | 설명 |
|---|---|---|
| `icao_code` | PK text | `B77F`·`B77W`·`A332`·`B738` 등 |
| `model_name` | text | `Boeing 777F` |
| `deck_type` | enum | `passenger` / `freighter` / `combi` |
| `max_payload_kg` | int | 전체 최대 화물 중량 |
| `belly_kg` | int nullable | 여객기 하부 벨리 최대 (freighter는 null) |
| `main_deck_kg` | int nullable | 화물기 메인 데크 (passenger는 null) |
| `uld_capacity_json` | jsonb | `{"AKE": 32, "PMC": 0, "PAG": 6}` (IATA ULD 코드별 수량) |
| `source_url` | text | Airbus/Boeing APM 출처 URL |
| `notes` | text | 특이사항 (combi 구역 분할 등) |
| `updated_at` | timestamptz | 마지막 수정 |

**ULD 코드 표준**: IATA ULD Technical Manual — `AKE/LD-3`, `PMC`, `PAG`, `ALF`, `LD-6`, `ALP`, `LD-11` 등.

**시드 소스**: 사용자(11년차 현직자) 정리 자료 + Airbus APM + Boeing APM 교차 검증. OQ-D1 Phase 5.5 진입 전 마감.

### 10.3 `capacity_feedback` 피드백 폼 (Phase 5.5)

기종 데이터는 오류 가능성 존재 → 현직자 제보 창구 필요. 챗봇·LLM 없이 단순 form.

**테이블** ([03-data-model.md](./03-data-model.md)):

| 컬럼 | 타입 | 설명 |
|---|---|---|
| `id` | PK uuid | |
| `submitter_email` | text | 필수, 답신용 |
| `icao_code` | text | 어느 기종 |
| `field` | enum | `max_payload_kg` / `belly_kg` / `main_deck_kg` / `uld_capacity` / `notes` |
| `proposed_value` | text | 제안 값 |
| `reason` | text | 출처·근거 |
| `status` | enum | `pending` / `approved` / `rejected` |
| `created_at` | timestamptz | |

**화면**: 기종 뱃지 hover 툴팁 하단 "정보가 틀렸나요? 제보하기" 링크 → `/contribute` 또는 인라인 모달.

**제출 시**: Loops.so 트랜잭셔널 메일로 관리자 알림. 승인 시 `aircraft_capacity` 반영.

### 10.4 Phase 5.5 AC (예약)

| # | Given | When | Then |
|---|---|---|---|
| I5-1 | ICN 화물 스냅샷 존재 | `/flights?airport=ICN&tab=departures&cargo_only=true` | `deck_type='freighter'` + `combi` 필터된 테이블 렌더 |
| I5-2 | 기종 뱃지 `B77F` hover | - | "Boeing 777F · Freighter · max payload 102t" 툴팁 |
| I5-3 | 툴팁 "제보하기" 클릭 | 제출 폼 오픈 | 이메일·필드·값·근거 입력 + 제출 → 관리자 메일 수신 |
| I5-F1 | IIAC API 5xx | cron 실패 | 이전 스냅샷 유지 + "업데이트 지연" 배너 |

---

## 11. NFR / SLO

| 영역 | 지표 | 목표 (SLO) | 측정 |
|---|---|---|---|
| 가용성 | `/news` 5xx | ≤ 0.5% | Vercel Analytics |
| 응답시간 | `/news` p95 LCP | ≤ 2.5 s | Lighthouse CI |
| 수집 신선도 (뉴스) | lag (원문 발행 → 공개) | ≤ 6 h | `published_at` vs `created_at` |
| 번역 품질 | zod 검증 통과율 | ≥ 95% | `ingest_logs.notes` 집계 |
| 번역 비용 | 월 합계 | ≤ $5 | OpenAI usage + `monthly_budget_cap` |
| 번역 환각 | 수동 검수 10건 오역률 | ≤ 10% (Phase 4) | 관리자 검수 로그 |
| **에디터 Pick 작성률** | **주간 승인 카드 중 Pick 비율** | **≥ 60%** | `news_articles` 집계 |
| **에디터 Pick 지연** | **수집 ~ Pick 작성 lag** | **≤ 12 h (P90)** | `editor_pick_at - collected_at` |
| 카테고리 Quota 준수 | 카테고리별 일 배분 편차 | ≤ ±10%p | 일 집계 |
| 썸네일 | CLS | ≤ 0.1 | Lighthouse |
| 접근성 | `<AviationTerm>` 키보드 포커스 | 통과 | axe DevTools |
| 캐싱 | ISR `revalidate` (뉴스) | 300s | Next.js |
| 가용성 (Phase 5.5) | `/flights` 5xx | ≤ 0.5% | Vercel Analytics |
| 수집 신선도 (운항, Phase 5.5) | 스냅샷 갱신 | ≤ 6 h | `flights_snapshots.taken_at` |

**데이터 손실 허용**: 운항 스냅샷·뉴스 수집 쓰기 실패 시 이전 스냅샷 유지. 절대 null/빈 응답 금지.

---

## 12. Differential Value (수치)

| 차원 | 현행 (카고 업계 실제) | 아름 카고 목표 | 개선폭 |
|---|---|---|---|
| 카고 뉴스 채널 수 | 3~5 (카고프레스·Loadstar·카톡 공유·네이버·링크드인) | **1** (아름 카고) | **≥ 66% 감소** |
| 해외 카고 뉴스 소화율 | ~30% (영문 독해 장벽) | ≥ 85% (한글 3줄 요약) | **2.8배** |
| 월간 누락 체감 | 50%+ | ≤ 15% | **≥ 70% 감소** |
| 하루 소화 시간 | 15~25분 (여러 채널 순회) | ≤ 5분 (카드 5장) | **≥ 70% 단축** |
| **"이게 왜 중요한지" 맥락** | **없음 (팩트만)** | **에디터 Pick 60%+ 커버** | **공백 100% → 60%+** |

---

## 13. Proof (실험 설계)

| 주장 | 실험 | 성공 기준 | 시점 |
|---|---|---|---|
| "한글 요약 CTR ↑" (P02) | A(요약)/B(영문 제목만) 50/50, 4주, n≥50 | A 그룹 CTR ≥ +10%p | Phase 4 초반 |
| "에디터 Pick 효과" (OQ-R16, P05) | A(Pick 있음)/B(Pick 없음) 50/50, 4주, n≥100 | A 그룹 CTR ≥ +15%p · 체류 +20% · 재방문 +25% | Phase 4 중반 |
| "통합 뷰 → 시간 단축" (P01) | 베타 C1 5명 before/after 세션 녹화 | ≥ 70% 단축 | Phase 3 말 |
| "Core Web Vitals" | Lighthouse CI 주간 | LCP ≤ 2.5s, CLS ≤ 0.1, INP ≤ 200ms 연속 4주 | Phase 3~ |
| "번역 품질 수동 검수" | 해외 기사 10건 오역·과장 체크 | 오역 ≤ 1건 | Phase 4 초반 |
| "에디터 Pick voice 블라인드 테스트" (OQ-R16) | C1 5명에게 Pick 1줄만 보여주고 "도움됐는지" 평가 | 긍정 ≥ 70% | Phase 3 말 |
| "`<AviationTerm>` 체감" | 구독자 설문 n≥20 | 긍정 ≥ 70% | Phase 5 |

---

## 14. DoD (Phase 5 MVP)

- [ ] `/news` 카드 그리드 렌더 + 카테고리 탭 + 태그 chip + 기간 필터
- [ ] `/news/[slug]` 상세 페이지 + NewsArticle schema
- [ ] `news_articles` 테이블 (`editor_pick`·`editor_pick_tone`·`editor_pick_history` 포함) ([03-data-model.md](./03-data-model.md))
- [ ] `/api/cron/ingest-news` (네이버 + 국내 RSS + 해외 RSS + GPT-4o-mini) 구현 + GitHub Actions
- [ ] 승무원·조종사·정비 exclude 키워드 필터 동작
- [ ] 카테고리 quota 소프트 배분 로직
- [ ] `/admin/news` 관리자 인라인 에디터 (Pick 작성 + 승인)
- [ ] `<AviationTerm>` 컴포넌트 + 카고 용어 50개 시드 + 자동 래핑
- [ ] US-I1·I2·I3 AC 전체(성공 + 실패 케이스) 통과
- [ ] OQ-R16 에디터 Pick A/B feature flag 구현
- [ ] NFR SLO 11종 중 응답시간·수집 신선도·번역 비용·**에디터 Pick 작성률** 측정
- [ ] ADR-007·ADR-008 Verification 체크리스트 완료

**Phase 5.5 DoD** (별도):
- [ ] `/flights` 공항 탭 테이블 + UBIKAIS/FR24 딥링크
- [ ] `web/src/data/aircraft-types.ts` (30개 기종) 1단계 시드
- [ ] `aircraft_capacity` 테이블 + 2단계 Supabase 마이그레이션
- [ ] `capacity_feedback` 테이블 + `/contribute` 폼 + 관리자 알림
- [ ] I5-1·I5-2·I5-3 AC 통과
- [ ] ADR-002 Verification

---

## Changelog

- **2026-04-11 (v0.3)**: **Cargo Pivot 전면 재작성**. Pain 재매핑 (P05 통합·P06 영문 → P01 큐레이션·P02 해외 카고·**P05 현직자 시선 신규**). 페르소나 교체 (C3·C4·C5 → C1 이지훈·C2 박서연·C3 김태영). 데이터 소스 교체 (네이버 카고 키워드 + 카고프레스·CargoNews·Loadstar·Air Cargo News UK·FlightGlobal Cargo). **§5 에디터 Pick 시스템 신규** (v0.3 핵심 차별화, Voice Guide·Tone enum·관리자 워크플로·품질 지표). 승무원·조종사·정비 exclude 키워드 필터. `/flights` 운항 섹션·기종 capacity 섹션 전량 **Phase 5.5 §10으로 이동**. NFR에 에디터 Pick 작성률·지연 신규. Proof에 OQ-R16 에디터 Pick 블라인드 테스트. ADR-008 교차 참조.
- 2026-04-11 (v0.2): VPS→PRD 강화. Pain §1 수치화, G/W/T AC 실패 케이스 추가, MoSCoW·NFR·Differential·Proof.
- 2026-04-11 (v0.1): 최초 작성. P05·P06 매핑, US-I1~I4(C3·C4·C5), D3 간단 운항 테이블, GPT-4o-mini 번역, `<AviationTerm>`.
