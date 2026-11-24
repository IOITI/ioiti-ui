// Every page of the gallery loads, says what it is, and says nothing wrong (fixtures.ts): in Chromium all of them, in
// English and with its components in French; in Firefox and WebKit the ones tagged @smoke.
import { arrived, inFrench, test } from './fixtures'
import { PAGES, SMOKE } from './pages'

for (const page of PAGES) {
  test(`${page.label} (${page.path}) loads, and says nothing wrong`, { tag: SMOKE.has(page.path) ? ['@smoke'] : [] }, async ({ page: tab }) => {
    await tab.goto(page.path)
    await arrived(tab)
  })

  test(`${page.label} (${page.path}) in French loads, and says nothing wrong`, async ({ page: tab }) => {
    await inFrench(tab)
    await tab.goto(page.path)
    await arrived(tab)
  })
}
