import { readFileSync } from 'node:fs'

import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ACCENT_ATTRIBUTE, ACCENTS, MATERIAL_ATTRIBUTE, THEME_KEY_ATTRIBUTE } from '../lib/theme.js'
import { fr } from '../locales/fr.js'
import { stubSystemTheme } from '../test/systemTheme.js'

import { IoitiProvider } from './IoitiProvider.js'
import { LookPicker } from './LookPicker.js'
import { ThemeProvider } from './ThemeProvider.js'
import { ThemeToggle } from './ThemeToggle.js'

const html = document.documentElement
const trigger = () => screen.getByRole('button', { name: /^Accent and material:/ })
const choices = () => screen.queryByRole('group', { name: 'Accent and material' })

function renderPicker() {
  render(
    <ThemeProvider storageKey="my-app.theme">
      <LookPicker />
      <button type="button">Elsewhere</button>
    </ThemeProvider>,
  )
}

beforeEach(() => {
  window.localStorage.clear()
  html.classList.remove('dark')
  html.removeAttribute(THEME_KEY_ATTRIBUTE)
  html.removeAttribute(ACCENT_ATTRIBUTE)
  html.removeAttribute(MATERIAL_ATTRIBUTE)
  stubSystemTheme(false)
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('the accent and material picker', () => {
  it('says what it is for and what is shown, and what it is for on hover and focus too', () => {
    renderPicker()

    expect(trigger()).toHaveAccessibleName('Accent and material: neutral, flat')
    expect(trigger()).toHaveAccessibleDescription('Accent and material')
    expect(trigger()).toHaveAttribute('aria-expanded', 'false')
    expect(trigger()).not.toHaveAttribute('title')
    expect(choices()).not.toBeInTheDocument()
  })

  it('opens on a press, with the accent and the material shown checked', async () => {
    const user = userEvent.setup()
    html.setAttribute(ACCENT_ATTRIBUTE, 'indigo')
    renderPicker()

    await user.click(trigger())

    expect(trigger()).toHaveAttribute('aria-expanded', 'true')
    expect(trigger()).toHaveAttribute('aria-controls', choices()?.id)
    expect(screen.getByRole('radio', { name: 'Indigo' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Flat' })).toBeChecked()
    expect(screen.getAllByRole('radio')).toHaveLength(11)
  })

  it('shows a choice at once and keeps it, open for another', async () => {
    const user = userEvent.setup()
    renderPicker()

    await user.click(trigger())
    await user.click(screen.getByRole('radio', { name: 'Violet' }))
    await user.click(screen.getByRole('radio', { name: 'Glass' }))

    expect(html.getAttribute(ACCENT_ATTRIBUTE)).toBe('violet')
    expect(html.getAttribute(MATERIAL_ATTRIBUTE)).toBe('glass')
    expect(window.localStorage.getItem('my-app.theme.accent')).toBe('violet')
    expect(window.localStorage.getItem('my-app.theme.material')).toBe('glass')
    expect(trigger()).toHaveAccessibleName('Accent and material: violet, glass')
    expect(choices()).toBeInTheDocument()
  })

  it('goes on Escape, and gives the focus back to its button', async () => {
    const user = userEvent.setup()
    renderPicker()

    await user.click(trigger())
    await user.click(screen.getByRole('radio', { name: 'Blue' }))
    await user.keyboard('{Escape}')

    await waitFor(() => expect(choices()).not.toBeInTheDocument(), { timeout: 3000 })
    expect(trigger()).toHaveFocus()
    expect(html.getAttribute(ACCENT_ATTRIBUTE)).toBe('blue')
  })

  it('goes on a click elsewhere', async () => {
    const user = userEvent.setup()
    renderPicker()

    await user.click(trigger())
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Elsewhere' }))

    await waitFor(() => expect(choices()).not.toBeInTheDocument(), { timeout: 3000 })
  })

  it('shows each accent in the fill the stylesheet gives it, and its gradient over it, in both themes', async () => {
    // From disk: a stylesheet imported in a test is empty.
    const css = readFileSync('src/styles/accents.css', 'utf8')
    const token = (accent: string, theme: string, name: string) =>
      new RegExp(`:root\\[data-accent="${accent}"\\]${theme === 'dark' ? '\\.dark' : ':not\\(\\.dark\\)'}\\s*\\{[^}]*?${name}:\\s*([^;]+);`).exec(css)?.[1]
    const user = userEvent.setup()
    renderPicker()

    await user.click(trigger())
    const gradients: string[] = []
    for (const accent of ACCENTS.filter((accent) => accent !== 'neutral')) {
      const swatch = document.querySelector(`[data-swatch="${accent}"]`)?.className ?? ''
      for (const [theme, prefix] of [['light', ''], ['dark', 'dark:']]) {
        expect(swatch, accent).toContain(`${prefix}bg-[${token(accent, theme, '--brand')}]`)
        const gradient = token(accent, theme, '--brand-gradient')
        if (!gradient) continue
        gradients.push(accent)
        // A first stop, a middle one at half way and a last: from, via and to.
        const [from, via, to] = [...gradient.matchAll(/#[0-9a-f]{6}/g)].map(([stop]) => stop)
        expect(gradient, accent).toMatch(/^linear-gradient\(110deg, #[0-9a-f]{6}, #[0-9a-f]{6} 50%, #[0-9a-f]{6}\)$/)
        expect(swatch, accent).toContain('bg-linear-110/srgb')
        for (const [part, stop] of [['from', from], ['via', via], ['to', to]]) expect(swatch, accent).toContain(`${prefix}${part}-[${stop}]`)
      }
    }
    expect(gradients).toEqual(['bloom', 'lagoon', 'aurora', 'dusk', 'golden'].flatMap((accent) => [accent, accent]))
  })

  it('is a layer in document.body: a top bar that blurs or stands above the page does not hold it', async () => {
    const user = userEvent.setup()
    renderPicker()

    await user.click(trigger())

    expect(choices()?.parentElement).toBe(document.body)
    expect(trigger().closest('div')?.contains(choices())).toBe(false)
  })

  it('takes the focus to the accent shown, keeps it inside, and gives it back past its ends', async () => {
    const user = userEvent.setup()
    html.setAttribute(ACCENT_ATTRIBUTE, 'blue')
    renderPicker()

    await user.click(trigger())
    await waitFor(() => expect(screen.getByRole('radio', { name: 'Blue' })).toHaveFocus())

    await user.tab()
    expect(screen.getByRole('radio', { name: 'Flat' })).toHaveFocus()
    expect(choices()).toBeInTheDocument()

    await user.tab()
    await waitFor(() => expect(choices()).not.toBeInTheDocument(), { timeout: 3000 })
    expect(trigger()).toHaveFocus()

    await user.click(trigger())
    await waitFor(() => expect(screen.getByRole('radio', { name: 'Blue' })).toHaveFocus())
    await user.tab({ shift: true })
    await waitFor(() => expect(choices()).not.toBeInTheDocument(), { timeout: 3000 })
    expect(trigger()).toHaveFocus()
  })
})

describe('the look in French', () => {
  /** French's no-break spaces (before a colon) read as spaces. */
  const spaced = (text: string | null) => (text ?? '').replace(/\s/g, ' ')
  function French({ children }: { children: ReactNode }) {
    return (
      <IoitiProvider locale="fr-FR" messages={fr}>
        {children}
      </IoitiProvider>
    )
  }

  it('names the picker, what is shown and its choices in French', async () => {
    const user = userEvent.setup()
    html.setAttribute(ACCENT_ATTRIBUTE, 'aurora')
    render(<LookPicker />, { wrapper: French })

    const button = screen.getByRole('button', { name: (name) => spaced(name) === 'Couleur et matière : boréale, opaque' })
    expect(button).toHaveAccessibleDescription('Couleur et matière')
    await user.click(button)
    expect(screen.getByRole('group', { name: 'Couleur et matière' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Couleur' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Matière' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Boréale' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Opaque' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Heure dorée' })).not.toBeChecked()
  })

  it('says where the theme button stands and what a press does, its title too', async () => {
    const user = userEvent.setup()
    stubSystemTheme(true)
    render(<ThemeToggle />, { wrapper: French })

    const button = screen.getByRole('button', { name: /^Thème/ })
    expect(spaced(button.getAttribute('aria-label'))).toBe('Thème : suit le système (sombre pour l’instant). Appuyer pour un thème toujours clair.')
    expect(button).toHaveAttribute('title', button.getAttribute('aria-label'))
    await user.click(button)
    expect(spaced(button.getAttribute('aria-label'))).toBe('Thème : toujours clair. Appuyer pour un thème toujours sombre.')
    await user.click(button)
    expect(spaced(button.getAttribute('aria-label'))).toBe('Thème : toujours sombre. Appuyer pour suivre le système.')
  })

  it("takes an application's own words over the language's", () => {
    render(
      <IoitiProvider messages={{ look: { accentNeutral: 'Ink', accentAndMaterial: 'Look' } }}>
        <LookPicker />
      </IoitiProvider>,
    )
    expect(screen.getByRole('button', { name: 'Accent and material: ink, flat' })).toHaveAccessibleDescription('Look')
  })
})
