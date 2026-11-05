/**
 * ioiti-ui's motion as the page carries it: what is written on <html> for the stylesheets
 * (src/styles/motion.css) to read. Its curves are motion-tokens.ts, for framer-motion, and the same
 * in motion.css, for the stylesheets.
 */
/** IoitiProvider's `reducedMotion`, on <html> while it is not the system's: what motion.css reads. */
export declare const REDUCED_MOTION_ATTRIBUTE = "data-reduced-motion";
/** Motion reduced as the system asks (`user`), always, or never. */
export type ReducedMotion = 'user' | 'always' | 'never';
/** `user` writes nothing: the stylesheets then follow the system's setting, as framer-motion does. */
export declare function applyReducedMotion(setting: ReducedMotion, root?: HTMLElement): void;
/** On <html> while the look changes: the page's own transitions hold still meanwhile (motion.css). */
export declare const LOOK_CHANGE_ATTRIBUTE = "data-look-change";
/** How long a change of look waits for the browser to draw it: past this, it is drawn without its fade. */
export declare const LOOK_CHANGE_WAIT = 300;
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
export declare function changeLook(update: () => void, root?: HTMLElement): void;
