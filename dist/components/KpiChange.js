import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { changeTone, changeWords, formatChange } from '../lib/change.js';
import { cn } from '../lib/utils.js';
import { useFormat, useMessages } from './locale-context.js';
const TONE_TEXT = {
    positive: 'text-positive',
    negative: 'text-negative',
    neutral: 'text-muted-foreground',
};
/**
 * A figure's change, signed, in the tone of what it means (good news, bad news), an arrow its way: seen as
 * "+2.5%", read as "up 2.5%" (in the provider's language). KpiTile's and KpiStrip's.
 */
export function KpiChange({ change, goodWhen = 'up', format, className }) {
    const formats = useFormat();
    const words = useMessages().numberInput;
    const write = format ?? ((value) => formatChange(value, formats));
    const tone = changeTone(change, goodWhen);
    return (_jsxs("span", { className: cn('inline-flex items-center gap-1 text-xs font-medium tabular-nums', TONE_TEXT[tone], className), children: [change !== 0 && Number.isFinite(change) && (_jsx("svg", { viewBox: "0 0 10 10", className: cn('size-2 shrink-0', change < 0 && 'rotate-180'), fill: "currentColor", "aria-hidden": true, children: _jsx("path", { d: "M5 1.5 9 7.5H1Z" }) })), _jsx("span", { "aria-hidden": true, children: write(change) }), _jsx("span", { className: "sr-only", children: changeWords(change, write, words) })] }));
}
