# ADR-008 — Cargo-First 전략 피벗 (아름 카고)

- **Status**: Accepted
- **Date**: 2026-04-11
- **Owner**: RAION Founder (→ 아름 카고 Founder)
- **Referenced by**: [prd/00-overview.md](../prd/00-overview.md), [prd/01-a-side-academy-career.md](../prd/01-a-side-academy-career.md), [prd/02-i-side-information.md](../prd/02-i-side-information.md), [prd/07-roadmap-milestones.md](../prd/07-roadmap-milestones.md), [references/13-personas.md](../references/13-personas.md), [references/15-aos-dos-opportunity.md](../references/15-aos-dos-opportunity.md), [references/16-vps.md](../references/16-vps.md), [CLAUDE.md §1](../../CLAUDE.md)
- **Related**: [references/99-advisor-notes.md 2026-04-11 피벗 세션](../references/99-advisor-notes.md), [open-questions.md](../open-questions.md)
- **Supersedes**: — (기존 ADR은 유지. 이 ADR은 상위 전략 피벗으로 ADR-001~007의 대부분을 그대로 유효화한다.)

---

## Context

Phase 0 + 0.5 완료 후 Phase 1 PRD 작성 직전 시점(2026-04-11), 창립자의 실제 강점과 MVP 스코프 간 **근본 미스매치**가 드러났다.

### 발견된 미스매치

1. **창립자 도메인 전문성 = 항공 화물 (Air Cargo)**
   - 한서대학교 항공교통물류학과 졸업
   - 2015년 5월부터 항공사 화물 영업·오퍼 현직, 2026년 기준 **11년차**
   - 공항 오퍼레이션 + 화물 세일즈 양쪽 경험
   - 실제 업계 네트워크, 도메인 용어(AWB, ULD, Belly, Main Deck, TAC Index), 현직자 인사이트 보유

2. **기존 PRD v0.2 타겟 = 승무원·지상직·조종사 (여객 측)**
   - C1~C5 페르소나가 김지원(승무원 지망생), 박태현(지상직) 등 여객 중심
   - 뉴스 소스가 여객 중심 (Simple Flying, Aviation Week 등)
   - 채용 키워드가 `승무원` `객실승무원` `지상직` 중심
   - 창립자 본인이 이 영역에 대한 **경험·네트워크·전문 지식이 거의 없음**

3. **승산(Win Rate) 관점의 실패**
   - "비즈니스는 승률". 창립자가 가장 잘 아는 영역에서 시작해야 차별화 가능
   - 화물은 **시장 자체가 좁아 기존 플레이어가 주목하지 않음** (카고프레스·Loadstar 등 전문 매체만 존재)
   - **인재난이 실존**: 콘솔사·포워더는 "지인 추천 아니면 사람인"이 유일한 채널. 공급/수요 양측 모두 Pain이 실측됨
   - 창립자는 익명 운영이어도 **도메인 디테일 수준** 자체로 신뢰를 획득할 수 있음

### 트리거

2026-04-11 세션에서 창립자가 직접 진단: *"1,2번이 미스매칭임. 내가 했을 때 승산이 있는지? 내가 어떤걸 잘하는가. 내가 크게 잘하는 motivation이 무엇인가. 지금 PRD overview 보니까 1,2번이 미스매칭이야. 내가 잘하는 쪽으로 더 치우쳐야 해."*

---

## Decision

**RAION Aviation DX Hub**의 Phase 1 MVP 스코프를 **여객 중심 → 항공 화물 중심**으로 전면 피벗한다. 서비스명은 **아름 카고 (Arum Cargo)**로 개명하며, 향후 확장 시 **아름 (Arum)** 플랫폼으로 승격한다.

### 1. 브랜드

- **MVP 브랜드**: 아름 카고 (Arum Cargo)
- **확장 브랜드**: 아름 (Arum) — Phase 6+
- **의미**: "아름" = 한국어 "아름답다" = "나답다". 항공 화물 업계에서 나답게 일할 수 있는 공간
- **충돌 회피**: (주)한아름종합물류(hanaleum.com, 3PL)와 구분하기 위해 "한" 접두어 제거

### 2. 타겟 페르소나 (핀포인트)

| 타입 | 페르소나 | 설명 |
|---|---|---|
| **Core** | C1 | 2~5년차 콘솔사/포워더 항공화물 영업·오퍼 직원 |
| Secondary | C2 | 1년차 신입 (직군 이해 중) |
| Secondary | C3 | 6~10년차 시니어 (업계 흐름 모니터링) |
| Adjacent | A1 | 항공교통물류학과 재학/졸업예정자 |
| B-side | B1 | 콘솔사/포워더 채용 담당자 (채용난) |

기존 PRD v0.2의 C1~C5 (김지원 승무원·박태현 지상직 등)는 **폐기**. Phase 5.5+ 확장 시 Adjacent로 재편.

### 3. MVP 스코프 (Phase 1~5)

- **I-Side 뉴스**: 화물 중심 70% + 큰 항공 뉴스 30%. 에디터 Pick 동반. 소스: 카고프레스, Loadstar, Air Cargo News, FlightGlobal Cargo, 네이버 뉴스 "항공화물" 키워드
- **A-Side 채용**: 워크넷 + 사람인 OpenAPI에서 `항공화물` `항공운송` `국제물류` `포워딩` `콘솔` 키워드. 큐레이션 하이브리드 (pending/approved/rejected)
- **이메일**: Loops.so 무료 티어(ADR-001 유효). 하루 1회 다이제스트
- **기업 공식 채용 딥링크**: 코스모항운, 우정항공, 트리플크라운인터네셔널, 서울항공, 판토스, CJ대한통운, 한진, 대한항공카고, 아시아나카고

### 4. Phase 5.5 (확장)

- `/employers` 기업 담당자 페이지 (양면 시장)
- 화물 tracking (AWB 입력 → 상태 조회)
- 운항 출도착 화면 (KAC + IIAC) + 기종 뱃지 (PAX/CGO/COMBI)
- 기종 capacity 매핑 (Supabase `aircraft_capacity`, Airbus/Boeing APM 기반 수작업 시드)
- 정보 수정 피드백 폼 (`capacity_feedback`)

### 5. Phase 6~7 (비전)

- **Phase 6**: 리멤버(Remember) 앱 벤치마크 커뮤니티 — 승진·이직 타임라인, 직군별 익명 라운지, 회사 이메일 도메인 경력 검증
- **Phase 7**: 모바일 앱 전환, "아름" 브랜드로 전체 항공 생태계 확장

### 6. 수익화 축 제거

"사실 유료화 생각은 굳이 없어. 홈페이지 더 많이 쓰게끔 하고, 자연 광고 유입으로 가자" — 창립자 명시.

- 유료 구독, B2B SaaS, 월 요금제, 프리미엄 티어 등 전면 삭제
- 남기는 축: **자연 성장 + 자연 광고 유입** (제휴 항공사·학원·포워더가 먼저 연락 오는 구조)

### 7. 도메인 & 비용

- MVP 도메인: `arumcargo.vercel.app` (무료)
- 이메일: Loops.so 무료 티어 (도메인 불필요, 자체 인증 도메인으로 발송)
- `arumcargo.com` 구매는 구독자 500명 또는 첫 제휴 문의 수신 시점에 재검토

---

## Consequences

**긍정**

- 창립자 도메인 전문성이 즉시 차별화 요소로 전환됨 — 에디터 Pick의 디테일 수준이 타 매체가 흉내 낼 수 없는 방어막이 됨
- 좁은 시장이지만 기존 플레이어 부재 → 블루오션 진입. 카고프레스·Loadstar는 B2B 뉴스레터이지 "종사자 커뮤니티 + 채용"은 아님
- 양면 시장(구직자 + 기업)이 실존 Pain 기반 → 초기 피드백 루프 빠름
- 화물 → 확장의 경로가 명확 (인접 포워더/3PL → 전체 항공 생태계)
- 승무원·지상직 영역은 Phase 5.5+ 또는 Phase 6+에서 "학원 제휴" 형태로 재진입 가능 (오프라인 네트워크 활용)

**부정·리스크**

- **TAM 축소**: 전체 항공 종사자 대비 화물 종사자는 한 자릿수 %. Phase 6 커뮤니티 확장 없이는 수만 명 수준에서 성장 정체 가능
- **PRD 재작성 비용**: 8개 PRD 파일 전면 v0.3 업그레이드 필요. Phase A 레퍼런스 7~8개 파일도 연쇄 수정
- **기존 자산 부분 손실**: v0.2의 페르소나, AOS/DOS 점수, TAM/SAM/SOM 계산 상당 부분 재작업
- **브랜드 충돌 잔존 위험**: (주)한아름종합물류와 완전 분리되더라도 카고 분야 3PL 검색 시 혼동 가능 → 푸터 명시·상표 출원 검토
- **창립자 익명성 vs 신뢰도 긴장**: 11년 경력 사실만 노출하고 학교·회사명은 숨김. About 페이지 문구 신중 설계 필요 (OQ-C1)

---

## Alternatives Considered

| 대안 | 기각 사유 |
|---|---|
| **v0.2 유지 (여객 중심)** | 창립자 승산 없음. 여객 인플루언서·학원·대형 커뮤니티 대비 차별화 불가 |
| **A+I Side 동시 확장 (여객 + 화물)** | MVP 스코프 과대. 창립자 1인 운영 현실상 품질 분산. 화물이라도 깊게가 나음 |
| **화물 단독 + 승무원 학원 제휴 병행** | Phase 6+로 유예. MVP 단계에서 오프라인 제휴는 시간 블로커 |
| **Substack 뉴스레터만** | 플랫폼 락인, DB/대시보드/채용 통합 불가. 양면 시장 구조 실현 불가 |
| **B2B SaaS 화물 업체용 툴** | 창립자 의도 불일치 ("유료화 생각 없음"). 초기 사용자 획득 비용 너무 큼 |

---

## Impact on Existing ADRs

| ADR | 영향 | 조치 |
|---|---|---|
| [ADR-001 Loops.so](./ADR-001-email-service-loops-over-resend.md) | ✅ 유효 | 그대로 유지. 2,000 contacts 한도 재평가 기준은 화물 시장 규모 고려 |
| [ADR-002 KAC+IIAC](./ADR-002-flight-data-kac-iiac-over-aviationstack.md) | ✅ 유효 | Phase 5.5 운항 화면에서 활용 (기종 정보 제공 여부 Phase 4에서 확인) |
| [ADR-003 No-Auth MVP](./ADR-003-no-auth-mvp-email-token-only.md) | ✅ 유효 | MVP는 여전히 무인증. Phase 5 관리자 `/admin/dashboard` 만 Supabase Magic Link 화이트리스트 추가 |
| [ADR-004 Hybrid Job Curation](./ADR-004-hybrid-job-curation.md) | ✅ 유효 | pending/approved/rejected 큐레이션 플로우 그대로. 키워드만 화물로 교체 |
| [ADR-005 Cron Hybrid](./ADR-005-cron-hybrid-vercel-github.md) | ✅ 유효 | Vercel Cron + GitHub Actions 하이브리드 유지 |
| [ADR-006 Premium Animated](./ADR-006-design-premium-animated.md) | ⚠️ 수정 | 메인 페이지를 Bento Grid + Gradient Blob + Scroll Parallax Hero로 재정의. 3D Carousel은 `/showcase` 또는 `/about` 하단으로 배치 변경. ADR-006-rev 또는 PRD 06에서 차이 명시 |
| [ADR-007 GPT-4o-mini](./ADR-007-translation-gpt-4o-mini.md) | ✅ 유효 | 해외 카고 뉴스(Loadstar, Air Cargo News) 번역에 필수 |

---

## Verification

### Phase A 레퍼런스 업데이트 검증
- [ ] `docs/references/13-personas.md` 에서 `승무원` `지상직` `조종사` 중심 서술 부재 (Adjacent/비스코프 외)
- [ ] `docs/references/13-personas.md` 에서 C1이 "2~5년차 콘솔사/포워더 화물 영업·오퍼"로 명시
- [ ] `docs/references/09-news-sources.md` 에서 `카고프레스` `Loadstar` `Air Cargo News` 표기 존재
- [ ] `docs/references/16-vps.md` 에서 `WAU` North Star + Amplitude/Reforge/Morning Brew 근거 명시
- [ ] `docs/references/00-index.md` Changelog v0.3 엔트리 추가

### Phase B PRD 업데이트 검증
- [ ] `docs/prd/*.md` 8개 파일 모두 `**버전**: v0.3` + ADR-008 교차 참조
- [ ] `docs/prd/00-overview.md` 에서 `승무원` 단어 부재 또는 Phase 5.5+ 섹션에만 등장
- [ ] `docs/prd/01-a-side-academy-career.md` `/employers` 섹션 Phase 5.5 태그
- [ ] `docs/prd/02-i-side-information.md` 운항 섹션 Phase 5.5 태그
- [ ] `docs/prd/07-roadmap-milestones.md` Phase 5.5 신규, Phase 6~7 비전, 수익화 섹션 부재

### Phase C 메타 업데이트 검증
- [ ] [CLAUDE.md §1](../../CLAUDE.md) "아름 카고" 표기
- [ ] [docs/open-questions.md](../open-questions.md) OQ-D1, OQ-C1, OQ-C2 신규
- [ ] [docs/glossary.md](../glossary.md) §8 화물 용어 추가

### 사용자 승인
- [ ] Phase A 완료 후 레퍼런스 7개 리뷰 승인
- [ ] Phase B 완료 후 PRD 8개 리뷰 승인
- [ ] About 페이지 초안 2~3개 중 선택
- [ ] 기종 capacity 시드 자료 Phase 5.5 진입 전 제공

---

## Review Trigger

다음 조건 충족 시 이 ADR 재검토:

- **TAM 신호**: 구독자 6개월 내 500명 미달 → 타겟 재정의 (승무원·지상직 재포함 검토)
- **공급 신호**: 월간 승인 채용 공고 < 10건 지속 → 데이터 소스 재검토 또는 기업 직접 파트너십
- **양면 시장 신호**: `/employers` 문의 월 0건 3개월 이상 → B1 페르소나 재정의 또는 채널 변경
- **에디터 Pick 신호**: 사용자 리서치에서 "내부자 뉴스레터" 인식 < 30% → 포지셔닝 재설계
- **창립자 여건 변화**: 업계 퇴사 또는 본업 과부하 → MVP 범위 축소 또는 파트너 영입
- **한아름종합물류 충돌**: 법적 이의제기 또는 사용자 혼동 10건 이상 → 브랜드 재명명

---

## Changelog

- 2026-04-11: 최초 작성. Cargo-First 전략 피벗 확정. 기존 여객 중심 v0.2 PRD는 v0.3으로 전면 재작성 진입.
