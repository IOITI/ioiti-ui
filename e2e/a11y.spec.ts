// What axe finds on every page of the gallery, in a real browser with its stylesheets: what jsdom leaves out (the
// contrast of each text, a link told by its colour, a target's size, a region that scrolls) held too, in light and
// dark. WCAG 2.0 to 2.2, A and AA.
import AxeBuilder from '@axe-core/playwright'
import type { Result } from 'axe-core'

import { arrived, expect, test } from './fixtures'
import { PAGES } from './pages'

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

const said = (violation: Result) =>
  `${violation.id} (${violation.impact}): ${violation.help}${violation.nodes
    .slice(0, 4)
    .map((node) => `\n    ${node.target.join(' ')}: ${node.failureSummary?.split('\n').slice(1).join(' ').trim() ?? ''}\n      ${node.html.slice(0, 160)}`)
    .join('')}`

for (const page of PAGES) {
  for (const scheme of ['light', 'dark'] as const) {
    test(`${page.path} in ${scheme}: nothing axe finds`, async ({ page: tab }) => {
      await tab.emulateMedia({ colorScheme: scheme })
      await tab.goto(page.path)
      await arrived(tab)
      const { violations } = await new AxeBuilder({ page: tab }).withTags(TAGS).analyze()
      expect(violations.map(said), 'what axe finds').toEqual([])
    })
  }
}
