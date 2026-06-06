// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';


// https://astro.build/config
export default defineConfig({
  integrations: [mdx()],
  site: 'https://gopherart.com', // 1. Меняем старый адрес на ваш новый личный домен
  
  // base: '/gopher-art/',        // 2. ЭТУ СТРОКУ НУЖНО УДАЛИТЬ (или закомментировать)
  
  trailingSlash: 'always', 
  build: {
    format: 'directory' 
  }
});
