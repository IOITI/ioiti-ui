// Takes from a built stylesheet the blocks that do not depend on which classes the pages use, and
// writes them as the reference that check:package holds an application's build to:
//
//   node scripts/golden-from.mjs <built.css> "<where it comes from>"
//
// The design's tokens (:root, .dark, :root:not(.dark)), the scrollbar, the focus ring and the
// rule that leaves it off a field that takes text (unless colours are forced), the base layer
// (Tailwind's preflight and the design's base rules) and the fonts' @font-face rules, each exactly
// as the built CSS writes it. The utilities, the theme layer and the @property rules are left out:
// an application has the ones its own pages use.
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const KEPT = [
  /^:root$/,
  /^\.dark$/,
  /^:root:not\(\.dark\)$/,
  /^::-webkit-scrollbar/,
  /^\.focus-ring$/,
  /^:focus-visible/,
  /^@media not all and \(forced-colors:active\)$/,
  /^@layer base$/,
  /^@font-face$/,
]

/** The top-level blocks of a stylesheet, each with its selector (or at-rule) and its whole text. */
export function topLevelBlocks(css) {
  const blocks = []
  let depth = 0
  let start = 0
  let opening = 0
  for (let index = 0; index < css.length; index += 1) {
    const char = css[index]
    if (char === '{') {
      if (depth === 0) opening = index
      depth += 1
    } else if (char === '}') {
      depth -= 1
      if (depth === 0) {
        const head = css.slice(start, opening)
        // A comment or a statement (`@layer a, b;`) before the selector is not part of it.
        const selector = head.replace(/\/\*[\s\S]*?\*\//g, '').split(';').pop().trim()
        blocks.push({ selector, text: `${selector}${css.slice(opening, index + 1)}` })
        start = index + 1
      }
    }
  }
  return blocks
}

/** The blocks of a built stylesheet that the reference keeps. */
export function referenceBlocks(css) {
  return topLevelBlocks(css)
    .filter(({ selector }) => KEPT.some((pattern) => pattern.test(selector)))
    .map(({ text }) => text)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [file, source] = process.argv.slice(2)
  if (!file || !source) {
    console.error('node scripts/golden-from.mjs <built.css> "<where it comes from>"')
    process.exit(1)
  }
  const blocks = referenceBlocks(readFileSync(file, 'utf8'))
  const target = join(dirname(fileURLToPath(import.meta.url)), '..', 'test', 'golden', 'reference-blocks.json')
  writeFileSync(target, `${JSON.stringify({ source, blocks }, null, 2)}\n`)
  console.log(`${blocks.length} blocks written to ${target}`)
}
