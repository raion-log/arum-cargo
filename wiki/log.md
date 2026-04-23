---
title: Wiki Log
type: log
created: 2026-04-22
---

# Wiki Log

> 시간순 append-only 로그. 포맷: `## [YYYY-MM-DD] <event> | <title>`
> event 타입: `bootstrap` · `ingest` · `query` · `lint` · `schema`
> 파싱 팁: `grep "^## \[" wiki/log.md | tail -10`

---

## [2026-04-22] bootstrap | Wiki scaffolding 초기화

- 생성: `wiki/schema.md`, `wiki/index.md`, `wiki/log.md`
- 구조: `wiki/{sources,entities,concepts}/` + `raw/{inbox,assets}/`
- `.gitignore` 에 Obsidian workspace 캐시 제외 규칙 + `.claude/commands/` 추적 허용
- `/ingest` 슬래시 커맨드 등록 (`.claude/commands/ingest.md`)
- 참조: [llm-wiki.ko.md](../llm-wiki.ko.md) (Karpathy 원리)

## [2026-04-22] schema | CLAUDE.md §2.4 추가 — Wiki 레이어를 프로젝트 규칙 SSOT에 포인터 등록

- `CLAUDE.md` §2.4 신설: 3-레이어 구조 · `/ingest` 사용법 · 페이지 타입 · Obsidian 도구 명시
- 목적: 새 Claude 세션이 CLAUDE.md 자동 로드 시점에 wiki 시스템 존재를 인지하도록
- 변경 파일: `CLAUDE.md`

## [2026-04-22] ingest | cargonews.co.kr RSS 파일럿 5건

- 소스: `https://www.cargonews.co.kr/rss/allArticle.xml` (S1N3 항공 섹션 포함)
- 처리 자료 5건 (raw/inbox/ + wiki/sources/):
  - [[sources/2026-04-22-jal-intl-cargo-up]]
  - [[sources/2026-04-22-fedex-korea-aeo-aa]]
  - [[sources/2026-04-22-koreanair-asiana-csr]]
  - [[sources/2026-04-20-dhl-iag-cargo-saf]]
  - [[sources/2026-04-20-cj-logistics-modex-2026]]
- entities 생성: 7 / 갱신: 0
  - 일본항공, 페덱스코리아, DHL, IAG-Cargo, CJ대한통운, 대한항공-화물, 아시아나항공-화물
- concepts 생성: 3 / 갱신: 0
  - AEO, SAF, 3PL
- 모순 플래그: 0
- 참고: 본 ingest 는 `/ingest` 슬래시 커맨드 표준 파이프라인(raw → wiki)의 첫 실전 적용. 이후 `/schedule` 로 매일 자동화 검토.

## [2026-04-22] infra | wiki-ingest 자동화 스크래퍼 도입

- 신규 디렉토리 `scripts/wiki-ingest/` — Node 20+ ESM 프로젝트
- 4개 소스 스크래퍼 구현:
  - cargonews (RSS) · aircargonews (RSS+UA) · cargopress (HTML) · forwarder-jobs (HTML)
- 공통 라이브러리: `lib/{state,writer,filter,http,slug}.js`
- 필터: 금칙 제목(CLAUDE.md §5.1) + 카고 힌트(forwarder 한정) + URL 중복(`.state/seen-urls.json`)
- GitHub Actions: `.github/workflows/wiki-ingest-daily.yml` — 07:00 KST 실행, `wiki-ingest-bot` 으로 `raw/inbox/` 에 커밋/푸시
- 드라이런 검증 완료 (4개 소스 모두 후보 추출 성공)
- 레이어 분리: **scraper = 자동(raw 드롭)**, **`/ingest` = 수동/LLM 필요(wiki 변환)**

## [2026-04-23] ingest | cargonews·cargopress 뉴스 27건 + forwarder.kr 채용 19건 (총 46건)

- 처리 파일: `raw/inbox/` 전량 46건
- sources 생성: 46
  - 뉴스 (cargonews 12건 + cargopress 15건): 27건
  - 채용공고 (forwarder.kr): 19건
- entities 생성: 26 / 갱신: 1
  - 신규: 중국동방항공, 에어프레미아, HACTL, Teleport, 말레이시아항공, 에티하드카고, 리에주공항, 브뤼셀공항, 에어제타, LX판토스, NX홀딩스, 선진로지스틱스, 유나이티드항공, 캐세이퍼시픽, 이스탄불공항, 세바로지스틱스, GEODIS, 엑소텍, CJ올리브네트웍스, 네오트랜스해운항공, KFL, 아메리칸항공카고, CH로빈슨, 실크웨이항공, HD현대마린솔루션, 스카이로드
  - 갱신: 페덱스코리아 (cargopress 출처 역참조 추가)
- concepts 생성: 8 / 갱신: 0
  - 신규: BAI, 콜드체인, 포워딩-오퍼레이터, 항공화물허브, 그린물류, 제약물류, 반도체물류, 물류자동화
- 모순 플래그: 0
- 중복 보도 표기: 3건 (중국동방항공 XIY-VIE, 에어프레미아 화물 홈페이지, 페덱스코리아 AEO) — 카고뉴스·카고프레스 동일 사건 별도 페이지로 처리, ⚠️ 참고 섹션 추가
