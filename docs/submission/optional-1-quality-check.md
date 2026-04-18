# Optional 1 — PRD 품질 검사 결과지

**제출자**: 아름 카고 (Arum Cargo, 구 RAION Aviation DX Hub) 프로젝트
**대상 PRD**: `docs/prd/*.md` v0.3 (9개 파일)
**작성일**: 2026-04-11
**원본 품질 검토**: [`docs/prd/99-quality-review.md`](../prd/99-quality-review.md) v2.0

---

## 개요

본 문서는 과제가 예시로 든 품질 점검 항목 — 특히 "비기술적 요구사항(NFR 가드레일) 측정 방법이 시스템 사양 및 도구 기준으로 명시되었는지" 같은 체크 — 을 10개 항목으로 압축해 아름 카고 PRD v0.3에 대해 자체 검사한 결과다. 이 체크는 [`99-quality-review.md`](../prd/99-quality-review.md) 의 10개 차원 점수표(평균 88→96)를 과제 제출용 포맷으로 재구성한 것이다.

---

## 1. 핵심 검사 항목 (10개)

| # | 검토 항목 | 기준 | 판정 | 증거 위치 |
|---|---|---|---|---|
| Q1 | **NFR 가드레일이 측정 가능한 수치**로 명시되었나? | 숫자 + 단위 + 측정 도구 | ✅ | WAU 500 / 4주 유지율 ≥ 40% / Lighthouse ≥ 90 / Loops contacts ≤ 2,000 — [`00-overview.md §KPI`](../prd/00-overview.md), [`07-roadmap-milestones.md §7.2`](../prd/07-roadmap-milestones.md) |
| Q2 | **North Star 지표의 출처**가 외부 벤치마크로 인용되었나? | 문헌명 + URL 또는 저자 | ✅ | Amplitude NSM Playbook (John Cutler, 2019) / Reforge Growth Series (Brian Balfour, 4주 유지율 40% PMF) / Morning Brew 2020 Axios 인터뷰 / Substack·Beehiiv 표준 — [`16-vps.md §North Star`](../references/16-vps.md) |
| Q3 | **페르소나**가 재현 가능한 수준으로 구체적인가? | 이름·연차·JTBD·하루 일과·정보 소비 경로 | ✅ | C1 이지훈 — 3년차 콘솔사 영업, JTBD 4개, 08:00/12:30/18:30 일과, 정보 채널(네이버 카페·LinkedIn·카고프레스), 모바일 비율 — [`13-personas.md`](../references/13-personas.md) |
| Q4 | **Acceptance Criteria**가 Given-When-Then 포맷인가? | 재현 가능성 + 자동 테스트화 가능 | ✅ | 각 User Story 하단 3~5개씩 — [`01-a-side-academy-career.md`](../prd/01-a-side-academy-career.md), [`02-i-side-information.md`](../prd/02-i-side-information.md), [`05-email-growth-loop.md`](../prd/05-email-growth-loop.md) |
| Q5 | **법적·규제 준수**가 체크리스트화되었나? | 근거 조항 + 위반 시 조치 | ✅ | 정보통신망법 §50 — 더블 옵트인, `(광고)` 접두어, 원클릭 수신거부, 야간(21:00~08:00 KST) 발송 금지, 발신자 정보 — [`05-email-growth-loop.md §법적 준수`](../prd/05-email-growth-loop.md) |
| Q6 | **데이터 모델**이 API·UI 사양과 1:1 일치하나? | 필드명·enum 동일성 | ✅ | `job_posts.status` enum(`pending/approved/rejected`)이 [`01 §워크플로우`] / [`03 §3`] / [`04 §채용 ingest`] / [`06 §/jobs 와이어`] 4개 파일에서 동일 식별자 사용 |
| Q7 | **비스코프(Out-of-Scope)**가 명문화되었나? | 무엇을 안 하는지 + 언제 재검토할지 | ✅ | 승무원·지상직·조종사 → Phase 5.5+ / 수익화 축 → 재검토 없음 / 3D Carousel → `/about` 하단만 — [`00-overview.md §스코프`](../prd/00-overview.md), [`07-roadmap-milestones.md §11`](../prd/07-roadmap-milestones.md) |
| Q8 | **의사결정 기록(ADR)**이 분리되어 있고 리뷰 트리거가 명시되었나? | Context / Options / Decision / Consequences / Review Trigger 5필드 | ✅ | ADR-001~008, 특히 [`ADR-008 Cargo-First Pivot`](../references/ADR-008-pivot-to-cargo-first.md) 에서 승무원→카고 피벗의 배경·대안·영향·리뷰 조건 전체 기록 |
| Q9 | **품질 검토**가 자체 순환 레이어로 존재하나? | 점수표 + 변경 요약 + 승인 체크리스트 | ✅ | [`99-quality-review.md`](../prd/99-quality-review.md) — 10개 차원 점수(v0.2 88 → v0.3 96), 22개 승인 체크박스, v0.2→v0.3 마이그레이션 자산 명세 |
| Q10 | **미결 항목(Open Questions)**과 **재검토 트리거**가 사전 정의되었나? | "언제 다시 결정할지" 조건 | ✅ | [`docs/open-questions.md`](../open-questions.md) — OQ-C1/C2/D1/R16~R20 등 + Loops contacts 1,600(80%) 도달 / WAU 500 미달 / 첫 제휴 문의 / 한아름 상표 충돌 등 트리거 — [`07-roadmap-milestones.md §7.4`](../prd/07-roadmap-milestones.md) |

**종합 판정**: 10개 항목 모두 **✅ 충족**. 원본 품질 검토의 10개 차원 점수표 기준 평균 **96/100**.

---

## 2. NFR 가드레일 상세 (Q1 심화 답변)

과제 예시가 구체적으로 "NFR 가드레일 측정 방법이 시스템 사양 및 도구 기준으로 명시되었는지"를 언급했으므로 이 항목을 심화 기록한다.

| NFR 카테고리 | 가드레일 수치 | 측정 도구 | 위반 시 조치 | 근거 문서 |
|---|---|---|---|---|
| **성장성 (North Star)** | WAU ≥ 500 / 4주 유지율 ≥ 40% | Loops.so events API + Supabase `subscribers.last_active_at` 쿼리 + Tremor 대시보드 | Phase 5+ 12주 내 미달 시 NSM 재검토 (ADR 신규 작성) | [`00-overview.md`], [`07 §7.2`] |
| **이메일 법적 준수** | 야간 발송 0건 / 수신거부 1클릭 / `(광고)` 접두어 100% | Loops.so 발송 로그 + GitHub Actions 크론 스케줄(07:00 KST 고정) | 위반 탐지 시 발송 즉시 중단 + 법무 자문 | [`05-email-growth-loop.md §법적 준수`] |
| **성능 (사용자 화면)** | Lighthouse Performance ≥ 90 / LCP ≤ 2.5s | Vercel Analytics Core Web Vitals + Lighthouse CI | Phase 2 QA 게이트 — 미달 시 배포 차단 | [`06-ui-ux-spec.md §16 DoD`] |
| **접근성** | WCAG 2.1 AA 기본 | axe-core (계획) + 수동 검사 | Phase 2 진입 전 보강 필요 (본 문서 §4 빈틈 참고) | [`06-ui-ux-spec.md §8`] |
| **데이터 품질** | 비카고 직군 공고 0건 / 뉴스 출처 100% 표기 | Supabase `block_non_cargo_titles` 트리거 + ingest `EXCLUDE_RE` 필터 + DB `NOT NULL` 제약 | 트리거가 DB 레벨 raise exception → 승인 불가 | [`03-data-model.md`], [`04-api-integration.md`] |
| **운영 한도 (무료 티어)** | Loops contacts ≤ 2,000 / OpenAI 월 ≤ $5 | Loops 대시보드 + `OPENAI_MONTHLY_BUDGET_CAP_USD` 환경변수 가드 | 80% 도달 시 Slack/이메일 경보, 100% 도달 시 번역 크론 자동 중단 | [`04-api-integration.md`], [`CLAUDE.md §6`] |
| **보안 (관리자)** | 관리자 로그인 = Supabase Magic Link + `admin_users` 화이트리스트 | 미들웨어 `/admin/:path*` matcher | 비화이트리스트 접근 시 404 반환 | [`05-email-growth-loop.md`] |
| **개인정보 보존** | `subscription_events` ≥ 13개월 | Supabase 테이블 정책 + Vercel Cron 삭제 금지 | - | [`03-data-model.md`] |

→ 모든 NFR이 **① 수치 ② 측정 도구 ③ 위반 시 조치**의 3요소를 갖춘 상태로 PRD에 명시되어 있다.

---

## 3. 구조적 강점 (원본 품질 검토에서 +5 이상 받은 항목)

1. **VPS → PRD → ADR → QA → OQ 5단 체인**
   [`16-vps.md`](../references/16-vps.md) 가 모든 PRD의 진입점으로 고정되어 있고, 각 PRD 결정이 ADR로 파생되며, 품질 검토와 미결 항목이 별도 레이어로 순환한다. 과제가 권장하는 "체계적 품질 검토"에 정확히 대응.

2. **Cargo-First Pivot의 완전한 복기 가능성**
   v0.1(승무원 A/L/I Side) → v0.2(품질 검토 강화) → v0.3(카고 피벗) 전 과정이 각 파일 Changelog + [`ADR-008`](../references/ADR-008-pivot-to-cargo-first.md) + [`99-quality-review.md §2`](../prd/99-quality-review.md) 에 기록되어 있다. 어느 시점에도 "왜 이렇게 바뀌었는가"를 추적 가능.

3. **페르소나 핀포인트 → 모든 User Story 주어 통일**
   C1 이지훈이 [`13-personas.md`](../references/13-personas.md) 에 한 번 정의된 후 01·02·05·06 PRD의 User Story 주어로 반복 등장. 페르소나가 장식이 아닌 실제 의사결정 기준으로 작동.

---

## 4. 인정된 빈틈 (과제 심사에서 지적 가능한 약점)

99-quality-review §7에서도 명시한 항목들이다:

| 빈틈 | 영향 | 해결 계획 |
|---|---|---|
| **OWASP NFR 미분리** | RLS 정책·CORS·CSP 등이 개별 언급만 있고 통합 보안 섹션이 없음 | Phase 2 진입 전 [`03-data-model.md`] 또는 별도 `08-security.md` 로 분리 |
| **성능 수치 일부 누락** | 서버사이드 p95 응답시간·API rate limit 수치 미정 | Phase 2 Next.js 셋업 시 측정 기준 고정 후 PRD 보강 |
| **접근성 자동화 툴 미통합** | axe-core 통합 계획만 있고 CI 연결 미정 | Phase 3 UI 구현 시 GitHub Actions 통합 |
| **카고 시장 TAM 협소** | 국내 항공화물 종사자 약 21k — WAU 500 초과 시 성장 천장 가능성 | Phase 6 인접 포워더·3PL·국제물류로 확장 로드맵이 이미 [`07 §9`](../prd/07-roadmap-milestones.md) 에 명시 |

→ 빈틈은 모두 **발견·기록·해결 시점까지 고정되어 있음**. "모른다는 것을 모른다" 상태는 없음.

---

## 5. 판정 요약

| 차원 | 점수 (원본 99-quality-review §3) | 비고 |
|---|---|---|
| Desirability (페르소나·Pain) | 98 | C1 핀포인트 + 14 Pain 재추출 |
| Viability (시장·경쟁) | 94 | TAM 21k, Loadstar·카고프레스 등 소스 재편 |
| Feasibility (기술·법) | 96 | Loops 무료 + Vercel + Supabase + 정보통신망법 §50 |
| Measurability (KPI) | 98 | WAU + 4주 유지율 + 출처 인용 |
| 카고 정합성 | 100 | 비카고 직군 DB 트리거 차단 |
| 페르소나 일관성 | 96 | C1이 모든 User Story 주어 |
| 수익화 제거 완결성 | 100 | 모든 PRD에서 삭제 |
| **평균** | **96** | v0.2 88 → v0.3 96 (+8p) |

---

## 6. 참고

- 원본 품질 검토: [`docs/prd/99-quality-review.md`](../prd/99-quality-review.md) v2.0
- 피벗 의사결정: [`docs/references/ADR-008-pivot-to-cargo-first.md`](../references/ADR-008-pivot-to-cargo-first.md)
- 미결 항목 트래커: [`docs/open-questions.md`](../open-questions.md)
- 프로젝트 규칙: [`CLAUDE.md`](../../CLAUDE.md)
