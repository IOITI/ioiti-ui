/**
 * Shared math for the EasyUI dashboard charts.
 *
 * Kept in `src/lib` so the registry generator ships it as a `registry:lib`
 * dependency for StatCard, FunnelChart and LiveLineChart.
 */
import { DEFAULT_LOCALE } from "./locale.js";
// ioiti-ui: a number written by Intl, its minus a true one (Intl writes a hyphen), where the locale puts it.
export const withTrueMinus = (format, n) => format
    .formatToParts(n)
    .map((part) => (part.type === "minusSign" ? "−" : part.value))
    .join("");
// ioiti-ui: percentages as a locale writes them (its decimal point, its space before the sign: "12 %" in French), not
// grouped, as EasyUI's never were; made once per locale and number of decimals.
const percents = new Map();
function percentText(points, digits, locale) {
    const key = `${locale}|${digits}`;
    let format = percents.get(key);
    if (!format) {
        format = new Intl.NumberFormat(locale, { style: "percent", minimumFractionDigits: digits, maximumFractionDigits: digits, useGrouping: false });
        percents.set(key, format);
    }
    return withTrueMinus(format, points / 100);
}
// ioiti-ui: in a locale (IoitiProvider's, given by a component; British English's by default), a true minus. Rounded as
// EasyUI rounded it (Math.round, toFixed) before Intl writes it: Intl rounds a value's shortest decimal ("6.4" for
// 6.35, whose toFixed is "6.3"). Its size rounded, a loss written as the gain of its size with a minus ("−59%" for
// −58.5, which Math.round alone makes −58).
export const pctText = (x, locale = DEFAULT_LOCALE) => Math.abs(x) >= 10
    ? percentText(Math.sign(x) * Math.round(Math.abs(x)), 0, locale)
    : percentText(Number(x.toFixed(1)), 1, locale);
// ioiti-ui: a share of a whole (0.04) to the unit, "4%", as DonutChart writes it; in a locale too.
export const shareText = (fraction, locale = DEFAULT_LOCALE) => percentText(Math.round(fraction * 100), 0, locale);
/** Smooth monotone cubic through points (never overshoots the data) */
export function monotonePath(p) {
    const n = p.length;
    if (n === 0)
        return "";
    if (n === 1)
        return `M${p[0][0].toFixed(2)} ${p[0][1].toFixed(2)}`;
    const dx = [], m = [];
    for (let i = 0; i < n - 1; i++) {
        dx[i] = p[i + 1][0] - p[i][0];
        m[i] = (p[i + 1][1] - p[i][1]) / (dx[i] || 1e-9);
    }
    const t = new Array(n);
    t[0] = m[0];
    t[n - 1] = m[n - 2];
    for (let i = 1; i < n - 1; i++)
        t[i] = m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2;
    for (let i = 0; i < n - 1; i++) {
        if (m[i] === 0) {
            t[i] = 0;
            t[i + 1] = 0;
        }
        else {
            const a = t[i] / m[i], b = t[i + 1] / m[i], s = a * a + b * b;
            if (s > 9) {
                const k = 3 / Math.sqrt(s);
                t[i] = k * a * m[i];
                t[i + 1] = k * b * m[i];
            }
        }
    }
    let d = `M${p[0][0].toFixed(2)} ${p[0][1].toFixed(2)}`;
    for (let i = 0; i < n - 1; i++) {
        const h = dx[i] / 3;
        d += `C${(p[i][0] + h).toFixed(2)} ${(p[i][1] + t[i] * h).toFixed(2)} ${(p[i + 1][0] - h).toFixed(2)} ${(p[i + 1][1] - t[i + 1] * h).toFixed(2)} ${p[i + 1][0].toFixed(2)} ${p[i + 1][1].toFixed(2)}`;
    }
    return d;
}
/** Linear interpolation of the stream at time t (clamped to the data) */
export function valueAt(buf, t) {
    const n = buf.length;
    if (!n)
        return null;
    if (t <= buf[0].t)
        return buf[0].v;
    if (t >= buf[n - 1].t)
        return buf[n - 1].v;
    let lo = 0, hi = n - 1;
    while (hi - lo > 1) {
        const mid = (lo + hi) >> 1;
        if (buf[mid].t <= t)
            lo = mid;
        else
            hi = mid;
    }
    const a = buf[lo], b = buf[hi];
    return a.v + ((t - a.t) / (b.t - a.t || 1)) * (b.v - a.v);
}
export function visibleExtent(buf, tEnd, win) {
    const tStart = tEnd - win;
    let min = Infinity, max = -Infinity;
    const edge = [valueAt(buf, tStart), valueAt(buf, tEnd)];
    for (const v of edge)
        if (v !== null) {
            min = Math.min(min, v);
            max = Math.max(max, v);
        }
    for (const p of buf)
        if (p.t > tStart && p.t <= tEnd) {
            min = Math.min(min, p.v);
            max = Math.max(max, p.v);
        }
    return { min, max };
}
export function buildFrame(buf, tEnd, win, dom, g) {
    const tStart = tEnd - win;
    const span = dom.hi - dom.lo || 1;
    const X = (t) => g.l + ((t - tStart) / win) * g.iw;
    const Y = (v) => g.t + g.ih - ((v - dom.lo) / span) * g.ih;
    const pts = [];
    const v0 = valueAt(buf, tStart);
    if (v0 !== null && buf.length && buf[0].t <= tStart)
        pts.push([g.l, Y(v0)]);
    for (const p of buf)
        if (p.t > tStart && p.t < tEnd)
            pts.push([X(p.t), Y(p.v)]);
    const vh = valueAt(buf, tEnd);
    let head = null;
    if (vh !== null) {
        head = { x: g.l + g.iw, y: Y(vh) };
        pts.push([head.x, head.y]);
    }
    const line = pts.length > 1 ? monotonePath(pts) : "";
    const base = g.t + g.ih;
    const area = line ? `${line}L${pts[pts.length - 1][0].toFixed(2)} ${base}L${pts[0][0].toFixed(2)} ${base}Z` : "";
    return { line, area, head, tStart };
}
