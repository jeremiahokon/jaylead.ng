import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

/** Unit tests for the pure helpers (money, links, embeds, Option A maths). */
export default defineConfig({
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  test: { include: ['src/**/*.test.ts', 'scripts/**/*.test.ts'] },
});
