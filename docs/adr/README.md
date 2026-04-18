# Architecture Decision Records (ADR)

> **ADR은 "과거의 우리가 왜 이런 결정을 했는지 미래의 우리에게 설명"하는 문서다.**
> 각 ADR은 1 결정 = 1 파일 원칙. Context → Decision → Consequences → Alternatives 순.

## 목록

| # | 제목 | 상태 | 출처 |
|---|---|---|---|
| [ADR-001](./ADR-001-email-service-loops-over-resend.md) | 이메일 서비스: Loops.so over Resend | Accepted (2026-04-11) | OQ-SOLVED-5, D7 |
| [ADR-002](./ADR-002-flight-data-kac-iiac-over-aviationstack.md) | 운항 데이터: KAC+IIAC 공공데이터포털 over AviationStack | Accepted (2026-04-11) | OQ-SOLVED-6, D2 |
| [ADR-003](./ADR-003-no-auth-mvp-email-token-only.md) | Auth 전략: MVP 무인증 + 이메일 토큰 | Accepted (2026-04-11) | OQ-SOLVED-8, D4 |
| [ADR-004](./ADR-004-hybrid-job-curation.md) | 채용 큐레이션: 하이브리드 pending/approved | Accepted (2026-04-11) | OQ-SOLVED-7, D5 |
| [ADR-005](./ADR-005-cron-hybrid-vercel-github.md) | Cron: Vercel Cron + GitHub Actions 하이브리드 | Accepted (2026-04-11) | OQ-SOLVED-M3, D6 |
| [ADR-006](./ADR-006-design-premium-animated.md) | 디자인 방향: Premium Animated (Framer Motion + CSS 3D) | **Amended 2026-04-18** (원 Lenis+GSAP → Framer Motion 교체, SRS Rev 0.9.1 C-TEC-003) | D7 수정본 |
| [ADR-007](./ADR-007-translation-gpt-4o-mini.md) | 번역 엔진: Provider-Agnostic (MVP 기본 OpenAI GPT-4o-mini) | **Amended 2026-04-18** (원 OpenAI 고정 → `TRANSLATION_PROVIDER` env 추상화, SRS Rev 0.9.1 C-TEC-015) | OQ-M1 |
| [ADR-008](./ADR-008-pivot-to-cargo-first.md) | Cargo-First 전략 피벗 (아름 카고) | Accepted (2026-04-11) | 99-advisor-notes 피벗 세션 |

## 작성 규칙

- 상태값: `Proposed` | `Accepted` | `Superseded by ADR-XXX` | `Deprecated`
- 결정을 번복할 때 기존 ADR을 삭제하지 말고 `Superseded`로 표기한 후 새 ADR 작성
- PRD에서 결정을 참조할 때 `[ADR-XXX](../adr/ADR-XXX-slug.md)` 형식으로 링크
