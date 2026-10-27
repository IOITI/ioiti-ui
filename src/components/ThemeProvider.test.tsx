import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { LOOK_CHANGE_ATTRIBUTE } from '../lib/motion.js'
import { ACCENT_ATTRIBUTE, DEFAULT_THEME_STORAGE_KEY, MATERIAL_ATTRIBUTE, THEME_KEY_ATTRIBUTE } from '../lib/theme.js'
import { stubSystemTheme } from '../test/systemTheme.js'
import { stubViewTransitions } from '../test/viewTransition.js'

import { IoitiProvider } from './IoitiProvider.js'
import { useTheme } from './theme-context.js'
import { ThemeProvider } from './ThemeProvider.js'
import { ThemeToggle } from './ThemeToggle.js'

const html = document.documentElement
const isDark = () => html.classList.contains('dark')
const button = () => screen.getByRole('button', { name: /^Theme:/ })

function Shown() {
  const { theme } = useTheme()
  return <output aria-label="theme">{theme}</output>
}

function Look() {
  const { accent, material, setAccent, setMaterial } = useTheme()
  return (
    <>
      <output aria-label="look">{`${accent} ${material}`}</output>
      <button type="button" onClick={() => setAccent('indigo')}>Indigo</button>
      <button type="button" onClick={() => setAccent('neutral')}>Neutral</button>
      <button type="button" onClick={() => setMaterial('glass')}>Glass</button>
    </>
  )
}

function renderPage() {
  render(
    <ThemeProvider>
      <ThemeToggle />
      <Shown />
    </ThemeProvider>,
  )
}

beforeEach(() => {
  window.localStorage.clear()
  html.classList.remove('dark')
  html.removeAttribute(THEME_KEY_ATTRIBUTE)
  html.removeAttribute(ACCENT_ATTRIBUTE)
  html.removeAttribute(MATERIAL_ATTRIBUTE)
  html.removeAttribute(LOOK_CHANGE_ATTRIBUTE)
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('a first visit', () => {
  it('is dark on a system set to dark', () => {
    stubSystemTheme(true)
    renderPage()

    expect(isDark()).toBe(true)
    expect(screen.getByLabelText('theme')).toHaveTextContent('dark')
    expect(button()).toHaveAccessibleName('Theme: follows the system (dark now). Press for always light.')
  })

  it('is light on a system set to light', () => {
    stubSystemTheme(false)
    renderPage()

    expect(isDark()).toBe(false)
    expect(screen.getByLabelText('theme')).toHaveTextContent('light')
  })

  it('follows the system when it changes, at once', () => {
    const system = stubSystemTheme(false)
    renderPage()

    act(() => system.set(true))

    expect(isDark()).toBe(true)
    expect(button()).toHaveAccessibleName('Theme: follows the system (dark now). Press for always light.')
  })
})

describe('a theme that was chosen', () => {
  it('wins over the system, at the next visit too', () => {
    window.localStorage.setItem(DEFAULT_THEME_STORAGE_KEY, 'light')
    stubSystemTheme(true)
    renderPage()

    expect(isDark()).toBe(false)
    expect(button()).toHaveAccessibleName('Theme: always light. Press for always dark.')
  })

  it('stays when the system changes', () => {
    window.localStorage.setItem(DEFAULT_THEME_STORAGE_KEY, 'light')
    const system = stubSystemTheme(false)
    renderPage()

    act(() => system.set(true))

    expect(isDark()).toBe(false)
  })
})

describe('the button', () => {
  it('goes to light, to dark, then back to following the system, and the choice is kept', async () => {
    stubSystemTheme(true)
    const user = userEvent.setup()
    renderPage()

    await user.click(button())
    expect(isDark()).toBe(false)
    expect(window.localStorage.getItem(DEFAULT_THEME_STORAGE_KEY)).toBe('light')
    expect(button()).toHaveAccessibleName('Theme: always light. Press for always dark.')

    await user.click(button())
    expect(isDark()).toBe(true)
    expect(window.localStorage.getItem(DEFAULT_THEME_STORAGE_KEY)).toBe('dark')
    expect(button()).toHaveAccessibleName('Theme: always dark. Press to follow the system.')

    await user.click(button())
    expect(window.localStorage.getItem(DEFAULT_THEME_STORAGE_KEY)).toBeNull()
    expect(button()).toHaveAccessibleName('Theme: follows the system (dark now). Press for always light.')
  })

  it('says the same thing to a pointer that rests on it', () => {
    stubSystemTheme(false)
    renderPage()

    expect(button()).toHaveAttribute('title', button().getAttribute('aria-label'))
  })

  it('still switches where the browser keeps nothing', async () => {
    stubSystemTheme(true)
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('storage is blocked')
    })
    const user = userEvent.setup()
    renderPage()

    await user.click(button())

    expect(isDark()).toBe(false)
  })
})

describe('the key the choice is kept under', () => {
  it('is the one the provider is given', async () => {
    stubSystemTheme(true)
    const user = userEvent.setup()
    render(
      <ThemeProvider storageKey="my-app.theme">
        <ThemeToggle />
      </ThemeProvider>,
    )

    await user.click(button())

    expect(window.localStorage.getItem('my-app.theme')).toBe('light')
    expect(window.localStorage.getItem(DEFAULT_THEME_STORAGE_KEY)).toBeNull()
  })

  it('is the pre-paint script\'s when the provider is given none', () => {
    document.documentElement.setAttribute(THEME_KEY_ATTRIBUTE, 'my-app.theme')
    window.localStorage.setItem('my-app.theme', 'dark')
    stubSystemTheme(false)
    renderPage()

    expect(isDark()).toBe(true)
    expect(button()).toHaveAccessibleName('Theme: always dark. Press to follow the system.')
  })

  it('reaches the theme through IoitiProvider', () => {
    window.localStorage.setItem('other-app.theme', 'dark')
    stubSystemTheme(false)
    render(
      <IoitiProvider themeStorageKey="other-app.theme">
        <Shown />
      </IoitiProvider>,
    )

    expect(screen.getByLabelText('theme')).toHaveTextContent('dark')
  })
})

describe('the accent and the material', () => {
  it('are the design as it was on a first visit, and write nothing on the page', () => {
    stubSystemTheme(false)
    render(
      <ThemeProvider>
        <Look />
      </ThemeProvider>,
    )

    expect(screen.getByLabelText('look')).toHaveTextContent('neutral flat')
    expect(html.hasAttribute(ACCENT_ATTRIBUTE)).toBe(false)
    expect(html.hasAttribute(MATERIAL_ATTRIBUTE)).toBe(false)
  })

  it('are the application\'s, as the pre-paint script showed them, and nothing is kept for it', () => {
    html.setAttribute(ACCENT_ATTRIBUTE, 'violet')
    html.setAttribute(MATERIAL_ATTRIBUTE, 'glass')
    stubSystemTheme(false)
    render(
      <ThemeProvider>
        <Look />
      </ThemeProvider>,
    )

    expect(screen.getByLabelText('look')).toHaveTextContent('violet glass')
    expect(html.getAttribute(ACCENT_ATTRIBUTE)).toBe('violet')
    expect(window.localStorage.getItem(`${DEFAULT_THEME_STORAGE_KEY}.accent`)).toBeNull()
  })

  it('are the ones kept in this browser, over the application\'s', () => {
    html.setAttribute(ACCENT_ATTRIBUTE, 'violet')
    window.localStorage.setItem('my-app.theme.accent', 'blue')
    stubSystemTheme(false)
    render(
      <ThemeProvider storageKey="my-app.theme">
        <Look />
      </ThemeProvider>,
    )

    expect(screen.getByLabelText('look')).toHaveTextContent('blue flat')
    expect(html.getAttribute(ACCENT_ATTRIBUTE)).toBe('blue')
  })

  it('are shown at once when chosen, and kept under the application\'s key', async () => {
    stubSystemTheme(false)
    const user = userEvent.setup()
    render(
      <ThemeProvider storageKey="my-app.theme">
        <Look />
      </ThemeProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'Indigo' }))
    await user.click(screen.getByRole('button', { name: 'Glass' }))
    expect(html.getAttribute(ACCENT_ATTRIBUTE)).toBe('indigo')
    expect(html.getAttribute(MATERIAL_ATTRIBUTE)).toBe('glass')
    expect(window.localStorage.getItem('my-app.theme.accent')).toBe('indigo')
    expect(window.localStorage.getItem('my-app.theme.material')).toBe('glass')

    // Neutral is a choice too: kept, so that it wins over the application's at the next visit.
    await user.click(screen.getByRole('button', { name: 'Neutral' }))
    expect(html.hasAttribute(ACCENT_ATTRIBUTE)).toBe(false)
    expect(window.localStorage.getItem('my-app.theme.accent')).toBe('neutral')
  })
})

describe('a change of look', () => {
  function renderChoices() {
    render(
      <ThemeProvider>
        <ThemeToggle />
        <Look />
      </ThemeProvider>,
    )
  }

  it('is one cross-fade where the browser has view transitions: drawn inside it, the page\'s own transitions held still to its end', async () => {
    stubSystemTheme(false)
    const transitions = stubViewTransitions()
    const user = userEvent.setup()
    try {
      renderChoices()

      // Always light, then always dark: each a change of look, the page changed inside it.
      await user.click(button())
      await user.click(button())
      expect(transitions.start).toHaveBeenCalledTimes(2)
      expect(isDark()).toBe(true)
      expect(html.hasAttribute(LOOK_CHANGE_ATTRIBUTE)).toBe(true)

      await act(async () => transitions.finish())
      expect(html.hasAttribute(LOOK_CHANGE_ATTRIBUTE)).toBe(false)

      await user.click(screen.getByRole('button', { name: 'Indigo' }))
      await user.click(screen.getByRole('button', { name: 'Glass' }))
      expect(transitions.start).toHaveBeenCalledTimes(4)
      expect(html.getAttribute(ACCENT_ATTRIBUTE)).toBe('indigo')
      expect(html.getAttribute(MATERIAL_ATTRIBUTE)).toBe('glass')
    } finally {
      transitions.restore()
    }
  })

  it('is at once where the browser has none, and writes nothing more on the page', async () => {
    stubSystemTheme(false)
    const user = userEvent.setup()
    renderChoices()

    await user.click(button())
    await user.click(button())
    expect(isDark()).toBe(true)
    expect(html.hasAttribute(LOOK_CHANGE_ATTRIBUTE)).toBe(false)
  })
})

describe('outside a provider', () => {
  it('a component is shown dark, as the interface always was', () => {
    render(<Shown />)

    expect(screen.getByLabelText('theme')).toHaveTextContent('dark')
  })

  it('a component is shown neutral and flat', () => {
    render(<Look />)

    expect(screen.getByLabelText('look')).toHaveTextContent('neutral flat')
  })
})
