import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { ChevronRight } from 'lucide-react';
import { useLinkComponent } from '../components/link-context.js';
import { Popover } from '../components/Popover.js';
import { isPlainClick } from '../lib/links.js';
import { PRESSABLE, TONE_MARK, TONE_SOFT } from '../lib/recipes.js';
import { cn } from '../lib/utils.js';
import { byGravity, gravestTone, STATE_TONE, standsOut, stateSentence } from './state-summary.js';
// The pill in the gravest tone, as StateChip draws a state: its faint ground, a step stronger under the pointer
// and while it is open. Quiet, it is the top bar's plain button.
const PILL = {
    danger: cn(TONE_SOFT.negative, 'hover:bg-negative/10 aria-expanded:bg-negative/10 dark:hover:bg-negative/20 dark:aria-expanded:bg-negative/20'),
    warning: cn(TONE_SOFT.warning, 'hover:bg-warning/10 aria-expanded:bg-warning/10 dark:hover:bg-warning/20 dark:aria-expanded:bg-warning/20'),
    success: cn(TONE_SOFT.positive, 'hover:bg-positive/10 aria-expanded:bg-positive/10 dark:hover:bg-positive/20 dark:aria-expanded:bg-positive/20'),
    neutral: 'text-muted-foreground hover:bg-surface-hover hover:text-foreground aria-expanded:bg-surface-hover',
    ok: 'text-muted-foreground hover:bg-surface-hover hover:text-foreground aria-expanded:bg-surface-hover',
};
/**
 * The states the user must not miss, in one control of the top bar (AppShell's `topBarChips`): the gravest one's
 * words and icon in its tone, "+N" for the others (its icon and how many under 1280px), and a dot while all is well. It opens on every state, the
 * gravest first and the quiet ones after, each a link to where it is dealt with. Where several StateChips would
 * take the top bar's room: one is still a StateChip.
 */
export function StateSummary({ items, label = 'State', okLabel = 'All good', footer, className }) {
    const tone = gravestTone(items);
    const ordered = byGravity(items);
    const out = ordered.filter((item) => standsOut(item.tone));
    const quiet = ordered.filter((item) => !standsOut(item.tone));
    const lead = out[0];
    const neutral = quiet.find((item) => item.tone === 'neutral');
    const sentence = stateSentence(items, okLabel);
    return (_jsx(Popover, { label: label, align: "end", className: "w-[22rem] max-w-[calc(100vw-2rem)] p-1.5", trigger: _jsx("button", { type: "button", "aria-label": `${label}: ${sentence}`, className: cn(PRESSABLE, 'inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full px-2 text-xs font-medium transition-[background-color,color,scale] focus-ring xl:px-2.5 [&_svg]:size-3.5 [&_svg]:shrink-0', PILL[tone], className), children: lead ? (_jsxs(_Fragment, { children: [lead.icon ?? _jsx(Dot, { tone: lead.tone }), _jsx("span", { className: "hidden max-w-48 truncate xl:inline", children: lead.label }), out.length > 1 && (_jsxs("span", { className: "tabular-nums", children: [_jsxs("span", { className: "hidden xl:inline", children: ["+", out.length - 1] }), _jsx("span", { className: "xl:hidden", children: out.length })] }))] })) : (_jsxs(_Fragment, { children: [_jsx(Dot, { tone: tone }), _jsx("span", { className: "hidden sm:inline", children: neutral?.label ?? okLabel })] })) }), children: (close) => (_jsxs("div", { className: "flex flex-col gap-1", children: [out.length > 0 && _jsx(StateRows, { items: out, close: close }), out.length > 0 && quiet.length > 0 && _jsx("div", { "aria-hidden": true, className: "mx-2 border-t border-border" }), quiet.length > 0 && _jsx(StateRows, { items: quiet, close: close, quiet: true }), items.length === 0 && _jsx("p", { className: "px-2 py-1.5 text-muted-foreground", children: okLabel }), footer && (_jsx("div", { className: "mt-0.5 border-t border-border px-2 pt-2 pb-1 text-xs", onClick: (event) => {
                        if (isPlainClick(event) && event.target.closest('a'))
                            close();
                    }, children: footer }))] })) }));
}
function Dot({ tone }) {
    return _jsx("span", { "aria-hidden": true, className: cn('size-1.5 shrink-0 rounded-full', TONE_MARK[STATE_TONE[tone]]) });
}
function StateRows({ items, close, quiet = false }) {
    const Link = useLinkComponent();
    return (_jsx("ul", { className: "flex flex-col", children: items.map((item) => {
            const body = (_jsxs(_Fragment, { children: [quiet ? (_jsx("span", { "aria-hidden": true, className: "grid size-5 shrink-0 place-items-center", children: _jsx(Dot, { tone: item.tone }) })) : (_jsx("span", { "aria-hidden": true, className: cn('grid size-5 shrink-0 place-items-center rounded-full [&_svg]:size-3', TONE_SOFT[STATE_TONE[item.tone]]), children: item.icon ?? _jsx(Dot, { tone: item.tone }) })), _jsxs("span", { className: "min-w-0 flex-1", children: [_jsx("span", { className: cn('block', quiet ? 'text-text-secondary' : 'font-medium text-foreground'), children: item.label }), item.detail && _jsx("span", { className: "mt-0.5 block text-xs text-muted-foreground", children: item.detail })] }), item.href && _jsx(ChevronRight, { "aria-hidden": true, className: "mt-0.5 size-3.5 shrink-0 text-muted-foreground" })] }));
            const row = 'flex items-start gap-2.5 rounded-lg px-2 py-1.5';
            return (_jsx("li", { children: item.href ? (_jsx(Link, { href: item.href, className: cn(row, 'transition-colors hover:bg-surface-hover'), 
                    // Followed here, the panel goes with the page left; opened in another tab, it stays.
                    onClick: (event) => isPlainClick(event) && close(), children: body })) : (_jsx("div", { className: row, children: body })) }, item.id));
        }) }));
}
