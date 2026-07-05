import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || 'https://jobehi.github.io',
  base: process.env.BASE_PATH === '/' ? undefined : process.env.BASE_PATH || '/isThisTechDead',
  build: {
    assets: 'assets',
  },
  integrations: [sitemap()],
  outDir: './dist',
});
