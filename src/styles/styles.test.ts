// @vitest-environment node
import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { compile } from 'tailwindcss'
import { describe, expect, it } from 'vitest'

// The stylesheets as an application's Tailwind compiles them, from disk (a stylesheet imported in a
// test is empty).
const STYLES = fileURLToPath(new URL('.', import.meta.url))
const MODULES = resolve(STYLES, '../../node_modules')
const NEW_IMPORTS = /^@import "\.\/(accents|glass)\.css";\n/gm

/** A stylesheet the compiler asks for: one of the package's, or a package's own (its `style`, else its `main`). */
function load(id: string, base: string, withoutLooks: boolean) {
  let path: string
  if (id.startsWith('.')) path = resolve(base, id)
  else {
    const parts = id.split('/')
    const name = id.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0]
    const rest = parts.slice(id.startsWith('@') ? 2 : 1)
    const manifest = JSON.parse(readFileSync(join(MODULES, name, 'package.json'), 'utf8'))
    path = join(MODULES, name, ...(rest.length ? rest : [manifest.exports?.style ?? manifest.style ?? manifest.main]))
  }
  const content = readFileSync(path, 'utf8')
  return { path, base: dirname(path), content: withoutLooks && path.endsWith('design.css') ? content.replace(NEW_IMPORTS, '') : content }
}

async function build(candidates: string[], { withoutLooks = false } = {}): Promise<string> {
  const compiler = await compile(readFileSync(join(STYLES, 'styles.css'), 'utf8'), {
    base: STYLES,
    loadStylesheet: async (id, base) => load(id, base, withoutLooks),
  })
  return compiler.build(candidates)
}

/** The blocks at the top of a stylesheet (a rule, an at-rule), each as written. */
function topLevelBlocks(css: string): string[] {
  const blocks: string[] = []
  let depth = 0
  let start = 0
  for (let at = 0; at < css.length; at++) {
    if (css[at] === '{') depth++
    else if (css[at] === '}' && --depth === 0) {
      blocks.push(css.slice(start, at + 1).trim())
      start = at + 1
    } else if (css[at] === ';' && depth === 0) start = at + 1
  }
  return blocks
}

describe('the stylesheets, as an application builds them', () => {
  it('put an accent\'s classes after the design\'s dark ones, and above them', async () => {
    const css = await build(['dark:bg-white', 'dark:hover:bg-neutral-800', 'accent:bg-brand', 'accent:hover:bg-brand-soft'])
    const at = (selector: string) => css.indexOf(selector)

    expect(css).toContain('.accent\\:bg-brand:is(:root[data-accent] *)')
    expect(at('.accent\\:bg-brand:is')).toBeGreaterThan(at('.dark\\:bg-white:is'))
    expect(at('.accent\\:hover\\:bg-brand-soft:is')).toBeGreaterThan(at('.dark\\:hover\\:bg-neutral-800:is'))
  })

  it('draw an accent\'s gradient over a filled control, and the text it takes, where the accent has one', async () => {
    const css = await build(['accent:bg-brand', 'accent:bg-(image:--brand-fill)', 'accent:text-brand-fill-foreground'])
    const rule = (selector: string) => /\{([^{}]*)\}/.exec(css.slice(css.indexOf(selector)))?.[1] ?? ''

    expect(rule('.accent\\:bg-\\(image\\:--brand-fill\\):is(:root[data-accent] *)')).toContain('background-image: var(--brand-fill)')
    // An accent without a gradient: its fill's own text.
    expect(rule('.accent\\:text-brand-fill-foreground:is(:root[data-accent] *)')).toContain('color: var(--brand-fill-foreground, var(--brand-foreground))')
  })

  it('turn a surface to glass only where the material is glass, and blur only what floats', async () => {
    const css = await build(['glass-bar', 'glass-card', 'glass-float', 'glass:bg-black/20'])
    const rule = (utility: string) => /\{([^{}]*)\}/.exec(css.slice(css.indexOf(`.${utility}:is(:root[data-material="glass"] *)`)))?.[1] ?? ''

    for (const utility of ['glass-bar', 'glass-card', 'glass-float']) expect(css).toContain(`.${utility}:is(:root[data-material="glass"] *)`)
    expect(rule('glass-float')).toContain('backdrop-filter: var(--glass-blur)')
    expect(rule('glass-card')).not.toContain('backdrop-filter')
    expect(rule('glass-bar')).not.toContain('backdrop-filter')
    expect(css).toContain('.glass\\:bg-black\\/20:is(:root[data-material="glass"] *)')
  })

  it('keep every block of the design as it was, its base layer whole: the accents and glass only add', async () => {
    const candidates = ['bg-surface', 'dark:bg-surface/25', 'text-foreground', 'glass-card', 'accent:bg-brand']
    const withLooks = topLevelBlocks(await build(candidates))
    const without = topLevelBlocks(await build(candidates, { withoutLooks: true }))
    const base = (blocks: string[]) => blocks.find((block) => block.startsWith('@layer base'))

    expect(base(withLooks)).toBe(base(without))
    // Every block of the design, in the same order.
    expect(withLooks.filter((block) => without.includes(block))).toEqual(without.filter((block) => !block.startsWith('@layer utilities')))
    const added = withLooks.filter((block) => !without.includes(block) && !block.startsWith('@layer utilities') && !block.startsWith('@layer theme'))
    expect(added.length).toBeGreaterThan(0)
    for (const block of added) expect(block, block.slice(0, 80)).toMatch(/^(:root\[data-(accent|material)=|@supports not \(\(backdrop-filter|@media \(prefers-reduced-transparency)/)
  })
})
