# 아름 카고 (Arum Cargo, 구 RAION Aviation DX Hub) — 프로젝트 컨텍스트

> 이 파일은 Claude(및 모든 협업자)가 이 프로젝트에서 작업할 때 반드시 지켜야 할 규칙과 맥락을 담는다.
> 새로운 결정이 생기면 즉시 이 파일을 업데이트할 것.

**2026-04-11 Cargo-First Pivot**: 본 프로젝트는 ADR-008(`docs/references/ADR-008-pivot-to-cargo-first.md`)의 결정에 따라 승무원/지상직/조종사 중심 A-Side에서 **항공 화물 중심**으로 전면 피벗되었다. 모든 PRD는 v0.3으로 재작성됨.

---

## 1. 프로젝트 한 줄 요약

**항공 화물 업계 현직자가 매일 아침 정리해주는 업계 뉴스 + 채용 허브.**
- Phase 1~5 MVP 브랜드: **아름 카고 (Arum Cargo)** — `arumcargo.vercel.app`
- Phase 7 브랜드 확장: **아름 (Arum)** — 항공 생태계 전체(카고 하위 수직)
- 타겟 핀포인트: **C1 이지훈 — 2~5년차 콘솔사/포워더 항공화물 영업·오퍼**
- North Star: **WAU (Weekly Active Subscribers)** — Phase 5+ 종료 500명 · 4주 유지율 ≥ 40% (Reforge PMF)

## 2. 작업 원칙 (Working Discipline)

### 2.1 "중요한 건 전부 .md로 고착화한다"
- 대화에서만 결정하고 파일에 안 남기는 것은 **금지**.
- 결정 시마다 반영할 위치:
  - 비즈니스 결정 → `docs/references/` 해당 파일
  - 제품·기술 결정 → `docs/prd/` 해당 파일
  - 아키텍처·전략 의사결정 → `docs/adr/` 또는 `docs/references/ADR-008` 등 ADR 파일
  - 프로젝트 규칙·컨벤션 → 이 `CLAUDE.md`
  - 결정 유보 항목 → `docs/open-questions.md`
  - 외부 자문가 Q&A → `docs/references/99-advisor-notes.md`
  - 세션 간 맥락 → 홈 MEMORY 시스템 (`~/.claude/projects/-Users-raion-Downloads-dev-raion-aviation-hub/memory/`)

### 2.2 데이터 기반 답변
- 실제 파일/코드/데이터를 확인한 후 답할 것.
- 추측 금지. 모르면 "모른다" 고 답하고 확인 경로를 제시.
- 외부 정보 인용 시 출처 텍스트(문서명, URL, 버전) 반드시 표시.

### 2.3 브랜드 규칙 (v0.3 신규)
- **프로젝트명 표기**: 첫 등장 시 "아름 카고 (Arum Cargo, 구 RAION Aviation DX Hub)" 한 번 명시 후 "아름 카고"로 일관 사용.
- **한아름종합물류 브랜드 충돌 회피**: (주)한아름종합물류(hanaleum.com)와 구분. "한" 접두어 사용 금지, "아름 카고"로 분리.
- **의미**: 아름 = "나답다" (한국어 "아름답다"). 항공 화물 산업 안에서 나답게 일할 수 있는 공간.
- **Tailwind 토큰 네임스페이스**: `arum.*` ([06 §2](docs/prd/06-ui-ux-spec.md)). `raion.*`는 v0.2 잔재로, 신규 코드에 사용 금지.
- **도메인**: MVP는 `arumcargo.vercel.app` (무료). 500명 돌파 또는 첫 제휴 문의 수신 시 `arumcargo.com` 구매 검토 (OQ-B3 해결 조건).
- **실명·회사명·학교명·직책 노출 금지**: About 페이지 포함 모든 공개 컨텐츠에서 작성자 개인정보 숨김. 드러낼 수 있는 사실은 "11년차 항공 화물 현직자"뿐.

## 3. 언어·톤 규칙

- **기본 언어**: 한국어
- **항공 화물 전문 용어**: 영어 원문 유지 + 최초 등장 시 한글 주석 또는 툴팁 (`<AviationTerm term="AWB" />`)
  - 예: `AWB(Air Waybill, 항공화물운송장)`, `ULD(Unit Load Device, 단위 적재용기)`, `TAC Index(Baltic Air Freight Index)`, `Belly(여객기 하부 화물칸)`, `Main Deck`, `Freighter`, `Combi`, `Consolidator(콘솔사)`, `Forwarder(포워더)`, `3PL(3rd Party Logistics)`
- **UI 카피**: 한국어 중심, 숫자·단위는 국제 표준(`USD`, `kg`, `km`)
- **문서 톤**: 전문가·엔지니어링. 감정 표현·이모지 과용 금지. 명확성 > 친근함.
- **에디터 Pick 금지어**: "종합" "당신답게" "뉴스레터 큐레이션" "혁신적인" "최고의" "완벽한"
- **수익화 관련 서술 금지**: "프리미엄 티어" "유료 구독" "월 요금제" "B2B SaaS" "인앱 결제" (ADR-008 결정에 따른 수익화 축 전면 제거)

## 4. 기술 스택 (확정)

| 레이어 | 선택 | 비고 |
|---|---|---|
| 프론트엔드 | Next.js 14 (App Router) + TypeScript | `web/` 디렉토리 |
| 스타일 | Tailwind CSS (`arum.*` 토큰) + shadcn/ui | 컴포넌트는 shadcn 우선, 없으면 직접 작성 |
| 폰트 | Pretendard Variable + Space Grotesk + JetBrains Mono | [06 §3](docs/prd/06-ui-ux-spec.md) |
| 모션 | **Framer Motion + tailwindcss-animate + react-intersection-observer** | GSAP·Lenis·Lottie·상시 WebGL 금지. 2026-04-18 SRS-001 Rev 0.9.1 C-TEC-003 개정 |
| 레이아웃 디자인 | Bento Grid + Gradient Blob + Scroll Parallax Hero | 메인 페이지. 3D Carousel은 `/about` 하단만 (CSS 3D + Framer Motion) |
| 아이콘 | lucide-react | |
| 날짜 | date-fns (+ date-fns/locale/ko) | |
| DB + Auth | Supabase (Magic Link + `admin_users` 화이트리스트) | 무료 티어로 MVP |
| 차트 (관리자 + 사용자 통합) | **shadcn/ui charts (Recharts 래퍼) 단일** | `/admin/dashboard` 8 KPI 카드 · `/news` 트렌드 · `/employers` 분포 모두 동일 라이브러리. SRS C-TEC-006 |
| 이메일 | **Loops.so** (MVP 무료 티어, 공용 발송 `loops.email`) → Phase 5 이후 Resend + 자체 도메인 폴백 | Loops 2,000 contacts 무료·도메인 불필요. §50 준수 OQ-M6에서 검증 |
| 번역 (LLM) | **Provider-Agnostic** (`TRANSLATION_PROVIDER` env, MVP 기본 `openai` = GPT-4o-mini). `gemini` / `anthropic` 어댑터 지원 | 월 예산 캡 $5 (`OPENAI_MONTHLY_BUDGET_CAP_USD`). SRS C-TEC-015 |
| 배포 | Vercel Hobby (`arumcargo.vercel.app`) | 500명 또는 첫 제휴 문의 시 커스텀 도메인 검토 |
| Analytics | Vercel Analytics | MUV·유입 경로 소스. 관리자 대시보드 API 통합 |

### 4.1 네이밍·구조 컨벤션
- 파일명: `kebab-case.tsx` (React 컴포넌트도 동일)
- 컴포넌트 export명: `PascalCase`
- `src/lib/api/` 에 외부 API 클라이언트, `src/app/api/` 에 Next.js API Route
- 외부 API는 **반드시 서버 사이드(API Route / 서버 컴포넌트)에서만 호출**. 클라이언트에서 직접 fetch 금지.
- 관리자 라우트는 `/admin/*` 하위에 모이고, 미들웨어 matcher `/admin/:path*`로 Magic Link 보호.

## 5. 보안·법적 주의

### 5.1 금지 사항
- **인스타그램 크롤링 금지** (Meta ToS 위반 리스크). 파트너십·공식 피드 경로만 사용.
- **뉴스 원문 저장/재배포 금지**. `제목 + 요약(2~3문장) + 원문 링크 + 출처 표기`까지만. 에디터 Pick 한 줄(≤140자)은 본인 작성이므로 허용.
- **API 키·시크릿은 절대 커밋 금지**. `.env.local`만 사용, `.env.example`로 키 이름만 공유.
- **비카고 직군 공고 승인 금지**: DB 레벨 트리거(`block_non_cargo_titles`)가 `승무원|객실|조종사|부기장|항공정비|정비사|기장` 제목을 raise exception. ingest 레벨 `EXCLUDE_RE` 필터와 이중 방어.

### 5.2 법적 준수 (한국)
- 이메일 수신동의: **더블 옵트인**(인증 메일 클릭) 필수. 정보통신망법 제50조.
- 이메일 제목: `(광고)` 접두어 필수.
- 이메일 하단: 원클릭 수신거부 링크 + 발신자 정보(사업자등록번호·주소·연락처) 필수.
- 야간(21:00-08:00 KST) 발송 금지. 다이제스트 크론은 07:00 KST 발송.
- `/privacy`(개인정보처리방침), `/terms`(이용약관) 페이지 필수.
- 뉴스 카드에는 출처명 반드시 노출.
- 개인정보 보존: `subscription_events` ≥ 13개월.

## 6. 환경 변수

`.env.local`에 들어갈 키 (`.env.example`에는 키 이름만):

```
# Naver News API (카고 14 키워드)
NAVER_CLIENT_ID=
NAVER_CLIENT_SECRET=

# 공공데이터포털 — 운항 (KAC 지방공항 + IIAC 인천) — Phase 5.5
KAC_SERVICE_KEY=
IIAC_SERVICE_KEY=

# 채용 (워크넷 primary, 사람인 secondary, 카고 10 키워드)
WORKNET_API_KEY=
SARAMIN_API_KEY=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Email (MVP: Loops.so 무료 티어)
LOOPS_API_KEY=
LOOPS_WEBHOOK_SECRET=       # Loops events webhook 서명 검증
# (Phase 5 폴백용, OQ-M6 실패 시) RESEND_API_KEY=

# Cron secret (Vercel Cron + GitHub Actions ingest 보호)
CRON_SECRET=

# Translation (LLM Provider-Agnostic, MVP 기본 openai = GPT-4o-mini)
TRANSLATION_PROVIDER=openai          # openai | gemini | anthropic
OPENAI_API_KEY=
OPENAI_MONTHLY_BUDGET_CAP_USD=5
# GOOGLE_GENERATIVE_AI_API_KEY=     # TRANSLATION_PROVIDER=gemini 사용 시
# ANTHROPIC_API_KEY=                # TRANSLATION_PROVIDER=anthropic 사용 시

# Vercel Analytics API (관리자 대시보드 MUV)
VERCEL_API_TOKEN=
VERCEL_TEAM_ID=
VERCEL_PROJECT_ID=

# 관리자 화이트리스트 (Magic Link 로그인 허용 이메일, 쉼표 구분)
ADMIN_EMAIL_WHITELIST=
```

## 7. 현재 단계

- [x] Phase 0: 레퍼런스 SSOT 작성 (01~10)
- [x] Phase 0.5: 전략·사용자 분석 확장 (11~15)
- [x] Phase 0.7: VPS + ADR 정제 (16-vps.md + ADR-001~007)
- [x] **Phase 0.8: Cargo-First Pivot** (ADR-008 + 7 레퍼런스 v0.3 재작성)
- [x] **Phase 1: PRD v0.3 전면 재작성** (`docs/prd/*.md` 9개) — 사용자 승인 대기
- [ ] Phase 2: Next.js 프로젝트 셋업 (`web/`) — `arum.*` 토큰·Supabase v0.3 마이그레이션
- [ ] Phase 3: UI (Mock 데이터) — Bento + Parallax + Blob + 3D Carousel `/about` 하단
- [ ] Phase 4: 외부 API 연동 — 카고 뉴스·채용 ingest
- [ ] Phase 5: Supabase + Loops.so + 관리자 shadcn/ui charts 대시보드 🏁 (아름 카고 MVP 완성)
- [ ] Phase 5+: 운영 — WAU 500 달성
- [ ] Phase 5.5: `/flights` + `/employers` + 기종 capacity 2단계 + `/contribute`
- [ ] Phase 6: Remember 벤치마크 커뮤니티 (비전)
- [ ] Phase 7: 모바일 앱 + "아름" 브랜드 확장 (비전)

플랜 원본: `/Users/raion/.claude/plans/elegant-crafting-cocke.md`
Phase 1 진입 플랜 (Cargo-First v3.0): `/Users/raion/.claude/plans/snuggly-humming-adleman.md`

**프로젝트 경로**: `/Users/raion/Downloads/dev/raion-aviation-hub/` (2026-04-11 이전됨, 원래 `/Users/raion/dev/`)
