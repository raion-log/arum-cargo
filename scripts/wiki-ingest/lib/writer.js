import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { slugify, isoDate } from './slug.js';

export class InboxWriter {
  constructor(inboxDir, { dryRun = false } = {}) {
    this.inboxDir = inboxDir;
    this.dryRun = dryRun;
  }

  // CLAUDE.md §5.1: 제목 + 요약(2~3문장) + 원문 링크 + 출처까지만.
  async write({
    source,            // e.g. 'cargonews'
    sourceUrl,         // source human-readable URL (for display)
    url,               // canonical article URL
    title,             // article title
    publishedAt,       // Date or ISO string
    summary = '',      // publisher-provided short summary (2-3 sentences)
    tags = [],
  }) {
    const dateStr = isoDate(publishedAt);
    const slug = slugify(title);
    const filename = `${dateStr}-${source}-${slug}.md`;
    const filepath = path.join(this.inboxDir, filename);

    const frontmatter = [
      '---',
      `source_url: ${url}`,
      `source_name: ${source}`,
      `source_date: ${dateStr}`,
      `captured_via: scraper`,
      tags.length ? `tags: [${tags.map((t) => JSON.stringify(t)).join(', ')}]` : null,
      '---',
    ]
      .filter(Boolean)
      .join('\n');

    const body = [
      '',
      `# ${title}`,
      '',
      `${dateStr} 게재 · 출처: ${sourceUrl || source}`,
      '',
      '## 출판사 제공 요약',
      summary || '_(요약 제공되지 않음)_',
      '',
      `원문: ${url}`,
      '',
    ].join('\n');

    if (this.dryRun) {
      console.log(`[dry-run] would write ${filepath}`);
      return { filepath, written: false };
    }

    await mkdir(this.inboxDir, { recursive: true });
    await writeFile(filepath, frontmatter + body, 'utf8');
    return { filepath, written: true };
  }
}
