import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Hint } from '../components/Hint.js';
import { useLinkComponent } from '../components/link-context.js';
import { TONE_SOFT } from '../lib/recipes.js';
import { cn } from '../lib/utils.js';
// The design's tones (recipes.ts), their faint ground, a step stronger under the pointer: each word keeps 4.5:1 on both.
const CHIP_TONE = {
    warning: cn(TONE_SOFT.warning, 'hover:bg-warning/10 dark:hover:bg-warning/20'),
    danger: cn(TONE_SOFT.negative, 'hover:bg-negative/10 dark:hover:bg-negative/20'),
    // Good news not to miss either (approved, merged): still a link to where it goes on.
    success: cn(TONE_SOFT.positive, 'hover:bg-positive/10 dark:hover:bg-positive/20'),
};
/**
 * A state the user must not miss, on whichever page they are (in the top bar,
 * AppShell's `topBarChips`): shown only while it applies, and a link to the
 * page where it is dealt with. On a narrow screen the icon stays and the words
 * are its name; what it means is its hint.
 */
export function StateChip({ to, tone, icon, label, hint }) {
    const Link = useLinkComponent();
    return (_jsx(Hint, { content: hint, side: "bottom", children: _jsxs(Link, { href: to, "aria-label": label, className: cn('inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full px-2 text-xs font-medium transition-colors lg:px-2.5', CHIP_TONE[tone]), children: [icon, _jsx("span", { className: "hidden lg:inline", children: label })] }) }));
}
