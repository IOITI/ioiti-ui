import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId } from 'react';
import { NEGATIVE_COLOUR, POSITIVE_COLOUR, SERIES_COLOUR } from '../lib/chart-colours.js';
import { monotonePath } from '../lib/dashboard-chart-utils.js';
import { formatNumber, toneOf } from '../lib/format.js';
const COLOUR = { positive: POSITIVE_COLOUR, negative: NEGATIVE_COLOUR, neutral: SERIES_COLOUR };
/**
 * A small line or bars, without axes, for the trend of a figure: in a KpiTile, in a table's cell. For a
 * chart that is read, `LineChart` or `BarChart`.
 */
export function Sparkline({ values, variant = 'line', tone = 'auto', width = 96, height = 24, label, format = (value) => formatNumber(value, Number.isInteger(value) ? 0 : 2), className, }) {
    const gradient = useId();
    const finite = values.filter((value) => Number.isFinite(value));
    if (finite.length === 0)
        return null;
    const first = finite[0];
    const last = finite[finite.length - 1];
    const high = Math.max(...finite);
    const low = Math.min(...finite);
    const summary = `from ${format(first)} to ${format(last)}, high ${format(high)}, low ${format(low)}`;
    const name = label ? `${label}: ${summary}` : summary;
    const pad = 2;
    if (variant === 'bars') {
        // Bars start at zero, which is on the scale even when every value is above it.
        const top = Math.max(high, 0);
        const bottom = Math.min(low, 0);
        const span = top - bottom || 1;
        const zero = pad + ((top - 0) / span) * (height - pad * 2);
        const slot = width / finite.length;
        const bar = Math.max(1, slot * 0.7);
        return (_jsx("svg", { role: "img", "aria-label": name, width: width, height: height, viewBox: `0 0 ${width} ${height}`, className: className, children: finite.map((value, index) => {
                const y = pad + ((top - Math.max(value, 0)) / span) * (height - pad * 2);
                const end = pad + ((top - Math.min(value, 0)) / span) * (height - pad * 2);
                const colour = tone === 'auto' ? COLOUR[toneOf(value)] : COLOUR[tone];
                return (_jsx("rect", { x: index * slot + (slot - bar) / 2, y: Math.min(y, zero), width: bar, height: Math.max(end - y, value === 0 ? 0 : 1), rx: Math.min(1.5, bar / 2), fill: colour }, index));
            }) }));
    }
    const span = high - low || 1;
    const points = finite.map((value, index) => [
        pad + (finite.length === 1 ? (width - pad * 2) / 2 : (index / (finite.length - 1)) * (width - pad * 2)),
        pad + ((high - value) / span) * (height - pad * 2),
    ]);
    const colour = tone === 'auto' ? COLOUR[toneOf(last - first)] : COLOUR[tone];
    const line = monotonePath(points);
    const [endX, endY] = points[points.length - 1];
    const area = `${line}L${endX.toFixed(2)} ${height}L${points[0][0].toFixed(2)} ${height}Z`;
    return (_jsxs("svg", { role: "img", "aria-label": name, width: width, height: height, viewBox: `0 0 ${width} ${height}`, className: className, children: [_jsx("defs", { children: _jsxs("linearGradient", { id: gradient, x1: "0", x2: "0", y1: "0", y2: "1", children: [_jsx("stop", { offset: "0%", stopColor: colour, stopOpacity: 0.18 }), _jsx("stop", { offset: "100%", stopColor: colour, stopOpacity: 0 })] }) }), _jsx("path", { d: area, fill: `url(#${gradient})` }), _jsx("path", { d: line, fill: "none", stroke: colour, strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("circle", { cx: endX, cy: endY, r: 2, fill: colour })] }));
}
