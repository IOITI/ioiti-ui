// @vitest-environment node
import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import type { Transition } from 'framer-motion'
import { compile } from 'tailwindcss'
import { describe, expect, it } from 'vitest'

import { motionTransitions } from '../lib/motion-tokens.js'

// The stylesheets as an application's Tailwind compiles them, from disk (a stylesheet imported in a
// test is empty).
const STYLES = fileURLToPath(new URL('.', import.meta.url))
const MODULES = resolve(STYLES, '../../node_modules')
// ioiti-ui's own stylesheets, which only add to the design.
const NEW_IMPORTS = /^@import "\.\/(accents|glass|motion)\.css";\n/gm

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

  it('keep every block of the design as it was, its base layer whole: the accents, glass and motion only add', async () => {
    const candidates = ['bg-surface', 'dark:bg-surface/25', 'text-foreground', 'glass-card', 'accent:bg-brand', 'animate-spin']
    const withLooks = topLevelBlocks(await build(candidates))
    const without = topLevelBlocks(await build(candidates, { withoutLooks: true }))
    const base = (blocks: string[]) => blocks.find((block) => block.startsWith('@layer base'))
    // The utilities and the theme's variables are each application's own (the motion's curves are in the theme).
    const design = (blocks: string[]) => blocks.filter((block) => !block.startsWith('@layer utilities') && !block.startsWith('@layer theme'))

    expect(base(withLooks)).toBe(base(without))
    // Every block of the design, in the same order.
    expect(design(withLooks).filter((block) => without.includes(block))).toEqual(design(without))
    const added = design(withLooks).filter((block) => !without.includes(block))
    expect(added.length).toBeGreaterThan(0)
    for (const block of added) {
      expect(block, block.slice(0, 80)).toMatch(
        /^(:root\[data-(accent|material|reduced-motion)=|@supports not \(\(backdrop-filter|@media \(prefers-reduced-(transparency|motion)|@keyframes ioiti-|::view-transition|:root(:not\()?\[data-look-change\])/,
      )
    }
  })
})

/** A transition's curve, as the stylesheets write it. */
function curve(transition: Transition): string {
  const ease = 'ease' in transition ? transition.ease : undefined
  return `cubic-bezier(${Array.isArray(ease) ? ease.join(', ') : ''})`
}

/** A transition's length, as the stylesheets write it. */
function length(transition: Transition): string {
  const seconds = 'duration' in transition ? transition.duration : undefined
  return `${Math.round((seconds ?? 0) * 1000)}ms`
}

/** The declarations of the rule a stylesheet writes for a selector. */
function rule(css: string, selector: string): string {
  const at = css.indexOf(`${selector} {`)
  return at < 0 ? '' : (/\{([^{}]*)\}/.exec(css.slice(at))?.[1] ?? '')
}

describe('the motion, as an application builds it', () => {
  it('moves with the curves framer-motion moves with, every transition-* class too', async () => {
    const css = await build(['ease-soft', 'transition-colors'])

    expect(css).toContain(`--ease-soft: ${curve(motionTransitions.easeSoft)};`)
    expect(css).toContain(`--ease-fast: ${curve(motionTransitions.easeFast)};`)
    expect(css).toContain(`--ease-exit: ${curve(motionTransitions.easeExit)};`)
    expect(css).toContain(`--default-transition-timing-function: ${curve(motionTransitions.easeFast)};`)
    // Their length stays Tailwind's.
    expect(css).toContain('--default-transition-duration: 150ms;')
    expect(css).toContain(`--animate-reveal: ioiti-reveal 200ms ${curve(motionTransitions.easeSoft)} backwards;`)
  })

  it('leaves nothing of a reveal once it has run: what arrived is no layer of its own, nor the root of a backdrop', async () => {
    const css = await build(['animate-reveal'])

    expect(rule(css, '.animate-reveal')).toContain('animation: var(--animate-reveal)')
    // Kept to its end (both, forwards), an animation of opacity stays in effect: a block it revealed held a
    // layer opened in it without a portal (LookPicker's choices) under the blocks after it, its glass
    // blurring nothing of them.
    expect(css).toMatch(/--animate-reveal: ioiti-reveal [^;]* backwards;/)
    expect(css).not.toMatch(/--animate-reveal:[^;]*\b(both|forwards)\b/)
  })

  it('is reduced where the system asks or IoitiProvider says so: motion-safe: and motion-reduce: follow both', async () => {
    const css = await build(['motion-reduce:animate-none', 'motion-safe:active:scale-95'])

    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\) \{\s*\.motion-reduce\\:animate-none:not\(:root\[data-reduced-motion="never"\] \*\)/)
    expect(css).toContain('.motion-reduce\\:animate-none:is(:root[data-reduced-motion="always"] *)')
    expect(css).toMatch(/@media \(prefers-reduced-motion: no-preference\) \{\s*\.motion-safe\\:active\\:scale-95:not\(:root\[data-reduced-motion="always"\] \*\):active/)
    expect(css).toContain('.motion-safe\\:active\\:scale-95:is(:root[data-reduced-motion="never"] *):active')
  })

  it('changes a page in one cross-fade, the page left first, the new one rising, the shell and the layers live', async () => {
    const css = await build([])

    expect(rule(css, '::view-transition-old(.ioiti-page)')).toContain(`${length(motionTransitions.easeExit)} var(--ease-exit) both ioiti-fade-out`)
    expect(rule(css, '::view-transition-new(.ioiti-page)')).toContain('var(--ease-soft) both ioiti-rise-in')
    expect(rule(css, '::view-transition')).toContain('pointer-events: none')
    expect(rule(css, ':root:not([data-look-change])::view-transition-old(root)')).toContain('display: none')
    expect(rule(css, ':root:not([data-look-change])::view-transition-old(.ioiti-layer)')).toContain('display: none')
    expect(rule(css, ':root:not([data-look-change])::view-transition-new(.ioiti-layer)')).toContain('animation: none')
  })

  it('names a layer over the page while a transition plays only: at rest, the blur in it has the page to blur', async () => {
    const css = await build(['over-page'])

    const named = rule(css, '.over-page:is(:root:active-view-transition:not([data-look-change]) *)')
    expect(named).toContain('view-transition-name: match-element')
    expect(named).toContain('view-transition-class: ioiti-layer')
    // Nothing outside a transition: a name would make the layer the root of its glass's backdrop.
    expect(css).not.toMatch(/\.over-page\s*\{/)
  })

  it('changes a look in one cross-fade of the whole page, the components\' own transitions held still meanwhile', async () => {
    const css = await build([])

    expect(rule(css, ':root[data-look-change] *, :root[data-look-change] ::before, :root[data-look-change] ::after')).toContain('transition: none !important')
    expect(rule(css, ':root[data-look-change]::view-transition-old(*), :root[data-look-change]::view-transition-new(*)')).toContain('animation-duration: 260ms')
  })

  it('lets a page arrive without rising where motion is reduced', async () => {
    const css = await build([])

    expect(css).toMatch(
      /@media \(prefers-reduced-motion: reduce\) \{[^@]*:root:not\(\[data-reduced-motion="never"\]\)::view-transition-new\(\.ioiti-page\) \{\s*animation-name: ioiti-fade-in;/,
    )
    expect(rule(css, ':root[data-reduced-motion="always"]::view-transition-new(.ioiti-page)')).toContain('animation-name: ioiti-fade-in')
  })

  it('stops the loops where motion is reduced', async () => {
    const css = await build(['animate-spin', 'animate-pulse'])

    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\) \{\s*:root:not\(\[data-reduced-motion="never"\]\) \{[^}]*--animate-spin: none;/)
    expect(css).toMatch(/:root\[data-reduced-motion="always"\] \{[^}]*--animate-pulse: none;/)
  })
})
