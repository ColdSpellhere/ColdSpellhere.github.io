# ColdSpell — Technical Home & Notes

A bright, static technical home built with Astro. It combines selected engineering work with a Markdown-first knowledge base covering security, networking, AI engineering, Linux, automation, and deployment.

## Local development

Requires Node.js 24 or newer and npm.

```bash
npm ci
npm run dev
```

Astro serves the development site at the local URL printed in the terminal.

## Write a note

Create a Markdown or MDX file under `src/content/notes/`. Filenames become URL identifiers, so use a stable lowercase slug such as `tracing-dns-resolution.md`.

```yaml
---
title: Tracing DNS resolution on macOS
description: A practical walk through the resolver path and useful diagnostics.
publishedAt: 2026-08-07
updatedAt: 2026-08-08 # optional
language: en # en or zh-CN
tags:
  - networking
  - macos
draft: true
series: Network field notes # optional
featured: false # optional
cover: /images/example.png # optional
---
```

Set `draft: true` while writing. Drafts are excluded from note pages, topic collections, search-facing pages, RSS, and the sitemap. Change it to `false` when the note is ready to publish.

## Verification

```bash
npm run check
npm test
npm run build
```

The full build performs Astro type checking, unit tests, static generation, Pagefind indexing, and output assertions. The production site is written to `dist/`.

## Project structure

```text
src/content/notes/   Markdown and MDX notes
src/data/            Site, project, and contribution data
src/components/      Reusable interface sections
src/layouts/         Shared page and note layouts
src/pages/           Static routes and feeds
src/styles/          Global design system
scripts/             Build-output verification
```

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`. GitHub Actions installs the locked dependencies, runs the full verified build, uploads `dist/`, and deploys it with GitHub Pages.

Comments on published notes use utterances with pathname-based GitHub Issue mapping. Existing repository Issues are not modified by the migration.
