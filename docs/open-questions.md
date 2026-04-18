# Open Questions — 결정 유보 / 검증 필요 항목

> 결정되지 않은 항목, 외부 확인이 필요한 것, 나중에 다시 봐야 할 것을 **한 곳에 모은다**.
> 해결되면 해당 항목을 이 파일에서 삭제하고, 결정 내용을 해당 레퍼런스/PRD 파일에 반영한다.

**2026-04-11 Cargo-First Pivot**: 승무원/지상직/조종사 중심 항목(OQ-R1·R6~R14)은 재피벗으로 인해 범위 외로 이동(§해결된 항목의 Deprecated 섹션). 신규 카고 중심 OQ가 §2·§3에 추가됨.

---

## 🔴 Blocker — 해결 안 되면 다음 Phase 진행 불가

### OQ-B1. 외부 API 키 발급 상태
- **네이버 개발자 센터**: 애플리케이션 등록 + Client ID/Secret 발급 여부 (카고 14 키워드 검색용)
- **워크넷**: OpenAPI 키 신청 + 승인 여부 (승인에 2~3일)
- **사람인**: OpenAPI 키 발급
- **OpenAI**: GPT-4o-mini 계정 + $5 크레딧 + `OPENAI_MONTHLY_BUDGET_CAP_USD=5` 설정
- **Supabase**: 프로젝트 생성 + URL/Anon Key/Service Role Key 확보
- **Loops.so**: 계정 + API Key + Webhook Secret
- **Vercel Analytics**: API Token + Team/Project ID (관리자 대시보드 MUV 수집)
- **(Phase 5.5)** 공공데이터포털 KAC + IIAC API Key (운항 데이터, Phase 5.5 진입 전)
- **해결 시점**: 각 Phase 진입 전
- **담당**: 사용자
- **상태**: ⏸ 대기

### ~~OQ-B2. 사업자 등록·도메인 보유 여부~~
- ✅ 해결 (2026-04-11) — Loops.so 무료 티어로 전환 (OQ-SOLVED-5), 도메인 구매 OQ-L3.

### ~~OQ-B3. 도메인 이름·구매 경로~~
- ✅ 해결 (2026-04-11 Cargo-First Pivot) — MVP는 **`arumcargo.vercel.app`** 무료. 500명 또는 첫 제휴 문의 수신 시 `arumcargo.com` 구매 재검토. (OQ-SOLVED-9)

---

## 🟡 주요 결정 유보 — 빠르면 좋은 것

### OQ-M1. 외국 카고 뉴스 번역 API 선택
- **잠정 결정 (2026-04-11)**: **OpenAI GPT-4o-mini로 시작**. 카고 전문 용어(AWB·ULD·TAC Index·Belly Cargo·Freighter) 대응력·프롬프팅 유연성·비용(토큰당 $0.00015) 측면에서 가장 균형 잡힌 선택.
- **검증 계획**: Phase 4에서 OQ-R17 A/B 테스트로 "카고 전문 용어 하이퍼스페시픽 프롬프트 vs 일반 번역 프롬프트" 품질 비교. `assertNoHallucination` 기준 통과율 95% 이상 요구.
- **반영 파일**: `docs/prd/04-api-integration.md` v0.3 §5, `docs/references/09-news-sources.md` v0.3

### OQ-M2. 이메일 인증 토큰 관리 방식
- 자체 UUID 토큰 테이블 (`subscribers.verification_token`·`settings_token`) 유지 결정 (MVP Auth 없음)
- 단 **관리자용** Supabase Auth Magic Link는 `/admin/*` 보호용으로 Phase 5부터 사용 (v0.3 관리자 대시보드 추가)
- 만료 정책: `verification_token` 24h · `settings_token` 무기한 (단일 구독자 전용) · Magic Link 1h
- **해결 시점**: Phase 5 Supabase 스키마 확정 전 (v0.3 `admin_users` 테이블 포함)
- **반영 파일**: `docs/prd/03-data-model.md` v0.3, `docs/prd/05-email-growth-loop.md` v0.3

### ~~OQ-M3. 일일 다이제스트 크론 호스팅~~
- ✅ 해결 (2026-04-11, D6) — Vercel Cron(다이제스트) + GitHub Actions(수집) 하이브리드.

### OQ-M4. 뉴스 이미지 썸네일 처리
- 원본 이미지 직접 링크 (Next.js Image + remotePatterns) vs 자체 다운로드 캐싱
- 카고프레스·Loadstar·Air Cargo News UK는 `og:image` 제공 가정
- **해결 시점**: Phase 3 UI 초기
- **반영 파일**: `docs/prd/06-ui-ux-spec.md` v0.3

### OQ-M5. 아름 카고 로고·브랜드 에셋
- **부분 해결 (2026-04-11 v0.3)**: 오렌지 제거, 네이비·블루·스카이·화이트 팔레트 확정 (`arum.ink/navy/sky/blue/cloud/blob` 토큰). Pretendard Variable + Space Grotesk + JetBrains Mono 페어링 확정. Gradient Blob 3색(`arum.blob.sky/blue/violet`) 추가.
- **미결**: 로고(심볼 + 워드마크) SVG 원본 확보 — "아름 카고" 한글 + "Arum Cargo" 영문 이중 로고 필요
- **해결 시점**: Phase 2 Tailwind config 커밋 시
- **반영 파일**: `docs/prd/06-ui-ux-spec.md` v0.3 §2, `web/tailwind.config.ts` (Phase 2)

### OQ-M6. Loops.so 정보통신망법 §50 준수 가능 여부
- **배경**: Loops.so 무료 티어 `loops.email` 공용 발송으로 MVP. 미국 서비스라 한국 법 요구사항 확인 필요.
- **확인 항목**:
  1. 이메일 제목에 `(광고)` 라벨 강제 삽입 가능한가 (템플릿 변수 or Subject 필드)
  2. 원클릭 수신거부 링크가 본문에 자동 포함되는가 (불가 시 템플릿에 수동 삽입)
  3. 발신자 정보(사업자명·연락처·주소) footer 표시 가능한가
  4. 수신 동의 시점·IP 기록 여부 (법적 입증 자료) — 우리 DB `subscription_events`로 자체 기록 대체
  5. 야간(21~08시) 발송 회피 — Vercel Cron `/api/cron/daily-digest`에 `hours < 6 || > 10 → 403` 게이트 자체 구현 (05 §7)
  6. **(v0.3 신규)** Webhook events 전송 (opens·clicks) → `email_events` → `subscribers.last_active_at` → WAU 집계 플로우 지연 ≤ 5분
- **검증 방법**: Loops.so 문서 + 지원팀 티켓 + 실제 테스트 발송 (본인 메일)
- **폴백**: 1~3번 중 1개라도 실패 시 → Phase 5에서 Resend + 커스텀 도메인 전환 (OQ-L3)
- **해결 시점**: Phase 5 진입 전
- **반영 파일**: `docs/prd/05-email-growth-loop.md` v0.3

---

## 🆕 v0.3 Cargo-First Pivot 신규 OQ

### OQ-C1. About 페이지 초안 A/B/C 중 사용자 선택 🆕
- **배경**: [06 §5.10](./prd/06-ui-ux-spec.md) v0.3에 3개 초안 수록 (정서 블록 / 문제 정의 / Morning Brew 간결)
- **공통 제약**:
  - 드러낼 것: 11년차 항공 화물 현직자 + 왜 만드는지
  - 숨길 것: 이름, 회사, 학교명, 직책, "익명 유지한다" 직접 언급 (구구절절 설명 자체가 역효과)
  - 금지어: "종합", "당신답게", "뉴스레터 큐레이션"
  - 참고 톤: Stripe About / Vercel About / Linear About
- **해결 방법**: 사용자가 3개 중 1개 선택 또는 혼합본 제안
- **해결 시점**: Phase 2~3 UI 진입 전
- **반영 파일**: `docs/prd/06-ui-ux-spec.md` §5.10, `web/src/app/about/page.tsx` (Phase 3)

### OQ-C2. 에디터 Pick 톤앤매너 검증 🆕
- **배경**: 에디터 Pick은 v0.3 핵심 차별화 축. 뉴스의 ≥60% 커버리지 목표, 140자 이하, 3 톤(OBSERVATION·ACTION_ITEM·CONTEXT). 매일 3~4개 작성이 현실적으로 감당 가능한지 사전 검증 필요.
- **검증 방법**: Phase 3~4 Mock 데이터 단계에서 사용자가 실제 카고프레스·Loadstar 기사 5건을 기반으로 Pick 5개 초안 작성 → 본인 자기 검수 + Claude 피드백. 톤 일관성·140자 제한·금지어 준수 체크.
- **결과에 따른 의사결정**:
  - 감당 가능 → Phase 5 DoD에 ≥60% 커버리지 유지
  - 부담이 큼 → 주간 배치 작성(일요일에 5일치) 실험, 또는 목표 40%로 완화, 또는 OpenAI로 초안 생성 후 수정 방식
- **해결 시점**: Phase 3~4 말
- **반영 파일**: `docs/prd/02-i-side-information.md` §5, `docs/prd/07-roadmap-milestones.md` §7.4

### OQ-D1. 기종 Capacity 시드 자료 수집 (Phase 5.5) 🆕
- **배경**: Phase 5.5에서 `web/src/data/aircraft-types.ts` 정적 파일(30 ICAO 코드) → `aircraft_capacity` Supabase 테이블(ULD jsonb 포함) 2단계 구축. 자동 스크래핑 불안정(Airbus APM·Boeing APM PDF)이라 수작업 시드가 현실적.
- **수집 대상**:
  - ICAO 코드 (예: B77W, B744F, A359, A333F)
  - 기종명 (Boeing 777-300ER 등)
  - Deck 유형 enum (passenger/freighter/combi)
  - 최대 화물 중량 (`max_payload_kg`)
  - 여객기 belly 용량 (`belly_kg`) / Freighter main deck 용량 (`main_deck_kg`)
  - 표준 ULD 수용량 jsonb (예: `{"AKE": 32, "PMC": 0}`) — AKE/LD-3, PMC, PAG, ALF, LD-6, ALP, LD-11 등 IATA 표준
  - 출처 URL (Airbus APM / Boeing APM)
- **해결 방법**: 사용자가 본인 정리해둔 자료 + Airbus/Boeing APM PDF 교차 검증 → 30 ICAO 우선 작성
- **해결 시점**: Phase 5.5 진입 전
- **반영 파일**: `docs/prd/03-data-model.md` §7 `aircraft_capacity`, `web/src/data/aircraft-types.ts` (Phase 5.5)

### OQ-R16. 한아름종합물류 브랜드 충돌 — 상표 출원 🆕
- **배경**: 아름 카고 (Arum Cargo)와 (주)한아름종합물류(hanaleum.com) 브랜드 혼동 가능성
- **확인 항목**:
  1. 특허청 상표 검색에서 "아름 카고" / "Arum Cargo" 선출원 존재 여부
  2. 동일 업종(운송·물류 분류 39류)에서 한아름종합물류가 "한아름" 상표를 보유 중인지
  3. 상표 분리 출원 가능 여부 ("한" 접두어 제거 전략)
- **해결 방법**: 특허청 `kipris.or.kr` 검색 → 필요시 변리사 자문
- **해결 시점**: Phase 5+ 구독자 500명 돌파 시 또는 첫 제휴 문의 수신 시
- **반영 파일**: `docs/prd/07-roadmap-milestones.md` §7.4

### OQ-R17. 카고 뉴스 번역 A/B 테스트 (v0.3 재정의)
- **v0.3 변경**: 기존 "한글 요약본 vs 원문 링크만"에서 **"카고 전문 용어 하이퍼스페시픽 프롬프트 vs 일반 번역 프롬프트"**로 범위 재정의
- **검증 방법**: Phase 4 초기 A/B 분기 (뉴스 기사 50/50 split). 기준:
  - `assertNoHallucination` 통과율 (숫자·출처 검증)
  - 사용자(본인) 수동 채점 (10점 만점) — AWB/ULD/TAC Index 등 용어 정확도
  - 에디터 Pick 작성 시 요약문 재활용률 (높을수록 번역 품질 좋음)
- **목표**: 하이퍼스페시픽 프롬프트가 일반 프롬프트 대비 수동 채점 +1.5점 이상
- **반영 파일**: `docs/prd/04-api-integration.md` v0.3 §5

### OQ-R18. WAU 500 / 12주 달성 가능성 검증 🆕
- **배경**: 기존 "100 verified / 90일"에서 v0.3 "WAU 500 / 12주"로 목표 강화. 실제 달성 가능성 사전 검증 필요.
- **검증 방법**:
  - 카고 페르소나 타겟 시장 크기 재검증 ([11-tam-sam-som.md](./references/11-tam-sam-som.md) v0.3)
  - LinkedIn 한국 화물 그룹·화물 네이버 카페·사람인 카고 직군 활성 사용자 수 파악
  - 유사 도메인 뉴스레터 (Morning Brew 초기 100일 WAU, Stratechery 초기, Morning Paper 등) 벤치마크
- **결과에 따른 의사결정**:
  - 달성 가능 → 목표 유지
  - 어려움 → WAU 300 / 12주로 하향 조정
- **해결 시점**: Phase 5 진입 전
- **반영 파일**: `docs/prd/00-overview.md`, `docs/prd/07-roadmap-milestones.md` §7.2

### OQ-R19. 양면 시장 활성화 타이밍 🆕
- **배경**: Phase 5.5 `/employers` 개장이 WAU 지표에 의존. 초기에 열면 인재풀이 너무 작아 기업이 실망, 너무 늦게 열면 B1 페르소나(채용 담당자) 접점 손실.
- **검증 방법**: 파일럿 단계에서 B1 페르소나 3명 DM 인터뷰 → "인재풀 몇 명이면 채용 등록 의향이 생기는가?" 질문. 예상 answer: 200~500명.
- **결과에 따른 의사결정**:
  - WAU 300 달성 시 `/employers` placeholder 오픈, 인재풀 카테고리 분포 차트만 노출, 문의 폼은 "곧 오픈" 문구
  - WAU 500 달성 시 full Phase 5.5 진입
- **해결 시점**: Phase 5 WAU 300 도달 직후
- **반영 파일**: `docs/prd/07-roadmap-milestones.md` §8

### OQ-R20. 관리자 대시보드 데이터 지연 및 신뢰도 🆕
- **배경**: `/admin/dashboard` Tremor 카드는 Supabase + Loops API + Vercel Analytics 3개 소스를 조합. Loops webhook 딜레이 ≤ 5분 목표인데 실측이 필요.
- **검증 방법**:
  - Phase 5 진입 직후 본인 이메일로 테스트 발송 → open/click 이벤트가 Loops webhook → `email_events` → `subscribers.last_active_at` → WAU 카드에 반영되는 시간 측정
  - Vercel Analytics API 응답 시간 및 결측 여부 (특히 MUV)
  - `/api/admin/metrics` p95 응답 ≤ 2s 달성 여부
- **해결 시점**: Phase 5 DoD 검증
- **반영 파일**: `docs/prd/05-email-growth-loop.md` §9

---

## 🟢 검증 필요 — 자문가·리서치 필요

### OQ-R2. 이메일 뉴스레터 구독 전환율 벤치마크 (카고 도메인)
- 카고 B2C 뉴스레터 전환율 벤치마크 (현재는 2~5% 가정)
- **검증 방법**: Substack, Loops 공개 통계, 화물 도메인 유사 뉴스레터 (Air Cargo Week newsletter, Loadstar newsletter, CargoNews 등) 사례
- **반영 파일**: `docs/references/07-key-success-factors.md` KPI 섹션

### OQ-R3. 국내 항공 화물 매체 RSS 존재 여부
- 카고프레스·CargoNews 각각의 RSS URL 조사 필요 (해외 Loadstar·Air Cargo News UK·FlightGlobal Cargo는 RSS 확인 완료로 간주)
- **검증 방법**: 각 사이트 `/rss`, `/feed`, `/rss.xml` 수동 확인 + robots.txt
- **해결 시점**: Phase 4 초반
- **반영 파일**: `docs/references/09-news-sources.md` v0.3

### OQ-R4. 카고 뉴스 스크래핑 국내 저작권 판례
- "제목 + 2~3문장 요약 + 원문 링크" 형식의 법적 안전 범위
- 추가: 에디터 Pick(≤140자) 본인 작성분이므로 저작권 문제 없음
- **검증 방법**: 변호사 자문 또는 유사 판례 리서치
- **해결 시점**: Phase 4 이전
- **반영 파일**: `docs/references/09-news-sources.md` v0.3

### OQ-R5. 초기 제휴 포워더·콘솔사 확보 가능성
- 콘솔사·포워더·3PL 파트너 몇 곳 초기 확보 가능? (Phase 5.5 `/employers` 진입 조건)
- **검증 방법**: 사용자가 실제 업체 리스트업 (B1 페르소나 타겟 5곳) + DM·콜드 메일 시도
- **해결 시점**: Phase 5 말~Phase 5.5 진입 전
- **반영 파일**: `docs/prd/01-a-side-academy-career.md` v0.3

### OQ-R15. AOS/DOS 점수 재검증 (카고 Pain 14 기준)
- v0.3 재추출된 카고 Pain 14개 Importance/Satisfaction 점수는 현재 **추정치**. C1 이지훈·C2·C3 페르소나 실 사용자 5명+ 인터뷰로 재산정 필요
- **검증 방법**: C1 콘솔사 영업 2명 + C2 신입 1명 + C3 시니어 1명 + B1 채용 담당자 1명 심층 인터뷰 (JTBD 방식)
- **해결 시점**: Phase 3 UI 검증 단계 또는 Phase 5+ 운영
- **반영 파일**: `docs/references/15-aos-dos-opportunity.md` v0.3

---

## ⚪ 나중에 (Phase 6+)

### OQ-L1. L-Side AWB 서류 샘플 수집
- 실제 AWB 샘플 PDF 여러 건 확보 필요 (RAG 학습 데이터)
- **시점**: Phase 7+ 또는 별도 사업 (v0.3에서 L-Side B2B SaaS 축 유예)

### OQ-L2. 항공사·포워더 파트너십 접촉 경로
- 대한항공카고·아시아나카고·에어인천·판토스·CJ대한통운·한진 등 공식 제안 넣을 채널
- **시점**: Phase 5+ 첫 제휴 문의 이후

### OQ-L3. 자체 도메인 구매 + Loops/Resend 커스텀 발신
- MVP 이후 `arumcargo.com` 구매 → Loops 유료 전환 또는 Resend + 커스텀 도메인으로 마이그레이션
- **시점**: 구독자 500명 돌파 또는 첫 제휴 문의 수신 또는 OQ-M6 실패 시

### OQ-L4. 영어·다국어 지원
- 글로벌 확장 시 next-intl 도입
- **시점**: Phase 7 "아름" 브랜드 확장 시

### OQ-L5. Deep Domain RAG 엔진 구축
- 11년차 항공 화물 지식을 벡터 DB로 이식 (에디터 Pick 자동 초안 생성 포함 가능성)
- **시점**: Phase 6+ Remember 커뮤니티 활성 후

### OQ-L6. Phase 6 Remember 벤치마크 커뮤니티 상세 PRD 🆕
- 승진/이직 타임라인, 직군별 익명 라운지, 회사 이메일 도메인 인증, 모더레이션 정책
- **시점**: Phase 5 완료 후 별도 PRD 작성

### OQ-L7. Phase 7 모바일 앱 프레임워크 선택 🆕
- Capacitor vs Expo Web 브릿지 2주 프로토타입 비교
- **시점**: Phase 6 진입 후

### OQ-L8. ULD 레이아웃 시각화 (기내 배치도) 🆕
- 어느 칸에 어느 컨테이너(AKE·PMC 등)가 들어가는지 시각화
- 사용자 요청이 있을 때만 진행 (기본 비스코프)
- **시점**: Phase 6+

---

## 해결된 항목 (참고용 기록)

### ✅ OQ-SOLVED-1 (2026-04-11) — MVP 스코프 확정
- 결정: A-Side + I-Side 대시보드로 출발. L-Side는 Phase 2
- **v0.3 업데이트**: A-Side 의미 재정의 → 카고 채용. L-Side는 Phase 7+ 또는 별도 사업으로 유예.
- 반영: `docs/references/02-hub-architecture.md`, `docs/references/ADR-008-pivot-to-cargo-first.md`

### ✅ OQ-SOLVED-2 (2026-04-11) — 기술 스택 확정
- 결정: Next.js 14 + TS + Tailwind + shadcn/ui + Supabase + Loops.so
- **v0.3 추가**: Tremor (관리자 대시보드), shadcn/ui charts (사용자 화면), `arum.*` Tailwind 네임스페이스
- 반영: `CLAUDE.md`

### ✅ OQ-SOLVED-3 (2026-04-11) — 인스타그램 크롤링 방침
- 결정: MVP에서 보류. Phase 2 이후 파트너십 DM 접근
- 반영: `docs/references/09-news-sources.md`

### ✅ OQ-SOLVED-4 (2026-04-11) — UI 언어 원칙
- 결정: 한국어 중심, 항공(화물) 용어는 영어 원문 + 툴팁
- **v0.3 추가**: `<AviationTerm>` 컴포넌트에 카고 용어(AWB·ULD·TAC Index·Belly·Main Deck·Consolidator·Forwarder) 포함
- 반영: `CLAUDE.md`, `docs/references/10-aviation-glossary.md`

### ✅ OQ-SOLVED-5 (2026-04-11) — 이메일 발송 서비스 (구 OQ-B3)
- 결정: Loops.so 무료 티어. §50 준수는 OQ-M6에서 후속 검증.
- 반영: `docs/prd/05-email-growth-loop.md` v0.3, `CLAUDE.md`

### ✅ OQ-SOLVED-6 (2026-04-11) — 운항 데이터 소스
- 결정: 공공데이터포털 KAC + IIAC API (무료, 상업적 이용 OK, 10만콜/일). UBIKAIS·FR24는 딥링크만.
- **v0.3 업데이트**: Phase 4에서 Phase 5.5로 이동 (운항 데이터는 Phase 5 MVP 스코프 외).
- 반영: `docs/references/09-news-sources.md` v0.3 §6, `docs/prd/04-api-integration.md` v0.3 §10

### ✅ OQ-SOLVED-7 (2026-04-11) — 채용 데이터 소스
- 결정: 워크넷 primary + 사람인 secondary (dedupe `(회사명+공고제목)` 해시). 공식 채용 페이지는 딥링크 카드.
- **v0.3 업데이트**: 키워드를 카고 10종으로 교체, `scoreTrust` 카고 키워드 보너스 +0.5, `block_non_cargo_titles` 트리거 추가, `cargo_career_links` 14사 (대한항공카고·아시아나카고·에어인천·판토스·CJ대한통운·한진·코스모항운·트리플크라운·우정항공·서울항공·세방·동방·스위스포트·KAS).
- 반영: `docs/references/09-news-sources.md` v0.3 §7, `docs/prd/01-a-side-academy-career.md` v0.3, `docs/prd/03-data-model.md` v0.3

### ✅ OQ-SOLVED-8 (2026-04-11) — Auth 전략
- 결정: MVP Auth 없음. 이메일 토큰 기반 설정 관리만.
- **v0.3 추가**: 관리자 `/admin/*`에만 Supabase Auth Magic Link + `admin_users` 화이트리스트 적용 (Phase 5).
- 반영: `docs/prd/03-data-model.md` v0.3

### ✅ OQ-SOLVED-9 (2026-04-11 Cargo Pivot) — 브랜드명·도메인 확정 🆕
- 결정: 브랜드 **아름 카고 (Arum Cargo)**. MVP 도메인 **`arumcargo.vercel.app`** 무료. 500명 돌파 또는 첫 제휴 문의 시 `arumcargo.com` 구매 재검토.
- 근거: ADR-008 Cargo-First Pivot
- 반영: `CLAUDE.md`, `docs/references/ADR-008-pivot-to-cargo-first.md`, `docs/prd/00-overview.md` v0.3

### ✅ OQ-SOLVED-10 (2026-04-11 Cargo Pivot) — North Star 지표 확정 🆕
- 결정: **WAU (Weekly Active Subscribers)** — Phase 5+ 종료 500명·4주 유지율 ≥40% (Reforge PMF)
- 근거: Amplitude NSM Playbook (John Cutler 2019), Reforge Growth Series (Brian Balfour), Morning Brew Axios 2020 인터뷰, Substack/Beehiiv 대시보드 표준
- 반영: `docs/references/16-vps.md` v0.3 §3, `docs/prd/00-overview.md` v0.3 §6, `docs/prd/05-email-growth-loop.md` v0.3 §9, `docs/prd/07-roadmap-milestones.md` v0.3 §7.2

### ✅ OQ-SOLVED-11 (2026-04-11 Cargo Pivot) — 페르소나 핀포인트 🆕
- 결정: **C1 이지훈 — 2~5년차 콘솔사/포워더 항공화물 영업·오퍼** 단일 Core 페르소나. Secondary C2 박서연(1년차)·C3 김태영(6~10년차), Adjacent A1(학과생), B-side B1(채용 담당자).
- 근거: 사용자 본인 실 경험 11년차 카고 현직자 → 도메인 신뢰도·에디터 Pick 작성 역량 교차점
- 반영: `docs/references/13-personas.md` v0.3, `docs/prd/00-overview.md` v0.3 §5

### ✅ OQ-SOLVED-12 (2026-04-11 Cargo Pivot) — 수익화 축 제거 🆕
- 결정: 유료 구독·프리미엄 티어·B2B SaaS·월 요금제·인앱 결제·API 상용화 **전면 제거**. 남긴 축은 "자연 광고 유입" (제휴 항공사·학원·포워더가 먼저 연락 오는 구조) 한 축만.
- 근거: ADR-008, 차별화를 "도메인 전문성 + 에디터 Pick"으로 집중하기 위해 수익 다각화 유혹 차단
- 반영: `docs/references/16-vps.md` v0.3, `docs/prd/07-roadmap-milestones.md` v0.3 §11

### 🗑 Deprecated (2026-04-11 Cargo Pivot) — 승무원/지상직/조종사 OQ들
다음 OQ들은 v0.3 Cargo-First Pivot으로 범위 외로 이동. 재피벗이 없는 한 재활성화되지 않음:
- ~~OQ-R1 승무원/지상직 취준생 시장 규모~~
- ~~OQ-R6 항공학과 재학생(S2) 디지털 접근 성향~~ (A1 카고 학과생으로 일부 대체)
- ~~OQ-R7 진로지도 교사(S5·A1)~~
- ~~OQ-R8 현직 주니어(승무원·지상직)~~
- ~~OQ-R9 C1 김지원 학원 수강생~~ (C1 이지훈으로 교체)
- ~~OQ-R10 C3 이수진 현직 주니어(승무원)~~ (C3 김태영 시니어 카고로 교체)
- ~~OQ-R11 A1 한은경 학원 B2B~~ (B1 콘솔사 채용 담당자로 재정의)
- ~~OQ-R12 E1 강철수 시니어 Avgeek UI~~ (시니어 UI는 카고 C3 페르소나로 흡수)
- ~~OQ-R13 C1 학원 수강생 재방문~~ (WAU 지표로 일반화)
- ~~OQ-R14 E2 Avgeek 유료 전환~~ (수익화 축 제거로 무효)

---

## Changelog

- **2026-04-11 (v0.3 Cargo-First Pivot)**: ADR-008 피벗 반영. 신규 OQ 9개 추가 (OQ-C1 About 초안·OQ-C2 에디터 Pick 톤·OQ-D1 기종 capacity 시드·OQ-R16 상표 충돌·OQ-R17 카고 번역 A/B 재정의·OQ-R18 WAU 500 달성 가능성·OQ-R19 양면시장 타이밍·OQ-R20 대시보드 데이터 지연·OQ-L6~L8 Phase 6~7 상세). OQ-B3 해결(SOLVED-9 arumcargo.vercel.app), SOLVED-10~12 신규(North Star WAU·페르소나 C1 이지훈·수익화 제거). 승무원/지상직/조종사 OQ 10개 Deprecated 섹션으로 이동. OQ-M1·M5·R15·R17 v0.3 재정의.
- 2026-04-11: Phase 1 PRD 진입 세션. D1~D8 결정 반영. OQ-B2 Loops.so 전환으로 해결, OQ-M1 OpenAI GPT-4o-mini 잠정 결정, OQ-M3 Vercel+GitHub Actions 하이브리드로 해결, OQ-M5 팔레트·폰트 부분 해결, OQ-M6(Loops.so 한국법 준수) 신규 추가. Solved 5→8개 (OQ-SOLVED-5~8 추가).
- 2026-04-11: CJM + AOS/DOS 작성 후 Research 5개 신규 추가 (OQ-R13~R17). 총 Research 17개.
- 2026-04-11: TAM/SAM/SOM + 페르소나 작성 후 Research 7개 신규 추가 (OQ-R6~R12). 총 Research 12개.
- 2026-04-11: 최초 작성. Blocker 2개, Major 5개, Research 5개, Later 5개, Solved 4개.
