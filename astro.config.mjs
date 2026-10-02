// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://quixt.dev',
  trailingSlash: 'always',
  build: { format: 'directory' },
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
      changefreq: 'monthly',
      lastmod: new Date(),
      priority: 0.7,
      serialize(item) {
        if (item.url === 'https://quixt.dev/') item.priority = 1.0;
        if (item.url.endsWith('/contact/')) item.priority = 0.9;
        return item;
      },
    }),
  ],
});
