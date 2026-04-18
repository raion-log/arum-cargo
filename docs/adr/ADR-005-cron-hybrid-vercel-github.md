# ADR-005 — Cron: Vercel Cron + GitHub Actions 하이브리드

- **Status**: Accepted
- **Date**: 2026-04-11
- **Owner**: RAION Founder
- **Referenced by**: [prd/04-api-integration.md §10](../prd/04-api-integration.md), [prd/05-email-growth-loop.md §5](../prd/05-email-growth-loop.md)
- **Related**: [open-questions.md OQ-M3(해결)](../open-questions.md)

---

## Context

MVP는 4개의 주기성 작업이 필요하다:
1. **뉴스 수집** — 2회/일 (KST 23:00, 13:00)
2. **운항 수집** — 2회/일 (KST 24:00, 12:00)
3. **채용 수집** — 1회/일 (KST 24:00)
4. **일일 다이제스트 발송** — 1회/일 (KST 07:00)

총 **6회/일 cron 실행**.

선택지:
- **A. Vercel Cron 단독**: Hobby 플랜 제한 **2회/일**. 6회 수용 불가 → Pro 업그레이드 ($20/월)
- **B. GitHub Actions 단독**: 무료 월 2,000분, 스케줄러 제약 없음. 다만 Vercel 서버리스 함수 호출보다 설정 부담 있음
- **C. Supabase Edge Functions + pg_cron**: 가능하지만 학습곡선, Next.js API Route와 분리됨
- **D. 하이브리드**: Vercel Cron (다이제스트 1회) + GitHub Actions (수집 5회)

## Decision

**Option D 하이브리드** 를 채택한다.

| 작업 | 호스팅 | 경로 | 스케줄 (UTC) |
|---|---|---|---|
| 다이제스트 발송 | Vercel Cron | `/api/cron/daily-digest` | `0 22 * * *` (= KST 07:00) |
| 뉴스 수집 | GitHub Actions | `/api/cron/ingest-news` | `0 14,4 * * *` (= KST 23:00, 13:00) |
| 운항 수집 | GitHub Actions | `/api/cron/ingest-flights` | `0 15,3 * * *` (= KST 24:00, 12:00) |
| 채용 수집 | GitHub Actions | `/api/cron/ingest-jobs` | `0 15 * * *` (= KST 24:00) |

- GitHub Actions 워크플로우는 단순 HTTP POST 호출 (`curl`) + `CRON_SECRET` Bearer 헤더
- 모든 cron endpoint는 `Authorization: Bearer {CRON_SECRET}` 검증
- 수집 endpoint는 Next.js API Route에 구현 → 로컬에서 `workflow_dispatch`로 수동 트리거 가능

## Consequences

**긍정**
- Vercel Hobby 2회/일 제약 준수 (1회만 사용)
- 비용 $0/월 (Vercel Hobby + GitHub Actions 무료 티어)
- GitHub Actions는 실패 시 상세 로그·재시도 UI 기본 제공
- 모든 로직이 Next.js API Route에 존재 → 로컬 개발·테스트 일관됨
- `workflow_dispatch` 수동 트리거로 디버깅 용이

**부정·리스크**
- 인프라 2개 소스 관리 (Vercel + GitHub Actions 두 곳에 스케줄 분산)
- `CRON_SECRET`을 두 곳(Vercel 환경변수 + GitHub Secrets)에 동기화 필요
- GitHub Actions 무료 월 2,000분 제약 — 수집 6회/일 × 1분 = 월 ~180분, 여유 10배
- GitHub Actions 러너 풀 장애 시 수집 지연 → `ingest_logs` 모니터링 + Phase 2 Slack 알림
- 구독자 1,000명+ 다이제스트가 Vercel Function 60s 타임아웃 초과 가능 → 배치 분할 로직 준비

## Alternatives Considered

| 대안 | 이유 기각 |
|---|---|
| **Vercel Cron 단독 (Pro $20/월)** | MVP 예산 초과. 6회/일을 $0에 할 수 있는데 $20은 과잉 |
| **GitHub Actions 단독** | 가능하지만 다이제스트는 Vercel Function을 직접 호출하는 게 낫고, Vercel의 공식 Cron UI가 모니터링에 유리 |
| **Supabase pg_cron + Edge Functions** | Next.js API Route와 분리, 학습곡선, 로컬 디버깅 어려움 |
| **외부 cron 서비스 (cron-job.org)** | 무료이지만 외부 의존 추가, 인증 관리 부담 |

## Verification

- [ ] `vercel.json` `crons` 배열에 `/api/cron/daily-digest` 등록
- [ ] `.github/workflows/ingest-news.yml`, `ingest-flights.yml`, `ingest-jobs.yml` 3개 파일 존재
- [ ] 각 워크플로우 `workflow_dispatch` 수동 트리거로 200 OK 응답
- [ ] `ingest_logs` 테이블에 실행 기록 저장 확인
- [ ] `CRON_SECRET` 없는 요청은 401 거절
- [ ] Vercel Function 실행 시간 각 endpoint p95 ≤ 30s

## Review Trigger

- 구독자 1,000명 도달 (다이제스트 60s 타임아웃 리스크)
- GitHub Actions 월 사용량 1,500분 초과
- Vercel Hobby → Pro 업그레이드 필요성 발생
- 새로운 수집 job 3개 이상 추가 (총 9회/일 초과 시 아키텍처 재평가)
