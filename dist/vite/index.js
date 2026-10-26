import { readFileSync, realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { searchForWorkspaceRoot } from 'vite';
export const DEFAULT_THEME_SCRIPT = 'ioiti-theme.js';
/**
 * What an application built with Vite needs for ioiti-ui, and would otherwise do by hand:
 *
 * - the pre-paint theme script (`theme.js`), served and written beside the pages, and its tag at
 *   the top of `<head>`, with the application's storage key: the page is painted in its theme
 *   from the first frame, and a strict Content-Security-Policy (no inline script) holds;
 * - no file inlined as a `data:` URI unless the application says otherwise: the smallest font
 *   files are under Vite's 4 kB limit, and `font-src 'self'` refuses a font given as data;
 * - one React and one framer-motion, the application's, even through a `file:` link to the
 *   package (whose own folder has copies of them for its tests);
 * - the package's folder allowed to the dev server, for its fonts, through such a link.
 */
export function ioiti(options = {}) {
    const fileName = options.themeScript ?? DEFAULT_THEME_SCRIPT;
    const storageKey = options.themeStorageKey ?? 'ioiti.theme';
    // dist/vite/index.js reads dist/theme.js; in the package's own gallery, src/vite reads src/theme.js.
    const source = readFileSync(new URL('../theme.js', import.meta.url), 'utf8');
    const packageRoot = realpathSync(fileURLToPath(new URL('../..', import.meta.url)));
    let base = '/';
    return {
        name: 'ioiti-ui',
        config(config) {
            const root = config.root ?? process.cwd();
            const added = {
                resolve: { dedupe: ['react', 'react-dom', 'framer-motion'] },
                // Merged with the application's own list. Without one, Vite allows the workspace alone.
                server: { fs: { allow: [searchForWorkspaceRoot(root), packageRoot] } },
            };
            if (config.build?.assetsInlineLimit === undefined)
                added.build = { assetsInlineLimit: 0 };
            return added;
        },
        configResolved(config) {
            base = config.base;
        },
        configureServer(server) {
            server.middlewares.use((request, response, next) => {
                if (request.url?.split('?')[0] !== `${base}${fileName}`)
                    return next();
                response.setHeader('Content-Type', 'text/javascript');
                response.end(source);
            });
        },
        transformIndexHtml() {
            const tag = {
                tag: 'script',
                attrs: { src: `${base}${fileName}`, 'data-storage-key': storageKey },
                injectTo: 'head-prepend',
            };
            return [tag];
        },
        generateBundle() {
            this.emitFile({ type: 'asset', fileName, source });
        },
    };
}
