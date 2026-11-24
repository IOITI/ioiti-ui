// The gallery checked in real browsers (AGENTS.md, Testing quirks): what jsdom cannot hold. It serves the gallery built
// on dist/, as GitHub Pages serves it to a reader: the package as an application gets it.
//
//   npm run e2e                Chromium: every page, axe with the stylesheets, the keyboard, motion
//   npm run e2e:smoke          Firefox and WebKit: the pages and journeys tagged @smoke
//   npm run e2e:visual         the screenshots, against the baselines CI made on Linux (e2e/__screenshots__)
//
// The screenshots are compared on Linux only: the same pixels need the same system. CI's `visual` job writes the
// ones missing and uploads them (an artifact to commit); elsewhere, E2E_SNAPSHOTS=<a folder> keeps a set of its own,
// to see a change draw the same twice.
//
// While working on a component: E2E_SOURCE=1 serves the gallery on the source (vite's dev server, every change seen at
// once, nothing built), E2E_PORT=<port> on a port of its own (several runs side by side).
import { defineConfig, devices } from '@playwright/test'

const PORT = Number(process.env.E2E_PORT ?? 4173)
const SOURCE = Boolean(process.env.E2E_SOURCE)
const CI = Boolean(process.env.CI)
const own = process.env.E2E_SNAPSHOTS

export default defineConfig({
  testDir: '.',
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 1 : 0,
  reporter: CI ? [['list'], ['html', { open: 'never', outputFolder: '../playwright-report' }]] : 'list',
  outputDir: '../test-results',
  snapshotPathTemplate: own ? `${own}/{arg}{ext}` : '{testDir}/__screenshots__/{arg}{ext}',
  // In CI, a screenshot without a baseline is written (and uploaded); one with a baseline is compared. Elsewhere, none is
  // written but on purpose (--update-snapshots): a Mac's pixels are not Linux's.
  updateSnapshots: CI ? 'missing' : 'none',
  expect: { timeout: 10_000 },
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: CI ? 'on-first-retry' : 'off',
  },
  projects: [
    { name: 'chromium', testIgnore: /visual\.spec/, use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', grep: /@smoke/, testIgnore: /visual\.spec/, use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', grep: /@smoke/, testIgnore: /visual\.spec/, use: { ...devices['Desktop Safari'] } },
    {
      name: 'visual',
      testMatch: /visual\.spec/,
      // A page, its fonts and its examples' chunk, then a still moment: more than the others take.
      timeout: 60_000,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 },
    },
  ],
  webServer: {
    // The package built, the gallery built on it, then served (vite preview answers index.html for any page); or the
    // gallery on the source, as `npm run gallery` serves it.
    command: SOURCE
      ? `npx vite --config gallery/vite.config.ts --port ${PORT} --strictPort`
      : `npm run build && npm run build:gallery && npx vite preview --config gallery/vite.config.ts --port ${PORT} --strictPort`,
    cwd: '..',
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !CI,
    timeout: 240_000,
  },
})
