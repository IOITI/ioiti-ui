import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { summariseStatusHistory } from '../lib/status-history.js';
import { cn } from '../lib/utils.js';
import { useMessages } from './locale-context.js';
// The tones keep their colours, in every accent.
const BLOCK = {
    ok: 'bg-positive',
    warning: 'bg-warning',
    down: 'bg-negative',
    unknown: 'bg-foreground/15',
    disabled: 'bg-foreground/10',
};
/**
 * The uptime strip: one block per slot of time, coloured by its state, and the whole said in words for a
 * screen reader, which reads the strip as one picture. The colours are never alone: the words carry them, the
 * provider's language's.
 */
export function StatusHistory({ slots, label, unit, summary, scale, className }) {
    const words = useMessages().status;
    const said = summary ?? summariseStatusHistory(slots, unit, words);
    return (_jsxs("div", { className: cn('min-w-0', className), children: [_jsx("div", { role: "img", "aria-label": words.historyName({ label, summary: said }), className: "flex h-8 gap-[2px]", children: slots.map((slot, index) => (_jsx("span", { className: cn('min-w-[2px] flex-1 rounded-[3px]', BLOCK[slot.status]) }, `${slot.at}-${index}`))) }), scale && (_jsxs("div", { "aria-hidden": true, className: "mt-1.5 flex justify-between text-xs tabular-nums text-muted-foreground", children: [_jsx("span", { children: scale[0] }), _jsx("span", { children: scale[1] })] }))] }));
}
