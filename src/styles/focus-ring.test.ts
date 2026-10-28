import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

// design.css from disk (a stylesheet imported in a test is empty), its comments gone.
const DESIGN = readFileSync('src/styles/design.css', 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
// The rule that leaves the ring off a field that takes text, and the condition it is under.
const RULE = /(@media [^{]*\{\s*)?(:focus-visible:is\([^{}]*\))\s*\{\s*outline: none;\s*\}/.exec(DESIGN)
const FIELDS = RULE?.[2] ?? ''

/** Whether design.css leaves the ring off an element in focus. */
function ringless(html: string): boolean {
  document.body.innerHTML = html
  // Without `:focus-visible`: jsdom cannot tell a click's focus from the keyboard's.
  return document.body.firstElementChild!.matches(FIELDS.replace(':focus-visible', ''))
}

describe('the focus ring', () => {
  it('is drawn on everything the keyboard reaches', () => {
    expect(DESIGN).toMatch(/:focus-visible:not\(\[tabindex="-1"\]\) \{\s*outline: 2px solid var\(--focus-ring\);/)
  })

  it('is left off a field that takes text, which a browser marks as reached by the keyboard at a click too', () => {
    for (const field of ['<input>', '<input type="email">', '<input type="search">', '<input type="time">', '<textarea></textarea>', '<div contenteditable></div>']) {
      expect(ringless(field), field).toBe(true)
    }
  })

  it('stays on a field where colours are forced (a contrast theme), its border no longer changing', () => {
    expect(RULE?.[1]).toMatch(/^@media not \(forced-colors: active\)/)
  })

  it('stays on a control that takes no text', () => {
    for (const control of ['<input type="checkbox">', '<input type="radio">', '<input type="range">', '<input type="color">', '<button></button>', '<select></select>', '<a href="#"></a>', '<div contenteditable="false"></div>']) {
      expect(ringless(control), control).toBe(false)
    }
  })
})
