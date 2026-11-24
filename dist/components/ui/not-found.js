"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useId, useLayoutEffect, useRef, useState, } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { useLinkComponent } from "../link-context.js";
/* ------------------------------ Design space ------------------------------- */
// The illustration is authored on a 460 × 360 stage and scaled to its container.
// Local coordinates have their origin at the artwork's centre; the whole group
// is rotated 8° to match the reference.
const W = 460;
const H = 360;
const CX = 230;
const CY = 185;
const TILT = 8;
const ORANGE = "#fe5510";
const WHITE = "#fafbff";
const GLASS = { x: -151, y: -31, w: 288, h: 142 };
// Folder outline (tab on the top-left), in glass-local px
const FOLDER = "M12 0H64Q72 0 78 6L90 20Q94 26 102 26H276Q288 26 288 38V130Q288 142 276 142H12Q0 142 0 130V12Q0 0 12 0Z";
const EASE_OUT = [0.23, 1, 0.32, 1];
// "4": outer outline + the small triangular counter (even-odd)
const FOUR = "M76 0H110V102H124V134H110V154H76V134H0V102ZM76 46V102H36Z";
// "0": outer ellipse + counter (even-odd), centred on (-6,-40)
const ZERO = "M-69 -40a63 77 0 1 0 126 0a63 77 0 1 0 -126 0ZM-43 -40a37 49 0 1 1 74 0a37 49 0 1 1 -74 0Z";
/* ------------------------------- Frosted glass ------------------------------ */
// Written as real CSS so it can use @supports (graceful, opaque fallback when
// backdrop-filter isn't available) and a hover transition. No quotes, ">" or "&"
// so it survives any renderer untouched.
const CSS = `
.np404-glass{
  background:linear-gradient(180deg,rgba(236,238,252,0.92) 0%,rgba(150,150,225,0.85) 52%,rgba(62,72,214,0.9) 100%);
  transition:-webkit-backdrop-filter .4s ease,backdrop-filter .4s ease;
}
@supports ((-webkit-backdrop-filter: blur(1px)) or (backdrop-filter: blur(1px))){
  .np404-glass{
    background:linear-gradient(180deg,rgba(255,255,255,0.55) 0%,rgba(236,238,255,0.35) 30%,rgba(130,118,232,0.38) 58%,rgba(62,72,214,0.6) 88%,rgba(59,70,207,0.7) 100%);
    -webkit-backdrop-filter:blur(5px) saturate(1.2);
    backdrop-filter:blur(5px) saturate(1.2);
  }
}
@media (hover:hover) and (pointer:fine){
  @supports ((-webkit-backdrop-filter: blur(1px)) or (backdrop-filter: blur(1px))){
    .np404-hero:hover .np404-glass{
      -webkit-backdrop-filter:blur(3px) saturate(1.25);
      backdrop-filter:blur(3px) saturate(1.25);
    }
  }
}
`;
/* -------------------------------- Illustration ------------------------------ */
export function Illustration({ parallax = true }) {
    const reduce = useReducedMotion();
    const uid = useId().replace(/:/g, "");
    const wrapRef = useRef(null);
    const [scale, setScale] = useState(null);
    useLayoutEffect(() => {
        const el = wrapRef.current;
        if (!el)
            return;
        const update = () => setScale(el.clientWidth / W);
        update();
        // ioiti-ui: measured once where there is no ResizeObserver (jsdom).
        if (typeof ResizeObserver === "undefined")
            return;
        const ro = new ResizeObserver(update);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);
    // Pointer parallax: each layer moves a different amount for depth
    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const sx = useSpring(mx, { stiffness: 90, damping: 18, mass: 0.6 });
    const sy = useSpring(my, { stiffness: 90, damping: 18, mass: 0.6 });
    useEffect(() => {
        if (!parallax || reduce)
            return;
        // ioiti-ui: no parallax where there is no matchMedia (jsdom).
        if (typeof window.matchMedia !== "function" || !window.matchMedia("(hover: hover) and (pointer: fine)").matches)
            return;
        const move = (e) => {
            mx.set((e.clientX / window.innerWidth - 0.5) * 2);
            my.set((e.clientY / window.innerHeight - 0.5) * 2);
        };
        const reset = () => {
            mx.set(0);
            my.set(0);
        };
        window.addEventListener("pointermove", move, { passive: true });
        document.documentElement.addEventListener("pointerleave", reset);
        return () => {
            window.removeEventListener("pointermove", move);
            document.documentElement.removeEventListener("pointerleave", reset);
        };
    }, [parallax, reduce, mx, my]);
    const panelX = useTransform(sx, (v) => v * -5);
    const panelY = useTransform(sy, (v) => v * -3);
    const textX = useTransform(sx, (v) => v * 4);
    const textY = useTransform(sy, (v) => v * 2.5);
    const glassX = useTransform(sx, (v) => v * 11);
    const glassY = useTransform(sy, (v) => v * 7);
    const markX = useTransform(sx, (v) => v * 16);
    const markY = useTransform(sy, (v) => v * 10);
    const spring = (delay) => reduce ? { duration: 0 } : { type: "spring", duration: 0.9, bounce: 0.18, delay };
    const layer = "absolute inset-0";
    const svgProps = { viewBox: `0 0 ${W} ${H}`, className: "absolute inset-0 h-full w-full overflow-visible", "aria-hidden": true };
    const group = `translate(${CX} ${CY}) rotate(${TILT})`;
    const anchor = { position: "absolute", left: CX, top: CY, width: 0, height: 0, transform: `rotate(${TILT}deg)` };
    return (_jsxs("div", { ref: wrapRef, role: "img", "aria-label": "A frosted glass folder covering the number 404", className: "np404-hero relative mx-auto w-full max-w-[460px]", style: { aspectRatio: `${W} / ${H}`, opacity: scale === null ? 0 : 1 }, children: [_jsx("style", { dangerouslySetInnerHTML: { __html: CSS } }), _jsx("svg", { width: "0", height: "0", className: "absolute", "aria-hidden": true, children: _jsx("defs", { children: _jsx("clipPath", { id: `${uid}-folder`, clipPathUnits: "objectBoundingBox", children: _jsx("path", { d: FOLDER, transform: `scale(${1 / GLASS.w} ${1 / GLASS.h})` }) }) }) }), _jsx("div", { className: "absolute left-0 top-0 origin-top-left", style: { width: W, height: H, transform: `scale(${scale ?? 1})` }, children: _jsxs(motion.div, { className: "absolute inset-0", animate: reduce ? undefined : { y: [0, -5, 0] }, transition: reduce ? undefined : { repeat: Infinity, duration: 6, ease: "easeInOut" }, children: [_jsx(motion.div, { className: layer, style: { x: panelX, y: panelY }, children: _jsx(motion.div, { className: "absolute inset-0", initial: reduce ? false : { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: spring(0), children: _jsxs("svg", { ...svgProps, children: [_jsx("defs", { children: _jsxs("linearGradient", { id: `${uid}-panel`, x1: "0", y1: "0", x2: "1", y2: "0", children: [_jsx("stop", { offset: "0", stopColor: ORANGE }), _jsx("stop", { offset: "0.72", stopColor: ORANGE }), _jsx("stop", { offset: "1", stopColor: "#cf4a12" })] }) }), _jsx("g", { transform: group, children: _jsx("rect", { x: -140, y: -63, width: 285, height: 168, rx: 9, fill: `url(#${uid}-panel)` }) })] }) }) }), _jsx(motion.div, { className: layer, style: { x: textX, y: textY }, children: _jsx(motion.div, { className: "absolute inset-0", initial: reduce ? false : { opacity: 0, y: 22, scale: 0.96 }, animate: { opacity: 1, y: 0, scale: 1 }, transition: spring(0.08), style: { transformOrigin: "50% 50%" }, children: _jsxs("svg", { ...svgProps, style: { filter: "drop-shadow(0 6px 10px rgba(110,20,0,0.35))" }, children: [_jsx("defs", { children: _jsxs("linearGradient", { id: `${uid}-ink`, x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "0", stopColor: "#ffffff" }), _jsx("stop", { offset: "1", stopColor: "#eef0ff" })] }) }), _jsxs("g", { transform: group, fill: `url(#${uid}-ink)`, stroke: `url(#${uid}-ink)`, strokeWidth: 6, strokeLinejoin: "round", children: [_jsx("path", { d: FOUR, fillRule: "evenodd", transform: "translate(-177 -117)" }), _jsx("path", { d: ZERO, fillRule: "evenodd" }), _jsx("path", { d: FOUR, fillRule: "evenodd", transform: "translate(45 -117)" })] })] }) }) }), _jsx(motion.div, { className: layer, style: { x: glassX, y: glassY }, children: _jsx("div", { style: anchor, children: _jsxs(motion.div, { style: { position: "absolute", left: GLASS.x, top: GLASS.y, width: GLASS.w, height: GLASS.h }, initial: reduce ? false : { y: 30 }, animate: { y: 0 }, whileHover: reduce ? undefined : { y: -6 }, transition: spring(0.2), children: [_jsx("div", { "aria-hidden": true, style: {
                                                position: "absolute",
                                                left: 14,
                                                right: 14,
                                                bottom: -10,
                                                height: 40,
                                                borderRadius: 24,
                                                background: "rgba(53,68,187,0.55)",
                                                filter: "blur(22px)",
                                            } }), _jsx(motion.div, { className: "np404-glass", style: { position: "absolute", inset: 0, clipPath: `url(#${uid}-folder)`, WebkitClipPath: `url(#${uid}-folder)` }, initial: reduce ? false : { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.25, ease: EASE_OUT } }), _jsxs("svg", { width: GLASS.w, height: GLASS.h, viewBox: `0 0 ${GLASS.w} ${GLASS.h}`, className: "pointer-events-none absolute inset-0", "aria-hidden": true, children: [_jsx("defs", { children: _jsxs("linearGradient", { id: `${uid}-rim`, x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "0", stopColor: "#fff", stopOpacity: "0.85" }), _jsx("stop", { offset: "0.45", stopColor: "#fff", stopOpacity: "0.18" }), _jsx("stop", { offset: "1", stopColor: "#fff", stopOpacity: "0.1" })] }) }), _jsx("path", { d: FOLDER, fill: "none", stroke: `url(#${uid}-rim)`, strokeWidth: 1.2 })] })] }) }) }), _jsx(motion.div, { className: layer, style: { x: markX, y: markY }, children: _jsx("div", { style: anchor, children: _jsx(motion.div, { style: { position: "absolute", left: -5 - 28, top: 107 - 28, width: 56, height: 56 }, initial: reduce ? false : { scale: 0, rotate: -70 }, animate: { scale: 1, rotate: 0 }, whileHover: reduce ? undefined : { rotate: 90 }, transition: reduce ? { duration: 0 } : { type: "spring", duration: 0.7, bounce: 0.35, delay: 0.5 }, children: _jsx("svg", { viewBox: "0 0 56 56", width: "56", height: "56", "aria-hidden": true, style: { filter: "drop-shadow(0 4px 6px rgba(20,24,90,0.4))" }, children: _jsxs("g", { transform: "translate(28 28)", fill: WHITE, children: [_jsx("rect", { x: -23, y: -5.5, width: 46, height: 11, rx: 5.5, transform: "rotate(45)" }), _jsx("rect", { x: -23, y: -5.5, width: 46, height: 11, rx: 5.5, transform: "rotate(-45)" })] }) }) }) }) })] }) })] }));
}
/* ---------------------------------- Page ----------------------------------- */
// ioiti-ui: the global focus ring is drawn (src/styles/design.css): a white ring on a dark offset suited one theme only.
const focus = "outline-none";
export function NotFound({ errorCode = "404", badgeLabel, title = "This page took a wrong turn.", description = "The requested page doesn't exist or may have moved.", actionLabel, onAction, homeHref = "/", homeLabel, showBack = true, backLabel, secondaryActionLabel, onBack, onSecondaryAction, children, path, suggestions, LinkComponent, parallax = true, footer, className = "", }) {
    const reduce = useReducedMotion();
    // ioiti-ui: the application's link (LinkProvider) unless one is given.
    const Anchor = useLinkComponent(LinkComponent);
    const headingRef = useRef(null);
    const headingId = useId();
    const [detected, setDetected] = useState(null);
    const [canGoBack, setCanGoBack] = useState(false);
    useEffect(() => {
        setDetected(window.location.pathname);
        setCanGoBack(window.history.length > 1);
        headingRef.current?.focus({ preventScroll: true }); // announce the page to screen readers on navigation
    }, []);
    const shownPath = path === undefined ? detected : path;
    const effectiveHomeLabel = actionLabel || homeLabel || "Go back home";
    const effectiveBackLabel = secondaryActionLabel || backLabel || "Go back";
    const effectiveGoBack = () => {
        if (onSecondaryAction)
            return onSecondaryAction();
        if (onBack)
            return onBack();
        window.history.back();
    };
    const isBackVisible = showBack && (canGoBack || Boolean(onBack) || Boolean(onSecondaryAction) || Boolean(secondaryActionLabel));
    const rise = (delay) => reduce
        ? { initial: false }
        : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay, ease: EASE_OUT } };
    return (_jsxs("section", { "aria-labelledby": headingId, className: `relative isolate flex w-full flex-col items-center justify-center overflow-hidden px-5 py-10 text-center text-neutral-900 antialiased dark:text-neutral-100 sm:px-8 ${className}`, children: [_jsxs("div", { "aria-hidden": true, className: "pointer-events-none absolute inset-0 -z-10", children: [_jsx("div", { className: "absolute left-1/2 top-[18%] h-[420px] w-[560px] max-w-[120vw] -translate-x-1/2 rounded-full", style: { background: "radial-gradient(closest-side, rgba(254,85,16,0.16), transparent)", filter: "blur(30px)" } }), _jsx("div", { className: "absolute left-1/2 top-[42%] h-[360px] w-[520px] max-w-[110vw] -translate-x-1/2 rounded-full", style: { background: "radial-gradient(closest-side, rgba(59,70,207,0.16), transparent)", filter: "blur(36px)" } })] }), _jsxs("div", { className: "flex w-full max-w-xl flex-col items-center", children: [_jsx(Illustration, { parallax: parallax }), _jsx("p", { className: "sr-only", children: `Error ${errorCode}: ${title}` }), _jsx(motion.p, { ...rise(0.15), className: "mt-2 text-[11.5px] font-medium uppercase tracking-[0.22em] text-muted-foreground", children: badgeLabel ?? `Error ${errorCode}` }), _jsx(motion.h1, { ref: headingRef, id: headingId, tabIndex: -1, ...rise(0.22), className: "mt-3 bg-gradient-to-b from-neutral-950 to-neutral-600 bg-clip-text dark:from-white dark:to-neutral-400 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-transparent outline-none sm:text-[44px]", children: title }), _jsx(motion.p, { ...rise(0.3), className: "mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground sm:text-[16px]", children: description }), shownPath && (_jsxs(motion.div, { ...rise(0.36), className: "mt-5 inline-flex max-w-full items-center gap-2 rounded-full bg-black/[0.04] px-3.5 py-1.5 ring-1 ring-black/10 dark:bg-white/[0.04] dark:ring-white/10", children: [_jsx("span", { className: "h-1.5 w-1.5 shrink-0 rounded-full bg-[#fe5510]", "aria-hidden": true }), _jsx("code", { title: shownPath, className: "truncate font-mono text-[12px] text-muted-foreground", children: shownPath.length > 80 ? `${shownPath.slice(0, 79)}…` : shownPath })] })), children ? (_jsx(motion.div, { ...rise(0.42), className: "mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row", children: children })) : (_jsxs(motion.div, { ...rise(0.42), className: "mt-8 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center", children: [onAction ? (_jsxs("button", { type: "button", onClick: onAction, className: `inline-flex h-11 items-center justify-center gap-2 rounded-full bg-neutral-900 px-6 text-[14px] font-medium text-white shadow-sm transition-[transform,background-color] duration-150 active:scale-[0.97] [-webkit-tap-highlight-color:transparent] [@media(hover:hover)]:hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:[@media(hover:hover)]:hover:bg-neutral-100 ${focus}`, children: [_jsx("svg", { viewBox: "0 0 24 24", className: "h-4 w-4", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true, children: _jsx("path", { d: "M3 11.5 12 4l9 7.5M5.5 10v9.5h13V10" }) }), effectiveHomeLabel] })) : (_jsxs(Anchor, { href: homeHref, className: `inline-flex h-11 items-center justify-center gap-2 rounded-full bg-neutral-900 px-6 text-[14px] font-medium text-white shadow-sm transition-[transform,background-color] duration-150 active:scale-[0.97] [-webkit-tap-highlight-color:transparent] [@media(hover:hover)]:hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:[@media(hover:hover)]:hover:bg-neutral-100 ${focus}`, children: [_jsx("svg", { viewBox: "0 0 24 24", className: "h-4 w-4", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true, children: _jsx("path", { d: "M3 11.5 12 4l9 7.5M5.5 10v9.5h13V10" }) }), effectiveHomeLabel] })), isBackVisible && (_jsx("button", { type: "button", onClick: effectiveGoBack, className: `inline-flex h-11 items-center justify-center rounded-full bg-black/[0.04] dark:bg-white/[0.04] px-6 text-[14px] font-medium text-neutral-700 dark:text-neutral-300 ring-1 ring-black/10 dark:ring-white/12 transition-[transform,background-color,color] duration-150 active:scale-[0.97] [-webkit-tap-highlight-color:transparent] [@media(hover:hover)]:hover:bg-black/[0.06] dark:[@media(hover:hover)]:hover:bg-white/[0.08] [@media(hover:hover)]:hover:text-neutral-950 dark:[@media(hover:hover)]:hover:text-white ${focus}`, children: effectiveBackLabel }))] })), suggestions && suggestions.length > 0 && (_jsxs(motion.nav, { ...rise(0.5), "aria-label": "Helpful links", className: "mt-12 w-full", children: [_jsx("p", { className: "mb-3 text-[11.5px] font-medium uppercase tracking-[0.18em] text-muted-foreground", children: "Maybe you were looking for" }), _jsx("ul", { className: "grid grid-cols-1 gap-2.5 text-left sm:grid-cols-3", children: suggestions.slice(0, 3).map((s) => (_jsx("li", { children: _jsxs(Anchor, { href: s.href, className: `group flex h-full flex-col rounded-2xl bg-black/[0.03] p-4 ring-1 ring-black/[0.07] transition-[background-color,transform,box-shadow] duration-200 active:scale-[0.985] [-webkit-tap-highlight-color:transparent] [@media(hover:hover)]:hover:bg-black/[0.05] [@media(hover:hover)]:hover:ring-black/[0.14] dark:bg-white/[0.03] dark:ring-white/[0.07] dark:[@media(hover:hover)]:hover:bg-white/[0.06] dark:[@media(hover:hover)]:hover:ring-white/[0.14] ${focus}`, children: [_jsxs("span", { className: "flex items-center justify-between gap-2 text-[14px] font-medium text-neutral-900 dark:text-neutral-100", children: [s.label, _jsx("svg", { viewBox: "0 0 24 24", className: "h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-200 [@media(hover:hover)]:group-hover:-translate-y-0.5 [@media(hover:hover)]:group-hover:translate-x-0.5", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true, children: _jsx("path", { d: "M7 17 17 7M8 7h9v9" }) })] }), s.description && _jsx("span", { className: "mt-1 text-[12.5px] leading-snug text-muted-foreground", children: s.description })] }) }, s.href))) })] })), footer && _jsx(motion.div, { ...rise(0.58), className: "mt-12 text-[12.5px] text-muted-foreground", children: footer })] })] }));
}
export default NotFound;
