/* global AbortSignal, fetch */

import { Buffer } from 'node:buffer';
import console from 'node:console';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import process from 'node:process';
import { URL } from 'node:url';

const register = readFileSync(
  new URL('../../../docs/SOURCES.md', import.meta.url),
  'utf8',
);
const primarySources = register.split('## 一级来源')[1].split('\n## ')[0];
const counts = { unchanged: 0, changed: 0, failed: 0, dynamic: 0 };

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function normalizedBody(html) {
  const cleaned = html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style|noscript)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '');
  const body =
    cleaned.match(/<main\b[^>]*>([\s\S]*?)<\/main\s*>/i) ??
    cleaned.match(/<body\b[^>]*>([\s\S]*?)<\/body\s*>/i);
  if (!body) throw new Error('HTML has no main or body element');
  return body[1]
    .replace(/<(\/?[a-z][a-z\d:-]*)\b(?:[^"'<>]|"[^"]*"|'[^']*')*>/gi, '<$1>')
    .replace(/\s+/g, ' ')
    .trim();
}

for (const row of primarySources.match(/^\| SRC-\d+ \|.*$/gm)) {
  const columns = row.split('|').map((column) => column.trim());
  const id = columns[1];
  const urls = columns[4].match(/https:\/\/[^\s；，（）]+/g);
  const snapshots = [
    ...columns[7].matchAll(
      /`(policy-sources\/[^`]+)`（sha256 `([a-f0-9]{64})`）/g,
    ),
  ];
  const pdfUrls = urls.filter((url) => url.endsWith('.pdf'));

  for (const [index, [, snapshot, expected]] of snapshots.entries()) {
    let url = snapshot.endsWith('.pdf') ? pdfUrls[index] : urls[index];
    if (snapshot.endsWith('.json')) {
      // The register records Hansard's snapshot API URL in its per-ID notes.
      const notes = register.split(`### ${id} `)[1].split('\n### ')[0];
      url = notes.match(/https:\/\/hansard-api\.parliament\.uk\/[^`]+/)[0];
    }
    const label = `${id} ${snapshot}`;
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }
      const bytes = Buffer.from(await response.arrayBuffer());
      const actual = sha256(bytes);
      console.log(
        `${label}: raw sha256 (expected ${expected}, actual ${actual})`,
      );
      if (id === 'SRC-011') {
        counts.dynamic++;
        console.log(`${label}: dynamic (动态列表，不计入 changed)`);
      } else if (
        url.startsWith('https://www.gov.uk/') &&
        snapshot.endsWith('.html')
      ) {
        const local = sha256(
          normalizedBody(
            readFileSync(
              new URL(`../../../${snapshot}`, import.meta.url),
              'utf8',
            ),
          ),
        );
        const remote = sha256(normalizedBody(bytes.toString('utf8')));
        if (local === remote) {
          counts.unchanged++;
          const reason =
            actual === expected
              ? '原始 hash 与正文均一致'
              : '原始 hash 变、正文一致';
          console.log(`${label}: unchanged (${reason})`);
        } else {
          counts.changed++;
          console.log(
            `${label}: changed (正文变; normalized sha256 expected ${local}, actual ${remote})`,
          );
        }
      } else if (actual === expected) {
        counts.unchanged++;
        console.log(`${label}: unchanged`);
      } else {
        counts.changed++;
        console.log(
          `${label}: changed (expected ${expected}, actual ${actual})`,
        );
      }
    } catch (error) {
      counts.failed++;
      const reason = error.cause?.message ?? error.message;
      console.log(`${label}: fetch failed (${reason})`);
    }
  }
}

console.log(
  `Summary: ${counts.unchanged} unchanged / ${counts.changed} changed / ${counts.failed} fetch failed / ${counts.dynamic} dynamic`,
);
process.exitCode = counts.changed || counts.failed ? 1 : 0;
