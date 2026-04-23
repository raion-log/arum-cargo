import * as cheerio from 'cheerio';
import { fetchText, clampSummary, stripHtml } from '../lib/http.js';
import { shouldKeep } from '../lib/filter.js';

const NAME = 'cargopress';
const LIST_URL = 'https://www.cargopress.co.kr/korean/';
const BASE = 'https://www.cargopress.co.kr/korean/';
const MAX_ITEMS = 15;

// cargopress 는 RSS 미제공. 메인 페이지 카드 목록에서 news_view.php?nd=NUMBER 링크를 긁어온다.
// 카드 구조: <li><a href="news_view.php?nd=X"><img></a><h4><a>제목</a></h4><p>요약</p></li>
export default async function scrape({ state, writer, log }) {
  const stats = { source: NAME, candidates: 0, written: 0, skipped: 0, errors: [] };

  const html = await fetchText(LIST_URL).catch((e) => {
    stats.errors.push(`fetch list: ${e.message}`);
    return null;
  });
  if (!html) return stats;

  const $ = cheerio.load(html);
  const seen = new Set();
  const items = [];

  $('a[href*="news_view.php?nd="]').each((_, el) => {
    const href = $(el).attr('href') || '';
    const match = href.match(/news_view\.php\?nd=(\d+)/);
    if (!match) return;
    const nd = match[1];
    if (seen.has(nd)) return;
    seen.add(nd);

    const url = new URL(href, BASE).toString();

    // Title: prefer h4 text if present, else the link's own text (skipping image-only links).
    let title = $(el).text().trim();
    if (!title) {
      // anchor wraps an image → look for sibling <h4><a> inside the same <li>
      const li = $(el).closest('li');
      title = li.find('h4 a').first().text().trim();
    }

    // Summary: <p> within the same list item.
    const li = $(el).closest('li');
    const summary = clampSummary(stripHtml(li.find('p').first().html() || ''));

    if (!title) return;
    items.push({ nd, url, title, summary });
  });

  for (const item of items.slice(0, MAX_ITEMS)) {
    stats.candidates += 1;
    if (state.has(item.url)) {
      stats.skipped += 1;
      continue;
    }

    const verdict = shouldKeep({ title: item.title, description: item.summary });
    if (!verdict.keep) {
      log(`  - skip ${verdict.reason}: ${item.title.slice(0, 40)}`);
      stats.skipped += 1;
      state.add(item.url);
      continue;
    }

    try {
      // cargopress 카드에는 날짜가 없음 — 수집 시점 날짜로 기록. 실제 발행일은 /ingest 단계에서 보정.
      await writer.write({
        source: NAME,
        sourceUrl: BASE,
        url: item.url,
        title: item.title,
        publishedAt: new Date(),
        summary: item.summary,
        tags: ['cargopress', '항공화물'],
      });
      state.add(item.url);
      stats.written += 1;
      log(`  + ${item.title.slice(0, 60)}`);
    } catch (e) {
      stats.errors.push(`write ${item.url}: ${e.message}`);
    }
  }

  return stats;
}
