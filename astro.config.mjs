// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://masykster.is-a.dev',
  
  // 2. Ubah base path kembali ke root '/' agar aset dicari di folder utama, bukan subfolder '/Portofolio/'
  base: '/',
  integrations: [react()],

  vite: {
    plugins: [tailwindcss()]
  }
});