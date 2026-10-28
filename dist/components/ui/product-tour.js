"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotionConfig, useTransform, } from "framer-motion";
import { motionTransitions } from "../../lib/motion-tokens.js";
import { Button } from "./button.js";
const CARD_W = 340;
const SHEET_W = 440; // docked bottom-sheet max width on small screens
const SMALL = 640; // below this width the card docks to the bottom
const cardWidth = (vw) => (vw < SMALL ? Math.min(SHEET_W, vw - 24) : CARD_W);
// ioiti-ui: the design's motion: the cutout glides as a sheet does (springSheet), the card moves as what
// floats (springSnappy), what fades fades with easeFast and easeExit.
const SPOT = motionTransitions.springSheet;
const CARD = motionTransitions.springSnappy;
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const frame = () => new Promise((r) => requestAnimationFrame(() => r()));
/* ------------------------------ DOM helpers -------------------------------- */
function resolve(t) {
    if (!t)
        return null;
    if (typeof t === "string")
        return document.querySelector(t);
    // ioiti-ui: a ref is read as a getter is.
    return typeof t === "function" ? t() : t.current;
}
function rectOf(el, s) {
    const b = el.getBoundingClientRect();
    const p = s.padding ?? 8;
    const w = b.width + p * 2;
    const h = b.height + p * 2;
    const cs = getComputedStyle(el).borderTopLeftRadius;
    let br = parseFloat(cs) || 0;
    if (cs.includes("%"))
        br = (br / 100) * Math.min(b.width, b.height);
    const r = s.radius ?? Math.min(Math.max(br + p, 8), Math.min(w, h) / 2);
    return { x: b.left - p, y: b.top - p, w, h, r };
}
// Find the element (it may mount late), scroll it into view, wait for scrolling to settle
async function prepare(s, instant, bottomInset = 0) {
    if (!s.target)
        return null;
    let el = resolve(s.target);
    for (let i = 0; !el && i < 36; i++) {
        await frame();
        el = resolve(s.target);
    }
    if (!el)
        return null;
    const b = el.getBoundingClientRect();
    const M = 24;
    const visible = b.top >= M && b.bottom <= window.innerHeight - M - bottomInset && b.left >= 0 && b.right <= window.innerWidth;
    if (s.scroll !== false && !visible) {
        // scroll-margin makes "center" land the element in the area ABOVE the docked card
        const prevMargin = el.style.scrollMarginBottom;
        if (bottomInset)
            el.style.scrollMarginBottom = `${bottomInset}px`;
        // ioiti-ui: where the browser scrolls an element into view (not jsdom).
        el.scrollIntoView?.({ block: "center", inline: "nearest", behavior: instant ? "auto" : "smooth" });
        let last = el.getBoundingClientRect().top;
        let still = 0;
        const t0 = performance.now();
        while (still < 6 && performance.now() - t0 < 1000) {
            await frame();
            const top = el.getBoundingClientRect().top;
            still = Math.abs(top - last) < 0.5 ? still + 1 : 0;
            last = top;
        }
        el.style.scrollMarginBottom = prevMargin;
    }
    return el;
}
// Pick the side with room (preferred first), then clamp inside the viewport
function place(r, cw, ch, vw, vh, pref = "auto", dock) {
    const M = 16;
    const G = 14;
    if (!r)
        return { x: (vw - cw) / 2, y: (vh - ch) / 2 };
    if (dock !== undefined)
        return { x: (vw - cw) / 2, y: Math.max(12, vh - ch - dock) }; // small screens: bottom sheet
    const room = {
        bottom: vh - (r.y + r.h) - M - ch - G,
        top: r.y - M - ch - G,
        right: vw - (r.x + r.w) - M - cw - G,
        left: r.x - M - cw - G,
    };
    const all = ["bottom", "top", "right", "left"];
    const order = pref === "auto" ? all : [pref, ...all.filter((s) => s !== pref)];
    const side = order.find((s) => room[s] >= 0) ?? all.reduce((a, b) => (room[a] > room[b] ? a : b));
    let x = r.x + r.w / 2 - cw / 2;
    let y = r.y + r.h / 2 - ch / 2;
    if (side === "bottom")
        y = r.y + r.h + G;
    if (side === "top")
        y = r.y - G - ch;
    if (side === "right")
        x = r.x + r.w + G;
    if (side === "left")
        x = r.x - G - cw;
    return { x: clamp(x, M, Math.max(M, vw - cw - M)), y: clamp(y, M, Math.max(M, vh - ch - M)) };
}
/* -------------------------------- Component -------------------------------- */
// ioiti-ui: a step's words come a few pixels from the side the tour goes, without a blur; only fading
// where motion is reduced (custom is 0 then).
const slide = {
    enter: (d) => ({ opacity: 0, x: d * 8 }),
    center: { opacity: 1, x: 0 },
    exit: (d) => ({ opacity: 0, x: d * -8, transition: motionTransitions.easeExit }),
};
export function ProductTour({ steps, open, onClose, onStepChange, startAt = 0, closeOnOverlayClick = false, }) {
    const uid = useId().replace(/:/g, "");
    // ioiti-ui: reduced as the system asks or IoitiProvider's reducedMotion says: the cutout's size and place,
    // animated by hand, are not reduced by MotionConfig.
    const reduce = useReducedMotionConfig();
    const [mounted, setMounted] = useState(false);
    const [index, setIndex] = useState(startAt);
    const [ready, setReady] = useState(false);
    const [prevOpen, setPrevOpen] = useState(open);
    if (open !== prevOpen) {
        setPrevOpen(open);
        if (open)
            setIndex(clamp(startAt, 0, steps.length - 1));
        else
            setReady(false);
    }
    // Spotlight cutout + card, all driven imperatively through motion values
    const sx = useMotionValue(0);
    const sy = useMotionValue(0);
    const sw = useMotionValue(0);
    const sh = useMotionValue(0);
    const sr = useMotionValue(0);
    const cx = useMotionValue(0);
    const cy = useMotionValue(0);
    const regionH = useMotionValue(0);
    // SVG <rect> strictly forbids negative width, height, and rx
    const safeW = useTransform(sw, (v) => Math.max(0, v));
    const safeH = useTransform(sh, (v) => Math.max(0, v));
    const safeR = useTransform(sr, (v) => Math.max(0, v));
    const rectRef = useRef(null);
    const elRef = useRef(null);
    const cardHRef = useRef(0);
    const firstRef = useRef(true);
    const preparingRef = useRef(false);
    const movingRef = useRef(false);
    const dirRef = useRef(1);
    const moveTimer = useRef(undefined);
    const roRef = useRef(null);
    const prevFocus = useRef(null);
    const cardRef = useRef(null);
    const regionRef = useRef(null);
    const contentEl = useRef(null);
    const nextRef = useRef(null);
    const safeRef = useRef(null);
    const step = steps[index];
    const stepRef = useRef(step);
    stepRef.current = step;
    const move = (mv, to, mode, spring = SPOT) => {
        if (mode === "instant" || reduce) {
            mv.stop();
            mv.set(to);
        }
        else
            animate(mv, to, spring);
    };
    const layoutCut = (mode, intro = false) => {
        const r = rectRef.current;
        const c = r ?? { x: window.innerWidth / 2, y: window.innerHeight / 2, w: 0, h: 0, r: 0 };
        if (intro && !reduce && r) {
            // hole starts wide and closes in on the target
            sx.set(c.x - 48);
            sy.set(c.y - 48);
            sw.set(Math.max(0, c.w + 96));
            sh.set(Math.max(0, c.h + 96));
            sr.set(Math.max(0, c.r + 16));
        }
        move(sx, c.x, mode);
        move(sy, c.y, mode);
        move(sw, Math.max(0, c.w), mode);
        move(sh, Math.max(0, c.h), mode);
        move(sr, Math.max(0, c.r), mode);
    };
    const layoutCard = (mode) => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const cw = cardWidth(vw);
        const safe = parseFloat(getComputedStyle(safeRef.current ?? document.body).paddingBottom) || 0;
        const dock = vw < SMALL ? 12 + safe : undefined;
        const p = place(rectRef.current, cw, cardHRef.current, vw, vh, stepRef.current.placement, dock);
        move(cx, p.x, mode, CARD);
        move(cy, p.y, mode, CARD);
    };
    const go = (i) => {
        if (i < 0)
            return;
        if (i >= steps.length)
            return onClose("done");
        dirRef.current = i > index ? 1 : -1;
        setIndex(i);
        onStepChange?.(i);
    };
    useEffect(() => setMounted(true), []);
    // 1) Step change: find target → scroll → measure → spring the cutout over
    useEffect(() => {
        if (!open || !mounted)
            return;
        let cancelled = false;
        preparingRef.current = true;
        (async () => {
            const s = steps[index];
            const compact = window.innerWidth < SMALL;
            if (compact)
                await frame(); // let the new card content report its height first
            if (cancelled)
                return;
            const safe = parseFloat(getComputedStyle(safeRef.current ?? document.body).paddingBottom) || 0;
            const inset = compact ? Math.max(cardHRef.current, 200) + 12 + safe + 12 : 0;
            const el = await prepare(s, !!reduce, inset);
            if (cancelled)
                return;
            elRef.current = el;
            rectRef.current = el ? rectOf(el, s) : null;
            roRef.current?.disconnect();
            if (el)
                roRef.current?.observe(el);
            preparingRef.current = false;
            movingRef.current = true; // while "moving", scroll/resize retarget the spring instead of snapping
            clearTimeout(moveTimer.current);
            moveTimer.current = setTimeout(() => (movingRef.current = false), 700);
            const intro = firstRef.current;
            firstRef.current = false;
            layoutCut("spring", intro);
            layoutCard(intro ? "instant" : "spring");
        })();
        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, index, mounted]);
    // 2) Measure the card content so the card can animate its height and be placed correctly
    useEffect(() => {
        if (!open || !mounted)
            return;
        const el = contentEl.current;
        if (!el)
            return;
        const report = () => {
            const card = cardRef.current;
            const region = regionRef.current;
            if (!card || !region)
                return;
            const vh = window.innerHeight;
            const cap = window.innerWidth < SMALL ? vh * 0.4 : vh - 160; // long copy scrolls inside the card
            const contentH = Math.min(el.offsetHeight, Math.max(96, cap));
            const chrome = card.offsetHeight - region.offsetHeight; // header + footer
            const first = cardHRef.current === 0;
            cardHRef.current = contentH + chrome;
            move(regionH, contentH, first ? "instant" : "spring", CARD);
            if (!preparingRef.current)
                layoutCard(first ? "instant" : "spring");
            setReady(true);
        };
        report();
        // ioiti-ui: measured once where there is no ResizeObserver (jsdom).
        if (typeof ResizeObserver === "undefined")
            return;
        const ro = new ResizeObserver(report);
        ro.observe(el);
        return () => ro.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, index, mounted]);
    // 3) Keep the cutout glued to the target on scroll / resize
    useEffect(() => {
        if (!open || !mounted)
            return;
        let raf = 0;
        const update = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                if (preparingRef.current)
                    return;
                const s = stepRef.current;
                const el = elRef.current?.isConnected ? elRef.current : resolve(s.target);
                if (el) {
                    elRef.current = el;
                    rectRef.current = rectOf(el, s);
                }
                const mode = movingRef.current ? "spring" : "instant";
                layoutCut(mode);
                layoutCard(mode);
            });
        };
        roRef.current = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
        if (elRef.current)
            roRef.current?.observe(elRef.current);
        window.addEventListener("scroll", update, { capture: true, passive: true });
        window.addEventListener("resize", update);
        window.visualViewport?.addEventListener("resize", update); // mobile toolbars / zoom
        return () => {
            cancelAnimationFrame(raf);
            window.visualViewport?.removeEventListener("resize", update);
            roRef.current?.disconnect();
            window.removeEventListener("scroll", update, true);
            window.removeEventListener("resize", update);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, mounted]);
    // Lock user scrolling (programmatic scrollIntoView still works) + reset on close
    useEffect(() => {
        if (!open) {
            firstRef.current = true;
            cardHRef.current = 0;
            rectRef.current = null;
            elRef.current = null;
            return;
        }
        const stop = (e) => {
            if (cardRef.current?.contains(e.target))
                return; // card copy may scroll
            e.preventDefault();
        };
        window.addEventListener("wheel", stop, { passive: false });
        window.addEventListener("touchmove", stop, { passive: false });
        return () => {
            window.removeEventListener("wheel", stop);
            window.removeEventListener("touchmove", stop);
        };
    }, [open]);
    // Keyboard: ← → navigate, Esc closes. ioiti-ui: and Tab stays in the card, as in a dialog (SettleModal's
    // way): the page is not made inert, which would take the toasts with it, or the tour itself.
    useEffect(() => {
        if (!open)
            return;
        const onKey = (e) => {
            if (e.key === "Tab") {
                const card = cardRef.current;
                const stops = card ? Array.from(card.querySelectorAll("button:not([disabled])")) : [];
                if (!stops.length)
                    return;
                const first = stops[0];
                const last = stops[stops.length - 1];
                const outside = !card?.contains(document.activeElement);
                if (e.shiftKey && (outside || document.activeElement === first)) {
                    e.preventDefault();
                    last.focus();
                }
                else if (!e.shiftKey && (outside || document.activeElement === last)) {
                    e.preventDefault();
                    first.focus();
                }
                return;
            }
            if (e.key === "Escape") {
                e.preventDefault();
                onClose("dismiss");
            }
            else if (e.key === "ArrowRight") {
                e.preventDefault();
                go(index + 1);
            }
            else if (e.key === "ArrowLeft") {
                e.preventDefault();
                go(index - 1);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, index]);
    // Focus: into the card when ready, back to where it was on close
    useEffect(() => {
        if (!open)
            return;
        prevFocus.current = document.activeElement;
        return () => prevFocus.current?.focus?.({ preventScroll: true });
    }, [open]);
    useEffect(() => {
        if (open && ready)
            nextRef.current?.focus({ preventScroll: true });
    }, [open, ready]);
    if (!mounted)
        return null;
    const isLast = index === steps.length - 1;
    const titleId = `${uid}-title`;
    return createPortal(_jsx(AnimatePresence, { children: open && (_jsxs(motion.div, { 
            // ioiti-ui: among the layers over the page (z-50, the hints above it), kept above it while a page
            // changes (over-page, motion.css).
            className: "fixed inset-0 z-50 over-page", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0, transition: motionTransitions.easeExit }, transition: motionTransitions.easeFast, children: [_jsxs("svg", { className: "absolute inset-0 h-full w-full", "aria-hidden": true, onClick: closeOnOverlayClick ? () => onClose("dismiss") : undefined, children: [_jsx("defs", { children: _jsxs("mask", { id: `${uid}-mask`, maskUnits: "userSpaceOnUse", x: "0", y: "0", width: "100%", height: "100%", children: [_jsx("rect", { width: "100%", height: "100%", fill: "white" }), _jsx(motion.rect, { x: sx, y: sy, width: safeW, height: safeH, rx: safeR, fill: "black" })] }) }), _jsx("rect", { width: "100%", height: "100%", className: "fill-black/50 glass:fill-(--glass-scrim)", mask: `url(#${uid}-mask)` }), _jsx(motion.rect, { x: sx, y: sy, width: safeW, height: safeH, rx: safeR, fill: "none", stroke: "white", strokeOpacity: 0.35, strokeWidth: 1.5 })] }), _jsx("div", { ref: safeRef, "aria-hidden": true, className: "pointer-events-none absolute inset-x-0 bottom-0", style: { paddingBottom: "env(safe-area-inset-bottom)" } }), _jsxs(motion.div, { ref: cardRef, role: "dialog", "aria-modal": "true", "aria-labelledby": titleId, 
                    // ioiti-ui: the surface, the text and the glass of a dialog.
                    className: "absolute left-0 top-0 w-[calc(100vw-24px)] max-w-[440px] overflow-hidden rounded-2xl border border-border bg-surface text-text-primary shadow-2xl shadow-black/20 sm:w-[340px] sm:max-w-none glass-float", style: { x: cx, y: cy }, initial: { opacity: 0, scale: 0.96 }, animate: { opacity: ready ? 1 : 0, scale: ready ? 1 : 0.96 }, transition: motionTransitions.easeFast, children: [_jsxs("div", { className: "flex items-center justify-between px-4 pt-3 text-[11px] tabular-nums text-muted-foreground", children: [_jsxs("span", { children: [index + 1, " of ", steps.length] }), _jsx(Button, { variant: "ghost", size: "sm", className: "-my-1.5 -mr-2 h-7 px-2 text-[11px]", onClick: () => onClose("skip"), children: "Skip" })] }), _jsx(motion.div, { ref: regionRef, className: "relative overflow-y-auto overflow-x-hidden overscroll-contain", style: { height: regionH }, "aria-live": "polite", children: _jsx(AnimatePresence, { mode: "popLayout", initial: false, custom: reduce ? 0 : dirRef.current, children: _jsxs(motion.div, { ref: (el) => {
                                        if (el)
                                            contentEl.current = el;
                                    }, custom: reduce ? 0 : dirRef.current, variants: slide, initial: "enter", animate: "center", exit: "exit", transition: motionTransitions.easeFast, className: "px-4 pb-1 pt-2", children: [_jsx("h2", { id: titleId, className: "text-[15px] font-semibold tracking-tight text-text-primary", children: step.title }), _jsx("div", { className: "mt-1 text-[13px] leading-relaxed text-muted-foreground", children: step.body })] }, index) }) }), _jsxs("div", { className: "flex items-center justify-between px-4 pb-3 pt-2", children: [_jsx("div", { className: "flex items-center", children: steps.map((_, i) => (_jsx("button", { type: "button", "aria-label": `Go to step ${i + 1}`, "aria-current": i === index, onClick: () => go(i), className: "group rounded-full px-[3px] py-2 [-webkit-tap-highlight-color:transparent] max-sm:px-1 max-sm:py-3", children: _jsx("span", { className: `block h-1.5 rounded-full transition-[width,background-color] duration-200 ${i === index ? "w-4 bg-foreground accent:bg-brand" : "w-1.5 bg-foreground/20"}` }) }, i))) }), _jsxs("div", { className: "flex gap-1.5", children: [index > 0 && (_jsx(Button, { variant: "ghost", size: "sm", onClick: () => go(index - 1), children: "Back" })), _jsx(Button, { ref: nextRef, size: "sm", onClick: () => go(index + 1), children: isLast ? "Done" : "Next" })] })] })] })] }, "tour"
        // ioiti-ui: among the layers over the page (z-50, the hints above it), kept above it while a page
        // changes (over-page, motion.css).
        )) }), document.body);
}
