# Data Sources — 항공 화물 뉴스·운항·채용 소스 + 법적·기술적 제약

> **버전**: v0.3 (Cargo-First Pivot)
> **근거**: [ADR-008](../adr/ADR-008-pivot-to-cargo-first.md) — 아름 카고 (Arum Cargo) 전략 피벗
> **목적**: 아름 카고 MVP가 사용할 **모든 외부 데이터 소스**를 한 곳에 정리. 승무원·지상직·조종사 관련 소스는 v0.3에서 삭제되거나 비스코프로 주석화. **화물 70% + 큰 항공 뉴스 30%** 원칙 적용.

---

## 0. v0.3 주요 변경

- **뉴스 소스 교체**: Simple Flying·Aviation Week 등 승객·여객 중심 매체 삭제 → **Loadstar / Air Cargo News (UK) / FlightGlobal Cargo / 카고프레스 / CargoNews / Forwarder KR** 중심 재편
- **채용 키워드 교체**: `승무원`, `지상직`, `조종사` 삭제 → `항공화물`, `국제물류`, `포워딩`, `콘솔`, `항공운송`, `항공수출입`, `AWB`, `포워더` 중심
- **항공사 공식 채용 딥링크 교체**: 대한항공(여객)·제주항공 등 → **코스모항운·우정항공·트리플크라운인터내셔널·서울항공·판토스·CJ대한통운·한진·대한항공카고·아시아나카고** 화물 부서/화물 전문 회사로 재편
- **번역 파이프라인 유지**: OpenAI GPT-4o-mini로 해외 카고 뉴스 한글 요약 (이게 P02 Pain 해결의 핵심)
- **인스타그램 보류 §3 유지** (ToS 동일)
- **운항 데이터 §6**: Phase 5 MVP 비스코프, Phase 5.5 진입 후 재활성 (기종 capacity 맥락으로 통합)

---

## 1. 우선순위 1 — 즉시 사용 (MVP Phase 4)

### 1.1 네이버 뉴스 검색 API ⭐
- **URL**: https://developers.naver.com/docs/serviceapi/search/news/news.md
- **접근 방식**: REST API, Client ID/Secret 인증
- **쿼터**: 일 25,000건 (충분)
- **키워드 (v0.3 화물 중심)**:
  - 핵심: `항공화물`, `항공운송`, `화물기`, `항공물류`, `포워더`, `콘솔사`, `AWB`, `국제물류`
  - 보조: `대한항공카고`, `아시아나카고`, `인천공항 화물`, `항공운임`, `벨리카고`, `BAI`, `TAC Index`
  - 큰 항공 뉴스 30%: `대한항공 아시아나 합병`, `LCC 경영`, `국제선 증편` 등 (전체 분량의 30% 한도)
- **응답 필드**: `title`, `originallink`, `link`, `description`, `pubDate`
- **한국어**: ✅ 국내 모든 언론사 커버
- **라이선스**: 링크·요약 수준 사용 OK, 재배포 금지. 출처 표기 필수.
- **Next.js 연동**: `src/lib/api/naver-news.ts` 클라이언트, API Route에서만 호출
- **구현 난이도**: ★☆☆☆☆

### 1.2 국내 항공 화물 전문 매체

사용자 피드백 + 2026-04-11 리서치 기준:

| 매체 | URL | 형식 추정 | 주제 중심 | 상태 |
|---|---|---|---|---|
| **카고프레스 (CargoPress)** ⭐ | https://www.cargopress.co.kr/ | RSS 확인 필요 | 항공화물 + 해상·육상 종합 | 최우선 소스 |
| **CargoNews 카고뉴스** ⭐ | https://www.cargonews.co.kr/ | RSS 확인 필요 | 항공화물 특화 | 최우선 소스 |
| **Forwarder KR** | https://www.forwarder.kr/ | HTML | 포워더 업계 | 차순위 |
| **Air Cargo News KR** | https://www.aircargonews.net/ | RSS 확인 필요 | 항공화물 | 차순위 |
| **한국물류신문** | https://www.klnews.co.kr/ | RSS 확인 | 물류 일반 (화물 파트 발췌) | 옵션 |
| **인천공항 뉴스룸** | https://www.airport.kr/ | HTML 공지 | 인천 화물 터미널 운영 공지 | 보조 |
| **World ACD** (글로벌 운임 지표) | https://www.worldacd.com/trends/ | 차트 데이터 | 글로벌 화물 운임 추세 | Phase 5.5 |

**구현 방침**:
- Phase 4에서 각 URL의 RSS 존재 여부 확인 → 있으면 `rss-parser` 로 파싱
- 없으면 `cheerio` HTML 스크래핑 (robots.txt 준수, 빈도 낮게: 1시간 1회)
- 모든 카드에 **원본 출처명 + 링크** 카드 하단 한 줄 노출 (예: `Source: 카고프레스 2026.04.10`)
- 원문 저장 금지 (제목·요약만 캐싱, 24시간 후 만료)

**법적 주의**:
- 스크래핑 전 각 사이트 **robots.txt** 확인
- `Terms of Service` 재배포 금지 조항 확인
- 상업적 사용 불가 사이트는 **link-out 방식**

### 1.3 공식 공공 소스
- **국토교통부 항공정책과 보도자료**: https://www.molit.go.kr/
- **한국무역협회(KITA) 물류 통계**: https://www.kita.net/
- **관세청 수출입 통계**: https://unipass.customs.go.kr/
- **인천공항공사 뉴스룸·통계**: https://www.airport.kr/
- **한국공항공사 통계**: https://www.airport.co.kr/
- **공공 저작물 → 자유 이용 가능** (출처 표기 필수)

---

## 2. 우선순위 2 — 해외 항공 화물 뉴스 (번역 파이프라인 필요)

> **화물 도메인의 핵심 정보는 해외 영문 매체가 주도한다**. GPT-4o-mini 번역이 P02 "해외 카고 영문 자료 접근 장벽" Pain 해결의 핵심.

### 2.1 Loadstar ⭐ (최우선)
- **URL**: https://theloadstar.com/
- **RSS**: https://theloadstar.com/feed/ (일반 WordPress)
- **언어**: 영어
- **특성**: 글로벌 항공·해상 화물 최고 권위 매체. 운임·캐리어 동향·지정학 영향 분석
- **라이선스**: 무료 기사 + 유료 프리미엄. 무료 기사만 요약·번역 대상
- **번역**: GPT-4o-mini로 한글 3~4문장 요약

### 2.2 Air Cargo News (UK) ⭐
- **URL**: https://www.aircargonews.net/ (국내 매체와 도메인 유사, 별도)
- **RSS**: https://www.aircargonews.net/feed/ (확인 필요)
- **언어**: 영어
- **특성**: UK 기반 항공화물 전문. 캐리어·공항·포워더 뉴스 균형

### 2.3 FlightGlobal Cargo 섹션
- **URL**: https://www.flightglobal.com/cargo
- **언어**: 영어
- **특성**: 항공업계 일반 매체 중 화물 섹션 별도 운영. 기종·항공사 전략 중심

### 2.4 Air Cargo World
- **URL**: https://aircargoworld.com/
- **언어**: 영어
- **특성**: US 기반, 북미 화물 동향 + 글로벌 운임

### 2.5 Flightradar24 Blog (Cargo 태그)
- **URL**: https://www.flightradar24.com/blog/category/cargo/
- **언어**: 영어
- **특성**: 화물기 경로·기종 인사이트. 시각 자료 풍부.

### 2.6 IATA Cargo News
- **URL**: https://www.iata.org/en/programs/cargo/
- **언어**: 영어
- **특성**: 정책·e-Freight·ULD 표준 등 구조적 이슈
- **라이선스**: 공식 보도자료 링크 공유 OK

**번역 파이프라인 (Phase 4 유지)**:
```
[RSS 수집] → [영문 원문] → [GPT-4o-mini 요약 + 번역] → [한글 요약 캐시]
           → [카드 표시: 한글 요약 + 영문 원본 토글]
```

**비용 추정 (v0.3 갱신)**:
- GPT-4o-mini: ~$0.15 / 1M input tokens
- 일 20~30건 × 평균 800 토큰 = 20,000 토큰/일 ≈ **월 $0.10** (충분 감당)
- 대안: DeepL API Free (월 500,000자 무료) — 정확한 용어 번역에 유리하나 요약 불가

---

## 3. ❌ 보류 / 금지 — 인스타그램

사용자가 과거 제공했던 계정 리스트는 **승무원 중심**이었으므로 v0.3에서 **전체 비스코프**:
- `@aviationnews___`, `@crew__insight`, `@onfly__news`, `@ancf_news`, `@dreamflight_news`, `@baekal_flightnews`

### 3.1 v0.3 상태
- **승무원 인스타 계정은 아름 카고 타겟 페르소나와 무관** → 보류가 아닌 **비스코프**
- 향후 "아름" 확장(Phase 7) 시 재검토 가능

### 3.2 왜 인스타 전반이 여전히 금지인가

| 방식 | 가능 여부 | 리스크 |
|---|---|---|
| Instagram Graph API (공식) | ❌ | 본인 소유/비즈니스 계정만 가능 |
| 비공식 스크래퍼 (Instaloader 등) | ⚠️ | Meta ToS 위반, IP 차단, 국내 판례상 법적 리스크 |
| RSSHub | ⚠️ | 불안정, 언제든 차단 |
| 사용자가 공유한 OG 메타 수집 | ✅ | 자동화 ❌ |

### 3.3 대안 (Phase 6~7 커뮤니티 이후)
1. **화물 업계 인플루언서 파트너십 DM**: LinkedIn 한국 화물 그룹 운영자, 업계 유튜버 등 5곳에 제안
2. **공식 RSS/피드 요청**: 파트너가 블로그·뉴스레터 운영하면 해당 RSS 사용
3. **에디터 Pick 확장**: 사용자 본인이 주 1~2회 수동 모니터링 후 카드에 반영

### 3.4 즉시 금지
- MVP 단계에서 **인스타그램·LinkedIn 크롤링 코드 작성 금지**
- PR·코드 리뷰 시 해당 로직 발견 시 즉시 제거

---

## 4. 소스별 카테고리 매핑 (v0.3)

뉴스 카드의 `category` 필드에 사용할 분류:

| 카테고리 | 매칭 키워드 | 주요 소스 | 비중 목표 |
|---|---|---|---|
| `cargo-market` | 항공운임, BAI, TAC Index, 수요 | Loadstar, Air Cargo News, 네이버 "항공운임" | 25% |
| `cargo-ops` | 화물기, 벨리카고, ULD, 기종, 스케줄 | Air Cargo News, FlightGlobal Cargo, 카고프레스 | 20% |
| `cargo-company` | 대한항공카고, 아시아나카고, FedEx, UPS, 콘솔사 뉴스 | 카고프레스, 네이버 "대한항공카고" | 15% |
| `cargo-policy` | 관세, FTA, 보세구역, 세관, 규제 | 관세청, 국토부, 네이버 "항공화물 정책" | 10% |
| `airport-cargo` | 인천공항 화물터미널, 김해 화물, 제주 물동량 | 공항공사, 네이버 | 10% |
| `big-aviation` | 대한항공·아시아나 합병, LCC, 슬롯, 유가 | 네이버 뉴스 | **30% 상한** |
| `career-cargo` | 콘솔사 채용, 포워더 영업 채용, 물류 관리자 | 네이버 "항공화물 채용" | 보조 (`/jobs` 우선) |

**비중 원칙**: 화물 중심(70%) + 큰 항공 뉴스(30%) — ADR-008 §1.3

---

## 5. Phase 4 구현 로드맵 (뉴스)

1. **네이버 뉴스 API** 키 발급 → 클라이언트 작성 → 카테고리별 쿼리 → 캐싱
2. **국내 화물 전문 매체 RSS 존재 여부 조사** (카고프레스·CargoNews·Forwarder KR) → RSS 있는 곳부터 `rss-parser` 연동
3. **RSS 없는 곳 HTML 구조 조사** → `cheerio` 스크래퍼 (선택적, 법적 검토 후)
4. **Loadstar + Air Cargo News + FlightGlobal Cargo RSS** + GPT-4o-mini 번역 → 한글 요약 카드
5. **네이버 뉴스 중복 제거 로직** (동일 기사 여러 언론사 보도 시)
6. **이미지 썸네일** — 원본 이미지 직접 링크 vs 자체 캐싱 (Next.js Image) 결정
7. **에디터 Pick 레이어**: 뉴스 카드에 사용자 본인이 작성한 1~2문장 현직자 시각 (수동 또는 Supabase CMS 입력)

---

## 6. 운항 데이터 소스 (공공데이터포털) — **Phase 5.5**

> **v0.3 변경**: Phase 5 MVP에서는 운항 대시보드 비스코프. Phase 5.5에서 기종 capacity와 함께 재활성.

### 6.1 한국공항공사(KAC) 운항정보 API — primary 1
- **URL**: https://www.data.go.kr/data/15000126/openapi.do
- **커버 공항**: 김포·김해·제주·대구·광주·청주·무안·양양·여수·울산·원주·포항·사천
- **승인**: data.go.kr 가입 → 개발계정 키 즉시 발급 → 운영계정 2~3일 승인
- **쿼터**: 개발 1만콜/일, 운영 10만콜/일
- **상업적 이용**: ✅ 공공데이터법 기준 가능 (출처 표기 권장)
- **v0.3 용도**: 정기편 출도착 표시 + 기종 정보 제공 여부 확인 (Phase 5.5 진입 전 검증 필수)
- **화물 관련 필드 확인 필요**: 기종 코드가 응답에 포함되는지, 포함되지 않으면 OAG/FR24 퍼블릭 스케줄과 교차 참조
- **Next.js 연동**: `src/lib/api/kac.ts`
- **구현 난이도**: ★★☆☆☆

### 6.2 인천국제공항공사(IIAC) API — primary 2
- **URL**: https://www.data.go.kr/en/data/15112968/openapi.do
- **커버 공항**: 인천(ICN) 전용 — **국내 화물 물동량 70% 이상** 담당
- **엔드포인트 예시**:
  - 여객기 출발: `apis.data.go.kr/B551177/StatusOfPassengerFlightsDeOdp/getPassengerDeparturesDeOdp`
  - 여객기 도착: `apis.data.go.kr/B551177/StatusOfPassengerFlightsDeOdp/getPassengerArrivalsDeOdp`
  - **화물기 출발/도착 엔드포인트 별도 존재 여부 Phase 5.5 진입 전 확인 필수** (공공데이터포털 카탈로그 검색)
  - 혼잡도: `apis.data.go.kr/B551177/StatusOfArrivals/getArrivalsCongestion`
- **쿼터**: 개발 500콜/일, 운영 10만콜/일
- **상업적 이용**: ✅ 가능
- **Next.js 연동**: `src/lib/api/iiac.ts`

### 6.3 UBIKAIS — 딥링크만
- **URL**: https://ubikais.fois.go.kr/
- **운영**: 국토교통부 (FOIS)
- **공식 API**: ❌ 없음 (웹 UI 전용)
- **사용 방식**: 운항 테이블 각 행에 `UBIKAIS 상세보기` 딥링크

### 6.4 FlightRadar24 — 딥링크만
- **URL**: https://www.flightradar24.com/
- **Business API**: 월 $1000+ (비현실적)
- **스크래핑**: ToS 명시적 금지
- **사용 방식**: 편명 딥링크(`https://www.flightradar24.com/<flight_id>`) + "FR24에서 보기"

### 6.5 Phase 5.5 운항 대시보드 구성
- **화면**: `/flights` 페이지 — 공항별 탭 (인천·김포·김해·제주) + 정기편 테이블
- **화물 특화 요소**:
  - 각 행에 **기종 뱃지** (ICAO 코드, 예: `B77W`)
  - **운송 성격 라벨**: `PAX(여객기)` / `CGO(화물기)` / `COMBI`
  - **화물기 only 토글 필터**
  - 뱃지 hover → Phase 5.5 초기: 기종 이름만 / Phase 5.5 완성: `max_payload_kg` + 주요 ULD 수량 (`AKE × 32, PMC × 0`)
- **수집 스케줄**: GitHub Actions 크론 `0 15,3 * * *` UTC = KST 24:00·12:00 (2회/일)
- **캐싱**: Supabase `flights_snapshots` 테이블 + Next.js ISR 5분

### 6.6 기종 Capacity 매핑 데이터 소스 (Phase 5.5)
- **Airbus Aircraft Characteristics Manual (ACM/APM)**: https://aircraft.airbus.com/en/customer-care/fleet-wide-services/airbus-services/airport-operations-and-technical-data (무료 PDF 공개)
- **Boeing Airport Compatibility Brochures**: https://www.boeing.com/commercial/airports/ (무료 PDF 공개)
- **IATA ULD Technical Manual**: 표준 ULD 코드 체계 (AKE/LD-3, PMC, PAG, ALF, LD-6, ALP, LD-11)
- **수집 방식**: 자동 스크래핑 불안정 → **사용자 본인 수작업 시드 구축** (주요 30개 기종, 1~2일)
- **데이터 모델**: Supabase `aircraft_capacity` 테이블 (icao_code, model_name, deck_type, max_payload_kg, belly_kg, main_deck_kg, uld_capacity_json, source_url)
- **검증**: 사용자 본인 11년차 경험 + 정보 제보 피드백 폼 (`/contribute`)

---

## 7. 채용 데이터 소스 (v0.3 화물 중심 전면 재편)

### 7.1 워크넷 OpenAPI — primary
- **URL**: https://www.data.go.kr/data/3038225/openapi.do
- **운영**: 고용노동부 한국고용정보원
- **승인**: data.go.kr 가입 → 2~3일 승인
- **쿼터**: 1,000콜/일
- **상업적 이용**: ✅ 공공데이터법 기준 가능
- **키워드 (v0.3 화물 중심)**:
  - 핵심: `항공화물`, `항공운송`, `국제물류`, `포워딩`, `콘솔`, `항공수출입`, `통관`, `AWB`, `항공영업`
  - 직군: `물류영업`, `수출입오퍼`, `항공오퍼`, `국제물류관리`, `공항상주`
  - 제외 키워드: `승무원`, `객실`, `지상직`, `조종사`, `정비사` (이 키워드가 포함된 공고는 자동 필터)
- **응답 필드**: 회사명·직종·근무지·급여·학력·경력·마감일·상세 URL
- **Next.js 연동**: `src/lib/api/worknet.ts`
- **구현 난이도**: ★★☆☆☆

### 7.2 사람인 OpenAPI — secondary (dedupe용)
- **URL**: https://oapi.saramin.co.kr/
- **API 가이드**: https://oapi.saramin.co.kr/guide/job-search
- **쿼터**: 500콜/일
- **상업적 이용**: ✅ 가능 (2026-04-11 정책 유지)
- **dedupe 기준**: 워크넷과 `(회사명 + 공고 제목)` 해시로 중복 제거
- **Next.js 연동**: `src/lib/api/saramin.ts`

### 7.3 항공 화물 기업 공식 채용 페이지 — 딥링크 리스트 (v0.3 전면 교체)

> **크롤링 안 함** (ADR-004 하이브리드 큐레이션 유지). 하드코딩된 URL 리스트로 "공식 채용 페이지 바로가기" 카드 노출.

| 회사 유형 | 회사명 | URL 확인 상태 | 비고 |
|---|---|---|---|
| **항공사 화물 부서** | **대한항공 카고** | https://recruit.koreanair.com (화물 필터) | ✅ 대한항공 통합 채용, 직군 필터 `화물` 사용 |
| | **아시아나 카고** | https://recruit.flyasiana.com (화물 필터) | ✅ 아시아나 통합 채용, 직군 필터 `화물` |
| | **에어인천 (화물 전용 LCC)** | https://www.airincheon.kr/ | ⏸ Phase 4 확인 |
| **대형 콘솔사** | **코스모항운** | https://www.cosmosshipping.co.kr/ | ⏸ Phase 4 확인 |
| | **우정항공** | https://www.woojungair.co.kr/ | ⏸ Phase 4 확인 |
| | **트리플크라운인터내셔널** | 개별 확인 필요 | ⏸ Phase 4 |
| | **서울항공** | 개별 확인 필요 | ⏸ Phase 4 |
| **종합 포워더 (항공과)** | **판토스** (LX Pantos) | https://recruit.pantos.com/ | ⏸ Phase 4 확인 |
| | **CJ대한통운** | https://recruit.cj.net/ | ⏸ Phase 4 확인 |
| | **한진** (Hanjin Transportation) | https://recruit.hanjin.com/ | ⏸ Phase 4 확인 |
| | **세방** | 개별 확인 | ⏸ Phase 4 |
| | **동방** | 개별 확인 | ⏸ Phase 4 |
| **지상조업 (화물터미널)** | **스위스포트 코리아** | https://www.swissport.com/en/careers | ⏸ Phase 4 |
| | **KAS 한국공항** | https://www.kasco.co.kr/ | ⏸ Phase 4 |

**주의**: 정확한 URL과 화물 직군 공고 존재 여부는 Phase 4에서 일괄 검증. 일부는 통합 리크루팅 플랫폼 (`*.recruiter.co.kr`)에 위탁되어 있음.

**확장 원칙**: 사용자 본인 업계 인맥 범위 내에서 추가 회사 요청 시 Phase 5.5에서 확장 가능.

### 7.4 ❌ 스킵 — 잡코리아·인크루트·원티드·링크드인
- **잡코리아**: 공개 API 없음
- **인크루트**: 레거시 API, 신규 사용 어려움
- **원티드**: 화물 직군 밀도 낮음, 공식 API 없음
- **링크드인**: ToS상 대량 스크래핑 금지, 공식 Jobs API 한국 미지원
- **대안**: 각각 딥링크로 "다른 플랫폼에서 보기" 푸터 카드만

### 7.5 큐레이션 플래그 (ADR-004 하이브리드 유지)
- `job_posts.status` enum: `pending | approved | rejected`
- 자동 수집 후 모두 `pending` → 사용자 본인이 일 10~30분 승인 검토 → `approved`만 공개 노출
- `source_trust_score` 1~5:
  - **5점**: 대한항공카고·아시아나카고·판토스·CJ대한통운 등 검증된 대기업 화물 부서 공식 공고
  - **4점**: 검증된 콘솔사 (코스모·우정·트리플크라운 등)
  - **3점**: 중소 포워더 일반 공고
  - **2점**: 신뢰도 불명 회사, 경력 무관·조건 불명확
  - **1점**: 학원 광고성·가맹점 모집·다단계 의심 (자동 `rejected` 후보)
- **P03(공고 파편·신뢰도) Pain 해결 방식**: 신뢰도 점수 기반 정렬 + 광고성 자동 필터링
- **수집 스케줄**: GitHub Actions 크론 `0 15 * * *` UTC = KST 24:00 (1회/일)

### 7.6 B1 (채용 담당자) 대상 `/employers` — Phase 5.5
- Phase 5 MVP에서는 없음
- Phase 5.5 진입 시 `/employers` 페이지 신설:
  - "인재풀 열람" 안내 (MVP 단계는 구독자 통계 요약)
  - "채용 공고 등록 문의" Supabase Form → `employer_inquiries` 테이블
  - 관리자 알림: Loops.so 트랜잭셔널 메일

---

## 8. Phase별 구현 로드맵 (통합)

### Phase 4 (뉴스 + 채용)
| 단계 | 작업 | 의존 |
|---|---|---|
| 1 | 공공데이터포털 가입 + KAC·IIAC·워크넷 개발키 발급 (Phase 5.5용 포함) | - |
| 2 | 네이버 개발자센터 가입 + 뉴스 검색 API 키 | - |
| 3 | `src/lib/api/` 클라이언트 4종 (naver-news, worknet, saramin, rss-parser) | 1, 2 |
| 4 | 카고프레스·CargoNews·Forwarder KR RSS 존재 여부 조사 → 연동 | - |
| 5 | Loadstar + Air Cargo News + FlightGlobal Cargo RSS + GPT-4o-mini 번역 파이프라인 | - |
| 6 | GitHub Actions 크론 2종 (news, jobs) | 3~5 |
| 7 | dedupe·캐싱·에러 핸들링·쿼터 모니터링 | 전반 |

### Phase 5 (이메일 다이제스트)
| 단계 | 작업 | 의존 |
|---|---|---|
| 1 | Vercel Cron 일일 다이제스트 발송 워크플로우 | Phase 4 |
| 2 | Loops.so 템플릿 (뉴스 4~5 카드 + 에디터 Pick + 채용 3 + 수신거부) | - |
| 3 | 관리자 대시보드 `/admin/dashboard` (Tremor + Loops API + Supabase 쿼리) | - |

### Phase 5.5 (운항 + 기종 + /employers)
| 단계 | 작업 | 의존 |
|---|---|---|
| 1 | KAC·IIAC 운항 API 연동 (기종 코드 존재 확인) | Phase 4 |
| 2 | `src/data/aircraft-types.ts` 정적 시드 30개 기종 (초기) | 1 |
| 3 | `aircraft_capacity` Supabase 테이블 마이그레이션 (완성) | 사용자 시드 자료 |
| 4 | `/flights` 페이지 + 기종 뱃지 + 화물기 토글 | 1~3 |
| 5 | `/contribute` 피드백 폼 + `capacity_feedback` 테이블 | 3 |
| 6 | `/employers` 페이지 + 문의 폼 | - |

---

## Changelog

- **2026-04-11 v0.3**: Cargo-First Pivot ([ADR-008](../adr/ADR-008-pivot-to-cargo-first.md)). 뉴스 소스 전면 교체(Simple Flying·Aviation Week 삭제 → Loadstar·Air Cargo News·FlightGlobal Cargo·카고프레스·CargoNews 중심), 채용 키워드 승무원·조종사 삭제 → 항공화물·포워딩·콘솔 중심, 항공사 공식 채용 딥링크 여객 3사 → 화물 부서(대한항공카고·아시아나카고) + 콘솔사 4개 + 대형 포워더 4개로 재편, 카테고리 매핑 재정의(화물 70% + 큰 항공 30%), 운항 §6 Phase 5.5로 이동, 기종 capacity 데이터 소스(Airbus/Boeing APM + IATA ULD Manual) §6.6 신규, 인스타 §3 비스코프 처리, `/employers` §7.6 Phase 5.5 신규.
- 2026-04-11 v0.2: Phase 1 PRD 진입 준비. §6 운항 + §7 채용 추가. **v0.3에서 카고 피벗으로 재편됨.**
- 2026-04-11 v0.1: 최초 작성 (승무원 중심). **v0.3에서 재편됨.**
