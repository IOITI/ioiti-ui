import { ThemeProvider, ThemeToggle, useTheme } from 'ioiti-ui'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { createRoot } from 'react-dom/client'

// The frame gives its theme as data-theme on <html>. The theme's context comes from ThemeProvider alone, which
// writes the theme on <html> from what the browser keeps: the frame's look is kept for it first, so that it starts
// on the frame's, and a press changes the frame as it changes a page (data-theme with it, which the tokens follow).
const KEY = 'ioiti-ui-preview.ThemeToggle'
const root = document.documentElement
const frameTheme = () => (root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light')

/** Keeps the frame's look for the provider: true where it will start on it (the browser keeps things). */
function keepFrameLook(): boolean {
  try {
    localStorage.setItem(KEY, frameTheme())
    localStorage.removeItem(`${KEY}.accent`)
    localStorage.removeItem(`${KEY}.material`)
    return localStorage.getItem(KEY) === frameTheme()
  } catch {
    return false
  }
}

function FrameTheme({ children }: { children: ReactNode }) {
  const [start, setStart] = useState(() => ({ round: 0, kept: keepFrameLook() }))
  const own = useRef<string | null>(null)
  // The frame changes its theme: the provider starts again on it.
  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (root.getAttribute('data-theme') === own.current) {
        own.current = null
        return
      }
      const kept = keepFrameLook()
      setStart((before) => ({ round: before.round + 1, kept }))
    })
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [])
  // Nothing kept: the provider would follow the system, maybe not the frame. The context's default, then.
  if (!start.kept) return <>{children}</>
  return (
    <ThemeProvider key={start.round} storageKey={KEY}>
      <FrameFollows own={own} />
      {children}
    </ThemeProvider>
  )
}

/** The theme shown, said on <html> as the frame says it. */
function FrameFollows({ own }: { own: { current: string | null } }) {
  const { theme } = useTheme()
  useLayoutEffect(() => {
    if (root.getAttribute('data-theme') === theme) return
    own.current = theme
    root.setAttribute('data-theme', theme)
  }, [theme, own])
  return null
}

createRoot(document.getElementById('root')!).render(
  <FrameTheme>
    <div className="flex flex-col items-start gap-2 p-5">
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        <ThemeToggle /> follows the system, then light, then dark: it says which, and what a press does.
      </span>
      <p className="text-xs text-muted-foreground">A press changes this card's theme, as it changes the page.</p>
    </div>
  </FrameTheme>,
)
