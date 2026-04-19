# ADR-009 — 타겟 재정렬: Primary A1 (카고 취준생) / Secondary C1 (2~5년차 현직자)

- **Status**: **Accepted 2026-04-19**
- **Date**: 2026-04-19
- **Owner**: Arum Cargo Founder
- **Supersedes**: ADR-008 의 "Primary C1 현직자" 암묵적 전제 (Cargo-First Pivot 유지는 그대로)
- **Referenced by**: [SRS Rev 1.1](../srs/SRS-001-arum-cargo.md), [PRD 00 §2](../prd/00-overview.md), [CLAUDE.md §1](../../CLAUDE.md)

---

## Context

ADR-008 Cargo-First Pivot 직후 Primary 타겟은 **C1 이지훈 (2~5년차 콘솔사·포워더 영업·오퍼)** 로 고정되었다. 2026-04-19 냉정 유용성 감사 결과:

| 타겟 | 유용성 점수 | 이유 |
|---|---|---|
| **잠재 채용 인원 (A1)** | **8/10** | 사람인·워크넷 혼입률 20~30% 해소 · 14 카고 기업 공식 딥링크 · 용어 툴팁 = **직접 가치**. 대체재 부재 |
| 현직자 (C1) | 6/10 | **대체재 우세** — Loadstar 유료 구독, 업계 카카오톡방, LinkedIn. "있으면 쓰는 tier" |
| 신규 입사자 (C2) | 4/10 | 범위 부적합 — 신입은 "업계 trend" 보다 자기 회사 업무 매뉴얼 필요 |
| 8년차+ 팀장 (C3) | 2/10 | 원문 필요 · 요약 불필요 |

**가장 명확한 가치 수취자는 취업 준비생.** 기존 Primary 전제가 실제 유용성과 역전되어 있었음.

동시에 뉴스 소스 부족 리스크 (국내 RSS 4종 · 해외 3종 = 하루 ≥ 5건 다이제스트 구성 불확실) 를 **Gemini Search grounding + YouTube 비디오 input** 으로 보완 가능 (카고 전문 YouTube 채널 자막 취합).

---

## Decision

### 타겟 우선순위 재정렬

| 순위 | 페르소나 | 역할 | MVP 기여 |
|---|---|---|---|
| **Primary ★★★** | **A1 정하늘** (항공물류 전공 4학년 · 카고 취준) | 랜딩 Hero Primary CTA 기준점 | 공식 채용 딥링크 + 용어 툴팁 + 에디터 Pick 현장 맥락 |
| Secondary ★★ | C1 이지훈 (2~5년차 콘솔사·포워더 영업·오퍼) | 다이제스트 구독 유지 유저 | 뉴스 요약 · 지인 추천 외 이직 경로 |
| Tertiary ★ | C2 박서연 (1년차 신입) | 용어·업계 맥락 학습 | 글로서리 50건 · 용어 인라인 툴팁 |
| Adjacent | C3 김태영 (8년차 팀장) | Secondary 구독 | 해외 카고 뉴스 한글 요약 (Loadstar 대체 아님) |
| Phase 5.5 | B1 최혜진 (HR) | `/employers` 문의 | 인재풀 접근 |

### Frame 변경

- **랜딩 Hero Primary CTA**: "뉴스 구독" 축 → **"카고 채용 허브 + 구독"** 양축. `/jobs` 콘텐츠가 Hero 에서 눈에 먼저 들어오도록 Bento 레이아웃 조정.
- **에디터 Pick 톤**: 11년차 현직자 voice **유지** + **취준생 관점 용어 언팩 · 맥락 설명** 강화. 한 Pick 에 "업계 사람만 아는 표현" 을 한 번씩 해설.
- **뉴스 축 보완 (Gemini 확장)**: C-TEC-025 Admin Research Copilot 의 **Gemini Search + YouTube grounding 부분만 Phase 4 에 조기 도입**. 카고 전문 YouTube 채널(예: FlightGlobal Cargo · Cargolux · Emirates SkyCargo · 국내 업계 유튜버) 의 신규 영상 자막을 관리자 리서치 참고 자료로 취합. **사용자 공개 콘텐츠에 LLM 산출물 직접 게시 금지 원칙 (C-TEC-016) 유지** — 유튜브 요약도 에디터 Pick 작성 시 참고용만.

### 에디터 Pick 작성 부담 경감

- 매일 3~4개 × 140자 → **주 3회 배치 작성 (월·수·금)** + 주말 다음 주 분 5건 일괄 초안
- 커버리지 목표: ≥60% → **≥40%** 하향 (Rev 1.1 REQ-NF-080 수정)

### North Star (변경 없음)

- WAU 500 · 4주 유지율 ≥40% 유지 (구독 중심 지표는 취준생도 유효)
- **병행 관측 지표 추가**: 채용 공고 클릭률 · 14 공식 딥링크 이탈률 · `/jobs` → 구독 전환율 (취업 시그널)

---

## Consequences

### 긍정

- 가장 명확한 가치 수취자에게 먼저 도달 → 초기 WAU 획득 속도 가속
- 대체재 없는 영역 (카고 전용 채용 필터) 을 전면 내세움으로써 차별화 명확
- Gemini YouTube grounding 으로 콘텐츠 다양성 확보 · C-TEC-025 부분 선행 검증

### 부정 / 리스크

- 기존 C1 중심 UX 메시지(`출근길 5분`·`나답게 하루를 시작`) 일부 약화
- 취준생 WAU 는 **취업 성공 후 이탈** 가능성 → 유지율 < 40% 리스크
- 14개 공식 채용 공고 실시간 수량에 종속 · 공고 공급 부족 시 사이트 체류 시간 저하

### 완화

- 구독 잡는 순간부터 **현직자용 가치 (에디터 Pick)** 지속 노출 → 취업 후에도 구독 유지 유도
- 공식 딥링크 외 워크넷/사람인 하이브리드 + 주간 승인 ≥15건 유지 (REQ-NF-107)

---

## References

- [ADR-008 Cargo-First Pivot](../references/ADR-008-pivot-to-cargo-first.md) — 본 ADR 의 상위 전제 (Cargo 축은 변함 없음)
- [SRS Rev 1.1 §1.1 Purpose](../srs/SRS-001-arum-cargo.md) — 타겟 재정렬 반영
- [PRD 00 §2 타겟 사용자](../prd/00-overview.md) — 페르소나 우선순위 표 재정렬
- [CLAUDE.md §1](../../CLAUDE.md) — 프로젝트 한 줄 요약 타겟 변경
- [DASHBOARD.md](../srs/tasks/DASHBOARD.md) — 현재 상태 반영
- 냉정 유용성 감사 — Claude (Requirements Engineer) 2026-04-19 세션 로그

---

## Changelog

- **2026-04-19**: 최초 작성. 냉정 유용성 감사 기반 타겟 재정렬 · Gemini Search/YouTube grounding 조기 도입 · 에디터 Pick 부담 경감 3가지 동시 결정.
