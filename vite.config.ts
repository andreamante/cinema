import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

// Funzione che trova automaticamente TUTTI i file .html nel progetto
function trovaTuttiGliHtml() {
  const pagine: Record<string, string> = {};
  const rootDir = import.meta.dirname;
  
  const files = fs.readdirSync(rootDir);

  files.forEach((file: string) => {
    if (file.endsWith('.html')) {
      const nome = file.replace(/\.html$/, '');
      pagine[nome] = resolve(rootDir, file);
    }
  });

  return pagine;
}

export default defineConfig({
  build: {
    rollupOptions: {
      input: trovaTuttiGliHtml(),
    },
  },
});