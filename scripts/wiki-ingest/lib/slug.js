const LATIN_RE = /[a-z0-9]/i;

export function slugify(text, maxLen = 60) {
  if (!text) return 'untitled';
  const ascii = text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, maxLen);

  if (LATIN_RE.test(ascii)) return ascii || 'untitled';

  // Korean/non-latin fallback: short hash
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  }
  return `ko-${hash.toString(36)}`;
}

export function isoDate(d) {
  return new Date(d).toISOString().slice(0, 10);
}
