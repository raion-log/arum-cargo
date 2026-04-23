---
description: wiki/ 의 링크·프런트매터·고아 페이지 품질 점검 (schema.md §7)
argument-hint: ""
---

당신은 지금 이 저장소의 wiki 관리자입니다.

## 작업 순서 (엄격히 준수)

1. **반드시 먼저** `wiki/schema.md` 를 읽어 최신 워크플로우·제약을 로드하세요.
2. `wiki/index.md` 와 `wiki/log.md` 를 읽어 현재 wiki 상태를 파악하세요.

## 점검 항목 (schema.md §7)

아래 항목을 순서대로 점검하고 결과를 표로 보고하세요.

### 1. 고아 페이지 (Orphan)
- `wiki/sources/`, `wiki/entities/`, `wiki/concepts/` 의 모든 페이지 목록 수집
- `wiki/index.md` 에 링크가 없는 페이지 → **고아** 표시
- (index.md 에서라도 링크되면 OK)

### 2. 깨진 wikilink
- 각 페이지의 `[[...]]` 링크를 파싱
- 링크가 가리키는 파일이 실제로 존재하는지 확인
- 없으면 **깨진 링크** 표시 (파일명·링크 값 함께)

### 3. Frontmatter 누락·오류
- `type`, `created`, `updated` 필드가 모두 있는지 확인
- `type: source` 페이지에 `source_url`, `source_name`, `source_date` 가 있는지 확인
- 누락 시 해당 파일 목록 보고

### 4. 업데이트 필요 페이지
- `updated:` 날짜가 30일 이상 경과 + 관련 source 가 최근 추가된 entity/concept 페이지
- 재요약·갱신 권장 페이지 목록 제시

### 5. 모순 미해결 마커
- `## ⚠️ 모순 기록` 섹션이 있는 페이지 목록
- 생성일 기준 30일 이상 경과한 항목 우선 표시

### 6. 중복 의심 페이지
- `aliases:` 또는 제목이 겹치는 페이지 탐지
- 통합 검토 필요 후보 제시

## 마무리

1. `wiki/log.md` 끝에 append:
   ```
   ## [YYYY-MM-DD] lint | summary
   - 고아: N건
   - 깨진 링크: N건
   - frontmatter 오류: N건
   - 모순 미해결: N건
   - 중복 의심: N건
   - 조치 필요 항목: (있으면 목록)
   ```
2. 사용자에게 **우선순위 순** 조치 필요 항목 보고 (심각 → 경고 → 제안 순)
3. 즉시 자동 수정 가능한 항목(프런트매터 날짜 오기입 등)은 수정 후 보고

## 절대 금지

- `raw/` 파일 수정
- schema.md §1, §2, §8 사용자 승인 없이 수정
- 고아 페이지 자동 삭제 (삭제는 사용자 확인 후)
