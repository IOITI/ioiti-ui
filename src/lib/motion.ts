/**
 * ioiti-ui's motion as the page carries it: what is written on <html> for the stylesheets
 * (src/styles/motion.css) to read. Its curves are motion-tokens.ts, for framer-motion, and the
 * same in motion.css, for the stylesheets.
 */

/** IoitiProvider's `reducedMotion`, on <html> while it is not the system's: what motion.css reads. */
export const REDUCED_MOTION_ATTRIBUTE = 'data-reduced-motion'

/** Motion reduced as the system asks (`user`), always, or never. */
export type ReducedMotion = 'user' | 'always' | 'never'

/** `user` writes nothing: the stylesheets then follow the system's setting, as framer-motion does. */
export function applyReducedMotion(setting: ReducedMotion, root: HTMLElement = document.documentElement): void {
  if (setting === 'user') root.removeAttribute(REDUCED_MOTION_ATTRIBUTE)
  else root.setAttribute(REDUCED_MOTION_ATTRIBUTE, setting)
}
