import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: process.env.NEXT_PUBLIC_SITE_URL || 'https://isthistechdead.com',
  outDir: './dist',
  trailingSlash: 'never',
});
