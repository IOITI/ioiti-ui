import { readFileSync } from 'node:fs'

import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ACCENT_ATTRIBUTE, ACCENTS, MATERIAL_ATTRIBUTE, THEME_KEY_ATTRIBUTE } from '../lib/theme.js'
import { stubSystemTheme } from '../test/systemTheme.js'

import { LookPicker } from './LookPicker.js'
import { ThemeProvider } from './ThemeProvider.js'

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
    expect(screen.getAllByRole('radio')).toHaveLength(6)
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

  it('shows each accent in the fill the stylesheet gives it, in both themes', async () => {
    // From disk: a stylesheet imported in a test is empty.
    const css = readFileSync('src/styles/accents.css', 'utf8')
    const fill = (accent: string, theme: string) =>
      new RegExp(`:root\\[data-accent="${accent}"\\]${theme === 'dark' ? '\\.dark' : ':not\\(\\.dark\\)'}\\s*\\{[^}]*?--brand:\\s*(#[0-9a-f]{6});`).exec(css)?.[1]
    const user = userEvent.setup()
    renderPicker()

    await user.click(trigger())
    for (const accent of ACCENTS.filter((accent) => accent !== 'neutral')) {
      const swatch = document.querySelector(`[data-swatch="${accent}"]`)?.className ?? ''
      expect(swatch, accent).toContain(`bg-[${fill(accent, 'light')}]`)
      expect(swatch, accent).toContain(`dark:bg-[${fill(accent, 'dark')}]`)
    }
  })

  it('goes when the focus leaves it, and stays while it moves inside it', async () => {
    const user = userEvent.setup()
    renderPicker()

    await user.click(trigger())
    await user.tab()
    expect(screen.getByRole('radio', { name: 'Neutral' })).toHaveFocus()
    expect(choices()).toBeInTheDocument()

    await user.tab()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Elsewhere' })).toHaveFocus()
    await waitFor(() => expect(choices()).not.toBeInTheDocument(), { timeout: 3000 })
  })
})
