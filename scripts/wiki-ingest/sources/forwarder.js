import * as cheerio from 'cheerio';
import { fetchText } from '../lib/http.js';
import { shouldKeep } from '../lib/filter.js';

const NAME = 'forwarder-jobs';
const BOARD_URL = 'https://www.forwarder.kr/bbs/board.php?bo_table=menu6_2_2';
const MAX_ITEMS = 20;

// forwarder.kr GNUBoard 채용 게시판 — 실제 HTML은 <a.recruit_list_content1_a> 카드 구조.
// 내부 div.recruit_list_content1_1_company2 = 회사, div.recruit_list_content1_2 = 공고제목,
// div.recruit_list_content1_1_company1 = 태그 (#포워더 #서울 등), div.recruit_list_content1_3_1 = MM-DD.
export default async function scrape({ state, writer, log }) {
  const stats = { source: NAME, candidates: 0, written: 0, skipped: 0, errors: [] };

  const html = await fetchText(BOARD_URL).catch((e) => {
    stats.errors.push(`fetch: ${e.message}`);
    return null;
  });
  if (!html) return stats;

  const $ = cheerio.load(html);
  const now = new Date();
  const thisYear = now.getUTCFullYear();
  const items = [];

  $('a.recruit_list_content1_a').each((_, el) => {
    const href = $(el).attr('href') || '';
    if (!/wr_id=\d+/.test(href)) return;

    const company = $(el).find('.recruit_list_content1_1_company2').first().text().replace(/\s+/g, ' ').trim();
    const jobTitle = $(el).find('.recruit_list_content1_2').first().text().replace(/\s+/g, ' ').trim();
    const tags = $(el).find('.recruit_list_content1_1_company1').first().text().replace(/\s+/g, ' ').trim();
    const dateText = $(el).find('.recruit_list_content1_3_1').first().text().replace(/\s+/g, ' ').trim();

    if (!jobTitle) return;

    const title = company ? `${company} — ${jobTitle}` : jobTitle;
    const summary = [jobTitle, tags].filter(Boolean).join(' / ');

    items.push({ url: href, title, summary, dateText });
  });

  for (const item of items.slice(0, MAX_ITEMS)) {
    stats.candidates += 1;
    if (state.has(item.url)) {
      stats.skipped += 1;
      continue;
    }

    const verdict = shouldKeep({
      title: item.title,
      description: item.summary,
      requireCargoHint: true, // 채용 게시판: 비항공·비화물 공고 배제
    });
    if (!verdict.keep) {
      log(`  - skip ${verdict.reason}: ${item.title.slice(0, 40)}`);
      stats.skipped += 1;
      state.add(item.url);
      continue;
    }

    // MM-DD → YYYY-MM-DD (미래 날짜면 전년도)
    let publishedAt = new Date();
    const m = /^(\d{1,2})-(\d{1,2})$/.exec(item.dateText);
    if (m) {
      const month = parseInt(m[1], 10) - 1;
      const day = parseInt(m[2], 10);
      let year = thisYear;
      const candidate = new Date(Date.UTC(year, month, day));
      if (candidate.getTime() - now.getTime() > 1000 * 60 * 60 * 24 * 7) year -= 1;
      publishedAt = new Date(Date.UTC(year, month, day));
    }

    try {
      await writer.write({
        source: NAME,
        sourceUrl: 'https://www.forwarder.kr/',
        url: item.url,
        title: item.title,
        publishedAt,
        summary: item.summary,
        tags: ['forwarder-jobs', '채용', '포워더'],
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
