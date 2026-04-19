# 📊 Arum Cargo — 실행 대시보드

> **목적**: "지금 어디까지 왔고 다음 무엇인가" 한 화면 요약. 주간 리뷰 때만 업데이트.
> **업데이트 주기**: 매주 금요일 또는 CP 완료 시
> **마지막 업데이트**: 2026-04-19

---

## 🎯 현재 위치

| 항목 | 값 |
|---|---|
| **현재 Phase** | Phase 1 완료 → **Phase 2 착수 대기** |
| **현재 CP** | CP-01 Project Foundation (0/13) 대기 |
| **SRS 버전** | **Rev 1.1** (ADR-009 타겟 재정렬 반영, 2026-04-19) |
| **Primary 타겟** | **A1 정하늘 (카고 취준생)** · Secondary: C1 이지훈 (2~5년차) |
| **MVP 예상 기간** | 10~12주 (CP-12 🏁 목표) |
| **월 운영비** | ₩0 (실 구축 전) / 예상 ₩0 (Phase 5 구동 후) |

---

## 📈 Checkpoint 진행도 (12/12)

| Phase | CP | 이름 | 진행 | 상태 |
|---|---|---|---|---|
| 2 | CP-01 | Project Foundation | `░░░░░░░░░░` 0/13 | 🔜 다음 |
| 2 | CP-02 | Data Model Baseline | `░░░░░░░░░░` 0/20 (DB-012 `review_one_liner` 컬럼 확장) | ⏳ 대기 |
| 2 | 🚪 CP-03 | Phase 2 Quality Gate | `░░░░░░░░░░` 0/6 | ⏳ 대기 |
| 3 | CP-04 | Mock UI 렌더 | `░░░░░░░░░░` 0/19 (Rev 1.1 −FR-027) | ⏳ 대기 |
| 3 | 🚪 CP-05 | Phase 3 Quality Gate | `░░░░░░░░░░` 0/4 | ⏳ 대기 |
| 4 | CP-06 | News Ingest Live | `░░░░░░░░░░` 0/10 (국내 RSS → Naver API primary) | ⏳ 대기 |
| 4 | CP-07 | Jobs Ingest Live | `░░░░░░░░░░` 0/10 | ⏳ 대기 |
| 4 | CP-08 | Admin Workflow | `░░░░░░░░░░` 0/9 (Rev 1.1 −FR-023·−FR-052) | ⏳ 대기 |
| 4 | 🚪 CP-09 | Phase 4 Quality Gate | `░░░░░░░░░░` 0/10 | ⏳ 대기 |
| 5 | CP-10 | Email Growth Loop Live | `░░░░░░░░░░` 0/12 (Rev 1.1 −FR-039) | ⏳ 대기 |
| 5 | CP-11 | Admin Dashboard Live | `░░░░░░░░░░` 0/10 (KPI 4종 축소) | ⏳ 대기 |
| 5 | 🏁 CP-12 | MVP 완성 (Phase 5 QG) | `░░░░░░░░░░` 0/14 | ⏳ 대기 |

전체 Task: **0 / 146 완료 (0%) — Rev 1.1 축소 · 원 150 − 4 제거 (FR-023/027/039/052)**

---

## 🚧 현재 블로커 (사용자 액션 필요)

Phase 2 착수 전 해결:

- [ ] **Supabase 계정 + 신규 프로젝트 `arumcargo-prod` 생성** (region Seoul) → T-INFRA-005 선결
- [ ] **Vercel 계정 + GitHub `raion-log/arum-cargo` 연결** → T-INFRA-008 선결
- [ ] **사업자등록증·주소·연락처 확보** → T-INFRA-013 Footer · `/privacy` 법정 페이지 데이터

Phase 3 착수 전 (여유):

- [ ] OQ-C1 About 페이지 초안 3개 중 1개 선택
- [ ] OQ-C2 에디터 Pick 샘플 5개 톤 검수

Phase 4 착수 전 (3~4주 여유):

- [ ] 네이버 개발자센터 앱 등록 + 키 발급
- [ ] 워크넷 API 키 발급 (2~3일 승인)
- [ ] 사람인 API 키 발급
- [ ] Google AI Studio Gemini API 키 발급 (무료)
- [ ] 해외 RSS 피드 URL 3종 확정 (Loadstar/ACN UK/FlightGlobal)

Phase 5 착수 전:

- [ ] Loops.so 계정 + API 키 + webhook secret
- [ ] Vercel API 토큰 (Analytics)

---

## ⏭️ 다음 3 액션 (권장)

1. **학습 H 7개 집중 (주말 6시간)** — pgTAP · plpgsql trigger · Supabase RLS · CLI · `server-only` · `@supabase/ssr` · EXPLAIN ANALYZE ([learning-keywords.md §8](./learning-keywords.md))
2. **Supabase 계정 + 프로젝트 생성** → T-INFRA-005 블로커 해제
3. **Phase 2 착수** — T-INFRA-001 (Next.js init) 부터 시작

---

## ⚠️ Known Issues (Rev 1.2 cleanup 예정)

| # | 항목 | 영향 | 해소 시점 |
|---|---|---|---|
| 1 | SRS 헤더 claim (69/67) vs 실측 (108/87) REQ 카운트 drift | 낮음 (기록만) | Rev 1.2 |
| 2 | Mermaid diagrams 일부 `OpenAI GPT-4o-mini` 라벨 잔존 | 낮음 (역사적 컨텍스트) | Phase 4 진입 시 |
| 3 | `ADR-007-translation-gpt-4o-mini.md` 파일명 | 낮음 | Phase 4 Amendment |
| 4 | 01-macro-inventory.md Step 기반 view · TASKS.md canonical 불일치 | 낮음 | TASKS.md 를 canonical 로 운영 |
| 5 | PRD 01/02/04/06 의 Rev 1.1 세부 변경 (공유 루프·2~5년차 하이라이트·일괄 승인·Bento Metric-Live·Pick 톤 규약) 아직 미sync | 중간 (Phase 3/4 진입 전 반영) | Rev 1.2 PRD sync |
| 6 | **국내 카고 RSS 실측 결과**: 카고프레스 RSS 미제공 (HTML only) · 카고뉴스 월간 · 포워더케이알 커뮤니티. Naver API primary 로 전환됨 | 낮음 (Rev 1.1 에 반영됨) | 해소 |

---

## 🔗 빠른 링크

### 상위 추적
- [CHECKPOINTS.md](./CHECKPOINTS.md) — 12 CP 상세
- [TASKS.md](./TASKS.md) — 150 Task canonical

### 방법론
- [00-overview.md](./00-overview.md) — Task 추출 방법론
- [learning-keywords.md](./learning-keywords.md) — 학습 리스트

### 상세 명세
- [phase-2-tasks.md](./phase-2-tasks.md) — Phase 2 38/38 ✅
- `phase-3-tasks.md` — 미작성
- `phase-4-tasks.md` — 미작성
- `phase-5-tasks.md` — 미작성

### 베이스라인
- [SRS-001 Rev 1.0](../SRS-001-arum-cargo.md) — 108 REQ-FUNC · 87 REQ-NF
- [MVP 검토 보고서](../reviews/MVP-개발목표-적절성-종합-검토-보고서.md)
- [v0.9.2 vs v1.0 diff](../reviews/v0.9.2-vs-v1.0-diff.md)
- [Phase 2 사후 검토](./reviews/phase-2-review.md)

### 프로젝트 규칙
- [CLAUDE.md](../../../CLAUDE.md) — 프로젝트 컨텍스트

---

## 📌 Amendment Trigger 감시 (Rev 1.1 → Rev 1.2)

- [x] ~~**타겟 재정렬**~~ — **ADR-009 로 Rev 1.1 반영 완료 (2026-04-19)**
- [ ] **OQ-M6** Loops §50 필드 주입 검증 (Phase 5 진입 직전) — 실패 시 Resend 전환
- [ ] **OQ-R17** 번역 Provider A/B 실측 (Phase 4) — Gemini 품질 수용 기준 미달 시 OpenAI/Anthropic 복원
- [ ] **Supabase 500MB** 근접 (Phase 5.5 대상 jsonb 4GB 리스크)
- [ ] **Loops 1,500 contacts** 도달 → Resend 전환 준비 착수

---

## Changelog (Dashboard 자체)

- 2026-04-19 v1.0 · 최초 작성. Phase 1 완료, Phase 2 착수 대기 상태 반영.

---

**End of Dashboard.**
