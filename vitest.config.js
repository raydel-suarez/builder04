import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment:  'jsdom',
    setupFiles:   ['tests/setup.js'],
    reporters:    ['verbose', 'html'],
    outputFile: { html: './reports/index.html' },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      reportsDirectory: './reports/coverage',
      include: ['js/**/*.js'],
      exclude: ['js/app.js'],
    },
  },
});
