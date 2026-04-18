# PRD 05 — Email Growth Loop + Admin Dashboard · 아름 카고 v0.3

> 첫 방문자 → 구독자 → **WAU (Weekly Active Subscribers)** 로 이어지는 Growth Loop + 관리자 대시보드.
> 앵커: [00-overview.md](./00-overview.md) · API: [04-api-integration.md](./04-api-integration.md) · 데이터: [03-data-model.md](./03-data-model.md) · 원천: [16-vps.md](../references/16-vps.md)

**버전**: v0.3 · **관련 ADR**: [ADR-008 Cargo Pivot](../adr/ADR-008-pivot-to-cargo-first.md), [ADR-001 Loops](../adr/ADR-001-email-service-loops-over-resend.md), [ADR-003 Auth 무인증](../adr/ADR-003-no-auth-mvp-email-token-only.md), [ADR-005 Cron 하이브리드](../adr/ADR-005-cron-hybrid-vercel-github.md)

---

## 0. v0.3 요약 (Cargo Pivot)

- **North Star 재정의**: "100 verified subscribers / 90일" → **WAU (Weekly Active Subscribers)**. Phase 5 말 500 WAU 목표. [16-vps.md §3](../references/16-vps.md) 일치.
- **관심 태그 카테고리 재정의**: 승무원·조종사·정비 제거 → `news_category` enum 6종 (cargo-market·cargo-ops·cargo-company·cargo-policy·airport-cargo·big-aviation).
- **User Story 교체**: C1 김지원 승무원 → **C1 이지훈 3년차 콘솔사**. C2 박서연 · C3 김태영 추가.
- **발송 시각 조정**: 07:00 KST 유지 (C1 출근길 지하철 7:00 앵커 JTBD와 일치).
- **다이제스트 구성**: 뉴스 **4~5개 + 에디터 Pick 뱃지** + 카고 채용 3개. 내부 에디터 Pick 필수 비율 60%+.
- **§9 관리자 대시보드 신규**: shadcn/ui charts 기반 `/admin/dashboard`, 8개 KPI 카드, ⓘ 툴팁 근거·출처. (2026-04-18 Tremor → shadcn 단일화 반영)
- **Supabase Magic Link 추가**: `/admin/*` 로그인 + `admin_users` 화이트리스트 ([04 PRD §9](./04-api-integration.md)).
- **도메인**: MVP `arumcargo.vercel.app`. 커스텀 도메인은 500 WAU 돌파 후 검토.
- **Loops 발신**: `loops.email` 기본 (자체 도메인 불필요).

---

## 1. 담당 Pain & 개선 목표

VPS §1 원천. 이 PRD는 **WAU North Star에 직접 책임**진다.

| Pain | 설명 | 실패 KPI (현행) | **개선 목표** | 담당 기능 |
|---|---|---|---|---|
| **P01** | 화물 뉴스 파편 (매일 돌아올 이유) | 7일 리텐션 < 15% | **4주 활성 유지율 ≥ 40%** (Reforge PMF 기준) | §5 다이제스트 + §6 WAU 추적 |
| **P04** | 지인 추천 의존·공유 채널 부재 | 구직자 정보 비대칭 | **공유 루프 기반 자연 유입** | §8 공유 루프 + `referrer_subscriber_id` |

**핵심 가설**: 뉴스·채용 카드가 외부 링크로만 끝나면 아름 카고를 즐겨찾기할 이유가 없다. **매일 아침 07:00 KST 카고 다이제스트 + 에디터 Pick**이 "돌아올 이유"를 만든다. 에디터 Pick이 있으면 팩트만 전달하는 카고프레스/Loadstar와 구분된다. [16-vps.md §4 Value Loop](../references/16-vps.md).

---

## 2. User Stories + Given-When-Then AC

JTBD: [16-vps.md §2](../references/16-vps.md) J-01 (C1 앵커), J-02 (C2), J-03 (C3).

### US-E1 (C1 이지훈 — 3년차 콘솔사 영업, J-01 앵커) ★ Primary

> "출근길 지하철 07:00. 아름 카고 이메일 하나만 열면 오늘 카고 뉴스 4~5장 + 내 직군 채용 공고 3건 한눈에 본다. 에디터 Pick 한 줄만 있어도 '아 이거 우리 쪽에 영향 있겠네' 감이 온다. 수신거부는 원클릭이어야 마음 편히 구독한다."

| # | 상태 | Given | When | Then |
|---|---|---|---|---|
| E1-1 | ✅ | 구독 폼에 이메일 + 관심 카테고리 `['cargo-market','cargo-company']` + 필수 체크 2종 ✓ | `POST /api/subscribe` | 201, `subscribers.status='pending'`, `consented_at/ip/user_agent` 기록, Loops `tpl-verify` 발송 |
| E1-2 | ✅ | 인증 메일 버튼 클릭 | `/subscribe/verify?token=...` | `status='verified'`, `verified_at`, Loops contact verified=true, `/news` 리다이렉트 |
| E1-3 | ✅ | 07:00 KST, verified 구독자 ≥ 1명, 금일 승인 뉴스 ≥ 4건 (Pick 포함) | Vercel Cron 트리거 | 60초 이내 `tpl-daily-digest` 전송, `daily_digests.status='sent'`, 제목 `(광고)` 접두 |
| E1-4 | ✅ | C1이 다이제스트 이메일 열람 | Loops webhook `opened` 도착 | `email_events` 저장 + `subscribers.last_active_at` 자동 갱신 → WAU 집계 반영 |
| E1-5 | ✅ | C1이 다이제스트 내 에디터 Pick 카드 클릭 | `/api/news/click/[id]` beacon | `news_clicks` 삽입, 외부 원문 이동, `last_active_at` 갱신 |
| E1-F1 | ❌ | 동일 이메일 중복 POST | 2번째 호출 | 409 + "이미 구독 중입니다" + pending 재발송 허용 (최대 3회/h) |
| E1-F2 | ❌ | 필수 체크박스 미체크 | submit | 클라이언트 차단 + 서버 zod 400 |
| E1-F3 | ❌ | Loops API 5xx | subscribe 중 | 트랜잭션 롤백, 사용자에게 "잠시 후 다시 시도" |
| E1-F4 | ❌ | `verification_token` 24h 만료 | 링크 클릭 | 410 + "인증 링크 만료, 재발송하기" CTA |
| E1-F5 | ❌ | 다이제스트 Loops 개별 전송 실패 | 한 구독자 send | `email_events.event_type='send_failed'`, 다음 배치 재시도, 전체 cron `partial` |

### US-E2 (C2 박서연 — 1년차 신입, J-02)

> "카고 전반을 넓게 보고 싶어서 카테고리는 전부 선택한다. 용어가 많은데 다이제스트 HTML에서 용어집 링크가 바로 연결되면 좋겠다."

| # | 상태 | Given | When | Then |
|---|---|---|---|---|
| E2-1 | ✅ | 관심 카테고리 `[]` (빈 상태 또는 전체 선택) | 다이제스트 생성 | 최신순 뉴스 4~5건 (카테고리 quota 반영) + 신뢰도 DESC 채용 3건 |
| E2-2 | ✅ | 본문에 `AWB`·`ULD`·`TAC Index` 등장 | HTML 렌더 | 용어 자동 하이라이트 + `{glossaryUrl}#awb` 딥링크 |
| E2-3 | ✅ | 수신거부 후 `settings_token` URL 재진입 | 재구독 | 재구독 확인 플로우 + `status='verified'` 복원, `unsubscribed_at` 유지 |
| E2-F1 | ❌ | 관심 카테고리에 해당하는 뉴스 0건 | 다이제스트 생성 | 해당 구독자 skip + 주 1회 "카테고리 확장 안내" 메일로 보정 |
| E2-F2 | ❌ | `settings_token` 분당 10회 이상 | Rate limiter | 429 + Retry-After |
| E2-F3 | ❌ | 야간(21~08시) 수동 트리거 | `daily-digest` 호출 | 야간 감지 → 403 거부 (cron 외 수동 금지) |

### US-E3 (C3 김태영 — 8년차 포워더 팀장, J-03)

> "나는 큰 흐름만 보면 된다. 주 3~4회만 오픈해도 북마크 가치 있다. 관리자 모니터링이나 에디터 Pick 작성자가 감 잡을 수 있게 '팀장들이 안 여는 주' 같은 걸 스스로 관찰할 수 있으면 좋겠다 (익명 통계 수준)."

| # | 상태 | Given | When | Then |
|---|---|---|---|---|
| E3-1 | ✅ | C3 주 3회 오픈 | Loops webhook | 주간 WAU 집계에 포함 (주 1회 이상 활동 = 활성) |
| E3-2 | ✅ | 4주 유지율 집계 | 관리자 대시보드 Supporting KPI #4 | Reforge 40% PMF 기준선 자동 표시, C3 포함 코호트 시각화 |
| E3-F1 | ❌ | 2주 연속 미오픈 | 휴면 감지 | 3주차 재참여 메일 1회 발송 후 추가 재시도 금지 (스팸 회피) |

---

## 3. 더블 옵트인 플로우 (한국 정보통신망법 §50)

### 3.1 단계

```
[랜딩 Hero 또는 /news 하단]
   │
   ▼
 ┌──────────────────────────────────────┐
 │  📧 이메일 입력: [_______________]      │
 │  어떤 소식 받고 싶으세요? (다중 선택):    │
 │   ☐ 시장·요율 (TAC Index·BAI)          │
 │   ☐ 운영 (창고·ULD·오퍼)                │
 │   ☐ 기업 (대한항공카고·포워더)           │
 │   ☐ 정책·규제                           │
 │   ☐ 공항 화물 터미널                    │
 │   ☐ 항공 일반 (큰 뉴스 30%)             │
 │                                         │
 │  ☑ (필수) 개인정보 수집·이용 동의       │
 │  ☑ (필수) 광고성 정보 수신 동의          │
 │                                         │
 │  [구독 신청] 버튼                        │
 └──────────────────────────────────────┘
   │ POST /api/subscribe
   ▼
[Supabase INSERT subscribers status='pending',
   consented_at=now(), consent_ip, consent_user_agent]
   │
   ▼
[Loops Transactional: tpl-verify 발송]
   │
   ▼
 ┌──────────────────────────────────────┐
 │  (받은편지함)                            │
 │  제목: [아름 카고] 이메일 인증 요청       │
 │  본문: [버튼] 구독 확인하기               │
 └──────────────────────────────────────┘
   │ 버튼 클릭
   ▼
[GET /subscribe/verify?token=...]
   │
   ▼
[Supabase UPDATE status='verified', verified_at=now()]
[Loops UPDATE contact verified=true]
   │
   ▼
[/subscribe/verify 완료 페이지 → /news 이동]
```

### 3.2 법적 체크리스트 ([CLAUDE.md §5.2](../../CLAUDE.md))

- [x] **더블 옵트인 (인증 메일 클릭 후 수신)** — §3.1
- [x] **수신 동의 시각·IP·User-Agent 기록** — `subscribers.consented_at/ip/user_agent`
- [x] **제목 `(광고)` 표기** — §5.3
- [x] **원클릭 수신거부 링크** — §7
- [x] **발신자 정보 (아름 카고 + 연락 이메일 + 주소)** — 이메일 footer 고정
- [x] **야간(21~08시) 발송 회피** — 07:00 KST 고정
- [x] `/privacy`, `/terms` 페이지 링크 — 구독 폼·이메일 footer
- [ ] **(OQ-M6 검증 필요)** Loops가 위 요구사항을 모두 지원하는지 Phase 5 진입 전 확인. 실패 시 Phase 6 Resend + 자체 도메인 폴백.

---

## 4. Loops.so 이메일 엔진 (MVP)

### 4.1 왜 Loops인가 ([99-advisor-notes.md 2026-04-11](../references/99-advisor-notes.md), ADR-001)

- **무료 2,000 contacts**, 자체 도메인 인증 불필요 (`loops.email` 기본 발신)
- Transactional 템플릿 변수 `{{subject}}`·`{{newsHtml}}` 등 동적 삽입
- 분석 대시보드 (오픈률·CTR·unsubscribe) 기본 제공
- **API Webhook** — `delivered`·`opened`·`clicked`·`bounced`·`unsubscribed` 수신 → WAU 자동 갱신

### 4.2 Transactional 템플릿 4종 (v0.3)

| ID | 용도 | 언제 발송 |
|---|---|---|
| `tpl-verify` | 구독 인증 | `/api/subscribe` POST 직후 |
| `tpl-daily-digest` | 일일 카고 다이제스트 | Vercel Cron 07:00 KST |
| `tpl-unsubscribe-confirmation` | 수신거부 완료 | 원클릭 수신거부 후 |
| `tpl-admin-alert` (v0.3 신규) | 관리자 알림 | employer_inquiries / capacity_feedback / 예산 초과 / ingest 실패 |

### 4.3 동적 변수 (tpl-daily-digest, v0.3)

```json
{
  "email": "user@example.com",
  "transactionalId": "tpl-daily-digest",
  "dataVariables": {
    "subject": "(광고) [아름 카고] 2026-04-12 카고 뉴스 5건 + 채용 3건",
    "userGreeting": "오늘의 카고 소식이에요",
    "date": "2026년 4월 12일 (토)",
    "newsCount": 5,
    "newsHtml": "<ul>...Pick 포함 카드 HTML...</ul>",
    "jobCount": 3,
    "jobsHtml": "<ul>...카고 직군 카드 HTML...</ul>",
    "pickCount": 4,
    "glossaryUrl": "https://arumcargo.vercel.app/glossary",
    "settingsUrl": "https://arumcargo.vercel.app/subscribe/settings/{token}",
    "unsubscribeUrl": "https://arumcargo.vercel.app/unsubscribe/{token}",
    "senderInfo": "아름 카고 (Arum Cargo) · contact@arumcargo (MVP, 도메인 확보 후 갱신)"
  }
}
```

### 4.4 Loops 템플릿 본문 구조 (대략)

```html
Subject: {{subject}}

<body>
  <h1>{{date}} 카고 다이제스트</h1>
  <p>{{userGreeting}}.</p>

  <h2>📰 오늘의 카고 뉴스 {{newsCount}}건 ({{pickCount}}건은 에디터 Pick 포함)</h2>
  {{newsHtml}}

  <h2>💼 카고 채용 {{jobCount}}건</h2>
  {{jobsHtml}}

  <hr>
  <p style="font-size: 12px; color: #666;">
    항공 화물 용어가 궁금하세요? <a href="{{glossaryUrl}}">카고 용어집 보기</a><br>
    본 메일은 수신 동의하신 분께만 발송되며, 언제든
    <a href="{{unsubscribeUrl}}">원클릭 수신거부</a>하실 수 있습니다.<br>
    수신 설정 변경: <a href="{{settingsUrl}}">관심 카테고리 수정</a><br>
    {{senderInfo}}
  </p>
</body>
```

**Voice Guide** (카고 이지훈 기준): "종합" "정리" "총망라" 금지. 대신 "오늘의 카고 소식이에요" "이거 체크" "지금" 같은 구체 톤. [16-vps.md §6 Differential Voice](../references/16-vps.md) 일치.

### 4.5 뉴스 카드 HTML 빌더 (에디터 Pick 포함)

```ts
// web/src/lib/email/build-news-card.ts
export function buildNewsCardHtml(article: NewsArticle): string {
  const pickBlock = article.editor_pick ? `
    <div style="border-left: 3px solid #0ea5e9; padding: 8px 12px; margin: 8px 0; background: #f0f9ff; font-size: 13px;">
      <strong>✏️ 에디터 Pick</strong>
      <span style="color: #64748b; font-size: 11px;"> · ${toneLabel(article.editor_pick_tone)}</span>
      <p style="margin: 4px 0 0 0;">${escapeHtml(article.editor_pick)}</p>
    </div>
  ` : '';

  return `
    <li style="list-style: none; margin-bottom: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px;">
      <div style="font-size: 11px; color: #64748b;">
        ${categoryLabel(article.category)} · ${article.source_name}
      </div>
      <a href="${clickTrackingUrl(article.id)}" style="font-size: 16px; font-weight: 600; color: #0f172a;">
        ${escapeHtml(article.title)}
      </a>
      <p style="color: #334155; margin: 6px 0;">${escapeHtml(article.summary)}</p>
      ${pickBlock}
    </li>
  `;
}
```

---

## 5. 일일 다이제스트 파이프라인

### 5.1 스케줄

- **발송 시각**: 매일 07:00 KST = UTC 22:00 (전날)
- **호스팅**: Vercel Cron (`vercel.json`)
- **경로**: `/api/cron/daily-digest`

### 5.2 내부 로직 (pseudocode, v0.3)

```ts
// web/src/app/api/cron/daily-digest/route.ts
export async function POST(req: Request) {
  // 1. CRON_SECRET 검증
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  // 2. 야간 발송 회피 (07:00 KST 외 차단)
  const nowKST = toKST(new Date());
  if (nowKST.getHours() < 6 || nowKST.getHours() > 10) {
    return new Response('Out of window', { status: 403 });
  }

  // 3. ingest_logs 시작
  const logId = await startLog('daily-digest');

  // 4. 오늘 발송할 카고 뉴스·채용 선정
  const newsArticles = await supabase
    .from('news_articles')
    .select('*')
    .eq('is_published', true)
    .gte('collected_at', startOfYesterdayKST())
    .order('published_at', { ascending: false })
    .limit(10);

  // 에디터 Pick 비율 체크 (목표 60%+)
  const pickCount = newsArticles.data!.filter(n => n.editor_pick).length;
  if (pickCount / newsArticles.data!.length < 0.4) {
    await logWarning('low_pick_ratio', pickCount, newsArticles.data!.length);
  }

  const jobPosts = await supabase
    .from('job_posts')
    .select('*')
    .eq('status', 'approved')
    .or('deadline.is.null,deadline.gt.now()')
    .order('source_trust_score', { ascending: false })
    .order('posted_at', { ascending: false })
    .limit(20);

  // 5. daily_digests idempotent upsert
  const digest = await supabase.from('daily_digests').upsert({
    digest_date: todayKST(),
    news_article_ids: newsArticles.data!.map(n => n.id),
    job_post_ids: jobPosts.data!.map(j => j.id),
    editor_pick_count: pickCount,
    status: 'pending'
  }).select().single();

  // 6. 대상 구독자 조회
  const subscribers = await supabase
    .from('subscribers')
    .select('*')
    .eq('status', 'verified');

  // 7. 구독자별 카테고리 매칭 + Loops transactional
  let successCount = 0;
  for (const sub of subscribers.data!) {
    const matched = filterByCategories(newsArticles.data!, jobPosts.data!, sub.interest_categories);
    if (matched.news.length === 0 && matched.jobs.length === 0) continue;

    try {
      await loopsClient.sendTransactional({
        email: sub.email,
        transactionalId: 'tpl-daily-digest',
        dataVariables: buildDataVariables(sub, matched, digest!.id)
      });
      successCount++;
      await sleep(150);  // Loops rate limit 10 req/s
    } catch (err) {
      await supabase.from('email_events').insert({
        subscriber_email: sub.email,
        event_type: 'send_failed',
        metadata: { error: (err as Error).message, digest_id: digest!.id },
        occurred_at: new Date().toISOString()
      });
    }
  }

  // 8. daily_digests 완료
  await supabase.from('daily_digests')
    .update({ status: 'sent', sent_at: new Date(), recipients_count: successCount })
    .eq('id', digest!.id);

  // 9. ingest_logs 완료
  await finishLog(logId, 'success', { recipients_count: successCount });

  return Response.json({ ok: true, recipients: successCount });
}
```

### 5.3 Idempotency

- `daily_digests.digest_date` unique 제약 → 같은 날 두 번 호출돼도 새 레코드 생성 안 됨
- 각 구독자에게 1회만 발송 (`email_events.event_type='delivered'` 확인)
- Vercel Cron 재시도 시 이미 `sent` 상태면 skip

---

## 6. 카테고리 세그먼트 (개인화, v0.3)

### 6.1 매칭 규칙

```ts
function filterByCategories(
  news: NewsArticle[],
  jobs: JobPost[],
  userCats: NewsCategory[]
) {
  // 빈 상태 → 전체 최신순, 카테고리 quota 반영
  if (userCats.length === 0) {
    return {
      news: balanceByQuota(news, QUOTA_DEFAULT).slice(0, 5),
      jobs: jobs.slice(0, 3)
    };
  }

  const matchedNews = news
    .filter(n => userCats.includes(n.category))
    .slice(0, 5);

  // 채용은 카테고리 무관 (카고 직군 전체). 상위 3건.
  const matchedJobs = jobs.slice(0, 3);

  return { news: matchedNews, jobs: matchedJobs };
}

const QUOTA_DEFAULT = {
  'cargo-market': 0.25,
  'cargo-ops': 0.20,
  'cargo-company': 0.15,
  'cargo-policy': 0.10,
  'airport-cargo': 0.10,
  'big-aviation': 0.20,  // 빈 선택 시 살짝 줄임 (25 → 20)
};
```

### 6.2 Fallback

- 매칭 결과 뉴스 0 + 채용 0 → 해당 구독자 skip (스팸성 회피)
- 뉴스만 있으면 뉴스만, 채용 섹션 숨김 (템플릿 조건부)

---

## 7. 수신거부 플로우 (원클릭)

### 7.1 URL

```
https://arumcargo.vercel.app/unsubscribe/{settings_token}
```

### 7.2 동작

```ts
// app/unsubscribe/[token]/page.tsx
export default async function UnsubscribePage({ params }) {
  const { data: sub } = await supabaseServer
    .from('subscribers')
    .update({
      status: 'unsubscribed',
      unsubscribed_at: new Date().toISOString()
    })
    .eq('settings_token', params.token)
    .select()
    .single();

  if (sub) {
    await loopsClient.updateContact({ email: sub.email, subscribed: false });
    await supabase.from('subscription_events').insert({
      subscriber_id: sub.id,
      event_type: 'unsubscribe'
    });
  }

  return <UnsubscribeConfirmation success={!!sub} />;
}
```

### 7.3 원칙

- **1클릭 = 완료**. 추가 확인 페이지·로그인 없음.
- 재구독 링크를 동일 페이지에 제공 (실수 복구)
- `settings_token`은 수신거부 후에도 유효 유지 (재구독 가능)

---

## 8. 공유 루프 (v0.3 신규, P04 해결 보조)

### 8.1 구조

```
C1 이지훈 → 다이제스트 열람 → "이거 지인에게 공유할래" 버튼 클릭
          → /share/{article_id}?ref={subscriber_id}
          → 공유 받은 사람이 /subscribe 진입 시 referrer 자동 세팅
          → subscribers.referrer_subscriber_id = 이지훈
          → 관리자 대시보드 "추천 TOP 구독자" 집계
```

### 8.2 구현

- `/share/[id]?ref=...` 라우트: meta OG 카드 (제목 + 에디터 Pick + 출처) + 구독 CTA
- `POST /api/subscribe` body에 `referrer_token` (선택). DB에 FK로 저장.
- 관리자 대시보드: "상위 추천자 5명" 카드 (Phase 5 Should)

### 8.3 주의

- 리워드·포인트 없음 (v0.3 수익화 축 제거)
- 추천인 표기는 익명 통계용. 추천받은 사람에게 "누가 추천했다"를 노출하지 않음 (프라이버시)

---

## 9. 관리자 대시보드 `/admin/dashboard` (v0.3 신규)

**핵심**: shadcn/ui charts 기반 8개 KPI 카드 + ⓘ 근거/출처 툴팁. North Star WAU + Supporting 7개. 접근은 Supabase Magic Link + `admin_users` 화이트리스트 ([04 PRD §9](./04-api-integration.md)).

### 9.1 레이아웃 (Tailwind Grid + shadcn Chart)

```
/admin/dashboard
┌────────────────────────────────────────────────────────────┐
│  아름 카고 대시보드                   [07:03 KST · 금일]      │
├─────────────┬─────────────┬─────────────┬─────────────────┤
│ WAU ⓘ       │ MUV ⓘ       │ 유입 경로 ⓘ │ 신규 구독자 ⓘ    │
│ 432         │ 1,208       │ 파이 차트    │ +28 (주)         │
│ ▲ +12 WoW   │ ▲ +4% WoW   │             │ 스파크라인        │
├─────────────┼─────────────┼─────────────┼─────────────────┤
│ 4주 유지율ⓘ │ Open/CTRⓘ  │ 승인 공고ⓘ  │ Employers 문의ⓘ │
│ 38%         │ 42% / 9%    │ +12 (주)    │ 3 (누적 7)       │
│ PMF 기준 40%│ Loops 제공   │             │ Phase 5.5에만 노출│
└─────────────┴─────────────┴─────────────┴─────────────────┘
```

### 9.2 8개 KPI 카드 상세

| # | 카드 | 지표 정의 | 데이터 소스 | ⓘ 툴팁 내용 |
|---|---|---|---|---|
| 1 | **WAU** (Primary) | 지난 7일 내 `email_events.event_type in ('opened','clicked')` 또는 사이트 재방문(세션) 있는 verified 구독자 수 | Supabase `subscribers.last_active_at >= now() - 7d` | "Weekly Active Subscribers · 아름 카고 North Star. 출처: Amplitude NSM Playbook (John Cutler 2019) · Reforge Growth Series · Morning Brew Axios 2020" |
| 2 | **MUV** | 월간 고유 방문자 (30일) | Vercel Analytics | "Monthly Unique Visitors · 노출량 측정. 출처: Vercel Analytics 기본 지표" |
| 3 | **유입 경로 분포** | organic / direct / referral / social 4구간 | Vercel Analytics `referrer` 집계 | "Acquisition channel mix · 채널 효과성. 카고 카페·LinkedIn 그룹·SEO 비중 모니터링" |
| 4 | **주간 신규 구독자** | `subscribers where created_at >= now() - 7d and status='verified'` | Supabase | "Weekly net new verified · 성장 속도" |
| 5 | **4주 유지율** | 4주 전 가입 코호트 중 지난주 활성 비율 | Supabase cohort 쿼리 | "4-week retention · Reforge PMF 기준선 40%. 출처: Reforge Growth Series (Brian Balfour)" |
| 6 | **Open / CTR** | 다이제스트 Open rate · Click Through Rate | Loops.so API `/events` 집계 | "이메일 참여도. Loops 대시보드 연동" |
| 7 | **주간 승인 공고** | `job_posts where status='approved' and reviewed_at >= now() - 7d` | Supabase | "공급 측 건강도 · 주당 최소 15건 목표" |
| 8 | **Employers 문의** | `employer_inquiries` 주간/누적 (Phase 5.5부터) | Supabase | "양면 시장 활성화. Phase 5.5 이후 노출" |

### 9.3 UI 원칙

- **shadcn/ui charts (Recharts 래퍼) 단일 사용**. Tremor 도입 취소 (2026-04-18 SRS C-TEC-006 반영 — 8 카드 규모에 별도 대시보드 라이브러리 ROI 낮음, 번들·토큰 일관성 확보).
- 각 카드 우상단 `ⓘ` 아이콘 → hover → shadcn `<Popover>` 툴팁 (모바일은 tap)
- 본문: 큰 숫자 + 전주 대비 변화 화살표 (▲ +12 WoW)
- 하단: 7일 스파크라인 (SparkAreaChart)
- 색상: 네이비·블루·스카이. 유입 경로만 파이.

### 9.4 데이터 집계 엔드포인트

```
GET /api/admin/metrics?range=7d
  헤더: Supabase Auth 세션 (admin_users 화이트리스트 통과)
  응답: {
    wau: number,
    wau_prev: number,
    muv: number,
    muv_prev: number,
    acquisition: { organic, direct, referral, social },
    new_subscribers_week: number,
    retention_4w: number,
    email_open_rate: number,
    email_ctr: number,
    approved_jobs_week: number,
    employer_inquiries_week: number,
    employer_inquiries_total: number,
  }
```

내부에서 Supabase + Loops API + Vercel Analytics 3개 소스 집계.
`unstable_cache` 5분 + ISR `revalidate=300`.

### 9.5 Phase 5.5 추가 카드

- 9번 카드: **Capacity Feedback** (주간 신규 제보)
- 10번 카드: **Flight Snapshot 신선도** (마지막 업데이트 시각)
- 11번 카드: **Aircraft Types Coverage** (db seed 커버리지 %)

---

## 10. 설정 관리 페이지 `/subscribe/settings/[token]`

D4: Auth 없음 → settings_token 기반.

### 10.1 접근

- 다이제스트 footer `{{settingsUrl}}` 클릭
- 토큰 유효 → 본인 설정 화면, 무효 → 404

### 10.2 수정 가능 항목

- 이메일 주소 변경 (변경 시 재인증)
- 관심 카테고리 다중 선택/해제 (v0.3 카고 6종)
- 수신거부

### 10.3 보안

- `settings_token`: 32 byte 랜덤 hex (64자)
- 한 사람당 1개 고정. 토큰 재발급은 Phase 6
- Rate limit: 분당 10회 초과 시 429

---

## 11. Growth 지표 (KPI)

| 지표 | 목표 | 측정 |
|---|---|---|
| 폼 제출 → verified 전환율 | **≥ 60%** | Supabase status funnel |
| 오픈률 (delivered → opened) | **≥ 35%** | Loops |
| CTR (opened → clicked) | **≥ 8%** | Loops |
| 수신거부율 (delivered → unsubscribed) | **≤ 2%** | Loops + Supabase |
| 발송 성공률 | **≥ 98%** | `email_events` |
| 카테고리 다중 선택률 | **≥ 70%** | 평균 선택 수 ≥ 2 |
| **WAU** (North Star) | Phase 5 말 **500** | Supabase `last_active_at` |
| **4주 활성 유지율** | **≥ 40%** (Reforge PMF) | cohort 분석 |
| 공유 루프 전환 | `referrer_subscriber_id` not null / 전체 신규 | ≥ 15% (Phase 5 말) |

**벤치마크 주의**: 항공 화물 니치 B2C 이메일은 일반(오픈률 18%)보다 높은 35%+ 기대. Substack/Beehiiv 카고 뉴스레터 실측치 참고. [OQ-R2](../open-questions.md) 검증 필요.

---

## 12. 알려진 제약 · 위험

| 위험 | 완화 |
|---|---|
| Loops 무료 2,000 contacts 초과 | 1,800명 도달 시 관리자 알림 → 유료 전환 or Resend 폴백 |
| Loops 발신 도메인(loops.email) 스팸 필터 | 본인 주소로 테스트, 네이버·다음·gmail 수신 확인 |
| 다이제스트 매칭 0건 → 혼란 | skip + 주 1회 "카테고리 확장" 보정 |
| 스팸 신고 | 원클릭 수신거부 + 발신자 정보 명확 |
| Cron 중복 | `daily_digests.digest_date` unique |
| §50 위반 | OQ-M6 검증 + Phase 6 Resend 폴백 계획 |
| 에디터 Pick 작성 지연 | 60% 미만 시 `ingest_logs` warning + 대시보드 노출 |
| WAU 측정 오차 (Loops webhook 지연) | webhook 5분 지연 허용, daily cron에서 재집계 |
| 관리자 계정 탈취 | Magic Link 유효기간 짧게 (1h), 화이트리스트 엄격 |

---

## 13. MoSCoW 우선순위

| 분류 | 기능 | 근거 |
|---|---|---|
| **Must** | `/api/subscribe` 더블 옵트인 (zod + 동의 기록 + Loops verify) | §50 |
| **Must** | `/subscribe/verify?token` + 24h 만료 | E1-2/F4 |
| **Must** | `/unsubscribe/[token]` 1-click | §50 |
| **Must** | Loops `tpl-verify` + `tpl-daily-digest` + `tpl-unsubscribe-confirmation` | 발송 엔진 |
| **Must** | `tpl-admin-alert` (Phase 5 신규) | 관리자 운영 |
| **Must** | Vercel Cron `daily-digest` 07:00 KST + 야간 트리거 차단 | North Star |
| **Must** | idempotency (`daily_digests.digest_date unique`) | 중복 방지 |
| **Must** | `(광고)` 제목 + 발신자 footer | §50 |
| **Must** | `/privacy`, `/terms` 페이지 | 법적 필수 |
| **Must** | `/admin/dashboard` 8개 KPI 카드 (shadcn/ui charts) + ⓘ 툴팁 | v0.3 관리자 운영 |
| **Must** | Supabase Magic Link + `admin_users` 화이트리스트 | `/admin/*` 보호 |
| **Must** | Loops webhook `/api/webhooks/loops` → `last_active_at` 자동 갱신 | WAU 정확도 |
| **Must** | `news_category` 관심 카테고리 UI (카고 6종) | v0.3 카테고리 |
| **Should** | `/subscribe/settings/[token]` 카테고리 수정 | 개인화 ROI |
| **Should** | 공유 루프 `/share/[id]?ref=` | P04 자연 유입 |
| **Should** | 카테고리 매칭 skip + 주 1회 확장 안내 | E2-F1 |
| **Should** | 발송 배치 `sleep(150ms)` rate-limit | Loops 10 req/s |
| **Should** | 상위 추천자 5명 카드 (공유 루프) | 성장 인사이트 |
| **Should** | 에디터 Pick 작성률 실시간 경고 | 품질 유지 |
| **Could** | 재구독 플로우 (E2-3) | Phase 5 후반 |
| **Could** | 대시보드 11번 카드 (Phase 5.5 feedback) | Phase 5.5 |
| **Won't** | 유료 구독/프리미엄 티어 | v0.3 수익화 제거 |
| **Won't** | Loops 캠페인 빌더 | MVP transactional만 |
| **Won't** | 수신자 본인 프로필 (로그인) | ADR-003 |

---

## 14. NFR / SLO

| 영역 | 지표 | 목표 (SLO) | 측정 |
|---|---|---|---|
| **신뢰성** | `/api/subscribe` 성공률 | ≥ 99% | Vercel Analytics |
| 신뢰성 | 다이제스트 발송 성공률 | ≥ 98% | `email_events` |
| 신뢰성 | daily-digest cron 완료 시간 | ≤ 55 s | `ingest_logs` |
| **퍼널** | 폼 제출 → verified | ≥ 60% | Supabase funnel |
| 퍼널 | verified → 첫 다이제스트 수신 | ≥ 95% | `email_events` |
| 퍼널 | delivered → opened | ≥ 35% | Loops |
| 퍼널 | opened → clicked | ≥ 8% | Loops |
| 퍼널 | delivered → unsubscribed | ≤ 2% | Loops |
| **WAU** | 지난 7일 활성 구독자 수 | Phase 5 말 500 | Supabase `last_active_at` |
| WAU | 4주 유지율 | ≥ 40% | cohort 쿼리 |
| WAU | webhook 지연 | ≤ 5분 | Loops webhook 시각 − delivered 시각 |
| **법적** | `(광고)` 제목 누락 | 0건 | 템플릿 사전 검증 (CI) |
| 법적 | 수신거부 클릭 → 차단 | ≤ 10 s | `/unsubscribe` 응답 시간 |
| 법적 | 야간 발송 (21~08 KST) | 0건 | cron 스케줄 + 수동 트리거 차단 |
| 법적 | 수신 동의 증빙 보존 | ≥ 13개월 | `subscription_events` 삭제 금지 |
| **보안** | `settings_token` 분당 rate | ≤ 10 req/min | middleware |
| 보안 | `verification_token` 유효기간 | 24 h | DB check |
| 보안 | `/admin/*` 미인증 접근 | 0건 | middleware 로그 |
| 보안 | Magic Link 유효기간 | ≤ 1 h | Supabase Auth 설정 |
| **관리자 대시보드** | p95 응답 | ≤ 2 s | SSR + 5분 캐시 |
| 관리자 | 카드 데이터 신선도 | ≤ 5분 | ISR revalidate |
| **용량** | Loops contact 수 | ≤ 1,800 (2,000의 90%) | 주간 모니터링 |

---

## 15. Differential Value (수치)

| 차원 | 현행 (카고 업계 실제) | 아름 카고 목표 | 개선폭 |
|---|---|---|---|
| 카고 정보 수집 시간 / 1일 | 15~25분 (다채널 순회) | < 5분 (다이제스트 1통) | **≥ 75%** |
| 4주 유지율 | < 15% | ≥ 40% | **2.6배** |
| 월간 누락 체감 | 50%+ | ≤ 15% | **≥ 70% 감소** |
| 폼 → verified 전환 | 벤치 40~50% | ≥ 60% | **+15%p** |
| **현직자 voice 카드 비율** | **0%** (기존 매체 없음) | **≥ 60%** | **공백 100% → 60%+** |

---

## 16. Proof (실험 설계)

| 주장 | 실험 | 성공 기준 | 시점 |
|---|---|---|---|
| "다이제스트 → WAU 루프" | 첫 100명 30일 관찰 | WAU/verified ≥ 70% | Phase 5 첫 달 |
| "4주 유지율 ≥ 40%" | 4주 코호트 분석 | ≥ 40% | Phase 5 2개월 차 |
| "에디터 Pick → CTR ↑" (OQ-R16) | A/B 50/50, n≥100 | A 그룹 CTR +15%p | Phase 4 중반 |
| "수신거부율 ≤ 2%" | 30일 관찰 | unsub / delivered ≤ 2% | Phase 5 첫 달 |
| "전환율 ≥ 60%" | 첫 50명 pending→verified | ≥ 60% | Phase 5 |
| "공유 루프 ≥ 15%" | `referrer_subscriber_id` 분포 | ≥ 15% | Phase 5 말 |
| "§50 준수" (OQ-M6) | Loops 실발송 수동 감사 10항목 | 10/10 | Phase 5 진입 전 |
| "관리자 대시보드 운영 체감" | 사용자 본인 2주 사용 후 설문 | 긍정 | Phase 5 중반 |

---

## 17. DoD

- [ ] `/api/subscribe` POST + zod + Supabase INSERT + Loops `tpl-verify`
- [ ] `/subscribe/verify?token` GET + 24h 만료
- [ ] `/unsubscribe/[token]` 1-click
- [ ] `/subscribe/settings/[token]` (카고 카테고리 6종 수정)
- [ ] Loops 템플릿 4종 작성·검증 (`tpl-verify`, `tpl-daily-digest`, `tpl-unsubscribe-confirmation`, `tpl-admin-alert`)
- [ ] `vercel.json` daily-digest cron + 야간 차단 로직
- [ ] `/api/cron/daily-digest` + idempotency 테스트
- [ ] `/api/webhooks/loops` 수신 + `last_active_at` 자동 갱신
- [ ] `/privacy`, `/terms` 페이지
- [ ] OQ-M6 Loops §50 체크리스트 10/10 통과
- [ ] US-E1·E2·E3 AC 전체 통과 (본인 이메일 full loop 검증)
- [ ] **Supabase Magic Link + `admin_users` 화이트리스트 미들웨어 보호**
- [ ] **`/admin/dashboard` shadcn/ui charts 8개 KPI 카드 + ⓘ 툴팁 렌더**
- [ ] **`/api/admin/metrics` 집계 엔드포인트 + 3 소스(Supabase+Loops+Vercel Analytics) 결합**
- [ ] Phase 5 첫 구독자 5명 테스트 후 오픈률·CTR 관찰
- [ ] `referrer_subscriber_id` 공유 루프 기본 동작
- [ ] NFR SLO 신뢰성·퍼널·WAU·법적 최소 측정 파이프 구축
- [ ] ADR-001 / ADR-003 / ADR-005 / ADR-008 Verification 체크리스트 완료

---

## Changelog

- **2026-04-18 (v0.3.1 · SRS Rev 0.9.1 역반영)**: §9 관리자 대시보드 차트 라이브러리를 **Tremor → shadcn/ui charts (Recharts 래퍼) 단일화**. 8 카드 규모에 별도 Tremor 도입 ROI 낮음 + 번들·`arum.*` 토큰 일관성 확보. 근거: [SRS-001 Rev 0.9.1 C-TEC-006](../srs/SRS-001-arum-cargo.md). 이전 Changelog의 Tremor 표기는 역사적 기록으로 유지.
- **2026-04-11 (v0.3)**: **Cargo Pivot 전면 재작성**. North Star 100 verified → **WAU (Phase 5 말 500, 4주 유지율 ≥ 40% Reforge PMF)**. 관심 태그 승무원/조종사/정비 → `news_category` 카고 6종. User Story C1 김지원(승무원) → **C1 이지훈(3년차 콘솔사)** + C2 박서연 + C3 김태영. 발신자 "아름 카고 (Arum Cargo)" + `arumcargo.vercel.app`. Loops 템플릿에 에디터 Pick 렌더 블록 추가 (§4.5). 카테고리 매칭 + quota 기본 분포 (§6). **§8 공유 루프 신규** (P04 해결, `referrer_subscriber_id`). **§9 관리자 대시보드 `/admin/dashboard` 신규** (Tremor 8개 KPI 카드 + ⓘ 툴팁, Supabase Magic Link 보호). Loops webhook → `last_active_at` 자동 갱신 (WAU 정확도). `tpl-admin-alert` 템플릿 신규. ADR-008 교차 참조.
- 2026-04-11 (v0.2): VPS→PRD 강화. G/W/T AC 성공+실패, MoSCoW, NFR/SLO, Differential, Proof, ADR-001/003/005 교차참조.
- 2026-04-11 (v0.1): 최초 작성. Loops.so 중심, D1 07:00, D4 이메일 토큰, D6 Vercel Cron, §50 체크리스트, US-E1/E2 (C1·C3).
