import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://kpopnamegenerator.com',
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes('/legal/')
    })
  ],
  output: 'static',
  build: {
    format: 'directory'  // /page/index.html 형식
  },
  vite: {
    build: {
      cssMinify: true,
      minify: true
    }
  }
});

