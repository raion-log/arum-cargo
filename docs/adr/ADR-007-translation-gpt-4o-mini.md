# ADR-007 — 번역 엔진: Provider-Agnostic 추상화 (MVP 기본 OpenAI GPT-4o-mini)

- **Status**: **Amended 2026-04-18** — 원 결정은 OpenAI GPT-4o-mini 단일 고정이었으며, SRS-001 Rev 0.9.1 C-TEC-015에 따라 **Provider-Agnostic 추상화(`TRANSLATION_PROVIDER` env: `openai | gemini | anthropic`)**로 변경. Phase 5 MVP 기본값은 `openai=gpt-4o-mini` 유지. Phase 4 OQ-R17 A/B 테스트 후 확정
- **Date**: 2026-04-11 (최초) · 2026-04-18 (Amended)
- **Owner**: Arum Cargo Founder
- **Referenced by**: [prd/02-i-side-information.md §4](../prd/02-i-side-information.md), [prd/04-api-integration.md §4](../prd/04-api-integration.md), [SRS C-TEC-015](../srs/SRS-001-arum-cargo.md)
- **Related**: [open-questions.md OQ-M1](../open-questions.md), [OQ-R17](../open-questions.md)

---

## Context

**Pain P06 (해외 뉴스 영문 장벽, AOS 3.2)** — Simple Flying·Aviation Week 등 해외 기사를 한국 사용자가 소화하지 못함.

번역 선택지:
- **OpenAI GPT-4o-mini**: LLM 기반. 항공 전문 용어 프롬프트 유연성. 종량제 $0.15/1M input, $0.60/1M output
- **DeepL API Free**: 월 500,000자 무료. 전문 용어 정확도 높음. 한국어 미지원 항목 있음
- **Google Translate API**: 월 500,000자 무료 → 유료 전환 자동. 안정적이지만 항공 맥락 번역 품질 편차
- **Papago (Naver)**: 월 10,000자 무료. 한국어 모국어 품질 최상, 전문 용어 약함
- **자체 모델**: 과잉 (cold start)

## Decision (Amended 2026-04-18)

**Phase 5 MVP 번역 엔진은 Provider-Agnostic 추상화 레이어로 구현**하고, **기본 Provider는 OpenAI GPT-4o-mini를 잠정 채택**한다. 이유:

1. **벤더 lock-in 회피**: `TRANSLATION_PROVIDER` env로 `openai | gemini | anthropic` 런타임 교체 가능. OQ-R17 A/B 결과에 따라 코드 수정 없이 env swap만으로 Provider 전환
2. **프롬프트 유연성** (공통): "항공 전문 용어는 영어 원문 괄호 병기" 같은 커스텀 룰을 시스템 프롬프트로 즉시 반영. 3개 Provider 모두 동일 prompt template 사용
3. **한글 3문장 요약 + 번역 동시 처리**: 순수 번역 API(DeepL/Google/Papago)는 "요약"이 안 됨. LLM 1회 호출로 해결 — 이 점에서 OpenAI·Gemini·Anthropic 모두 적합
4. **MVP 비용**: OpenAI GPT-4o-mini 기사당 ~$0.0004, 월 600건 기준 **$0.24/월** — 무시 가능. Gemini Flash Lite는 약간 더 저렴, Anthropic Haiku는 약간 더 비싸지만 모두 월 $5 cap 내
5. **품질 검증 실험**: Phase 4 초반 OQ-R17 A/B 테스트로 사용자 가치 실측 + 제공자 품질 비교

**추상화 구조** (SRS C-TEC-015 참조):
- `src/lib/api/translation/index.ts` — facade (`TRANSLATION_PROVIDER` 읽고 adapter 라우팅)
- `src/lib/api/translation/openai.ts` — `openai@4.x` adapter
- `src/lib/api/translation/gemini.ts` — `@google/generative-ai` adapter
- `src/lib/api/translation/anthropic.ts` — `@anthropic-ai/sdk` adapter
- 모든 adapter 공통 시그니처: `translate(title, body) → Promise<string>`, temperature=0.2, max_tokens=500
- 모든 adapter 공통 zod 출력 schema + 환각 탐지

**폴백 조건**:
- OQ-R17에서 CTR 개선이 < 10% 포인트 → 다른 Provider로 교체 후 재실험 (코드 변경 없음)
- 월 비용이 $5 초과 → Provider 교체 또는 배치 처리·캐싱 강화
- OpenAI 서비스 중단 → `TRANSLATION_PROVIDER=anthropic` 긴급 swap (Claude Haiku 4.5 동일 품질 대체)

## Consequences

**긍정**
- 1회 API 호출로 번역 + 요약 + 용어 처리 모두 처리
- 프롬프트 엔지니어링으로 항공 도메인 품질 개선 가능 (DeepL/Google은 블랙박스)
- 비용 예측 가능 (월 $1 이내)
- Phase 4 A/B 실험으로 실측 후 확정 → 의사결정 과학화

**부정·리스크**
- LLM 환각·오역 리스크 → 시스템 프롬프트에 "사실 왜곡 금지" 강조 + 출력 길이·형식 검증
- OpenAI 서비스 장애 의존 → 실패 시 `is_translated=false` 저장, 원문 링크만 노출 (grace degradation)
- 비용이 예측 불가능하게 증가 가능 → `monthly_budget_cap` 환경변수 + 초과 시 skip
- OQ-R17 결과가 나쁘면 엔진 재교체 비용 발생

## Alternatives Considered

| 대안 | 이유 기각 (현재) |
|---|---|
| **DeepL API Free** | 요약 기능 없음 → 2단계 파이프라인 필요, 복잡도 증가. Phase 4 A/B 결과에 따라 재평가 |
| **Google Translate** | 전문 용어 품질 편차, 프롬프트 엔지니어링 불가 |
| **Papago** | 무료 한도 10,000자/월 → 월 ~10건만 가능, MVP 부족 |
| **자체 LLM (Llama3 등) 호스팅** | 운영 비용·학습곡선 과잉 |
| **번역 안 하고 영문 제목만 노출** | P06 해결 실패. OQ-R17 B그룹으로 실험만 함 |

## Verification

- [ ] `src/lib/api/translation/` facade + adapters 구현 (openai 필수, gemini/anthropic 구조만 준비)
- [ ] 공통 zod 출력 검증 (길이 50~500자, 한국어 비율 ≥ 50%)
- [ ] `OPENAI_MONTHLY_BUDGET_CAP_USD` 환경변수 (기본 $5) + 초과 시 skip
- [ ] `TRANSLATION_PROVIDER` env swap 테스트 — 동일 기사 2종을 각 provider로 호출 후 출력 schema 동일 확인
- [ ] Phase 4 해외 기사 10건 번역 품질 수동 검수 (오역 / 과장 / 용어 정확도)
- [ ] OQ-R17 A/B 분기 구현 (구독자 50/50 split, feature flag)
- [ ] 4주 A/B 후 CTR 비교 → 승자 Provider로 env 전환

## Review Trigger

- OQ-R17 결과: 한글 요약 그룹 CTR이 영문 제목 그룹 대비 **+10% 포인트 미만**
- 월 비용 $5 초과
- 오역 사건 3회 이상 (사용자 피드백)
- 현 Provider(OpenAI) 정책·가격 변경 → Gemini/Anthropic swap 재평가
- 새로운 LLM provider 등장 시 adapter 추가 검토

## Changelog

- **2026-04-18 Amendment (SRS-001 Rev 0.9.1 C-TEC-015 반영)**: OpenAI GPT-4o-mini 단일 고정 → Provider-Agnostic 추상화. `TRANSLATION_PROVIDER` env로 `openai | gemini | anthropic` 런타임 교체. MVP 기본값 `openai=gpt-4o-mini` 유지. 추상화 근거: 벤더 lock-in 회피, OQ-R17 A/B 실측 후 코드 변경 없이 Provider 교체, 단일 모델 퇴출 리스크 격리.
- **2026-04-11**: 최초 작성 (GPT-4o-mini 단일 잠정 채택).
