# ADR-001 — 이메일 서비스: Loops.so over Resend (MVP)

- **Status**: Accepted
- **Date**: 2026-04-11
- **Owner**: RAION Founder
- **Referenced by**: [prd/05-email-growth-loop.md](../prd/05-email-growth-loop.md), [prd/04-api-integration.md §9](../prd/04-api-integration.md), [CLAUDE.md §4](../../CLAUDE.md)
- **Related**: [open-questions.md OQ-SOLVED-5](../open-questions.md), [references/99-advisor-notes.md 2026-04-11 Q1](../references/99-advisor-notes.md)

---

## Context

Phase 1 MVP에서 더블 옵트인 구독 + 일일 다이제스트를 발송해야 한다. 초기 가정은 Resend + React Email이었으나 다음 제약을 확인:

1. **Resend 기본 도메인(`onboarding@resend.dev`)은 계정 소유자 본인 수신만 허용**. 외부 구독자 발송 불가.
2. **커스텀 도메인 인증은 자체 도메인 소유 + SPF/DKIM TXT 레코드 편집 필요**. `*.vercel.app`은 Vercel 소유 공용 도메인이라 DNS 편집 권한 없음 → Vercel 도메인으로 Resend 인증 불가.
3. **사용자 질문 "동의만 받으면 풀리지 않나?"**: 정보통신망법 §50 옵트인 동의와 Resend 도메인 인증은 다른 레이어. 법적 동의로 기술 제약을 해결할 수 없음.
4. **도메인 구매 우회 대안**: Porkbun `.com` 연 $11, DNS 전파 24~72h. MVP 런칭 속도 저하 우려.

## Decision

**Loops.so 무료 티어 (2,000 contacts)** 를 MVP 이메일 엔진으로 채택한다.

- 커스텀 도메인 없이 즉시 발송 가능 (Loops 자체 인증된 도메인)
- Transactional API + Contacts API로 본 프로젝트의 구독·인증·다이제스트 플로우 커버
- 한국 §50 준수 필드(광고 라벨, 원클릭 수신거부, 발신자 정보) 지원 여부는 **OQ-M6에서 후속 검증**
- **폴백 계획**: OQ-M6 검증 실패 시 Phase 5 이후 Resend + 자체 도메인으로 전환 (ADR-001-rev로 supersede)

## Consequences

**긍정**
- MVP 런칭 블로커 제거 (도메인 구매·DNS 전파 대기 없음)
- 비용 $0/월 (2,000명까지)
- Loops 템플릿 분석 대시보드로 오픈률·CTR·수신거부 즉시 측정
- `LOOPS_API_KEY` 환경변수 1개로 모든 발송 처리

**부정·리스크**
- 한국 §50 준수 여부 미검증 → **OQ-M6 Phase 5 진입 전 필수 해결**. 실패 시 Resend 전환에 2주 추가 필요
- `loops.so` 발신 도메인이 주요 한국 포털(네이버·다음) 스팸 필터에 걸릴 수 있음 → Phase 5 초반 본인 주소로 사전 테스트
- 2,000 contacts 초과 시 유료 전환 ($50+/월) → 구독자 1,500명 도달 시 재평가 필요

## Alternatives Considered

| 대안 | 이유 기각 |
|---|---|
| **Resend + `onboarding@resend.dev`** | 본인 수신만 가능. 외부 구독자 발송 기술적 불가 |
| **Resend + Porkbun 구매 도메인** | DNS 전파 24~72h, 비용 $11/년, 사용자가 "우선 무료로"라고 결정 |
| **Supabase Edge Function + SMTP (Gmail/Naver)** | Gmail 일일 500건 제한, 스팸 점수 불리 |
| **Mailchimp Free** | 500 contacts/월 (Loops보다 작음), 한국어 템플릿 제한 |
| **Substack import** | 플랫폼 락인, 대시보드/DB 통합 불가 |

## Verification

- [ ] Loops 계정 가입 + API 키 발급 (Phase 2~4)
- [ ] 템플릿 3종(`tpl-verify`, `tpl-daily-digest`, `tpl-unsubscribe-confirmation`) 작성
- [ ] 본인 이메일로 end-to-end 발송 성공
- [ ] 주요 한국 포털(Naver / Daum / Gmail) 수신함 도달 확인
- [ ] **OQ-M6**: §50 필드 5개 전부 지원 확인 (광고 제목, 원클릭 수신거부, 발신자 정보, 동의 IP 기록, 야간 회피)

## Review Trigger

다음 조건 충족 시 이 ADR 재검토:
- 구독자 1,500명 도달
- OQ-M6 검증 실패
- Loops 장애 연속 2회 이상
- 한국 포털 수신함 도달률 < 70%
