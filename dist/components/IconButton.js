import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '../lib/utils.js';
import { Hint } from './Hint.js';
/** A button that is an icon alone, as the top bar's: square, quiet until hovered. */
export function IconButton({ label, icon, hint, className, type = 'button', ...props }) {
    const button = (_jsx("button", { type: type, "aria-label": label, className: cn('grid size-9 shrink-0 place-items-center rounded-lg text-neutral-500 transition motion-safe:active:scale-95 hover:bg-neutral-200/70 hover:text-neutral-900 focus-ring dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white [&>svg]:size-[18px]', className), ...props, children: icon }));
    return hint ? (_jsx(Hint, { content: hint, side: "bottom", children: button })) : (button);
}
