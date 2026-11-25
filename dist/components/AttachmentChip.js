import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LoaderCircle, Paperclip, X } from 'lucide-react';
import { deprecated } from '../lib/deprecated.js';
import { CLOSE_SM } from '../lib/recipes.js';
import { cn } from '../lib/utils.js';
import { Hint } from './Hint.js';
import { useLinkComponent } from './link-context.js';
import { useMessages } from './locale-context.js';
/** Longer than this, a label may not hold in a phone's room (10rem of small text): it may be cut, in its middle. */
const LONG = 24;
/** What a cut label keeps at its end: a file's extension and the few characters before it (`-v3`, a date's day). */
function endOf(label) {
    const extension = /\.[A-Za-z0-9]{1,8}$/.exec(label)?.[0] ?? '';
    return label.slice(-(extension.length + 6));
}
/**
 * Something attached to a request or a message: a file, a record. A long label is cut in its middle where
 * room ends (a phone), its end kept (a file's extension), the whole of it in a hint and said to screen
 * readers; it may lead somewhere, and be taken away.
 */
export function AttachmentChip({ label, detail, icon, thumbnail, href, linkComponent, onRemove, tone = 'neutral', pending: givenPending, busy, className, }) {
    // Its former name read as today's, said once in development.
    if (busy !== undefined)
        deprecated('busy', 'AttachmentChip');
    const pending = givenPending ?? busy ?? false;
    const applicationLink = useLinkComponent();
    const Link = linkComponent ?? applicationLink;
    const words = useMessages().ai;
    const danger = tone === 'danger';
    const mark = pending ? (_jsx(LoaderCircle, { className: "size-3.5 shrink-0 motion-safe:animate-spin", "aria-hidden": true })) : thumbnail ? (_jsx("img", { src: thumbnail, alt: "", className: "size-5 shrink-0 rounded-sm object-cover" })) : (_jsx("span", { className: "flex shrink-0 [&>svg]:size-3.5", "aria-hidden": true, children: icon ?? _jsx(Paperclip, {}) }));
    // A long label is cut as CopyChip cuts a value, in its middle: its start gives way where room ends, its end
    // (the extension) stays; what is shown is hidden from screen readers, which hear the whole of it.
    const long = label.length > LONG;
    const end = long ? endOf(label) : '';
    const name = long ? (_jsxs("span", { className: "flex min-w-0 max-w-[10rem] sm:max-w-[16rem]", children: [_jsxs("span", { "aria-hidden": true, className: "flex min-w-0", children: [_jsx("span", { className: "min-w-0 overflow-hidden text-ellipsis whitespace-pre", children: label.slice(0, -end.length) }), _jsx("span", { className: "shrink-0 whitespace-pre", children: end })] }), _jsx("span", { className: "sr-only", children: label })] })) : (_jsx("span", { className: "min-w-0 max-w-[10rem] truncate sm:max-w-[16rem]", children: label }));
    const named = href ? (_jsx(Link, { href: href, className: "flex min-w-0 underline-offset-4 hover:underline", children: name })) : (name);
    return (_jsxs("span", { "aria-busy": pending || undefined, className: cn('inline-flex min-h-7 max-w-full items-center gap-1.5 rounded-md border py-0.5 pl-1.5 text-xs', onRemove ? 'pr-0.5' : 'pr-2', danger
            ? 'border-negative/30 bg-negative/5 text-foreground dark:bg-negative/10'
            : 'border-border bg-surface-raised text-foreground accent:border-brand/25', className), children: [_jsx("span", { className: cn('text-muted-foreground', danger && 'text-negative'), children: mark }), long ? (_jsx(Hint, { content: label, wrap: !href, className: "min-w-0", children: named })) : (named), pending && _jsx("span", { className: "sr-only", children: words.attachmentPreparing }), detail && (_jsx("span", { className: cn('min-w-0 shrink truncate tabular-nums text-muted-foreground', danger && 'text-negative'), children: detail })), onRemove && (_jsx("button", { type: "button", onClick: onRemove, "aria-label": words.removeAttachment(label), className: CLOSE_SM, children: _jsx(X, { "aria-hidden": true }) }))] }));
}
