// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://hekla.cc',

  /* Static output. There is no server-rendered page on this site, and a
     static build is what lets Vercel serve it from the edge cache. */
  output: 'static',

  /* `file` format emits /lead-agent.html, which Vercel's cleanUrls serves at
     /lead-agent. Combined with trailingSlash: 'never' there is exactly one
     URL per page and no redirect hop. */
  build: { format: 'file' },
  trailingSlash: 'never',

  integrations: [sitemap()],

  image: {
    /* AVIF first, WebP second, original last. Sharp handles all three. */
    responsiveStyles: true,
  },
});
