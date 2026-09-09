import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://nrsrcoconsultants.com',
  compressHTML: true,
  build: {
    format: 'directory'
  }
});
