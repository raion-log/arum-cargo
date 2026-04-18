# PRD 06 — UI/UX Spec (v0.3 Cargo-First)

> 아름 카고(Arum Cargo)의 디자인 시스템 + 화면별 와이어프레임 + 컴포넌트 · 반응형 · 접근성 · SEO.
> 앵커: [00-overview.md](./00-overview.md) · 피벗 원본: [ADR-008 Pivot to Cargo-First](../references/ADR-008-pivot-to-cargo-first.md) · D7 결정 원본: [99-advisor-notes.md 2026-04-11](../references/99-advisor-notes.md)

**버전**: v0.3 · **관련 ADR**: [ADR-006 Premium Animated](../adr/ADR-006-design-premium-animated.md) · [ADR-008 Cargo-First Pivot](../references/ADR-008-pivot-to-cargo-first.md)

---

## 0. v0.3 변경 요약

- **브랜드**: RAION Aviation DX Hub → **아름 카고 (Arum Cargo)**. 토큰 네임스페이스 `raion.*` → `arum.*`. 도메인 `raion.kr` → `arumcargo.vercel.app` (MVP 무료).
- **Hero 구성**: Premium Animated 유지하되, 메인 페이지를 **Bento Grid + Gradient Blob + Scroll Parallax Hero**로 재구성. 3D Carousel은 메인에서 제거하고 `/showcase` 또는 `/about` 하단 액센트 섹션으로 이동.
- **페르소나**: 카피·와이어프레임에서 승무원/지상직/조종사 서술 삭제. C1 이지훈(2~5년차 콘솔사 영업·오퍼), C2 박서연(1년차 신입), C3 김태영(6~10년차 시니어)을 기준으로 재작성.
- **차트 라이브러리 단일화 (2026-04-18 Amendment)**: 관리자·사용자 화면 모두 **shadcn/ui charts (Recharts 래퍼) 단일** 사용. Tremor 도입 취소. ([05 §9](./05-email-growth-loop.md), [SRS C-TEC-006](../srs/SRS-001-arum-cargo.md))
- **About 페이지**: Phase A 초안 3개 수록. 한서대/학과명/회사명/"익명 유지" 명시는 제거. 11년차 항공 화물 현직자라는 사실 + "왜 만드는지"만 드러냄. Stripe/Vercel/Linear About 톤 참고.
- **품질 하한선**: [uvengers-website.vercel.app](https://uvengers-website.vercel.app) (사용자 본인 작업물) 이상. Phase 2~3 디자인 QA 게이트에 명시.
- **Phase 5.5 와이어프레임 신규**: `/flights`, `/employers`, `/contribute` 3개 화면 스펙 §5.7~§5.9.
- **수익화 제거**: "프리미엄" "요금제" "B2B SaaS" 등 수익화 관련 카피 전면 삭제. 자연 광고 유입만.

---

## 1. 디자인 지향 (D7 수정본 + v0.3 Bento 전환)

### 1.1 원칙

- **베이스**: Functional Clean — 타이포 위계·그리드 리듬·화이트스페이스
- **레이어**: Premium Animated — **Framer Motion** 스태거드 리빌·`useScroll` Parallax + CSS `scroll-behavior: smooth` (2026-04-18 Amendment: Lenis+GSAP 제거)
- **v0.3 메인 컴포지션**: **Bento Grid + Gradient Blob Background + Scroll Parallax Hero**. 3D Carousel은 서브 페이지 액센트.
- **목표 감정**: "항공 화물 업계 현직자가 매일 아침 정리해 주는 단정한 브리핑 · 첫 방문에서 '일하는 사람의 손맛' 체감"
- **금지**: 오렌지 계열, 화려한 무지개 그라데이션 오버사용, 과도한 Lottie, 배터리 드레인하는 상시 WebGL, "~야" 반말 톤, "종합" "뉴스레터 큐레이션" 같은 식상한 업계 클리셰.

### 1.2 레퍼런스별 차용 요소

| 레퍼런스 | 차용 | 적용 위치 |
|---|---|---|
| **Vercel** (https://vercel.com) | Bento Grid 섹션 구성, 카드 내부 마이크로 인터랙션 | 랜딩 메인 Bento |
| **Linear** (https://linear.app) | Gradient Blob 배경(라지 radial blur 2~3개), 본문 화이트스페이스 밸런스 | 랜딩 Hero 배경, 섹션 구분 |
| **Apple iCloud+ / Raycast** | Scroll Parallax Hero — 스크롤 1~2 화면 내 요소 레이어드 이동 | 랜딩 Hero |
| **Joby Aviation** (https://jobyaviation.com) | 네이비·블루·화이트 팔레트, 스태거드 텍스트 리빌(0.5s 지연) | 섹션 타이틀 리빌 |
| **aircord.co.jp** | CJK 그리드 리듬(`--gw` 여백 변수), 본문 line-height 1.6 | 전역 레이아웃, 뉴스 카드 그리드 |
| **jeantimex/flights-tracker** (MIT) | 필터 상태 관리 패턴 (React hooks 이식) | `/jobs` 필터 사이드바, `/flights` Phase 5.5 |
| **Codrops/3DCarousel** (MIT) 포트 | CSS 3D `transform-style: preserve-3d` + Framer Motion `useMotionValue` | `/showcase` 또는 `/about` 하단 액센트 (WebGL·GSAP 미사용) |
| **uvengers-website.vercel.app** | 품질 하한선 (사용자 본인 작업) — 여백, 폰트 랜더링, 애니메이션 타이밍 수준 | 전체 품질 QA 기준 |
| **Stripe About / Vercel About / Linear About** | 간결·자신감·친근 About 톤 | `/about` 카피 |
| **Morning Brew** (https://morningbrew.com) | "매일 아침 한 통" 서술 구조, 헤더 브리핑 카피 톤 | 랜딩 Hero 카피, 구독 CTA |

---

## 2. 컬러 팔레트 (Tailwind tokens — `arum.*` 네임스페이스)

```ts
// web/tailwind.config.ts — theme.extend.colors.arum
arum: {
  // 베이스: 다크 네이비 → 항공 화물 프리미엄 기조
  ink:    '#0A1628',   // 가장 깊은 네이비 (hero 배경, footer)
  navy:   '#102A43',   // 프라이머리 다크 (카드 배경, 네비)
  slate:  '#334E68',   // 본문 2차 텍스트

  // 블루 스펙트럼: 하늘 → 파랑 → 남색
  sky: {
    50:  '#F0F9FF',   // 배경 틴트
    100: '#E0F2FE',
    300: '#7DD3FC',   // 라이트 액센트, 에디터 Pick 좌측 바
    500: '#0EA5E9',   // 브랜드 스카이
    700: '#0369A1',   // 짙은 스카이
  },
  blue: {
    500: '#0066CC',   // 브랜드 메인 (CTA, 링크)
    600: '#0052A3',   // hover
    700: '#003D7A',   // active
  },

  // Gradient Blob 전용 (§4 배경)
  blob: {
    sky:    '#38BDF8', // radial blur 1
    blue:   '#3B82F6', // radial blur 2
    violet: '#6366F1', // radial blur 3 (저채도, 10% 알파)
  },

  // 중립: 화이트 & 그레이
  cloud:   '#F8FAFC',  // 페이지 배경
  mist:    '#E2E8F0',  // 보더
  fog:     '#94A3B8',  // 서브 텍스트

  // 상태색 (오렌지 금지, 빨강은 긴급만)
  urgent:  '#DC2626',  // 채용 D-3 이하, 운항 취소(Phase 5.5)
  success: '#059669',  // 구독 완료, 공고 승인
  pick:    '#0EA5E9',  // 에디터 Pick 강조 (sky.500 alias)
}
```

### 2.1 사용 가이드

- **배경**: `bg-arum-cloud` (라이트) / `bg-arum-ink` (다크 Hero)
- **본문 텍스트**: `text-arum-navy` / 다크 영역은 `text-arum-cloud`
- **보조 텍스트**: `text-arum-slate` / `text-arum-fog`
- **링크·CTA**: `text-arum-blue-500 hover:text-arum-blue-600`
- **에디터 Pick 블록**: `border-l-[3px] border-arum-pick bg-arum-sky-50` — 뉴스 카드 내부·이메일 모두 동일한 시각 규약 ([02 §5](./02-i-side-information.md), [05 §5](./05-email-growth-loop.md))
- **Gradient Blob**: `arum.blob.*` 3색을 `radial-gradient`으로 알파 10~15%로 겹침. Hero 배경 한 곳만 사용.
- **빨강**: 채용 마감 D-3 이하, Phase 5.5 운항 취소 상태에만. 그 외 사용 금지.
- **오렌지**: **사용 금지** (D7)

---

## 3. 타이포그래피

v0.2 §3 그대로 유지 (Pretendard Variable + Space Grotesk + JetBrains Mono). v0.3에서 변경 없음.

### 3.1 폰트 페어링

```ts
fontFamily: {
  sans: [
    'Pretendard Variable',  // 한글+영문 본문 (OFL)
    'Pretendard',
    '-apple-system',
    'BlinkMacSystemFont',
    'system-ui',
    'Noto Sans KR',
    'sans-serif',
  ],
  display: [
    'Space Grotesk',        // 헤드라인·숫자·화물 데이터 (OFL)
    'Pretendard Variable',
    'sans-serif',
  ],
  mono: [
    'JetBrains Mono',       // AWB 번호, ICAO 코드(B77W), 편명
    'ui-monospace',
    'monospace',
  ],
}
```

### 3.2 로딩 전략

- **Pretendard Variable**: `@font-face` + `display: swap`. jsDelivr (`cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9`) 또는 self-host.
- **Space Grotesk**: `next/font/google` + subset `['latin']` + weight `[400, 500, 600, 700]`
- **JetBrains Mono**: `next/font/google` subset 제한

**성능 목표**: 모바일 초기 폰트 페이로드 < 100KB.

### 3.3 사이즈 스케일 (v0.2 유지)

| 토큰 | 크기 | 용도 |
|---|---|---|
| `text-display-xl` | 4rem / 1.1 | 랜딩 Hero H1 |
| `text-display-lg` | 3rem / 1.15 | 섹션 타이틀 |
| `text-display-md` | 2.25rem / 1.2 | 페이지 타이틀 |
| `text-headline` | 1.5rem / 1.3 | 카드 제목 |
| `text-body-lg` | 1.125rem / 1.6 | 본문 큰 |
| `text-body` | 1rem / 1.6 | 본문 기본 |
| `text-body-sm` | 0.875rem / 1.5 | 보조 |
| `text-caption` | 0.75rem / 1.4 | 메타·에디터 Pick 출처 |
| `text-mono` | 0.9375rem / 1.4 | 편명·AWB·ICAO 코드 |

한국어 본문 `line-height: 1.6` 필수 (CJK 가독성).

---

## 4. 모션 언어 + Bento/Parallax/Blob

### 4.1 라이브러리 조합

- **Framer Motion** (`framer-motion@11.x`, ~20KB gzipped) — 스태거드 리빌(`staggerChildren` + `whileInView`) + Scroll Parallax Hero(`useScroll` + `useTransform`) + 3D Carousel(`useMotionValue`). 2026-04-18 Amendment로 Lenis+GSAP에서 교체
- **tailwindcss-animate** — 기본 fade/slide 전환 프리셋
- **CSS `scroll-behavior: smooth`** — iOS Safari 기본 매끄러움 활용 (Lenis 제거, 번들 4KB 절감)
- **react-intersection-observer** — 카드 fade-in (가벼움)
- **shadcn/ui + Tailwind `transition-all duration-200 ease-out`** — 버튼·호버 기본

**사용 금지**: Framer Motion 전역(특정 페이지만 허용), Lottie, 상시 WebGL.

### 4.2 Bento Grid 규약

- **그리드**: `grid-cols-4 grid-rows-3 gap-4` (데스크톱), `grid-cols-2` (태블릿), `grid-cols-1` (모바일)
- **카드 크기 파노라마**:
  - Hero-Pick (3x2): "오늘의 에디터 Pick" — 가장 눈에 띄는 칸
  - News-Stack (1x2): 오늘의 뉴스 3개 스냅
  - Job-Spotlight (2x1): 이번 주 채용 하이라이트 1개
  - Metric-Live (1x1): WAU·주간 신규 공고 숫자 + 스파크라인 (shadcn chart)
  - Email-CTA (4x1): 하단 풀폭 구독 CTA
- **카드 내부**: 16px padding, 12px 라운드, `ring-1 ring-arum-mist` 보더, hover 시 `ring-arum-sky-300 shadow-xl`
- **접근성**: 각 카드는 `<article>` + `aria-labelledby`. 키보드 Tab 순회 시 좌상→우하 자연 순서.

### 4.3 Gradient Blob 배경

- `position: absolute`로 Hero 섹션에만 부착, `pointer-events: none`, `z-[-1]`.
- `radial-gradient` 3겹 (`arum.blob.sky` 20%α, `arum.blob.blue` 15%α, `arum.blob.violet` 10%α)
- `filter: blur(80px)` + `animation: arum-blob-drift 18s ease-in-out infinite alternate` (좌우 ±40px 미세 이동)
- `prefers-reduced-motion` 활성 시 animation off, blur 유지.

### 4.4 Scroll Parallax Hero

- Hero 내부 3레이어: (1) 배경 blob, (2) 중앙 카피, (3) 전경 아이콘/뱃지
- Framer Motion `useScroll` + `useTransform` 으로 스크롤 y축 0~1에 매핑
  - 레이어 1: `y: 0 → -20px` (느림)
  - 레이어 2: `y: 0 → -60px` (보통)
  - 레이어 3: `y: 0 → -120px` (빠름)
- 총 이동 거리 120px 이내로 제한 (모바일에서 멀미 방지)
- `prefers-reduced-motion` 시 parallax 전체 off.

### 4.5 핵심 모션 패턴

1. **Hero 스태거드 리빌**: 첫 로드 H1 → 서브카피 → CTA 순 0.15s 간격 fade-up
2. **섹션 리빌**: ScrollTrigger + IntersectionObserver로 Bento 카드 스태거드 fade-up
3. **부드러운 스크롤**: CSS `scroll-behavior: smooth` (Lenis 제거). 추가 관성 필요 시 Framer Motion `scroll` 훅
4. **Scroll Parallax**: §4.4
5. **Blob Drift**: §4.3
6. **에디터 Pick 강조**: 카드 진입 시 좌측 바 `arum-pick` 컬러가 0 → 3px로 늘어남 (0.4s)
7. **카드 호버**: `hover:scale-[1.015] hover:shadow-xl`
8. **배지 펄스**: 마감 D-1 배지만 `animate-pulse`
9. **3D Carousel** (서브): `/showcase`·`/about` 하단 진입 시 회전. 메인에서는 사용 안 함.

### 4.6 접근성 & 저사양

```ts
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // Framer Motion useReducedMotion() + CSS @media (prefers-reduced-motion: reduce) 조합으로 3D Carousel·Blob Drift·Parallax 전부 비활성
  // CSS transition은 유지
}
```

---

## 5. 사이트 구조 & 화면 와이어프레임

### 5.1 IA

```
/                          랜딩 (Bento + Parallax Hero)
/news                      뉴스 피드
/news/[slug]               뉴스 상세 (편성+에디터 Pick)
/jobs                      채용 피드
/jobs/[slug]               채용 상세
/about                     소개 (Phase A 초안 §5.10) + 하단 3D Carousel
/showcase                  (옵션) 제휴/레퍼런스 쇼케이스 + 3D Carousel 메인
/glossary                  용어집 (Phase 1 후반)
/privacy                   개인정보처리방침
/terms                     이용약관
/subscribe/verify          구독 인증 랜딩
/subscribe/settings/[t]    설정 관리
/unsubscribe/[token]       수신거부
/share/[id]                공유 랜딩 (referrer 추적, [05 §8](./05-email-growth-loop.md))

─ Phase 5.5 추가 ─────────────────────────────────────
/flights                   운항 요약 (기종 뱃지 + 화물기 필터)
/employers                 기업 담당자 인재풀/채용 등록 안내
/contribute                기종 Capacity 제보 폼

─ 관리자 ────────────────────────────────────────────
/admin                     관리자 로그인 (Magic Link)
/admin/dashboard           KPI 대시보드 (shadcn/ui charts, [05 §9](./05-email-growth-loop.md))
/admin/news                뉴스 승인/에디터 Pick 작성
/admin/jobs                공고 승인 큐
/admin/capacity            capacity_feedback 검토 (Phase 5.5)
/admin/inquiries           employer_inquiries (Phase 5.5)
```

### 5.2 랜딩 (`/`) — Bento + Parallax Hero

```
┌─────────────────────────────────────────────────────┐
│ [SiteHeader — 아름카고 로고 · 메뉴(뉴스 채용 소개) · 구독 CTA]│
├─────────────────────────────────────────────────────┤
│                                                       │
│  HERO (Gradient Blob 배경 · Scroll Parallax 3레이어)    │
│                                                       │
│  (스태거드 리빌 — Space Grotesk + Pretendard)          │
│  "매일 아침, 항공 화물                                 │
│   업계의 흐름을                                        │
│   한 통으로."                                          │
│                                                       │
│  "11년차 현직자가 정리한 카고 마켓·콘솔·포워더 이야기.    │
│   뉴스 + 채용 + 에디터 Pick, 매일 아침 7시."             │
│                                                       │
│  [이메일 입력________________] [구독하기 →]             │
│   이미 487명이 받아보고 있어요 · 언제든 해지            │
│                                                       │
├─────────────────────────────────────────────────────┤
│                                                       │
│  BENTO GRID  (4 x 3, gap-4)                           │
│                                                       │
│  ┌─────────────────────┐ ┌─────────────┐             │
│  │ Hero-Pick (3x2)     │ │ Metric-Live │             │
│  │ "오늘의 에디터 Pick" │ │ WAU  487▲   │             │
│  │ 카고프레스 4/10 요약 │ │ (스파크라인) │             │
│  │ + 에디터 한 줄        │ └─────────────┘             │
│  │ (sky-50 배경 + 좌측바)│ ┌─────────────┐             │
│  │                     │ │ News-Stack  │             │
│  │                     │ │ 오늘의 뉴스 3│             │
│  └─────────────────────┘ │ 스냅 리스트  │             │
│                          └─────────────┘             │
│  ┌──────────────┐ ┌──────────────────────┐           │
│  │ Job-Spot(2x1)│ │ Job-Spot (2x1)        │           │
│  │ 콘솔사 영업  │ │ 포워더 오퍼            │           │
│  │ 3~5년 · ICN  │ │ 1~3년 · GMP           │           │
│  └──────────────┘ └──────────────────────┘           │
│  ┌────────────────────────────────────────────────┐  │
│  │ Email-CTA (4x1)                                │  │
│  │ 매일 아침 7시, 한 통으로 충분합니다.              │  │
│  │ [이메일] [카테고리 6종 체크박스] [구독]           │  │
│  └────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────┤
│ [SiteFooter — 사업자정보·법정링크·출처·소셜]             │
└─────────────────────────────────────────────────────┘
```

**주의**: 메인에는 3D Carousel 없음. v0.2에서 있던 "오늘의 항공사 3D Carousel"은 §5.11 `/showcase` 또는 §5.10 `/about` 하단으로 이동.

### 5.3 `/news` 뉴스 피드

```
┌─────────────────────────────────────────────────────┐
│ [SiteHeader]                                          │
├─────────────────────────────────────────────────────┤
│ [페이지 타이틀: 항공 화물 뉴스] [기간 필터: 오늘·7일·30일]│
│                                                       │
│ [카테고리 chips: 카고시장 운영 회사 정책 공항카고 항공큰뉴스]│
│ [정렬: 최신 · Pick만 보기 토글]                         │
├─────────────────────────────────────────────────────┤
│ [카드 그리드 3열(데스크톱) / 2열(태블릿) / 1열(모바일)]   │
│                                                       │
│ [뉴스카드 + Pick] [뉴스카드]      [뉴스카드 + Pick]     │
│ [뉴스카드]       [뉴스카드 + Pick] [뉴스카드]          │
│                                                       │
│ 카드 구성:                                             │
│  · 카테고리 chip (카고시장 등)                          │
│  · 제목 (2줄 클램프)                                   │
│  · 요약 2~3문장 + <AviationTerm term="AWB"/> 툴팁      │
│  · 에디터 Pick 블록 (있을 때만, 60% 커버리지)           │
│     └─ 톤 라벨(관찰/액션/배경) + 본문 ≤140자            │
│  · 메타: 출처명(카고프레스 4/10) · 원문 링크            │
│                                                       │
│ [페이지네이션]                                         │
├─────────────────────────────────────────────────────┤
│ [Footer 구독 CTA]                                     │
└─────────────────────────────────────────────────────┘
```

### 5.4 `/jobs` 채용 피드

```
┌─────────────────────────────────────────────────────┐
│ [상단: 공식 채용 페이지 딥링크 카드]                     │
│ [대한항공카고][아시아나카고][에어인천][판토스][CJ대한]   │
│ [한진][코스모항운][트리플크라운][우정항공]...           │
├─────────────────────────────────────────────────────┤
│ [좌: 필터 사이드바]       [우: 카드 그리드]               │
│                                                       │
│ 카고 직군                                              │
│ ☐ 영업 (Sales)                                        │
│ ☐ 오퍼 (Ops)                                          │
│ ☐ 통관 (Customs)                                      │
│ ☐ 수출입 (I/E)                                        │
│ ☐ 국제물류                                             │
│ ☐ 공항 상주                                            │
│                                                       │
│ 경력                                                   │
│ ☐ 신입 ☐ 1~2년 ☐ 3~5년 ☐ 6~10년 ☐ 10년+              │
│                                                       │
│ 신뢰도 최소                                            │
│ [⚪ 3+] [⚪ 4+] [⚪ 5만]                               │
│                                                       │
│ 마감 N일 이내                                          │
│ [3] [7] [14] [30] [전체]                              │
│                                                       │
│ 근무지                                                 │
│ ☐ 인천(ICN) ☐ 김포(GMP) ☐ 부산 ☐ 공항권 ☐ 기타        │
│                                                       │
│ [필터 초기화]                                          │
└─────────────────────────────────────────────────────┘
```

**카드 구성**: 회사 로고 · 직군 뱃지 · 타이틀 · 근무지 · 경력 · `<DeadlineBadge>` · `<TrustScore>` · 출처명.

### 5.5 `/about` 소개 + 하단 3D Carousel

§5.10 참조. About 본문 → 3D Carousel 섹션 → 구독 CTA 순.

### 5.6 `/news/[slug]` · `/jobs/[slug]` 상세

- 공통: 빵부스러기, 타이틀, 메타, 요약/설명, 에디터 Pick 강조 블록(뉴스만, 있을 때), 원문 링크 CTA, 관련 카드 3개, 공유 링크(`/share/[id]?ref={sub_id}`), 구독 CTA

### 5.7 `/flights` (Phase 5.5) 운항 요약 — 기종 뱃지 포함

```
┌─────────────────────────────────────────────────────┐
│ 공항: [ICN*] [GMP] [CJU] [PUS] [TAE] [KWJ] [CJJ]     │
│ 방향: [출발*] [도착]                                    │
│ 필터: [☑ 화물기(CGO)만 보기]                           │
├─────────────────────────────────────────────────────┤
│ 편명     항공사    목적지  예정   실제  상태 기종  링크│
│ KE603   대한항공  NRT    14:30 14:32 정시 B77W  [↗] │
│          (PAX · belly 적재 가능)                      │
│ CV4040  카고룩스  HKG    15:10 15:45 지연 B744F [↗] │
│          (CGO · Freighter)                            │
│ OZ102   아시아나  LAX    15:20  —    취소 B77W  [↗] │
│                                                       │
│ [편명 검색 바]                                         │
│                                                       │
│ 마지막 업데이트: 2026-04-11 12:00 KST                  │
│ 출처: 한국공항공사 · 인천국제공항공사                     │
└─────────────────────────────────────────────────────┘
```

**기종 뱃지 hover** (2단계):

- **Phase 5.5 초기**: 툴팁 "Boeing 777-300ER · 여객기(belly 화물 적재 가능)" — 정적 TS 파일 `web/src/data/aircraft-types.ts`
- **Phase 5.5 확장**: 팝오버 확장 — `max_payload_kg`, `belly_kg`/`main_deck_kg`, 주요 ULD 용량(예: "AKE × 32, PMC × 0"), 출처 URL(Airbus/Boeing APM), "정보가 틀렸나요? 제보하기" 링크 → `/contribute`
- 출처: [03 §7 aircraft_capacity](./03-data-model.md)

### 5.8 `/employers` (Phase 5.5) 기업 담당자 안내

```
┌─────────────────────────────────────────────────────┐
│ [SiteHeader]                                          │
├─────────────────────────────────────────────────────┤
│ Hero:                                                 │
│  "화물 직군, 지인 추천·사람인만으로는                   │
│   인재가 오지 않죠."                                    │
│                                                       │
│  항공 화물 현직자와 취준생이 모이는                       │
│  아름 카고에 공고를 올려 보세요.                         │
│                                                       │
├─────────────────────────────────────────────────────┤
│ [3 Bento 카드]                                        │
│ [인재풀 요약][채용 등록][사례·후기]                      │
│                                                       │
│ 인재풀 요약:                                            │
│  · 구독자 ◯◯◯명 (카테고리별 분포 차트, shadcn)         │
│  · 3~5년차 콘솔사 영업 관심 ◯◯%                         │
│  · (익명·집계 통계만, 개별 정보 미노출)                  │
│                                                       │
│ 채용 등록:                                              │
│  · 회사명/담당자 이메일/공고 URL/직군/경력/마감일         │
│  · 허니팟 필드(봇 차단) + IP 5회/1h 레이트 리밋          │
│  · 제출 시 admin 알림 이메일 + pending 상태 저장         │
│                                                       │
│ [문의 폼] → employer_inquiries 테이블                  │
├─────────────────────────────────────────────────────┤
│ [Footer]                                              │
└─────────────────────────────────────────────────────┘
```

- 스키마: [03 §8 employer_inquiries](./03-data-model.md)
- 양면시장 지표: [05 §9 shadcn chart card #8](./05-email-growth-loop.md)

### 5.9 `/contribute` (Phase 5.5) 기종 Capacity 제보

```
┌─────────────────────────────────────────────────────┐
│ 제보해 주세요: 기종 정보가 틀렸나요?                     │
│                                                       │
│ 이 데이터는 Airbus/Boeing APM + 현직자 검수로 채워       │
│ 집니다. 실제 현장과 다른 점이 있다면 알려 주세요.         │
│                                                       │
│ ICAO 코드   [B77W ▼]                                  │
│ 수정 항목   [max_payload_kg ▼]                        │
│ 제안 값     [___________________]                     │
│ 근거/자료   [___________________]                     │
│ 내 이메일   [___________________] (선택)               │
│                                                       │
│ [제출 →]                                               │
│                                                       │
│ 제출 시 관리자에게 트랜잭셔널 메일이 전송되고,            │
│ 검증 후 반영 여부를 회신드립니다.                        │
└─────────────────────────────────────────────────────┘
```

- 스키마: [03 §7 capacity_feedback](./03-data-model.md)
- 허니팟 + 레이트 리밋: [04 §7 /api/capacity-feedback](./04-api-integration.md)

### 5.10 `/about` 소개 — Phase A 초안 2~3개

**공통 규칙** (플랜 §1.8):

- **드러낼 것**: 11년차 항공 화물 현직자 + 왜 이걸 만드는지
- **숨길 것**: 이름, 회사, 학교명, 직책, "익명 유지한다"는 직접 언급
- **톤**: Stripe About / Vercel About / Linear About — 간결·자신감·친근
- **금지어**: "종합" "당신답게" "뉴스레터 큐레이션"

#### 초안 A — "정서 블록 중심"

```
# 이 자리를 만든 이유

2015년 봄, 저는 컨테이너 출발 한 시간 전에
FedEx ULD 하나를 붙잡고 수출입 서류를 다시 찍고 있었습니다.

11년이 지났고, 그 사이에 바뀐 건 참 많았습니다.
그런데 바뀌지 않은 게 하나 있어요 — 업계 소식은
여전히 단체 카톡방과 지인 전화에서 제일 빨리 돕니다.

이 일을 하면서 계속 느낀 게 있어요.
"우리 동네 뉴스를 우리가 못 본다"는 이상함.
해외 카고 매체 몇 개는 구독료가 쌓이고,
국내 전문지는 검색이 힘들고,
공식 채용 공고는 매번 회사마다 들어가서 뒤져야 합니다.

그래서 매일 아침, 제가 직접 읽고 추리는 걸
한 통에 담아 보내려고 합니다.

항공 화물 업계 안에서 일하는 사람들이
서로의 흐름을 놓치지 않게.

아름 카고.
아름 = 나답다, 나다운 방식으로 일한다는 뜻입니다.
화물부터 시작해서, 점점 확장해 나갈 거예요.
```

#### 초안 B — "문제 정의 중심"

```
# 왜 아름 카고인가

## 지금 상태

- 카고프레스, Loadstar, Air Cargo News — 정보는 많은데 흩어져 있습니다.
- 사람인·워크넷 검색어는 "항공화물"인데, 나오는 결과의 80%는
  승무원·지상직입니다.
- 포워더 채용 담당자는 "지인 추천 아니면 사람 못 구한다"고 말합니다.

## 아름 카고가 하는 일

1. 매일 아침 7시, 카고 중심 뉴스 4~5개를 한 통으로 보냅니다.
2. 공식 채용 페이지 + 주요 포털의 카고 공고를 모아 하루 단위로 업데이트합니다.
3. 해외 기사는 AWB, ULD, Belly Cargo 같은 용어를
   그대로 남기고 한국어 요약을 곁들입니다.

## 누가 쓰는지

- 2~5년차 콘솔사/포워더 영업·오퍼 (가장 많이 읽힙니다)
- 1년차 신입 — 직군 용어와 업계 지도를 익히려는 분
- 6~10년차 시니어 — 업계 흐름 모니터링
- 항공교통물류학과 재학생 — 취업 준비

## 누가 만드는지

11년차 항공 화물 현직자가 퇴근 후에 매일 조금씩.
회사 이름도 제 이름도 이 페이지엔 없지만,
한 줄 한 줄의 Pick 안에 경험이 담겨 있습니다.

읽고 써 보시고, 부족한 부분이 있으면 알려 주세요.
```

#### 초안 C — "Morning Brew 스타일 간결"

```
# 아름 카고 — 매일 아침 한 통의 카고 브리핑

11년차 항공 화물 현직자가 정리합니다.

- 카고프레스 · Loadstar · Air Cargo News · 카고 회사 공식 공고
  — 매일 아침 7시 한 통으로
- AWB, ULD, TAC Index 같은 용어는 원문 그대로,
  한국어 요약 곁들여서
- 읽으면서 "나도 이 생각 했는데" 싶은 순간엔,
  제 Pick 한 줄이 붙어 있을 거예요

## 지금까지 487명이 구독 중입니다

[이메일 입력_______________] [구독하기 →]

수신동의는 언제든 한 번의 클릭으로 해지할 수 있습니다.
(정보통신망법 제50조, 광고 표기와 원클릭 수신거부 준수)
```

**OQ-C1**: 3개 초안 중 사용자 선택 (Phase A 말미에 확정).

**/about 하단 레이아웃**:

```
[About 본문 (A/B/C 중 택 1)]
  ↓
[3D Carousel — "오늘의 화물 루트" 또는 "함께하는 브랜드"]
  — Codrops/3DCarousel 포트, ScrollTrigger 진입 시 회전
  — 로고/루트 6~8개
  ↓
[구독 CTA 재노출]
```

### 5.11 `/showcase` (옵션) 쇼케이스

- About 하단 3D Carousel을 독립 페이지로 분리하는 옵션 경로. Phase 5 MVP에서는 **/about 하단에만** 배치하고 `/showcase`는 Phase 6+로 보류.

---

## 6. 컴포넌트 리스트

| 컴포넌트 | 파일 | 용도 |
|---|---|---|
| `<SiteHeader>` | `src/components/site-header.tsx` | 전역 네비 |
| `<SiteFooter>` | `src/components/site-footer.tsx` | 전역 푸터 + 사업자·출처·수신거부 정보 |
| `<NewsCard>` | `src/components/news-card.tsx` | 뉴스 카드 1장 (+ 에디터 Pick 블록) |
| `<EditorPickBlock>` | `src/components/editor-pick-block.tsx` | 뉴스 카드·상세·이메일 공통 Pick 렌더러 |
| `<JobCard>` | `src/components/job-card.tsx` | 카고 직군 뱃지 포함 |
| `<CargoCareerLinkCard>` | `src/components/cargo-career-link-card.tsx` | 공식 딥링크 14사 (v0.3, airline→cargo 리네이밍) |
| `<FlightTable>` | `src/components/flight-table.tsx` | Phase 5.5 — 기종 뱃지 컬럼 |
| `<AircraftBadge>` | `src/components/aircraft-badge.tsx` | Phase 5.5 — ICAO 코드 + PAX/CGO/COMBI 라벨 + 툴팁/팝오버 |
| `<AirportTabs>` | `src/components/airport-tabs.tsx` | Phase 5.5 공항 선택 탭 |
| `<JobFilters>` | `src/app/jobs/_components/job-filters.tsx` | 카고 직군·경력·근무지 필터 |
| `<NewsCategoryChips>` | `src/app/news/_components/category-chips.tsx` | 카테고리 6종 필터 |
| `<SubscribeForm>` | `src/components/subscribe-form.tsx` | 구독 폼 + 카테고리 6 체크박스 (zod + react-hook-form) |
| `<AviationTerm>` | `src/components/aviation-term.tsx` | 용어 툴팁 (AWB/ULD/TAC Index 등) |
| `<HeroSection>` | `src/components/hero-section.tsx` | Bento 위 Scroll Parallax Hero |
| `<BentoGrid>` | `src/components/bento-grid.tsx` | 랜딩 Bento 컨테이너 |
| `<GradientBlobBg>` | `src/components/gradient-blob-bg.tsx` | 라디얼 블러 배경 |
| `<CarouselShowcase3D>` | `src/components/carousel-showcase-3d.tsx` | /about·/showcase 하단 (v0.2 AirlineCarousel3D 리네이밍) |
| `<DeadlineBadge>` | `src/components/deadline-badge.tsx` | D-N 배지 (D-3 이하 urgent) |
| `<TrustScore>` | `src/components/trust-score.tsx` | 1~5 별 |
| `<StatusBadge>` | `src/components/status-badge.tsx` | Phase 5.5 운항 상태 |
| `<CapacityFeedbackForm>` | `src/app/contribute/_components/capacity-feedback-form.tsx` | Phase 5.5 제보 폼 |
| `<EmployerInquiryForm>` | `src/app/employers/_components/inquiry-form.tsx` | Phase 5.5 기업 문의 폼 |
| `<Skeleton>` (shadcn) | — | 로딩 스켈레톤 |
| `<AdminMetricCard>` | `src/app/admin/dashboard/_components/metric-card.tsx` | shadcn/ui card + `<ChartContainer>` 기반 KPI 카드 (ⓘ 툴팁 포함) |
| `<NewsTrendChart>` | `src/app/news/_components/news-trend-chart.tsx` | shadcn chart — 사용자 화면 |

### shadcn/ui 필요 목록
Button, Card, Badge, Tabs, Dialog, Input, Label, Form, Select, Checkbox, Tooltip, Popover, Separator, Skeleton, Toast (Sonner), Chart

### 차트 라이브러리 2원화

| 용도 | 라이브러리 | 근거 |
|---|---|---|
| **관리자 대시보드** (`/admin/dashboard`) | **shadcn/ui charts (Recharts 래퍼) 단일** | 사용자 화면과 동일 라이브러리로 번들·토큰 일관성 확보. Metric Card + Sparkline AreaChart 패턴 직접 구성 (2026-04-18 Amendment로 Tremor 제거) |
| **사용자 화면 차트** (`/news` 트렌드, `/employers` 인재풀 분포) | **shadcn/ui charts** (Recharts 래퍼) | 디자인 시스템 일관성, `arum.*` 토큰 재사용 |

두 라이브러리는 내부 원자 색은 모두 `arum.sky.*`·`arum.blue.*` 기반으로 오버라이드하여 브랜드 톤 유지.

---

## 7. 반응형 breakpoint

| 브레이크 | 너비 | 그리드 |
|---|---|---|
| 기본 | <640px | 1열 Bento |
| `sm` | ≥640px | 2열 Bento |
| `md` | ≥768px | 2~3열 Bento |
| `lg` | ≥1024px | 4열 Bento (데스크톱 기본) |
| `xl` | ≥1280px | 4열 + 카드 여백 확대 |

**모바일 원칙**:

- 터치 타겟 최소 44x44px
- 필터 사이드바는 모바일에서 Drawer
- Parallax Hero는 모바일에서 총 이동 거리 60px 이내로 축소
- Gradient Blob은 모바일에서 blur 60px로 축소 (GPU 부담 경감)
- Bento Hero-Pick 카드는 모바일에서 풀폭 1열
- 3D Carousel은 `prefers-reduced-motion` 또는 모바일에선 정적 그리드로 fallback

---

## 8. 접근성 (WCAG AA 목표)

- **색 대비**: 본문 텍스트/배경 4.5:1 이상
- **키보드 네비**: 모든 인터랙티브 요소 Tab 순회, `:focus-visible` 링 표시
- **alt 텍스트**: 모든 이미지 의미 있는 alt 또는 `alt=""` (장식)
- **aria**: Dialog·Tooltip·Tabs·Popover는 shadcn 기본 aria 사용. Bento 카드는 `<article>` + `aria-labelledby`.
- **언어 속성**: `<html lang="ko">`
- **`prefers-reduced-motion`**: Framer Motion `useReducedMotion()` + CSS `@media (prefers-reduced-motion: reduce)` 로 3D Carousel·Parallax·Blob Drift 전부 비활성 폴백
- **폼 오류 메시지**: aria-describedby 연결
- **에디터 Pick 블록**: 좌측 컬러 바에만 의존하지 않고, "에디터 Pick" 텍스트 라벨 + 톤 라벨(관찰/액션/배경)을 항상 병기

---

## 9. SEO

### 9.1 기본 메타

```tsx
// app/layout.tsx
export const metadata = {
  title: { default: '아름 카고 (Arum Cargo)', template: '%s | 아름 카고' },
  description: '11년차 현직자가 매일 아침 7시에 정리하는 항공 화물 뉴스·채용 브리핑. 카고 시장, 콘솔·포워더 채용, 공식 공고를 한 통으로.',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://arumcargo.vercel.app',
    siteName: '아름 카고 (Arum Cargo)',
  },
  twitter: { card: 'summary_large_image' }
};
```

각 페이지는 `generateMetadata`로 동적 `<title>`·`<meta description>`·OG.

### 9.2 구조화 데이터

- **뉴스 상세**: `NewsArticle` schema ([02 §8](./02-i-side-information.md))
- **채용 상세**: `JobPosting` schema ([01 §7.2](./01-a-side-academy-career.md)) — `industry: "Air Cargo / Logistics"` 명시
- **홈**: `Organization` schema (`name: "아름 카고"`, `sameAs: []`)

### 9.3 사이트맵 · robots

- `app/sitemap.ts` — 공개 페이지만, `/admin`·`/api`·`/subscribe/settings/*`·`/unsubscribe/*` 제외
- `robots.txt`: `/admin`, `/api`, `/share/*` 제외

### 9.4 Core Web Vitals 목표

- LCP < 2.5s (Hero 이미지 최적화, Pretendard 서브셋, Blob은 CSS-only)
- CLS < 0.1 (Bento 카드 width/height 명시, 폰트 fallback metric)
- INP < 200ms (Parallax GPU 오프로드, Framer Motion dynamic import)

Lighthouse 모바일 80+ 전 페이지 목표.

---

## 10. 화면별 카피 가이드

### 10.1 톤

- **한국어 기본**. 화물 전문 용어만 영문 원문 + 툴팁.
- **친근 ≠ 친구**: "~요" 기본, "~야" 금지.
- **과장 금지**: "최고의"·"혁신적인" 같은 형용사 기피.
- **숫자 우선**: "많은 콘솔사" ❌ → "국내 20여 곳의 카고 콘솔사" ⭕
- **내 목소리 유지**: "저는" "11년차" 같은 1인칭 OK. 단 이름/회사/학교 금지.
- **금지어**: "종합" "뉴스레터 큐레이션" "당신답게" "혁신적인" "최고의" "완벽한"

### 10.2 CTA 문구

- "구독하기" (O) / "지금 바로 가입!" (X)
- "원문 보기" (O) / "더 알아보기" (X — 모호)
- "수신거부" (O) / "Unsubscribe" (X)
- "에디터 Pick 더 보기" (O) / "Editor's Choice" (X)

---

## 11. MoSCoW 우선순위

| 우선순위 | 항목 | 근거 |
|---|---|---|
| **M**ust | `arum.*` 컬러 토큰, Pretendard + Space Grotesk 로드 | 브랜드 정체성 · v0.3 피벗 |
| **M**ust | `<SiteHeader>`, `<SiteFooter>` | 전역 네비 · 법정 링크 · 출처 표기 |
| **M**ust | `<HeroSection>` Scroll Parallax + 스태거드 리빌 (reduced-motion fallback) | 첫 방문 "우와" · ADR-006 |
| **M**ust | `<BentoGrid>` + `<GradientBlobBg>` 메인 구성 | v0.3 메인 레이아웃 전환 결정 |
| **M**ust | `<NewsCard>` + `<EditorPickBlock>` | P01 큐레이션 + P05 현직자 시선 (v0.3 핵심 차별화) |
| **M**ust | `<JobCard>` + 카고 직군 뱃지 + `<CargoCareerLinkCard>` | P03 화물 채용 |
| **M**ust | `<SubscribeForm>` (zod + react-hook-form) + 카테고리 6 체크박스 | North Star WAU 전환 |
| **M**ust | `<DeadlineBadge>`, `<TrustScore>` | 공고 긴급도·품질 시각화 |
| **M**ust | `<AviationTerm>` 툴팁 (AWB·ULD·TAC Index 등) | P02 해외 카고 뉴스 용어 장벽 |
| **M**ust | WCAG AA 대비 · `prefers-reduced-motion` | 접근성 법적 리스크 · ADR-006 review trigger |
| **M**ust | `<AdminMetricCard>` shadcn/ui charts 8카드 (`/admin/dashboard`) | 운영 가시성 · [05 §9](./05-email-growth-loop.md) |
| **S**hould | CSS `scroll-behavior: smooth` (Lenis 제거 · 2026-04-18 Amendment) | 번들 -4KB, iOS Safari 기본 매끄러움 활용 |
| **S**hould | `<CarouselShowcase3D>` (`/about` 하단) | "우와" 강화 · 메인에서 제거됨 |
| **S**hould | Framer Motion `whileInView` + `staggerChildren` 섹션 리빌 | Joby급 프리미엄 톤, 선언적 API |
| **S**hould | Skeleton 로딩 상태 | LCP 체감 개선 |
| **S**hould | OG 이미지 동적 생성 (`opengraph-image.tsx`) | SNS 공유 CTR · share loop 활성화 |
| **S**hould | `<NewsTrendChart>` shadcn chart (사용자 화면) | 데이터 가시화 |
| **C**ould | 다크모드 자동 전환 (시스템 선호 감지) | Phase 2 이후 |
| **C**ould | `/showcase` 독립 페이지 | Phase 6+ 비스코프 |
| **W**on't | Framer Motion 전역 도입 | 번들 과함 |
| **W**on't | Lottie 애니메이션 | 배터리 드레인 |
| **W**on't | 상시 WebGL | 성능 리스크 |
| **W**on't | 오렌지 팔레트 | D7 금지 |
| **W**on't | "프리미엄 티어" "유료 구독" 카피 | v0.3 수익화 축 제거 |
| **W**on't | 메인 페이지 3D Carousel | v0.3 `/about`·`/showcase` 이동 결정 |
| **W**on't | 실명·회사명·학교명 노출 | /about 익명 운영 원칙 |

### Phase 5.5 추가

| 우선순위 | 항목 |
|---|---|
| M (Phase 5.5) | `<FlightTable>` + `<AircraftBadge>` + `web/src/data/aircraft-types.ts` 정적 시드 |
| M (Phase 5.5) | `/employers` + `<EmployerInquiryForm>` + 허니팟 |
| M (Phase 5.5) | `/contribute` + `<CapacityFeedbackForm>` |
| S (Phase 5.5) | `aircraft_capacity` Supabase 테이블 마이그레이션 + ULD 팝오버 |

---

## 12. NFR / SLO (Core Web Vitals · 접근성 · 퍼포먼스)

| 지표 | 목표 | 측정 방법 | 실패 시 조치 |
|---|---|---|---|
| **Lighthouse 모바일 Performance** | ≥ 80 | Lighthouse CI 주 1회 (랜딩·/news·/jobs·/about) | <80 시 P1 이슈 |
| **Lighthouse 모바일 Accessibility** | ≥ 90 | 동일 | AA 위반 즉시 수정 |
| **Lighthouse 모바일 Best Practices** | ≥ 90 | 동일 | — |
| **Lighthouse 모바일 SEO** | ≥ 95 | 동일 | — |
| **LCP** | p75 ≤ 2.5s | Vercel Speed Insights | Hero 이미지 최적화·폰트 preload |
| **CLS** | p75 ≤ 0.1 | 동일 | Bento 카드 size 고정·폰트 fallback metric |
| **INP** | p75 ≤ 200ms | 동일 | Parallax GPU 오프로드·이벤트 throttle |
| **TTFB** | p95 ≤ 600ms | Vercel 로그 | ISR 조정·CDN 캐시 확장 |
| **폰트 페이로드** (초기) | ≤ 100KB | DevTools Network | Pretendard subset·Space Grotesk latin만 |
| **JS 번들 초기** (gzip) | ≤ 220KB | `next build` 리포트 | 동적 import · Framer Motion `m.*` 최적화 (`LazyMotion` + `domAnimation`) |
| **WCAG AA 대비** | 본문 ≥ 4.5:1 | axe DevTools | 토큰 재조정 |
| **키보드 네비** | 모든 인터랙티브 Tab 순회 | 수동 QA | `:focus-visible` 누락 수정 |
| **터치 타겟** | ≥ 44x44px | Lighthouse a11y | 패딩 증가 |
| **`prefers-reduced-motion` fallback** | Framer Motion `useReducedMotion()` true + CSS media query 적용 시 3D·Parallax·Blob Drift 전부 비활성 | 수동 QA DevTools 토글 | 구현 누락 시 블로킹 |
| **폰트 FOUT 시간** | ≤ 300ms | WebPageTest | `font-display: swap` 보장 |
| **이미지 포맷** | AVIF/WebP 우선 | `next/image` 기본 | — |
| **품질 하한선** (주관) | **uvengers-website.vercel.app 이상** | Phase 2·3 디자인 QA 시 사용자·에이전트 동시 비교 | 미달 시 해당 섹션 리디자인 |

---

## 13. 차별 가치 (Differential Value — v0.3)

| 차원 | 경쟁 비교 | 아름 카고 목표 | 근거 |
|---|---|---|---|
| **도메인 전문성** | 일반 뉴스 Aggregator·카페 플레인 리스트 | 11년차 현직자의 에디터 Pick 60% 이상 커버리지 | VPS v0.3 핵심 차별화 축 ([16-vps.md](../references/16-vps.md)) |
| **첫 방문 "우와" 순간** | 업계 정적 공지 게시판 | Bento + Parallax + 스태거드 리빌 프리미엄 체감 | P14 재방문 유인 · ADR-006 |
| **폰트 품질** | 시스템 폰트·Noto Sans KR 일색 | Pretendard Variable + Space Grotesk 페어링 | 한국 IT 프리미엄 기준 |
| **반응형 일관성** | 모바일 대응 부실한 업계 사이트 | 320px부터 Lighthouse 모바일 ≥80 | 모바일 트래픽 >70% 가정 |
| **접근성** | WCAG 미준수 다수 | AA 대비·키보드·reduced-motion 풀셋 | ADR-006 review trigger |
| **로딩 체감** | JS 번들 500KB+ 흔함 | 초기 JS ≤220KB · 폰트 ≤100KB | LCP p75 ≤2.5s |
| **카고 용어 장벽 해소** | 해외 전문지 읽기 어려움 | `<AviationTerm>` 툴팁 (AWB·ULD·TAC Index 등) | P02 해외 카고 뉴스 |

---

## 14. Proof 실험 설계

1. **Lighthouse CI 주 1회 회귀** — GitHub Actions cron `0 0 * * 1` · 점수 하락 시 PR 블로킹. Phase 2 종료 시 활성화.
2. **"우와" 순간 사용자 피드백** (ADR-006 review trigger) — 첫 10명 베타 구독자(C1 이지훈 페르소나 타겟 포함)에게 오픈 질문 "첫 방문에서 가장 인상적인 것?" · "너무 화려한가?" → "너무 화려함" ≥30% 답하면 Parallax·Blob 강도 축소.
3. **에디터 Pick 커버리지 검증** — 매주 월요일 `news_articles WHERE is_published=true AND editor_pick IS NOT NULL / is_published` 비율 60% 이상. 미달 시 주간 관리자 알림 ([05 §9](./05-email-growth-loop.md) KPI #6 연계).
4. **reduced-motion fallback QA** — Phase 3 DoD: Chrome/Safari/Firefox 3브라우저에서 토글 후 Framer Motion 전이·Parallax·Blob·3D Carousel 전부 정지 확인 체크리스트.
5. **OG 이미지 CTR 측정** — `/share/[id]?ref={sub_id}` 링크 CTR 측정. share loop 활성화 [05 §8](./05-email-growth-loop.md).
6. **폰트 페이로드 회귀 테스트** — `next build` 후 `.next/static/media` 합계 <100KB 게이트.
7. **품질 하한선 수동 비교** — Phase 2·3 디자인 QA 시 `uvengers-website.vercel.app`와 본 프로젝트 랜딩 나란히 비교. 사용자가 "이 정도면 됨" 승인할 때까지 재디자인 사이클.
8. **About 페이지 A/B/C 초안 선택** — OQ-C1 해결 시점에 사용자 선택. 확정 초안만 Phase 2 구현.

---

## 15. ADR 연결

| ADR | 적용 |
|---|---|
| [ADR-008 Pivot to Cargo-First](../references/ADR-008-pivot-to-cargo-first.md) | §0·§2 토큰 네임스페이스·§5 IA·§10 카피·§13 차별 가치 전면 |
| [ADR-006 Premium Animated 디자인](../adr/ADR-006-design-premium-animated.md) | §1·§2·§3·§4·§13·§14 전체 |
| [ADR-002 하이브리드 크론](../adr/ADR-002-cron-hybrid.md) | Lighthouse CI 호스팅 방식 |
| [ADR-007 VPS→PRD 워크플로](../adr/ADR-007-vps-prd-workflow.md) | §12 NFR/SLO 방법론 |

---

## 16. DoD

### 16.1 디자인 시스템
- [ ] `tailwind.config.ts`에 §2 `arum.*` 컬러 토큰 전부 반영 (오렌지 부재 + `blob.*` + `pick` 확인)
- [ ] Pretendard Variable + Space Grotesk + JetBrains Mono 로드
- [ ] Lighthouse Network 초기 폰트 페이로드 <100KB 측정 로그 첨부
- [ ] `text-display-*`·`text-body-*`·`text-caption` 스케일 전역 적용

### 16.2 랜딩 · 컴포넌트
- [ ] `<HeroSection>` Bento + Scroll Parallax + 스태거드 리빌 동작
- [ ] `<BentoGrid>` 4x3 구성 동작 (모바일 1열·태블릿 2열·데스크톱 4열)
- [ ] `<GradientBlobBg>` Hero에만 부착, `pointer-events:none`, reduced-motion 시 drift off
- [ ] `<NewsCard>` + `<EditorPickBlock>` 렌더링, Pick 없는 카드도 정상
- [ ] `<JobCard>` 카고 직군 뱃지 + `<CargoCareerLinkCard>` 14사 노출
- [ ] `<SubscribeForm>` 카테고리 6 체크박스 + 카테고리 최소 1개 검증
- [ ] `<CarouselShowcase3D>` **메인이 아닌** `/about` 하단에서만 작동
- [ ] `prefers-reduced-motion: reduce` 활성 시 Framer Motion 전이·Parallax·Blob·3D 전부 비활성 확인

### 16.3 관리자 대시보드
- [ ] `/admin/dashboard` shadcn/ui charts 기반 8 KPI 카드 노출 ([05 §9](./05-email-growth-loop.md) 교차)
- [ ] 각 카드 ⓘ 툴팁에 "지표 설명 + 왜 중요한지 + 출처" 3줄 표시
- [ ] WAU 카드 툴팁 출처: Amplitude NSM Playbook · Reforge Growth Series · Morning Brew Axios 2020 · Substack/Beehiiv
- [ ] Magic Link 로그인 + `admin_users` 화이트리스트 외 접근 시 404
- [ ] p95 로드 ≤ 2s

### 16.4 Phase 5.5 (운항·기업·제보)
- [ ] `/flights` 기종 뱃지 툴팁 (`web/src/data/aircraft-types.ts` 정적 시드 30개)
- [ ] `<AircraftBadge>` hover 시 PAX/CGO/COMBI 라벨 노출
- [ ] `aircraft_capacity` Supabase 마이그레이션 후 팝오버 ULD 정보 노출
- [ ] `/employers` 3 Bento 카드 + `<EmployerInquiryForm>` 허니팟·레이트 리밋 동작
- [ ] `/contribute` `<CapacityFeedbackForm>` 제출 시 관리자 트랜잭셔널 메일 수신

### 16.5 반응형·접근성
- [ ] 모바일 320px부터 레이아웃 깨짐 없음
- [ ] 모든 터치 타겟 ≥44x44px
- [ ] axe DevTools 0 critical violations
- [ ] 키보드만으로 랜딩·구독 폼 완료 가능
- [ ] `<html lang="ko">` 설정
- [ ] 에디터 Pick 블록: 컬러 바 + 텍스트 라벨 + 톤 라벨 병기 확인

### 16.6 SEO·OG
- [ ] `app/sitemap.ts` + `robots.txt` (`/admin`·`/api`·`/share/*` 제외)
- [ ] 각 페이지 `generateMetadata` 동적 `<title>`·`<meta description>`
- [ ] `opengraph-image.tsx` (랜딩·/news/[slug]·/jobs/[slug])
- [ ] `NewsArticle`·`JobPosting`·`Organization` 구조화 데이터
- [ ] `JobPosting.industry = "Air Cargo / Logistics"` 명시

### 16.7 성능 게이트 (§12 NFR 검증)
- [ ] Lighthouse 모바일 Performance ≥80·Accessibility ≥90·Best Practices ≥90·SEO ≥95 — 랜딩/news/jobs/about 4페이지
- [ ] Vercel Speed Insights: LCP p75 ≤2.5s · CLS p75 ≤0.1 · INP p75 ≤200ms
- [ ] `next build` 리포트 초기 JS gzip ≤220KB
- [ ] **품질 하한선**: uvengers-website.vercel.app와 나란히 비교 후 사용자 승인

### 16.8 VPS 일관성
- [ ] 05 §11·01 §10·02 §11 NFR과 본 §12 Lighthouse 수치 일치
- [ ] §13 Differential Value가 VPS §6과 일치 ([16-vps.md](../references/16-vps.md))
- [ ] §0 ADR-008 반영이 00-overview·01·02와 일치

### 16.9 /about 초안
- [ ] §5.10 초안 3개 중 사용자 선택 (OQ-C1 해결)
- [ ] 이름·회사명·학교명·"익명 유지" 명시 부재 확인
- [ ] 금지어("종합" "당신답게" "혁신적인") 부재 확인

---

## Changelog

- **2026-04-18 (v0.3.1 · SRS Rev 0.9.1 역반영)**: 모션 레이어 **Lenis + GSAP ScrollTrigger → Framer Motion + tailwindcss-animate + CSS 3D** 전환. 차트 라이브러리 **Tremor + shadcn 이원화 → shadcn/ui charts 단일화**. 근거: [SRS C-TEC-003](../srs/SRS-001-arum-cargo.md), [SRS C-TEC-006](../srs/SRS-001-arum-cargo.md), [ADR-006 Amendment](../adr/ADR-006-design-premium-animated.md). 디자인 의도(Premium Animated · Bento + Parallax + Blob)와 품질 하한선(uvengers 수준)은 유지. 이전 Changelog의 Tremor/Lenis/GSAP 표기는 역사적 기록으로 유지.
- **2026-04-11 (v0.3)**: Cargo-First Pivot 반영. 브랜드 아름 카고 · `arum.*` 토큰 네임스페이스 · 메인 페이지 Bento + Gradient Blob + Scroll Parallax Hero 전환 · 3D Carousel `/about` 하단 이동 · 차트 2원화(Tremor 관리자 + shadcn 사용자) · About 초안 3개 · uvengers 품질 하한선 · Phase 5.5 `/flights`·`/employers`·`/contribute` 와이어프레임 · 에디터 Pick 블록 시각 규약 · 승무원 카피 전면 삭제 · 수익화 카피 전면 삭제.
- 2026-04-11 (v0.2): VPS→PRD 심화. §11 MoSCoW(19 항목)·§12 NFR/SLO(16 지표, Core Web Vitals p75 목표)·§13 Differential Value(5차원)·§14 Proof(5 실험, ADR-006 review trigger 연결)·§15 ADR 인덱스·§16 DoD 5영역 세분화 추가.
- 2026-04-11: 최초 작성. D7 수정본 Premium Animated 반영 (Lenis + GSAP + 3D Carousel). 오렌지 제거·`raion.*` 토큰 확정·Pretendard+Space Grotesk 페어링.
