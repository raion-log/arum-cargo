<%*
// Templater: 새 Source 페이지 생성 시 자동 실행
// 사용법: QuickAdd 또는 Templater 단축키 → 이 템플릿 선택
// 파일 위치: wiki/sources/YYYY-MM-DD-slug.md 로 이동시킴
const today = tp.date.now("YYYY-MM-DD");
const slug = await tp.system.prompt("Source slug (kebab-case, 예: fedex-korea-aeo-aa)", "");
const title = await tp.system.prompt("제목 (한국어)", "");
const sourceUrl = await tp.system.prompt("원문 URL", "");
const sourceName = await tp.system.prompt("출처명 (예: 카고뉴스)", "");
const sourceDate = await tp.system.prompt("원문 게시일 (YYYY-MM-DD)", today);
const filename = `${today}-${slug}`;
await tp.file.rename(filename);
await tp.file.move(`/wiki/sources/${filename}`);
-%>
---
title: <% title %>
type: source
created: <% today %>
updated: <% today %>
source_url: <% sourceUrl %>
source_name: <% sourceName %>
source_date: <% sourceDate %>
tags: []
entities: []
concepts: []
---

# <% title %>

## 한 줄 요약


## 핵심 시사점
- 
- 
- 

## 본문 발췌
> (≤140자 × 3개 이내. 원문 통째 복사 금지.)

## 관련 엔티티·개념
- [[entities/]]
- [[concepts/]]

## 원본 링크
- [원문 보기](<% sourceUrl %>) — <% sourceName %>, <% sourceDate %>
