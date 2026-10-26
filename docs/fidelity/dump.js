// What a page of an application looks like, as numbers: run in the browser's console (or a test
// tool's), on an application made with ioiti-ui and on the interface it was taken from, then
// compare the two results. docs/fidelity.md says how it is used.
//
// - every custom property the page's stylesheets set on :root, :host or .dark, computed in the
//   light theme and in the dark one (the `dark` class on <html>, put back as it was);
// - the computed styles of the parts of the shell, in both themes.
;(() => {
  const ROOT_SELECTORS = new Set([':root', ':host', ':root, :host', '.dark', ':root:not(.dark)'])
  const PARTS = {
    body: 'body',
    sidebar: 'aside',
    'top bar': 'header',
    'menu entry shown': 'nav[aria-label="Main"] [aria-current="page"]',
    'menu entry': 'nav[aria-label="Main"] a:not([aria-current])',
    'menu section': 'nav[aria-label="Main"] p',
    trail: 'nav[aria-label="Breadcrumb"]',
    'page column': 'main > div',
    'page title': 'main h1',
    'page description': 'main h1 + p',
    panel: 'main section',
    'panel title': 'main section h2',
  }
  const PROPERTIES = [
    'color', 'background-color', 'border-top-color', 'border-right-color', 'border-bottom-color', 'border-top-width',
    'border-right-width', 'border-top-left-radius', 'font-family', 'font-size', 'font-weight', 'letter-spacing',
    'line-height', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'height', 'box-shadow',
    'outline-color', 'font-feature-settings', 'max-width', 'gap',
  ]

  const names = new Set()
  const visit = (rules) => {
    for (const rule of rules) {
      if (rule.cssRules && !rule.selectorText) visit(rule.cssRules)
      if (rule.selectorText && ROOT_SELECTORS.has(rule.selectorText)) {
        for (const property of rule.style) if (property.startsWith('--')) names.add(property)
      }
    }
  }
  for (const sheet of document.styleSheets) {
    try {
      visit(sheet.cssRules)
    } catch {
      // A stylesheet of another origin cannot be read; the design has none.
    }
  }

  const root = document.documentElement
  const wasDark = root.classList.contains('dark')
  const read = () => {
    const style = getComputedStyle(root)
    const tokens = {}
    for (const name of [...names].sort()) tokens[name] = style.getPropertyValue(name).trim()
    const parts = {}
    for (const [part, selector] of Object.entries(PARTS)) {
      const element = document.querySelector(selector)
      if (!element) continue
      const computed = getComputedStyle(element)
      parts[part] = Object.fromEntries(PROPERTIES.map((property) => [property, computed.getPropertyValue(property)]))
    }
    return { tokens, parts }
  }
  root.classList.remove('dark')
  const light = read()
  root.classList.add('dark')
  const dark = read()
  root.classList.toggle('dark', wasDark)
  return JSON.stringify({ light, dark })
})()
