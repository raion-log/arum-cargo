# PRD 03 — Data Model (Supabase) · 아름 카고 v0.3

> Supabase Postgres 스키마 명세. 모든 테이블·enum·RLS·인덱스를 여기서 단일 소스로 관리.
> 앵커: [00-overview.md](./00-overview.md) · A-Side: [01](./01-a-side-academy-career.md) · I-Side: [02](./02-i-side-information.md) · Email: [05](./05-email-growth-loop.md)

**버전**: v0.3 · **관련 ADR**: [ADR-008 Cargo Pivot](../adr/ADR-008-pivot-to-cargo-first.md), [ADR-003 Auth 무인증](../adr/ADR-003-no-auth-mvp-email-token-only.md), [ADR-004 하이브리드 큐레이션](../adr/ADR-004-hybrid-job-curation.md)

---

## 0. v0.3 요약 (Cargo Pivot)

- **카테고리 재정의**: `interest_tag` enum 승무원·조종사·지상직 제거 → 카고 카테고리 6종 (`cargo-market`·`cargo-ops`·`cargo-company`·`cargo-policy`·`airport-cargo`·`big-aviation`).
- **`job_category` 재정의**: 객실·조종·정비 제거 → 카고 직군 7종 (`sales`·`ops`·`customs`·`imex`·`intl_logistics`·`airport_ground`·`other_cargo`). [01 PRD §3.2](./01-a-side-academy-career.md) 일치.
- **`news_articles` 컬럼 추가**: `editor_pick` (P05 핵심 차별화), `editor_pick_tone`, `editor_pick_history`, `category` (enum), `editor_pick_at`.
- **신규 테이블 (Phase 5)**: `admin_users` (Magic Link whitelist), `news_clicks`, `job_clicks`.
- **신규 테이블 (Phase 5.5)**: `aircraft_capacity`, `capacity_feedback`, `employer_inquiries`. `flights_snapshots`는 Phase 5.5로 도입 이동.
- **시드 데이터 교체**: `airline_career_links` → `cargo_career_links` (대한항공카고·아시아나카고·판토스·CJ대한통운·한진·코스모항운·우정항공·트리플크라운·에어인천·세방·동방·스위스포트·KAS).
- **Glossary 시드**: 카고 전문 용어 50개 중심 (AWB·ULD·TAC Index·Freighter·Belly Cargo 등).

---

## 1. 원칙

1. **Auth 정책 (D4 + v0.3 확장)**. 일반 구독자는 계정 없음, 이메일 + settings_token 기반. **관리자(`/admin/*`)는 Phase 5 Supabase Magic Link + 이메일 화이트리스트**로 별도 인증.
2. **모든 테이블에 `created_at`·`updated_at` timestamptz 포함**. 기본값 `now()`.
3. **Primary key는 `uuid` + `gen_random_uuid()`**.
4. **Slug 필드는 nanoid 8자** (공개 URL용).
5. **RLS 기본 활성화**. anon 역할은 명시적으로 허용된 쿼리만.
6. **Service Role Key는 서버 사이드(API Route / GitHub Actions)에서만**. 클라이언트 노출 금지.
7. **모든 cargo 직군/카테고리 enum은 카고 전용**. 승무원·조종사·정비는 DB 레벨에서 불가능.

---

## 2. 테이블 개요

| 테이블 | 용도 | 도입 Phase | RLS anon | RLS service_role |
|---|---|---|---|---|
| `subscribers` | 이메일 구독자 | 5 | INSERT(구독 폼) | 전체 |
| `subscription_events` | 구독·수신거부·확인 로그 | 5 | 없음 | 전체 |
| `news_articles` | 카고 뉴스 카드 + 에디터 Pick | 5 | SELECT `where is_published=true` | 전체 |
| `news_clicks` | 뉴스 카드 클릭 추적 | 5 | INSERT (beacon) | 전체 |
| `job_posts` | 카고 채용 카드 | 5 | SELECT `where status='approved'` | 전체 |
| `job_clicks` | 채용 카드 클릭 추적 | 5 | INSERT (beacon) | 전체 |
| `cargo_career_links` | 카고 기업 공식 채용 딥링크 | 5 | SELECT `where is_active=true` | 전체 |
| `aviation_glossary` | 항공·카고 용어집 | 5 | SELECT 전체 | 전체 |
| `daily_digests` | 일일 다이제스트 이력 | 5 | 없음 | 전체 |
| `email_events` | Loops.so 웹훅 이벤트 로그 | 5 | 없음 | 전체 |
| `ingest_logs` | GitHub Actions / cron 실행 로그 | 5 | 없음 | 전체 |
| `admin_users` | `/admin/*` 화이트리스트 | 5 | 없음 | service_role 전용 |
| `flights_snapshots` | 운항 수집 스냅샷 | **5.5** | SELECT 최신만 | 전체 |
| `aircraft_capacity` | 기종 페이로드/ULD 매핑 | **5.5** | SELECT 전체 | 전체 |
| `capacity_feedback` | 기종 정보 제보 | **5.5** | INSERT (폼) | 전체 |
| `employer_inquiries` | 기업 `/employers` 문의 | **5.5** | INSERT (폼) | 전체 |

---

## 3. Enum 정의

```sql
-- ===== 구독 =====
create type subscription_status as enum (
  'pending',       -- 이메일 입력만, 인증 전
  'verified',      -- 인증 완료, 수신 중
  'unsubscribed',  -- 수신거부 후
  'bounced'        -- 반송 처리
);

-- ===== 뉴스 카테고리 (v0.3 재정의) =====
-- 승무원/조종사/정비 전면 제거. 카고 5종 + 큰 항공 1종.
create type news_category as enum (
  'cargo-market',      -- 시장·요율 (TAC Index·BAI 등)
  'cargo-ops',          -- 운영 (창고·그라운드·ULD 처리)
  'cargo-company',      -- 기업 동향 (대한항공카고·아시아나카고·포워더)
  'cargo-policy',       -- 정책·규제·관세·ICAO/IATA
  'airport-cargo',      -- 공항 화물 터미널·인프라
  'big-aviation'        -- 큰 항공 일반 뉴스 (30% 쿼터)
);

-- 에디터 Pick 톤 (v0.3 신규)
create type editor_pick_tone as enum (
  'OBSERVATION',   -- "이거 원래 이런 숫자 아니었는데"
  'ACTION_ITEM',   -- "이번 주 이거 체크해두는 게 좋음"
  'CONTEXT'        -- "왜 이 뉴스가 지금 터졌냐면"
);

-- ===== 채용 (v0.3 카고 직군 재정의) =====
create type job_status as enum (
  'pending',   -- 수집 직후, 공개 X
  'approved',  -- 관리자 승인, 공개 O
  'rejected',  -- 관리자 거부
  'archived'   -- 마감 7일 경과
);

-- 카고 직군 (v0.3)
create type cargo_job_category as enum (
  'sales',              -- 화물 영업
  'ops',                -- 화물 오퍼/운영
  'customs',            -- 통관
  'imex',               -- 수출입
  'intl_logistics',     -- 국제물류/포워딩
  'airport_ground',     -- 공항 상주/그라운드 핸들링
  'other_cargo'         -- 기타 화물 직군
);

create type employment_type as enum (
  'full_time',
  'contract',
  'intern',
  'temporary'
);

create type job_source_type as enum (
  'worknet',
  'saramin',
  'airline_cargo_official',  -- 대한항공카고·아시아나카고
  'forwarder_official',       -- 판토스·CJ·한진 등
  'consolidator_official',    -- 코스모항운·우정항공·트리플크라운
  'public_institution',
  'other'
);

-- ===== 뉴스 소스 =====
create type news_source_type as enum (
  'naver_news',
  'domestic_cargo_rss',   -- 카고프레스·CargoNews·Forwarder KR
  'overseas_cargo_rss',   -- Loadstar·Air Cargo News UK·FlightGlobal Cargo
  'manual'
);

-- ===== 운항 (Phase 5.5) =====
create type flight_status as enum (
  'scheduled',
  'departed',
  'arrived',
  'delayed',
  'cancelled',
  'diverted'
);

-- 기종 데크 타입 (Phase 5.5)
create type aircraft_deck_type as enum (
  'passenger',    -- 여객기 (belly cargo 가능)
  'freighter',    -- 화물기 (main deck)
  'combi'         -- 혼재
);

-- 기종 운송 성격 (Phase 5.5, 뱃지용)
create type aircraft_role as enum (
  'PAX',      -- 여객기
  'CGO',      -- 화물기
  'COMBI'     -- 혼재
);
```

---

## 4. 테이블 스키마 상세

### 4.1 `subscribers`

```sql
create table subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  status subscription_status not null default 'pending',

  -- 더블 옵트인 토큰 (24h)
  verification_token text unique,
  verification_sent_at timestamptz,
  verified_at timestamptz,

  -- 설정 관리 토큰 (D4 — Auth 없음 대체)
  settings_token text unique not null default encode(gen_random_bytes(32), 'hex'),

  -- 관심 카테고리 (v0.3 — news_category 다중)
  interest_categories news_category[] not null default '{}',

  -- 페르소나 셀프 라벨링 (선택, WAU 세그먼트용)
  persona_hint text,  -- 'C1' | 'C2' | 'C3' | 'A1' | 'B1' | null

  -- 활동 추적 (WAU North Star 계산용)
  last_active_at timestamptz,  -- 이메일 오픈 또는 사이트 재방문

  -- 법적 기록
  consented_at timestamptz,
  consent_ip inet,
  consent_user_agent text,

  -- 수신거부
  unsubscribed_at timestamptz,
  unsubscribe_reason text,

  -- 메타 (Acquisition 분석)
  source text,            -- 'organic' | 'cargo_cafe' | 'linkedin' | 'referral' | ...
  referrer_subscriber_id uuid references subscribers(id),  -- 공유 루프 (Phase 5 §5)

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_subscribers_status on subscribers(status);
create index idx_subscribers_verification_token on subscribers(verification_token) where verification_token is not null;
create index idx_subscribers_settings_token on subscribers(settings_token);
create index idx_subscribers_interest_categories on subscribers using gin(interest_categories);
create index idx_subscribers_last_active_at on subscribers(last_active_at desc) where status = 'verified';
create index idx_subscribers_created_at on subscribers(created_at desc);
```

**RLS**:
```sql
alter table subscribers enable row level security;

-- anon: INSERT만 (구독 폼)
create policy "anon can insert subscribers"
  on subscribers for insert to anon
  with check (true);

-- settings_token 조회는 API Route에서 service_role로만.
-- anon SELECT 정책 없음.
```

### 4.2 `subscription_events`

```sql
create table subscription_events (
  id uuid primary key default gen_random_uuid(),
  subscriber_id uuid not null references subscribers(id) on delete cascade,
  event_type text not null,  -- 'signup', 'verify', 'unsubscribe', 'resubscribe', 'bounce'
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index idx_subscription_events_subscriber on subscription_events(subscriber_id);
create index idx_subscription_events_type on subscription_events(event_type);
```

### 4.3 `news_articles` (v0.3 에디터 Pick 확장)

```sql
create table news_articles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,                    -- nanoid 8

  title text not null,
  summary text not null,                        -- 2~3문장 (50~500자)
  thumbnail_url text,
  source_name text not null,                    -- 'Loadstar' / '카고프레스' / ...
  source_url text not null,                     -- 원문 링크
  source_type news_source_type not null,

  -- v0.3: 카테고리 단일 + 보조 태그
  category news_category not null,              -- 단일
  tags text[] not null default '{}',            -- 보조 (e.g., 'TAC Index', '대한항공카고')

  -- ===== v0.3 에디터 Pick (P05) =====
  editor_pick text,                              -- 1~2 문장, 최대 140자. null = Pick 없음
  editor_pick_tone editor_pick_tone,             -- null 허용
  editor_pick_author text,                       -- 'admin' (Phase 5 단일)
  editor_pick_at timestamptz,                    -- Pick 작성 시점
  editor_pick_history jsonb not null default '[]',  -- 수정 이력 (배열)

  published_at timestamptz not null,            -- 원문 발행
  collected_at timestamptz not null default now(),

  -- 해외 뉴스 번역
  original_language text not null default 'ko',  -- 'ko' | 'en' | ...
  is_translated boolean not null default false,

  -- 공개 제어
  is_published boolean not null default false,  -- v0.3: 기본 false (관리자 승인 후 true)
  published_by text,                              -- 'admin'
  click_count integer not null default 0,

  -- dedupe
  dedupe_hash text unique not null,              -- sha256(source_name + title + published_at)

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_news_articles_published_at on news_articles(published_at desc);
create index idx_news_articles_category on news_articles(category);
create index idx_news_articles_tags on news_articles using gin(tags);
create index idx_news_articles_is_published on news_articles(is_published, published_at desc) where is_published = true;
create index idx_news_articles_pending_review on news_articles(collected_at desc) where is_published = false;
create index idx_news_articles_has_pick on news_articles(editor_pick_at desc) where editor_pick is not null;
```

**RLS**:
```sql
alter table news_articles enable row level security;
create policy "anon can read published news"
  on news_articles for select to anon
  using (is_published = true);
```

**제약**:
```sql
-- 에디터 Pick 길이 제한
alter table news_articles
  add constraint chk_editor_pick_length
  check (editor_pick is null or char_length(editor_pick) <= 140);

-- summary 길이
alter table news_articles
  add constraint chk_summary_length
  check (char_length(summary) between 20 and 500);
```

### 4.4 `news_clicks` (v0.3 신규)

```sql
create table news_clicks (
  id uuid primary key default gen_random_uuid(),
  news_article_id uuid not null references news_articles(id) on delete cascade,
  subscriber_id uuid references subscribers(id) on delete set null,
  session_id text,                            -- 익명 쿠키
  referrer text,                                -- 'email_digest' | 'web' | 'share_link'
  user_agent text,
  created_at timestamptz not null default now()
);

create index idx_news_clicks_article on news_clicks(news_article_id);
create index idx_news_clicks_subscriber on news_clicks(subscriber_id);
create index idx_news_clicks_created on news_clicks(created_at desc);

alter table news_clicks enable row level security;
create policy "anon can insert clicks"
  on news_clicks for insert to anon with check (true);
```

### 4.5 `job_posts` (v0.3 카고 직군)

```sql
create table job_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,

  company_name text not null,
  company_logo_url text,
  title text not null,
  description_summary text,                     -- 2~3문장
  industry text not null default 'Air Cargo / Logistics',

  cargo_category cargo_job_category not null,   -- v0.3: 카고 직군 enum
  location text,
  employment_type employment_type,
  years_experience_min smallint,                -- 최소 경력 (0=신입, 2=2년차)
  years_experience_max smallint,

  posted_at timestamptz not null,
  deadline timestamptz,                           -- null = 상시채용

  source_type job_source_type not null,
  source_name text not null,
  source_url text not null,
  source_trust_score numeric(3,1) not null default 3.0,  -- 1.0~5.0, 카고 키워드 +0.5

  -- 하이브리드 큐레이션 (D5)
  status job_status not null default 'pending',
  reviewed_at timestamptz,
  reviewed_by text,
  rejection_reason text,

  -- dedupe
  dedupe_hash text unique not null,

  click_count integer not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_job_posts_status on job_posts(status, posted_at desc);
create index idx_job_posts_deadline on job_posts(deadline) where deadline is not null;
create index idx_job_posts_cargo_category on job_posts(cargo_category);
create index idx_job_posts_trust_score on job_posts(source_trust_score);
create index idx_job_posts_approved on job_posts(status, deadline) where status = 'approved';
create index idx_job_posts_years on job_posts(years_experience_min, years_experience_max);
```

**RLS**:
```sql
alter table job_posts enable row level security;
create policy "anon can read approved jobs"
  on job_posts for select to anon
  using (status = 'approved');
```

**키워드 차단 제약** (DB 레벨 승무원·조종사 유입 방지):
```sql
-- 타이틀에 제외 키워드 포함 시 approved 상태 불가 (트리거로 enforce)
create or replace function block_non_cargo_titles()
returns trigger as $$
begin
  if new.status = 'approved' and new.title ~* '(승무원|객실|조종사|부기장|항공정비|정비사|기장)' then
    raise exception '[v0.3 cargo-only] 비카고 직군은 승인할 수 없습니다: %', new.title;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger trg_job_posts_cargo_only
  before insert or update on job_posts
  for each row execute function block_non_cargo_titles();
```

### 4.6 `job_clicks` (v0.3 신규)

```sql
create table job_clicks (
  id uuid primary key default gen_random_uuid(),
  job_post_id uuid not null references job_posts(id) on delete cascade,
  subscriber_id uuid references subscribers(id) on delete set null,
  session_id text,
  referrer text,
  created_at timestamptz not null default now()
);

create index idx_job_clicks_post on job_clicks(job_post_id);
create index idx_job_clicks_created on job_clicks(created_at desc);

alter table job_clicks enable row level security;
create policy "anon can insert job clicks"
  on job_clicks for insert to anon with check (true);
```

### 4.7 `cargo_career_links` (v0.3 대체 — 기존 `airline_career_links`)

카고 기업 공식 채용 페이지 딥링크. 수동 큐레이션.

```sql
create table cargo_career_links (
  id uuid primary key default gen_random_uuid(),
  company_slug text unique not null,              -- 'koreanair-cargo' | 'asiana-cargo' | 'pantos' | ...
  company_name text not null,
  company_type text not null,                     -- 'airline_cargo' | 'forwarder' | 'consolidator' | 'ground_handling'
  logo_url text,
  career_url text not null,
  description text,                                -- "국내 1위 화물 항공사, 전 세계 화물 네트워크 운영"
  last_health_check_at timestamptz,
  is_active boolean not null default true,
  display_order smallint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_cargo_career_links_type on cargo_career_links(company_type, display_order);

alter table cargo_career_links enable row level security;
create policy "anon can read active cargo links"
  on cargo_career_links for select to anon
  using (is_active = true);
```

### 4.8 `aviation_glossary`

```sql
create table aviation_glossary (
  id uuid primary key default gen_random_uuid(),
  term_en text unique not null,            -- 'AWB', 'ULD', 'TAC Index', 'Belly Cargo', 'Freighter'
  term_ko text,                              -- 항공화물운송장 / 단위탑재용기
  full_name text not null,                   -- 'Air Waybill'
  definition text not null,                  -- 한글 정의
  example text,                               -- 1줄 예시
  category text,                              -- 'cargo-general' | 'cargo-uld' | 'cargo-index' | 'flight-ops' | 'regulation'
  created_at timestamptz not null default now()
);

create index idx_glossary_category on aviation_glossary(category);
create index idx_glossary_term_en_lower on aviation_glossary(lower(term_en));

alter table aviation_glossary enable row level security;
create policy "anon can read glossary"
  on aviation_glossary for select to anon using (true);
```

### 4.9 `daily_digests`

```sql
create table daily_digests (
  id uuid primary key default gen_random_uuid(),
  digest_date date unique not null,
  sent_at timestamptz,
  recipients_count integer not null default 0,
  news_article_ids uuid[] not null default '{}',   -- 보통 4~5
  job_post_ids uuid[] not null default '{}',        -- 보통 3
  editor_pick_count smallint not null default 0,   -- 포함된 Pick 개수
  subject text,
  status text not null default 'pending',          -- 'pending' | 'sent' | 'failed'
  error_message text,
  loops_campaign_id text,                           -- Loops.so 캠페인 ID
  created_at timestamptz not null default now()
);

create index idx_daily_digests_date on daily_digests(digest_date desc);
```

### 4.10 `email_events` (Loops.so 웹훅)

```sql
create table email_events (
  id uuid primary key default gen_random_uuid(),
  external_id text,
  event_type text not null,           -- 'delivered' | 'opened' | 'clicked' | 'bounced' | 'unsubscribed'
  subscriber_email text not null,
  campaign_id text,
  click_url text,                      -- 'opened'/'clicked' 시 대상
  metadata jsonb not null default '{}',
  occurred_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index idx_email_events_email on email_events(subscriber_email);
create index idx_email_events_type on email_events(event_type);
create index idx_email_events_occurred_at on email_events(occurred_at desc);
```

### 4.11 `ingest_logs`

```sql
create table ingest_logs (
  id uuid primary key default gen_random_uuid(),
  job_name text not null,
  -- 'ingest-news-domestic' | 'ingest-news-overseas' | 'ingest-jobs-worknet' | 'ingest-jobs-saramin' |
  -- 'translate-overseas' | 'daily-digest' | 'archive-expired-jobs'
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  status text not null default 'running',    -- 'running' | 'success' | 'failure' | 'partial'
  records_inserted integer not null default 0,
  records_updated integer not null default 0,
  records_skipped integer not null default 0,
  error_message text,
  notes text,                                   -- 'budget_exceeded' 등 특이사항
  metadata jsonb not null default '{}'
);

create index idx_ingest_logs_job_name on ingest_logs(job_name, started_at desc);
```

### 4.12 `admin_users` (v0.3 신규)

Phase 5 `/admin/*` Magic Link 화이트리스트.

```sql
create table admin_users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  role text not null default 'admin',         -- 'admin' | 'editor' (Phase 6 기여자)
  is_active boolean not null default true,
  last_login_at timestamptz,
  created_at timestamptz not null default now()
);

alter table admin_users enable row level security;
-- anon 접근 금지 (service_role 전용). API Route에서 Magic Link 발송 전 이메일이 여기 있는지 검증.
```

### 4.13 `flights_snapshots` (Phase 5.5)

```sql
-- Phase 5.5 진입 시 도입
create table flights_snapshots (
  id uuid primary key default gen_random_uuid(),
  airport_code text not null,             -- 'ICN', 'GMP', 'CJU', ...
  direction text not null,                 -- 'departure' | 'arrival'
  snapshot_taken_at timestamptz not null default now(),
  flight_number text not null,
  airline_name text not null,
  airline_code text,                        -- 'KE', 'OZ', '8K', ...
  origin_code text,
  destination_code text,
  scheduled_time timestamptz,
  actual_time timestamptz,
  status flight_status not null,
  gate text,
  terminal text,
  aircraft_icao text,                       -- 'B77F', 'B77W', 'A332', 'B738' → aircraft_capacity FK
  aircraft_role aircraft_role,              -- 뱃지용 캐시 (Phase 5.5 1단계 정적 파일에서)
  source_api text not null,                 -- 'iiac' | 'kac'
  raw jsonb,                                 -- 디버그용
  created_at timestamptz not null default now()
);

create index idx_flights_snapshots_airport_dir on flights_snapshots(airport_code, direction);
create index idx_flights_snapshots_taken_at on flights_snapshots(snapshot_taken_at desc);
create index idx_flights_snapshots_flight_number on flights_snapshots(flight_number);
create index idx_flights_latest on flights_snapshots(airport_code, direction, snapshot_taken_at desc);
create index idx_flights_aircraft on flights_snapshots(aircraft_icao);
create index idx_flights_cargo_only on flights_snapshots(airport_code, direction) where aircraft_role in ('CGO', 'COMBI');

alter table flights_snapshots enable row level security;
create policy "anon can read flights"
  on flights_snapshots for select to anon
  using (true);
```

### 4.14 `aircraft_capacity` (Phase 5.5 2단계)

정적 파일 `web/src/data/aircraft-types.ts`에서 마이그레이션.

```sql
create table aircraft_capacity (
  icao_code text primary key,                  -- 'B77F', 'B77W', 'A332', 'B738'
  model_name text not null,                    -- 'Boeing 777F'
  manufacturer text,                             -- 'Boeing' | 'Airbus'
  deck_type aircraft_deck_type not null,
  role aircraft_role not null,

  max_payload_kg integer,                        -- 전체 최대 화물 중량
  belly_kg integer,                              -- 여객기 하부 벨리 최대 (freighter는 null)
  main_deck_kg integer,                          -- 화물기 메인 데크 (passenger는 null)
  uld_capacity jsonb not null default '{}',     -- {"AKE": 32, "PMC": 0, "PAG": 6}

  source_url text,                                -- Airbus/Boeing APM 출처 URL
  source_document text,                           -- 'Boeing 777F APM Rev 12, 2023-08'
  notes text,                                     -- 특이사항

  verified_by text,                               -- 'admin' (사용자 본인 검수)
  verified_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_aircraft_capacity_deck on aircraft_capacity(deck_type);
create index idx_aircraft_capacity_role on aircraft_capacity(role);

alter table aircraft_capacity enable row level security;
create policy "anon can read aircraft capacity"
  on aircraft_capacity for select to anon using (true);
```

### 4.15 `capacity_feedback` (Phase 5.5)

```sql
create table capacity_feedback (
  id uuid primary key default gen_random_uuid(),
  submitter_email text not null,
  icao_code text,                               -- 기종 (필수 아님 — 신규 기종 제보도 받음)
  field text not null,                           -- 'max_payload_kg' | 'belly_kg' | 'main_deck_kg' | 'uld_capacity' | 'notes' | 'new_aircraft'
  proposed_value text not null,                  -- 자유 텍스트 (수치·JSON·설명)
  reason text not null,                           -- 출처·근거
  current_value text,                             -- 제출 시점 DB 값 (감사용)
  status text not null default 'pending',        -- 'pending' | 'approved' | 'rejected'
  reviewed_by text,
  reviewed_at timestamptz,
  admin_note text,

  -- 스팸 방지
  submitter_ip inet,
  submitter_user_agent text,

  created_at timestamptz not null default now()
);

create index idx_capacity_feedback_status on capacity_feedback(status, created_at desc);
create index idx_capacity_feedback_icao on capacity_feedback(icao_code);

alter table capacity_feedback enable row level security;
create policy "anon can insert capacity feedback"
  on capacity_feedback for insert to anon with check (true);
-- SELECT는 서버 사이드(관리자)만.
```

### 4.16 `employer_inquiries` (Phase 5.5)

`/employers` 폼 수신. [01 PRD §8](./01-a-side-academy-career.md) 일치.

```sql
create table employer_inquiries (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  contact_name text not null,
  contact_email text not null,
  contact_phone text,
  company_type text,                              -- 'airline_cargo' | 'forwarder' | 'consolidator' | 'ground' | 'other'
  position_title text,                            -- 채용 직군
  headcount smallint,                             -- 모집 인원
  message text not null,                          -- 문의 내용
  source text,                                    -- 'hero_cta' | 'footer' | 'job_detail'

  -- 스팸 방지
  honeypot text,                                  -- 빈 값이어야 통과
  submitter_ip inet,
  submitter_user_agent text,

  status text not null default 'new',             -- 'new' | 'replied' | 'closed' | 'spam'
  replied_at timestamptz,
  admin_note text,

  created_at timestamptz not null default now()
);

create index idx_employer_inquiries_status on employer_inquiries(status, created_at desc);
create index idx_employer_inquiries_email on employer_inquiries(contact_email);

alter table employer_inquiries enable row level security;
create policy "anon can insert employer inquiries"
  on employer_inquiries for insert to anon
  with check (honeypot = '' or honeypot is null);
-- SELECT는 service_role만.
```

---

## 5. 트리거

### 5.1 `updated_at` 자동 갱신

```sql
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

-- 적용: subscribers, news_articles, job_posts, cargo_career_links, aircraft_capacity
create trigger trg_subscribers_updated_at
  before update on subscribers
  for each row execute function set_updated_at();
-- (같은 패턴 news_articles, job_posts, cargo_career_links, aircraft_capacity)
```

### 5.2 `job_posts` 자동 archived

```sql
create or replace function archive_expired_jobs()
returns void as $$
begin
  update job_posts
  set status = 'archived'
  where status = 'approved'
    and deadline is not null
    and deadline < now() - interval '7 days';
end;
$$ language plpgsql;
```

→ GitHub Actions daily cron에서 호출.

### 5.3 에디터 Pick 수정 이력 자동 기록

```sql
create or replace function log_editor_pick_change()
returns trigger as $$
begin
  if old.editor_pick is distinct from new.editor_pick then
    new.editor_pick_history := old.editor_pick_history || jsonb_build_array(
      jsonb_build_object(
        'previous', old.editor_pick,
        'previous_tone', old.editor_pick_tone,
        'changed_at', now(),
        'changed_by', new.editor_pick_author
      )
    );
  end if;
  return new;
end;
$$ language plpgsql;

create trigger trg_news_articles_pick_history
  before update on news_articles
  for each row execute function log_editor_pick_change();
```

### 5.4 `subscribers.last_active_at` 업데이트 (WAU 계산)

`email_events` INSERT 시 해당 구독자의 `last_active_at` 갱신.

```sql
create or replace function update_subscriber_last_active()
returns trigger as $$
begin
  if new.event_type in ('opened', 'clicked') then
    update subscribers
    set last_active_at = new.occurred_at
    where email = new.subscriber_email
      and (last_active_at is null or last_active_at < new.occurred_at);
  end if;
  return new;
end;
$$ language plpgsql;

create trigger trg_email_events_last_active
  after insert on email_events
  for each row execute function update_subscriber_last_active();
```

---

## 6. 초기 시드 데이터

### 6.1 `cargo_career_links` (v0.3 교체 — 수동 큐레이션)

[09-news-sources.md v0.3 §7.3](../references/09-news-sources.md), [01 PRD §3.3](./01-a-side-academy-career.md) 일치.

| company_slug | company_name | company_type | career_url |
|---|---|---|---|
| `koreanair-cargo` | 대한항공 카고 | airline_cargo | https://recruit.koreanair.com |
| `asiana-cargo` | 아시아나항공 카고 | airline_cargo | https://recruit.flyasiana.com |
| `air-incheon` | 에어인천 | airline_cargo | https://www.airincheon.co.kr/recruit |
| `pantos` | 판토스 | forwarder | https://www.pantos.com/recruit |
| `cj-logistics` | CJ대한통운 | forwarder | https://recruit.cjlogistics.com |
| `hanjin` | ㈜한진 | forwarder | https://recruit.hanjin.co.kr |
| `sebang` | 세방 | forwarder | https://www.sebang.com/recruit |
| `dongbang` | 동방 | forwarder | https://www.dongbang.co.kr/recruit |
| `kosmo` | 코스모항운 | consolidator | (확인 필요) |
| `woojung` | 우정항공 | consolidator | (확인 필요) |
| `triple-crown` | 트리플크라운인터내셔널 | consolidator | (확인 필요) |
| `seoul-air` | 서울항공 | consolidator | (확인 필요) |
| `swissport-kr` | 스위스포트 코리아 | ground_handling | https://www.swissport.com/career |
| `kas` | KAS (Korea Airport Service) | ground_handling | (확인 필요) |

OQ-R3에서 확인 필요 항목은 Phase 5 진입 전 사용자 검증.

### 6.2 `aviation_glossary` 초기 50개 (카고 중심)

[docs/glossary.md v0.3 §8.2](../glossary.md), [10-aviation-glossary.md](../references/10-aviation-glossary.md) 기반 스크립트로 일괄 INSERT.

우선순위 (카드 자동 래핑 빈도 높음):
- `AWB` · `HAWB` · `MAWB`
- `ULD` · `AKE (LD-3)` · `PMC` · `PAG` · `ALF` · `LD-6` · `ALP` · `LD-11`
- `TAC Index` · `BAI (Baltic Air Freight Index)`
- `Freighter` · `PAX` · `Combi` · `Belly Cargo` · `Main Deck` · `Lower Deck`
- `Consolidator (콘솔사)` · `Forwarder (포워더)` · `3PL` · `NVOCC`
- `APM (Airport Planning Manual)` · `ICAO` · `IATA`
- `DG (Dangerous Goods)` · `Perishable` · `Express` · `General Cargo`
- `Chargeable Weight` · `Volumetric Weight` · `DIM Factor`
- `RFS (Road Feeder Service)` · `Trucking`

### 6.3 `aircraft_capacity` 초기 30개 (Phase 5.5)

사용자(11년차 현직자) 정리 자료 + Airbus APM + Boeing APM 교차 검증.
주요 기종: `B77F`·`B77W`·`B77L`·`B748F`·`B744F`·`B737F`·`A332F`·`A332`·`A333`·`A359`·`A388`·`B738`·`B789` 등.

OQ-D1로 관리. Phase 5.5 진입 전 마감.

---

## 7. 마이그레이션 전략

- Supabase CLI `supabase/migrations/` 파일로 버전 관리
- 파일명: `YYYYMMDDHHMMSS_description.sql`
- 로컬 개발: `supabase start` → 자동 적용
- 프로덕션: `supabase db push` (수동 승인)

**Phase 5 초기 마이그레이션 순서**:
1. `20260411120000_init_enums_v0_3.sql` (news_category, editor_pick_tone, cargo_job_category, job_source_type, subscription_status, employment_type, news_source_type)
2. `20260411120100_subscribers.sql`
3. `20260411120200_news_articles.sql` (editor_pick 컬럼 포함)
4. `20260411120300_news_clicks.sql`
5. `20260411120400_job_posts.sql` (cargo 트리거 포함)
6. `20260411120500_job_clicks.sql`
7. `20260411120600_cargo_career_links.sql`
8. `20260411120700_aviation_glossary.sql`
9. `20260411120800_daily_digests_email_events_ingest_logs.sql`
10. `20260411120900_admin_users.sql`
11. `20260411121000_triggers_functions.sql` (set_updated_at, archive_expired_jobs, editor_pick_history, last_active_at)
12. `20260411121100_rls_policies.sql`
13. `20260411121200_seed_cargo_career_links.sql`
14. `20260411121300_seed_aviation_glossary_cargo.sql`

**Phase 5.5 추가 마이그레이션**:
15. `20260xxxxxxxxx_flight_enums.sql` (flight_status, aircraft_deck_type, aircraft_role)
16. `20260xxxxxxxxx_flights_snapshots.sql`
17. `20260xxxxxxxxx_aircraft_capacity.sql` + 정적 파일에서 마이그레이션 스크립트
18. `20260xxxxxxxxx_capacity_feedback.sql`
19. `20260xxxxxxxxx_employer_inquiries.sql`

---

## 8. NFR / SLO — 데이터 무결성 & 성능

| 영역 | 지표 | 목표 (SLO) | 측정·가드 |
|---|---|---|---|
| **무결성** | `email` unique 위반 시도 | 서버 500 금지 → 409 응답 | `on conflict (email) do nothing` + 앱 매핑 |
| 무결성 | `dedupe_hash` 위반으로 인한 중복 삽입 | 0건/일 | unique 제약 + `on conflict do nothing` |
| 무결성 | 비카고 타이틀 `approved` 전이 | 0건 | `block_non_cargo_titles` 트리거 |
| 무결성 | `editor_pick` 140자 초과 | 0건 | `chk_editor_pick_length` |
| 무결성 | `summary` 20~500자 이탈 | 0건 | `chk_summary_length` |
| 무결성 | `settings_token` 엔트로피 | 256bit | `gen_random_bytes(32)` |
| **RLS** | anon SELECT로 `pending` 뉴스 유출 | 0건 | RLS 테스트 스위트 |
| RLS | anon SELECT로 `pending` 공고 유출 | 0건 | RLS 테스트 스위트 |
| RLS | anon SELECT로 `subscribers` 이메일 유출 | 0건 | anon SELECT 정책 없음 |
| RLS | anon SELECT로 `capacity_feedback` / `employer_inquiries` | 0건 | anon은 INSERT만 |
| **성능** | 뉴스 목록 쿼리 p95 | ≤ 200 ms (1만 건) | `idx_news_articles_is_published` |
| 성능 | 관리자 Pending 리스트 p95 | ≤ 250 ms | `idx_news_articles_pending_review` |
| 성능 | 채용 필터 쿼리 p95 | ≤ 300 ms (10만 건) | `idx_job_posts_approved` |
| 성능 | 최신 운항 스냅샷 (Phase 5.5) p95 | ≤ 250 ms | `idx_flights_latest` |
| 성능 | `interest_categories` 매칭 (다이제스트) | ≤ 500 ms / 1000 구독자 | GIN 인덱스 |
| 성능 | WAU 쿼리 (`last_active_at ≥ now-7d`) | ≤ 100 ms | `idx_subscribers_last_active_at` |
| **용량** | Supabase 무료 티어 DB | ≤ 500 MB (Phase 5) | 주간 모니터링 |
| 용량 | `flights_snapshots.raw` jsonb | ≤ 4 KB/row | 디버그 후 null cron |
| **보존** | `subscription_events` 로그 | ≥ 13개월 (법적 증빙) | 삭제 cron 금지 |
| 보존 | `ingest_logs` | 90일 | 주간 삭제 |
| 보존 | `flights_snapshots` | 30일 (Phase 5.5 MVP) | 야간 삭제 cron |
| 보존 | `email_events` | 13개월 | 삭제 금지 |
| **복구** | `subscribers` 삭제 사고 | 즉시 복원 | Supabase PITR (Phase 6 유료) 또는 수동 백업 주 1회 |
| 복구 | RPO | ≤ 24 h | 일 1회 pg_dump |
| 복구 | RTO | ≤ 4 h | 수동 복원 스크립트 문서화 |

---

## 9. 데이터 수명 주기

```
[ingest] → [news: is_published=false / jobs: pending] → [관리자 승인 + 에디터 Pick 작성]
                                                             ↓
                                                [is_published=true / approved]
                                                             ↓
                                                [daily_digests 참조]
                                                             ↓
                                                [email_events (영구)]
                                                             ↓
                                   [last_active_at 갱신 → WAU 계산]
```

- `news_articles`: 무제한 보존. `is_published=false`로 비공개 가능. 에디터 Pick 수정 이력은 `editor_pick_history`에 누적.
- `job_posts`: 마감 +7일 → `archived`. RLS로 anon 차단.
- `subscribers`: `unsubscribed_at` 기록, 행 삭제 금지 (재구독 대응, 법적 증빙).
- `flights_snapshots`: 30일 후 삭제 (Phase 5.5 MVP).
- `aircraft_capacity`: 수정 이력은 `capacity_feedback`에서 감사. 삭제 금지.
- `capacity_feedback`·`employer_inquiries`: 영구 보존 (고객 문의 기록).

---

## 10. DoD

### Phase 5 MVP
- [ ] 모든 Phase 5 enum·테이블 마이그레이션 파일 작성
- [ ] RLS 정책이 anon 역할에서 의도대로 동작 (SQL 테스트 스위트)
- [ ] `subscribers.settings_token` 으로 설정 페이지 접근 가능
- [ ] `news_articles.is_published=true`만 공개 SELECT (RLS 네거티브 테스트)
- [ ] `job_posts.status='approved'`만 공개 SELECT + `block_non_cargo_titles` 트리거 동작
- [ ] `editor_pick` 140자 제약 + 수정 이력 트리거 동작
- [ ] `email_events` INSERT → `subscribers.last_active_at` 자동 갱신 확인 (WAU 계산 기반)
- [ ] `news_articles.dedupe_hash` unique 제약으로 중복 수집 차단
- [ ] `cargo_career_links` 초기 14개 시드
- [ ] `aviation_glossary` 초기 50개 카고 중심 시드
- [ ] `admin_users` Phase 5 초기 1개 (사용자 본인 이메일) 시드
- [ ] NFR §8 성능 지표 최소 3종(뉴스·채용·WAU) EXPLAIN ANALYZE 확인
- [ ] 수동 pg_dump 백업 절차 `docs/ops/backup.md` 작성

### Phase 5.5 (분리)
- [ ] `flights_snapshots` + `aircraft_capacity` + `capacity_feedback` + `employer_inquiries` 마이그레이션
- [ ] 정적 `aircraft-types.ts` → `aircraft_capacity` 마이그레이션 스크립트
- [ ] Phase 5.5 RLS 테스트 (anon `employer_inquiries` INSERT 허용 / SELECT 차단)

---

## Changelog

- **2026-04-11 (v0.3)**: **Cargo Pivot 전면 재작성**. `interest_tag` → `news_category` (cargo-market/ops/company/policy/airport-cargo/big-aviation) + 승무원·조종사·지상직 제거. `job_category` → `cargo_job_category` (sales/ops/customs/imex/intl_logistics/airport_ground/other_cargo). `news_articles`에 `editor_pick`·`editor_pick_tone`·`editor_pick_history`·`category`·`editor_pick_at` 컬럼 추가 (P05 핵심). `job_posts`에 `cargo_category`·`years_experience_min/max`·`industry` 추가 + `block_non_cargo_titles` 트리거. `airline_career_links` → `cargo_career_links` (14개 카고 기업). 신규 테이블: `admin_users` (Phase 5), `news_clicks` (Phase 5), `job_clicks` (Phase 5), `flights_snapshots` (Phase 5.5로 이동), `aircraft_capacity` (Phase 5.5), `capacity_feedback` (Phase 5.5), `employer_inquiries` (Phase 5.5). `subscribers`에 `last_active_at`·`persona_hint`·`referrer_subscriber_id` 추가 + WAU 자동 갱신 트리거. ADR-008 교차 참조.
- 2026-04-11 (v0.2): NFR/SLO §8 신규(17지표), 데이터 수명 주기 §9 추가, ADR-003/004 교차참조.
- 2026-04-11 (v0.1): 최초 작성. D4(Auth 없음) · D5(job_status) · Loops.so webhook.
