import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

import { site } from '../data/site';
import { getPublishedNotes } from '../lib/content';

export async function GET(context: { site?: URL }) {
  const notes = getPublishedNotes(await getCollection('notes'));

  return rss({
    title: `${site.name} Notes`,
    description: site.description,
    site: context.site ?? site.url,
    items: notes.map((note) => ({
      title: note.data.title,
      description: note.data.description,
      pubDate: note.data.publishedAt,
      link: `/notes/${note.id}/`,
      categories: note.data.tags,
    })),
  });
}
