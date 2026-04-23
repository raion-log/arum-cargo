<%*
const today = tp.date.now("YYYY-MM-DD");
const slug = await tp.system.prompt("Concept 파일명 (예: AWB 또는 콜드체인)", "");
const title = await tp.system.prompt("정식 명칭 (풀네임 포함, 예: AWB (Air Waybill, 항공화물운송장))", "");
const aliases = await tp.system.prompt("별칭 (쉼표 구분)", "");
const tags = await tp.system.prompt("카테고리 태그 (쉼표 구분, 예: 운송서류,통관,항공화물)", "");
await tp.file.rename(slug);
await tp.file.move(`/wiki/concepts/${slug}`);
-%>
---
title: <% title %>
type: concept
created: <% today %>
updated: <% today %>
aliases: [<% aliases %>]
tags: [<% tags %>]
sources: []
related: []
---

# <% title %>

## 정의
<!-- 1~2문장 -->

## 왜 중요한가
<!-- 이 도메인(카고)에서의 역할 -->

## 구조·변형
- 

## 주요 사례
- 

## 관련 용어
- [[concepts/]]

## 출처
- [[sources/]]

## 변경 이력
- <% today %>: 페이지 생성
