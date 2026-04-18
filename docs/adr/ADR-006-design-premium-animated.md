# ADR-006 — 디자인 방향: Premium Animated (Framer Motion + CSS 3D)

- **Status**: **Amended 2026-04-18** (원 결정은 Lenis + GSAP 기반이었으며, SRS-001 Rev 0.9.1 C-TEC-003에 따라 모션 레이어를 **Framer Motion + tailwindcss-animate + CSS 3D transform**으로 교체. 디자인 의도(Premium Animated)는 동일 유지)
- **Date**: 2026-04-11 (최초) · 2026-04-18 (Amended)
- **Owner**: Arum Cargo Founder
- **Referenced by**: [prd/06-ui-ux-spec.md](../prd/06-ui-ux-spec.md), [SRS C-TEC-003](../srs/SRS-001-arum-cargo.md)
- **Related**: [references/99-advisor-notes.md 2026-04-11 Q8](../references/99-advisor-notes.md) D7 수정본

---

## Context

초기 디자인 논의(D7)에서 **Functional Clean** 베이스(정적·타이포 중심)로 결정했으나, 사용자 피드백:

> "대시보드만 봐도 우와 할 수 있게 해줘. 스크롤에 따른 리액트 효과가 나오게끔 하면 좋을 듯 해. 3D carousel 도 괜찮았던거 같아."

→ 단순 Functional Clean은 **첫 방문 인상의 "우와" 순간**을 못 만든다. 경쟁 대안(네이버 카페·사람인)은 모두 평범한 리스트 UI — 차별화 기회가 있음.

동시 제약:
- MVP 번들 사이즈 관리 필요 (모바일 LCP < 2.5s)
- 배터리·저사양 기기 배려 (`prefers-reduced-motion`)
- 오렌지 컬러 사용 금지 (사용자 피드백)
- 항공 프리미엄 톤 (Joby·aircord 참조)

## Decision

**Functional Clean 베이스 + Premium Animated 레이어** 2중 구조.

**레이어 1 — Functional Clean (기본)**
- `raion.ink / navy / sky / blue / cloud` 쿨 팔레트 (오렌지 금지)
- Pretendard Variable (한영 본문) + Space Grotesk (헤드라인·숫자) + JetBrains Mono (편명)
- Tailwind + shadcn/ui 기본 전환 (`transition-all duration-200 ease-out`)

**레이어 2 — Premium Animated (액센트) — 2026-04-18 Amended**
- **Framer Motion** (`framer-motion@11.x`, ~20KB gzipped): 스태거드 리빌 (`staggerChildren`, Joby 참조 0.08~0.5s 간격), 섹션 진입 `whileInView` fade-up, Scroll Parallax (`useScroll` + `useTransform`)
- **tailwindcss-animate**: 기본 fade/slide 전환
- **CSS 3D + Framer Motion `useMotionValue`**: 3D Carousel (`transform-style: preserve-3d`). WebGL 없음. `/about` 하단만
- **react-intersection-observer**: 카드 그리드 fade-in (가벼움)
- 부드러운 스크롤: CSS `scroll-behavior: smooth` + iOS Safari 기본 동작으로 충분 (Lenis 제거)

**금지 목록**:
- GSAP·Lenis (이번 Amendment 이후 제거 — 선언적 API·AI 코드 생성 친화·번들 경량화 목적)
- Lottie (배터리 드레인)
- 상시 WebGL Globe (Three.js flight tracker 같은 것)
- 오렌지 계열 전체

## Consequences

**긍정**
- 첫 방문 60초 안에 "우와" 체감 — C1·C2·C3 페르소나 리텐션 기대
- 랜딩 → 구독 폼 전환율 상승 가설 (벤치 전환율 5% → 목표 10%+)
- 번들 사이즈 증가 제한: **Framer Motion ~20KB gzipped + tailwindcss-animate ~0.5KB ≈ +20KB** (이전 Lenis+GSAP 조합 대비 절반 이하)
- 저사양·접근성 고려는 `prefers-reduced-motion`으로 폴백

**부정·리스크**
- 3D Carousel 구현 난이도 → Phase 3 일정 리스크 (구현 실패 시 정적 그리드 폴백)
- Framer Motion은 무료(MIT). 유료 플러그인 없음
- 모바일 프레임드롭 우려 → LCP/CLS/INP 모니터링 + 임계 초과 시 모션 축소
- 디자인 복잡도가 Phase 3 범위 초과할 가능성 → 섹션 우선순위(Hero > 카드 리빌 > 3D Carousel) 명시

## Alternatives Considered

| 대안 | 이유 기각 |
|---|---|
| **Functional Clean 단독** | "우와" 순간 부재, 경쟁 대안과 차별화 약함 |
| ~~**Framer Motion 전면 도입**~~ (2026-04-18 Amendment로 Framer Motion 채택되어 해당 기각 사유 철회) | — |
| **Three.js WebGL 전면 도입** (jeantimex/flights-tracker 스타일) | 배터리·모바일 발열, MVP 과잉. D3 결정(간단 운항 테이블)과 일관 |
| **Swiper 2D carousel** | 평범함, "우와" 순간 부재 |
| **정적 HTML + CSS 전환만** | 현대 항공 프리미엄 톤 구현 불가 |

## Verification

- [ ] Tailwind config에 `arum.*` 토큰 전부 반영, 오렌지 계열 부재 확인
- [ ] 폰트 페이로드 모바일 < 100KB
- [ ] Lighthouse 모바일 Performance ≥ 80, LCP ≤ 2.5s, CLS ≤ 0.1, INP ≤ 200ms
- [ ] `prefers-reduced-motion: reduce` 시 Framer Motion `useReducedMotion()` + CSS 3D transform off + Blob drift 정지 확인
- [ ] 3D Carousel Phase 3 말까지 완성 (실패 시 정적 로고 그리드 폴백)
- [ ] Hero 스태거드 리빌 0.08~0.5s 간격 Joby 수준 재현 (`staggerChildren`)
- [ ] 모바일 320px~1920px 반응형 통과
- [ ] package.json 에 `gsap` · `@studio-freight/lenis` 의존성 부재 확인 (2026-04-18 Amendment)

## Review Trigger

- Lighthouse Performance < 70 지속
- 사용자 피드백 "너무 화려하다 / 산만하다" 3회 이상
- LCP > 3s 초과
- 3D Carousel 구현 난도로 Phase 3 지연 발생

## Changelog

- **2026-04-18 Amendment (SRS-001 Rev 0.9.1 반영)**: 모션 레이어를 **Lenis + GSAP ScrollTrigger → Framer Motion + tailwindcss-animate + CSS 3D**로 교체. 디자인 의도(Premium Animated)와 레이어 구조(Functional Clean 베이스 + Premium 액센트)는 동일 유지. 교체 근거: 선언적 API로 Tailwind·shadcn과 결 일치, AI 코드 생성 친화, 번들 ~50KB → ~20KB 감소, `useReducedMotion()` 한 줄로 reduced-motion 대응. 3D Carousel은 WebGL 없이 CSS `transform-style: preserve-3d` + Framer Motion `useMotionValue` 기반으로 재설계. Amendment 근거: [SRS-001 Rev 0.9.1 Changelog](../srs/SRS-001-arum-cargo.md), 사용자 지시 "효율성·가성비 + 구현 품질 우선".
- **2026-04-11**: 최초 작성.
