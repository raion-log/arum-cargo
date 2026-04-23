import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

export class State {
  constructor(statePath) {
    this.path = statePath;
    this.seen = new Set();
    this.loaded = false;
  }

  async load() {
    if (!existsSync(this.path)) {
      this.loaded = true;
      return;
    }
    const raw = await readFile(this.path, 'utf8');
    const arr = JSON.parse(raw);
    this.seen = new Set(arr);
    this.loaded = true;
  }

  has(url) {
    return this.seen.has(url);
  }

  add(url) {
    this.seen.add(url);
  }

  async save() {
    await mkdir(path.dirname(this.path), { recursive: true });
    const arr = [...this.seen].sort();
    await writeFile(this.path, JSON.stringify(arr, null, 2) + '\n', 'utf8');
  }

  get size() {
    return this.seen.size;
  }
}
