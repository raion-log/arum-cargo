# ADR-004 — 채용 큐레이션: 하이브리드 pending/approved

- **Status**: Accepted
- **Date**: 2026-04-11
- **Owner**: RAION Founder
- **Referenced by**: [prd/01-a-side-academy-career.md §6](../prd/01-a-side-academy-career.md), [prd/03-data-model.md §4.4](../prd/03-data-model.md)
- **Related**: [open-questions.md OQ-SOLVED-7](../open-questions.md), [references/15-aos-dos-opportunity.md](../references/15-aos-dos-opportunity.md) P02

---

## Context

**Pain P02 (공고 신뢰도 부재, AOS 2.4 / DOS 1.6)** — 사용자가 지상직·정비 공고를 볼 때 학원·대행·무관 광고가 20~30% 섞여 있어 판단 시간 낭비.

선택지:
- **A. 완전 자동**: 워크넷/사람인 API 결과를 그대로 노출. 속도는 빠르나 **P02 해결 실패**
- **B. 완전 수동**: 관리자가 매일 직접 공고 수집·편집. 품질은 좋으나 **P01(일정 분산) 해결 실패**
- **C. 하이브리드**: 자동 수집 → `pending` → 관리자 승인 → `approved`만 공개

## Decision

**하이브리드 (Option C)** 를 채택한다.

```
[워크넷/사람인 API]
    ↓ GitHub Actions (KST 24:00 cron)
[/api/cron/ingest-jobs]
    ↓ dedupe + source_trust_score 초기 점수
[job_posts INSERT status='pending']
    ↓
[/admin 관리자 큐]  ← 사용자 본인 일 10~30분
    ↓ status='approved' or 'rejected'
[공개 /jobs 노출은 approved만]
```

**핵심 요소**:
1. `job_posts.status` enum: `pending | approved | rejected | archived`
2. `source_trust_score` smallint (1~5): 초기 자동 점수 + 관리자 조정 가능
3. 공식 소스 (항공사·공공기관)는 **자동 5점 + 일괄 승인 단축키** 제공
4. 마감 7일 경과 시 cron이 자동 `archived` 전환

## Consequences

**긍정**
- P01(속도) + P02(품질) **동시 해결**
- 관리자 부담 10~30분/일 — 지속 가능
- `rejected` 사유 기록 → 향후 자동 보정 룰 학습 데이터
- `source_trust_score` 는 사용자 필터(기본값 3+)로 이중 보호
- 공개 쿼리가 `where status='approved'`만 조회 → RLS 단순

**부정·리스크**
- **관리자 부재 시 공개 지연** → Phase 5+ 구독자 증가 시 서브 관리자 도입 검토
- `pending` 누적 시 백로그 리스크 → 주간 리뷰에서 큐 길이 모니터링
- 승인 기준이 주관적 → 내부 승인 가이드라인 문서화 (Phase 4 전 `docs/ops/job-approval-guide.md` 작성)
- 자동 점수가 부정확하면 관리자 피로 → Phase 4 첫 200건 라벨링 후 점수 보정 룰 재조정

## Alternatives Considered

| 대안 | 이유 기각 |
|---|---|
| **A. 완전 자동** | P02 해결 실패, 광고 공고 혼입으로 신뢰도 파괴 |
| **B. 완전 수동** | P01 해결 실패, 사용자 업데이트 속도 느림, 확장 불가 |
| **ML 분류기 자동 필터링** | 데이터 양 부족(cold start), MVP 단계에서 ROI 낮음, Phase 2 이후 재검토 |
| **사용자 크라우드소싱 신고** | MVP 단계에서 사용자 풀 부족, 악용 리스크 |

## Verification

- [ ] `job_posts.status` enum 마이그레이션 적용
- [ ] `/admin/jobs` 승인 큐 UI 동작
- [ ] RLS: `anon`이 `status='approved'`만 SELECT 가능
- [ ] 자동 5점 공식 소스 일괄 승인 단축키 동작
- [ ] 자동 `archived` cron 동작
- [ ] Phase 4 첫 200건 라벨 일치율 ≥ 70%
- [ ] 수동 승인 평균 소요 시간 ≤ 15초/건

## Review Trigger

- 일일 pending 누적 > 50건 (관리자 부담 한계)
- 구독자 피드백에서 "여전히 광고 섞임" 3회 이상
- 서브 관리자 도입 시점
- Phase 2 ML 자동 분류기 검토 시점
