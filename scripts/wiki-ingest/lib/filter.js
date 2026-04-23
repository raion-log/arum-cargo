// ADR-008 카고 우선: 비카고 직군 배제 (CLAUDE.md §5.1)
const BANNED_TITLE_RE = /(승무원|객실승무|스튜어디스|조종사|부기장|기장|항공정비사|정비사|파일럿|운항승무|지상조업원)/;

// 화물/물류/항공 관련 키워드 (제목 또는 설명에 1개 이상 매치 요구 — 소스별 옵션)
const CARGO_HINT_RE = /(화물|물류|카고|항공|공항|포워더|포워딩|특송|통관|관세|보세|3PL|콜드체인|AEO|SAF|프레이터|벨리|ULD|AWB|수출|수입|해운|터미널|허브|취항|운송|배송|택배)/;

export function isBannedTitle(title) {
  if (!title) return false;
  return BANNED_TITLE_RE.test(title);
}

export function hasCargoHint(text) {
  if (!text) return false;
  return CARGO_HINT_RE.test(text);
}

export function shouldKeep({ title, description = '', requireCargoHint = false }) {
  if (isBannedTitle(title)) return { keep: false, reason: 'banned-title' };
  if (requireCargoHint && !hasCargoHint(`${title} ${description}`)) {
    return { keep: false, reason: 'no-cargo-hint' };
  }
  return { keep: true };
}
