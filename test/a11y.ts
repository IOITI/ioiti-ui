// What axe (axe-core) finds wrong, for a person on a keyboard or a screen reader, in what a test drew: the rules of
// WCAG 2.0 to 2.2, A and AA. Shared by the package's tests and the gallery's (which import no source of the package).
//
// Left out in jsdom, which lays nothing out and reads no stylesheet (css: false): contrast (the colours are held by
// gallery/src/tokens.test.ts, on every surface of every look), a link told apart from its text by colour, the size
// of a target, and whether a scrolling region can be reached (what scrolls is unknown). A real browser checks them.
import axe from 'axe-core'
import type { NodeResult, Result, RunOptions } from 'axe-core'
import { expect } from 'vitest'

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']
const OFF_IN_JSDOM = ['color-contrast', 'color-contrast-enhanced', 'link-in-text-block', 'target-size', 'scrollable-region-focusable']

export interface AxeOptions {
  /** Rules left out for this check, each for a reason the test says. */
  disable?: string[]
}

/** The rules broken in a node and what it holds, each with the elements that break it. */
export async function axeViolations(node: Element = document.body, { disable = [] }: AxeOptions = {}): Promise<Result[]> {
  const options: RunOptions = {
    runOnly: { type: 'tag', values: TAGS },
    rules: Object.fromEntries([...OFF_IN_JSDOM, ...disable].map((rule) => [rule, { enabled: false }])),
    resultTypes: ['violations'],
  }
  const results = await axe.run(node, options)
  return results.violations
}

const where = (target: NodeResult['target']) => target.map((part) => (Array.isArray(part) ? part.join(' ') : String(part))).join(' > ')

/** A violation as a test failure says it: the rule, what it asks, and the elements, at most five. */
export function describeViolation(violation: Result): string {
  const nodes = violation.nodes.slice(0, 5).map((node) => `\n    ${where(node.target)}: ${node.failureSummary?.split('\n').slice(1).join(' ').trim() ?? ''}`)
  const more = violation.nodes.length > 5 ? `\n    and ${violation.nodes.length - 5} more` : ''
  return `${violation.id} (${violation.impact}): ${violation.help}${nodes.join('')}${more}`
}

/** Fails a test with every rule a node breaks, said in full. */
export async function expectAccessible(node: Element = document.body, options?: AxeOptions): Promise<void> {
  const violations = await axeViolations(node, options)
  expect(violations.map(describeViolation), 'what axe finds').toEqual([])
}
