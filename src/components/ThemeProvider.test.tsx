import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { DEFAULT_THEME_STORAGE_KEY, THEME_KEY_ATTRIBUTE } from '../lib/theme.js'
import { stubSystemTheme } from '../test/systemTheme.js'

import { IoitiProvider } from './IoitiProvider.js'
import { useTheme } from './theme-context.js'
import { ThemeProvider } from './ThemeProvider.js'
import { ThemeToggle } from './ThemeToggle.js'

const isDark = () => document.documentElement.classList.contains('dark')
const button = () => screen.getByRole('button', { name: /^Theme:/ })

function Shown() {
  const { theme } = useTheme()
  return <output aria-label="theme">{theme}</output>
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
  document.documentElement.classList.remove('dark')
  document.documentElement.removeAttribute(THEME_KEY_ATTRIBUTE)
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

describe('outside a provider', () => {
  it('a component is shown dark, as the interface always was', () => {
    render(<Shown />)

    expect(screen.getByLabelText('theme')).toHaveTextContent('dark')
  })
})
