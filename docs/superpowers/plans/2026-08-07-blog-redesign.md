# ColdSpell Blog Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Gmeek-generated blog with a bright, WorkBuddy-inspired Astro site that combines a truthful technical homepage with a Markdown-first knowledge base.

**Architecture:** Astro statically renders profile, project, archive, topic, and note pages from typed local data and a validated notes collection. Pagefind indexes the generated HTML, utterances supplies optional GitHub Issue comments, and GitHub Actions deploys the `dist/` artifact to GitHub Pages.

**Tech Stack:** Astro, TypeScript, npm, Vitest, Pagefind, `@astrojs/rss`, `@astrojs/sitemap`, utterances, GitHub Pages

**Repository constraint:** Do not commit, push, close Issues, or deploy without explicit user authorization. The plan therefore uses diff checkpoints instead of commit steps.

---

## File Map

### Project configuration

- Create `package.json`: scripts and pinned dependencies.
- Create `package-lock.json`: reproducible npm install.
- Create `astro.config.mjs`: canonical site URL, sitemap, Markdown and build configuration.
- Create `tsconfig.json`: strict Astro TypeScript configuration.
- Create `vitest.config.ts`: helper-unit-test configuration.
- Create `.gitignore`: ignore dependencies, build output, cache files, and `.superpowers/`.
- Replace `.github/workflows/Gmeek.yml` with `.github/workflows/deploy.yml`.

### Content and data

- Create `src/content.config.ts`: validated notes collection schema.
- Create `src/content/notes/.gitkeep`: empty initial notes collection.
- Create `src/data/site.ts`: site identity, navigation, external links, research themes.
- Create `src/data/projects.ts`: verified public projects.
- Create `src/data/contributions.ts`: verified merged upstream contributions.
- Create `src/lib/content.ts`: note filtering, sorting, tag collection, and empty-state helpers.
- Create `src/lib/content.test.ts`: unit coverage for the helpers.

### Presentation

- Create `src/styles/global.css`: design tokens, typography, layout, responsive states, focus states, reduced motion.
- Create `src/layouts/BaseLayout.astro`: canonical metadata, Open Graph, header, footer, skip link.
- Create `src/layouts/NoteLayout.astro`: note metadata, body, table of contents, navigation, comments.
- Create focused components under `src/components/`: `SiteHeader`, `SiteFooter`, `Hero`, `SearchEntry`, `ResearchCollections`, `LatestNotes`, `SelectedProjects`, `OpenSourceContributions`, `NoteCard`, `IssueComments`, and `EmptyNotes`.

### Routes

- Create `src/pages/index.astro`.
- Create `src/pages/notes/index.astro`.
- Create `src/pages/notes/[id].astro`.
- Create `src/pages/topics/[tag].astro`.
- Create `src/pages/projects.astro`.
- Create `src/pages/about.astro`.
- Create `src/pages/search.astro`.
- Create `src/pages/rss.xml.ts`.
- Create `src/pages/robots.txt.ts`.
- Create `src/pages/404.astro`.

### Static assets and validation

- Create `public/favicon.svg`.
- Create `scripts/verify-build.mjs`: validate output files, metadata, retired-post exclusion, and Pagefind bundle.
- Create `tests/fixtures/notes/`: bilingual fixtures used only by tests.

### Removed Gmeek artifacts

- Delete tracked generated pages under `docs/` except `docs/superpowers/`.
- Delete `backup/`, `blogBase.json`, `config.json`, and `.github/workflows/Gmeek.yml`.
- Replace the generated Gmeek `README.md` with repository usage and writing instructions.

---

## Task 1: Scaffold Astro and Establish a Failing Baseline

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `.gitignore`
- Create: `src/pages/index.astro`

- [ ] **Step 1: Record the pre-migration failure**

Run:

```bash
npm run check
```

Expected: FAIL because `package.json` and the `check` script do not exist.

- [ ] **Step 2: Add the package scripts**

Create `package.json` with these scripts:

```json
{
  "name": "coldspell-blog",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "check": "astro check",
    "test": "vitest run",
    "build:site": "astro build",
    "build:search": "pagefind --site dist",
    "build": "npm run check && npm run test && npm run build:site && npm run build:search && node scripts/verify-build.mjs",
    "preview": "astro preview"
  }
}
```

- [ ] **Step 3: Install current compatible releases and generate the lockfile**

Run:

```bash
npm install astro @astrojs/check @astrojs/rss @astrojs/sitemap pagefind
npm install --save-dev typescript vitest @types/node
```

Expected: `package-lock.json` exists and `npm ls --depth=0` exits 0.

- [ ] **Step 4: Add strict Astro configuration**

`astro.config.mjs` must set:

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://coldspellhere.github.io',
  integrations: [sitemap()],
  output: 'static',
  trailingSlash: 'always',
});
```

`tsconfig.json` must extend `astro/tsconfigs/strict`.

- [ ] **Step 5: Add a minimal page and verify the scaffold**

Create a minimal `src/pages/index.astro` with a document title and run:

```bash
npm run check
npm run build:site
```

Expected: both commands exit 0 and `dist/index.html` exists.

- [ ] **Step 6: Inspect scope**

Run:

```bash
git status -sb
git diff --check
```

Expected: only intended scaffold files plus the approved spec/plan are changed or untracked.

---

## Task 2: Implement Typed Content and Verified Data

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/notes/.gitkeep`
- Create: `src/data/site.ts`
- Create: `src/data/projects.ts`
- Create: `src/data/contributions.ts`
- Create: `src/lib/content.ts`
- Create: `src/lib/content.test.ts`

- [ ] **Step 1: Write failing helper tests**

Tests must prove:

```ts
it('excludes drafts', () => {
  expect(getPublishedNotes([{ data: { draft: true } }, { data: { draft: false } }])).toHaveLength(1);
});

it('sorts newest notes first', () => {
  expect(getPublishedNotes(sampleNotes).map((note) => note.id)).toEqual(['newer', 'older']);
});

it('returns an empty state for zero published notes', () => {
  expect(hasPublishedNotes([])).toBe(false);
});

it('collects stable lowercase tags', () => {
  expect(collectTags(sampleNotes)).toEqual(['ai-security', 'networking']);
});
```

- [ ] **Step 2: Run the tests to verify failure**

Run:

```bash
npm test -- src/lib/content.test.ts
```

Expected: FAIL because `src/lib/content.ts` does not exist.

- [ ] **Step 3: Implement the schema and helpers**

The notes schema must validate `title`, `description`, `publishedAt`, `language`, `tags`, and `draft`, with optional `updatedAt`, `series`, `featured`, and `cover`.

Implement pure helper functions:

```ts
export function getPublishedNotes(notes) {
  return notes
    .filter((note) => !note.data.draft)
    .sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
}

export function hasPublishedNotes(notes) {
  return getPublishedNotes(notes).length > 0;
}

export function collectTags(notes) {
  return [...new Set(getPublishedNotes(notes).flatMap((note) => note.data.tags))].sort();
}
```

- [ ] **Step 4: Add truthful site, project, and contribution data**

Use the verified project set:

- `ZhiYu-CancerPrediction`;
- `Neuro-BirthdayWeb`;
- `brew-md-txt-log`.

Use the verified merged contribution set:

- MAA PR `#16870`;
- MAA PR `#16978`;
- MaaMacGui PR `#91`.

Do not add project metrics, publication counts, employers, or `qq-violation-bot`.

- [ ] **Step 5: Rerun tests and checks**

Run:

```bash
npm test -- src/lib/content.test.ts
npm run check
```

Expected: all tests pass and Astro reports zero errors.

---

## Task 3: Build the Design System and Accessible Shell

**Files:**
- Create: `src/styles/global.css`
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/SiteHeader.astro`
- Create: `src/components/SiteFooter.astro`
- Create: `public/favicon.svg`

- [ ] **Step 1: Add a failing shell assertion**

Extend `scripts/verify-build.mjs` initially to require:

```js
assert(html.includes('href="#main-content"'), 'missing skip link');
assert(html.includes('name="description"'), 'missing description metadata');
assert(html.includes('rel="canonical"'), 'missing canonical URL');
```

Run `npm run build:site && node scripts/verify-build.mjs` and expect failure.

- [ ] **Step 2: Implement the approved visual tokens**

Use CSS custom properties for:

```css
:root {
  --color-bg: #f8fbff;
  --color-surface: #ffffff;
  --color-text: #2a3b59;
  --color-muted: #70819d;
  --color-line: #dce6f3;
  --color-primary: #5a78f4;
  --color-violet: #7d5bf5;
  --color-cyan: #37cbb8;
  --radius-sm: 0.75rem;
  --radius-lg: 1.25rem;
  --shadow-soft: 0 1.25rem 4rem rgba(66, 99, 159, 0.13);
}
```

Add visible keyboard focus, responsive spacing, and reduced-motion rules. Do not add a dark theme or grid background.

- [ ] **Step 3: Implement the shared shell**

`BaseLayout.astro` must render canonical metadata, Open Graph metadata, a skip link, `SiteHeader`, `<main id="main-content">`, and `SiteFooter`.

- [ ] **Step 4: Verify shell output**

Run:

```bash
npm run check
npm run build:site
node scripts/verify-build.mjs
```

Expected: required shell assertions pass.

---

## Task 4: Implement the Approved Homepage and Empty State

**Files:**
- Create: `src/components/Hero.astro`
- Create: `src/components/SearchEntry.astro`
- Create: `src/components/ResearchCollections.astro`
- Create: `src/components/LatestNotes.astro`
- Create: `src/components/EmptyNotes.astro`
- Create: `src/components/SelectedProjects.astro`
- Create: `src/components/OpenSourceContributions.astro`
- Replace: `src/pages/index.astro`

- [ ] **Step 1: Add failing empty-state checks**

Add build assertions for:

```js
assert(html.includes('Notes coming soon'), 'missing honest empty state');
assert(!html.includes('Tracing failure across a TLS handshake'), 'fictional note leaked into production');
assert(!html.includes('qq-violation-bot'), 'excluded project leaked into homepage');
```

Run the verifier and expect failure before the homepage implementation.

- [ ] **Step 2: Implement the hero**

Use the approved copy and an original CSS/SVG aurora visual. The hero must include links to selected work and the notes archive, but no copied WorkBuddy assets.

- [ ] **Step 3: Implement content-driven homepage sections**

- Research collections derive counts only from real published notes.
- With zero notes, counts are omitted and `Notes coming soon` is shown.
- Projects and contributions render from typed verified data.
- Search entry links to `/search/`.

- [ ] **Step 4: Verify truthfulness and responsiveness**

Run:

```bash
npm run check
npm test
npm run build:site
node scripts/verify-build.mjs
```

Expected: no fictional notes or counts appear in `dist/index.html`.

---

## Task 5: Implement Notes, Topics, Projects, About, and 404 Routes

**Files:**
- Create: `src/components/NoteCard.astro`
- Create: `src/components/IssueComments.astro`
- Create: `src/layouts/NoteLayout.astro`
- Create: `src/pages/notes/index.astro`
- Create: `src/pages/notes/[id].astro`
- Create: `src/pages/topics/[tag].astro`
- Create: `src/pages/projects.astro`
- Create: `src/pages/about.astro`
- Create: `src/pages/404.astro`

- [ ] **Step 1: Add a temporary draft fixture**

Create a draft note during local verification with complete bilingual-safe frontmatter and confirm it does not generate an output page.

- [ ] **Step 2: Implement note and topic routes**

`getStaticPaths()` must use only `getPublishedNotes()`. Topic pages must be derived from `collectTags()` and render the same note summary component as the archive.

- [ ] **Step 3: Implement article layout and comments**

The note layout must set its `<html lang>`, render headings and metadata, and include utterances configured with pathname mapping and the comments label. Loading failure must leave the article readable.

- [ ] **Step 4: Implement truthful static pages**

- Projects use verified data.
- About uses the approved technical positioning without employer information.
- 404 links to home, notes, projects, and search.

- [ ] **Step 5: Verify route generation and draft exclusion**

Run:

```bash
npm run check
npm run build:site
find dist -maxdepth 3 -type f | sort
```

Expected: required static routes exist and the draft note route does not.

Remove the temporary draft fixture after the check.

---

## Task 6: Add Search, RSS, Sitemap, and Robots

**Files:**
- Create: `src/pages/search.astro`
- Create: `src/pages/rss.xml.ts`
- Create: `src/pages/robots.txt.ts`
- Update: `scripts/verify-build.mjs`

- [ ] **Step 1: Add failing output checks**

The verifier must require:

```js
for (const path of ['dist/rss.xml', 'dist/robots.txt', 'dist/sitemap-index.xml']) {
  assert(existsSync(path), `missing ${path}`);
}
assert(existsSync('dist/pagefind/pagefind.js'), 'missing Pagefind bundle');
```

- [ ] **Step 2: Implement empty-safe RSS and robots output**

RSS must emit a valid channel with zero items when no notes exist. `robots.txt` must allow crawling and reference the sitemap URL.

- [ ] **Step 3: Implement the custom Pagefind UI**

The search page must load Pagefind only when the user interacts with search. Before any notes exist, it must show the same honest empty state and links to projects and GitHub.

- [ ] **Step 4: Build and verify search artifacts**

Run:

```bash
npm run build
```

Expected: check, tests, Astro build, Pagefind indexing, and the output verifier all pass.

---

## Task 7: Remove Gmeek and Replace Deployment

**Files:**
- Delete: `.github/workflows/Gmeek.yml`
- Create: `.github/workflows/deploy.yml`
- Delete: `backup/`
- Delete: `blogBase.json`
- Delete: `config.json`
- Delete: generated `docs/index.html`, `docs/post/`, `docs/postList.json`, `docs/rss.xml`, `docs/tag.html`
- Replace: `README.md`

- [ ] **Step 1: Add the Pages workflow**

The workflow must trigger on pushes to `main` and manual dispatch, use `npm ci`, run `npm run build`, upload `dist/`, and deploy with the official Pages actions. Permissions must be limited to:

```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

- [ ] **Step 2: Replace repository documentation**

README must explain local setup, article frontmatter, draft behavior, build verification, and deployment. It must not contain generated counts.

- [ ] **Step 3: Remove Gmeek artifacts**

Delete only the paths listed above. Preserve `docs/superpowers/` and all Git history. Do not modify, close, or delete GitHub Issues.

- [ ] **Step 4: Verify migration scope**

Run:

```bash
git status -sb
git diff --check
git diff --stat
git diff --name-status
```

Expected: Gmeek artifacts are deleted, Astro sources are added, `.superpowers/` is ignored, and no unrelated path changed.

---

## Task 8: Full Verification and Visual QA

**Files:**
- Update only files required to fix issues discovered by verification.

- [ ] **Step 1: Verify from a clean dependency state**

Run:

```bash
rm -rf node_modules dist
npm ci
npm run build
```

Expected: exit 0 with all tests and build checks passing.

- [ ] **Step 2: Serve the production output**

Run Pagefind's local server or an equivalent static server against `dist/` and inspect the generated site rather than relying on the development server.

- [ ] **Step 3: Perform responsive browser QA**

Check at minimum:

- 1440 × 900 desktop;
- 768 × 1024 tablet;
- 390 × 844 mobile.

Verify no horizontal overflow, readable typography, working navigation, visible focus states, reduced motion, empty notes, empty search, projects, about, and 404.

- [ ] **Step 4: Validate external and internal links**

Verify all repository, pull-request, GitHub, RSS, sitemap, and navigation URLs. Report external network failures separately from broken local links.

- [ ] **Step 5: Run final repository checks**

Run:

```bash
npm run check
npm test
npm run build
git diff --check
git status -sb
git diff --stat
```

Expected: all commands pass; the working tree contains only the approved redesign; no commit or push has occurred.

---

## Plan Self-Review Checklist

- [ ] Every approved spec section maps to an implementation task.
- [ ] No legacy article is copied into the new content collection.
- [ ] Empty-state verification prevents fictional notes and metrics.
- [ ] Project and contribution data use only verified public links.
- [ ] Search, RSS, sitemap, comments, 404, accessibility, and deployment are covered.
- [ ] Gmeek removal preserves `docs/superpowers/` and Git history.
- [ ] `.superpowers/` remains local-only.
- [ ] No step commits, pushes, deploys, or changes Issues without explicit authorization.
