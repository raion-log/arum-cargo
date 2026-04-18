# Advisor Notes — 외부 자문가 Q&A 누적 로그

> 이 파일은 외부 자문가(멘토·투자자·업계 전문가)의 피드백을 **원본 그대로 남기는 공간**이다.
> 각 세션은 날짜 + 자문가 이름(또는 이니셜) + 질문·답변·액션아이템 형식으로 기록한다.
> 액션아이템은 반드시 `docs/references/` 또는 `docs/prd/` 의 관련 파일에 교차반영되어야 한다.

---

## 기록 템플릿

```markdown
## YYYY-MM-DD — <Advisor Name or 이니셜>

**세션 맥락**: (미팅인지, 텔레그램 대화인지, PRD 리뷰인지)
**현재 프로젝트 단계**: (Phase 0 / 1 / ...)

### Q1. <질문 요약>
**답변 원문**:
> (자문가 답변 인용)

**나의 해석**:
- (해석 포인트)

**액션아이템**:
- [ ] (실행할 것)  → 반영 파일: `docs/...`
```

---

## 열린 질문 — 다음 자문가 세션에서 검증할 것

> 사용자가 오늘 자문가와 만날 때 던질 질문 8가지. 미리 노출해둠.

1. **타겟·시장 규모 검증**: A-Side 타겟(승무원/지상직 취준생)의 국내 모집단 규모, WTP, LCC/FSC/외항사별 움직임
2. **해자 현실성**: 10년차 도메인 지식 RAG화의 실제 확보 경로. 사람인/잡코리아 카피 방어 전략
3. **Growth Loop 가설 검증**: 이메일 구독 전환율 벤치마크, 6개월·1년 구독자 수 목표, B2B 레버리지 유효 규모
4. **수익화 타임라인**: 첫 매출 시점, Affiliate vs 프리미엄 공고료 vs 구독료 순서, 초기 제휴 업체 확보 가능성
5. **법적 리스크**: 뉴스 스크래핑 저작권 범위, 워크넷/사람인 OpenAPI 상업적 재사용 조건, 정보통신망법 자문 필요성
6. **MVP 성공 기준**: 가설 검증 성공/피벗 수치의 구체적 정의, 첫 100명 구독자 유입 경로
7. **브랜딩 일관성**: RAION(사자) 이미지와 항공/DX 톤의 연결, B2C/B2B 단일 브랜드 vs 서브브랜드
8. **보류 결정 재검토**: 인스타 파트너십 DM 접근의 현실성, L-Side를 지금 당장 찌르는 역 의견

---

## 세션 로그

### 2026-04-11 — 사용자 직접 (Phase 1 PRD 진입 준비 리뷰)

**세션 맥락**: Claude Code 단독 세션. 외부 자문가 아님. 기존 실행 플랜([elegant-crafting-cocke.md](/Users/raion/.claude/plans/elegant-crafting-cocke.md))을 Phase 1 PRD 진입 전 리뷰하면서, Claude가 발견한 "실제 구현 시 막힐 지뢰 7개"를 사용자에게 질문 형태로 제시 → 사용자가 결정. 결정의 **원본 맥락**을 향후 역추적 가능하도록 여기 기록.
**현재 프로젝트 단계**: Phase 1 PRD 작성 직전
**연결 플랜**: [/Users/raion/.claude/plans/snuggly-humming-adleman.md](/Users/raion/.claude/plans/snuggly-humming-adleman.md)

### Q1. Resend 기본 도메인(`onboarding@resend.dev`)의 "본인한테만 발송" 제약을 사용자 동의로 우회할 수 있는가
**답변 원문 (Claude 리서치)**:
> ❌ 우회 불가. 정보통신망법 §50 옵트인 동의는 "**법적으로 보낼 자격**"이고 Resend DKIM/SPF 도메인 인증은 "**기술적으로 전송 경로**"로, 서로 다른 레이어. 동의 받았어도 Resend는 미인증 도메인 발송 거부. `*.vercel.app` 서브도메인도 DNS 권한 없어서 인증 불가.

**사용자 해석**:
- "우선 무료로 해보자" → 도메인 구매 ($11/년 Porkbun .com) 대신 **Loops.so 무료 티어**로 MVP 진입. 4,000건/월·1,000명 구독자까지 무료, 자체 발신 도메인 사용.
- Phase 5에서 구독자 1,000명 근접 또는 브랜드 체감 필요 시 `.com` 도메인 + Resend 전환.

**액션아이템**:
- [x] OQ-B3를 `Loops.so 무료 시작` 으로 해결 처리 → 반영 파일: [docs/open-questions.md](docs/open-questions.md)
- [x] 환경변수 블록에 `LOOPS_API_KEY` 추가, `RESEND_API_KEY`는 Phase 5 후반 전환 시점으로 미룸 → 반영 파일: [CLAUDE.md](CLAUDE.md) §6
- [ ] `docs/prd/05-email-growth-loop.md` 에 Loops.so API 연동 섹션 작성 (Phase 5)
- [ ] Loops.so의 한국 정보통신망법 §50 준수 가능 여부 (제목 `(광고)` 표기, 원클릭 수신거부) 재확인 → [docs/open-questions.md](docs/open-questions.md) OQ-M6 신규

### Q2. 운항·뉴스·채용 데이터 수집 빈도
**답변 원문 (사용자)**:
> "하루 2-3회는 꼭 필요 없을 듯. 하루 한번 정도만 해도 되지 않을까. 밤 중에 한번 하고 아침에 정리하는 형식. 혹은 밤 1번 점심 1번."

**나의 해석**:
- **D1 이메일 다이제스트**: 1회/일 KST 07:00 발송 (Vercel Cron)
- **D2 뉴스 수집**: 2회/일 KST 23:00, 13:00 (GitHub Actions)
- **D2+ 운항 수집**: 2회/일 KST 24:00, 12:00 (GitHub Actions)
- **D2+ 채용 수집**: 1회/일 KST 24:00 (채용은 분당 변동 거의 없음)

**액션아이템**:
- [x] [docs/references/09-news-sources.md](docs/references/09-news-sources.md) §6.6, §7.5 에 수집 스케줄 기록
- [ ] `docs/prd/04-api-integration.md` 에 GitHub Actions 워크플로우 명세

### Q3. 운항 대시보드 MVP 범위
**답변 원문 (사용자)**:
> "간단 테이블 + 딥링크 (Recommended) — 빠른걸로만 가도 돼. 우선 구현하는게 먼저고 그 이후에 더 좋은 방향을 잡는건 로컬로 잡아도 되니까. 다만 실 효율성, 실 효용성이 있는 결과물이어야 해. 사람들이 내 홈페이지를 통해서 여러 서비스를 얻었으면 해. 실시간 도착 확인, 출발 확인, gate 확인 등, 이런건 UBIKAIS 라는 홈페이지를 통해서 해도 좋으니까."

**나의 해석 (D3)**:
- 인터랙티브 2D 맵·Three.js WebGL·실시간 위치 추적 모두 MVP 스킵
- 공공데이터 API 기반 **"오늘의 출도착 요약" 테이블**(공항별 탭) + 각 행 `UBIKAIS`·`FR24` 딥링크 버튼
- 실시간 위치 추적이 필요한 사용자는 딥링크로 이탈 → 허용. RAION은 "허브" 역할에 집중.
- FlightRadar24는 Business API 비싸서 데이터 통합은 스킵, 딥링크만. OK.

**액션아이템**:
- [x] [docs/references/09-news-sources.md](docs/references/09-news-sources.md) §6 전체에 기록
- [ ] `docs/prd/02-i-side-information.md` 운항 대시보드 섹션에 상세 명세

### Q4. Auth 전략
**답변 원문 (사용자)**:
> "지금 얘기하는게 OAuth 얘기하는거지? 그런데 그정도는 해야 데이터가 쌓이지 않을까. 이메일 구독을 하게끔 하는게 먼저니까. 그런데 우선은 MVP 최소한의 결과물이니까 니가 말한것도 일리가 있긴함. 어떻게 하면 좋을까." → "사람들이 들어와서 로그인하라 가입하라 하면 이탈율이 많아질 것 같으니 당장은 이메일 토큰으로만 가고 나중에 Supabase로 가는게 좋을듯? 이건 추천해줘. 이메일 주소로라도 얻으면 그것도 DB니까. 그래서 구독을 하게끔 하려고 하는거야. 그러면 자동 마케팅이 되니까. Closed participants 한테 가는거니."

**나의 해석 (D4)**:
- MVP는 **Auth 없음**. 이메일 주소만 DB에 수집 (closed audience newsletter 패턴)
- 설정 변경·구독 해지는 이메일 본문에 박힌 **settings_token** 링크로만 처리 → `/subscribers/[token]` 페이지
- Supabase Auth Magic Link·OAuth는 Phase 2 이후 (북마크·히스토리 기능 붙일 때)

**액션아이템**:
- [ ] `docs/prd/03-data-model.md` `subscribers` 테이블에 `settings_token` 필드 추가
- [ ] `docs/prd/06-ui-ux-spec.md` 에 `/subscribers/[token]/settings` 플로우

### Q5. 첫 100명 구독자 획득 채널
**답변 원문 (사용자)**:
> "본인 SNS / 지인 네트워크, 네이버 카페 / 디시 항공갤, 항공운항과·승무원학원 제휴, SEO 자연 유입 기대, 인스타 노출도 좋고 인스타도 좋음."
> + "우선 홈페이지와 SNS도 연동하면 좋을듯. SNS는 항공 뉴스 카드만을 올려두는 것도 좋으니까 이것도 자동화 프로그램으로 해도 될듯. 이건 확장성이 또 있으니까."

**나의 해석 (D8)**:
- Acquisition 5채널: (1) 본인 SNS·지인 (2) 네이버 카페 스카이워커·디시 항공갤 (3) 항공운항과·승무원학원 제휴 (4) SEO 자연유입 (5) **Instagram 자동화 피드**
- Instagram 자동화: 뉴스 카드를 이미지로 렌더 → Instagram Graph API로 자동 발행 (본인 계정). Phase 5 이후 구현 가치 있음.
- SEO: Next.js ISR로 뉴스·채용 페이지 인덱싱 (`/news/[slug]`, `/jobs/[company]-[id]`), JobPosting·NewsArticle 구조화 데이터, OG 이미지 동적 생성

**액션아이템**:
- [ ] `docs/prd/00-overview.md` Acquisition 섹션에 5채널 전략 상세화
- [ ] `docs/prd/06-ui-ux-spec.md` SEO 섹션에 구조화 데이터·OG 이미지 정책
- [ ] Instagram 자동화는 `docs/prd/07-roadmap-milestones.md` Phase 5.5 스코프로 분리

### Q6. 채용 공고 큐레이션 방식
**답변 원문 (사용자)**:
> "B로 가자. 다만, 채용공고웹사이트에서 어떻게 공고를 가져올지 확인해봐. 크롤링이 가능한지. API는 따로 없을 것 같은데 이것도 정확히 파악해보자."

**나의 해석 (D5)**:
- **하이브리드 큐레이션**: 자동 수집 → `pending` → 관리자(사용자 본인) 승인 → `approved`만 공개
- 데이터 소스: 워크넷 OpenAPI(primary, 1k콜/일 무료·상업적 OK) + 사람인 OpenAPI(secondary, 500콜/일) + 항공사 공식 채용 페이지는 **크롤링 X, 딥링크만**
- 이유: `*.recruiter.co.kr` 플랫폼 대부분 → 항공사 고유 페이지가 아니라 크롤링 가치 낮고 리스크 있음

**액션아이템**:
- [x] [docs/references/09-news-sources.md](docs/references/09-news-sources.md) §7 전체에 기록
- [ ] `docs/prd/01-a-side-academy-career.md` 큐레이션 플로우 명세
- [ ] `docs/prd/03-data-model.md` `job_posts.status` enum + `source_trust_score` 필드

### Q7. Cron 인프라
**답변 원문 (사용자)**:
> "니 플랜이 더 좋을 듯 하다. 이건 아까 2번에서 얘기한것도 함께 추가로 정리가 될 듯 하네. 하루 2회 말고 더 많이해서 최신성 유지할 수 있으니까."

**나의 해석 (D6)**:
- Vercel Cron: 다이제스트 1회/일 (Hobby 플랜 2회 제한 OK)
- GitHub Actions: 뉴스·운항(각 2회/일) + 채용(1회/일) 수집
- 이유: Vercel Cron Hobby는 2회/일까지 무료인데 다이제스트 1건으로 소진 → 수집은 GitHub Actions로 분리

**액션아이템**:
- [x] OQ-M3(크론 호스팅 선택) 해결 처리 → [docs/open-questions.md](docs/open-questions.md)
- [ ] `docs/prd/04-api-integration.md`·`docs/prd/05-email-growth-loop.md` 에 각각 명세

### Q8. 디자인 지향점 (**2회 반복 — 중요**)
**답변 1차 (사용자)**:
> "Functional Clean으로 가되, 항공 쪽이니까 오렌지보다는 하늘색·파랑색·남색·하얀색 위주로 가서 깔끔하게 하는게 좋을듯. 글씨체도 더 이쁜 글씨체 많을텐데. 항공에 맞게 찾아봐. Aircompany 보다는 다른게 더 이쁜게 많은데 왜 다 뺐어?"

**답변 2차 (사용자 — D7 revision)**:
> "대시보드만 봐도 우와 할 수 있게 해줘. 스크롤에 따른 리액트 효과가 나오게끔 하면 좋을 듯 해. 3D carousel 도 괜찮았던거 같아."

**나의 해석 (D7 → D7')**:
- **컬러**: 오렌지 제외. **하늘색·파랑·남색·화이트** 기반. Joby의 `#0A1628` + 스카이블루 그라디언트.
- **타이포**: Pretendard Variable (본문) + Space Grotesk (디스플레이·숫자). 둘 다 오픈소스 프리미엄 폰트.
- **디자인 강도 (revision)**: 최초 "Functional Clean"에서 → **"Premium Animated"** 로 상향. 이유: 사용자가 "대시보드 우와" + "스크롤 리액트 효과" + "3D carousel" 명시 요청.
- **차용 레퍼런스 강화**: aircompany(기준선만) + **Joby(hero + 타이포 + 컬러)** + **aircord(그리드 + 타이포 위계)** + **Codrops 3D Carousel(Phase 1에 재투입)** + **jeantimex/flights-tracker Controls.js 패턴**
- **모션 스택 승격**: Lenis(부드러운 스크롤) + GSAP ScrollTrigger(스크롤 기반 리빌·패럴럭스) + Codrops 3D Carousel의 CSS 3D transform 포트. Framer Motion은 여전히 스킵 (GSAP로 충분).
- **성능 상충 관리**: 3D·스크롤 효과 추가로 Lighthouse 80→75 리스크. 모바일은 `prefers-reduced-motion` 감지로 저강도 버전 제공.

**액션아이템**:
- [ ] `docs/prd/06-ui-ux-spec.md` 섹션 1에 **D7 revision 기록** + Premium Animated 강도로 전체 리포인트
- [ ] 필요 라이브러리: `lenis`, `gsap` (ScrollTrigger 포함), shadcn/ui
- [ ] Codrops 3D Carousel `css/style.css` + `js/index.js` 를 React 훅으로 포팅 — 적용 위치: 랜딩 "오늘의 항공사 하이라이트" 또는 "오늘의 뉴스 TOP 5" 액센트 섹션
- [ ] Flight 대시보드(D3 간단 테이블)도 시각적 "우와" 요소 보강: 공항 탭 전환 애니메이션, 상태 배지 마이크로 인터랙션, 스크롤 인 페이드
- [ ] 저사양 모바일 폴백: `prefers-reduced-motion` 미디어 쿼리로 GSAP·3D carousel 비활성화 → Lighthouse 80+ 유지

---

## 해결된 의사결정 요약 (D1~D8)

| # | 결정 | 세션 |
|---|---|---|
| D1 | 다이제스트 1회/일 (KST 07:00 발송) | 2026-04-11 Q2 |
| D2 | 뉴스 2회/일·운항 2회/일·채용 1회/일 수집 | 2026-04-11 Q2, Q7 |
| D3 | 운항 대시보드 = 간단 테이블 + 공공데이터 API + UBIKAIS/FR24 딥링크 | 2026-04-11 Q3 |
| D4 | MVP Auth 없음. 이메일 토큰 기반 설정 관리 | 2026-04-11 Q4 |
| D5 | 하이브리드 큐레이션 (워크넷+사람인 자동 수집 → pending → 승인 → approved) | 2026-04-11 Q6 |
| D6 | Vercel Cron(다이제스트) + GitHub Actions(수집) 하이브리드 | 2026-04-11 Q7 |
| D7 | **Premium Animated** (revision): 하늘/파랑/남색/화이트 + Pretendard/Space Grotesk + GSAP·Lenis·3D Carousel + 스크롤 리빌 | 2026-04-11 Q8 (2회) |
| D8 | Acquisition 5채널: 본인 SNS / 네이버 카페·디시 / 학원 제휴 / SEO / Instagram 자동화 | 2026-04-11 Q5 |
| B3 | **OQ-B3 해결**: 이메일은 Loops.so 무료 티어로 MVP 시작. 도메인은 Phase 5 후반 | 2026-04-11 Q1 |

---

## Changelog

- 2026-04-11: 파일 생성. 템플릿 + 열린 질문 8개 등록.
