import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://kpopnamegenerator.com',
  integrations: [
    react(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      // Custom priority for different page types
      serialize(item) {
        // Homepage gets highest priority
        if (item.url === 'https://kpopnamegenerator.com/') {
          item.changefreq = 'daily';
          item.priority = 1.0;
        }
        // Blog posts
        else if (item.url.includes('/blog/')) {
          item.changefreq = 'weekly';
          item.priority = 0.8;
        }
        // Group generator pages
        else if (item.url.includes('-name-generator')) {
          item.changefreq = 'weekly';
          item.priority = 0.9;
        }
        // Static pages (about, contact, privacy, terms)
        else if (['about', 'contact', 'privacy', 'terms'].some(p => item.url.includes(`/${p}`))) {
          item.changefreq = 'monthly';
          item.priority = 0.5;
        }
        return item;
      }
    })
  ],
  output: 'static',
  build: {
    format: 'directory',  // /page/index.html format
    inlineStylesheets: 'auto' // Inline small CSS for better performance
  },
  image: {
    // Enable image optimization
    service: {
      entrypoint: 'astro/assets/services/sharp'
    }
  },
  vite: {
    build: {
      cssMinify: true,
      minify: true,
      rollupOptions: {
        output: {
          // Better chunk splitting for caching
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
          }
        }
      }
    }
  },
  // Prefetch optimization
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover'
  }
});

