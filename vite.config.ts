import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        'study-guide': resolve(__dirname, 'study-guide.html'),
        'formula-sheet': resolve(__dirname, 'formula-sheet.html'),
        practice: resolve(__dirname, 'practice.html'),
        simulators: resolve(__dirname, 'simulators.html'),
        flashcards: resolve(__dirname, 'flashcards.html'),
        tools: resolve(__dirname, 'tools.html'),
        resources: resolve(__dirname, 'resources.html')
      }
    }
  }
});
