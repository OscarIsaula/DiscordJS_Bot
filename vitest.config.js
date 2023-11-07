import { defineConfig } from 'vitest/config'
import { resolve } from 'node:path'

export default defineConfig({
  test: {
    testFiles: ['**/*.test.js'],
  },
  resolve: {
    alias: [{ find: "@", replacement: resolve(__dirname, "./src") }]
  }
});