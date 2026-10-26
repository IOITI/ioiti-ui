// Sets the theme before anything is painted, so that a light page does not flash dark at
// each load (and the other way round). It is a file of its own, loaded by a <script src> at
// the top of <head>, because a strict Content-Security-Policy allows no inline script. Plain
// and small on purpose: it runs before the application. The rule is the one of
// src/lib/theme.ts; keep the two in step.
//
// The key the choice is kept under is its tag's `data-storage-key` (one per application),
// written on <html> for the application to read (ThemeProvider).
(function () {
  var script = document.currentScript
  var key = (script && script.getAttribute('data-storage-key')) || 'ioiti.theme'
  var root = document.documentElement
  root.setAttribute('data-theme-storage-key', key)
  var choice = null
  try {
    choice = window.localStorage.getItem(key)
  } catch {
    // Nothing is kept in this browser: the system decides.
  }
  var systemDark = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-color-scheme: dark)').matches
  var dark = choice === 'dark' || (choice !== 'light' && systemDark)
  root.classList.toggle('dark', dark)
})()
