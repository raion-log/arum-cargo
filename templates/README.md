# Templater 템플릿 3종

이 폴더는 **Templater 플러그인** 용 템플릿입니다.

## 파일
- `source.md` — 새 source 페이지 (wiki/sources/YYYY-MM-DD-slug.md 로 자동 이동)
- `entity.md` — 새 entity 페이지 (wiki/entities/{slug}.md 로 자동 이동)
- `concept.md` — 새 concept 페이지 (wiki/concepts/{slug}.md 로 자동 이동)

## 1회 세팅 (Obsidian Settings → Templater)

1. **Templater → Template folder location**: `templates`
2. **Templater → Trigger Templater on new file creation**: ON
3. (선택) **Hotkeys** → "Templater: Create new note from template" 에 단축키 할당 (예: ⌘⇧T)

## 사용

### 방법 A: 단축키
1. ⌘⇧T (또는 Templater 명령) → 템플릿 선택 → 프롬프트 입력
2. 프롬프트 완료 시 파일이 올바른 위치로 자동 이동 + frontmatter 채워짐

### 방법 B: QuickAdd 연동 (권장)
1. **QuickAdd → Manage Macros** → "New Source" / "New Entity" / "New Concept" 매크로 추가
2. 각 매크로를 "Template" 액션으로 설정, 템플릿 파일 지정
3. 좌측 리본·단축키·명령 팔레트에서 원클릭 호출

## 작성 규칙

각 템플릿은 `wiki/schema.md` §3 템플릿 스펙을 준수:
- 공통 frontmatter: `title`, `type`, `created`, `updated`, `tags`
- source 전용: `source_url`, `source_name`, `source_date`, `entities[]`, `concepts[]`
- entity/concept 전용: `aliases[]`, `sources[]`, `related[]`

## 주의

- 템플릿 수정 시 `wiki/schema.md` §3 의 스펙과 동기화할 것
- 프롬프트 취소 (Esc) 시 파일이 원래 위치에 남음 — 수동 이동 필요
