import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AnimatePresence, motion } from 'framer-motion';
import { useContext, useEffect, useId, useLayoutEffect, useRef } from 'react';
import { announce } from '../lib/announce.js';
import { motionTransitions } from '../lib/motion-tokens.js';
import { TOAST } from '../lib/recipes.js';
import { cn } from '../lib/utils.js';
import { useMessages } from './locale-context.js';
import { ToastInsetContext } from './toast-context.js';
import { Button } from './ui/button.js';
/**
 * The bar of unsaved changes, at the bottom of the page while there are any: what there is to save, and
 * Discard and Save. It stays in sight as the page scrolls, the toasts rising above it; a screen reader
 * hears it once when it comes. With `RouterLeaveGuard`, leaving the page asks first. As Elastic UI's
 * bottom bar does.
 */
export function SaveBar({ open, message: givenMessage, onSave, onDiscard, saving = false, saveDisabled = false, error, saveLabel: givenSaveLabel, discardLabel: givenDiscardLabel, children, label: givenLabel, className, }) {
    // Its words the provider's language's, its own props given over them.
    const words = useMessages().field;
    // A `null` given says nothing, as it did.
    const message = givenMessage === undefined ? words.unsavedChanges : givenMessage;
    const saveLabel = givenSaveLabel ?? words.save;
    const discardLabel = givenDiscardLabel ?? words.discard;
    const label = givenLabel ?? words.unsavedChanges;
    const key = useId();
    const bar = useRef(null);
    const lift = useContext(ToastInsetContext);
    // The toasts clear it while it is there.
    useLayoutEffect(() => {
        if (!lift)
            return;
        lift(key, open ? (bar.current?.offsetHeight ?? 56) + 16 : 0);
        return () => lift(key, 0);
    }, [lift, key, open]);
    // Said once as it comes, not again at each change counted.
    const said = typeof message === 'string' ? message : label;
    const saidRef = useRef(said);
    useEffect(() => {
        saidRef.current = said;
    });
    useEffect(() => {
        if (open)
            announce(saidRef.current);
    }, [open]);
    return (_jsx(AnimatePresence, { children: open && (_jsxs(motion.div, { ref: bar, role: "region", "aria-label": label, initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 16, transition: motionTransitions.easeExit }, transition: motionTransitions.springSheet, className: cn(
            // A bar that floats over the page: a toast's surface and padding.
            TOAST, 'sticky bottom-4 z-30 mx-auto flex w-full max-w-3xl flex-wrap items-center gap-x-4 gap-y-2 p-4', className), children: [_jsxs("div", { className: "min-w-0 flex-1 text-sm", children: [_jsx("p", { className: "font-medium text-foreground", children: message }), error && (_jsx("p", { role: "alert", className: "text-xs text-negative", children: error }))] }), _jsxs("div", { className: "flex shrink-0 items-center gap-2", children: [children, onDiscard && (_jsx(Button, { variant: "ghost", size: "sm", onClick: onDiscard, disabled: saving, children: discardLabel })), _jsx(Button, { size: "sm", onClick: onSave, isLoading: saving, loadingText: words.saving, disabled: saveDisabled, children: saveLabel })] })] })) }));
}
