---
title: Wiki Schema
type: schema
created: 2026-04-22
updated: 2026-04-22
---

# Wiki Schema (LLM 운영 규율)

> 이 파일은 **이 저장소의 위키를 관리하는 모든 LLM 세션이 반드시 먼저 읽는 설정 파일** 이다.
> 원칙 원본: Karpathy, [llm-wiki.md](../llm-wiki.ko.md).
> 이 저장소의 프로젝트 규칙 SSOT: [CLAUDE.md](../CLAUDE.md).

## 1. 3-레이어 아키텍처

| 레이어 | 경로 | 소유권 | 규칙 |
|---|---|---|---|
| Raw (원본) | `raw/` | 사용자 | **불변**. LLM은 읽기만. 이동·삭제·수정 금지. |
| Wiki | `wiki/` | LLM | 전적으로 LLM이 쓰고 유지. 사용자는 읽기 중심. |
| Schema | `wiki/schema.md` (이 파일) + `CLAUDE.md` | 공동 | 변경 시 사용자 승인 필요. |

### Raw 하위 규약
- `raw/inbox/` — Obsidian Web Clipper 및 수동 클리핑 드롭존 (처리 전).
- `raw/sources/YYYY-MM/` — 처리 완료 자료를 연·월별로 보관 (사용자가 이동; LLM은 제안만).
- `raw/assets/` — 이미지·PDF·데이터 파일 (Obsidian attachment folder).

### Wiki 하위 규약
- `wiki/index.md` — 콘텐츠 카탈로그 (모든 페이지 링크 + 한 줄 요약). 매 ingest마다 갱신.
- `wiki/log.md` — 시간순 append-only 이벤트 로그 (ingest/query/lint).
- `wiki/sources/` — 원본 1건 = wiki 페이지 1개. 요약·핵심 시사점·원본 링크.
- `wiki/entities/` — 고유명사 (인물·회사·공항·기종·제품·조직).
- `wiki/concepts/` — 반복 등장하는 개념·용어·방법론 (AWB, ULD, TAC Index 등).

## 2. Frontmatter 스키마 (Dataview 호환)

모든 wiki 페이지는 YAML frontmatter로 시작한다.

### 공통 필드
```yaml
---
title: <한국어 정식 명칭>
type: source | entity | concept
created: YYYY-MM-DD
updated: YYYY-MM-DD
aliases: [영문명, 약어, 동의어]
tags: [도메인태그1, 도메인태그2]
---
```

### `type: source` 전용 추가 필드
```yaml
source_url: https://...
source_name: <언론사·저자>
source_date: YYYY-MM-DD
entities: ["[[entities/대한항공]]", "[[entities/인천공항]]"]
concepts: ["[[concepts/AWB]]"]
```

### `type: entity` / `type: concept` 전용 추가 필드
```yaml
sources: ["[[sources/2026-04-22-기사제목-slug]]"]
related:  ["[[concepts/ULD]]", "[[entities/대한항공]]"]
```

## 3. 페이지 템플릿

### 3.1 Source 페이지
파일명: `wiki/sources/YYYY-MM-DD-short-slug.md`

```markdown
---
title: <원문 제목 한국어 요약>
type: source
created: YYYY-MM-DD
updated: YYYY-MM-DD
source_url: ...
source_name: ...
source_date: ...
tags: [...]
entities: [...]
concepts: [...]
---

# <제목>

## 한 줄 요약
<1문장>

## 핵심 시사점
- <bullet 3~7개, 각 1~2문장>

## 본문 발췌
> 인용은 짧게(≤140자 × 3개 이내). 원문 통째 복사 금지.

## 관련 엔티티·개념
- [[entities/...]]
- [[concepts/...]]

## 원본 링크
- [원문 보기](<source_url>) — <source_name>, <source_date>
```

### 3.2 Entity 페이지
파일명: `wiki/entities/<한국어-정식명-kebab>.md` (예: `wiki/entities/대한항공-화물.md`)

```markdown
---
title: 대한항공 화물사업본부
type: entity
created: ...
updated: ...
aliases: [KE Cargo, Korean Air Cargo]
tags: [항공사, 대형항공사, FSC]
sources: [...]
related: [...]
---

# 대한항공 화물사업본부

## 개요
<2~4문장 핵심 프로필>

## 주요 사실
- 기단: B747-8F, B777F, ...
- 허브: ICN
- ...

## 관련 개념
- [[concepts/Freighter]]
- [[concepts/Belly]]

## 출처
- [[sources/...]]

## 변경 이력
- 2026-04-22: 페이지 생성
```

### 3.3 Concept 페이지
파일명: `wiki/concepts/<한국어-용어-kebab>.md` 또는 `wiki/concepts/AWB.md`

```markdown
---
title: AWB (Air Waybill)
type: concept
created: ...
updated: ...
aliases: [Air Waybill, 항공화물운송장, MAWB, HAWB]
tags: [항공화물, 운송서류]
sources: [...]
related: ["[[concepts/HAWB]]", "[[concepts/Consolidator]]"]
---

# AWB (Air Waybill, 항공화물운송장)

## 정의
<1~2문장>

## 왜 중요한가
<이 도메인(카고)에서의 역할>

## 구조·변형
- MAWB (Master AWB): ...
- HAWB (House AWB): ...

## 관련 용어
- [[concepts/...]]

## 출처
- [[sources/...]]
```

## 4. 링크 컨벤션 (Obsidian wikilink)

- **기본 형식**: `[[concepts/AWB]]` — 경로 포함 (중복 파일명 안전).
- **표시 변경**: `[[concepts/AWB|항공화물운송장]]`.
- **상호 링크 원칙**: 언급한 모든 entity/concept는 양방향 링크로 연결. source 페이지가 entity를 언급하면, 해당 entity 페이지의 `sources:` 에도 역참조 추가.
- **고아(orphan) 금지**: 어떤 페이지도 최소 1개 들어오는 링크를 가져야 함 (없으면 index.md에서라도 링크).

## 5. Ingest 워크플로우 (`/ingest` 명령이 따르는 순서)

1. **대상 수집**: `$ARGUMENTS` 경로 우선. 비면 `raw/inbox/**/*.md` + `raw/inbox/**/*.pdf` 중 `log.md`에 ingest 기록 없는 파일.
2. **자료당 반복**:
    1. 자료 읽기 → 사용자에게 한 줄 요약 + 핵심 시사점 3~5개 보고.
    2. `wiki/sources/YYYY-MM-DD-slug.md` 생성 (§3.1 템플릿).
    3. 본문에서 언급된 entity·concept 식별 → 각각 페이지 존재 여부 확인:
        - 없으면 §3.2/§3.3 템플릿으로 생성.
        - 있으면 `updated:` 갱신 + 새 정보 반영 + `sources:` 에 역참조 추가.
    4. **모순 검출**: 새 자료가 기존 entity/concept 페이지의 주장과 충돌하면 해당 페이지에 `## ⚠️ 모순 기록` 섹션 추가 (사용자 판단 필요).
3. **인덱스 갱신**: `wiki/index.md` 에 새 페이지 링크 + 한 줄 요약 추가.
4. **로그 append**: `wiki/log.md` 끝에 `## [YYYY-MM-DD] ingest | <source title>` + 변경된 파일 목록.
5. **사용자 보고**: 생성/수정/모순 건수 요약.

## 6. Query 워크플로우

1. 먼저 `wiki/index.md` 로드 → 관련 페이지 식별.
2. 해당 페이지들 읽기 → 상호 링크를 통해 확장.
3. **인용 필수**: 답변의 모든 주장은 `[[wiki 페이지]]` 또는 `source_url` 로 근거 표기.
4. **가치 있는 종합은 페이지화**: 사용자가 던진 비교·분석으로 새 통찰이 나오면 `wiki/concepts/` 또는 `wiki/entities/` 에 페이지 생성 제안.
5. log.md에 `## [YYYY-MM-DD] query | <질문 요지>` 추가.

## 7. Lint 워크플로우 (`/lint` 또는 주기 실행)

점검 항목:
- 고아 페이지 (들어오는 링크 0개).
- 깨진 링크 (`[[...]]` 가 존재하지 않는 파일).
- frontmatter 누락·오류 (`type`, `created`, `updated`).
- `updated:` 가 30일+ 경과 + 최근 source 커버리지 있는 페이지 → 재요약 제안.
- 동일 개념의 중복 페이지 (aliases 겹침).
- 모순 마커 (`⚠️ 모순`) 가 30일+ 미해결.

결과는 `wiki/log.md` 에 `## [YYYY-MM-DD] lint | summary` 로 기록.

## 8. 프로젝트 고유 제약 (CLAUDE.md 상속)

- **뉴스 원문 저장 금지**: 제목 + 요약(2~3문장) + 원문 링크 + 출처까지만 (CLAUDE.md §5.1).
- **인스타그램 크롤링 금지**: 공식 피드·파트너십 경로만.
- **실명·회사명·학교명·직책 공개 금지**: About 페이지 포함 모든 공개 컨텐츠. 작성자는 "11년차 항공 화물 현직자"까지만 (CLAUDE.md §2.3).
- **비카고 직군 배제**: 승무원·객실·조종사·부기장·정비사 관련 자료는 ingest하지 않음 (ADR-008).
- **한국어 우선**, 전문 용어는 영문 병기 (CLAUDE.md §3).

## 9. 변경 시 규칙

- 이 schema.md 를 수정할 때는 **반드시 `wiki/log.md` 에 `## [YYYY-MM-DD] schema | 변경 요약`** 추가.
- 사용자 승인 없이 §1, §2, §8 변경 금지.
