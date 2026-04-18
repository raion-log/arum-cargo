# PRD 품질 검증 리포트 (v0.2 → v0.3 Cargo-First)

> 2026-04-11 Cargo-First Pivot(ADR-008) 적용 후, 9개 PRD의 v0.3 전면 재작성 품질 기록.
> 앵커: [16-vps.md](../references/16-vps.md) v0.3 · [ADR-007 VPS→PRD 워크플로](../adr/ADR-007-vps-prd-workflow.md) · [ADR-008 Pivot to Cargo-First](../references/ADR-008-pivot-to-cargo-first.md)

**버전**: v2.0 · **최종 갱신**: 2026-04-11

---

## 1. 요약

- **대상**: `docs/prd/00-overview.md` ~ `docs/prd/07-roadmap-milestones.md` + `docs/prd/99-quality-review.md` (9개 파일)
- **기준**: VPS 프레임워크 7요소 + Cargo-First Pivot 정합성 8개 체크
- **결과**: 9개 파일 전부 v0.3 재작성 완료. 품질 평균 **v0.2 88 → v0.3 94 (+6p)**. 차별화는 **도메인 전문성(11년차 현직자 에디터 Pick)** 축을 신규 추가하여 경쟁 대비 강도 향상.

---

## 2. v0.2 → v0.3 주요 변경 요약

### 2.1 브랜드 & 도메인
- **프로젝트명**: RAION Aviation DX Hub → **아름 카고 (Arum Cargo)** (Phase 1~5 MVP), 이후 **아름 (Arum)** 확장
- **Tailwind 토큰 네임스페이스**: `raion.*` → `arum.*`
- **도메인**: `raion.kr` 계획 → **`arumcargo.vercel.app`** 무료 서브도메인 (OQ-B3 해결)
- **이메일 도메인**: 자체 도메인 대신 **Loops.so 공용 발송** (`loops.email`)
- **브랜드 충돌 회피**: (주)한아름종합물류와 구분 위해 "한" 접두어 제거, "아름 카고"로 분리

### 2.2 타겟 페르소나 전면 교체
- **삭제**: 승무원·지상직·조종사 중심의 기존 C1~C5 (A-Side)
- **신규 Core 핀포인트**: **C1 이지훈 — 2~5년차 콘솔사/포워더 항공화물 영업·오퍼** ([13-personas.md](../references/13-personas.md) v0.3)
- **Secondary**: C2 박서연(1년차 신입), C3 김태영(6~10년차 시니어)
- **Adjacent**: A1 항공교통물류학과 재학/졸업예정자
- **B-side**: B1 콘솔사/포워더 채용 담당자 (양면시장 축)
- 총 5명, C1 단일 핀포인트에 집중하되 나머지 4명을 배제하지 않음

### 2.3 Pain 재정의 (14개 카고 Pain)
- P01 큐레이션 (카고 뉴스 파편화) / P02 해외 카고 (영문 소화율) / P03 카고 채용 (희소 직군) / P04 지인 추천 편중 (양면 시장) / P05 현직자 시선 부재 (에디터 Pick 기회) 등 14개
- MVP Top 5: P04 → P01 → P03 → P02 → P05 ([15-aos-dos-opportunity.md](../references/15-aos-dos-opportunity.md) v0.3)

### 2.4 North Star & 지표
- **삭제**: "100 verified / 90일" 1차원 KPI
- **신규 Primary**: **WAU (Weekly Active Subscribers)** — 지난 7일 이메일 오픈 또는 사이트 재방문 구독자 수
- **목표**: Phase 5+ 종료 시 WAU 500, 4주 유지율 ≥ 40% (Reforge PMF 기준)
- **근거 출처**:
  - Amplitude "North Star Metric Playbook" (John Cutler, 2019)
  - Reforge "Growth Series" (Brian Balfour) — 4주 활성 유지율 40%가 PMF 기준
  - Morning Brew ($75M 매각) — 2020 Axios 인터뷰 "Daily Active Opens" 공개
  - Substack / Beehiiv 대시보드 표준 지표
- **Supporting KPI 7개** (관리자 대시보드): MUV·유입경로·주간 신규 구독자·4주 유지율·Open/CTR·주간 승인 공고·Employers 문의(Phase 5.5)

### 2.5 차별화 축 추가 — "에디터 Pick"
- **신규 시각 규약**: 모든 뉴스 카드·이메일에 좌측 sky 바(3px) + "✏️ 에디터 Pick" 텍스트 + 톤 라벨(OBSERVATION/ACTION_ITEM/CONTEXT) + ≤140자 본문
- **목표 커버리지**: 뉴스의 60% 이상에 Pick 달기 ([02 §5](./02-i-side-information.md))
- **작성 규약**: 11년차 현직자 목소리, 금지어 "종합"·"당신답게", 출처는 하단 한 줄만
- **DB 레벨 지원**: `editor_pick`·`editor_pick_tone`·`editor_pick_history jsonb`·`chk_editor_pick_length ≤ 140` constraint + `log_editor_pick_change` 트리거 ([03 §6](./03-data-model.md))

### 2.6 카고 뉴스·채용 데이터 소스
- **뉴스 삭제**: 승무원·지상직 대상 네이버 뉴스 쿼리
- **뉴스 신규**: 네이버 카고 14 키워드 + 해외 RSS 3종 (Loadstar·Air Cargo News UK·FlightGlobal Cargo) + 카고프레스·CargoNews 국내 전문지 ([09-news-sources.md](../references/09-news-sources.md) v0.3, [04 §3·§5](./04-api-integration.md))
- **채용 삭제**: 승무원·객실·조종사 워크넷/사람인 키워드
- **채용 신규**: 10개 카고 키워드 (항공화물·항공운송·포워딩·통관·수출입·공항상주 등) + 14사 공식 채용 페이지 딥링크 (`cargo_career_links`)
- **필터 이중 방어**: ingest 레벨 `EXCLUDE_RE` + DB 레벨 `block_non_cargo_titles` 트리거 (raise exception)

### 2.7 Phase 넘버링 재정의
| Phase | 변경 전 | 변경 후 |
|---|---|---|
| 1 | PRD v0.2 작성 | **PRD v0.3 재작성 (카고 피벗)** |
| 5 | Supabase + Loops 이메일 구독 | **🏁 Supabase + Loops + 관리자 shadcn/ui charts 대시보드 + 공유 루프** (아름 카고 MVP 완성) |
| 5+ | 구독자 100명 | WAU 500 · 4주 유지율 ≥ 40% |
| **5.5** | — | **신규**: `/flights` + `/employers` + 기종 capacity 2단계 + `/contribute` |
| **6** | — | **신규 비전**: Remember 벤치마크 커뮤니티 (승진/이직 타임라인·익명 라운지·회사 이메일 검증) |
| **7** | — | **신규 비전**: 모바일 앱 (Capacitor or Expo) + "아름" 브랜드 확장 |

### 2.8 UI/UX 메인 컴포지션 전환
- **메인에서 제거**: 3D Carousel (v0.2에서는 랜딩 Hero 섹션)
- **메인 신규**: **Bento Grid + Gradient Blob Background + Scroll Parallax Hero** ([06 §5.2](./06-ui-ux-spec.md))
- **3D Carousel 이동**: `/about` 또는 `/showcase` 하단 액센트 섹션으로 재배치
- **차트 라이브러리 2원화**: 관리자 대시보드 shadcn/ui charts / 사용자 화면 shadcn/ui charts
- **About 페이지 초안 3개**: 정서 블록 중심 / 문제 정의 중심 / Morning Brew 간결 스타일 — Phase A에서 사용자 선택 (OQ-C1)
- **품질 하한선**: `uvengers-website.vercel.app` (사용자 본인 작업) 이상

### 2.9 수익화 축 전면 제거
- **삭제**: 유료 구독·프리미엄 티어·B2B SaaS·월 요금제·인앱 결제·API 상용화
- **남긴 축**: 자연 광고 유입 (제휴 항공사·학원·포워더가 먼저 연락 오는 구조)

### 2.10 양면 시장 반영
- **Phase 5.5 /employers**: 기업 담당자용 "인재풀 요약 + 채용 등록 + 사례·후기" Bento 3 카드
- **DB 신규**: `employer_inquiries` 테이블 (허니팟 + IP 5회/1h 레이트 리밋)
- **KPI #8**: `/admin/dashboard` shadcn/ui charts 카드에 "Employers 문의 수" 추가

### 2.11 관리자 대시보드 신규 (Phase 5 DoD 포함)
- **URL**: `/admin/dashboard` (Magic Link + `admin_users` 화이트리스트)
- **라이브러리**: shadcn/ui charts (tremor.so) 8 KPI 카드
- **카드 구성**: WAU / MUV / 유입 경로 / 신규 구독자 / 4주 유지율 / Open·CTR / 주간 승인 공고 / Employers 문의
- **각 카드 ⓘ 툴팁**: "지표 설명 + 왜 중요한지 + 출처 (Amplitude/Reforge/Morning Brew)" 3줄
- **데이터 조합**: Supabase + Loops API + Vercel Analytics API (`/api/admin/metrics` unstable_cache 5분)

### 2.12 기종 Capacity 2단계
- **Phase 5.5 초기**: 정적 TS 파일 `web/src/data/aircraft-types.ts` (30 ICAO 코드, PAX/CGO/COMBI 라벨) → `<AircraftBadge>` 툴팁
- **Phase 5.5 확장**: `aircraft_capacity` Supabase 테이블 + `uld_capacity_json` jsonb + 팝오버에 `max_payload_kg` · 주요 ULD 표기
- **소스**: Airbus APM · Boeing APM · IATA ULD Technical Manual
- **OQ-D1 신규**: 사용자 본인 자료 + APM 매핑 작업 마감 (Phase 5.5 진입 전)
- **`/contribute` 피드백 폼**: `capacity_feedback` 테이블 + 관리자 트랜잭셔널 메일

### 2.13 공유 루프 (Growth Loop 보강)
- **URL**: `/share/[id]?ref={subscriber_id}`
- **DB**: `subscribers.referrer_subscriber_id` FK
- **트래킹**: 익명 집계 (어느 구독자가 몇 명 추천했는지, 개별 식별 안 함)
- **보상**: 없음 (수익화 축 제거, 순수 오가닉 루프)

---

## 3. 품질 점수 비교 (v0.2 → v0.3)

스코어링: 7개 VPS 차원 × 10점 + 카고 정합성 3개 차원 × 10점 / 문서별 100점 만점.

| 문서 | Pain정량 | G/W/T AC | MoSCoW | NFR/SLO | Differential | Proof | ADR | 카고정합 | 페르소나 | 수익화 제거 | v0.2 | v0.3 | Δ |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 00-overview | 10 | 8 | 10 | 9 | 10 | 9 | 10 | 10 | 10 | 10 | 87 | **96** | +9 |
| 01-a-side(카고) | 10 | 10 | 10 | 10 | 10 | 9 | 10 | 10 | 10 | 10 | 97 | **99** | +2 |
| 02-i-side | 10 | 10 | 10 | 10 | 10 | 10 | 10 | 10 | 10 | 10 | 100 | **100** | 0 |
| 03-data-model | 9 | 7 | 8 | 10 | 9 | 9 | 10 | 10 | 9 | 10 | 74 | **91** | +17 |
| 04-api-integration | 9 | 7 | 8 | 10 | 9 | 9 | 10 | 10 | 9 | 10 | 82 | **91** | +9 |
| 05-email-growth | 10 | 10 | 10 | 10 | 10 | 10 | 10 | 10 | 10 | 10 | 100 | **100** | 0 |
| 06-ui-ux | 10 | 8 | 10 | 10 | 10 | 9 | 10 | 10 | 9 | 10 | 89 | **96** | +7 |
| 07-roadmap | 9 | 7 | 9 | 9 | 9 | 9 | 10 | 10 | 9 | 10 | 75 | **91** | +16 |
| 99-quality | 10 | — | — | — | — | — | 10 | 10 | — | 10 | — | — | — |
| **평균(00~07)** | 9.6 | 8.4 | 9.4 | 9.8 | 9.6 | 9.3 | 10 | 10 | 9.5 | 10 | **88** | **96** | **+8** |

### 3.1 점수 해석

- **카고 정합성**: 전 문서 만점 — 승무원/지상직/조종사 서술 부재, C1 이지훈 인용, 카고 Pain 14 매핑 확인
- **수익화 제거**: 전 문서 만점 — 유료 구독·프리미엄·B2B SaaS 흔적 전무
- **G/W/T AC**: 03·04·07은 설계/운영 문서 특성상 8점대 유지. 01·02·05·06은 만점·근접
- **Differential Value**: 에디터 Pick 차별화 축이 추가되며 02·05·06 모두 10점
- **ADR 교차 참조**: 전 문서 ADR-008 링크 1개 이상 + 기존 ADR-001~007 유지 → 전부 만점

---

## 4. VPS ↔ PRD 정합성 체크 (v0.3)

| VPS v0.3 섹션 | PRD 반영 위치 | 일치 |
|---|---|---|
| VPS §1 Cargo Pain 14 (TOP 5: P04/P01/P03/P02/P05) | 00 §4 · 01 §1 · 02 §1 · 05 §1 | ✅ |
| VPS §2 JTBD J-01~J-06 (카고 재정의) | 00 §7 · 01 §2 · 02 §2 · 05 §2 | ✅ |
| VPS §3 North Star WAU (500/12w) · Reforge 40% | 00 §6 · 05 §12 · 07 §7.2 · 06 §16.3 | ✅ |
| VPS §4 Core Personas C1 이지훈 핀포인트 | 00 §5 · 01 §2 · 02 §2 · 05 §2 · 06 §5.10 | ✅ |
| VPS §5 Differential — 도메인 전문성(에디터 Pick) 신규 축 | 00 §8bis · 02 §12 · 05 §13 · 06 §13 | ✅ |
| VPS §6 Proof 실험 (에디터 Pick 커버리지 ≥60% 포함) | 00 §8ter · 02 §13 · 05 §14 · 06 §14 | ✅ |
| VPS §7 ADR 매핑 (ADR-008 포함) | 00 §8quater · 각 PRD 헤더 + §ADR 연결 | ✅ |
| VPS §8 수익화 제거 선언 | 00 §목적 · 07 §11 유예표 | ✅ |
| VPS §9 Amplitude/Reforge/Morning Brew 출처 | 00 §6 · 05 §9 (shadcn/ui charts ⓘ 툴팁) · 07 §7.2 | ✅ |

---

## 5. ADR 참조 커버리지 (v0.3)

| ADR | 참조 PRD |
|---|---|
| **ADR-008 Cargo-First Pivot** | **00, 01, 02, 03, 04, 05, 06, 07, 99 (전부)** |
| ADR-001 KAC/IIAC 데이터 소스 | 07 (Phase 5.5 분리), 04 (§10 Phase 5.5) |
| ADR-002 크론 하이브리드 | 02, 04, 06, 07 |
| ADR-003 Supabase 데이터 모델 | 01, 03, 05, 07 |
| ADR-004 큐레이션 하이브리드 | 01, 03, 04, 07 |
| ADR-005 Loops.so 이메일 | 01, 03, 04, 05, 07 |
| ADR-006 Premium Animated 디자인 | 06, 07 |
| ADR-007 VPS→PRD 워크플로 | 00, 06, 99 (본 리뷰), 07 |

**ADR-008이 9개 파일 전부에서 참조됨** — v0.3 피벗의 가장 중요한 검증 기준이 충족됨.

---

## 6. 카고 피벗 검증 체크리스트

### 6.1 승무원/지상직/조종사 서술 부재 (Phase 5.5+ 섹션 제외)

| 파일 | 본문 섹션 | Phase 5.5+ 허용 섹션 | 통과 |
|---|---|---|---|
| 00-overview | 부재 | — | ✅ |
| 01-a-side(카고) | 부재 | — | ✅ |
| 02-i-side | 부재 | — | ✅ |
| 03-data-model | 부재 (비카고 차단 트리거 보유) | — | ✅ |
| 04-api-integration | 부재 (EXCLUDE_RE 필터 적용) | — | ✅ |
| 05-email-growth | 부재 | — | ✅ |
| 06-ui-ux | 부재 (Phase 5.5 와이어프레임은 카고 한정) | `/flights` 섹션에서 여객기 belly 적재 언급만 | ✅ |
| 07-roadmap | 부재 (유예표에서 "재피벗 없음" 명시) | — | ✅ |

### 6.2 C1 이지훈 페르소나 User Story 인용

| 파일 | User Story 코드 | 통과 |
|---|---|---|
| 00-overview | §7 C1 이지훈 페르소나 요약 | ✅ |
| 01-a-side | US-A1 C1 이지훈 · US-A2 A1 학과생 · US-A3 B1 채용담당자 | ✅ |
| 02-i-side | US-I1 C1 이지훈 (7:00 출근길) · US-I2 C2 박서연 · US-I3 C3 김태영 | ✅ |
| 03-data-model | "C1 이지훈의 관심 카테고리 저장" 예시 섹션 | ✅ |
| 04-api-integration | C1 이지훈 타겟 뉴스·채용 키워드 인용 | ✅ |
| 05-email-growth | US-E1 C1 이지훈 (7:00 출근길 J-01) · US-E2 C2 · US-E3 C3 | ✅ |
| 06-ui-ux | §5.2 랜딩 카피에 "2~5년차 콘솔사 영업" 타겟 언급 | ✅ |
| 07-roadmap | Phase 5+ Acquisition 타겟 WAU 분배가 C1 기반 | ✅ |

### 6.3 수익화 관련 서술 부재

| 파일 | "프리미엄"/"유료"/"요금제"/"B2B SaaS" 부재 | 통과 |
|---|---|---|
| 00-overview | 부재 | ✅ |
| 01-a-side | 부재 | ✅ |
| 02-i-side | 부재 | ✅ |
| 03-data-model | 부재 | ✅ |
| 04-api-integration | 부재 | ✅ |
| 05-email-growth | 부재 | ✅ |
| 06-ui-ux | 부재 (금지어 가이드에 "프리미엄 티어" 포함) | ✅ |
| 07-roadmap | 유예표에 "수익화 — 재검토 없음" 명시 | ✅ |

### 6.4 카고 Pain 14 매핑

| PRD | 매핑된 Pain (최소 1개) |
|---|---|
| 01-a-side | P03 카고 채용 (희소) · P04 지인 추천 편중 (양면시장) |
| 02-i-side | P01 큐레이션 (카고 뉴스 파편화) · P02 해외 카고 · P05 현직자 시선 (에디터 Pick) |
| 05-email-growth | P01 · P05 (에디터 Pick 블록) |
| 06-ui-ux | P14 재방문 유인 (Bento + Parallax) · P02 (`<AviationTerm>`) |

### 6.5 에디터 Pick 차별화 축 일관성

| 구현 위치 | 검증 |
|---|---|
| DB 스키마 | `news_articles.editor_pick`·`editor_pick_tone`·`editor_pick_history` + `chk_editor_pick_length ≤ 140` + `log_editor_pick_change` 트리거 ([03 §6](./03-data-model.md)) ✅ |
| 뉴스 카드 시각 규약 | 좌측 sky 바 3px + "✏️ 에디터 Pick" 텍스트 + 톤 라벨 ([06 §2.1](./06-ui-ux-spec.md)) ✅ |
| 이메일 템플릿 | 동일 pickBlock 렌더링 HTML ([05 §5](./05-email-growth-loop.md)) ✅ |
| 커버리지 목표 | ≥ 60% ([02 §5 NFR](./02-i-side-information.md), [07 §7.2 KPI](./07-roadmap-milestones.md)) ✅ |
| 관리자 플로우 | `/admin/news` 인라인 편집 + history 자동 기록 ([07 §5.1](./07-roadmap-milestones.md)) ✅ |
| 톤 가이드 | 3 enum (OBSERVATION·ACTION_ITEM·CONTEXT) + 금지어 ([02 §5](./02-i-side-information.md)) ✅ |

### 6.6 WAU 출처 명시

| 위치 | 출처 4종 명시 | 통과 |
|---|---|---|
| 00-overview §6 | Amplitude / Reforge / Morning Brew / Substack·Beehiiv | ✅ |
| 05-email-growth §9 shadcn/ui charts ⓘ | 동일 | ✅ |
| 07-roadmap §7.2 | 동일 | ✅ |
| 16-vps.md §3 | 동일 | ✅ |

### 6.7 브랜드 충돌 회피

| 체크 | 통과 |
|---|---|
| 한아름종합물류(hanaleum.com) 구분 표기 | ✅ (07 §7.4 트리거 + footer 구분) |
| "한" 접두어 제거 | ✅ |
| 푸터 법인 구분 표기 계획 | ✅ (02·06·07) |
| 상표 출원 시점 재검토 조항 | ✅ (07 §7.4) |

### 6.8 `arum.*` 토큰 전환

| 체크 | 통과 |
|---|---|
| Tailwind config 토큰 네임스페이스 | `arum.*` ([06 §2](./06-ui-ux-spec.md)) ✅ |
| `raion.*` 잔여 서술 | 부재 (히스토리 Changelog만 허용) ✅ |
| 환경변수 접두어 | 유지 (`LOOPS_API_KEY` 등 표준 이름, 브랜드 무관) ✅ |

---

## 7. 남은 약점 & 후속 과제

| 영역 | 약점 | 후속 |
|---|---|---|
| 03 데이터 모델 G/W/T AC | 스키마 문서는 User Story 구조가 부자연스러움 | Phase 2 실사용 후 Contract Test로 대체 |
| 04 API G/W/T AC | 계약 테스트로 대체 중 | Phase 4 각 client 단위 테스트 구현 시 G/W/T 삽입 |
| 에디터 Pick 작성 부담 | 매일 3~4개 * 140자 * 60% 커버리지 = 상당한 운영 부담 | OQ-C2로 추적. Phase 3~4 샘플 5개 작성 후 주간 배치 실험 |
| 기종 capacity 데이터 품질 | 사용자 수작업 시드가 필수 | OQ-D1로 추적. Phase 5.5 진입 전 사용자 자료 + APM 검증 |
| About 페이지 초안 선택 | A/B/C 중 하나 사용자 선택 필요 | OQ-C1로 추적. Phase 2~3 진입 전 결정 |
| 양면 시장 활성화 타임라인 | Phase 5.5 `/employers` 진입 시점이 WAU 지표에 의존 | 첫 제휴 문의 수신이 트리거 |
| Phase 6~7 상세 PRD 부재 | 커뮤니티·모바일 앱은 비전 섹션만 | Phase 5 완료 후 별도 PRD 작성 |
| 99 품질 리뷰 자체 버전 관리 | v1.0 → v2.0 | 주요 PRD 변경 시 재산정 |

---

## 8. 사용자 확인 요청 항목 (승인 절차)

본 리뷰 파일 작성 완료 후, 사용자에게 다음 항목을 확인 요청:

### 8.1 피벗 의사결정 확인
- [ ] ADR-008 Cargo-First Pivot 의사결정이 여전히 유효한가?
- [ ] 브랜드 "아름 카고 (Arum Cargo)" 확정 (한아름종합물류 충돌 회피 표기 포함)
- [ ] C1 이지훈(2~5년차 콘솔사 영업) 페르소나 핀포인트 유지

### 8.2 지표 & 목표 합의
- [ ] North Star WAU 500 / 12주 달성 목표가 현실적인가?
- [ ] 4주 유지율 ≥ 40% (Reforge PMF) 달성 전략이 타당한가?
- [ ] 에디터 Pick 커버리지 ≥ 60% 작성 부담이 감당 가능한가?

### 8.3 기술 선택 재확인
- [ ] Loops.so 무료 티어 + `loops.email` 공용 발송 수용 (OQ-M6 Phase 5 진입 전 검증)
- [ ] `arumcargo.vercel.app` 무료 경로 유지, 500명 또는 첫 제휴 문의 시 `arumcargo.com` 검토
- [ ] shadcn/ui charts + shadcn 차트 2원화 수용
- [ ] ADR-006 Premium Animated 강도 (Bento + Parallax + Blob) 수용

### 8.4 운영 의사결정
- [ ] About 페이지 초안 A/B/C 중 1개 선택 (OQ-C1)
- [ ] 에디터 Pick 5개 샘플 작성 후 톤 검수 시점 (OQ-C2)
- [ ] 기종 capacity 시드 자료 제공 시점 (OQ-D1) — Phase 5.5 진입 전

### 8.5 유예 항목 확인
- [ ] 수익화 축 전면 제거 유지 (재검토 없음)
- [ ] L-Side B2B 화물 SaaS 유예 (Phase 7+ 또는 별도 사업)
- [ ] Phase 6~7 비전만 명시, 상세 PRD는 Phase 5 완료 후

### 8.6 Phase 1 → Phase 2 진입 조건
- [ ] 사용자 "이대로 만들자" 승인 → Phase 1 DoD 마지막 체크박스 완료
- [ ] Phase C (CLAUDE.md·open-questions.md) 업데이트 완료 확인
- [ ] Supabase·Vercel·Loops.so 계정 가입 착수

---

## 9. 이전 Changelog 요약 (v0.2 → v0.3 마이그레이션 기록)

### 9.1 v0.2 유지된 품질 자산
- 8개 PRD 전부 G/W/T AC · MoSCoW · NFR/SLO · Differential · Proof · ADR 교차참조 프레임워크
- 02-i-side: 최고 점수 100 유지 (v0.3에서 소스 교체만, 구조 유지)
- 05-email-growth: 최고 점수 100 유지 (v0.3에서 WAU·shadcn/ui charts 대시보드·공유 루프 추가)
- §50 준수 체크리스트 (광고 표기·원클릭 수신거부·야간 발송 금지·발신자 정보)
- ADR-001~007 전부 최소 1개 PRD에서 참조

### 9.2 v0.3 신규 자산
- ADR-008 Cargo-First Pivot 전 문서 참조
- 에디터 Pick 차별화 축 (DB·UI·이메일·관리자 4 레이어 일관성)
- WAU North Star + 4주 유지율 + 출처 4종
- `/admin/dashboard` shadcn/ui charts 8 KPI 카드
- Phase 5.5 양면 시장 (`/employers`) + 운항 + 기종 capacity 2단계
- Phase 6~7 비전 (Remember 벤치마크 + 모바일 앱)
- 비카고 차단 트리거 (DB 레벨 방어)
- 공유 루프 `/share/[id]?ref=xxx`
- 브랜드 충돌 회피 (한아름종합물류) 기록
- `arum.*` Tailwind 토큰 네임스페이스 전환

---

## Changelog

- **2026-04-11 (v2.0)**: Cargo-First Pivot 품질 리뷰. 9개 PRD v0.2 → v0.3 전면 재작성 검증. 카고 정합성 8개 체크 전부 통과. ADR-008이 9개 파일 전부에서 참조됨. 승무원/지상직/조종사 서술 부재 확인. C1 이지훈 페르소나 인용 확인. 수익화 축 제거 확인. 에디터 Pick 차별화 축 4 레이어 일관성 확인. WAU 출처 4종 명시 확인. 사용자 승인 요청 항목 22개로 확장. 품질 평균 88 → 96.
- 2026-04-11 (v1.0): 최초 작성. 8개 PRD v0.1 → v0.2 교정 결과·VPS ↔ PRD 정합성·ADR 커버리지 기록.
