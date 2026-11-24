// What moves, and what reduced motion keeps still (AGENTS.md, "Motion is a token, and calm"): a change of page fades
// the next one in as it rises a few pixels; reduced, it only fades. A spinner's loop stops. Jsdom has no view
// transitions and no stylesheets: only a browser can say it.
import type { Page } from '@playwright/test'

import { arrived, expect, test } from './fixtures'

/** Watches every animation of the page, its keyframes, as the next frames come: the ones that move something. */
async function watchMoves(page: Page) {
  await page.evaluate(() => {
    const moves: string[] = []
    ;(window as unknown as { moves: string[] }).moves = moves
    let frames = 0
    const sample = () => {
      for (const animation of document.getAnimations()) {
        const keyframes = (animation.effect as KeyframeEffect | null)?.getKeyframes() ?? []
        // Moved: a place that changes from one keyframe to the next (a group held where it is moves nothing).
        for (const property of ['translate', 'transform'] as const) {
          const places = new Set(keyframes.map((frame) => String(frame[property] ?? 'none').trim()))
          if (places.size > 1) moves.push(`${property}: ${[...places].join(' → ')}`)
        }
      }
      if ((frames += 1) < 90) requestAnimationFrame(sample)
    }
    requestAnimationFrame(sample)
  })
}

const movesSeen = (page: Page) => page.evaluate(() => (window as unknown as { moves: string[] }).moves)

test.describe('a change of page', () => {
  test('rises a few pixels as it fades in', async ({ page }) => {
    await page.goto('/')
    await arrived(page)
    await watchMoves(page)
    await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'All components' }).click()
    await expect(page.getByRole('heading', { level: 1, name: 'Components' })).toBeVisible()
    await expect.poll(() => movesSeen(page)).not.toEqual([])
  })

  test('only fades under reduced motion: nothing moves', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await arrived(page)
    await watchMoves(page)
    await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'All components' }).click()
    await expect(page.getByRole('heading', { level: 1, name: 'Components' })).toBeVisible()
    // Every frame of the change watched: none moved anything.
    await page.waitForFunction(() => (window as unknown as { moves: string[] }).moves !== undefined)
    await page.waitForTimeout(1000)
    expect(await movesSeen(page)).toEqual([])
  })
})

test.describe("a spinner's loop", () => {
  const spinning = (page: Page) =>
    page.locator('.animate-spin').first().evaluate((element) => getComputedStyle(element).animationName)

  test('turns', async ({ page }) => {
    await page.goto('/components/states/loader')
    await arrived(page)
    expect(await spinning(page)).not.toBe('none')
  })

  test('stops under reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/components/states/loader')
    await arrived(page)
    expect(await spinning(page)).toBe('none')
  })
})
