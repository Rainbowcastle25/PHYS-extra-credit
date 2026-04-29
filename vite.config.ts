import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  base: '/PHYS-extra-credit/',
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        topics: resolve(__dirname, 'topics.html'),
        formulas: resolve(__dirname, 'formulas.html'),
        exams: resolve(__dirname, 'exams.html'),
        simulators: resolve(__dirname, 'simulators.html'),
        flashcards: resolve(__dirname, 'flashcards.html'),
        tools: resolve(__dirname, 'tools.html')
      }
    }
  }
});
