# References Index

이 디렉토리는 **아름 카고 (Arum Cargo, 구 RAION Aviation DX Hub)** 의 **사업 전략 단일 진실 소스(SSOT)** 입니다.
흩어진 PDF·대화·결정 사항을 여기 정제해두고, 이후 모든 제품·기술 결정이 이 문서들을 참조하도록 합니다.

> **2026-04-11 전략 피벗**: Cargo-First로 전환. 근거는 [../adr/ADR-008-pivot-to-cargo-first.md](../adr/ADR-008-pivot-to-cargo-first.md). 11~16번 파일 v0.3으로 재작성됨.

## 원본 출처

- `(노트북LM)_RAION_Aviation_Strategic_Blueprint.pdf` — NotebookLM 생성 8페이지 전략 슬라이드
- `(젠스파크) AVIATION DX HUB.pdf` — Genspark 생성 6페이지 분석 슬라이드
- 대화 기반 사업 전략 서술 (Porter / Value Chain / 문제 정의 / Business One-Pager)

## 파일 목록

| # | 파일 | 내용 |
|---|---|---|
| 01 | [01-strategic-blueprint.md](./01-strategic-blueprint.md) | 전체 전략 블루프린트 요약 (Perfect Storm, White Space, Vision) |
| 02 | [02-hub-architecture.md](./02-hub-architecture.md) | A-Side / L-Side / I-Side 3축 구조 정의 |
| 03 | [03-porter-five-forces.md](./03-porter-five-forces.md) | 경쟁 5요인 분석 |
| 04 | [04-value-chain.md](./04-value-chain.md) | As-Is 파편화 vs To-Be AI 통합 가치사슬 |
| 05 | [05-problem-statements.md](./05-problem-statements.md) | A/L/I Side 각 영역의 문제 정의 |
| 06 | [06-bm-one-pager.md](./06-bm-one-pager.md) | 비즈니스 모델 원페이저 |
| 07 | [07-key-success-factors.md](./07-key-success-factors.md) | 핵심 성공 요인(KSFs)과 Moat |
| 08 | [08-macro-risks-2026.md](./08-macro-risks-2026.md) | 2026 거시경제 리스크·환율·관세·대응 전략 |
| 09 | [09-news-sources.md](./09-news-sources.md) | **v0.3** 데이터 소스 — 카고 뉴스(§1~5 카고프레스·Loadstar·Air Cargo News·FlightGlobal Cargo) + 운항 Phase 5.5(§6) + 카고 채용(§7 워크넷·사람인·콘솔사·포워더 공식 딥링크) |
| 10 | [10-aviation-glossary.md](./10-aviation-glossary.md) | 항공·물류 전문 용어집 |
| 11 | [11-tam-sam-som.md](./11-tam-sam-som.md) | **v0.3** 한국 항공 화물 생태계 TAM/SAM/SOM (21k/15.7k/500~8k WAU) + Segment Map (도메인×디지털능동성) |
| 12 | [12-integration-strategy.md](./12-integration-strategy.md) | Aggregator + Value-Add + Owned Audience 3층 전략 |
| 13 | [13-personas.md](./13-personas.md) | **v0.3** 카고 페르소나 (C1 2~5년차 콘솔사 핀포인트 + C2/C3 + A1 + B1 + N1/N2) |
| 14 | [14-customer-journey-map.md](./14-customer-journey-map.md) | 고객 여정지도 — **C1 이지훈 기반으로 v0.3 재작성 필요** (Phase B에서 진행) |
| 15 | [15-aos-dos-opportunity.md](./15-aos-dos-opportunity.md) | **v0.3** 카고 Pain 14개 + MVP Top 5 (P04 지인 추천 / P01 뉴스 / P03 채용 / P02 해외 / P05 현직자 시선) |
| 16 | [16-vps.md](./16-vps.md) | **v0.3** VPS — 아름 카고 C1 JTBD + WAU North Star (Amplitude/Reforge/Morning Brew) + ADR-008 매핑 |
| 17 | [17-srs-methodology.md](./17-srs-methodology.md) | **v0.1** PRD → SRS 전환 방법론 — ISO/IEC/IEEE 29148:2018 기반, Spec-Driven Development 타당성 + 9섹션 매핑 + REQ-FUNC 템플릿 + Sequence Diagram 5개 후보 |
| 99 | [99-advisor-notes.md](./99-advisor-notes.md) | 외부 자문가 Q&A 누적 로그 + 2026-04-11 피벗 세션 |

## ADR 교차 참조

- [../adr/ADR-008-pivot-to-cargo-first.md](../adr/ADR-008-pivot-to-cargo-first.md) — Cargo-First 피벗 원본 의사결정
- [../adr/README.md](../adr/README.md) — ADR 전체 목록

## 업데이트 규칙

- **비즈니스 결정이 바뀌면 해당 파일 즉시 수정**. 변경 시 파일 하단에 `## Changelog` 섹션에 한 줄 추가.
- **자문가 피드백으로 인한 변경**은 반드시 `99-advisor-notes.md`에 원본을 남기고, 그 액션아이템이 어느 파일에 반영되었는지 교차참조.
- **결정 유보 항목**은 여기 말고 [../open-questions.md](../open-questions.md) 로.

## Changelog

- **2026-04-11 v0.3**: Cargo-First Pivot. ADR-008 의사결정에 따라 11·13·15·16·09 v0.3 전면 재작성. 브랜드 "아름 카고 (Arum Cargo)" 확정. 14(CJM)는 Phase B에서 C1 이지훈 기준으로 재작성 예정.
- 2026-04-11 v0.2: 11~15 Phase 0.5 확장 + 16 VPS 추가.
- 2026-04-11 v0.1: 최초 작성 (01~10 기초 SSOT).
