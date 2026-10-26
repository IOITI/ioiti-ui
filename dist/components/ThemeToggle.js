import { jsx as _jsx } from "react/jsx-runtime";
import { Monitor, Moon, Sun } from 'lucide-react';
import { nextPreference, themeLabel } from '../lib/theme.js';
import { cn } from '../lib/utils.js';
import { useTheme } from './theme-context.js';
const ICONS = { system: Monitor, light: Sun, dark: Moon };
/**
 * One button for three states: follow the system, light, dark. Its icon is the
 * state it is in, and its label says both that and what a press does, since an
 * icon alone cannot ("Theme: follows the system (dark now). Press for always light.").
 */
export function ThemeToggle({ className }) {
    const { preference, theme, setPreference } = useTheme();
    const Icon = ICONS[preference];
    const label = themeLabel(preference, theme);
    return (_jsx("button", { type: "button", onClick: () => setPreference(nextPreference(preference)), "aria-label": label, title: label, className: cn('grid size-9 shrink-0 place-items-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-200/70 hover:text-neutral-900 focus-ring dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white', className), children: _jsx(Icon, { className: "size-[18px]", "aria-hidden": true }) }));
}
