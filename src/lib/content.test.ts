import { describe, expect, it } from 'vitest';

import { collectTags, getPublishedNotes, hasPublishedNotes } from './content';

type TestNote = {
  id: string;
  data: {
    draft: boolean;
    publishedAt: Date;
    tags: string[];
  };
};

const note = (
  id: string,
  publishedAt: string,
  tags: string[],
  draft = false,
): TestNote => ({
  id,
  data: { draft, publishedAt: new Date(publishedAt), tags },
});

describe('content helpers', () => {
  it('excludes drafts', () => {
    const notes = [
      note('draft', '2026-08-07', ['networking'], true),
      note('published', '2026-08-06', ['networking']),
    ];

    expect(getPublishedNotes(notes)).toHaveLength(1);
  });

  it('sorts newest notes first', () => {
    const notes = [
      note('older', '2026-07-01', ['networking']),
      note('newer', '2026-08-01', ['ai-security']),
    ];

    expect(getPublishedNotes(notes).map((entry) => entry.id)).toEqual(['newer', 'older']);
  });

  it('returns an empty state for zero published notes', () => {
    expect(hasPublishedNotes([])).toBe(false);
  });

  it('collects stable lowercase tags', () => {
    const notes = [
      note('one', '2026-08-01', ['Networking', 'ai-security']),
      note('two', '2026-08-02', ['AI-Security']),
    ];

    expect(collectTags(notes)).toEqual(['ai-security', 'networking']);
  });
});
