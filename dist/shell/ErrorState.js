import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Home, RefreshCw, RotateCcw, TriangleAlert, WifiOff } from 'lucide-react';
import { useContext, useEffect, useRef } from 'react';
import { ButtonLink } from '../components/ButtonLink.js';
import { useMessages } from '../components/locale-context.js';
import { Button } from '../components/ui/button.js';
import { errorDetails, errorKind } from '../lib/errors.js';
import { TONE_TEXT } from '../lib/recipes.js';
import { useScrollRegion } from '../lib/scroll-region.js';
import { cn } from '../lib/utils.js';
import { TabTitleContext, usePageName, useTabTitle } from './page-trail-context.js';
// What each kind says, by its words in the catalogue (`error`): with a Try again and without one (nothing to press says
// nothing of pressing); its icon and its tone.
const KINDS = {
    other: { page: 'otherPage', part: 'otherPart', retry: 'otherRetry', wait: 'otherWait', icon: _jsx(TriangleAlert, {}), tone: TONE_TEXT.negative },
    offline: { page: 'offlinePage', part: 'offlinePart', retry: 'offlineRetry', wait: 'offlineWait', icon: _jsx(WifiOff, {}), tone: TONE_TEXT.warning },
    // Reloaded whatever is given: there is always a button to press.
    chunk: { page: 'chunkPage', part: 'chunkPart', retry: 'chunkReload', wait: 'chunkReload', icon: _jsx(RefreshCw, {}), tone: TONE_TEXT.info },
};
/**
 * What a page, or a part of one, shows in place of itself when it failed: what went wrong, in words for its kind,
 * and the way on (try again, reload, home). AppShell shows it for a page that throws, the shell kept; ErrorBoundary
 * for a part; RouterErrorPage for a route that failed to load. For an address that names nothing, NotFoundState.
 */
export function ErrorState(props) {
    return props.page === false ? _jsx(ErrorPart, { ...props }) : _jsx(ErrorPage, { ...props });
}
/** A page that failed: named in the trail and the tab, as any page. */
function ErrorPage(props) {
    const words = useMessages().error;
    const title = props.title ?? words[KINDS[errorKind(props.error)].page];
    usePageName(props.name ?? title, props.parents);
    useTabTitle(props.name ?? title);
    // A shell drawn in a part of a page (a demo) names no tab, and its page takes no focus from the page around it.
    const ownsTheTab = useContext(TabTitleContext);
    return _jsx(ErrorView, { ...props, title: title, focusOnMount: props.focusOnMount ?? ownsTheTab, page: true });
}
/** A part of a page that failed: naming nothing, said where the focus is. */
function ErrorPart(props) {
    const words = useMessages().error;
    return _jsx(ErrorView, { ...props, title: props.title ?? words[KINDS[errorKind(props.error)].part], focusOnMount: props.focusOnMount ?? false, page: false });
}
function ErrorView({ title, description, error, onRetry, retrying = false, home, page, focusOnMount, headingLevel, icon, className, }) {
    const kind = errorKind(error);
    const said = KINDS[kind];
    const words = useMessages().error;
    const root = useRef(null);
    const heading = useRef(null);
    useEffect(() => {
        if (focusOnMount)
            heading.current?.focus({ preventScroll: true });
    }, [focusOnMount]);
    // Its Try again worked: the error goes, its button with it, and the focus goes to the page (its main) rather than to
    // nothing. Tried and failed again, the new error's heading has it already.
    const retried = useRef(false);
    useEffect(() => {
        const landing = root.current?.closest('main');
        return () => {
            if (!retried.current || !landing)
                return;
            requestAnimationFrame(() => {
                const now = document.activeElement;
                if ((now && now !== document.body && now.isConnected) || !landing.isConnected)
                    return;
                if (!landing.hasAttribute('tabindex'))
                    landing.tabIndex = -1;
                landing.focus({ preventScroll: true });
            });
        };
    }, []);
    const Heading = `h${headingLevel ?? (page ? 1 : 3)}`;
    const way = home === undefined ? (page ? { href: '/', label: words.backToHome } : null) : home;
    // A part of the application that failed to load comes back by reloading the page: trying again loads the same.
    const again = kind === 'chunk' ? () => window.location.reload() : onRetry;
    const retry = again &&
        (() => {
            retried.current = true;
            again();
        });
    const details = process.env.NODE_ENV !== 'production' && error !== undefined ? errorDetails(error) : '';
    // A stack longer than its box: a stop of the keyboard, which scrolls it.
    const detailsText = useRef(null);
    const detailsRegion = useScrollRegion(detailsText, { label: words.details, key: details });
    return (_jsxs("div", { ref: root, 
        // A part that failed is said where the focus is; a page's heading takes the focus, which says it.
        role: page ? undefined : 'alert', className: cn('flex flex-col items-center whitespace-normal text-center', page ? 'gap-2 px-6 py-16' : 'gap-1 px-4 py-6', className), children: [_jsx("div", { "aria-hidden": true, className: cn('grid place-items-center rounded-xl border border-border bg-surface-raised', icon ? 'text-muted-foreground' : said.tone, page ? 'mb-3 size-12 [&>svg]:size-6' : 'mb-2 size-8 [&>svg]:size-4'), children: icon ?? said.icon }), _jsx(Heading, { ref: heading, tabIndex: -1, className: cn('text-balance break-words font-semibold text-foreground outline-none', page ? 'text-2xl tracking-tight' : 'text-sm'), children: title }), _jsx("p", { className: cn('text-pretty text-muted-foreground', page ? 'max-w-md text-sm' : 'max-w-sm text-xs'), children: description ?? words[again ? said.retry : said.wait] }), (again || way) && (_jsxs("div", { className: cn('flex flex-wrap items-center justify-center gap-2', page ? 'mt-4' : 'mt-3'), children: [again && (_jsx(Button, { size: page ? 'md' : 'sm', variant: way ? 'primary' : 'outline', isLoading: retrying, leftIcon: kind === 'chunk' ? _jsx(RefreshCw, { className: "size-4" }) : _jsx(RotateCcw, { className: "size-4" }), onClick: retry, children: kind === 'chunk' ? words.reload : words.tryAgain })), way && (_jsx(ButtonLink, { to: way.href, variant: again ? 'outline' : 'primary', size: page ? 'md' : 'sm', leftIcon: _jsx(Home, { className: "size-4" }), children: way.label }))] })), details && (_jsxs("details", { className: cn('w-full max-w-2xl text-left', page ? 'mt-6' : 'mt-3'), children: [_jsx("summary", { className: "cursor-pointer text-xs text-muted-foreground", children: words.details }), _jsx("pre", { ref: detailsText, ...detailsRegion, className: "mt-2 max-h-60 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-border bg-surface-raised p-3 font-mono text-[13px] text-foreground", children: details })] }))] }));
}
