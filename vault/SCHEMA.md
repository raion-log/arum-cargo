---
title: "arum-aviation-hub Vault Schema"
project: "arum-aviation-hub"
version: 0.2
created: 2026-05-27
updated: 2026-05-27
base: learning-agent-vault/wiki/SCHEMA.md (간소화) + raion-finance/vault 패턴 + SESSION-PROTOCOL
---

# arum-aviation-hub — Vault Schema (v0.2)

> 이 vault는 *arum-aviation-hub 프로젝트의 지식·작업·결정·진화*를 적재하는 공간.
> Ryu's Second Brain의 `vaults/arum-aviation-hub` 로 symlink 연결됨.
> 절대 룰: 코드·기존 구조 건드리지 X. *지식·작업 적재만*.

## 폴더 역할 (8종)

| 폴더 | 역할 | 주기 |
|---|---|---|
| `_inbox/` | 분류 전 임시 캡처 | 즉시 |
| `_system/` | 이 vault 자체 메타 (README·history·운영 룰) | 변경 시 |
| `daily/` | **매일 작업 로그** (`YYMMDD.md` 한 줄 요약 + 작업 항목) | **매일** |
| `memory/sessions/` | 세션 저장본 (큰 결정·룰 변경 시 6섹션 구조) | 세션마다 |
| `memory/_current.md` | 진행 중 세션 — frontmatter만 두고 누적 X | 세션 시작 시 |
| `memory/_pending.md` | 미완료 작업·다음 액션 | 변경 시 |
| `raw/` | 원본 자료 (외부 가이드·캡쳐·인용 — provenance 필수) | 자료 받을 때 |
| `topics/` | 반복 등장 개념·압축본 | raw 누적 후 |
| `decisions/` | 검증된 결정·운영 결정 (왜·언제·누가) | 결정 시 |

## 운영 3단계 (인제스트·쿼리·린트)

> 안드레 카파시 LLM Wiki + 리히토 W2 v2 라우팅 룰 적용. 명령으로 X, *에이전트 요청*.

### 1. 인제스트 (Ingest)

| 조건 | → 폴더 |
|---|---|
| 매일 작업 진행 | `daily/YYMMDD.md` |
| 세션 큰 결정·룰 변경 | `memory/sessions/YYMMDD-HHMM-{topic}.md` |
| 미완료 작업 | `memory/_pending.md` 갱신 |
| 원본·인용·URL·캡쳐 | `raw/{YYMMDD}-{slug}.md` |
| 반복 개념·압축 | `topics/{canonical-id}.md` |
| 결정의 이유 | `decisions/{YYMMDD}-{slug}.md` |
| 분류 전 임시 | `_inbox/` |

원본·요약 분리 + 출처 명시 + 추론은 `interpretation`·`hypothesis` 라벨.

### 2. 쿼리 (Query)

봇·인간 질문 시 → *vault 안에서 찾고 답* + *경로·근거 기록*. 답변에 출처 표기.

### 3. 린트 (Lint)

깨진 링크·낡은 페이지·상충 주장 점검. *lint가 차이만 알리고 자동 수정 X*.

## daily/ 사용 가이드

`daily/YYMMDD.md` 매일 양식 (가벼움):

```markdown
# YYMMDD (arum-aviation-hub)

## 한 줄 요약
- ...

## 진행 작업
- [x] 완료한 거
- [ ] 진행 중
- [~] 막힘 / blocked

## 결정·인사이트
- ...

## 다음 액션
- ...
```

세션 종료 시 한 줄 요약은 [[memory/_pending]] 또는 [[memory/sessions]]로 자연 흐름.

## memory/ 사용 가이드 (SESSION-PROTOCOL 호환)

세션 시작:
1. `memory/_current.md` 새로 생성 또는 갱신 (`session_id`, `topic`, `started_at`)
2. `memory/_pending.md` 읽고 *🔥 즉시* 항목 점검

세션 진행:
- 60줄 임계점 또는 큰 결정 발생 시 → `memory/sessions/{YYMMDD-HHMM}-{topic}.md`로 저장 (6섹션 구조)

세션 종료:
- `daily/YYMMDD.md`에 한 줄 요약
- `memory/_pending.md` 갱신
- `memory/_current.md` 초기화

풀 SSoT: `~/Documents/Ryu's Second Brain/_system/operations.md` 또는 raion-finance/SESSION-PROTOCOL.md

## frontmatter 표준 (간소)

```yaml
---
type:              # daily / session / source / topic / decision
title:
created:
updated:
sources: []
tags: []
confidence:        # high / medium / low
status:            # active / draft / legacy / superseded
---
```

## 진화 룰

- v0.1 (2026-05-27 신설) → v0.2 (daily·memory 추가, 같은 날)
- 자료 5-10개 적재 후 v0.3 검토 (헷갈리는 지점만 룰 추가)
- 프로젝트 도메인에 맞게 *태그·폴더* 사용자 보강

## 민감정보 가드

- 개인 재정·자산·소득·계정·토큰·고객 정보 절대 X
- 민감 자료는 *별도 위치* 또는 *식별 정보 제거 후 추상*

## Second Brain 연결

- 통합 hub: `~/Documents/Ryu's Second Brain/vaults/arum-aviation-hub`
- 양방향 편집 OK (같은 inode)
- cross-project 검색은 Second Brain Obsidian에서 자연 작동

## 참고

- 표준 통합 가이드: `~/Documents/Ryu's Second Brain/_system/integration-guide.md`
- 운영 best practice: `~/Documents/Ryu's Second Brain/_system/operations.md`
- 닝 wiki 풀 버전: `learning-agent-vault/wiki/SCHEMA.md`
- W2 RH KNOWLEDGE: `~/Documents/Ryu's Second Brain/knowledge/courses/22-research-harness/KNOWLEDGE.md`
