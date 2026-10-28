import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId, useLayoutEffect, useRef } from 'react';
import { ArrowUp, Square } from 'lucide-react';
import { cn } from '../lib/utils.js';
import { Hint } from './Hint.js';
// A line of the field when the browser says none (jsdom): its text is 14 px on 1.5.
const FALLBACK_LINE_HEIGHT = 21;
/**
 * A request typed to an assistant: a field that grows with its text, sent with Enter (a new line with
 * Shift+Enter; on a touch screen, Enter is a new line and the button sends), stopped while it is
 * answered, and requests to start from.
 */
export function PromptComposer({ value, onValueChange, onSubmit, onStop, busy = false, disabled = false, disabledReason, label, hideLabel = false, placeholder, suggestions = [], footer, controls, maxLength, minRows = 2, maxRows = 10, className, }) {
    const id = useId();
    const field = useRef(null);
    const over = maxLength !== undefined && value.length > maxLength;
    const canSend = !disabled && !busy && value.trim() !== '' && !over;
    // Its height follows its text, from minRows to maxRows.
    useLayoutEffect(() => {
        const element = field.current;
        if (!element)
            return;
        const style = window.getComputedStyle(element);
        const line = Number.parseFloat(style.lineHeight) || FALLBACK_LINE_HEIGHT;
        const padding = (Number.parseFloat(style.paddingTop) || 0) + (Number.parseFloat(style.paddingBottom) || 0);
        element.style.height = 'auto';
        const wanted = Math.max(element.scrollHeight, line * minRows + padding);
        element.style.height = `${Math.min(wanted, line * maxRows + padding)}px`;
    }, [value, minRows, maxRows]);
    function send() {
        if (canSend)
            onSubmit(value.trim());
    }
    function onKeyDown(event) {
        if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing)
            return;
        // On a touch screen, Enter is the keyboard's new line: the button sends.
        if (window.matchMedia?.('(pointer: coarse)').matches)
            return;
        event.preventDefault();
        send();
    }
    function suggest(prompt) {
        onValueChange(prompt);
        const element = field.current;
        if (!element)
            return;
        element.focus();
        // At the end of what it put, once React has written it.
        requestAnimationFrame(() => element.setSelectionRange(prompt.length, prompt.length));
    }
    const reason = disabled && !busy ? disabledReason : undefined;
    const sendButton = (_jsx("button", { type: "button", onClick: send, disabled: !canSend, "aria-label": "Send", className: "grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-[opacity,transform] duration-150 active:scale-95 disabled:opacity-40 accent:bg-(image:--brand-fill) accent:text-brand-fill-foreground", children: _jsx(ArrowUp, { className: "h-4 w-4", "aria-hidden": true }) }));
    return (_jsxs("div", { className: cn('min-w-0', className), children: [_jsx("label", { htmlFor: id, className: cn('mb-1.5 block text-sm font-medium text-foreground', hideLabel && 'sr-only'), children: label }), suggestions.length > 0 && (_jsx("div", { className: "mb-2 flex flex-wrap gap-1.5", role: "group", "aria-label": "Requests to start from", children: suggestions.map((suggestion) => (_jsx("button", { type: "button", disabled: disabled || busy, onClick: () => suggest(suggestion.prompt), className: "rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted-foreground transition-colors duration-150 hover:border-border-hover hover:text-foreground disabled:opacity-50", children: suggestion.label }, suggestion.label))) })), _jsxs("div", { className: "rounded-2xl border border-border bg-surface transition-colors duration-150 focus-within:border-border-hover", children: [_jsx("textarea", { ref: field, id: id, value: value, rows: minRows, placeholder: placeholder, disabled: disabled, "aria-invalid": over || undefined, onChange: (event) => onValueChange(event.target.value), onKeyDown: onKeyDown, className: "block w-full resize-none overflow-y-auto bg-transparent px-3.5 pt-3 text-sm leading-normal text-foreground outline-none placeholder:text-muted-foreground disabled:opacity-60" }), _jsxs("div", { className: "flex items-center justify-between gap-3 px-3 pb-2.5 pt-1", children: [_jsxs("div", { className: "flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1", children: [controls && _jsx("div", { className: "-ml-1 flex min-w-0 flex-wrap items-center gap-1", children: controls }), _jsxs("div", { className: "min-w-0 max-w-full truncate text-xs text-muted-foreground", children: [maxLength !== undefined && (_jsxs("span", { className: cn('tabular-nums', over && 'text-negative'), children: [value.length.toLocaleString(), " / ", maxLength.toLocaleString(), footer ? ' · ' : ''] })), footer] })] }), busy && onStop ? (_jsx("button", { type: "button", onClick: onStop, "aria-label": "Stop", className: "grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border bg-surface-hover text-foreground transition-transform duration-150 active:scale-95", children: _jsx(Square, { className: "h-3.5 w-3.5 fill-current", "aria-hidden": true }) })) : reason ? (_jsx(Hint, { content: reason, wrap: true, children: sendButton })) : (sendButton)] })] })] }));
}
