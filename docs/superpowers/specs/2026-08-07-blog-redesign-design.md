# ColdSpell Blog Redesign

**Date:** 2026-08-07
**Status:** Approved for implementation planning
**Repository:** `ColdSpellhere/ColdSpellhere.github.io`

## 1. Goal

Replace the current Gmeek-generated site with a maintainable Astro-based personal site that combines:

- a technical profile and selected-work homepage;
- a Markdown-first knowledge base;
- fast bilingual full-text search;
- GitHub-native comments;
- a bright visual language inspired by modern large-company AI products such as Tencent WorkBuddy, without copying its brand assets or identity.

The site must remain a fully static GitHub Pages deployment.

## 2. Product Positioning

The site has two equal roles:

1. **Technical identity:** communicate ColdSpell's work across cybersecurity, networking, AI engineering, Linux systems, deployment, and open-source contributions.
2. **Knowledge archive:** publish structured technical notes written as repository-managed Markdown or MDX.

The homepage introduces the person and selected work first, then transitions into search, research collections, notes, and projects.

## 3. Confirmed Decisions

- Replace Gmeek instead of extending its generated templates.
- Use Astro as the static-site framework.
- Store future articles as Markdown or MDX in the repository.
- Use an English interface; individual notes may be Chinese or English.
- Do not migrate or publish any of the four existing Gmeek posts.
- Keep existing GitHub Issues untouched, but do not link the retired posts from the new site.
- Use the current repository as the GitHub Pages source.
- Launch with an empty notes collection and a visible `Notes coming soon` state.
- Preserve GitHub-native comments for future notes through utterances and repository Issues.
- Do not add a dark theme in the first release.
- Do not add a CMS, database, server runtime, user accounts, analytics, or advertising.

## 4. Visual Direction

### 4.1 Character

The site should feel:

- bright and lightweight;
- modern and product-oriented;
- technically credible without imitating a terminal;
- spacious without looking like a generic portfolio template;
- friendly enough for general readers and structured enough for technical material.

### 4.2 Visual Language

- Backgrounds: clean white and very pale blue-violet surfaces.
- Primary accent: vivid product blue.
- Secondary accents: restrained violet and fresh cyan/teal.
- Text: dark desaturated blue, never pure black.
- Borders: light blue-gray, used sparingly.
- Effects: soft aurora gradients, translucent surfaces, subtle shadows, and one abstract hero illustration.
- Geometry: moderate rounded corners on interactive and content surfaces; no universal card grid.
- Motion: short, low-amplitude transitions; respect `prefers-reduced-motion`.

The design must not use:

- black or near-black backgrounds;
- grid-pattern backgrounds;
- terminal emulation;
- financial-market dashboards;
- large technology-logo walls;
- template-like skill meters;
- copied Tencent or WorkBuddy logos, graphics, text, or proprietary assets.

### 4.3 Homepage Composition

1. Compact navigation.
2. Bright hero with technical positioning, two calls to action, and an original abstract aurora visual.
3. Prominent search entry.
4. Research collections.
5. Latest notes or the empty notes state.
6. Selected projects and verified open-source contributions.
7. Minimal footer with GitHub, RSS, and contact links.

## 5. Information Architecture

| Route | Purpose |
| --- | --- |
| `/` | Personal positioning, research themes, selected work, latest notes, and empty state |
| `/notes/` | Searchable and filterable note archive |
| `/notes/[slug]/` | Note body, table of contents, metadata, navigation, and comments |
| `/topics/[tag]/` | Tag-specific note archive |
| `/projects/` | Original projects and verified open-source contributions |
| `/about/` | Short biography, technical focus, and external links |
| `/search/` | Full search interface and filterable results |
| `/rss.xml` | RSS feed for published notes |
| `/robots.txt` | Crawler policy |
| `/sitemap-index.xml` | Generated sitemap |
| `/404.html` | Helpful not-found page with search and primary navigation |

The retired Gmeek routes under `/post/*.html` will not be recreated. They may return the new 404 page after deployment. Their source remains recoverable through Git history and their Issues remain on GitHub.

## 6. Content Model

### 6.1 Notes Collection

Notes live under `src/content/notes/` and use a validated schema.

Required frontmatter:

```yaml
title: "Tracing failure across a TLS handshake"
description: "A reproducible packet-level investigation."
publishedAt: 2026-08-07
language: en
tags:
  - networking
  - tls
draft: false
```

Optional frontmatter:

```yaml
updatedAt: 2026-08-08
series: "Network Troubleshooting"
featured: true
cover: "./cover.webp"
```

Rules:

- `language` accepts `en` or `zh-CN`.
- Tags are lowercase stable identifiers; translated display names live in site data.
- Draft notes are excluded from pages, RSS, sitemap, and search.
- Invalid or incomplete frontmatter fails the production build.
- A note does not need a cover image.

### 6.2 Projects Data

Selected work lives in a typed data file rather than Markdown prose. Each entry contains:

- name;
- repository URL;
- short verified description;
- technology labels;
- category;
- display order;
- optional live URL.

The initial project data will include only verified public work. `qq-violation-bot` remains excluded from the featured list.

### 6.3 Contributions Data

Verified contributions are stored separately with:

- upstream repository;
- pull-request number and URL;
- concise contribution description;
- merge date.

The first release may include the already verified MAA and MaaMacGui pull requests used in the Profile README.

## 7. Component Boundaries

- `SiteHeader`: responsive navigation and mobile menu.
- `Hero`: technical positioning and original aurora illustration.
- `SearchEntry`: opens or links to the Pagefind search experience.
- `ResearchCollections`: topic summaries derived from published notes, with a deliberate empty state.
- `LatestNotes`: newest published notes or `Notes coming soon`.
- `SelectedProjects`: typed project data only.
- `OpenSourceContributions`: verified pull-request data only.
- `NoteCard`: shared note summary presentation.
- `NoteLayout`: article metadata, content, table of contents, previous/next navigation, and comments.
- `SearchUI`: custom visual wrapper around Pagefind.
- `IssueComments`: utterances embed configured for this repository.
- `SiteFooter`: RSS, GitHub, and contact links.

Each component owns one presentation responsibility. Content querying remains in pages or dedicated data helpers rather than inside visual components.

## 8. Search, Tags, and Language

Pagefind runs after the Astro production build and indexes generated static HTML.

- Only meaningful page content is indexed.
- Draft notes are absent from the generated site and therefore from the index.
- Search results expose title, description, date, language, and tags.
- The notes archive supports tag and language filters.
- Chinese and English content share the same search interface.
- The `<html lang>` value matches each note's declared language.
- The English interface does not translate article bodies.

## 9. Comments

Future note pages use utterances with:

- repository: `ColdSpellhere/ColdSpellhere.github.io`;
- issue mapping: note pathname;
- a dedicated comments label;
- a light theme matching the site.

Behavior:

- No Issue is required until a reader starts a discussion.
- Existing Gmeek Issues are not deleted, closed, renamed, or modified.
- Removed legacy posts do not expose comment embeds on the new site.
- Comment failure must not block article rendering; the page shows the article even if the embed cannot load.

## 10. Empty and Error States

### Empty Notes Collection

The homepage and `/notes/` display:

> Notes coming soon. Research logs and practical field notes will appear here.

Research areas, projects, and contributions remain visible. No fictional article titles, counts, metrics, or publication dates are shown.

### Search Without Content

The search page explains that no notes are published yet and links to projects and GitHub. Once notes exist, the same page activates search automatically.

### Missing Content

- Unknown routes render the custom 404 page.
- Missing optional images fall back to a text-only note layout.
- Invalid required metadata fails the build instead of generating partial pages.
- External comments and external project links do not affect the static build.

## 11. Build and Deployment

### 11.1 Build Flow

```text
Repository content and data
        ↓
Astro schema validation and static build
        ↓
Pagefind static index generation
        ↓
Link and output checks
        ↓
GitHub Pages artifact deployment
```

### 11.2 GitHub Actions

Replace the Gmeek workflow with one GitHub Pages workflow that:

1. checks out the repository;
2. installs the pinned Node.js LTS runtime;
3. installs dependencies from `package-lock.json` with `npm ci`;
4. runs type/content checks;
5. builds Astro;
6. builds the Pagefind index into `dist/`;
7. verifies the static output;
8. uploads and deploys `dist/` through the official Pages actions.

The workflow uses least-privilege permissions: read access for repository contents and only the Pages and OIDC permissions required for deployment.

If a build fails, the existing deployed site remains live because no new Pages artifact is promoted.

## 12. Repository Migration

Remove the Gmeek runtime and generated content:

- `.github/workflows/Gmeek.yml`;
- `backup/`;
- `blogBase.json`;
- `config.json`;
- generated blog files currently under `docs/`, except repository documentation under `docs/superpowers/`.

Add the Astro application structure:

```text
.
├── .github/workflows/deploy.yml
├── docs/superpowers/
├── public/
├── src/
│   ├── components/
│   ├── content/notes/
│   ├── data/
│   ├── layouts/
│   ├── pages/
│   └── styles/
├── astro.config.mjs
├── package.json
├── package-lock.json
└── tsconfig.json
```

The `.superpowers/` visual-brainstorm directory is local-only and must not be committed.

## 13. Verification Strategy

### Automated

- Astro content-schema and type checks.
- Production build from a clean dependency install.
- Pagefind index generation with zero notes and with a test fixture during tests.
- Internal-link validation against the generated `dist/` output.
- Unit coverage for content filtering, sorting, and empty-state helpers.
- Draft exclusion checks for pages, RSS, sitemap, and search.
- RSS and sitemap parsing.
- HTML validation for required metadata and language attributes.

### Visual and Interaction

- Desktop, tablet, and mobile viewport review.
- Navigation and mobile-menu behavior.
- Homepage aurora rendering without horizontal overflow.
- Reduced-motion behavior.
- Empty notes and empty search states.
- Note typography for Chinese and English samples.
- Search, tag, and language filtering once fixture content is present.
- Utterances loading failure does not break note content.

### Performance and Accessibility

- Production Lighthouse review for performance, accessibility, best practices, and SEO.
- Keyboard navigation through header, search, filters, and note links.
- Visible focus states and sufficient color contrast.
- Responsive images and no unnecessary client-side framework runtime.

## 14. Rollback

The migration is recoverable through Git history. If the new deployment fails after merge:

1. revert the migration commit;
2. rerun the restored Gmeek workflow or redeploy the last known Pages artifact;
3. investigate the Astro build on a separate branch before retrying.

No existing Issues or external content are deleted as part of the migration.

## 15. Acceptance Criteria

The redesign is ready when:

- the approved bright visual direction is implemented without black backgrounds or grid patterns;
- the homepage renders truthful projects and contributions with an honest empty notes state;
- the site builds statically from a clean checkout;
- Markdown schema validation, RSS, sitemap, search generation, and link checks pass;
- the site works at `https://coldspellhere.github.io/` on desktop and mobile;
- future Markdown notes automatically appear in archives, topics, RSS, sitemap, and search;
- comments are available on future notes without affecting page rendering;
- the four retired Gmeek posts do not appear anywhere on the new site;
- no Gmeek runtime or generated blog artifact remains in the deployed output;
- `.superpowers/` is not committed;
- no commit, push, or deployment occurs without explicit user authorization.

## 16. Out of Scope

- A dark theme in the first release.
- Migrating old Gmeek articles or their comment threads into the new site.
- A CMS or browser-based editor.
- Authentication, accounts, private content, or server-side APIs.
- Analytics, advertisements, visitor counters, or engagement tracking.
- Automated translation of article content.
- Invented project metrics, publication counts, or research results.
