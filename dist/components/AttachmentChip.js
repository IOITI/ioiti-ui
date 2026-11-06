import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LoaderCircle, Paperclip, X } from 'lucide-react';
import { cn } from '../lib/utils.js';
import { useLinkComponent } from './link-context.js';
/**
 * Something attached to a request or a message: a file, a record. Its label is cut where room ends (a
 * phone), the whole of it said to screen readers; it may lead somewhere, and be taken away.
 */
export function AttachmentChip({ label, detail, icon, thumbnail, href, linkComponent, onRemove, tone = 'neutral', busy = false, className, }) {
    const applicationLink = useLinkComponent();
    const Link = linkComponent ?? applicationLink;
    const danger = tone === 'danger';
    const mark = busy ? (_jsx(LoaderCircle, { className: "size-3.5 shrink-0 motion-safe:animate-spin", "aria-hidden": true })) : thumbnail ? (_jsx("img", { src: thumbnail, alt: "", className: "size-5 shrink-0 rounded object-cover" })) : (_jsx("span", { className: "flex shrink-0 [&>svg]:size-3.5", "aria-hidden": true, children: icon ?? _jsx(Paperclip, {}) }));
    const name = _jsx("span", { className: "min-w-0 max-w-[10rem] truncate sm:max-w-[16rem]", children: label });
    return (_jsxs("span", { "aria-busy": busy || undefined, className: cn('inline-flex min-h-7 max-w-full items-center gap-1.5 rounded-lg border py-0.5 pl-1.5 text-xs', onRemove ? 'pr-0.5' : 'pr-2', danger
            ? 'border-negative/40 bg-negative/5 text-foreground'
            : 'border-border bg-surface-raised text-foreground accent:border-brand/25', className), children: [_jsx("span", { className: cn('text-muted-foreground', danger && 'text-negative'), children: mark }), href ? (_jsx(Link, { href: href, className: "flex min-w-0 underline-offset-4 hover:underline", children: name })) : (name), busy && _jsx("span", { className: "sr-only", children: ", being made ready" }), detail && (_jsx("span", { className: cn('min-w-0 shrink truncate tabular-nums text-muted-foreground', danger && 'text-negative'), children: detail })), onRemove && (_jsx("button", { type: "button", onClick: onRemove, "aria-label": `Remove ${label}`, className: "grid size-6 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-surface-hover hover:text-foreground", children: _jsx(X, { className: "size-3.5", "aria-hidden": true }) }))] }));
}
