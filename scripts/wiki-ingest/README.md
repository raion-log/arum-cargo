# wiki-ingest

항공 화물 뉴스/채용 사이트를 매일 스크래핑해 `raw/inbox/` 에 드롭하는 스크립트.
Wiki 변환(entity/concept 추출)은 별도로 `/ingest` 슬래시 커맨드로 수행한다.

## 파이프라인

```
[daily 07:00 KST]
        │
  ┌─────▼─────────┐
  │ GitHub Actions│   wiki-ingest-daily.yml
  └─────┬─────────┘
        │ node run.js
        ▼
  ┌─────────────────────────────┐
  │ sources/                    │
  │  cargonews.js   (RSS)       │
  │  aircargonews.js (RSS + UA) │
  │  cargopress.js   (HTML)     │
  │  forwarder.js    (HTML 채용)│
  └─────┬───────────────────────┘
        │ writer.js
        ▼
  raw/inbox/YYYY-MM-DD-source-slug.md   ← 제목 + URL + 요약(2~3문장)
        │
        │  (사람이 수동으로) /ingest
        ▼
  wiki/sources /entities /concepts
```

## 소스 현황

| source | 방식 | 상태 | 메모 |
|---|---|---|---|
| cargonews.co.kr | RSS `/rss/allArticle.xml` | ✅ 안정 | 항공·해운·물류 전섹션 |
| aircargonews.net | RSS `/feed/` (UA 스푸핑) | ✅ 안정 | WebFetch 로는 403, Node fetch 는 통과 |
| cargopress.co.kr | HTML 카드 스크래핑 | ⚠️ 카드 셀렉터 의존 | 발행일자 없음 → 수집 시점 날짜로 기록 |
| forwarder.kr (채용) | HTML 카드 스크래핑 | ⚠️ 셀렉터 의존 | MM-DD → YYYY-MM-DD 휴리스틱 |

## 필터링 규칙

- **금칙 제목** (CLAUDE.md §5.1 / ADR-008): `승무원·객실승무·스튜어디스·조종사·부기장·기장·항공정비사·정비사·파일럿·운항승무·지상조업원` 단어가 제목에 포함되면 스킵.
- **카고 힌트** (forwarder.kr 채용 게시판에만 적용): `화물|물류|카고|항공|공항|포워더|포워딩|특송|통관|관세|보세|3PL|콜드체인|AEO|SAF|프레이터|벨리|ULD|AWB|수출|수입|해운|터미널|허브|취항|운송|배송|택배` 중 하나 이상 매치 요구.

## 상태 관리

`scripts/wiki-ingest/.state/seen-urls.json` — 이미 드롭한 URL 목록. 매 실행마다 갱신·커밋. 중복 드롭 방지.

## 로컬 실행

```bash
cd scripts/wiki-ingest
npm install
node run.js                 # 실제 실행 (raw/inbox/ 에 파일 생성)
DRY_RUN=1 node run.js       # 시뮬레이션 (파일 안 씀)
ONLY=cargonews node run.js  # 특정 소스만
```

## 스케줄링

- GitHub Actions `.github/workflows/wiki-ingest-daily.yml`
- `0 22 * * *` UTC = **07:00 KST**
- 변경분을 `wiki-ingest-bot` 계정으로 `raw/inbox/` 에 커밋 + 푸시
- 수동 실행: Actions 탭 → `wiki-ingest-daily` → Run workflow

## 새 소스 추가 절차

1. `sources/<name>.js` 생성, `export default async function ({state, writer, log})` 시그니처 준수.
2. RSS 가 있으면 `fast-xml-parser`, 없으면 `cheerio` 로 HTML 파싱.
3. `writer.write({ source, sourceUrl, url, title, publishedAt, summary, tags })` 호출.
4. `state.has(url)` 로 중복 체크, 기록은 `state.add(url)`.
5. `shouldKeep({ title, description, requireCargoHint? })` 통과 항목만 write.
6. `run.js` 의 `SOURCES` 배열에 등록.

## 법적·윤리적 제약 (CLAUDE.md §5.1)

- 뉴스 원문 **본문 저장 금지** — 출판사 제공 요약(≤240자) + 원문 링크 + 출처만.
- 인스타그램·페이스북 스크래핑 금지 (Meta ToS).
- 새 소스 추가 전에 해당 사이트의 `robots.txt` 및 이용약관 확인 의무.
- 작성자 실명·회사명·학교명 노출 금지 (CLAUDE.md §2.3).
