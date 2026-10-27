import type { Plugin } from 'vite';
declare const ACCENTS: readonly ["neutral", "violet", "indigo", "blue", "bloom"];
declare const MATERIALS: readonly ["flat", "glass"];
export interface IoitiPluginOptions {
    /**
     * Where the theme chosen with the button is kept in the browser (localStorage): one key per
     * application, or two applications on one domain share their choice. `ioiti.theme` by default.
     */
    themeStorageKey?: string;
    /** The file the pre-paint theme script is served and written as, at the root of the site. */
    themeScript?: string;
    /**
     * The application's accent, shown from the first paint until a person picks another (LookPicker):
     * the colour of what is chosen, current or primary. `neutral` by default, the design's ink.
     */
    accent?: (typeof ACCENTS)[number];
    /**
     * The application's material, shown until a person picks another: `flat` by default, `glass` for
     * translucent surfaces over a colour backdrop.
     */
    material?: (typeof MATERIALS)[number];
}
export declare const DEFAULT_THEME_SCRIPT = "ioiti-theme.js";
/**
 * What an application built with Vite needs for ioiti-ui, and would otherwise do by hand:
 *
 * - the pre-paint theme script (`theme.js`), served and written beside the pages, and its tag at
 *   the top of `<head>`, with the application's storage key, accent and material: the page is
 *   painted in its theme from the first frame, and a strict Content-Security-Policy (no inline
 *   script) holds;
 * - no file inlined as a `data:` URI unless the application says otherwise: the smallest font
 *   files are under Vite's 4 kB limit, and `font-src 'self'` refuses a font given as data;
 * - one React and one framer-motion, the application's, even through a `file:` link to the
 *   package (whose own folder has copies of them for its tests);
 * - the package's folder allowed to the dev server, for its fonts, through such a link.
 */
export declare function ioiti(options?: IoitiPluginOptions): Plugin;
export {};
