// What is said to screen readers once something has happened ("Copied", "3 unsaved changes", a toast): two live regions,
// one polite (said after what is being read) and one assertive (said at once: what went wrong). A region must be there
// before its words arrive, or some screen readers miss them: `prepareLiveRegions` makes both early (ToastProvider does
// as it mounts); `announce` makes them otherwise, the first time something is said, nothing being added to the page by
// loading the package. While a dialog keeps the focus (focus-scope.ts), its regions are in it: a screen reader keeps
// to an aria-modal dialog, and may not hear a region outside it.
import { currentFocusScope } from './focus-scope.js'

export type Politeness = 'polite' | 'assertive'

const regions: Partial<Record<Politeness, HTMLElement>> = {}
const pending: Partial<Record<Politeness, ReturnType<typeof setTimeout>>> = {}

function liveRegion(politeness: Politeness): HTMLElement {
  let region = regions[politeness]
  if (!region) {
    region = document.createElement('div')
    region.setAttribute('aria-live', politeness)
    region.setAttribute('aria-atomic', 'true')
    region.dataset.ioitiAnnouncer = politeness
    // Visually hidden, as Tailwind's sr-only: out of sight, still read.
    Object.assign(region.style, {
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: '0',
      margin: '-1px',
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      whiteSpace: 'nowrap',
      border: '0',
    })
    regions[politeness] = region
  }
  const home = currentFocusScope() ?? document.body
  if (region.parentElement !== home) home.append(region)
  return region
}

/** Makes both live regions now, before anything is said: a screen reader hears the first words said in them. */
export function prepareLiveRegions(): void {
  if (typeof document === 'undefined') return
  liveRegion('polite')
  liveRegion('assertive')
}

/** Says a short message to screen readers: politely (after what they are reading) unless asked to say it at once. */
export function announce(message: string, politeness: Politeness = 'polite'): void {
  if (typeof document === 'undefined') return
  const target = liveRegion(politeness)
  // Emptied first, then said a moment later: the same words said twice are heard twice.
  target.textContent = ''
  clearTimeout(pending[politeness])
  pending[politeness] = setTimeout(() => {
    target.textContent = message
  }, 50)
}
