// @ts-check
const { defineConfig, devices } = require('@playwright/test');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const UI_BASE_URL =
  process.env.UI_BASE_URL || 'https://practicesoftwaretesting.com';
const API_BASE_URL =
  process.env.API_BASE_URL || 'https://api.practicesoftwaretesting.com';

/** @type {import('@playwright/test').PlaywrightTestConfig} */
module.exports = defineConfig({
  testDir: './PrismStructure/tests',
  outputDir: 'test-results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 60000,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'PrismStructure/reports/html', open: 'never' }],
  ],
  use: {
    baseURL: UI_BASE_URL,
    testIdAttribute: 'data-test',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'off',
  },
  projects: [
    {
      name: 'api',
      testMatch: '**/api/**/*.api.spec.js',
      use: {
        baseURL: API_BASE_URL,
      },
      workers: 1,
    },
    {
      name: 'chromium',
      testIgnore: '**/api/**',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
});
