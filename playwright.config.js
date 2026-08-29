// @ts-check
const { defineConfig, devices } = require('@playwright/test');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '.env') });

module.exports = defineConfig({
  testDir: './tests',

  // A execucao sequencial evita disputa de massa no ambiente compartilhado.
  fullyParallel: false,
  workers: 1,

  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['html', { open: 'never' }], ['list']],
  timeout: 90 * 1000,

  use: {
    baseURL: process.env.BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
