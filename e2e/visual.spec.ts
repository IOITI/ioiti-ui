// What the design looks like, held pixel by pixel: the first example of every family, in light and dark, and the
// pages that show the most of a look (its colours, its glass) in three looks. The baselines are made on Linux, by CI
// (playwright.config.ts): a change that moves a pixel shows as a diff to look at, and is made the new baseline on
// purpose.
//
// Each picture is the same at every run: the clock stands at one moment, Math.random is seeded, motion is reduced and
// the animations stopped, the fonts loaded. The examples that move or read the time as they run are not pictured; the
// gallery's version, which every release changes, is masked.
import type { Page } from '@playwright/test'

import { arrived, expect, settled, test } from './fixtures'
import { FAMILIES } from './pages'

const MOMENT = new Date('2026-11-24T10:00:00Z')

/** Families whose first example moves on its own, or reads the time or the network as it runs. */
const LIVE = new Set([
  'live-line-chart',
  'airport-matrix-clock',
  'live-value',
  'dynamic-island',
  'animated-number',
  'loader',
  'skeleton',
  'ai-agent-activity',
  'ai-response',
  'request-status',
  'velocity-toast',
  'undo-toast',
  'product-tour',
])

async function steady(page: Page, scheme: 'light' | 'dark') {
  await page.clock.setFixedTime(MOMENT)
  await page.addInitScript(() => {
    let seed = 42
    Math.random = () => (seed = (seed * 16807) % 2147483647) / 2147483647
  })
  await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' })
}

async function still(page: Page) {
  await page.evaluate(() => document.fonts.ready)
  await settled(page)
}

const SHOT = { animations: 'disabled', caret: 'hide' } as const

for (const family of FAMILIES) {
  if (LIVE.has(family.slug)) continue
  for (const scheme of ['light', 'dark'] as const) {
    test(`${family.path}, its first example, in ${scheme}`, async ({ page }) => {
      await steady(page, scheme)
      await page.goto(family.path)
      await arrived(page)
      const example = page.locator(`[data-example="${family.firstExample}"]`)
      await expect(example).toBeVisible()
      await still(page)
      await expect(example).toHaveScreenshot(`${family.slug}--${scheme}.png`, SHOT)
    })
  }
}

/** The looks pictured: the design as it was, an accent under glass, a gradient accent. */
const LOOKS = [
  ['neutral', 'flat'],
  ['violet', 'glass'],
  ['bloom', 'flat'],
] as const

const LOOK_PAGES = ['/foundations/themes', '/foundations/colours', '/patterns/dashboard', '/patterns/sign-in', '/patterns/not-found']

/** The gallery's version, under its name in the sidebar: masked, as a release changes it and nothing of the design. */
const VERSION = /^v\d+\.\d+\.\d+(?:-[\w.]+)?$/

for (const path of LOOK_PAGES) {
  for (const [accent, material] of LOOKS) {
    test(`${path} in ${accent}, ${material}`, async ({ page }) => {
      await steady(page, 'light')
      // The look a person picked, kept where LookPicker keeps it (beside the theme's key): shown from the first paint.
      await page.addInitScript(
        ([a, m]) => {
          window.localStorage.setItem('ioiti-gallery.theme.accent', a)
          window.localStorage.setItem('ioiti-gallery.theme.material', m)
        },
        [accent, material],
      )
      await page.goto(path)
      await arrived(page)
      await still(page)
      await expect(page).toHaveScreenshot(`${path.slice(1).replaceAll('/', '-')}--${accent}-${material}.png`, {
        ...SHOT,
        mask: [page.getByText(VERSION)],
      })
    })
  }
}
