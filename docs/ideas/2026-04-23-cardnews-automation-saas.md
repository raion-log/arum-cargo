---
title: 카드뉴스 자동화 SaaS (가칭)
type: idea
created: 2026-04-23
status: parked
priority: future (post-Phase 5)
related:
  - docs/adr/ADR-008-pivot-to-cargo-first.md
  - docs/open-questions.md
---

# 카드뉴스 자동화 SaaS — 1 Pager

> **상태**: parked. 아름 카고 Phase 5 MVP 이후 재검토.

## 한 줄 컨셉

**Wiki (LLM 지식베이스) + Claude + 이미지 렌더 엔진** 을 결합해
**브랜드별 카드뉴스·숏폼 콘텐츠를 자동 생성하는 SaaS**, 사용자는 Figma 스타일 웹 캔버스에서 편집.

## 왜 이 구조가 특이한가

기존 경쟁자 비교:

| 제품 | 입력 | 자동화 | 캔버스 편집 | 지식 누적 |
|---|---|---|---|---|
| Canva Magic Write | 프롬프트 | 부분 | ✅ | ❌ |
| Figma | 직접 디자인 | ❌ | ✅ | ❌ |
| Predis.ai | URL·텍스트 | ✅ | 제한적 | ❌ |
| **이 아이디어** | **도메인 wiki** | ✅ | ✅ | ✅ |

차별점: **"지식이 누적될수록 똑똑해지는 카드뉴스"** — 브랜드별 wiki 가 곧 스타일 가이드·팩트체크 소스·이전 콘텐츠 컨텍스트가 됨.

## 예상 첫 사용자 (JTBD)

1. **광고 대행사 AE** — 클라이언트 10개 × 월 20건 콘텐츠 → 담당자당 월 200건 수작업 한계
2. **B2B 마케터** — 업계 전문성은 있는데 디자인 역량 부족, 주 2~3회 LinkedIn·뉴스레터 발행 필요
3. **1인 크리에이터 / 뉴스레터 운영자** — 아름 카고 운영자 본인 포함. 도메인 전문가이지만 비주얼 제작에 시간 뺏김

## MVP 스코프 (가상)

- 입력: 사용자별 도메인 wiki (본인 Obsidian vault or URL 피드)
- 처리: Claude → 5장 카드 스토리보드 생성 (Hook / Fact / Insight / Bottom Line / Source)
- 렌더: Satori → PNG 5장 + 브랜드 CSS
- 캔버스: 웹 에디터에서 드래그·텍스트 수정·재생성
- 출력: 인스타 9:16 / 카톡 1:1 / 링크드인 1200x628 / 릴스 30s (Remotion fallback)

## 기술 스택 가정 (아름 카고 스택 재활용 가능)

- Next.js 14 + TS (✓ 기존 스택)
- Supabase (✓ 기존 스택)
- **Satori (@vercel/og)** — 정지 이미지 렌더, Vercel 네이티브
- **Remotion** — 릴스·숏폼 영상 렌더 (선택)
- **tldraw** 또는 자체 — 웹 캔버스 UI

## 왜 지금은 하지 않나 (리스크)

1. **포커스 희석**: 아름 카고가 Phase 2 진입 직전. 병행 시 둘 다 실패 가능.
2. **PMF 검증 부재**: "광고 대행사가 이걸 돈 내고 쓸까?" 를 아직 고객 1명에게도 안 물어봄.
3. **개발 부채**: 웹 캔버스 (Figma-like) 는 과거 수많은 스타트업이 도전하다 실패 (tldraw·Excalidraw 같은 오픈소스가 이미 존재).
4. **경쟁 성숙도**: Canva·Predis.ai·Vista Create 이미 수십억 달러 레벨. 차별화 포인트인 "wiki 기반 지식 누적" 이 실제로 sticky 한지 미검증.

## 추천 경로 (단계적 발견)

**Phase A — Arum Cargo 내재화 (2026-Q3~Q4)**
아름 카고 마케팅 용 카드뉴스 자동화를 **내부 도구**로 만듦 (`scripts/cardnews/`). 외부 공개 NO. Satori + Claude 조합으로 POC.

**Phase B — Dogfooding 검증 (2026-Q4~2027-Q1)**
내부 도구가 본인에게 주 10+ 시간 절약 효과를 주는지 측정. 아름 카고 인스타·뉴스레터 성장에 기여하는지.

**Phase C — 첫 외부 고객 인터뷰 (WAU 500 달성 전후)**
"이 도구 외부에 주면 돈 낼 사람?" 을 광고 대행사 5곳 + 1인 크리에이터 5명에게 직접 인터뷰. 월 $50 선납 확약 3건 확보되면 pivot 결정.

**Phase D — 별도 레포 분사 (검증 통과 시)**
`arum-cargo` 와 분리된 신규 저장소. 브랜드·ADR·팀 구성 별개. 아름 카고는 첫 레퍼런스 고객으로 유지.

## Next actions

- [ ] 이 문서를 `open-questions.md` 에 OQ-IDEA-01 로 참조 등록 (우선순위 하)
- [ ] 6개월 후 (2026-10-23) 재검토 알람
- [ ] 아름 카고 Phase 5 MVP 완성 후 마케팅용 POC 스크립트 `scripts/cardnews/` 착수 검토

## 연관 결정

- **ADR-008** (Cargo-first pivot) 를 희석시키지 않음 — 본 아이디어는 철저히 **Phase 5 이후**
- **현재 CLAUDE.md §2.3** 브랜드 규칙과 충돌 없음 — "아름" 이 상위 브랜드, 카드뉴스 SaaS 는 sub-brand 또는 별도 브랜드 옵션

---

_참고_: 이 문서는 아이디어 캡처만 목적. 구현 계약이 아님. 재검토 시 위 리스크 4가지부터 정면으로 해소 요구.
