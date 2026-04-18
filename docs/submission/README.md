# 과제 제출물 인덱스 — 아름 카고 (Arum Cargo) PRD 제출

**프로젝트**: 아름 카고 (Arum Cargo, 구 RAION Aviation DX Hub)
**제출일**: 2026-04-11
**단계**: Phase 1 (PRD v0.3 전면 재작성) 완료

---

## 필수 제출물

### PRD 최종본 (v0.3 Cargo-First Pivot)

본 과정의 PRD는 **9개 파일로 구성된 세트**다. 대표 앵커 챕터는 [`00-overview.md`](../prd/00-overview.md) 이며, 나머지 8개 파일이 도메인별 세부 챕터를 이룬다.

| # | 파일 | 역할 |
|---|---|---|
| 00 | [`00-overview.md`](../prd/00-overview.md) | **앵커** — 비전·페르소나·KPI·스코프 |
| 01 | [`01-a-side-academy-career.md`](../prd/01-a-side-academy-career.md) | 카고 채용 도메인 |
| 02 | [`02-i-side-information.md`](../prd/02-i-side-information.md) | 카고 뉴스 도메인 |
| 03 | [`03-data-model.md`](../prd/03-data-model.md) | DB 스키마 |
| 04 | [`04-api-integration.md`](../prd/04-api-integration.md) | 외부 API 연동 |
| 05 | [`05-email-growth-loop.md`](../prd/05-email-growth-loop.md) | 이메일·성장 루프 |
| 06 | [`06-ui-ux-spec.md`](../prd/06-ui-ux-spec.md) | UI/UX 명세 |
| 07 | [`07-roadmap-milestones.md`](../prd/07-roadmap-milestones.md) | 로드맵·마일스톤 |
| 99 | [`99-quality-review.md`](../prd/99-quality-review.md) | 자체 품질 검토 |

**버전 진화**: v0.1(초안) → v0.2(품질 검토 강화) → **v0.3(Cargo-First Pivot, 최종본)**
각 파일 하단 Changelog 섹션에 변경 이력이 남아있고, 피벗의 근거는 [`ADR-008 Cargo-First Pivot`](../references/ADR-008-pivot-to-cargo-first.md) 에 Context / Options / Decision / Consequences / Review Trigger 5 필드로 기록되어 있다.

### 원천 문서 (PRD 근거)

PRD를 작성하기 전에 먼저 확정된 상류 문서들:

- [`docs/references/16-vps.md`](../references/16-vps.md) — Value Proposition Sheet (PRD의 "왜")
- [`docs/references/13-personas.md`](../references/13-personas.md) — C1 이지훈 핀포인트 페르소나
- [`docs/references/15-aos-dos-opportunity.md`](../references/15-aos-dos-opportunity.md) — 14개 Pain + MVP Top 5
- [`docs/references/11-tam-sam-som.md`](../references/11-tam-sam-som.md) — 시장 규모
- [`docs/references/09-news-sources.md`](../references/09-news-sources.md) — 데이터 소스
- [`docs/references/ADR-008-pivot-to-cargo-first.md`](../references/ADR-008-pivot-to-cargo-first.md) — 피벗 의사결정

---

## Optional 제출물

### Optional 1 — PRD 품질 검사 결과지

→ [`optional-1-quality-check.md`](./optional-1-quality-check.md)

10개 핵심 검사 항목 체크표 + NFR 가드레일 상세 (수치·측정 도구·위반 시 조치 3요소) + 구조적 강점 + 인정된 빈틈 + 판정 요약. 원본 자체 품질 검토인 [`99-quality-review.md`](../prd/99-quality-review.md) v2.0 (평균 96/100) 을 과제 제출 포맷으로 재구성한 것.

### Optional 2 — 시중 바이브코딩 업스트림 도구 PRD vs 우리 과정 PRD 비교

→ [`optional-2-vooster-comparison.md`](./optional-2-vooster-comparison.md)

비교 대상: **[Vooster.ai](https://www.vooster.ai/ko)**, **[Task Master](https://github.com/eyaltoledano/claude-task-master)** 같은 바이브코딩 업스트림(PRD 생성 + Task 분해 + MCP 연결) 도구.
핵심 차이 12개 차원 표 + 공정한 양면 분석 + 상호보완 포인트 + 외부 출처 7개.

---

## 프로젝트 컨텍스트 참고

- [`CLAUDE.md`](../../CLAUDE.md) — 프로젝트 전체 규칙·환경 변수·현재 단계
- [`docs/open-questions.md`](../open-questions.md) — 미결 항목 트래커
- [`docs/glossary.md`](../glossary.md) — 용어집 (§8 화물 전문 용어 + §11 FAQ)

---

## 제출 가이드

단일 파일 제출이 필요한 경우: **[`docs/prd/00-overview.md`](../prd/00-overview.md)** 를 대표 파일로 지정하고, 본 README를 인덱스로 동봉.

폴더 단위 제출이 가능한 경우: **[`docs/prd/`](../prd/)** 폴더 전체 (9개 파일) + **[`docs/submission/`](./)** 폴더 전체 (Optional 2개 + 본 README).
