// What every test of a page is held to, by itself (an automatic fixture): nothing said wrong in the console, no error
// uncaught, no request failed, nothing asked of another origin (the package loads nothing from elsewhere: a strict
// Content-Security-Policy holds). The pages whose examples fail on purpose say so in the console as React does, and
// only that is let through there.
import { expect, test as base } from '@playwright/test'
import type { Page } from '@playwright/test'

/**
 * Pages that show a failure on purpose, and what they may say of it: React writes each error a boundary catches in the
 * console, a route's loader throws, an example breaks its chart.
 */
const DELIBERATE: [RegExp, RegExp][] = [
  [/\/components\/states(\/error-state)?$|\/patterns\/states$/, /error boundary|The above error occurred|reading 'map'|could not be drawn|Failed to fetch dynamically imported module/i],
  [/\/components\/shell(\/router-error-page)?$/, /error boundary|The above error occurred|The server answered 500|status of 40[34]/i],
]

const ABORTED = /ERR_ABORTED|NS_BINDING_ABORTED|cancelled/i

export const test = base.extend<{ guard: void }>({
  guard: [
    async ({ page, baseURL }, use) => {
      const origin = new URL(baseURL ?? 'http://localhost').origin
      const problems: string[] = []
      page.on('pageerror', (error) => problems.push(`uncaught: ${error.message}`))
      page.on('console', (message) => {
        if (message.type() === 'error') problems.push(`console: ${message.text()}`)
      })
      page.on('requestfailed', (request) => {
        const why = request.failure()?.errorText ?? ''
        // A request a navigation cut short (the next page asked for before the last one's fonts arrived) is no failure.
        if (!ABORTED.test(why)) problems.push(`failed: ${request.url()} (${why})`)
      })
      await page.route('**/*', (route) => {
        const url = new URL(route.request().url())
        if (url.origin === origin || url.protocol === 'data:' || url.protocol === 'blob:') return route.continue()
        problems.push(`another origin: ${url.href}`)
        return route.abort()
      })
      await use()
      const path = new URL(page.url()).pathname
      const allowed = DELIBERATE.filter(([where]) => where.test(path)).map(([, what]) => what)
      const left = problems.filter((problem) => !allowed.some((what) => what.test(problem)))
      expect(left, `what ${path} said went wrong`).toEqual([])
    },
    { auto: true },
  ],
})

export { expect }

/** Waits for what moves as a page arrives to come to rest (a loop, a spinner's, never does: it is not waited for). */
export async function settled(page: Page): Promise<void> {
  await page.waitForFunction(() =>
    document.getAnimations().every((animation) => {
      const iterations = animation.effect?.getTiming().iterations
      return animation.playState !== 'running' || iterations === Infinity
    }),
  )
}

/** The page's heading, once its category's examples have arrived (a chunk of their own). */
export async function arrived(page: Page): Promise<void> {
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible()
  await settled(page)
}

/** The gallery's components in French from the first paint, as its language choice keeps it (language-context.ts). */
export async function inFrench(page: Page): Promise<void> {
  await page.addInitScript(() => window.localStorage.setItem('ioiti-gallery.language', 'fr'))
}
