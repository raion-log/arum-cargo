# PRD 07 — Roadmap & Milestones (v0.3 Cargo-First)

> 아름 카고(Arum Cargo) Phase별 DoD·검증 방법·리스크·블로커 의존 · ADR 게이트.
> 앵커: [00-overview.md](./00-overview.md) · 피벗 원본: [ADR-008 Pivot to Cargo-First](../references/ADR-008-pivot-to-cargo-first.md) · 진입 플랜: `~/.claude/plans/snuggly-humming-adleman.md`

**버전**: v0.3 · **관련 ADR**: [ADR-001~007 전체](../adr/) + [ADR-008 Cargo-First](../references/ADR-008-pivot-to-cargo-first.md)

---

## 0. v0.3 변경 요약

- **Phase 넘버링 재정의**: Phase 5 = 아름 카고 MVP 완성 🏁 / Phase 5.5 = `/employers` + `/flights` + 기종 capacity + `/contribute` / Phase 6 = Remember 벤치마크 커뮤니티 / Phase 7 = 모바일 앱 + "아름" 브랜드 확장
- **수익화 섹션 전면 삭제**: 유료 구독·B2B SaaS·프리미엄 티어·월 요금제 모든 언급 제거. 성장 축은 "자연 광고 유입"(제휴 항공사·학원·포워더가 먼저 연락) 한 축만.
- **Phase 5+ Acquisition 재편**: 카고 커뮤니티 중심으로 전환. 네이버 카페(스카이워커·디시갤) → 화물 네이버 카페·LinkedIn 한국 화물 그룹·사람인 화물 직군 댓글로 교체.
- **North Star 재정의**: "100 verified / 90일" → **WAU (Weekly Active Subscribers)**. Phase 5 종료 목표 WAU 500, 4주 유지율 ≥ 40% (Reforge PMF 기준). 출처 명시: Amplitude NSM Playbook, Reforge Growth Series, Morning Brew Axios 2020, Substack/Beehiiv 대시보드 표준.
- **관리자 대시보드 Phase 5 DoD 포함**: shadcn/ui charts 8 KPI 카드를 Phase 5 DoD에 편입 ([05 §9](./05-email-growth-loop.md)).
- **기종 capacity 2단계**: Phase 5.5 초기 = 정적 TS 파일 `web/src/data/aircraft-types.ts` (30 ICAO 코드), Phase 5.5 확장 = `aircraft_capacity` Supabase 테이블 + ULD jsonb + `/contribute` 피드백 폼.
- **유예 항목 갱신**: L-Side B2B, 실시간 맵 등은 그대로 유예. P03 지상직/P04 QOL/P13 시니어 UI는 카고 중심 재정의로 새 Pain 14개로 대체 ([15-aos-dos-opportunity.md](../references/15-aos-dos-opportunity.md) v0.3).
- **레퍼런스 소스**: 카고프레스 · Loadstar · Air Cargo News UK · FlightGlobal Cargo · 카고 공식 채용 14사 ([09-news-sources.md](../references/09-news-sources.md) v0.3).

---

## 1. Phase 전체 개요

| Phase | 스코프 | 주요 산출물 | DoD 요약 | ADR 게이트 |
|---|---|---|---|---|
| **0** | 레퍼런스 SSOT | `docs/references/01~10` | 10개 파일 완성 ✅ | — |
| **0.5** | 전략·사용자 분석 확장 | `docs/references/11~15` | 5개 파일 완성 ✅ | — |
| **0.7** | VPS + ADR 정제 | `docs/references/16-vps.md` + `docs/adr/ADR-001~007` | VPS·ADR 커밋 ✅ | ADR-007 (방법론) |
| **0.8** | **Cargo-First Pivot** | `docs/references/ADR-008` + 7 레퍼런스 v0.3 재작성 | ADR-008 확정 ✅ · 사용자 승인 ✅ | **ADR-008 (Cargo-First)** |
| **1** | PRD 재작성 (v0.3) | `docs/prd/00~07·99` v0.3 | 9개 PRD v0.3 완성·사용자 승인 ⏳ | ADR-007 적용 · ADR-008 반영 |
| **2** | Next.js 프로젝트 셋업 | `web/` 뼈대 (`arum.*` 토큰) | `npm run dev`·타입체크·빌드 통과 | ADR-003 (Supabase) 스키마 적용 |
| **3** | UI Mock | 전 화면 렌더 (mock 데이터) | Lighthouse 80+ · Bento + Parallax + Blob 동작 | **ADR-006 (Premium Animated) 검증** |
| **4** | 외부 API 연동 (뉴스·채용) | ingest cron 2종 가동 | 실제 DB에 카고 뉴스·채용 데이터 수집 | ADR-002 (크론 하이브리드) · ADR-004 (큐레이션) |
| **5** | Supabase + Loops + 관리자 대시보드 🏁 | Growth Loop + WAU 대시보드 | 더블 옵트인 → 다이제스트 end-to-end + `/admin/dashboard` shadcn/ui charts 8 카드 | **ADR-005 (Loops.so)** OQ-M6 검증 |
| **5+** | 운영 · WAU 500 | KPI 달성 | WAU 500 · 4주 유지율 ≥ 40% · 에디터 Pick 커버리지 ≥ 60% | ADR 전체 review trigger 모니터 |
| **5.5** | `/flights` + `/employers` + 기종 capacity + `/contribute` | 양면시장 활성 + 운항 | 기종 뱃지 + ULD 팝오버 + 기업 문의 폼 + capacity 제보 | ADR-001 (KAC/IIAC) |
| **6** | Remember 벤치마크 커뮤니티 | 승진/이직 타임라인 + 직군별 익명 라운지 + 회사 이메일 검증 | 파일럿 100명 · 주간 활성 게시글 ≥ 5 | (신규 ADR 예정) |
| **7** | 모바일 앱 + "아름" 확장 | Next.js → Capacitor or Expo Web 브릿지 · 아름 브랜드 상위 도메인 | 앱 스토어 등록 · 기존 구독자 마이그레이션 | (신규 ADR 예정) |

---

## 2. Phase 1 — PRD 재작성 v0.3

### 2.1 범위

- `docs/prd/00-overview.md` — v0.3 ✅
- `docs/prd/01-a-side-academy-career.md` — v0.3 ✅ (카고 채용으로 재정의)
- `docs/prd/02-i-side-information.md` — v0.3 ✅ (카고 뉴스 + 에디터 Pick)
- `docs/prd/03-data-model.md` — v0.3 ✅ (cargo enum · editor_pick · 비카고 차단 트리거)
- `docs/prd/04-api-integration.md` — v0.3 ✅ (카고 키워드 · 해외 카고 피드)
- `docs/prd/05-email-growth-loop.md` — v0.3 ✅ (WAU · 관리자 대시보드 · 공유 루프)
- `docs/prd/06-ui-ux-spec.md` — v0.3 ✅ (Bento + Parallax + Blob · 3D Carousel `/about` · About 초안 3)
- `docs/prd/07-roadmap-milestones.md` ← (이 파일, v0.3)
- `docs/prd/99-quality-review.md` — v0.3 ⏳ (Phase B-9 진행 중)

### 2.2 DoD

- [x] 9개 PRD 전부 v0.3 재작성
- [x] 각 PRD가 ADR-008 교차 참조 링크 최소 1개
- [x] 각 PRD에서 승무원/지상직/조종사 중심 서술 부재 (Phase 5.5+ 허용 섹션 외)
- [x] 각 PRD가 카고 Pain 14개 중 최소 1개 명시 참조 ([15-aos-dos-opportunity.md](../references/15-aos-dos-opportunity.md) v0.3)
- [x] 각 PRD가 카고 페르소나 C1 이지훈·C2 박서연·C3 김태영·A1·B1 중 최소 1명 User Story 인용
- [x] 각 PRD 실패 케이스 ≥3개 (ADR-007 방법론 준수)
- [x] 각 PRD NFR/SLO 수치 정합성 (VPS §3 North Star WAU와 일치)
- [ ] 사용자 최종 검토 + "이대로 만들자" 승인
- [ ] `docs/prd/99-quality-review.md` v0.3 품질 검증 리포트 작성 (Phase B-9)
- [ ] OQ-B1(외부 API 키 발급) Phase 4 진입 전 착수 준비
- [ ] OQ-C1 About 페이지 초안 3개 중 사용자 선택 ([06 §5.10](./06-ui-ux-spec.md))

### 2.3 리스크

- 해외 카고 뉴스 번역 품질 ([OQ-R17](../open-questions.md)) — Phase 4 A/B 테스트로 검증
- Loops.so 한국 §50 준수 ([OQ-M6](../open-questions.md)) — Phase 5 진입 전 검증
- 에디터 Pick 작성 부담 (매일 3~4개 * 140자) — Phase 3~4에서 5개 샘플 사용자 검수 ([OQ-C2](../open-questions.md))

---

## 3. Phase 2 — Next.js 프로젝트 셋업

### 3.1 스코프

1. `web/` 디렉토리에 Next.js 14 (App Router) + TypeScript + Tailwind 초기화
2. shadcn/ui 초기 세팅 + 필수 컴포넌트 설치 (Button, Card, Badge, Tabs, Dialog, Input, Label, Form, Select, Checkbox, Tooltip, Popover, Separator, Skeleton, Toast, Chart)
3. `src/lib/supabase/` 클라이언트 (anon + service_role 분리) + Magic Link 래퍼 (`/admin`용)
4. Supabase 프로젝트 생성 + [03-data-model.md](./03-data-model.md) v0.3 마이그레이션 파일 작성·적용 (`cargo_job_category` enum·`editor_pick` 필드·`block_non_cargo_titles` 트리거·`admin_users` 포함)
5. `src/lib/api/` 디렉토리 뼈대 (각 API client 파일 빈 함수 시그니처)
6. Tailwind config에 [06-ui-ux-spec.md §2·§3](./06-ui-ux-spec.md) `arum.*` 컬러·폰트 토큰 적용
7. `<SiteHeader>`·`<SiteFooter>` 기본 레이아웃 + 사업자정보 영역
8. `.env.example` 업데이트 ([CLAUDE.md §6](../../CLAUDE.md)) — `LOOPS_WEBHOOK_SECRET`, `VERCEL_API_TOKEN`, `ADMIN_EMAIL_WHITELIST`, `OPENAI_MONTHLY_BUDGET_CAP_USD` 추가
9. Vercel 배포 (프로젝트명 `arumcargo` → `arumcargo.vercel.app` 기본 서브도메인)

### 3.2 DoD

- [ ] `npm run dev` 로컬 서버 구동, 빈 랜딩 페이지 렌더
- [ ] `npm run build`·`npm run typecheck` 통과
- [ ] Supabase 프로젝트에 모든 테이블 생성, RLS 정책 적용 ([ADR-003 Verification](../adr/ADR-003-data-supabase.md))
- [ ] v0.3 enum 3개 (`news_category`, `cargo_job_category`, `editor_pick_tone`) 생성
- [ ] `block_non_cargo_titles` 트리거 + `log_editor_pick_change` 트리거 + `update_subscriber_last_active` 트리거 적용 확인 ([03 §6](./03-data-model.md))
- [ ] 시드 데이터: `cargo_career_links` 14사 (대한항공카고·아시아나카고·에어인천·판토스·CJ대한통운·한진·코스모항운·트리플크라운·우정항공·서울항공·세방·동방·스위스포트·KAS), `aviation_glossary` 50개 (카고 용어 포함)
- [ ] Vercel 배포 URL 접속 가능 (`arumcargo.vercel.app`)
- [ ] `.env.example` 모든 키 이름 포함, `.env.local` 로컬 설정
- [ ] [03 §8 NFR](./03-data-model.md) 인덱스 생성 확인 (`idx_news_articles_published_at`, `idx_news_articles_editor_pick`, `idx_subscribers_last_active_at` 등)

### 3.3 의존

- OQ-B1: Supabase 계정·프로젝트 생성 (필수)
- OQ-B1: 공공데이터포털·네이버·워크넷·사람인·OpenAI·Loops 계정은 Phase 2에서 가입만, 키는 Phase 4에서 실사용
- OQ-B3 해결됨: 도메인 → `arumcargo.vercel.app` 무료 (500명 또는 첫 제휴 문의 도달 시 `arumcargo.com` 재검토)

### 3.4 리스크

- Supabase 무료 티어 제한: 500MB DB · 1GB Storage · 5GB 대역폭 → WAU 500 수준은 충분
- Vercel Hobby: 100GB 대역폭/월 → MVP 초반 무난

---

## 4. Phase 3 — UI Mock 데이터

### 4.1 스코프

1. [06-ui-ux-spec.md §5](./06-ui-ux-spec.md) 화면 전부 구현 (mock 데이터)
2. 라우트: `/`, `/news`, `/jobs`, `/about`, `/privacy`, `/terms`, `/subscribe/verify` (placeholder)
3. 컴포넌트: [06-ui-ux-spec.md §6](./06-ui-ux-spec.md) 전체 (BentoGrid + GradientBlobBg + Scroll Parallax Hero + EditorPickBlock + CargoCareerLinkCard 포함)
4. Hero 스태거드 리빌 (Framer Motion `staggerChildren` + `whileInView`) + Scroll Parallax (`useScroll` + `useTransform`) + Gradient Blob CSS `@keyframes` (랜딩·/about만)
5. `<AviationTerm>` 툴팁 동작 (AWB·ULD·TAC Index·Belly·Main Deck 등 용어 50개 시드)
6. 반응형 검증 (320px~1920px)
7. 관리자 `/admin` 페이지 mock (목업 데이터로 shadcn/ui charts 카드 시각화)
8. `/about` 초안 3개 중 1개 적용 (OQ-C1 해결 결과)
9. 에디터 Pick 샘플 5개 작성·사용자 검수 (OQ-C2)

### 4.2 DoD ([ADR-006 Verification](../adr/ADR-006-design-premium-animated.md))

- [ ] 모든 화면 mock 데이터로 렌더
- [ ] 필터·정렬·카테고리 chips·검색 바 UI 동작 (실제 데이터는 Phase 4)
- [ ] 모바일~데스크톱 반응형 완성 (320px부터)
- [ ] Lighthouse 모바일 Performance ≥80·Accessibility ≥90·Best Practices ≥90·SEO ≥95 ([06 §12 NFR](./06-ui-ux-spec.md))
- [ ] LCP p75 ≤ 2.5s · CLS p75 ≤ 0.1 · INP p75 ≤ 200ms
- [ ] WCAG AA 대비 통과 (axe DevTools 0 critical)
- [ ] `prefers-reduced-motion: reduce` 시 Framer Motion 전이·Parallax·Blob Drift·3D Carousel 전부 비활성 확인 (2026-04-18 Amendment)
- [ ] Pretendard + Space Grotesk 로드 + 초기 폰트 페이로드 <100KB
- [ ] **ADR-006 review trigger 체크**: 첫 10명 베타 "너무 화려함" 피드백 <30%
- [ ] Hero 스태거드 리빌 (0.15s 간격) + Scroll Parallax 3레이어 작동
- [ ] Gradient Blob 배경 Hero에만 노출, pointer-events:none
- [ ] 3D Carousel은 **`/about` 하단에서만** 작동 (메인 제거 확인)
- [ ] 에디터 Pick 블록 렌더링: Pick 없는 카드도 정상 (blank 영역 레이아웃 안정)
- [ ] 품질 하한선 수동 비교: `uvengers-website.vercel.app`와 나란히 사용자 승인

### 4.3 리스크

- Bento + Parallax + Blob 조합 구현 난이도 → Phase 3 초반 2~3일 프로토타입 후 타협
- 디자인 토큰이 Tailwind 플러그인 충돌 → 수동 설정으로 우회
- 에디터 Pick 샘플 작성 부담 → Phase 3에서 5개만 작성, 본격은 Phase 4 데이터 유입 후

---

## 5. Phase 4 — 외부 API 연동 (카고 뉴스·채용)

### 5.1 스코프

1. [04-api-integration.md](./04-api-integration.md) v0.3 전체 구현
2. API 클라이언트 4종 (Naver News / Worknet / Saramin / OpenAI)
3. 해외 카고 RSS 3종 피드 (Loadstar / Air Cargo News UK / FlightGlobal Cargo)
4. `/api/cron/ingest-news`·`ingest-jobs` 라우트 (운항 ingest는 Phase 5.5)
5. `.github/workflows/ingest-*.yml` 2개
6. `ingest_logs` 기록
7. 실제 카고 데이터로 `/news`·`/jobs` 대체
8. 관리자 `/admin/news` 에디터 Pick 작성 플로우 + `/admin/jobs` 승인 큐 동작
9. OQ-R17 A/B 번역 실험 분기 구현 (feature flag) — 카고 전문 용어 하이퍼스페시픽 프롬프트 vs 일반 프롬프트
10. `EXCLUDE_RE` 필터 동작 검증 (승무원/객실/조종사/부기장/정비사 제외)
11. `scoreTrust` 카고 키워드 보너스 (+0.5 for AWB/ULD/TACT/콘솔/포워더/항공화물)

### 5.2 DoD ([ADR-002](../adr/ADR-002-cron-hybrid.md) · [ADR-004](../adr/ADR-004-curation-hybrid.md))

- [ ] 외부 API 키 전부 확보 (OQ-B1 ✅)
- [ ] 각 cron 워크플로우 수동 트리거로 성공 (`workflow_dispatch`)
- [ ] Supabase에 실제 데이터 INSERT 확인
- [ ] `/news` 실제 카고 뉴스 20건 이상 노출, 카테고리 분포가 [02 §5 카테고리 쿼터](./02-i-side-information.md) 범위
- [ ] `/jobs` 실제 승인된 카고 공고 10건 이상 노출, 전부 6개 cargo_job_category 안에 분류
- [ ] GPT-4o-mini 해외 카고 기사 번역 5건 이상 성공, `assertNoHallucination` 검증 통과
- [ ] `/admin/news` 에디터 Pick 인라인 편집 + history 자동 기록 동작
- [ ] `/admin/jobs` pending → approved 플로우 동작 ([ADR-004](../adr/ADR-004-curation-hybrid.md))
- [ ] `block_non_cargo_titles` 트리거가 승무원/정비 제목을 DB 레벨에서 차단하는지 샘플 INSERT로 검증
- [ ] Vercel 프로덕션 환경 변수 등록
- [ ] GitHub Actions Secrets 등록 (`CRON_SECRET` + 각 API 키)
- [ ] [04 §15 NFR](./04-api-integration.md) 엔드포인트별 SLO 측정 (p95 응답·3-retry·timeout 전부 준수)
- [ ] OpenAI 월간 예산 캡 `OPENAI_MONTHLY_BUDGET_CAP_USD=5` 설정·Loops 1800/2000 알림 설정

### 5.3 리스크

- 공공데이터포털 API 승인 지연 (2~3일) → Phase 5.5 진입 2주 전 신청 (Phase 4에서는 불필요)
- 워크넷 API XML 응답 파싱 난이도 → `fast-xml-parser` 사용
- 사람인 dedupe 정확도 → 초기 수동 확인 + 해시 보완
- 해외 카고 RSS 피드 URL 패턴 변경 → 월 1회 헬스체크
- 카고 키워드로 검색 시 사람인 API 결과 희박 → 다수 키워드 조합 + 공식 채용 페이지 딥링크로 보완

---

## 6. Phase 5 — Supabase + Loops + 관리자 대시보드 🏁 (아름 카고 MVP 완성)

### 6.1 스코프

1. [05-email-growth-loop.md](./05-email-growth-loop.md) v0.3 전체 구현
2. `/api/subscribe` POST + `/subscribe/verify` GET (카테고리 6 체크박스 포함)
3. Loops 템플릿 4종 작성·검증 (`tpl-verify`, `tpl-daily-digest`, `tpl-unsubscribe-confirmation`, `tpl-admin-alert`)
4. `/api/cron/daily-digest` + Vercel Cron 설정 (07:00 KST)
5. 에디터 Pick 블록 포함 HTML 빌더 ([05 §5 pickBlock](./05-email-growth-loop.md))
6. `/subscribe/settings/[token]` + `/unsubscribe/[token]`
7. `/privacy` · `/terms` 법정 페이지 컨텐츠 확정 (사업자번호·주소·연락처 포함)
8. `email_events` 웹훅 수신 (Loops → `/api/webhooks/loops/events`) + `LOOPS_WEBHOOK_SECRET` 검증
9. OQ-M6 검증: Loops가 (광고) 제목·원클릭 수신거부·발신자 정보 모두 지원하는지
10. **`/admin/dashboard` shadcn/ui charts 8 KPI 카드** ([05 §9](./05-email-growth-loop.md)):
    - WAU (Primary) · MUV · 유입 경로 분포 · 주간 신규 구독자 · 4주 유지율 · Open/CTR · 주간 승인 공고 · Employers 문의(Phase 5.5 placeholder)
    - 각 카드 ⓘ 툴팁에 출처 3줄 (Amplitude NSM Playbook / Reforge Growth Series / Morning Brew Axios 2020)
11. Supabase Magic Link 로그인 + `admin_users` 화이트리스트 + 미들웨어 `/admin/:path*`
12. `/share/[id]?ref={subscriber_id}` 공유 루프 랜딩 (referrer 추적)
13. 카테고리 쿼터 반영 필터 ([05 §QUOTA_DEFAULT](./05-email-growth-loop.md))
14. 야간 발송 차단 (hours < 6 || > 10 → 403) + `daily_digests.digest_date` unique 멱등성

### 6.2 DoD ([ADR-005 Loops.so Verification](../adr/ADR-005-email-loops.md))

- [ ] 본인 이메일로 end-to-end 구독 플로우 성공
- [ ] 다이제스트 07:00 KST 자동 발송 확인 (Vercel Cron `0 22 * * *` UTC)
- [ ] **OQ-M6 검증**: Loops 템플릿이 한국 §50 요구사항 전부 통과 — (광고) 제목·원클릭 수신거부·발신자 정보·야간(21-08) 발송 회피
- [ ] 수신거부 원클릭 응답 ≤ 10초 ([05 §12 NFR](./05-email-growth-loop.md))
- [ ] 설정 페이지 `settings_token` 속도 제한 10 req/min 구현
- [ ] 구독 플로우 `/api/subscribe` 가용성 ≥ 99% 실측
- [ ] 다이제스트 발송 성공률 ≥ 98% 실측 (Loops 대시보드)
- [ ] Loops 대시보드에서 오픈률·CTR 확인
- [ ] 최소 5명 테스터 구독 → 첫 다이제스트 수신 검증
- [ ] `/privacy`·`/terms` 법적 내용 확정 (사업자번호·주소·연락처 포함)
- [ ] `subscription_events` 13개월 보존 정책 적용 ([03 §8](./03-data-model.md))
- [ ] **`/admin/dashboard` shadcn/ui charts 8 KPI 카드** 노출 + 각 카드 ⓘ 툴팁 동작 + 미승인 접근 시 404
- [ ] Loops webhook → `email_events` INSERT → `subscribers.last_active_at` 업데이트 → WAU 집계 플로우 검증 (딜레이 ≤ 5분)
- [ ] 에디터 Pick 이메일 블록 렌더링 (좌측 sky 바 + 톤 라벨 + 본문) 실 이메일 수신함에서 확인 (Gmail·Naver·Daum 3종)
- [ ] 야간 발송 시도 시 `/api/cron/daily-digest` 403 반환 확인
- [ ] 공유 링크 `/share/[id]?ref=xxx` 클릭 → `referrer_subscriber_id` 기록 동작
- [ ] **ADR-005 review trigger 체크**: OQ-M6 중 하나라도 실패 시 Resend + 커스텀 도메인 폴백 착수

### 6.3 리스크

- OQ-M6 검증 실패 시 Resend + 커스텀 도메인으로 폴백 (도메인 구매·DNS 인증 24~72시간 + 비용 추가) → Phase 5 진입 전 2주 여유 필요
- 네이버·다음 수신함 스팸 필터 → 본인 주소 사전 테스트
- §50 위반으로 민원·과태료 → 원클릭 수신거부·(광고) 제목·발신자 정보 철저 준수
- 에디터 Pick 작성 매일 부담 → 주간 배치 작성 (일요일에 월~금 5일치 초안) 실험

---

## 7. Phase 5+ — 운영 & WAU 500 달성

### 7.1 Acquisition (v0.3 카고 채널)

[00-overview.md §5](./00-overview.md) 채널별 실행:

| 채널 | 액션 | 목표 WAU |
|---|---|---|
| 본인 SNS / 지인 (익명 톤) | 론칭 포스트 × 3, About 초안 인용 | 30 |
| **LinkedIn 한국 화물 그룹** | 카고 뉴스 브리핑 공유 + 에디터 Pick 티저 | 80 |
| **네이버 카페 — 항공화물·국제물류** | 카페 규칙 준수 + 가치 중심 포스팅 | 100 |
| **사람인 화물 직군 댓글란·블로그** | 공식 채용 딥링크 보강 + 소개 한 줄 | 50 |
| 항공교통물류학과 동문·재학생 DM | 10곳 타겟 + 배너·뉴스레터 교차 | 40 |
| SEO | "콘솔사 채용", "항공화물 영업 연봉", "TAC Index 한국" 롱테일 | 100 |
| 콘솔사·포워더 제휴 DM (A-Side B1) | 5곳 타겟 `/employers` 안내 | 40 |
| 지인 추천 (share loop) | `/share/[id]?ref=sub_id` | 60 |

**총 타겟 WAU Phase 5+ 종료: 500**

### 7.2 KPI ([00-overview.md §6](./00-overview.md))

- **WAU (Primary)**: Phase 5+ 12주 내 **500**
- **4주 유지율**: ≥ 40% (Reforge PMF 기준)
- **오픈률**: 35%+ (Loops 대시보드)
- **CTR**: 8%+ (Loops 대시보드)
- **수신거부율**: ≤ 2%
- **에디터 Pick 커버리지**: ≥ 60% ([02 §5](./02-i-side-information.md))
- **MUV**: 주 2000 (Vercel Analytics)
- **주간 신규 승인 공고**: ≥ 20건
- **비카고 제목 차단율**: 100% (DB 트리거 + ingest 필터 이중 방어)

### 7.3 관측 & 피드백 루프

- **Vercel Analytics**: MUV·유입 경로 (`/api/admin/metrics` 집계)
- **Loops 대시보드 + API**: 오픈률·CTR·발송 성공률
- **Supabase**: WAU·4주 유지율·카테고리 분포 쿼리
- **`/admin/dashboard` shadcn/ui charts**: 실시간 8 카드 + `unstable_cache` 5분
- **주간 리뷰**: 매주 금요일 KPI 점검 + 다음 주 실험 1개 선정
- **월간 Pick 리뷰**: 매월 1일 에디터 Pick 샘플 10개를 사용자가 자기 검수

### 7.4 Phase 2+ 검토 트리거 (ADR Review Trigger 연동)

| 트리거 | 관련 ADR | 대응 |
|---|---|---|
| WAU 500 돌파 → Loops 2000 한도 80% 근접 | [ADR-005](../adr/ADR-005-email-loops.md) | Loops Pro 전환 or Resend + 커스텀 도메인 이전 착수 |
| WAU 정체 (4주 유지율 < 40%) 2주 지속 | [ADR-007](../adr/ADR-007-vps-prd-workflow.md) · ADR-008 | 페르소나·채널 재검토. 재피벗 검토 |
| 오픈률 25% 미만 2주 지속 | [ADR-007](../adr/ADR-007-vps-prd-workflow.md) | 발송 시간·제목·개인화·에디터 Pick 톤 A/B 실험 |
| 에디터 Pick 커버리지 < 40% 2주 지속 | ADR-008 (카고 Pivot 핵심 차별화) | 작성 부담 경감 (주간 배치 or 톤 다양화) or 자동화 도입 (OpenAI로 초안 생성) |
| 비카고 제목 차단 트리거 raise 발생 | [ADR-004](../adr/ADR-004-curation-hybrid.md) | ingest 필터 재조정 |
| KAC/IIAC 가용성 월 1회 이상 장애 (Phase 5.5+) | [ADR-001](../adr/ADR-001-data-source-kac-iiac.md) | 백업 소스 또는 FR24 Business API 재검토 |
| 관리자 승인 큐 평균 지연 >24h | [ADR-004](../adr/ADR-004-curation-hybrid.md) | 자동 승인 룰 도입 또는 완전 수동 전환 |
| GitHub Actions 월 2000분 초과 | [ADR-002](../adr/ADR-002-cron-hybrid.md) | Vercel Cron Pro 전환 or Cloudflare Cron |
| 디자인 "너무 화려함" 피드백 ≥30% | [ADR-006](../adr/ADR-006-design-premium-animated.md) | Parallax·Blob·3D 강도 축소 or Functional Clean 회귀 |
| Acquisition 채널 중 1개 40%+ 집중 | — | 집중 투자 |
| 첫 제휴 문의 수신 (`/employers`) | ADR-008 | Phase 5.5 진입 가속 + 커스텀 도메인 `arumcargo.com` 구매 검토 |
| 한아름종합물류 브랜드 혼동 민원 | ADR-008 | 상표 출원 시점 재검토 + 푸터 구분 표기 강화 |

---

## 8. Phase 5.5 — `/flights` + `/employers` + 기종 Capacity + `/contribute`

### 8.1 스코프

1. 공공데이터포털 KAC + IIAC API 키 발급 및 연동 ([04 §10](./04-api-integration.md))
2. `/api/cron/ingest-flights` + GitHub Actions `ingest-flights.yml` 추가
3. `flights_snapshots` 테이블 데이터 적재 ([03 §7](./03-data-model.md))
4. `/flights` 화면 구현 ([06 §5.7](./06-ui-ux-spec.md)) — 기종 뱃지 + 화물기(CGO)만 필터
5. **기종 Capacity 2단계**:
   - **초기**: `web/src/data/aircraft-types.ts` 정적 TS 파일 (30 ICAO 코드 + PAX/CGO/COMBI + 기종명) → `<AircraftBadge>` 툴팁
   - **확장**: `aircraft_capacity` Supabase 테이블 + ULD jsonb + 팝오버에 `max_payload_kg` + 주요 ULD 표기
6. `/employers` 화면 ([06 §5.8](./06-ui-ux-spec.md)) — Bento 3 카드 + `<EmployerInquiryForm>` + `employer_inquiries` 테이블 + 허니팟 + IP 레이트 리밋
7. `/contribute` 화면 ([06 §5.9](./06-ui-ux-spec.md)) — `<CapacityFeedbackForm>` + `capacity_feedback` 테이블 + 관리자 트랜잭셔널 메일
8. `/admin/capacity` + `/admin/inquiries` 관리자 큐
9. `/admin/dashboard` shadcn/ui charts 카드 #8 (Employers 문의) placeholder → 실 데이터로 활성화
10. `/flights` tracking AWB 단순 링크 (UBIKAIS 공식 사이트 deep link만, 자체 파싱 금지)

### 8.2 DoD ([ADR-001 KAC/IIAC Verification](../adr/ADR-001-data-source-kac-iiac.md))

- [ ] 공공데이터포털 KAC·IIAC API 키 발급 (2~3일 승인 완료)
- [ ] `/flights` 실제 운항 데이터 각 공항 10건 이상 노출
- [ ] 화물기(CGO) 필터 토글 동작, 여객기 belly 라벨 툴팁 노출
- [ ] `web/src/data/aircraft-types.ts` 30 ICAO 코드 시드 확보 + 사용자 검수 (OQ-D1)
- [ ] `<AircraftBadge>` hover 툴팁 작동 (`PAX · belly 적재 가능` / `CGO · Freighter` / `COMBI` 라벨)
- [ ] `aircraft_capacity` 테이블 마이그레이션 + ULD 팝오버 확장 동작 (Phase 5.5 후반)
- [ ] `/employers` 3 Bento 카드 + 인재풀 분포 차트 + `<EmployerInquiryForm>` 허니팟·IP 레이트 리밋 동작
- [ ] `/employers` 제출 시 `employer_inquiries` INSERT + 관리자 알림 메일 수신
- [ ] `/contribute` 제출 시 `capacity_feedback` INSERT + 관리자 알림 메일 수신
- [ ] `/admin/capacity`·`/admin/inquiries` 큐에서 pending → resolved 플로우 동작
- [ ] `/admin/dashboard` KPI #8 카드 실 데이터 활성화
- [ ] 첫 제휴 문의 수신 후 `arumcargo.com` 커스텀 도메인 구매 결정 (OQ-B3 재검토)

### 8.3 리스크

- KAC/IIAC API 기종 정보가 공백인 경우 → FlightRadar24 공개 스케줄/OAG 교차 참조 (OQ 신규)
- `aircraft_capacity` 시드 데이터 품질 → 사용자 본인 자료 + Airbus/Boeing APM 검증 (Phase 5.5 진입 전 필수)
- 기업 문의 허니팟 우회 → reCAPTCHA v3 추가 검토
- `/employers` 인재풀 통계가 개인정보 유추로 이어질 위험 → k-익명성 k≥5 보장 (카테고리 5명 미만 시 "—" 표시)

---

## 9. Phase 6 — Remember 벤치마크 커뮤니티 (비전)

### 9.1 스코프 (상세 스펙은 Phase 5 완료 후 별도 PRD)

리멤버(Remember) 앱 벤치마크 기반 이식:

| 요소 | 구현 방식 |
|---|---|
| **승진·이직 타임라인** | 본인 입력 + 공개 동의 플래그 + 팔로우 시 알림 |
| **직군별 익명 라운지** | 카고 영업 / 오퍼 / 통관 / 수출입 / 국제물류 / 공항상주 6 세그먼트 |
| **경력 검증 (신뢰도)** | 회사 이메일 도메인 인증 (e.g. `@koreanair.com`, `@cargolux.com`, `@pantos.com`) |
| **모더레이션** | 사용자 본인 초기 수동 + 신고 큐 |

### 9.2 DoD (잠정)

- [ ] 파일럿 100명 구독자 중 옵트인 30명
- [ ] 주간 활성 게시글 ≥ 5
- [ ] 회사 이메일 검증 성공률 ≥ 80%
- [ ] 게시글 신고 → 24h 내 처리
- [ ] 신규 ADR 작성 (커뮤니티 모더레이션·개인정보·저장정책)

### 9.3 리스크

- 작은 커뮤니티 → 초기 글 생성 부담 (주 5 글 최소) → 본인 글 + 시드 질문 세트 준비
- 익명 라운지 악용 (특정 회사·개인 공격) → 회사명 자동 마스킹 + 신고 임계치 설정
- 개인정보 보호법 추가 준수 → 새 `/privacy` 섹션

---

## 10. Phase 7 — 모바일 앱 + "아름" 브랜드 확장 (비전)

### 10.1 스코프 (상세 스펙은 Phase 6 완료 후 별도 PRD)

- Next.js → **Capacitor** 또는 **Expo Web** 브릿지 평가
- 앱 스토어 등록 (Google Play 우선, 이후 App Store)
- 푸시 알림 (Firebase Cloud Messaging or OneSignal)
- 브랜드 확장: **아름 카고 → 아름 (Arum)** 상위 도메인, 항공 생태계 전체(여객·교통·물류)로 확장. 카고는 하위 수직으로 유지.
- 기존 구독자 자연스러운 이관 (`arumcargo.com` → `arum.kr` 또는 `arum.co.kr`)

### 10.2 DoD (잠정)

- [ ] 앱 스토어 등록 + 첫 100 다운로드
- [ ] 기존 이메일 구독자 중 50% 앱 마이그레이션
- [ ] 푸시 알림 opt-in 30% 이상
- [ ] 신규 ADR 작성 (모바일 프레임워크·배포 전략)

### 10.3 리스크

- Capacitor vs Expo 선택 실수 → Phase 6 중에 2주 프로토타입 검증
- 브랜드 확장 타이밍 오류 → WAU 2000+ 확보 후 진입
- 앱 리뷰 거절 → Vercel web view 일부 차단 가능성 사전 체크

---

## 11. 유예 항목 (Phase 1~5에 포함 안 함)

| 항목 | 유예 이유 | 재검토 시점 |
|---|---|---|
| L-Side B2B 화물 SaaS | 아름 카고는 구독자 매체·채용 허브로 한정 | Phase 7+ 또는 별도 사업 |
| 실시간 운항 맵 (WebGL 3D) | 테이블로 충분 | Phase 6+ |
| 인스타그램 크롤링 | Meta ToS 리스크 | 파트너십 경로만 |
| 다국어 (EN) | next-intl 도입 부담 | Phase 7 아름 확장 시 |
| Deep Domain RAG (AWB 질의응답) | 벡터 DB·도메인 데이터 필요 | Phase 6+ |
| P12 실시간 특이 항공기 알림 | AOS 낮음 + 카고 피벗으로 우선순위 조정 | Phase 5.5+ |
| 승무원·지상직·조종사 직군 | ADR-008 카고 Pivot 대상 외 | 재피벗 없음 |
| 커스텀 도메인 이메일 | Loops.so `loops.email` 공용 발송 기본 | OQ-M6 결과 또는 500 구독자 |
| 수익화 (프리미엄 티어·유료 구독·B2B SaaS) | v0.3 축 제거 결정 | 재검토 없음 |
| ULD 레이아웃 시각화 (기내 배치도) | 사용자 요청 시에만 | Phase 6+ |

---

## 12. 블로커 의존도 (Phase 진입 전 필수 해결)

| Phase | 블로커 | 해결 담당 |
|---|---|---|
| 2 | Supabase 계정 생성 | 사용자 |
| 2 | 도메인 결정 | **해결됨** — `arumcargo.vercel.app` |
| 4 | 네이버 개발자센터 애플리케이션 등록 | 사용자 |
| 4 | 워크넷 API 키 발급 (2~3일 승인) | 사용자 |
| 4 | 사람인 API 키 발급 | 사용자 |
| 4 | OpenAI 계정 + $5 크레딧 | 사용자 |
| 4 | 해외 카고 RSS 피드 URL 확정 (Loadstar/ACN UK/FG Cargo) | Claude + 사용자 |
| 5 | Loops.so 계정 + API 키 + `LOOPS_WEBHOOK_SECRET` | 사용자 |
| 5 | Vercel API 토큰 (`VERCEL_API_TOKEN` for Analytics) | 사용자 |
| 5 | OQ-M6 Loops §50 준수 검증 | Claude + 사용자 |
| 5 | 사업자등록증·연락처·주소 (법정 표기용) | 사용자 |
| 5 | OQ-C1 About 초안 1개 선택 | 사용자 |
| 5 | OQ-C2 에디터 Pick 샘플 5개 톤 검수 | 사용자 |
| 5 | `admin_users` 화이트리스트 이메일 (`ADMIN_EMAIL_WHITELIST`) | 사용자 |
| 5+ | 초기 제휴 학원·포워더 3~5곳 확보 | 사용자 |
| 5.5 | 공공데이터포털 KAC·IIAC API 키 발급 (2~3일 승인) | 사용자 |
| 5.5 | 기종 capacity 시드 자료 30 ICAO (OQ-D1) | 사용자 |
| 5.5 | 첫 제휴 문의 수신 시 `arumcargo.com` 구매 검토 | 사용자 |

---

## 13. 전체 체크리스트 (상위 레벨)

### Phase 1 (PRD v0.3)
- [x] 9개 PRD v0.3 재작성
- [ ] 사용자 검토·승인
- [ ] 레퍼런스 교차 링크 검증 (99-quality-review)

### Phase 2 (셋업)
- [ ] `web/` Next.js 14 초기화
- [ ] Supabase 프로젝트 + v0.3 마이그레이션 (`cargo_job_category` enum·에디터 Pick·트리거 3종·`admin_users`)
- [ ] Tailwind + `arum.*` 토큰 + shadcn/ui + 폰트
- [ ] `<SiteHeader>`·`<SiteFooter>` 기본
- [ ] `arumcargo.vercel.app` 배포 URL 확보

### Phase 3 (UI Mock)
- [ ] 모든 화면 mock 렌더
- [ ] Bento + Parallax + Blob + 스태거드 리빌
- [ ] 3D Carousel `/about` 하단 배치
- [ ] 반응형 320px~1920px
- [ ] Lighthouse 모바일 80+
- [ ] 에디터 Pick 블록 샘플 5개
- [ ] `/about` 초안 1개 적용

### Phase 4 (API 연동)
- [ ] API 키 4종 확보 (네이버·워크넷·사람인·OpenAI)
- [ ] API 클라이언트 4종 + 해외 카고 RSS 3종
- [ ] cron 2종 + GitHub Actions
- [ ] 실제 카고 데이터 DB 적재
- [ ] `/admin/news` 에디터 Pick 플로우 + `/admin/jobs` 승인 큐
- [ ] OQ-R17 A/B 분기 + `EXCLUDE_RE` + `scoreTrust` 카고 보너스

### Phase 5 🏁 (MVP)
- [ ] Loops 템플릿 4종
- [ ] 구독 플로우 end-to-end (카테고리 6 체크박스)
- [ ] 다이제스트 Vercel Cron + 야간 차단 + 멱등성
- [ ] 설정·수신거부 페이지
- [ ] `/privacy`·`/terms`
- [ ] **`/admin/dashboard` shadcn/ui charts 8 KPI**
- [ ] 공유 루프 `/share/[id]?ref=xxx`
- [ ] OQ-M6 검증 ✅
- [ ] 첫 5명 테스터 end-to-end

### Phase 5+ (운영)
- [ ] WAU 500
- [ ] 4주 유지율 ≥ 40%
- [ ] 오픈률 35%+, CTR 8%+
- [ ] 에디터 Pick 커버리지 ≥ 60%
- [ ] KPI 주간 리뷰 루틴
- [ ] 제휴 콘솔사·포워더·학원 3~5곳

### Phase 5.5 (양면시장 + 운항)
- [ ] KAC/IIAC API 연동 + `/flights`
- [ ] `web/src/data/aircraft-types.ts` 30 ICAO 시드
- [ ] `aircraft_capacity` 테이블 + ULD 팝오버
- [ ] `/employers` Bento + 인재풀 분포
- [ ] `/contribute` capacity 제보
- [ ] `/admin/capacity`·`/admin/inquiries` 큐

### Phase 6 (비전)
- [ ] 별도 PRD 작성 후 진입

### Phase 7 (비전)
- [ ] 별도 PRD 작성 후 진입

---

## Changelog

- **2026-04-11 (v0.3)**: Cargo-First Pivot 반영. Phase 5.5 신규 (/employers + /flights + 기종 capacity + /contribute), Phase 6 Remember 벤치마크 비전, Phase 7 모바일 앱 + "아름" 확장 비전. North Star WAU 500 + 4주 유지율 ≥40% 변경. 관리자 shadcn/ui charts 대시보드 Phase 5 DoD 포함. Acquisition 채널 카고 중심 재편 (LinkedIn 한국 화물 그룹·화물 네이버 카페·사람인 화물 댓글). 수익화 축 전면 제거. 도메인 `arumcargo.vercel.app` 무료 확정. 기종 capacity 2단계 접근. 비카고 제목 차단 트리거 검증 추가.
- 2026-04-11 (v0.2): ADR 게이트 연결. §1 Phase 개요에 ADR 컬럼 추가·§2.2 v0.2 DoD 기준 추가·§3.2/§4.2/§5.2/§6.2 각 Phase DoD에 ADR Verification 체크 링크·§7.4 review trigger 테이블화하여 ADR review trigger와 매핑.
- 2026-04-11: 최초 작성. Phase 1~5+ DoD·의존·리스크·유예 항목 정리. D3·D4·D5·D6·D7 반영. OQ-B1·OQ-M6 Phase별 해결 시점 명시.
