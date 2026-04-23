---
marp: true
theme: gaia
paginate: true
header: '**아름 카고 · LLM 전용 Wiki 구축기**'
footer: '2026-04-23 · 아름 카고 (Arum Cargo)'
style: |
  section {
    font-size: 26px;
    font-family: 'Pretendard Variable', 'Apple SD Gothic Neo', sans-serif;
  }
  section.lead h1 { font-size: 58px; color: #1e40af; }
  section.lead h2 { color: #64748b; font-weight: 400; }
  section h1 { color: #1e40af; }
  section h2 { color: #334155; }
  code { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; }
  pre { font-size: 18px; background: #0f172a; color: #e2e8f0; }
  table { font-size: 20px; }
  .muted { color: #64748b; }
  .box { border-left: 4px solid #1e40af; padding: 6px 14px; background: #f8fafc; }
---

<!-- _class: lead -->
<!-- _paginate: false -->

# 아름 카고 LLM 전용 Wiki 구축기

## 항공 화물 지식자산화 — 방법 · 재료 · 결과물

<br>

**2026-04-23 · Rev 1.0**
_Karpathy llm-wiki 방법론 기반_

---

## 1. 왜 LLM 전용 Wiki 를 만들었나

**문제**:
- 카고 업계 정보가 **뉴스·공고·보고서**로 매일 쏟아지지만, 구조화되어 쌓이지 않음
- 사용자가 매번 검색 → LLM 이 매번 처음부터 맥락 학습 = **반복 비용**
- 개인 지식이 **시간 지나면 휘발** — 11년차 현직자도 3년 전 업계 구조를 기억 못함

**목표**:
> LLM 과 사람이 **같은 지식 그래프** 를 공유하며, 새 자료는 자동으로 편입되어 누적되는 구조

---

## 2. 원리: Karpathy llm-wiki

- Andrej Karpathy 가 제안한 **"LLM 을 위한 위키"** 방법론
  - 원문: [llm-wiki.md](https://github.com/karpathy) / 저장소 내 번역: `llm-wiki.ko.md`
- 핵심 아이디어 3가지
  1. **불변의 원본 (Raw)** — 사람이 수집, LLM 은 읽기만
  2. **LLM 소유의 정리본 (Wiki)** — 사람은 읽기, LLM 이 전적으로 유지
  3. **규율 문서 (Schema)** — LLM 세션이 항상 먼저 읽는 설정

> "Context engineering for personal knowledge"

---

## 3. 3-레이어 아키텍처

```
┌──────────────────────────────────────────────────┐
│  raw/         원본 (불변, 사용자 소유)            │
│    inbox/       ← Web Clipper · 스크래퍼 드롭존  │
│    sources/   ← 처리 완료 보관                    │
│    assets/      이미지·PDF 첨부                   │
├──────────────────────────────────────────────────┤
│  wiki/        LLM 소유 지식베이스                 │
│    sources/     자료 1건 = 페이지 1개 (요약)      │
│    entities/    고유명사 (회사·공항·기종)         │
│    concepts/    개념·용어 (AWB·SAF·AEO)           │
│    index.md     카탈로그                          │
│    log.md       시간순 이벤트 로그                │
├──────────────────────────────────────────────────┤
│  wiki/schema.md  LLM 운영 규율 SSOT               │
│  CLAUDE.md       프로젝트 규칙 SSOT                │
└──────────────────────────────────────────────────┘
```

---

## 4. Raw 레이어 — 재료의 드롭존

**원칙**: LLM 은 **읽기만**, 사용자가 쓰기/이동 담당

| 하위 | 용도 | 채우는 주체 |
|---|---|---|
| `raw/inbox/` | 처리 전 자료 대기 | Obsidian Web Clipper · 자동 스크래퍼 · 수동 드롭 |
| `raw/sources/YYYY-MM/` | 처리 완료 보관 | 사용자 (제안만 LLM) |
| `raw/assets/` | 이미지·PDF | Obsidian attachment |

> **불변성 규칙**: 한번 수집한 원본은 수정·삭제 금지 (schema.md §1)

---

## 5. Wiki 레이어 — 지식의 정리본

세 종류의 페이지, **Obsidian wikilink 로 상호 연결**:

- **Sources** (`wiki/sources/YYYY-MM-DD-slug.md`)
  - 자료 1건의 요약 · 핵심 시사점 3~7개 · 원문 링크
- **Entities** (`wiki/entities/<이름-kebab>.md`)
  - 회사 · 공항 · 기종 · 인물 · 제품 · 조직
- **Concepts** (`wiki/concepts/<용어>.md`)
  - AWB · ULD · AEO · SAF · 3PL · Belly · Freighter …

모든 페이지는 **YAML frontmatter** (Dataview 호환) + **양방향 링크** 로 그래프 구성

---

## 6. Schema 레이어 — LLM 운영 규율

**`wiki/schema.md`** · 280줄 · LLM 세션의 첫 입력

- 9개 섹션: 아키텍처 · Frontmatter · 페이지 템플릿 · 링크 컨벤션 · Ingest 워크플로우 · Query · Lint · 프로젝트 제약 · 변경 규칙
- **§8 프로젝트 고유 제약** (CLAUDE.md 상속):
  - 뉴스 원문 저장 금지 (제목 + 요약 + 링크만)
  - 인스타그램 크롤링 금지 (Meta ToS)
  - 실명·회사명 노출 금지
  - 승무원·조종사·정비사 자료 ingest 금지 (ADR-008 Cargo-first)

---

## 7. 워크플로우 — `/ingest` 슬래시 커맨드

```
사용자:                          LLM:
┌──────────┐                    ┌──────────────────────┐
│ raw/inbox│  ──────read───→    │ 1. schema.md 로드      │
│  /*.md   │                    │ 2. 자료별 읽고 보고    │
└──────────┘                    │ 3. sources/ 페이지 생성│
                                │ 4. entities/concepts   │
                                │    식별 + 생성/갱신    │
                                │ 5. 모순 검출 (⚠️)      │
                                │ 6. index.md 갱신       │
                                │ 7. log.md append       │
                                │ 8. 보고                │
                                └──────────────────────┘
```

**실행**: Claude Code 에서 `/ingest` 입력 → 대상 인식 → 자동 처리

---

## 8. 재료 ① — 뉴스 스크래퍼 (4개 소스)

**`scripts/wiki-ingest/`** · Node 20+ · ~550 LOC · ESM

| 소스 | 방식 | 상태 | 카테고리 |
|---|---|---|---|
| cargonews.co.kr | RSS `/rss/allArticle.xml` | ✅ 안정 | 한국 카고 통합 |
| aircargonews.net | RSS `/feed/` + UA | ✅ 안정 | 글로벌 영문 |
| cargopress.co.kr | HTML 카드 스크래핑 | ⚠️ 셀렉터 의존 | 한국 카고 |
| forwarder.kr (채용) | HTML 카드 + 카고 힌트 필터 | ⚠️ 셀렉터 의존 | 채용 공고 |

**자동화**: `.github/workflows/wiki-ingest-daily.yml` — 매일 **07:00 KST** 실행

---

## 9. 재료 ② — 법적·윤리적 제약

<!-- _class: invert -->

### 뉴스 저작권 (CLAUDE.md §5.1)

- 본문 전체 저장 ❌
- 제목 + 요약(≤240자) + 원문 링크 + 출처명 ✅
- 라이선스된 RSS `description` 필드까지만 재사용

### 개인정보 (CLAUDE.md §2.3)

- 실명 · 회사명 · 학교명 · 직책 노출 금지
- About 페이지에서 작성자 → "11년차 항공 화물 현직자"로만

### 스코프 (ADR-008)

- 승무원 · 조종사 · 정비사 자료 ingest 금지
- 필터: `/(승무원|객실|조종사|부기장|기장|정비사)/` regex로 제목 차단

---

## 10. 결과물 ① — Sources 5개 (파일럿)

**2026-04-20 ~ 2026-04-22 cargonews RSS 파일럿**

| 날짜 | 제목 | 핵심 시사점 |
|---|---|---|
| 04-22 | JAL 3월 국제선 화물 +8.5% | 일본발 국제 수요 회복 |
| 04-22 | 페덱스코리아 AEO 'AA' 이중 획득 | 보세+운송주선 동시 최고등급 (업계 유일) |
| 04-22 | 대한항공·아시아나 합동 CSR | 합병 후 통합 행보 관찰 포인트 |
| 04-20 | DHL ↔ IAG Cargo SAF 5년 계약 | LHR 연 4천만 ℓ × 5년 = 2.4억 ℓ |
| 04-20 | CJ대한통운 MODEX 2026 | 애틀랜타 3PL·콜드체인 어필 |

---

## 11. 결과물 ② — Entities 7개

```
항공사 (여객·화물)
  ├─ 대한항공-화물 (KE Cargo) — ICN 허브, 합병 진행
  ├─ 아시아나항공-화물 (OZ Cargo) — 합병 재편 중
  ├─ 일본항공 (JAL, JL) — 도쿄 HND·NRT
  └─ IAG-Cargo — BA·Iberia 그룹, LHR 허브

특송사 / 인티그레이터
  ├─ 페덱스코리아 (FedEx Korea) — AEO AA 이중
  └─ DHL — 인천 북아시아 허브

포워더 / 3PL
  └─ CJ대한통운 — 북미 콜드체인 켄자스·조지아
```

모두 `sources:` 역참조 + `related:` 링크 자동 구축

---

## 12. 결과물 ③ — Concepts 3개

| 개념 | 정의 | 왜 중요한가 |
|---|---|---|
| **AEO** | 관세청 수출입 안전관리 우수업체 | 통관 속도 · 공급망 신뢰도 직결 (AAA > AA > A 등급) |
| **SAF** | 지속가능항공연료 (바이오·e-fuel) | Scope 3 감축 · 화주 프리미엄 · Book-and-Claim 크레딧 |
| **3PL** | 제3자물류 (계약 기반 아웃소싱) | 1PL~5PL 스펙트럼 · 항공 영업 직결 카테고리 |

각 개념 페이지는 **정의 + 왜 중요한가 + 구조 + 관련 용어 + 출처 역참조** 템플릿 준수

---

## 13. 자동화 — 매일 07:00 KST

```
[GitHub Actions cron: 0 22 * * *  (UTC) = 07:00 KST]
            │
            ▼
  node scripts/wiki-ingest/run.js
            │
            ▼
  ┌─────────────────────────────┐
  │ 4개 소스 스크래핑           │
  │ ├ 금칙 제목 필터            │
  │ ├ 카고 힌트 필터 (채용)     │
  │ └ seen-urls.json 중복 체크  │
  └─────────────┬───────────────┘
                ▼
  raw/inbox/YYYY-MM-DD-source-slug.md
                │
                ▼
  git commit "chore(wiki-ingest): N new items"
  git push origin dev
                │
                ▼
  (수동) /ingest → wiki/ 변환
```

---

## 14. Wikilink 그래프 구조

**양방향 링크** — Obsidian 그래프 뷰에서 시각화

```
[[sources/2026-04-20-dhl-iag-cargo-saf]]
     │              │              │
     ▼              ▼              ▼
[[entities/DHL]] [[entities/IAG-Cargo]] [[concepts/SAF]]
     │              │                     │
     └──related─────┘                     │
              ▼                           │
    [[concepts/SAF]] ←──── related ───────┘
```

**Orphan 금지 규칙**: 모든 페이지는 최소 1개 들어오는 링크 필요 (schema.md §4)

---

## 15. 통계 (첫 ingest 후)

<!-- _class: invert -->

<div class="box">

### 📊 2026-04-22 파일럿 결과

| 항목 | 개수 |
|---|---|
| Sources | **5** |
| Entities | **7** |
| Concepts | **3** |
| 처리 소요 | ~25분 (수동 /ingest) |
| 자동 스크래퍼 후보 (1일치) | **56건** |
| 자동 스크래퍼 활성 소스 | **4개** |

</div>

> **다음 일일 증분 예상**: 10~25건 (중복 제거 후)

---

## 16. 다음 단계

**즉시 활성 가능**
1. `main` 에 머지 → GitHub Actions 활성화 → 내일 07:00 KST 첫 자동 실행
2. 누적된 raw/inbox 일괄 `/ingest` (수동 트리거)

**Phase 5 대기**
3. **Worknet OpenAPI** (`data.go.kr #3038225`) — 공식 채용 API, 무료
4. **Saramin OpenAPI** — 500 req/day 무료
5. **recruiter.co.kr 템플릿 스크래퍼** — 대한항공·로지스올 등 5+ 기업 1개 스크래퍼로 커버

**Lint 자동화**
6. `/lint` 주기 실행 → orphan · 깨진 링크 · 30일+ 미갱신 감지

---

## 17. 참고 링크

**저장소 내부**
- [`wiki/schema.md`](../../wiki/schema.md) — LLM 운영 규율 SSOT
- [`wiki/index.md`](../../wiki/index.md) — 전체 카탈로그
- [`wiki/log.md`](../../wiki/log.md) — 시간순 이벤트 로그
- [`scripts/wiki-ingest/README.md`](../../scripts/wiki-ingest/README.md) — 스크래퍼 운영 가이드
- [`llm-wiki.ko.md`](../../llm-wiki.ko.md) — Karpathy 원리 번역

**외부**
- Karpathy llm-wiki 원문 (GitHub)
- [Marp for Obsidian](https://samuele-cozzi.github.io/obsidian-marp-slides/)
- [data.go.kr #3038225](https://www.data.go.kr/data/3038225/openapi.do) — Worknet
- [Saramin OpenAPI](https://oapi.saramin.co.kr/guide/job-search)

---

<!-- _class: lead -->
<!-- _paginate: false -->

# 끝.

## 질문 · 피드백

<br>

**브랜드**: 아름 카고 (Arum Cargo)
**저장소**: `github.com/raion-log/arum-cargo`
**도메인**: `arumcargo.vercel.app` (MVP)
