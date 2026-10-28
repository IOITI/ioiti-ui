import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Lock } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle.js';
import { useTabTitle } from './page-trail-context.js';
/** The page of a sign-in, outside the shell: one card in the middle of the screen. */
export function AuthLayout({ title, description, icon, themeToggle = true, tabTitle, children }) {
    useTabTitle(tabTitle ?? title);
    return (_jsxs("main", { className: "relative grid min-h-dvh place-items-center p-6", children: [themeToggle && _jsx(ThemeToggle, { className: "absolute right-4 top-4" }), _jsxs("div", { className: "w-full max-w-sm rounded-2xl border border-border/70 bg-surface/50 p-8 shadow-elevated dark:bg-surface/25 glass-card", children: [_jsxs("div", { className: "mb-6 flex flex-col gap-1.5", children: [_jsx("div", { className: "mb-3 grid size-10 place-items-center rounded-xl border border-border bg-surface-raised", children: icon ?? _jsx(Lock, { className: "size-4 text-foreground", "aria-hidden": true }) }), _jsx("h1", { className: "text-xl font-semibold tracking-tight", children: title }), description && _jsx("p", { className: "text-sm text-muted-foreground", children: description })] }), children] })] }));
}
