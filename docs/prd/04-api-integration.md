# PRD 04 — API Integration · 아름 카고 v0.3

> 외부 API 클라이언트·인증키·레이트리밋·에러 처리·cron 스케줄 명세.
> 앵커: [00-overview.md](./00-overview.md) · 데이터 모델: [03-data-model.md](./03-data-model.md) · 뉴스 소스 SSOT: [09-news-sources.md](../references/09-news-sources.md)

**버전**: v0.3 · **관련 ADR**: [ADR-008 Cargo Pivot](../adr/ADR-008-pivot-to-cargo-first.md), [ADR-001 Loops](../adr/ADR-001-email-service-loops-over-resend.md), [ADR-005 Cron 하이브리드](../adr/ADR-005-cron-hybrid-vercel-github.md), [ADR-007 GPT-4o-mini](../adr/ADR-007-translation-gpt-4o-mini.md), [ADR-002 KAC+IIAC](../adr/ADR-002-flight-data-kac-iiac-over-aviationstack.md)

---

## 0. v0.3 요약 (Cargo Pivot)

- **네이버 뉴스 키워드 전면 교체**: 승무원·LCC·객실 제거 → 카고 키워드 12종 (`항공화물`·`화물기`·`포워더`·`콘솔사`·`AWB`·`TAC Index`·`BAI` 등).
- **해외 RSS 교체**: Simple Flying / Aviation Week → **Loadstar · Air Cargo News UK · FlightGlobal Cargo** (카고 전문).
- **LLM 번역 Provider-Agnostic facade (2026-04-19 Rev 1.0 반영)**: `TRANSLATION_PROVIDER` env. **MVP 기본 `gemini` = Gemini 1.5 Flash 무료 티어** (분당 15 req · 일 1,500 req · $0). `openai` / `anthropic` 어댑터는 Phase 5.5+ OQ-R17 실측 후 도입 (MVP 미구현). 시스템 프롬프트는 카고 전문 용어 (AWB·ULD·TAC Index·Belly Cargo) 괄호 병기 규칙 공용.
- **워크넷/사람인 키워드 교체**: 승무원·조종사·정비 제거 → 카고 직군 키워드 10종. 제외 키워드 필터 추가.
- **운항 API (KAC/IIAC) → Phase 5.5로 이동**. Phase 5 MVP에서는 호출 안 함.
- **Phase 5.5 신규 API**: `capacity_feedback` 제보 접수 (내부), `employer_inquiries` 문의 접수.
- **관리자 Auth 추가**: Phase 5부터 `/admin/*` Supabase Magic Link + `admin_users` 화이트리스트.
- **Vercel Analytics API**: 관리자 대시보드 MUV·유입 경로 조회.

---

## 1. 원칙

1. **모든 외부 API는 서버 사이드에서만**. 클라이언트 직접 fetch 금지.
2. **인증키는 `.env.local`·GitHub Secrets에만**. `.env.example`에는 이름만.
3. **모든 API 클라이언트는 `web/src/lib/api/`**. 파일명 `{service}-client.ts`.
4. **응답 검증은 zod로 parse**. 실패 시 `ingest_logs` 기록 후 다음 항목으로 진행.
5. **쿼리 결과는 Next.js `unstable_cache` + Supabase 스냅샷** 이중 캐싱.
6. **승무원·조종사·정비 키워드는 DB 트리거 + ingest 필터 양쪽에서 이중 차단**. [03 PRD §4.5](./03-data-model.md) `block_non_cargo_titles` + 본 문서 §7.2 exclude list.

---

## 2. API 목록 (v0.3 요약)

| API | 용도 | 도입 Phase | 호출 주체 | 빈도 | 무료 한도 |
|---|---|---|---|---|---|
| 네이버 뉴스 검색 | 국내 카고 뉴스 | 5 | GitHub Actions | 2회/일 | 25,000 req/일 |
| 국내 카고 RSS (카고프레스·CargoNews·Forwarder KR·Air Cargo News KR) | 국내 카고 보조 | 5 | GitHub Actions | 2회/일 | — |
| Loadstar RSS ⭐ | 해외 카고 primary | 5 | GitHub Actions | 2회/일 | — |
| Air Cargo News UK RSS ⭐ | 해외 카고 primary | 5 | GitHub Actions | 2회/일 | — |
| FlightGlobal Cargo RSS | 해외 카고 secondary | 5 | GitHub Actions | 2회/일 | — |
| IATA Cargo News | 해외 정책·규제 | 5 | GitHub Actions | 주 1회 | — |
| LLM Translation (기본 OpenAI GPT-4o-mini, `TRANSLATION_PROVIDER`로 교체) | 해외 카고 기사 한글 요약 | 5 | GitHub Actions | per article | 종량제, 월 $0.24 예상 (provider·모델에 따라 차이) |
| 워크넷 OpenAPI | 카고 채용 primary | 5 | GitHub Actions | 1회/일 | 1,000 req/일 |
| 사람인 OpenAPI | 카고 채용 secondary | 5 | GitHub Actions | 1회/일 | 500 req/일 |
| Loops.so API | 이메일 발송 | 5 | Vercel Cron + API Route | 이벤트 기반 | 무료 2,000 contacts |
| Vercel Analytics API | 관리자 대시보드 MUV·유입 | 5 | `/admin/dashboard` SSR | 요청 기반 | 무료 티어 |
| Supabase Auth (Magic Link) | 관리자 `/admin/*` 인증 | 5 | Supabase | 로그인 시 | 무료 |
| 한국공항공사 (KAC) | 운항 (지방공항) | **5.5** | GitHub Actions | 2회/일 | 10,000 req/일 |
| 인천공항공사 (IIAC) | 운항 (ICN) | **5.5** | GitHub Actions | 2회/일 | 10,000 req/일 |
| UBIKAIS / FlightRadar24 | 운항 상세 딥링크 | **5.5** | 클라이언트 URL 생성 | — | — |

---

## 3. 네이버 뉴스 검색 API (v0.3 카고 키워드)

**공식 문서**: https://developers.naver.com/docs/serviceapi/search/news/news.md

### 3.1 엔드포인트

```
GET https://openapi.naver.com/v1/search/news.json
Headers:
  X-Naver-Client-Id: {NAVER_CLIENT_ID}
  X-Naver-Client-Secret: {NAVER_CLIENT_SECRET}
Query:
  query    — 검색어 (UTF-8 URL encoded)
  display  — 1~100
  start    — 1~1000
  sort     — sim | date
```

### 3.2 쿼리 배치 (v0.3 카고 전용)

```ts
// web/src/lib/api/naver-news-client.ts
export const NAVER_NEWS_QUERIES = [
  // 시장 (cargo-market)
  { query: '항공화물', category: 'cargo-market', tags: ['국내'] },
  { query: '항공운송 요율', category: 'cargo-market', tags: ['국내', 'TAC'] },
  { query: 'TAC Index', category: 'cargo-market', tags: ['지표'] },
  { query: 'BAI 항공화물', category: 'cargo-market', tags: ['지표'] },

  // 운영 (cargo-ops)
  { query: '화물기', category: 'cargo-ops', tags: ['국내'] },
  { query: 'AWB 항공', category: 'cargo-ops', tags: ['문서'] },

  // 기업 (cargo-company)
  { query: '대한항공카고', category: 'cargo-company', tags: ['국내', '대한항공카고'] },
  { query: '아시아나카고', category: 'cargo-company', tags: ['국내', '아시아나카고'] },
  { query: '포워더', category: 'cargo-company', tags: ['포워더'] },
  { query: '콘솔사', category: 'cargo-company', tags: ['콘솔사'] },
  { query: '국제물류', category: 'cargo-company', tags: ['포워더'] },

  // 정책 (cargo-policy)
  { query: '국토교통부 항공화물', category: 'cargo-policy', tags: ['정책'] },

  // 큰 항공 뉴스 (big-aviation, 30% 쿼터)
  { query: '대한항공', category: 'big-aviation', tags: ['대한항공'] },
  { query: '인천공항', category: 'big-aviation', tags: ['공항'] },
];
```

**제외 키워드 (exclude list, 응답 후 필터)**: `승무원` · `객실` · `지상직` · `조종사` · `부기장` · `항공정비` · `정비사` · `기장`.
→ `title` 또는 `description`에 포함되면 skip + `ingest_logs.records_skipped++`.

### 3.3 응답 검증 (zod)

```ts
import { z } from 'zod';

const NaverNewsItem = z.object({
  title: z.string(),           // HTML 태그 포함 → stripHtml
  originallink: z.string().url(),
  link: z.string().url(),
  description: z.string(),
  pubDate: z.string()
});

const NaverNewsResponse = z.object({
  lastBuildDate: z.string(),
  total: z.number(),
  start: z.number(),
  display: z.number(),
  items: z.array(NaverNewsItem)
});
```

### 3.4 dedupe & 저장

```ts
const html = (text: string) => text.replace(/<[^>]+>/g, '');
const EXCLUDE_RE = /승무원|객실|지상직|조종사|부기장|정비사|기장|항공정비/;

for (const item of items) {
  const title = html(item.title);
  const descRaw = html(item.description);

  // v0.3: 카고 스코프 필터
  if (EXCLUDE_RE.test(title) || EXCLUDE_RE.test(descRaw)) {
    await logSkip('exclude_keyword', title);
    continue;
  }

  const sourceName = extractSourceFromOriginallink(item.originallink);
  const dedupeHash = sha256(`${sourceName}:${title}:${item.pubDate}`);

  if (await existsInNewsArticles(dedupeHash)) continue;

  await supabase.from('news_articles').insert({
    slug: nanoid(8),
    title,
    summary: descRaw.slice(0, 280),
    source_name: sourceName,
    source_url: item.originallink,
    source_type: 'naver_news',
    category: query.category,            // 'cargo-market' | ...
    tags: query.tags,
    published_at: new Date(item.pubDate).toISOString(),
    dedupe_hash: dedupeHash,
    original_language: 'ko',
    is_translated: false,
    is_published: false,                  // v0.3: 관리자 승인 대기
  });
}
```

### 3.5 에러 처리

- 429 (레이트리밋): 10초 sleep 후 재시도 (최대 3회). 실패 시 다음 쿼리.
- 401/403: 키 오류 → `ingest_logs` 치명 오류 기록 + 즉시 중단 + 관리자 이메일 알림 (Loops transactional).

### 3.6 카테고리 쿼터 (soft)

- 카드 배분 목표: `cargo-market 25% + cargo-ops 20% + cargo-company 15% + cargo-policy 10% + airport-cargo 10% + big-aviation 30%` (일 기준).
- 관리자 승인 단계에서 카테고리 편차 ±10%p 초과 시 경고 뱃지. 강제 차단 X (MVP).

---

## 4. 해외 카고 뉴스 RSS + LLM 번역 파이프라인 (v0.3 · 2026-04-18 Provider-Agnostic)

> 본 섹션의 모든 LLM 호출은 `src/lib/api/translation/` facade를 거쳐 `TRANSLATION_PROVIDER` 환경변수로 선택된 adapter(`openai` / `gemini` / `anthropic`)로 라우팅된다. MVP 기본값 `openai`=GPT-4o-mini. 아래 SDK 예시는 기본 Provider 기준. [ADR-007 Amendment 2026-04-18](../adr/ADR-007-translation-gpt-4o-mini.md) · [SRS C-TEC-015](../srs/SRS-001-arum-cargo.md).

### 4.1 RSS 파싱

```ts
// web/src/lib/api/rss-cargo-client.ts
import Parser from 'rss-parser';

const parser = new Parser({
  headers: { 'User-Agent': 'ArumCargo/0.3 (+https://arumcargo.vercel.app)' },
  timeout: 15_000,
  customFields: { item: ['content:encoded', 'media:thumbnail'] }
});

export const OVERSEAS_CARGO_FEEDS = [
  { url: 'https://theloadstar.com/feed/', sourceName: 'Loadstar', language: 'en', priority: 'primary' },
  { url: 'https://www.aircargonews.net/feed/', sourceName: 'Air Cargo News UK', language: 'en', priority: 'primary' },
  { url: 'https://www.flightglobal.com/cargo/rss', sourceName: 'FlightGlobal Cargo', language: 'en', priority: 'secondary' },
  // IATA Cargo News는 RSS 미제공 시 주 1회 스크래핑 별도 처리
];

export const DOMESTIC_CARGO_FEEDS = [
  { url: 'https://www.cargopress.co.kr/feed', sourceName: '카고프레스', language: 'ko' },
  { url: 'https://www.cargonews.co.kr/feed', sourceName: 'CargoNews', language: 'ko' },
  { url: 'https://www.forwarder.kr/feed', sourceName: 'Forwarder KR', language: 'ko' },
  // OQ-R3: 실제 RSS URL Phase 5 진입 전 확인
];
```

### 4.2 LLM 요약 호출 — 기본 Provider OpenAI GPT-4o-mini (v0.3 카고 프롬프트)

**공식 문서**: https://platform.openai.com/docs/models/gpt-4o-mini

```ts
// web/src/lib/api/openai-summarize.ts
import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `너는 항공 화물 업계 전문 번역가다.
아래 영문 기사 제목과 본문을 한국어 3문장 이내로 요약해라.

규칙:
1. 핵심 팩트만. 의견·추측·과장 금지.
2. 카고 전문 용어는 영어 원문을 괄호로 병기하라.
   예: AWB (항공화물운송장), ULD (단위탑재용기),
       TAC Index (Baltic Air Freight Index),
       Belly Cargo (여객기 하부 화물), Freighter (화물기),
       Main Deck (메인 데크), Consolidator (콘솔사),
       Forwarder (포워더).
3. 요율·수치는 원문 그대로. 통화·단위 변환 금지.
4. 3문장 이내, 50~500자, 반드시 한국어.
5. 원문에 없는 고유명사·회사명·수치 생성 금지 (환각 방지).`;

export async function summarizeCargoToKorean(title: string, content: string): Promise<string> {
  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.2,                    // v0.3: 카고는 사실성 우선, temp 낮춤
    max_tokens: 500,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `제목: ${title}\n\n본문: ${content.slice(0, 4000)}` }
    ]
  });
  return response.choices[0]?.message?.content?.trim() ?? '';
}
```

### 4.3 zod 검증 (환각·길이)

```ts
const SummarySchema = z.string()
  .min(50, 'summary too short')
  .max(500, 'summary too long')
  .refine(s => {
    const koreanChars = (s.match(/[가-힣]/g) ?? []).length;
    return koreanChars / s.length >= 0.5;  // 한국어 50%+
  }, 'not korean');

function assertNoHallucination(summary: string, sourceText: string): boolean {
  // 원문에 없는 숫자 패턴 탐지 (간이)
  const summaryNumbers = summary.match(/[\d,]+/g) ?? [];
  const sourceNormalized = sourceText.replace(/\s+/g, '');
  for (const num of summaryNumbers) {
    if (num.length >= 2 && !sourceNormalized.includes(num.replace(',', ''))) {
      return false;  // 환각 의심
    }
  }
  return true;
}
```

### 4.4 비용 추정 (v0.3 카고 볼륨)

- input 1,500 tokens + output 300 tokens per article ≈ $0.0004
- 월 해외 카고 기사 300~600건 × $0.0004 ≈ **월 $0.12 ~ $0.24**
- `monthly_budget_cap` $5 환경변수. 당월 OpenAI usage 체크 후 초과 시 skip + `is_translated=false` fallback.

### 4.5 A/B 테스트 ([OQ-R16](../open-questions.md) 에디터 Pick)

- Phase 4 초기: `subscribers.id` 홀짝으로 50/50 split
- A그룹: 카드에 에디터 Pick 노출
- B그룹: 에디터 Pick 숨김 (summary만)
- 측정: `email_events.opened`·`clicked` + `news_clicks` 체류 + 다이제스트 수신 후 24h 내 재방문
- 4주 후 분석 → 승자로 전환

(번역 A/B는 v0.2 OQ-R17에서 이미 진행. v0.3는 에디터 Pick A/B가 메인.)

---

## 5. 워크넷 OpenAPI (v0.3 카고 직군)

**공식 문서**: https://www.data.go.kr/data/15033457/openapi.do

### 5.1 엔드포인트

```
GET https://openapi.work.go.kr/opi/opi/opia/wantedApi.do
  authKey={WORKNET_API_KEY}
  callTp=L
  returnType=XML
  startPage=1
  display=50
  keyword={UTF-8}
  region=
  empTpCd=
```

### 5.2 키워드 배치 (v0.3 카고)

```ts
export const WORKNET_CARGO_KEYWORDS = [
  { q: '항공화물', category: 'sales' },
  { q: '항공운송', category: 'sales' },
  { q: '항공화물 영업', category: 'sales' },
  { q: '항공화물 오퍼', category: 'ops' },
  { q: '국제물류', category: 'intl_logistics' },
  { q: '포워딩', category: 'intl_logistics' },
  { q: '포워더', category: 'intl_logistics' },
  { q: '통관', category: 'customs' },
  { q: '수출입', category: 'imex' },
  { q: '공항 상주', category: 'airport_ground' },
];
```

### 5.3 제외 키워드 필터 (응답 후)

```ts
const EXCLUDE_CARGO_JOBS_RE = /(승무원|객실|지상직|조종사|부기장|항공정비|정비사|기장|캐빈)/;

for (const raw of worknetResults) {
  if (EXCLUDE_CARGO_JOBS_RE.test(raw.title) || EXCLUDE_CARGO_JOBS_RE.test(raw.companyName ?? '')) {
    await logSkip('exclude_keyword', raw.title);
    continue;
  }
  // ... insert (status='pending')
}
```

### 5.4 dedupe

```ts
const dedupeHash = sha256(`${companyName}:${title}:${postedAt}`);
```

### 5.5 신뢰도 매핑 (v0.3 카고 가중)

```ts
function scoreTrust(raw: WorknetJob, matched: CargoLink | null): number {
  let score = 3.0;  // 워크넷 일반 기본
  if (matched) score = 5.0;  // cargo_career_links 매칭 → airline_cargo_official
  if (/공사|공단|청|부/.test(raw.companyName ?? '')) score = 4.5;
  if (/학원|수강|과정|양성/.test(raw.title)) score = 2.0;
  // v0.3 카고 키워드 보너스
  if (/AWB|ULD|TACT|콘솔|포워더|항공화물/.test(raw.title + (raw.description ?? ''))) {
    score = Math.min(score + 0.5, 5.0);
  }
  return score;
}
```

---

## 6. 사람인 OpenAPI (Secondary, v0.3)

**공식 문서**: https://oapi.saramin.co.kr/

### 6.1 키워드·제외 필터

워크넷과 동일 키워드 배치 + `EXCLUDE_CARGO_JOBS_RE` 필터. 워크넷 수집 후 실행하여 동일 `dedupe_hash`는 skip.

### 6.2 신뢰도

- `cargo_career_links` 매칭 → 5.0
- 카고 키워드 보너스 +0.5
- 학원/양성 → 2.0
- 그 외 사람인 일반 → 3.0

---

## 7. Loops.so API

**공식 문서**: https://loops.so/docs/api

### 7.1 주요 엔드포인트

```
POST https://app.loops.so/api/v1/contacts/create
  Authorization: Bearer {LOOPS_API_KEY}
  body: { email, firstName?, userGroup?, ...custom }

POST https://app.loops.so/api/v1/contacts/update
POST https://app.loops.so/api/v1/transactional
POST https://app.loops.so/api/v1/events/send
```

### 7.2 사용 패턴 (v0.3)

- **구독 요청**: `/api/subscribe` → Supabase `subscribers` insert (`status='pending'`) + Loops `contacts/create` + `transactional` 인증 메일
- **인증 클릭**: `/api/subscribe/verify?token=...` → `status='verified'` + Loops `contacts/update`
- **다이제스트 발송**: Vercel Cron `/api/cron/daily-digest` → verified 구독자 리스트 → 개별 `transactional` 호출 (Interest category 매칭)
- **관리자 알림**: 수집 실패·예산 초과·employer_inquiries·capacity_feedback 도착 시 → `transactional`
- **Loops 이벤트 동기화**: `subscribers.last_active_at` 갱신용 webhook 수신 `/api/webhooks/loops`

### 7.3 캠페인 vs Transactional

MVP는 **Transactional 단일**. §50 필드를 앱 레이어에서 주입 가능해야 함. Campaign은 자동화 어려움 + 한국 §50 커스터마이즈 제약.

### 7.4 레이트리밋

- Loops 무료: 10 req/sec
- 구독자 1,000명 기준 100초. 배치 사이 `await sleep(150ms)` 삽입 안전

### 7.5 한국 §50 준수 ([OQ-M6](../open-questions.md))

- **(광고) 제목**: transactional dataVariable `subject='(광고) [아름 카고] 오늘의 화물 뉴스 + 채용 N건'` 주입. Loops 템플릿 `{{subject}}` 지원 여부 검증 필수.
- **원클릭 수신거부**: 템플릿 본문 하단 `{{unsubscribeUrl}}` + 우리 자체 settings_token 기반 `/unsubscribe/[token]` 이중 링크.
- **발신자 정보**: 템플릿 footer에 "아름 카고 (Arum Cargo)" + 연락 이메일 + 주소 고정.
- **야간 발송 회피**: Vercel Cron KST 07:00 고정.

OQ-M6 Phase 5 진입 전 Loops 실제 템플릿에서 모든 필드 주입 가능 확인. 실패 시 Phase 6 Resend 폴백.

### 7.6 Webhook 수신

```ts
// web/src/app/api/webhooks/loops/route.ts
// Loops 이벤트: delivered / opened / clicked / bounced / unsubscribed
// → email_events 테이블에 저장
// → 트리거 update_subscriber_last_active가 subscribers.last_active_at 자동 갱신
// → WAU 계산의 기반
```

---

## 8. Vercel Analytics API (v0.3 신규)

**공식 문서**: https://vercel.com/docs/analytics

### 8.1 용도

관리자 대시보드 `/admin/dashboard` 에서 MUV + 유입 경로 조회. 서버 컴포넌트에서 REST 호출 후 shadcn/ui charts 카드 렌더.

### 8.2 엔드포인트

```
GET https://vercel.com/api/web/insights/views
  Authorization: Bearer {VERCEL_API_TOKEN}
  teamId, projectId
  from, to (ISO)
  granularity=day
```

### 8.3 캐싱

- 5분 `unstable_cache` + ISR `revalidate=300`
- 무료 티어 한도 고려해 1시간에 1회만 실제 호출

---

## 9. Supabase Auth (v0.3 신규) — 관리자 Magic Link

### 9.1 플로우

```
관리자 → /admin/login (이메일 입력)
       ↓
서버가 admin_users 화이트리스트 체크
       ↓  (화이트리스트에 있을 때만)
supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: '/admin/callback' } })
       ↓
Loops가 아닌 Supabase 기본 Magic Link 발송
       ↓
링크 클릭 → /admin/callback → 세션 생성 → /admin/dashboard
```

### 9.2 미들웨어 보호

```ts
// web/src/middleware.ts (matcher: /admin/:path*)
// 세션 없으면 /admin/login 리다이렉트
// 세션 이메일이 admin_users에 없으면 403
```

### 9.3 보호 대상

- `/admin/dashboard` (shadcn/ui charts 8개 KPI 카드)
- `/admin/news` (뉴스 승인 + 에디터 Pick 작성)
- `/admin/jobs` (채용 승인)
- `/admin/inquiries` (Phase 5.5 employer_inquiries 읽기)
- `/admin/feedback` (Phase 5.5 capacity_feedback 읽기)

---

## 10. (Phase 5.5) 운항 API — KAC + IIAC

> Phase 5 MVP 스코프 아님. Phase 5.5 진입 시 활성화.

### 10.1 KAC (한국공항공사)

**공식 문서**: https://www.data.go.kr/data/15000126/openapi.do

```
GET https://apis.data.go.kr/B551177/AirFlightDeOdp/getAirFlightDeOdp
  serviceKey={KAC_SERVICE_KEY}
  schAirCode=GMP|CJU|PUS|TAE|KWJ|CJJ|MWX
  schStDate=YYYYMMDD
  schEdDate=YYYYMMDD
  type=json
```

### 10.2 IIAC (인천공항공사)

**공식 문서**: https://www.data.go.kr/en/data/15112968/openapi.do

```
GET https://apis.data.go.kr/B551177/StatusOfPassengerFlightsDeOdp/getPassengerDeparturesDeOdp
GET https://apis.data.go.kr/B551177/StatusOfPassengerFlightsDeOdp/getPassengerArrivalsDeOdp
  serviceKey={IIAC_SERVICE_KEY}
  searchday=YYYYMMDD
  type=json
```

**주의**: 여객편 엔드포인트 기본. 화물편 전용 엔드포인트 존재 여부는 OQ-R19에서 확인. 화물기 필터는 `aircraft_icao` 매핑 후 `aircraft_capacity.role='CGO'`로 결정.

### 10.3 정규화 + 기종 매핑

```ts
// Phase 5.5
function normalizeFlight(raw: any, airport: string, direction: 'departure' | 'arrival'): FlightSnapshot {
  const icao = extractAircraftIcao(raw);  // 응답에 기종 필드 존재 여부 OQ-R19
  const capacity = icao ? aircraftStatic[icao] : null;  // 1단계: 정적 파일 lookup

  return {
    airport_code: airport,
    direction,
    flight_number: raw.airFln ?? raw.flightNo,
    airline_name: raw.airline ?? raw.airlineKor,
    airline_code: extractAirlineCode(raw),
    origin_code: direction === 'arrival' ? extractIata(raw) : airport,
    destination_code: direction === 'departure' ? extractIata(raw) : airport,
    scheduled_time: parseKST(raw),
    actual_time: parseActualKST(raw),
    status: mapStatus(raw),
    gate: raw.gate ?? null,
    terminal: raw.terminal ?? null,
    aircraft_icao: icao,
    aircraft_role: capacity?.role ?? null,
    source_api: 'kac' | 'iiac',
    raw
  };
}
```

### 10.4 UBIKAIS / FlightRadar24 딥링크 (클라이언트)

```ts
// web/src/lib/flight-deeplinks.ts
export function ubikaisUrl(flightNumber: string): string {
  return `https://ubikais.fois.go.kr/?callsign=${encodeURIComponent(flightNumber)}`;
}
export function fr24Url(flightNumber: string): string | null {
  if (!/^[A-Z0-9]{3,8}$/i.test(flightNumber)) return null;
  return `https://www.flightradar24.com/data/flights/${flightNumber.toLowerCase()}`;
}
```

### 10.5 `capacity_feedback` 제출 API (Phase 5.5 신규)

```
POST /api/capacity-feedback
  body: {
    submitter_email, icao_code?, field, proposed_value, reason, honeypot
  }
  응답: 201 | 400 (validation) | 429 (rate limit)

Rate limit: IP 기준 5 req/10min (upstash Redis 또는 Supabase edge function)
```

### 10.6 `employer_inquiries` 제출 API (Phase 5.5 신규)

```
POST /api/employers/inquiry
  body: {
    company_name, contact_name, contact_email, contact_phone?,
    company_type, position_title, headcount, message, honeypot
  }
  응답: 201 | 400 | 429

- honeypot 필드 비어있지 않으면 400 (스팸)
- 제출 성공 시 Loops transactional로 관리자 알림
- Rate limit: IP 기준 3 req/10min
```

---

## 11. Cron 스케줄 (D6 하이브리드, v0.3)

### 11.1 Vercel Cron (`vercel.json`)

```json
{
  "crons": [
    { "path": "/api/cron/daily-digest", "schedule": "0 22 * * *" }
  ]
}
```

→ UTC 22:00 = KST 07:00. Hobby 하루 2회 제한 내.

### 11.2 GitHub Actions 워크플로우 (v0.3)

#### `.github/workflows/ingest-news-domestic.yml`

```yaml
name: Ingest News (Domestic Cargo)
on:
  schedule:
    - cron: '0 21,9 * * *'  # UTC → KST 06:00, 18:00 (출퇴근 직전 신선도)
  workflow_dispatch:

jobs:
  ingest:
    runs-on: ubuntu-latest
    steps:
      - run: |
          curl -X POST "${{ secrets.VERCEL_URL }}/api/cron/ingest-news-domestic" \
               -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

#### `.github/workflows/ingest-news-overseas.yml`

```yaml
name: Ingest News (Overseas Cargo + Translation)
on:
  schedule:
    - cron: '0 20,8 * * *'  # UTC → KST 05:00, 17:00
  workflow_dispatch:
```

#### `.github/workflows/ingest-jobs.yml`

```yaml
schedule:
  - cron: '0 15 * * *'    # UTC 15:00 = KST 24:00 (하루 1회)
```

#### (Phase 5.5) `.github/workflows/ingest-flights.yml`

```yaml
schedule:
  - cron: '0 15,3 * * *'  # KST 24:00, 12:00
```

### 11.3 인증

- 모든 ingest API는 `Authorization: Bearer {CRON_SECRET}` 검증
- `CRON_SECRET`은 Vercel + GitHub Secrets 양쪽에 동일

---

## 12. API Route 구조 (v0.3)

```
web/src/app/api/
├── subscribe/
│   ├── route.ts                 POST — 이메일 + 관심 카테고리 → pending + 인증 메일
│   ├── verify/route.ts          GET  — ?token=... → verified 전환
│   └── settings/[token]/route.ts GET/PATCH — settings_token 기반 설정 수정
├── unsubscribe/[token]/route.ts GET — 원클릭 수신거부
├── cron/
│   ├── ingest-news-domestic/route.ts
│   ├── ingest-news-overseas/route.ts
│   ├── ingest-jobs/route.ts
│   ├── daily-digest/route.ts
│   ├── archive-expired-jobs/route.ts
│   └── (Phase 5.5) ingest-flights/route.ts
├── news/click/[id]/route.ts     POST beacon
├── jobs/click/[id]/route.ts     POST beacon
├── webhooks/loops/route.ts      POST — Loops 이벤트 수신
├── admin/
│   ├── news/[id]/review/route.ts     POST — approve/reject + editor_pick 작성
│   ├── news/[id]/editor-pick/route.ts PATCH — Pick 수정 (이력 자동 기록)
│   ├── jobs/[id]/review/route.ts      POST
│   └── metrics/route.ts                GET — shadcn/ui charts 대시보드 데이터 집계
├── (Phase 5.5) capacity-feedback/route.ts  POST
└── (Phase 5.5) employers/inquiry/route.ts  POST
```

---

## 13. 에러 처리 & 로깅

### 13.1 `ingest_logs` 활용

모든 cron endpoint: 시작 시 `ingest_logs` INSERT (`status='running'`) → 완료 시 UPDATE (`status`, `records_*`, `finished_at`, `error_message`, `notes`).

### 13.2 실패 시나리오

| 시나리오 | 동작 |
|---|---|
| 외부 API 401/403 | `failure` 기록 + 관리자 알림 (Loops transactional) |
| 외부 API 429 | 10s backoff 최대 3회 재시도 후 skip |
| RSS 전체 실패 | `failure` + 직전 성공 스냅샷 유지 (UI는 정상) |
| 부분 실패 (쿼리 12개 중 2개 실패) | `status='partial'` |
| DB INSERT dedupe 충돌 | `records_skipped++`, 정상 |
| GPT 응답 zod 실패 | `is_translated=false` + 원문 제목 저장 |
| GPT 환각 탐지 실패 | skip + `ingest_logs.notes='hallucination_drop'` |
| `monthly_budget_cap` 초과 | skip + `notes='budget_exceeded'`, 원문 제목만 |
| 관리자 승인 전 노출 시도 | RLS 차단 (`is_published=false` SELECT 불가) |

---

## 14. 환경변수 참조 ([CLAUDE.md §6](../../CLAUDE.md))

| 변수 | 쓰임 |
|---|---|
| `NAVER_CLIENT_ID` / `NAVER_CLIENT_SECRET` | ingest-news-domestic |
| `WORKNET_API_KEY` | ingest-jobs |
| `SARAMIN_API_KEY` | ingest-jobs |
| `TRANSLATION_PROVIDER` | LLM 번역 Provider 선택: `openai` (기본) / `gemini` / `anthropic` |
| `OPENAI_API_KEY` | ingest-news-overseas (카고 번역, `TRANSLATION_PROVIDER=openai` 시) |
| `OPENAI_MONTHLY_BUDGET_CAP_USD` | 번역 비용 상한 (현 Provider 기준) |
| `GOOGLE_GENERATIVE_AI_API_KEY` | `TRANSLATION_PROVIDER=gemini` 시 |
| `ANTHROPIC_API_KEY` | `TRANSLATION_PROVIDER=anthropic` 시 |
| `LOOPS_API_KEY` | subscribe, daily-digest, admin 알림 |
| `LOOPS_WEBHOOK_SECRET` | /api/webhooks/loops HMAC 검증 |
| `NEXT_PUBLIC_SUPABASE_URL` | 클라이언트 + 서버 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 클라이언트 |
| `SUPABASE_SERVICE_ROLE_KEY` | 서버 전용 |
| `VERCEL_API_TOKEN` | /admin/dashboard MUV 조회 |
| `VERCEL_TEAM_ID` / `VERCEL_PROJECT_ID` | Analytics API |
| `CRON_SECRET` | cron API 보호 |
| `ADMIN_EMAIL_WHITELIST` | `admin_users` 초기 시드 (fallback) |
| **Phase 5.5** `KAC_SERVICE_KEY` | ingest-flights |
| **Phase 5.5** `IIAC_SERVICE_KEY` | ingest-flights |

---

## 15. 의존성 확보 사전 준비

### Phase 5 진입 2주 전
- [ ] 네이버 개발자센터 애플리케이션 등록 → 검색 API 권한
- [ ] 워크넷 OpenAPI 활용 신청 (2~3일 승인)
- [ ] 사람인 OpenAPI 가입 + 키 발급
- [ ] OpenAI 계정 + 크레딧 충전 ($5)
- [ ] Loops.so 가입 + API 키 발급 + 템플릿 §50 필드 검증 (OQ-M6)
- [ ] Supabase 프로젝트 생성 + URL/Keys + Magic Link 활성화
- [ ] Vercel 프로젝트 생성 + Analytics 활성화 + API 토큰
- [ ] 국내 카고 RSS URL 확인 (OQ-R3: 카고프레스·CargoNews·Forwarder KR)
- [ ] 해외 RSS 접속 테스트 (Loadstar·Air Cargo News UK·FlightGlobal)

### Phase 5.5 진입 2주 전
- [ ] data.go.kr 회원가입 → 사업 목적 설정
- [ ] 한국공항공사 OpenAPI 활용 신청
- [ ] 인천국제공항공사 OpenAPI 활용 신청
- [ ] KAC/IIAC 응답 필드에 기종 정보 포함 여부 확인 (OQ-R19)
- [ ] 사용자 정리 `aircraft_capacity` 30개 시드 자료 마감 (OQ-D1)

---

## 16. NFR / SLO — 엔드포인트별 예산과 안전망

| Endpoint / Job | p95 응답 | 성공률 | 재시도 | 타임아웃 | 일일 한도 (여유 %) | Fallback |
|---|---|---|---|---|---|---|
| 네이버 뉴스 (14 쿼리 × 2회) | 800 ms | ≥ 99% | 3회 (10s 백오프) | 15 s | 28 / 25,000 (0.1%) | 이전 수집본 유지 |
| 국내 카고 RSS (4~6 소스 × 2회) | 1.5 s | ≥ 95% | 2회 | 15 s | — | skip, 다음 배치 |
| 해외 카고 RSS (3 소스 × 2회) | 2 s | ≥ 95% | 2회 | 15 s | — | skip, 다음 배치 |
| LLM Translation (기본 OpenAI GPT-4o-mini, provider-agnostic) | 4 s | ≥ 97% | 2회 (지수) | 30 s | $5/월 cap | `is_translated=false` + 원문 제목만. Provider 장애 시 `TRANSLATION_PROVIDER` 스왑 가능 |
| OpenAI 월 누적 비용 | — | — | — | — | ≤ $5 | cron 시작 시 체크, 초과 시 skip |
| 워크넷 OpenAPI | 1.5 s | ≥ 97% | 3회 | 20 s | 10 / 1,000 (1%) | ingest_logs failure + 재시도 |
| 사람인 OpenAPI | 1.5 s | ≥ 95% | 2회 | 20 s | 10 / 500 (2%) | skip, 워크넷 단독 |
| Loops /contacts/create | 600 ms | ≥ 99% | 2회 | 10 s | 10 req/s | 구독 폼 429 + 재시도 안내 |
| Loops /transactional (digest) | 800 ms | ≥ 99% | 2회 | 10 s | 10 req/s, 월 2,000 contact | 배치 사이 `sleep(150ms)` |
| Loops webhook 수신 | 300 ms | ≥ 99.5% | — | 5 s | — | 중복 방지 외부 ID unique |
| Vercel Analytics | 1 s | ≥ 98% | 1회 | 10 s | — | 5분 캐시 fallback |
| Supabase Magic Link | 1 s | ≥ 99% | — | 10 s | — | 사용자 재시도 |
| `/api/subscribe` | 500 ms | ≥ 99.5% | 0 | 5 s | — | 명시적 오류 + 재시도 안내 |
| `/api/cron/daily-digest` | ≤ 55 s | ≥ 99% | 2회 (cron 재실행) | 60 s | 1 req/일 | 다음날 이월 |
| `/api/cron/ingest-*` | ≤ 50 s | ≥ 95% | 2회 | 60 s | — | 부분 성공 `partial` |
| `/api/capacity-feedback` (5.5) | 400 ms | ≥ 99% | — | 5 s | IP 5 req/10min | 429 + 재시도 |
| `/api/employers/inquiry` (5.5) | 400 ms | ≥ 99% | — | 5 s | IP 3 req/10min | 429 + honeypot 차단 |
| **Phase 5.5** KAC/IIAC | 1 s | ≥ 98% | 3회 | 20 s | 32 / 10,000 (0.32%) | 직전 스냅샷 유지 |

**비용 cap**:
- OpenAI `monthly_budget_cap=$5` 환경변수
- Loops 2,000 contact 근접 시 (≥ 1,800) 신규 구독 폼 대기 안내 + 관리자 알림

**복구 목표**:
- RTO: 단일 API 장애 시 24h 이내 수동 fallback
- RPO: 뉴스·채용 최대 24h 지연 허용, 운항(Phase 5.5) 최대 12h

---

## 17. DoD

### Phase 5 MVP
- [ ] `src/lib/api/` 각 클라이언트 파일 작성 + zod 스키마
- [ ] `/api/cron/ingest-news-domestic` + `ingest-news-overseas` + `ingest-jobs` 구현 + `CRON_SECRET` 검증
- [ ] 승무원·조종사·정비 exclude 키워드 필터 양쪽(news + jobs) 동작
- [ ] `/api/cron/daily-digest` 구현 + Loops transactional 호출
- [ ] `.github/workflows/ingest-*.yml` 3개 작성
- [ ] `vercel.json` daily-digest cron 설정
- [ ] `ingest_logs` 에 모든 cron 실행 기록
- [ ] 네이버·워크넷·사람인 테스트 호출 각 1회 성공 + DB 레코드
- [ ] LLM 번역 facade + openai adapter 구현 + 카고 해외 기사 1건 성공 + zod + 환각 체크 통과 (`TRANSLATION_PROVIDER=openai` 기본)
- [ ] `TRANSLATION_PROVIDER=gemini` / `=anthropic` adapter 스켈레톤(미구현 상태여도 모듈 존재 확인, Phase 4 OQ-R17 후 본구현)
- [ ] Loops transactional 본인 이메일 수신 + §50 필드 (`(광고)` + unsubscribe + 발신자) 확인 (OQ-M6)
- [ ] Loops webhook `/api/webhooks/loops` 수신 + `last_active_at` 자동 갱신 확인
- [ ] Supabase Magic Link 로그인 + `admin_users` 화이트리스트 체크 + 미들웨어 보호 동작
- [ ] `/admin/dashboard` Vercel Analytics + Loops + Supabase 집계 카드 8개 렌더
- [ ] `monthly_budget_cap` 초과 시뮬레이션 skip 동작
- [ ] §16 NFR SLO 중 타임아웃·재시도·cost cap 환경변수화 완료

### Phase 5.5
- [ ] KAC/IIAC 계정·키 확보 + `/api/cron/ingest-flights` 구현
- [ ] 기종 필드 응답 확인 + 정적 `aircraft-types.ts` lookup 동작
- [ ] `aircraft_capacity` 2단계 Supabase 마이그레이션 + 30개 시드
- [ ] `/api/capacity-feedback` + `/api/employers/inquiry` + rate limit + honeypot
- [ ] UBIKAIS/FR24 딥링크 유틸 + `/flights` 화면 배포

---

## Changelog

- **2026-04-11 (v0.3)**: **Cargo Pivot 전면 재작성**. 네이버 뉴스 14개 카고 키워드 + exclude list (승무원·조종사·정비). 해외 RSS 교체 (Simple Flying → Loadstar·Air Cargo News UK·FlightGlobal Cargo). GPT-4o-mini 프롬프트 카고 전문 용어 괄호 병기 + temperature 0.2 + 환각 탐지 로직. 워크넷/사람인 10개 카고 키워드 + 카고 보너스 (+0.5). 운항 API KAC/IIAC → Phase 5.5로 이동 (§10). Phase 5.5 신규 API: `/api/capacity-feedback`·`/api/employers/inquiry`. Supabase Magic Link `/admin/*` 인증 (§9). Vercel Analytics API `/admin/dashboard` 통합 (§8). cron 시간 출퇴근 맞춤 재배치 (KST 06:00/18:00). ADR-008 교차 참조.
- 2026-04-11 (v0.2): NFR/SLO §15 신규, cost cap·RTO/RPO, ADR-001/002/005/007 교차참조.
- 2026-04-11 (v0.1): 최초 작성. D6 하이브리드 크론, KAC+IIAC, 워크넷+사람인, GPT-4o-mini, Loops.so transactional.
