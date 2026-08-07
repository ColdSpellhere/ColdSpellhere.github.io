export type NoteLike = {
  id: string;
  data: {
    draft: boolean;
    publishedAt: Date;
    tags: string[];
  };
};

export function getPublishedNotes<T extends NoteLike>(notes: T[]): T[] {
  return notes
    .filter((note) => !note.data.draft)
    .sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
}

export function hasPublishedNotes<T extends NoteLike>(notes: T[]): boolean {
  return getPublishedNotes(notes).length > 0;
}

export function collectTags<T extends NoteLike>(notes: T[]): string[] {
  return [
    ...new Set(
      getPublishedNotes(notes).flatMap((note) =>
        note.data.tags.map((tag) => tag.trim().toLowerCase()),
      ),
    ),
  ].sort();
}
