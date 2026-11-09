import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

function copyMappedExerciseGifs() {
  return {
    name: 'copy-mapped-exercise-gifs',
    apply: 'build',
    closeBundle() {
      const mapPath = path.join(projectRoot, 'exercise-gif-map.json');
      const map = JSON.parse(readFileSync(mapPath, 'utf8').replace(/^\uFEFF/, ''));
      const filenames = new Set(map.entries
        .filter(entry => ['confirmed', 'probable'].includes(entry.status))
        .map(entry => entry.gif)
        .filter(filename => /^\d{4}\.gif$/.test(filename || '')));
      const destination = path.join(projectRoot, 'dist', 'assets');
      mkdirSync(destination, { recursive: true });

      for (const filename of filenames) {
        const source = path.join(projectRoot, 'assets', filename);
        if (!existsSync(source)) throw new Error(`Mapped exercise GIF is missing: ${source}`);
        copyFileSync(source, path.join(destination, filename));
      }
      console.info(`Copied ${filenames.size} reviewed exercise GIFs to dist/assets.`);
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), copyMappedExerciseGifs()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/lucide-react/')) return 'icons';
          if (id.includes('/node_modules/react/')) return 'react-vendor';
        }
      }
    }
  },
  server: { proxy: { '/api': 'http://localhost:10000' } }
});
