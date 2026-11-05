import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { LoaderCircle } from 'lucide-react';
import { useEffect } from 'react';
import { useControllableState } from '../lib/controllable.js';
import { isPlainClick } from '../lib/links.js';
import { cn } from '../lib/utils.js';
import { ButtonLink } from './ButtonLink.js';
import { Hint } from './Hint.js';
/**
 * The ways to sign in through an identity provider (single sign-on), beside the form of a password: a button the
 * whole width for each, which leads to the server's address for it. Its page is loaded from the server, never
 * through the router: the server sends the browser on to the provider. Once one is chosen, its button is busy
 * and the others are disabled until the browser has left; back from the browser's history, they are as they were.
 */
export function SignInProviders({ providers, children, placement = 'before', divider = 'or', pending, onPendingChange, label = 'Single sign-on', variant = 'outline', className, }) {
    const [current, setCurrent] = useControllableState(pending, null, onPendingChange);
    // The page left for a provider may come back whole from the browser's history (its back-forward cache), as it
    // was when it was left: nothing is on its way any more.
    useEffect(() => {
        if (current === null)
            return;
        const shown = (event) => {
            if (event.persisted)
                setCurrent(null);
        };
        window.addEventListener('pageshow', shown);
        return () => window.removeEventListener('pageshow', shown);
    }, [current, setCurrent]);
    const list = providers.length > 0 && (_jsx("ul", { "aria-label": label, className: "flex flex-col gap-2", children: providers.map((provider) => {
            const busy = provider.id === current;
            const disabled = Boolean(provider.disabled) || (current !== null && !busy);
            return (_jsx("li", { children: _jsx(Hint, { content: provider.hint, wrap: disabled, className: "flex w-full *:flex-1", children: _jsx(ButtonLink, { to: disabled ? null : provider.href, reloadDocument: true, variant: variant, leftIcon: busy ? _jsx(LoaderCircle, { className: "size-4 motion-safe:animate-spin", "aria-hidden": true }) : provider.icon, "aria-disabled": busy || undefined, "aria-busy": busy || undefined, onClick: (event) => {
                            // On its way already: once is enough.
                            if (busy)
                                event.preventDefault();
                            else if (!event.defaultPrevented && isPlainClick(event))
                                setCurrent(provider.id);
                        }, className: cn('w-full', busy && 'cursor-not-allowed opacity-30'), children: provider.label }) }) }, provider.id));
        }) }));
    const line = list && children && divider !== null && divider !== false && _jsx(Divider, { children: divider });
    return (_jsxs("div", { className: cn('flex flex-col gap-5', className), children: [placement === 'before' ? list : children, line, placement === 'before' ? children : list] }));
}
/** A line across, its words in the middle, read between the providers and the form. */
function Divider({ children }) {
    return (_jsxs("div", { className: "flex items-center gap-3 text-xs text-muted-foreground", children: [_jsx("span", { "aria-hidden": true, className: "h-px flex-1 bg-border" }), children !== '' && (_jsxs(_Fragment, { children: [children, _jsx("span", { "aria-hidden": true, className: "h-px flex-1 bg-border" })] }))] }));
}
