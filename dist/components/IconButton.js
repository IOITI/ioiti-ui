import { jsx as _jsx } from "react/jsx-runtime";
import { PRESSABLE } from '../lib/recipes.js';
import { cn } from '../lib/utils.js';
import { Hint } from './Hint.js';
/** A button that is an icon alone, as the top bar's: square, quiet until hovered. */
export function IconButton({ label, icon, hint, className, type = 'button', ...props }) {
    const button = (_jsx("button", { type: type, "aria-label": label, className: cn(
        // The top bar's icon buttons' look (ThemeToggle's, LookPicker's, the bell's): quiet until hovered, giving a little.
        `${PRESSABLE} grid size-9 shrink-0 place-items-center rounded-lg text-muted-foreground transition-[color,background-color,scale] hover:bg-surface-hover hover:text-foreground focus-ring [&>svg]:size-[18px]`, className), ...props, children: icon }));
    // Its Hint kept while it says nothing (`hint=""`: a Popover silences its trigger's while open): drawn without it, the
    // button would be another one, and the focus given back to it as the popover closes lost with it.
    return hint !== undefined ? (_jsx(Hint, { content: hint, side: "bottom", wrap: Boolean(props.disabled), children: button })) : (button);
}
