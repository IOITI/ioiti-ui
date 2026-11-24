import { jsx as _jsx } from "react/jsx-runtime";
import { AnimatePresence, motion } from 'framer-motion';
import { Monitor, Moon, Sun } from 'lucide-react';
import { motionTransitions } from '../lib/motion-tokens.js';
import { PRESSABLE } from '../lib/recipes.js';
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
    return (_jsx("button", { type: "button", onClick: () => setPreference(nextPreference(preference)), "aria-label": label, title: label, className: cn(
        // The top bar's icon buttons' look (IconButton's).
        `${PRESSABLE} relative grid size-9 shrink-0 place-items-center rounded-lg text-muted-foreground transition-[color,background-color,scale] hover:bg-surface-hover hover:text-foreground focus-ring`, className), children: _jsx(AnimatePresence, { mode: "popLayout", initial: false, children: _jsx(motion.span, { className: "grid place-items-center", initial: { opacity: 0, rotate: -45, scale: 0.8 }, animate: { opacity: 1, rotate: 0, scale: 1 }, exit: { opacity: 0, rotate: 45, scale: 0.8, transition: motionTransitions.easeExit }, transition: motionTransitions.springSnappy, children: _jsx(Icon, { className: "size-[18px]", "aria-hidden": true }) }, preference) }) }));
}
