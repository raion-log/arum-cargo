# PRD 01 — A-Side (카고 채용·커리어)

> 아름 카고 (Arum Cargo) — 항공 화물 업계 현직자와 HR 담당자가 "매일 여는 채용·커리어 허브"가 되기 위한 기능 명세.
> 앵커: [00-overview.md](./00-overview.md) · 데이터 모델: [03-data-model.md](./03-data-model.md) · API: [04-api-integration.md](./04-api-integration.md) · 원천: [16-vps.md v0.3](../references/16-vps.md)

**버전**: v0.3 (Cargo-First Pivot) · **관련 ADR**: [ADR-008 Cargo-First](../adr/ADR-008-pivot-to-cargo-first.md), [ADR-004 하이브리드 큐레이션](../adr/ADR-004-hybrid-job-curation.md), [ADR-003 Auth 무인증](../adr/ADR-003-no-auth-mvp-email-token-only.md), [ADR-005 Cron 하이브리드](../adr/ADR-005-cron-hybrid-vercel-github.md)

> **v0.3 파일명 의미 재정의**: `a-side-academy-career`의 "Academy"는 v0.3에서 **Cargo Career**로 재해석. 파일명은 히스토리 보존을 위해 유지하되, 내용은 화물 채용 중심으로 전면 재작성.

---

## 1. 담당 Pain & 개선 목표 (AOS/DOS Top 5 중 P04·P03)

[VPS §1](../references/16-vps.md) v0.3 원천. Phase 5 실측으로 재산정.

| Pain | 설명 | AOS/DOS | 실패 KPI (현행) | **개선 목표** | 담당 기능 |
|---|---|---|---|---|---|
| **P04** 🥇 | 지인 추천 의존 이직 경로 (C1·C3 + B1 양면 고통) | **4.0 / 3.2** | C1 70%+ 지인 통로, 탐색 시간 20분+/회 | 구독자 25%+가 "이직 경로로 유용함" NPS ≥50 | §3 통합 카고 채용 피드, §6 하이브리드 큐레이션, Phase 5.5 §8 `/employers` |
| **P03** | 채용 파편·신뢰도 부재 | **3.0 / 2.4** | 파편화된 키워드 + 학원·광고 혼입률 20~30% | 혼입률 ≤5%, 탐색 시간 <5분 | §5 `source_trust_score`, §4 카고 특화 필터 |

이 개선 목표는 §2 User Story G/W/T AC와 §13 Proof 실험의 성공 조건으로 직접 사용된다.

근거: [15-aos-dos-opportunity.md v0.3 §5](../references/15-aos-dos-opportunity.md), [16-vps.md v0.3 §1](../references/16-vps.md).

---

## 2. User Stories + Given-When-Then AC

JTBD 원천: [VPS v0.3 §2](../references/16-vps.md) J-02, J-06. 각 스토리는 **성공 3건 + 실패 3건** AC.

### US-A1 (C1 이지훈 — 3년차 콘솔사 영업·오퍼, 이직 고려 · J-02)

> **"요즘 팀장과 불편해져서 이직을 생각 중이다. 지인 추천으로 물어볼 곳은 3곳쯤이고, 사람인에서 '항공화물'로 검색해도 물류 일반 공고가 섞여 뭘 믿어야 할지 모르겠다. 검증된 콘솔사·포워더 공고만 신뢰도 순으로 모여 있으면 좋겠다."**

**기대 동선**: `/jobs` 진입 → 직군 `항공화물 영업·오퍼` 필터 → 정렬 `신뢰도순` → 3장 이상 카드 → 최소 1개 클릭 → 원본 이동.

| # | 상태 | Given | When | Then |
|---|---|---|---|---|
| A1-1 | ✅ | 승인된 `cargo_sales` 공고 10건 이상 | 사용자 `/jobs?category=cargo_sales&sort=trust_desc` 진입 | 신뢰도 DESC 카드 10건 이상 1초 이내(LCP) 렌더 |
| A1-2 | ✅ | 신뢰도 ≥4 공고 | 카드 호버 | 툴팁 "공식 콘솔사/포워더 공고 · 자동 X점 + 관리자 확인" |
| A1-3 | ✅ | 카드 클릭 이벤트 | 사용자가 `원문 페이지에서 지원하기` CTA 클릭 | `/api/jobs/click/[id]` beacon 호출 + `_blank` `source_url` 이동 |
| A1-F1 | ❌ | 수집은 했으나 모두 `pending` | 사용자 `/jobs` 진입 | **빈 상태** + "관리자 검수 중입니다 · 곧 새 공고가 올라옵니다" + 구독 CTA |
| A1-F2 | ❌ | 워크넷 API 5xx (`ingest_logs.status='failed'`) | 사용자 `/jobs` 진입 | **직전 성공 수집분** 표시 + "업데이트 지연: 마지막 수집 HH:MM KST" 배너 |
| A1-F3 | ❌ | 사용자가 `trust_min=1`로 완화 | 필터 변경 | 경고 배너 "신뢰도 낮은 공고 포함" |

### US-A2 (C3 김태영 — 8년차 포워더 팀장, 업계 흐름 모니터링 · J-02)

> **"팀장으로서 업계 이직 동향을 분기별로 체크한다. 내가 아는 사람이 아닌 '외부에서 뭐가 돌고 있나'를 객관적으로 보고 싶다. 내가 아는 회사면 로고만 보여도 바로 인지된다."**

| # | 상태 | Given | When | Then |
|---|---|---|---|---|
| A2-1 | ✅ | 공식 콘솔사·포워더 공고 5건 + 학원 광고 5건 수집 후 승인 큐 통과 | `/jobs?trust_min=4` | 신뢰도 ≥4만 노출, 혼입률 ≤5% |
| A2-2 | ✅ | `job_posts.company_name` 이 `airline_cargo_career_links` 매핑 존재 | 카드 렌더 | 로컬 SVG 로고 표시 (대한항공카고·판토스·CJ대한통운 등) |
| A2-3 | ✅ | `source_trust_score` 기본 최소값 `3+` | 필터 초기 진입 | 신뢰도 3+ 기본 적용, URL 반영 공유 가능 |
| A2-F1 | ❌ | 자동 점수가 광고 공고를 4점 부여 | 관리자 `/admin/jobs`에서 `rejected` | 해당 공고 즉시 `/jobs` 에서 사라짐 + 감사로그 (`admin_actions`) |
| A2-F2 | ❌ | 사람인 dedupe 누락으로 같은 공고 2건 | 목록 렌더 | `(company + normalized_title)` 해시로 런타임 `DISTINCT ON` |
| A2-F3 | ❌ | `prefers-reduced-motion: reduce` | 사용자 접속 | 카드 fade-in 비활성, 정적 렌더 (ADR-006) |

### US-A3 (B1 최혜진 — 포워더 HR 6년차 · J-06, **Phase 5.5**)

> **"우리 회사에 사람이 너무 안 들어온다. 사람인·지인 추천 외의 채널이 필요하다. 아름 카고에 우리 공고를 올리거나 인재풀에 접근할 수 있다면 문의해보고 싶다."**

> **비고**: Phase 5 MVP에서는 `/employers` 페이지 없음. Phase 5.5 진입 시 활성화.

| # | 상태 | Given | When | Then |
|---|---|---|---|---|
| A3-1 | ✅ (Phase 5.5) | `/employers` 페이지 존재 | B1이 접근 | "인재풀 현황 요약 (구독자 수·직군 분포) + 채용 공고 등록 문의하기" 폼 렌더 |
| A3-2 | ✅ (Phase 5.5) | B1이 회사명·연락처·요구사항 입력 후 제출 | 제출 이벤트 | `employer_inquiries` 테이블 INSERT + Loops.so 트랜잭셔널 메일로 관리자 알림 |
| A3-3 | ✅ (Phase 5.5) | 관리자가 48h 이내 응답 | 사용자 메일 수신 | 수동 응대, Phase 5.5 내 자동화 없음 |
| A3-F1 | ❌ (Phase 5.5) | 허니팟 필드에 값 | 봇 제출 | 400 + 저장 안 함 |
| A3-F2 | ❌ (Phase 5.5) | 같은 IP 1시간 내 3회 초과 제출 | 4번째 시도 | 429 + "잠시 후 다시 시도" |
| A3-F3 | ❌ (Phase 5.5) | 필수 필드 누락 | 클라이언트 validation 통과 시도 | 서버 zod 검증 + 구체 에러 메시지 |

---

## 3. 통합 카고 채용 카드 피드 (`/jobs`)

### 3.1 데이터 소스 (ADR-004 하이브리드 + [09-news-sources.md v0.3 §7](../references/09-news-sources.md))

| 소스 | 역할 | 호출 빈도 | 비고 |
|---|---|---|---|
| 워크넷 OpenAPI | Primary | 1회/일 (KST 24:00, GitHub Actions) | 키워드 `항공화물`·`항공운송`·`국제물류`·`포워딩`·`콘솔`·`항공수출입`·`통관`·`AWB` |
| 사람인 OpenAPI | Secondary (dedupe) | 1회/일 (같은 워크플로우 내) | dedupe: `sha256(company + normalized_title)` |
| 항공 화물 기업 공식 페이지 | 크롤링 없음 — **딥링크 카드** | 정적 리스트 (`airline_cargo_career_links` 테이블) | 대한항공카고·아시아나카고·판토스·CJ대한통운·한진·세방·동방·코스모항운·우정항공·트리플크라운·서울항공·에어인천 |

**제외 키워드 필터** (자동):
`승무원` · `객실` · `지상직` · `조종사` · `부기장` · `항공정비` (v0.3 비스코프)

### 3.2 카드 필드

```
┌──────────────────────────────────────────┐
│ [회사 로고] [회사명]        [신뢰도 ★★★★☆]│
│                                          │
│ 국제물류 항공수출입 오퍼 경력 2~5년      │
│ 직군: 영업·오퍼 · 근무지: 서울/인천      │
│                                          │
│ 📅 마감 D-7  🔖 공식  📍 정규직           │
│                                          │
│ [상세보기 →] [원문 페이지 ↗]             │
└──────────────────────────────────────────┘
```

- `company_name`
- `company_logo` (airline_cargo_career_links 매칭 시 로컬 SVG)
- `title`
- `cargo_job_category`: `sales` (영업) / `ops` (오퍼) / `customs` (통관) / `imex` (수출입) / `intl_logistics` (국제물류) / `airport_ground` (공항상주) / `other_cargo`
- `location`
- `employment_type`
- `deadline` (D-N, D-3 이하 `arum.urgent` 배지)
- `source_trust_score` (1~5 별)
- `source_type` (공식 / 워크넷 / 사람인 / 학원 / 기타)
- `source_url`
- `detail_url` (`/jobs/[slug]`)
- `years_experience` (신입 / 1~3 / 2~5 / 5~10 / 10+) — C1 핀포인트(2~5년)에 기본 하이라이트

### 3.3 화물 기업 공식 딥링크 카드 섹션

`/jobs` 페이지 상단 또는 사이드바에 **"공식 채용 페이지 바로가기"** 카드 그리드. [09-news-sources.md v0.3 §7.3](../references/09-news-sources.md) 리스트를 `airline_cargo_career_links` 에서 조회.

```
┌───────────────┬───────────────┬───────────────┐
│ 대한항공카고  │ 아시아나카고  │ 판토스         │
│ [↗ 이동]      │ [↗ 이동]      │ [↗ 이동]       │
├───────────────┼───────────────┼───────────────┤
│ CJ대한통운    │ 한진          │ 코스모항운     │
│ [↗ 이동]      │ [↗ 이동]      │ [↗ 이동]       │
└───────────────┴───────────────┴───────────────┘
```

---

## 4. 필터 & 정렬 (`/jobs` 상단)

### 4.1 필터

```ts
// web/src/app/jobs/_components/job-filters.tsx
interface JobFilters {
  cargoCategory: CargoJobCategory[] | 'all';   // 다중 선택
  trustScoreMin: 1 | 2 | 3 | 4 | 5;            // 최소 신뢰도 (기본 3)
  location: string[];                           // 서울/인천/부산/제주/기타
  employmentType: EmploymentType[] | 'all';
  deadlineWithin: 3 | 7 | 14 | 30 | null;
  yearsExperience: '신입' | '1~3' | '2~5' | '5~10' | '10+' | 'all';  // C1 기본 2~5
  sourceType: SourceType[] | 'all';
}
```

상태 관리: `useReducer` + URL 쿼리 동기화 (`useSearchParams` + `router.replace`).

### 4.2 정렬

- `신뢰도순` (기본, `source_trust_score DESC`)
- `마감 임박순` (`deadline ASC`)
- `최신 등록순` (`created_at DESC`)

---

## 5. 신뢰도 점수 (`source_trust_score`) — P03 해결

### 5.1 초기 세팅 (수동)

| Source Type | 초기 점수 |
|---|---|
| 대형 콘솔사·포워더 공식 (대한항공카고·판토스·CJ대한통운 등) | **5** |
| 공공기관 (한국공항공사·인천공항공사·국토부 산하) | **5** |
| 워크넷 (고용노동부) | **4** |
| 사람인 (정규직 + 검증된 회사명) | **3** |
| 사람인 (소규모·정보 불명) | **2** |
| 학원·대행·가맹점 모집 | **1 (자동 rejected 후보)** |

### 5.2 자동 보정 룰

- 회사명이 `airline_cargo_career_links` 와 매칭 → +1
- 제목/본문에 `수강료`·`학원`·`과정 안내`·`수료` 키워드 → -1 (자동 `rejected` 후보)
- 제목/본문에 `AWB`·`ULD`·`콘솔`·`포워더`·`TACT` → +0.5 (화물 도메인 신뢰)
- 마감일 30일+ 지연 반복 등장 → -1

### 5.3 UI 노출

- 카드 우상단 ★ 아이콘 1~5개 (`lucide-react` Star)
- 사용자 필터: `3+` (기본) / `4+` / `5만`

---

## 6. 하이브리드 큐레이션 (ADR-004 — P04·P03 동시 해결)

자동 수집으로 속도 해결 + 수동 승인으로 품질 담보.

### 6.1 플로우

```
[워크넷/사람인 API]
    ↓ GitHub Actions cron (KST 24:00)
[/api/cron/ingest-jobs]
    ↓ 제외 키워드 필터(승무원·조종사 등) + dedupe + 초기 trust_score
[job_posts INSERT status='pending']
    ↓
[/admin/jobs 관리자 큐]  ← 사용자 본인 10~30분/일 승인
    ↓ status='approved' or 'rejected'
[공개 /jobs 노출은 approved만]
```

### 6.2 `job_posts.status` enum

- `pending` — 수집 직후. 공개 X
- `approved` — 관리자 승인. 공개 O
- `rejected` — 거부. 영구 숨김 (reason 필드 선택)
- `archived` — 마감 7일 후 자동 archived

### 6.3 관리자 큐 (`/admin/jobs`)

- 접근: **Supabase Magic Link + 이메일 화이트리스트** (사용자 본인만) — `/admin/dashboard`와 동일 인증
- UI: 좌측 `pending` 리스트 · 우측 카드 상세 · 하단 `[승인] [거부(이유)] [수정 후 승인]`
- 배치 단축키: "신뢰도 5 소스 일괄 승인"
- 거부 이유 선택지: 화물 무관 / 학원 광고 / 신뢰도 불명 / 중복 / 기타

---

## 7. 채용 상세 페이지 (`/jobs/[slug]`)

### 7.1 구성

1. **헤더**: 로고 + 회사명 + 제목 + 신뢰도 별 + D-N 배지
2. **요약**: 제목 + 2~3문장 요약 + 원문 링크 (본문 저장 금지)
3. **메타**: 화물 직군·근무지·경력·고용형태·등록일·출처
4. **CTA**: `원문 페이지에서 지원하기 ↗` (신규 탭)
5. **관련 공고**: 같은 카고 카테고리·회사 공고 3개
6. **구독 CTA**: "이 직군 공고 새로 올라오면 메일로 받기"
7. **출처 표기**: "출처: 워크넷 (https://www.work.go.kr) · 수집: 2026-04-11 00:12 KST"

### 7.2 SEO (JobPosting schema)

Next.js `generateMetadata` + `<script type="application/ld+json">` 주입. Google Jobs 인덱싱 목표.

```json
{
  "@context": "https://schema.org/",
  "@type": "JobPosting",
  "title": "...",
  "description": "...",
  "datePosted": "...",
  "validThrough": "...",
  "employmentType": "FULL_TIME",
  "hiringOrganization": { "@type": "Organization", "name": "..." },
  "jobLocation": { ... },
  "industry": "Air Cargo / Logistics"
}
```

---

## 8. Phase 5.5 — `/employers` 페이지 (B1 양면 시장)

**Phase 5 MVP에서는 비활성**. Phase 5.5 진입 시 `/employers` 페이지 신설.

### 8.1 페이지 구성

1. **Hero**: "화물 직군만 모인 현직자 커뮤니티에 귀사 공고를 노출하세요"
2. **인재풀 요약** (Supabase 집계):
   - 현재 verified 구독자 수 (예: "1,234명")
   - 직군 분포 파이 (영업·오퍼·통관·수출입·국제물류)
   - 경력 분포 (신입·1~3·2~5·5~10·10+)
   - **개인정보 노출 없음** — 집계 통계만
3. **문의 폼** (`employer_inquiries` 테이블):
   - 회사명 · 담당자명 · 이메일 · 전화 · 모집 직군 · 모집 인원 · 기간 · 자유 메시지
   - 허니팟 필드 + rate limit (1h 내 3건)
4. **FAQ**: "유료인가요?", "게시 기간은?", "연락은 얼마 만에?"

### 8.2 관리자 플로우

- B1 제출 → `employer_inquiries` INSERT → Loops 트랜잭셔널 메일로 관리자 알림
- 관리자가 48h 이내 수동 응답 (이메일)
- 응답 후 수동으로 `job_posts`에 `source_type='partner_employer'` `trust_score=5`로 등록

### 8.3 수익화 없음 (ADR-008)

- 게시 비용 없음
- 인재풀 열람 비용 없음
- 모든 것이 무료. 목적은 **공급측(공고)과 수요측(C1) 사이 생태계 형성**

---

## 9. 알려진 제약 · 위험

| 위험 | 완화 |
|---|---|
| 워크넷 API 1,000콜/일 한도 | 화물 키워드 좁혀 200~400건/일 예상, 한도 50% 이하 |
| 사람인 dedupe 불완전 | 해시 + levenshtein 보조. 관리자 큐에서 중복 수동 거부 |
| 화물 키워드가 물류 일반과 혼재 | 제외 키워드 필터 + `source_trust_score` 조합 |
| 공고 만료 후 검색엔진 잔존 | `validThrough` 메타 + sitemap 제외 (7일 후 `archived`) |
| 화물 기업 공식 페이지 URL 변경 | `airline_cargo_career_links` 수동 업데이트, 월 1회 헬스체크 GH Action |
| Phase 5.5 `/employers` B1 Pain 미검증 | [OQ-R15](../open-questions.md) — Phase 5.5 진입 전 콘솔사/포워더 HR 3명 인터뷰 |

---

## 10. MoSCoW 우선순위

| 분류 | 기능 | 근거 |
|---|---|---|
| **Must** | 통합 카고 카드 피드 (`/jobs`) + 6종 필터 + 3종 정렬 | P03·P04 해결 |
| **Must** | 워크넷 수집 + 제외 키워드 필터 + dedupe + `pending` 적재 | 데이터 공급원 |
| **Must** | `/admin/jobs` 승인 큐 (Magic Link 화이트리스트) | P03 핵심 (ADR-004) |
| **Must** | `job_posts.status` enum + RLS `approved` 만 anon SELECT | 법적 필터 |
| **Must** | D-3 이하 `arum.urgent` 배지 | US-A1 성공 조건 |
| **Must** | 화물 기업 공식 딥링크 카드 (`airline_cargo_career_links` 시드 8개+) | 크롤링 금지 대체 |
| **Must** | 카고 카테고리 분류 7종 + 경력 필터 (C1 2~5년 기본) | P04 핀포인트 |
| **Should** | `source_trust_score` 자동 보정 룰 (§5.2) | P03 보강 |
| **Should** | `/jobs/[slug]` 상세 + JobPosting schema | SEO 유입 |
| **Should** | 사람인 secondary + 해시 dedupe | 공고 커버리지 |
| **Should** | "본 공고" localStorage 배지 | 재방문 유인 |
| **Could** | 기업 로고 자동 매칭 | 시각 품질 |
| **Could** | 관심 태그 기반 추천 정렬 | 데이터 축적 후 |
| **Won't (Phase 5)** | `/employers` B1 양면 시장 | **Phase 5.5로 이동** |
| **Won't** | 화물 기업 홈페이지 자동 크롤링 | ToS 리스크 |
| **Won't** | 지원 트래킹 (ATS 연동) | Phase 6+ |
| **Won't** | 승무원·조종사·정비 공고 | v0.3 비스코프 |

---

## 11. NFR / SLO

| 영역 | 지표 | 목표 (SLO) | 측정 |
|---|---|---|---|
| 가용성 | `/jobs` 5xx 에러율 | ≤ 0.5% (28일) | Vercel Analytics + Sentry |
| 응답시간 | `/jobs` p95 TTFB | ≤ 600 ms | Vercel Speed Insights |
| 응답시간 | `/jobs` p95 LCP | ≤ 2.5 s | Lighthouse CI |
| 수집 신선도 | 공고 업데이트 lag | ≤ 26 h | `ingest_logs.finished_at` vs 공고 `created_at` |
| 큐 백로그 | 일일 pending 잔존 | ≤ 30건/일 | `/admin/jobs` 대시보드 |
| 광고 혼입률 | 승인 공고 중 학원·대행 비율 | ≤ 5% (주간 n=20 스폿) | 수동 라벨링 |
| 화물 관련성 | 승인 공고 중 화물 무관 비율 | ≤ 3% (주간 스폿) | 수동 라벨링 |
| 정확도 | 자동 `trust_score` vs 관리자 최종 일치율 | ≥ 70% (200건 후) | 라벨링 로그 |
| 접근성 | 키보드 내비·대비 | WCAG AA | axe DevTools, Lighthouse |
| 데이터 무결성 | dedupe 실패율 | ≤ 1% | unique 위반 시도 |
| 보안 | `/admin/jobs` 인증 실패 | 401 + 분당 10회 초과 시 429 | Next middleware |

**복구 목표**: 워크넷 API 장애 시 24h 이내 수동 fallback (공공데이터포털 CSV 수동 업로드).

---

## 12. Differential Value (수치)

| 차원 | 현행 | 목표 | 개선폭 |
|---|---|---|---|
| 탐색 시간 / 이직 세션 | 20분+ (C1 가설) | < 5분 | ≥75% 단축 |
| 학원·광고 혼입률 | 20~30% | ≤ 5% | ≥75% 감소 |
| 지인 추천 외 경로 비율 | 30% | ≥ 60% (구독자 설문) | 2배 |
| 관리자 승인 처리 시간 / 건 | — | ≤ 15초/건 | 관리자 피로 임계 |

---

## 13. Proof (실험 설계)

| 주장 | 실험 | 성공 기준 | 시점 | OQ |
|---|---|---|---|---|
| "C1 이직 경로 Pain 실재" | 2~5년차 콘솔사/포워더 5명 인터뷰 | 70%+가 "지인 추천에만 의존" 경험 응답 | Phase 1 말 | [OQ-R13](../open-questions.md) |
| "B1 HR Pain 실재" | 포워더·콘솔사 HR 3명 인터뷰 | 80%+가 "사람 못 구함" 호소 | Phase 5.5 진입 전 | [OQ-R15](../open-questions.md) |
| "하이브리드 큐레이션 → 신뢰도" | `/jobs/[id]/feedback` 1-tap 2주, n ≥100 | 부적절 ≤5% | Phase 5 말 | - |
| "자동 `trust_score` 정확도" | 첫 200건 라벨 vs 자동 | 일치율 ≥70% | Phase 5 | - |
| "마감 배지 → 클릭" | A(빨강 D-N) vs B(회색) 4주 | A 그룹 CTR ≥+20% | Phase 5 말 | - |
| "탐색 시간 단축" | 베타 5명 before/after 15분 태스크 | ≥75% 단축 | Phase 3 말 | - |
| "Core Web Vitals" | Lighthouse CI 주간 | LCP p95 ≤2.5s 4주 연속 | Phase 3~ | - |

---

## 14. DoD

- [ ] `/jobs` 카드 그리드 렌더 (mock → 실제)
- [ ] 필터 7종 + 정렬 3종 + URL 쿼리 동기화
- [ ] `job_posts` 테이블 + `status` enum + `cargo_job_category` ([03-data-model.md](./03-data-model.md))
- [ ] `/api/cron/ingest-jobs` + GitHub Actions (워크넷 + 사람인 + 제외 키워드 필터)
- [ ] `/admin/jobs` 큐 (Magic Link 화이트리스트)
- [ ] `/jobs/[slug]` 상세 + JobPosting schema
- [ ] `airline_cargo_career_links` 시드 8개 이상 (대한항공카고·아시아나카고·판토스·CJ대한통운·한진·코스모항운·우정항공·트리플크라운 등)
- [ ] D-3 이하 `arum.urgent` 배지
- [ ] US-A1·A2 AC 전체 통과 (A3는 Phase 5.5)
- [ ] NFR SLO 응답시간·가용성·큐 백로그·광고 혼입률·화물 관련성 5종 측정
- [ ] ADR-004 Verification 체크리스트 완료
- [ ] `승무원`·`조종사`·`정비` 단어가 본문에 없음 (비스코프 섹션·제외 키워드 필터 설명 제외)

---

## Changelog

- **2026-04-11 v0.3**: **Cargo-First Pivot 반영** ([ADR-008](../adr/ADR-008-pivot-to-cargo-first.md)). Pain §1 P01/P02 → **P04/P03** 전면 교체. 키워드 `승무원`·`조종사`·`정비` → `항공화물`·`국제물류`·`포워딩`·`콘솔`로 교체. 제외 키워드 필터 신규. User Story 승무원 C1·C2·C3 → **카고 C1 이지훈·C3 김태영 + B1 최혜진(Phase 5.5)** 로 교체. 공식 딥링크 카드 대한항공 여객·제주항공 등 → **대한항공카고·아시아나카고·판토스·CJ대한통운·한진·코스모항운·우정항공·트리플크라운·에어인천** 로 교체. 카고 카테고리 분류 7종 신규 + 경력 필터 (C1 2~5년 핀포인트). `source_trust_score` 화물 도메인 키워드(AWB·ULD·콘솔·포워더·TACT) 가산 룰 신규. **§8 Phase 5.5 `/employers` 섹션 신규** (B1 양면 시장, 인재풀 집계 요약, 문의 폼, 수익화 없음). 제휴 스튜디오·합격 후기 섹션 삭제 (승무원 맥락). DoD에 "승무원·조종사 단어 부재" 체크 추가.
- 2026-04-11 v0.2: VPS→PRD 강화. **v0.3에서 카고 피벗으로 재작성됨.**
- 2026-04-11 v0.1: 최초 작성.
