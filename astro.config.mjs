import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://coldspellhere.github.io',
  integrations: [sitemap()],
  output: 'static',
  trailingSlash: 'always',
});
