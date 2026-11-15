// A trace of the browser's view transitions (a change of page, of look), written on the page itself: for a
// browser whose console is not at hand, a phone's. Opt-in: `?trace` in the address, kept for the tab (the router
// drops the query at the next page); `?trace=off` stops it. It changes nothing of a transition: it reads its
// steps, the animations of its pictures and the frames drawn meanwhile. The gallery's own, and temporary: it
// looks for why WebKit shows two pages at once on some changes of page.

const KEY = 'ioiti-gallery.trace'
const FRAMES_FOR = 1500

type Update = () => unknown
type Start = (this: Document, arg?: Update | { update?: Update; types?: string[] }) => ViewTransition

function wanted(): boolean {
  const asked = new URLSearchParams(window.location.search).get('trace')
  try {
    if (asked === 'off') window.sessionStorage.removeItem(KEY)
    else if (asked !== null) window.sessionStorage.setItem(KEY, '1')
    return window.sessionStorage.getItem(KEY) === '1'
  } catch {
    // No storage: the address alone says it.
    return asked !== null && asked !== 'off'
  }
}

/** The panel: the last lines, Copy and Clear. Drawn live, outside the page's frame. */
function panel() {
  const lines: string[] = []
  const box = document.createElement('div')
  box.setAttribute('role', 'log')
  box.setAttribute('aria-label', 'Trace of view transitions')
  Object.assign(box.style, {
    position: 'fixed',
    left: '8px',
    right: '8px',
    bottom: '8px',
    zIndex: '2147483000',
    maxHeight: '38vh',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    padding: '8px',
    borderRadius: '12px',
    border: '1px solid var(--border)',
    background: 'var(--surface)',
    color: 'var(--text-primary)',
    boxShadow: '0 12px 30px -12px rgb(0 0 0 / 0.45)',
    font: '11px/1.4 var(--font-mono, ui-monospace, monospace)',
  })
  const bar = document.createElement('div')
  Object.assign(bar.style, { display: 'flex', gap: '6px', alignItems: 'center' })
  const title = document.createElement('strong')
  title.textContent = 'trace'
  title.style.flex = '1'
  const text = document.createElement('pre')
  Object.assign(text.style, { margin: '0', overflow: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word' })
  const button = (label: string, act: () => void) => {
    const element = document.createElement('button')
    element.type = 'button'
    element.textContent = label
    Object.assign(element.style, {
      font: 'inherit',
      padding: '2px 10px',
      borderRadius: '8px',
      border: '1px solid var(--border)',
      background: 'var(--surface-raised)',
      color: 'inherit',
    })
    element.addEventListener('click', act)
    return element
  }
  const copy = button('Copy', () => {
    const all = lines.join('\n')
    const said = (word: string) => {
      copy.textContent = word
      window.setTimeout(() => (copy.textContent = 'Copy'), 1200)
    }
    navigator.clipboard?.writeText(all).then(
      () => said('Copied'),
      () => {
        // Refused: the text selected, for the system's own Copy.
        const range = document.createRange()
        range.selectNodeContents(text)
        window.getSelection()?.removeAllRanges()
        window.getSelection()?.addRange(range)
        said('Selected')
      },
    )
  })
  const clear = button('Clear', () => {
    lines.length = 0
    text.textContent = ''
  })
  bar.append(title, copy, clear)
  box.append(bar, text)
  document.body.append(box)
  return (line: string) => {
    lines.push(line)
    text.textContent = lines.join('\n')
    text.scrollTop = text.scrollHeight
  }
}

export function installTrace(): void {
  if (!wanted()) return
  const write = panel()
  write(navigator.userAgent)
  const start = Document.prototype.startViewTransition as Start | undefined
  if (typeof start !== 'function') {
    write('no startViewTransition: pages change at once')
    return
  }
  const navigation = () => (window as unknown as { navigation?: { transition?: unknown } }).navigation
  let count = 0

  Document.prototype.startViewTransition = function (this: Document, arg?: Update | { update?: Update; types?: string[] }) {
    const n = ++count
    const t0 = performance.now()
    const at = () => `+${Math.round(performance.now() - t0)}`
    const log = (line: string) => write(`#${n} ${at()} ${line}`)
    // The router has changed the address already: the page being left is still the one shown.
    log(`start for ${window.location.pathname}; fonts ${document.fonts.status}; navigation ${navigation()?.transition ? 'pending' : 'none'}`)

    const traced = (update: Update): Update =>
      function (this: unknown) {
        log(`update called (old picture taken); root name "${document.documentElement.style.viewTransitionName}"`)
        const result = update.call(this)
        const promise = !!result && typeof (result as Promise<unknown>).then === 'function'
        log(`update returned ${promise ? 'a promise' : 'at once'}; now at ${window.location.pathname}; fonts ${document.fonts.status}`)
        if (promise) (result as Promise<unknown>).then(() => log('update promise settled'), () => log('update promise failed'))
        return result
      }
    const given = typeof arg === 'function' ? traced(arg) : arg?.update ? { ...arg, update: traced(arg.update) } : arg
    const transition = start.call(this, given)

    const pictures = () =>
      document.documentElement
        .getAnimations({ subtree: true })
        .filter((animation) => (animation.effect as KeyframeEffect | null)?.pseudoElement)
    const opacities = (when: string) => {
      const seen = pictures().map((animation) => {
        const effect = animation.effect as KeyframeEffect
        const name = (animation as CSSAnimation).animationName ?? ''
        const pseudo = effect.pseudoElement ?? ''
        let opacity = '?'
        try {
          opacity = getComputedStyle(document.documentElement, pseudo).opacity
        } catch {
          // A pseudo-element the browser does not read: its time says whether it moves.
        }
        return `${pseudo.replace('::view-transition', '')} ${name} t=${Math.round(Number(animation.currentTime ?? -1))} ${animation.playState} opacity=${opacity}`
      })
      log(`${when}: ${seen.join(' | ') || 'no animation'}`)
    }

    transition.updateCallbackDone.then(
      () => log('updateCallbackDone'),
      (error) => log(`update failed: ${String(error)}`),
    )
    transition.ready.then(
      () => {
        const listed = pictures().map((animation) => {
          const effect = animation.effect as KeyframeEffect
          return `${effect.pseudoElement?.replace('::view-transition', '')} ${(animation as CSSAnimation).animationName ?? ''} ${Math.round(Number(effect.getComputedTiming().duration))}ms ${animation.playState}`
        })
        log(`ready; ${document.querySelectorAll('main').length} main; ${listed.join(' | ') || 'no animation'}`)
        window.setTimeout(() => opacities('ready+60'), 60)
        window.setTimeout(() => opacities('ready+150'), 150)
      },
      (error) => log(`skipped: ${String(error)}`),
    )
    transition.finished.then(
      () => log(`finished; now at ${window.location.pathname}`),
      () => log('finished (cut short)'),
    )

    let frames = 0
    let last = t0
    let longest = 0
    const tick = (now: number) => {
      frames++
      longest = Math.max(longest, now - last)
      last = now
      if (now - t0 < FRAMES_FOR) window.requestAnimationFrame(tick)
      else log(`frames ${frames} in ${FRAMES_FOR}ms, longest gap ${Math.round(longest)}ms`)
    }
    window.requestAnimationFrame(tick)
    return transition
  }
}
