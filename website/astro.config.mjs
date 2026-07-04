import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || 'https://jobehi.github.io',
  base: process.env.BASE_PATH || '/isThisTechDead',
  build: {
    assets: 'assets',
  },
  outDir: './dist',
});
