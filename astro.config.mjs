// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';


// https://astro.build/config
export default defineConfig({
  integrations: [mdx()],
  site: 'https://digopher.github.io',
  base: '/gopher-art/',
  trailingSlash: 'always', // Принудительно добавлять слэш в конце ссылок
  build: {
    format: 'directory' // Собирать страницы как folder/index.html
  }
});
