import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { extname, join } from 'node:path';

assert(existsSync('dist/index.html'), 'missing homepage output');

const html = readFileSync('dist/index.html', 'utf8');

assert(html.includes('href="#main-content"'), 'missing skip link');
assert(html.includes('name="description"'), 'missing description metadata');
assert(html.includes('rel="canonical"'), 'missing canonical URL');
assert(!html.includes('Tracing failure across a TLS handshake'), 'fictional note leaked into production');
assert(!html.includes('qq-violation-bot'), 'excluded project leaked into homepage');

for (const path of ['dist/rss.xml', 'dist/robots.txt', 'dist/sitemap-index.xml']) {
  assert(existsSync(path), `missing ${path}`);
}

assert(existsSync('dist/pagefind/pagefind.js'), 'missing Pagefind bundle');

for (const path of [
  'dist/404.html',
  'dist/about/index.html',
  'dist/notes/index.html',
  'dist/projects/index.html',
  'dist/search/index.html',
]) {
  assert(existsSync(path), `missing ${path}`);
}

assert(!existsSync('dist/post'), 'retired Gmeek post output still exists');
assert(!html.includes('/post/'), 'retired Gmeek links remain on the homepage');
assert(!html.includes('draft-route-check'), 'draft route leaked into production');

const noteRoutes = existsSync('dist/notes')
  ? readdirSync('dist/notes', { withFileTypes: true }).filter((entry) => entry.isDirectory())
  : [];

if (noteRoutes.length === 0) {
  assert(html.includes('Notes coming soon'), 'missing honest empty state');
} else {
  assert(!html.includes('Notes coming soon'), 'empty state remains after publishing notes');
}

const rss = readFileSync('dist/rss.xml', 'utf8');
assert(rss.includes('<rss') && rss.includes('<channel>'), 'RSS output is malformed');

const robots = readFileSync('dist/robots.txt', 'utf8');
assert(robots.includes('Allow: /'), 'robots.txt does not allow crawling');
assert(robots.includes('https://coldspellhere.github.io/sitemap-index.xml'), 'robots.txt sitemap is incorrect');

const htmlFiles = (directory) => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const path = join(directory, entry.name);
  return entry.isDirectory() ? htmlFiles(path) : extname(path) === '.html' ? [path] : [];
});

for (const file of htmlFiles('dist')) {
  const document = readFileSync(file, 'utf8');
  for (const [, href] of document.matchAll(/href="(\/[^"]*)"/g)) {
    const pathname = href.split(/[?#]/, 1)[0];
    if (pathname.startsWith('/_astro/')) continue;
    const outputPath = pathname.endsWith('/')
      ? join('dist', pathname, 'index.html')
      : join('dist', pathname);
    assert(existsSync(outputPath), `${file} links to missing local output ${pathname}`);
  }
}

console.log('Build output verification passed.');
