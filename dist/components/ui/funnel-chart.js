"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { clamp, cx, defaultFormat, Tooltip, useDismissOutside, useElementWidth, } from "../../lib/chart-primitives.js";
import { pctText } from "../../lib/dashboard-chart-utils.js";
const F = { text: 22, bar: 30, bridge: 30 };
// ioiti-ui: secondary text at 4.5:1 in both themes (neutral-500 is 4.0:1 on the dark card).
const MUTED = "text-neutral-500 dark:text-neutral-400";
// ioiti-ui: the stages take the ramp of theme.css (--chart-funnel-1 to 5, one hue, the first stage the strongest),
// checked in both themes; EasyUI mixed two hues, indigo to teal.
const RAMP = 5;
export function FunnelChart({ stages, formatValue = defaultFormat, showSummary = true, animated = true, ariaLabel, className = "", summaryLabel = "overall conversion", noun = "Users", emptyText = "No data", }) {
    const reduce = useReducedMotion();
    const anim = animated && !reduce;
    const [rootRef, width] = useElementWidth(480);
    const [active, setActive] = useState(null);
    const wrapRef = useRef(null);
    useDismissOutside(wrapRef, active !== null, useCallback(() => setActive(null), []));
    const n = stages.length;
    const top = Math.max(1e-9, stages[0]?.value ?? 1);
    const maxV = Math.max(top, ...stages.map((s) => s.value));
    const block = F.text + F.bar + F.bridge;
    const H = n * (F.text + F.bar) + Math.max(0, n - 1) * F.bridge;
    const color = (i) => stages[i].color ?? `var(--chart-funnel-${Math.min(i, RAMP - 1) + 1})`;
    const w = (i) => clamp((width * Math.max(0, stages[i].value)) / maxV, 28, width);
    const bx = (i) => (width - w(i)) / 2;
    const pct = (i) => (stages[i].value / top) * 100;
    const drop = (i) => (stages[i].value > 0 ? (1 - stages[i + 1].value / stages[i].value) * 100 : 0);
    const bridge = (i) => {
        const yb = i * block + F.text + F.bar;
        const l1 = bx(i), r1 = l1 + w(i), l2 = bx(i + 1), r2 = l2 + w(i + 1);
        const m = F.bridge / 2;
        return `M${l1} ${yb}L${r1} ${yb}C${r1} ${yb + m} ${r2} ${yb + m} ${r2} ${yb + F.bridge}L${l2} ${yb + F.bridge}C${l2} ${yb + m} ${l1} ${yb + m} ${l1} ${yb}Z`;
    };
    const summary = useMemo(() => {
        if (n < 2)
            return null;
        let worst = 0;
        for (let i = 0; i < n - 1; i++)
            if (drop(i) > drop(worst))
                worst = i;
        return { conv: pct(n - 1), worst, dropPct: drop(worst) };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stages]);
    const onKey = (e) => {
        if (e.key === "ArrowDown")
            setActive((a) => clamp((a ?? -1) + 1, 0, n - 1));
        else if (e.key === "ArrowUp")
            setActive((a) => clamp((a ?? n) - 1, 0, n - 1));
        else if (e.key === "Escape")
            setActive(null);
        else
            return;
        e.preventDefault();
    };
    if (!n)
        return _jsx("p", { className: `py-10 text-center text-[13px] ${MUTED}`, children: emptyText });
    const spring = reduce ? { duration: 0 } : { type: "spring", duration: 0.7, bounce: 0.1 };
    const cur = active !== null ? stages[active] : null;
    return (_jsxs("div", { ref: rootRef, className: cx("w-full", className), children: [showSummary && summary && (_jsxs("div", { className: "mb-4 flex flex-wrap items-baseline gap-x-5 gap-y-1", children: [_jsxs("p", { className: "text-[13px] text-neutral-900 dark:text-neutral-100", children: [_jsx("span", { className: "text-[22px] font-semibold tracking-[-0.03em] tabular-nums", children: pctText(summary.conv) }), " ", _jsx("span", { className: MUTED, children: summaryLabel })] }), _jsxs("p", { className: `text-[12px] ${MUTED}`, children: ["Biggest drop:", " ", stages[summary.worst].dropLabel ?? `${stages[summary.worst].label} → ${stages[summary.worst + 1].label}`, " ", _jsxs("span", { className: "tabular-nums text-negative", children: ["\u2212", pctText(summary.dropPct)] })] })] })), _jsxs("div", { ref: wrapRef, className: "relative", style: { height: H }, children: [_jsxs("svg", { width: width, height: H, role: "img", "aria-label": ariaLabel ?? `Funnel with ${n} stages from ${stages[0].label} to ${stages[n - 1].label}`, tabIndex: 0, onKeyDown: onKey, onBlur: () => setActive(null), 
                        // ioiti-ui: the global focus ring (EasyUI's outline-none and its own ring are gone).
                        className: "block touch-pan-y overflow-visible rounded-lg", children: [_jsx("defs", { children: stages.slice(0, -1).map((_, i) => (_jsxs("linearGradient", { id: `fg-${i}`, x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "0", style: { stopColor: color(i), stopOpacity: 0.34 } }), _jsx("stop", { offset: "1", style: { stopColor: color(i + 1), stopOpacity: 0.08 } })] }, i))) }), stages.slice(0, -1).map((_, i) => (_jsx(motion.path, { fill: `url(#fg-${i})`, initial: anim ? { opacity: 0, d: bridge(i) } : false, animate: { opacity: active === null ? 1 : active === i ? 1 : 0.35, d: bridge(i) }, transition: anim ? { opacity: { duration: 0.4, delay: 0.3 + i * 0.1 }, d: spring } : { d: spring, opacity: { duration: 0.2 } } }, i))), stages.map((s, i) => {
                                const y = i * block;
                                const dim = active !== null && active !== i;
                                return (_jsxs("g", { style: { opacity: dim ? 0.5 : 1, transition: "opacity .2s" }, children: [_jsx("text", { x: 0, y: y + 14, className: cx("text-[12.5px]", active === i ? "fill-neutral-900 dark:fill-white" : "fill-neutral-600 dark:fill-neutral-400"), children: s.label }), _jsxs("text", { x: width, y: y + 14, textAnchor: "end", className: "fill-neutral-900 text-[12.5px] tabular-nums dark:fill-neutral-100", children: [formatValue(s.value), width >= 300 && _jsxs("tspan", { className: "fill-neutral-500 dark:fill-neutral-400", children: [" \u00B7 ", pctText(pct(i))] })] }), _jsx(motion.rect, { y: y + F.text, height: F.bar, rx: 9, fill: color(i), initial: anim ? { x: width / 2, width: 0 } : false, animate: { x: bx(i), width: w(i) }, transition: anim ? { type: "spring", duration: 0.9, bounce: 0.12, delay: i * 0.09 } : spring })] }, i));
                            }), stages.slice(0, -1).map((_, i) => {
                                const yc = i * block + F.text + F.bar + F.bridge / 2;
                                const hot = active === i;
                                return (_jsxs(motion.g, { initial: anim ? { opacity: 0 } : false, animate: { opacity: active === null || hot ? 1 : 0.4 }, transition: { duration: 0.3, delay: anim && active === null ? 0.6 + i * 0.1 : 0 }, children: [_jsx("rect", { x: width / 2 - 28, y: yc - 10, width: 56, height: 20, rx: 10, className: cx("fill-white dark:fill-[#0b0b0c]", hot ? "stroke-rose-400/60" : "stroke-black/10 dark:stroke-white/12") }), _jsx("text", { x: width / 2, y: yc, textAnchor: "middle", dominantBaseline: "central", className: cx("text-[11px] tabular-nums", hot ? "fill-negative" : "fill-neutral-500 dark:fill-neutral-400"), children: drop(i) === 0 ? "0%" : `−${pctText(drop(i))}` })] }, i));
                            }), stages.map((_, i) => (_jsx("rect", { x: 0, y: i * block, width: width, height: i === n - 1 ? F.text + F.bar : block, fill: "transparent", onPointerEnter: () => setActive(i), onPointerDown: () => setActive(i), onPointerLeave: (e) => e.pointerType === "mouse" && setActive(null) }, i)))] }), _jsx(Tooltip, { pos: active === null ? null : { x: width / 2, y: active * block + F.text }, boundsWidth: width, children: cur && active !== null && (_jsxs(_Fragment, { children: [_jsx("p", { className: "mb-1 font-medium text-neutral-900 dark:text-neutral-100", children: cur.label }), _jsxs("p", { className: "flex justify-between gap-4", children: [_jsx("span", { className: MUTED, children: noun }), _jsx("span", { className: "tabular-nums text-neutral-900 dark:text-neutral-100", children: formatValue(cur.value) })] }), _jsxs("p", { className: "flex justify-between gap-4", children: [_jsx("span", { className: MUTED, children: "Of the first" }), _jsx("span", { className: "tabular-nums text-neutral-900 dark:text-neutral-100", children: pctText(pct(active)) })] }), active < n - 1 && (_jsxs("p", { className: "mt-1.5 flex justify-between gap-4 border-t border-black/[0.06] pt-1.5 dark:border-white/[0.08]", children: [_jsx("span", { className: MUTED, children: cur.dropLabel ?? "Lost next" }), _jsx("span", { className: "tabular-nums text-negative", children: drop(active) === 0 ? "none" : `−${formatValue(cur.value - stages[active + 1].value)} (${pctText(drop(active))})` })] }))] })) })] }), _jsxs("table", { className: "sr-only", children: [_jsx("caption", { children: ariaLabel ?? "Funnel data" }), _jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { scope: "col", children: "Stage" }), _jsx("th", { scope: "col", children: noun }), _jsx("th", { scope: "col", children: "% of first stage" })] }) }), _jsx("tbody", { children: stages.map((s, i) => (_jsxs("tr", { children: [_jsx("th", { scope: "row", children: s.label }), _jsx("td", { children: formatValue(s.value) }), _jsx("td", { children: pctText(pct(i)) })] }, i))) })] })] }));
}
