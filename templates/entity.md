<%*
const today = tp.date.now("YYYY-MM-DD");
const slug = await tp.system.prompt("Entity 파일명 (kebab-case, 한국어 OK, 예: 대한항공-화물)", "");
const title = await tp.system.prompt("정식 명칭 (한국어)", "");
const aliases = await tp.system.prompt("별칭 (쉼표 구분, 예: KE Cargo, Korean Air Cargo)", "");
const category = await tp.system.suggester(
  ["항공사", "특송사", "포워더-3PL", "공항", "기종", "협회-기관", "기타"],
  ["항공사", "특송사", "포워더-3PL", "공항", "기종", "협회-기관", "기타"]
);
await tp.file.rename(slug);
await tp.file.move(`/wiki/entities/${slug}`);
-%>
---
title: <% title %>
type: entity
created: <% today %>
updated: <% today %>
aliases: [<% aliases %>]
tags: [<% category %>]
sources: []
related: []
---

# <% title %>

## 개요
<!-- 2~4문장 핵심 프로필 -->

## 주요 사실
- 

## 한국 시장 관련성


## 관련 개념
- [[concepts/]]

## 관련 엔티티
- [[entities/]]

## 출처
- [[sources/]]

## 변경 이력
- <% today %>: 페이지 생성
