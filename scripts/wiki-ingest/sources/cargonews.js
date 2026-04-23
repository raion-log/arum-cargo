import { XMLParser } from 'fast-xml-parser';
import { fetchText, clampSummary } from '../lib/http.js';
import { shouldKeep } from '../lib/filter.js';

const NAME = 'cargonews';
const FEED_URL = 'https://www.cargonews.co.kr/rss/allArticle.xml';
const MAX_ITEMS = 15;

export default async function scrape({ state, writer, log }) {
  const stats = { source: NAME, candidates: 0, written: 0, skipped: 0, errors: [] };

  const xml = await fetchText(FEED_URL).catch((e) => {
    stats.errors.push(`fetch: ${e.message}`);
    return null;
  });
  if (!xml) return stats;

  const parser = new XMLParser({ ignoreAttributes: false });
  const parsed = parser.parse(xml);
  const items = parsed?.rss?.channel?.item ?? [];
  const list = Array.isArray(items) ? items : [items];

  for (const item of list.slice(0, MAX_ITEMS)) {
    stats.candidates += 1;
    const title = (item.title || '').trim();
    const url = (item.link || '').trim();
    const description = clampSummary(item.description || '');
    const publishedAt = item.pubDate ? new Date(item.pubDate) : new Date();

    if (!title || !url) {
      stats.skipped += 1;
      continue;
    }
    if (state.has(url)) {
      stats.skipped += 1;
      continue;
    }

    const verdict = shouldKeep({ title, description });
    if (!verdict.keep) {
      log(`  - skip ${verdict.reason}: ${title.slice(0, 40)}`);
      stats.skipped += 1;
      state.add(url); // dedupe so we don't re-evaluate every day
      continue;
    }

    try {
      await writer.write({
        source: NAME,
        sourceUrl: 'https://www.cargonews.co.kr/',
        url,
        title,
        publishedAt,
        summary: description,
        tags: ['cargonews', '항공화물'],
      });
      state.add(url);
      stats.written += 1;
      log(`  + ${title.slice(0, 60)}`);
    } catch (e) {
      stats.errors.push(`write ${url}: ${e.message}`);
    }
  }

  return stats;
}
