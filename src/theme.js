// Sets the theme before anything is painted, so that a light page does not flash dark at
// each load (and the other way round). It is a file of its own, loaded by a <script src> at
// the top of <head>, because a strict Content-Security-Policy allows no inline script. Plain
// and small on purpose: it runs before the application. The rules are the ones of
// src/lib/theme.ts, its lists of accents and materials too; keep the two in step.
//
// The key the choice is kept under is its tag's `data-storage-key` (one per application),
// written on <html> for the application to read (ThemeProvider). The accent and the material
// are kept beside it (`<key>.accent`, `<key>.material`); the application's own are its tag's
// `data-accent` and `data-material`, shown until a person picks another.
(function () {
  var script = document.currentScript
  var key = (script && script.getAttribute('data-storage-key')) || 'ioiti.theme'
  var root = document.documentElement
  root.setAttribute('data-theme-storage-key', key)
  function kept(name) {
    try {
      return window.localStorage.getItem(name)
    } catch {
      // Nothing is kept in this browser: the system and the application decide.
      return null
    }
  }
  var choice = kept(key)
  var systemDark = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-color-scheme: dark)').matches
  var dark = choice === 'dark' || (choice !== 'light' && systemDark)
  root.classList.toggle('dark', dark)
  // The one chosen, else the application's, else the first: the design as it was, which writes nothing.
  function show(attribute, values, name) {
    var chosen = kept(key + '.' + name)
    var given = script && script.getAttribute(attribute)
    var value = values.indexOf(chosen) >= 0 ? chosen : values.indexOf(given) >= 0 ? given : values[0]
    if (value === values[0]) root.removeAttribute(attribute)
    else root.setAttribute(attribute, value)
  }
  show('data-accent', ['neutral', 'violet', 'indigo', 'blue'], 'accent')
  show('data-material', ['flat', 'glass'], 'material')
})()
