# ADR-002 — 운항 데이터: KAC+IIAC 공공데이터포털 over AviationStack

- **Status**: Accepted
- **Date**: 2026-04-11
- **Owner**: RAION Founder
- **Referenced by**: [prd/02-i-side-information.md §5](../prd/02-i-side-information.md), [prd/04-api-integration.md §5·§6](../prd/04-api-integration.md), [references/09-news-sources.md §6](../references/09-news-sources.md)
- **Related**: [open-questions.md OQ-SOLVED-6](../open-questions.md)

---

## Context

초기 실행 플랜(`elegant-crafting-cocke.md`)에는 **AviationStack API**로 운항 데이터를 수집한다고 가정했다. 리서치 결과:

1. **AviationStack 무료**: 100 req/월. 하루 2회 수집 × 국내 8개 공항 = 월 480 req → **무료 티어 4배 초과**
2. **AviationStack 유료**: $49.99/월부터. MVP 예산 0원과 충돌
3. **커버리지**: 국내 공항(ICN 외)은 데이터 지연·편차 큼
4. **대체 옵션 발견**:
   - **한국공항공사(KAC) OpenAPI** — data.go.kr 등록. GMP·CJU·PUS·TAE·KWJ·CJJ·MWX 등 지방공항 전체. 무료, 상업 이용 OK, 10,000 req/일 운영키
   - **인천국제공항공사(IIAC) OpenAPI** — data.go.kr 별도 등록. ICN 전용. 동일 조건

## Decision

**공공데이터포털 KAC + IIAC API** 조합으로 한국 공항 운항 데이터를 100% 커버한다. AviationStack은 사용하지 않는다.

- KAC: 지방 7개 공항 (GMP, CJU, PUS, TAE, KWJ, CJJ, MWX)
- IIAC: 인천 (ICN) 전용
- 수집 빈도: 하루 2회 (KST 24:00, 12:00) × 8개 공항 × 2(출발/도착) = 일 32 req. 한도의 0.3%

**딥링크 전용 소스**:
- **UBIKAIS** (국토부): 공식 API 없음 → 편명 검색 딥링크만
- **FlightRadar24**: 스크래핑 ToS 금지, 유료 API $1000+/월 → 딥링크만
- **OpenSky Network**: 한국 ADS-B 커버리지 희박 → 사용 안 함

## Consequences

**긍정**
- 비용 $0/월, 법적 리스크 제로 (공공데이터포털 이용약관 상업 이용 허용)
- 한국 공항 100% 커버 (인천 + 지방 7개)
- 한도 대비 사용량 0.3% → 수집 빈도 확장 여지 충분
- GitHub Actions 2회/일 수집 + Supabase 스냅샷 + Next.js ISR 5분 → 사용자 체감 지연 < 5분

**부정·리스크**
- **API 신청 승인 2~3 영업일** → Phase 4 진입 전 미리 신청 필요 (OQ-B1)
- data.go.kr API는 공급자별 응답 스키마 편차 큼 → zod 검증 + `raw` jsonb 저장으로 방어
- KAC·IIAC 2개 키를 별도 관리 → 환경변수 2개 (`KAC_SERVICE_KEY`, `IIAC_SERVICE_KEY`)
- 실시간 스트리밍 불가 → D3 간단 테이블 스코프와 일치 (실시간 알림 P12는 Phase 5+)

## Alternatives Considered

| 대안 | 이유 기각 |
|---|---|
| **AviationStack 유료** | $49.99/월, MVP 예산 초과. 데이터 품질도 국내 한계 |
| **FlightRadar24 Business API** | 월 $1,000+, 과잉 |
| **FlightRadar24 스크래핑** | ToS 명시 금지, 법적 리스크 |
| **OpenSky Network** | 한국 ADS-B 커버리지 희박, 데이터 결손 |
| **항공사별 공식 웹사이트 크롤링** | 8개 사이트 × 다른 구조, 유지보수 부담, SSR/CSR 혼재 |

## Verification

- [ ] data.go.kr 회원가입 + 사업 목적 설정
- [ ] KAC API 활용신청 + 승인
- [ ] IIAC API 활용신청 + 승인
- [ ] 테스트 호출: 각 공항 `getPassengerDeparturesDeOdp` 1회 이상 200 OK
- [ ] zod 스키마 검증 실패율 < 5%
- [ ] `flights_snapshots` 테이블에 수집 결과 저장 확인

## Review Trigger

- 공공데이터포털 API 한도 초과 또는 정책 변경
- 실시간 운항 수요가 증명되어 실시간 푸시(P12) Phase 진입
- UBIKAIS 공식 API 출시 시 보조 소스 재평가
