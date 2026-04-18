# ADR-003 — Auth 전략: MVP 무인증 + 이메일 토큰 기반 설정 관리

- **Status**: Accepted
- **Date**: 2026-04-11
- **Owner**: RAION Founder
- **Referenced by**: [prd/03-data-model.md §4.1](../prd/03-data-model.md), [prd/05-email-growth-loop.md §8](../prd/05-email-growth-loop.md)
- **Related**: [open-questions.md OQ-SOLVED-8](../open-questions.md)

---

## Context

MVP 사용자는 **비구독자(익명 방문자) + 구독자(이메일만)** 두 층으로 나뉜다. 핵심 질문: "구독자에게 별도 로그인 계정이 필요한가?"

- 비구독자는 뉴스·채용·운항을 **읽기만 함**. 로그인 필요 없음.
- 구독자는 (1) 인증된 이메일 소유 증명, (2) 관심사 태그 수정, (3) 수신거부 — 세 동작만 필요.
- 이 세 동작 모두 **이메일에 포함된 토큰 링크 클릭**으로 충분.

Auth 전면 도입 시 비용:
- Supabase Auth Magic Link: 구현 가능하지만 별도 세션 관리, RLS 정책 재설계, 로그인 페이지·로그아웃 UI 추가
- OAuth (Google/카카오): MVP 단계 과잉, 개인정보 처리 이슈 추가
- 사용자 증가 전 투자 대비 ROI 낮음

## Decision

**MVP에는 어떤 Auth도 도입하지 않는다.** 대신:

1. **비구독자**: 인증 없이 모든 공개 페이지 접근
2. **구독자**:
   - `subscribers.verification_token` (24h 만료): 더블 옵트인 인증용
   - `subscribers.settings_token` (무만료 랜덤 32바이트 hex): 설정·수신거부 URL에 포함
3. **관리자** (`/admin`): 환경변수 `ADMIN_SECRET` 헤더/쿼리 검증만 (본인 1명 전용)

Supabase Auth는 **Phase 2 이후** 재평가.

## Consequences

**긍정**
- 구현 복잡도 대폭 감소 (로그인 UI·세션 관리·RLS auth.uid() 정책 불필요)
- Supabase 무료 티어 사용자 쿼터 소진 없음 (Auth 사용자 50,000명/월 제한 영향 없음)
- RLS 정책이 단순 (`anon` + `service_role` 두 레벨)
- 사용자 진입 마찰 최소 — 이메일만 입력하면 구독 완료

**부정·리스크**
- `settings_token`이 URL에 노출되므로 **토큰 탈취 시 해당 구독자 설정 변경 가능** → MVP 위험 수용 (설정 변경은 "관심사 태그 수정"과 "수신거부"뿐, 금전적 피해 없음)
- 이메일 주소 변경 플로우가 번거로움 (새 주소로 재인증 필요) → MVP에서는 허용
- 여러 기기·브라우저 동기화 불가 (토큰 클릭 기반이라 기기 독립적) → 이미 원하는 동작
- Phase 2에서 진짜 Auth 필요 시 `subscribers` → `users` 이관 필요 → Phase 2 마이그레이션 ADR 예정

## Alternatives Considered

| 대안 | 이유 기각 |
|---|---|
| **Supabase Auth Magic Link** | 구현 가능하나 MVP 과잉, RLS 복잡화, ROI 낮음 |
| **OAuth (Google/Kakao)** | 과잉 + 개인정보 동의 플로우 추가 + MVP 사용자 니즈 부재 |
| **JWT 세션 + /login** | 자체 세션 관리 부담, 보안 취약점 리스크 |
| **Clerk / Auth0** | 유료(Clerk Free 5k MAU OK지만 외부 의존 추가), 오버엔지니어링 |

## Verification

- [ ] `settings_token`이 충분히 엔트로피 (32바이트 hex = 256bit)
- [ ] Rate limit: 동일 토큰 분당 10회 이상 호출 시 429
- [ ] 만료되지 않는 토큰 정책 명시 ([prd/03-data-model.md §4.1](../prd/03-data-model.md))
- [ ] 수신거부 후에도 `settings_token` 무효화하지 않음 (재구독 지원)
- [ ] `/admin` 은 `ADMIN_SECRET` 없이 404 응답

## Review Trigger

- 구독자 500명 돌파 + 사용자가 "내 계정 페이지" 요구
- 유료 구독/결제 기능 도입 (Phase 2)
- L-Side B2B 진입 (기업 계정 필요)
- `settings_token` 탈취 사고 발생
