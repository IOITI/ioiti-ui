import type { CSSProperties } from 'react'

/**
 * ioiti-ui's motion as the page carries it: what is written on <html> and on the layers over the
 * page for the stylesheets (src/styles/motion.css) to read. Its curves are motion-tokens.ts, for
 * framer-motion, and the same in motion.css, for the stylesheets.
 */

/**
 * The style of a layer fixed over the page (a dialog, a sheet, the drawer, the toasts), each with a
 * name of its own: a change of page is drawn above the whole document, and would cover it, but a
 * layer named stays above it, live (motion.css). On the layer's container, which does not move, so
 * that what moves inside it is seen moving.
 */
export function overPage(name: string): CSSProperties {
  return { viewTransitionName: `ioiti-${name}`, viewTransitionClass: 'ioiti-layer' }
}

/** IoitiProvider's `reducedMotion`, on <html> while it is not the system's: what motion.css reads. */
export const REDUCED_MOTION_ATTRIBUTE = 'data-reduced-motion'

/** Motion reduced as the system asks (`user`), always, or never. */
export type ReducedMotion = 'user' | 'always' | 'never'

/** `user` writes nothing: the stylesheets then follow the system's setting, as framer-motion does. */
export function applyReducedMotion(setting: ReducedMotion, root: HTMLElement = document.documentElement): void {
  if (setting === 'user') root.removeAttribute(REDUCED_MOTION_ATTRIBUTE)
  else root.setAttribute(REDUCED_MOTION_ATTRIBUTE, setting)
}

/** On <html> while the look changes: the page's own transitions hold still meanwhile (motion.css). */
export const LOOK_CHANGE_ATTRIBUTE = 'data-look-change'

/** How long a change of look waits for the browser to draw it: past this, it is drawn without its fade. */
export const LOOK_CHANGE_WAIT = 300

let lookChanges = 0

/**
 * A change of look (the theme, the accent, the material) in one cross-fade of the whole page, where
 * the browser has view transitions; at once where it has none. `update` changes the page before it
 * returns (React's flushSync). Meanwhile the components' own transitions hold still, so that no colour
 * arrives a step after the others. A fade, which stays where motion is reduced.
 *
 * A click is answered at once: the browser draws the change at its next frame, and where none comes
 * soon (a window it no longer paints), the change is drawn without its fade; a transition that ends
 * without calling `update` (cut short) has it called then. Never lost, never twice.
 */
export function changeLook(update: () => void, root: HTMLElement = document.documentElement): void {
  if (typeof document.startViewTransition !== 'function') {
    update()
    return
  }
  const change = ++lookChanges
  let skip: (() => void) | undefined
  let updated = false
  const late = window.setTimeout(() => skip?.(), LOOK_CHANGE_WAIT)
  const run = () => {
    window.clearTimeout(late)
    if (updated) return
    updated = true
    update()
  }
  const done = () => {
    run()
    // A later change keeps it until its own end.
    if (change === lookChanges) root.removeAttribute(LOOK_CHANGE_ATTRIBUTE)
  }
  root.setAttribute(LOOK_CHANGE_ATTRIBUTE, '')
  const transition = document.startViewTransition(run)
  skip = () => transition.skipTransition()
  transition.finished.then(done, done)
}
