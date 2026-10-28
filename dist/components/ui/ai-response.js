"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, } from "react";
// ioiti-ui: reduced motion as IoitiProvider says it too (useReducedMotionConfig), not the system's alone.
import { AnimatePresence, motion, useReducedMotionConfig } from "framer-motion";
import { motionTransitions } from "../../lib/motion-tokens.js";
import { cn, copyToClipboard } from "../../lib/utils.js";
import { CodeBlock } from "../CodeBlock.js";
import { Hint } from "../Hint.js";
import { useLinkComponent } from "../link-context.js";
/* -------------------------------------------------------------------------- */
/*  AIResponse — a streaming-ready AI message: markdown, code, sources, tools, */
/*  actions. One file · deps: react 19, framer-motion, tailwindcss.            */
/*  ioiti-ui: on the design's tokens and its code block, links through the    */
/*  application's, hints in place of titles.                                   */
/*                                                                             */
/*  SECURITY: model output is untrusted. Every link (markdown links AND       */
/*  source URLs) goes through safeHref(): only http, https and mailto (and     */
/*  same-site relative paths) are ever rendered as links. javascript:, data:,  */
/*  vbscript:, file:, blob:, obfuscated variants (java\tscript:) and URLs with */
/*  embedded credentials are blocked and shown as plain text.                  */
/* -------------------------------------------------------------------------- */
/* ========================================================================== */
/*  Security                                                                  */
/* ========================================================================== */
const ALLOWED_PROTOCOLS = ["http:", "https:", "mailto:"];
const RELATIVE_BASE = "https://relative.invalid";
/**
 * Returns a safe href, or null if the URL must not become a link.
 * Uses the same URL parser the browser uses, so obfuscation tricks
 * (case, tabs/newlines, leading spaces, backslashes) can't slip through.
 */
export function safeHref(raw, allowed = ALLOWED_PROTOCOLS) {
    if (!raw)
        return null;
    const value = raw.trim();
    // eslint-disable-next-line no-control-regex
    if (!value || /[\u0000-\u001f\u007f]/.test(value))
        return null;
    let url;
    try {
        url = new URL(value, RELATIVE_BASE);
    }
    catch {
        return null;
    }
    // Relative reference: "/docs", "./x", "#section", "?q=1"
    if (url.origin === RELATIVE_BASE)
        return value;
    if (!allowed.includes(url.protocol))
        return null;
    if (url.username || url.password)
        return null; // https://trusted.com@evil.com tricks
    return url.href; // normalized, never the raw string
}
function hostOf(href) {
    try {
        const u = new URL(href, RELATIVE_BASE);
        if (u.origin === RELATIVE_BASE)
            return "";
        if (u.protocol === "mailto:")
            return "email";
        return u.hostname.replace(/^www\./, "");
    }
    catch {
        return "";
    }
}
const isExternal = (href) => {
    try {
        return new URL(href, RELATIVE_BASE).origin !== RELATIVE_BASE;
    }
    catch {
        return false;
    }
};
const AIResponseContext = createContext(null);
export function useAIResponseContext() {
    const ctx = useContext(AIResponseContext);
    if (!ctx)
        throw new Error("AIResponse compound components must be used within <AIResponse>");
    return ctx;
}
/* ========================================================================== */
/*  Small utilities                                                           */
/* ========================================================================== */
// ioiti-ui: the design's curves (motion-tokens.ts) in place of EasyUI's own.
const EASE_OUT = motionTransitions.easeSoft;
const SPRING = motionTransitions.springGentle;
// ioiti-ui: cn (tailwind-merge), as the other copies, so that an accent's class after a base one wins.
const cx = cn;
function useCopy() {
    const [copied, setCopied] = useState(false);
    const timer = useRef(undefined);
    useEffect(() => () => clearTimeout(timer.current), []);
    const copy = useCallback(async (text) => {
        // ioiti-ui: the package's copyToClipboard in place of a copy of it.
        if (await copyToClipboard(text)) {
            setCopied(true);
            clearTimeout(timer.current);
            timer.current = setTimeout(() => setCopied(false), 1800);
        }
    }, []);
    return { copied, copy };
}
/* ---------------------------------- Icons ---------------------------------- */
const PATHS = {
    copy: "M9 9h10v10H9zM5 15V5h10",
    check: "M5 12.5l4.5 4.5L19 7.5",
    retry: "M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5",
    up: "M7 10v12M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z",
    external: "M7 17 17 7M8 7h9v9",
    chevron: "m6 9 6 6 6-6",
    tool: "M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4Z",
    alert: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM12 8v5M12 16.5v.01",
};
function Ico({ d, className = "h-3.5 w-3.5", sw = 1.7 }) {
    return (_jsx("svg", { viewBox: "0 0 24 24", className: className, fill: "none", stroke: "currentColor", strokeWidth: sw, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true, children: _jsx("path", { d: d }) }));
}
/* ---------------------------------- Styles --------------------------------- */
// ioiti-ui: the design's tokens, a value for each theme, in place of EasyUI's neutrals and black/white washes;
// no focus ring of its own (design.css draws the one ring).
const muted = "text-muted-foreground";
const hair = "ring-1 ring-border";
const wash = "bg-surface-hover";
const iconBtn = "grid h-8 min-w-8 place-items-center rounded-lg text-muted-foreground transition-[color,background-color,transform] duration-150 active:scale-[0.94] [-webkit-tap-highlight-color:transparent] max-sm:h-10 max-sm:min-w-10 [@media(hover:hover)]:hover:bg-surface-hover [@media(hover:hover)]:hover:text-foreground";
const RE = {
    fence: /^\s*```(.*)$/,
    heading: /^(#{1,4})\s+(.*)$/,
    ul: /^\s*[-*+]\s+(.*)$/,
    ol: /^\s*\d+[.)]\s+(.*)$/,
    quote: /^\s*>\s?(.*)$/,
    hr: /^\s*([-*_])(\s*\1){2,}\s*$/,
    tableDiv: /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/,
};
const splitRow = (l) => l.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((s) => s.trim());
function parseMarkdown(raw) {
    const lines = raw.replace(/\r\n?/g, "\n").split("\n");
    const out = [];
    let i = 0;
    const startsBlock = (idx) => {
        const l = lines[idx];
        return (RE.fence.test(l) || RE.heading.test(l) || RE.hr.test(l) || RE.ul.test(l) || RE.ol.test(l) || RE.quote.test(l) ||
            (l.includes("|") && idx + 1 < lines.length && RE.tableDiv.test(lines[idx + 1])));
    };
    while (i < lines.length) {
        const line = lines[i];
        const fence = line.match(RE.fence);
        if (fence) {
            const code = [];
            i++;
            while (i < lines.length && !RE.fence.test(lines[i]))
                code.push(lines[i++]);
            i++; // closing fence (may be missing while streaming)
            out.push({ type: "code", lang: fence[1].trim() || "text", code: code.join("\n") });
            continue;
        }
        if (line.includes("|") && i + 1 < lines.length && RE.tableDiv.test(lines[i + 1])) {
            const headers = splitRow(line);
            i += 2;
            const rows = [];
            while (i < lines.length && lines[i].includes("|") && lines[i].trim())
                rows.push(splitRow(lines[i++]));
            out.push({ type: "table", headers, rows });
            continue;
        }
        const h = line.match(RE.heading);
        if (h) {
            out.push({ type: "heading", level: h[1].length, text: h[2] });
            i++;
            continue;
        }
        if (RE.hr.test(line)) {
            out.push({ type: "hr" });
            i++;
            continue;
        }
        if (RE.quote.test(line)) {
            const q = [];
            while (i < lines.length && RE.quote.test(lines[i]))
                q.push(lines[i++].match(RE.quote)[1]);
            out.push({ type: "quote", text: q.join(" ") });
            continue;
        }
        const isUl = RE.ul.test(line);
        if (isUl || RE.ol.test(line)) {
            const re = isUl ? RE.ul : RE.ol;
            const items = [];
            while (i < lines.length && re.test(lines[i]))
                items.push(lines[i++].match(re)[1]);
            out.push({ type: "list", ordered: !isUl, items });
            continue;
        }
        if (!line.trim()) {
            i++;
            continue;
        }
        const para = [];
        while (i < lines.length && lines[i].trim() && !(para.length && startsBlock(i)))
            para.push(lines[i++]);
        out.push({ type: "paragraph", text: para.join(" ") });
    }
    return out;
}
const INLINE = /(`[^`\n]+`|\*\*[^*\n]+\*\*|\*[^*\s][^*\n]*\*|\[[^\]\n]+\]\([^)\s]+(?:\s+"[^"]*")?\))/g;
// ioiti-ui: a same-site address (/runs/42) is drawn by the application's link, so that its router follows it.
function Link({ href, children }) {
    const AppLink = useLinkComponent();
    const safe = safeHref(href);
    if (!safe) {
        // Unsafe or unparseable → plain text, never a link
        return (_jsx(Hint, { content: "Link blocked for your safety", wrap: true, children: _jsx("span", { className: "underline decoration-dotted decoration-muted-foreground underline-offset-4", children: children }) }));
    }
    const external = isExternal(safe);
    const host = hostOf(safe);
    const className = "inline-flex items-baseline gap-0.5 break-words rounded-sm font-medium text-foreground underline decoration-border underline-offset-[3px] transition-[text-decoration-color] duration-150 [@media(hover:hover)]:hover:decoration-current";
    if (!external) {
        return (_jsx(AppLink, { href: safe, className: className, children: children }));
    }
    return (_jsx(Hint, { content: host ? `${host} — ${safe}` : safe, children: _jsxs("a", { href: safe, target: "_blank", rel: "noopener noreferrer nofollow ugc", referrerPolicy: "no-referrer", className: className, children: [children, _jsx(Ico, { d: PATHS.external, className: "h-[0.7em] w-[0.7em] translate-y-[0.05em] self-center text-muted-foreground", sw: 2 })] }) }));
}
function renderInline(text) {
    const nodes = [];
    let last = 0;
    let m;
    // A fresh regex per call: renderInline recurses, and a shared /g regex would
    // have its lastIndex clobbered by the nested call (infinite loop).
    const re = new RegExp(INLINE.source, "g");
    while ((m = re.exec(text)) !== null) {
        if (m.index > last)
            nodes.push(text.slice(last, m.index));
        const t = m[0];
        const k = m.index;
        if (t.startsWith("`")) {
            nodes.push(_jsx("code", { className: `rounded-md px-1.5 py-0.5 font-mono text-[0.86em] text-foreground ${wash} ${hair}`, children: t.slice(1, -1) }, k));
        }
        else if (t.startsWith("**")) {
            nodes.push(_jsx("strong", { className: "font-semibold text-foreground", children: renderInline(t.slice(2, -2)) }, k));
        }
        else if (t.startsWith("*")) {
            nodes.push(_jsx("em", { children: renderInline(t.slice(1, -1)) }, k));
        }
        else {
            const parts = t.match(/^\[([^\]]+)\]\(([^)\s]+)/);
            if (parts)
                nodes.push(_jsx(Link, { href: parts[2], children: renderInline(parts[1]) }, k));
        }
        last = re.lastIndex;
    }
    if (last < text.length)
        nodes.push(text.slice(last));
    return nodes;
}
function Caret() {
    const reduce = useReducedMotionConfig();
    return (_jsx(motion.span, { "aria-hidden": true, "data-caret": "", className: "ml-[3px] inline-block h-[1.05em] w-[2px] translate-y-[0.2em] rounded-full bg-current", animate: reduce ? { opacity: 0.7 } : { opacity: [1, 0.15, 1] }, transition: reduce ? undefined : { repeat: Infinity, duration: 1.1, ease: "easeInOut" } }));
}
/* ========================================================================== */
/*  Code                                                                      */
/* ========================================================================== */
// ioiti-ui: the package's own CodeBlock (its colours, its copy button, its frame) draws a fence; EasyUI's
// CodeBlock, which would have shadowed it among the exports, is gone. A fence's language is coloured when
// the CodeBlock knows it, and said above it.
const LANGUAGES = {
    json: "json", js: "js", javascript: "js", jsx: "jsx", ts: "ts", typescript: "ts", tsx: "tsx", css: "css",
    sh: "shell", bash: "shell", shell: "shell", zsh: "shell",
};
// ioiti-ui: the orb in the colours of the things compared (chart-colours), the accent's under a look with one.
function Orb({ active }) {
    const reduce = useReducedMotionConfig();
    return (_jsx(motion.span, { "aria-hidden": true, className: "relative block h-[18px] w-[18px] shrink-0 rounded-full bg-[conic-gradient(from_200deg,var(--chart-compare-1),var(--chart-compare-2),var(--chart-compare-3),var(--chart-compare-4),var(--chart-compare-1))] ring-1 ring-border accent:bg-(image:--brand-fill)", animate: active && !reduce ? { rotate: 360 } : { rotate: 0 }, transition: active && !reduce ? { repeat: Infinity, duration: 7, ease: "linear" } : { duration: 0.3 } }));
}
const Shimmer = ({ children }) => {
    const reduce = useReducedMotionConfig();
    return (_jsx(motion.span
    // ioiti-ui: the shimmer between the muted text and the text, in both themes.
    , { 
        // ioiti-ui: the shimmer between the muted text and the text, in both themes.
        className: "bg-[linear-gradient(90deg,var(--muted-foreground)_35%,var(--foreground)_50%,var(--muted-foreground)_65%)] bg-clip-text text-transparent", style: { backgroundSize: "250% 100%" }, animate: reduce ? undefined : { backgroundPosition: ["120% 0", "-120% 0"] }, transition: reduce ? undefined : { repeat: Infinity, duration: 1.8, ease: "linear" }, children: children }));
};
export const AIResponseHeader = ({ title = "Assistant", modelBadge, timestamp, icon, className, }) => {
    const { status, modelName } = useAIResponseContext();
    const badge = modelBadge || modelName;
    const busy = status === "streaming" || status === "generating";
    return (_jsxs("header", { className: cx("flex items-center justify-between gap-3", className), children: [_jsxs("div", { className: "flex min-w-0 items-center gap-2.5", children: [icon ?? _jsx(Orb, { active: busy }), _jsx("span", { className: "truncate text-[13px] font-medium tracking-[-0.01em] text-foreground", children: title }), badge && _jsx("span", { className: `truncate text-[12px] ${muted}`, children: badge })] }), _jsxs("div", { className: `flex shrink-0 items-center gap-3 text-[12px] ${muted}`, role: "status", "aria-live": "polite", children: [status === "streaming" && (_jsxs("span", { className: "flex items-center gap-1.5", children: [_jsx("span", { className: "h-1.5 w-1.5 animate-pulse rounded-full bg-positive", "aria-hidden": true }), "Streaming"] })), status === "generating" && _jsx(Shimmer, { children: "Thinking" }), status === "cancelled" && _jsx("span", { children: "Stopped" }), timestamp && _jsx("span", { className: "hidden tabular-nums sm:inline", children: timestamp })] })] }));
};
export const AIResponseContent = ({ className }) => {
    const { content, status, onRegenerate } = useAIResponseContext();
    const reduce = useReducedMotionConfig();
    const blocks = useMemo(() => parseMarkdown(content), [content]);
    const streaming = status === "streaming";
    if (status === "generating" && !content) {
        return (_jsx("div", { className: "space-y-2.5 py-5", role: "status", "aria-label": "Generating response", children: ["w-3/4", "w-11/12", "w-1/2"].map((w, i) => (_jsx(motion.div, { className: `h-2.5 rounded-full bg-surface-hover ${w}`, animate: reduce ? undefined : { opacity: [0.5, 1, 0.5] }, transition: reduce ? undefined : { repeat: Infinity, duration: 1.6, delay: i * 0.15, ease: "easeInOut" } }, i))) }));
    }
    if (status === "error") {
        return (_jsxs("div", { role: "alert", className: "my-5 flex items-start gap-3 rounded-xl bg-negative/[0.06] p-4 ring-1 ring-negative/25", children: [_jsx(Ico, { d: PATHS.alert, className: "mt-0.5 h-4 w-4 shrink-0 text-negative" }), _jsxs("div", { className: "min-w-0 flex-1 text-[13px] leading-relaxed", children: [_jsx("p", { className: "font-medium text-foreground", children: "Couldn\u2019t finish this response" }), _jsx("p", { className: `mt-0.5 break-words ${muted}`, children: content || "The connection dropped or the model timed out." }), onRegenerate && (_jsx("button", { type: "button", onClick: onRegenerate, className: "mt-2 rounded-md text-[12.5px] font-medium text-foreground underline decoration-border underline-offset-4", children: "Try again" }))] })] }));
    }
    if (!content) {
        return _jsx("p", { className: `py-8 text-center text-[13px] ${muted}`, children: "Ready when you are." });
    }
    const lastIdx = blocks.length - 1;
    const caretAt = (idx) => streaming && idx === lastIdx;
    const enter = streaming && !reduce ? { opacity: 0, y: 5 } : false;
    return (_jsxs("div", { "aria-live": streaming ? "polite" : "off", "aria-busy": streaming, className: cx("min-w-0 space-y-4 py-5 text-[14.5px] leading-[1.7] tracking-[-0.003em] text-foreground", className), children: [blocks.map((b, idx) => {
                const key = `${idx}-${b.type}`;
                const caret = caretAt(idx) ? _jsx(Caret, {}) : null;
                const wrap = (node) => (_jsx(motion.div, { className: "min-w-0", initial: enter, animate: { opacity: 1, y: 0 }, transition: EASE_OUT, children: node }, key));
                switch (b.type) {
                    case "heading": {
                        const size = { 1: "text-[19px]", 2: "text-[16.5px]", 3: "text-[15px]", 4: "text-[14.5px]" }[b.level];
                        return wrap(_jsxs("h3", { className: `${size} pt-2 font-semibold leading-snug tracking-[-0.02em] text-foreground`, children: [renderInline(b.text), caret] }));
                    }
                    case "paragraph":
                        return wrap(_jsxs("p", { className: "break-words", children: [renderInline(b.text), caret] }));
                    case "code":
                        // ioiti-ui: the package's code block, which scrolls a long line in itself.
                        return wrap(_jsx(CodeBlock, { code: b.code, language: LANGUAGES[b.lang.toLowerCase()] ?? "text", label: b.lang, className: "my-4" }));
                    case "list": {
                        const Tag = b.ordered ? "ol" : "ul";
                        return wrap(_jsx(Tag, { className: cx("space-y-1.5 pl-5 marker:text-muted-foreground", b.ordered ? "list-decimal marker:tabular-nums" : "list-disc"), children: b.items.map((it, j) => (_jsxs("li", { className: "break-words pl-1", children: [renderInline(it), caret && j === b.items.length - 1 ? caret : null] }, j))) }));
                    }
                    case "quote":
                        return wrap(_jsxs("blockquote", { className: "border-l-2 border-border pl-4 text-muted-foreground", children: [renderInline(b.text), caret] }));
                    case "hr":
                        return wrap(_jsx("hr", { className: "border-border" }));
                    case "table":
                        return wrap(_jsx("div", { className: `relative overflow-x-auto rounded-xl ${hair}`, children: _jsxs("table", { className: "w-full min-w-[320px] border-collapse text-left text-[13px]", children: [_jsx("thead", { children: _jsx("tr", { className: `${wash} text-[11.5px] font-medium ${muted}`, children: b.headers.map((h, j) => (_jsx("th", { scope: "col", className: "px-3.5 py-2.5 font-medium", children: renderInline(h) }, j))) }) }), _jsx("tbody", { className: "divide-y divide-border", children: b.rows.map((row, r) => (_jsx("tr", { children: row.map((cell, c) => (_jsx("td", { className: "px-3.5 py-2.5 text-foreground", children: renderInline(cell) }, c))) }, r))) })] }) }));
                }
            }), streaming && blocks[lastIdx]?.type !== undefined && ["code", "table", "hr"].includes(blocks[lastIdx].type) && _jsx(Caret, {})] }));
};
export const AIResponseSources = ({ sources: propSources, title = "Sources", defaultExpanded = false, className, }) => {
    const { sources: ctx } = useAIResponseContext();
    const AppLink = useLinkComponent();
    const reduce = useReducedMotionConfig();
    const sources = propSources ?? ctx;
    const [open, setOpen] = useState(defaultExpanded);
    if (!sources?.length)
        return null;
    return (_jsxs("div", { className: cx("pt-2", className), children: [_jsxs("button", { type: "button", onClick: () => setOpen((v) => !v), "aria-expanded": open, className: "inline-flex h-8 items-center gap-1.5 rounded-lg pr-2 text-[12.5px] text-muted-foreground transition-colors duration-150 [@media(hover:hover)]:hover:text-foreground", children: [_jsx(Ico, { d: PATHS.chevron, className: cx("h-3.5 w-3.5 transition-transform duration-200", open && "rotate-180") }), title, _jsx("span", { className: "tabular-nums text-muted-foreground", children: sources.length })] }), _jsx(AnimatePresence, { initial: false, children: open && (_jsx(motion.ul
                // ioiti-ui: a height is not reduced by MotionConfig: reduced, the list appears.
                , { 
                    // ioiti-ui: a height is not reduced by MotionConfig: reduced, the list appears.
                    initial: reduce ? { opacity: 0 } : { height: 0, opacity: 0 }, animate: reduce ? { opacity: 1 } : { height: "auto", opacity: 1 }, exit: reduce ? { opacity: 0 } : { height: 0, opacity: 0 }, transition: SPRING, className: "overflow-hidden", children: sources.map((s, i) => {
                        const href = safeHref(s.url);
                        const host = href ? hostOf(href) : "";
                        const inner = (_jsxs(_Fragment, { children: [_jsx("span", { className: "mt-px w-4 shrink-0 text-right text-[11.5px] tabular-nums text-muted-foreground", children: i + 1 }), _jsxs("span", { className: "min-w-0 flex-1", children: [_jsxs("span", { className: "flex items-baseline gap-2", children: [_jsx("span", { className: "truncate text-[13px] font-medium text-foreground", children: s.title }), host && _jsx("span", { className: "shrink-0 text-[11.5px] text-muted-foreground", children: host })] }), s.snippet && _jsx("span", { className: `mt-0.5 line-clamp-1 block text-[12px] ${muted}`, children: s.snippet })] }), href && isExternal(href) && _jsx(Ico, { d: PATHS.external, className: "mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" })] }));
                        const row = "flex items-start gap-3 rounded-xl px-2.5 py-2";
                        const linkRow = `${row} transition-colors duration-150 [@media(hover:hover)]:hover:bg-surface-hover`;
                        return (_jsx("li", { children: href && isExternal(href) ? (_jsx(Hint, { content: href, children: _jsx("a", { href: href, target: "_blank", rel: "noopener noreferrer nofollow ugc", referrerPolicy: "no-referrer", className: linkRow, children: inner }) })) : href ? (_jsx(AppLink, { href: href, className: linkRow, children: inner })) : s.url ? (_jsx(Hint, { content: "Link blocked for your safety", wrap: true, className: "flex w-full", children: _jsx("div", { className: cx(row, "w-full"), children: inner }) })) : (_jsx("div", { className: row, children: inner })) }, s.id ?? i));
                    }) })) })] }));
};
// ioiti-ui: the design's tones, a value for each theme.
const DOT = { success: "bg-positive", running: "animate-pulse bg-warning", error: "bg-negative" };
export const AIResponseToolsSummary = ({ toolCount, tools = [], onToggleDetails, className, }) => {
    const reduce = useReducedMotionConfig();
    const [open, setOpen] = useState(false);
    if (toolCount <= 0)
        return null;
    return (_jsxs("div", { className: cx("pt-1", className), children: [_jsxs("button", { type: "button", "aria-expanded": open, onClick: () => {
                    setOpen((v) => !v);
                    onToggleDetails?.();
                }, className: `inline-flex h-8 items-center gap-2 rounded-full bg-surface-hover pl-3 pr-2.5 text-[12.5px] text-muted-foreground ${hair} transition-[color,background-color,transform] duration-150 active:scale-[0.98] [@media(hover:hover)]:hover:text-foreground`, children: [_jsx(Ico, { d: PATHS.tool, className: "h-3 w-3" }), "Used ", toolCount, " ", toolCount === 1 ? "tool" : "tools", _jsx(Ico, { d: PATHS.chevron, className: cx("h-3 w-3 transition-transform duration-200", open && "rotate-180") })] }), _jsx(AnimatePresence, { initial: false, children: open && tools.length > 0 && (_jsx(motion.ul
                // ioiti-ui: see the sources.
                , { 
                    // ioiti-ui: see the sources.
                    initial: reduce ? { opacity: 0 } : { height: 0, opacity: 0 }, animate: reduce ? { opacity: 1 } : { height: "auto", opacity: 1 }, exit: reduce ? { opacity: 0 } : { height: 0, opacity: 0 }, transition: SPRING, className: "overflow-hidden", children: tools.map((t, i) => (_jsxs("li", { className: "flex items-center justify-between gap-3 px-1 py-1.5 text-[12.5px]", children: [_jsxs("span", { className: "flex min-w-0 items-center gap-2.5", children: [_jsx("span", { className: cx("h-1.5 w-1.5 shrink-0 rounded-full", DOT[t.status ?? "success"]), "aria-hidden": true }), _jsx("span", { className: "truncate font-mono text-foreground", children: t.name }), _jsx("span", { className: "sr-only", children: t.status ?? "success" })] }), t.duration && _jsx("span", { className: "shrink-0 tabular-nums text-muted-foreground", children: t.duration })] }, i))) })) })] }));
};
export const AIResponseActions = ({ className }) => {
    const { copied, copyContent, onRegenerate, onFeedback, feedback, status } = useAIResponseContext();
    const busy = status === "streaming" || status === "generating";
    const chosen = "bg-surface-hover !text-foreground";
    // ioiti-ui: each title a hint (a disabled button's on its focusable wrapper); feedback only when it goes somewhere.
    return (_jsxs("div", { className: cx("-ml-2 flex items-center gap-0.5 pt-3", className), children: [_jsx(Hint, { content: copied ? "Copied" : "Copy", children: _jsx("button", { type: "button", onClick: copyContent, className: iconBtn, "aria-label": copied ? "Response copied" : "Copy response", children: _jsx(Ico, { d: copied ? PATHS.check : PATHS.copy, className: cx("h-[15px] w-[15px]", copied && "text-positive"), sw: copied ? 2.2 : 1.7 }) }) }), onRegenerate && (_jsx(Hint, { content: "Regenerate", wrap: busy, children: _jsx("button", { type: "button", onClick: onRegenerate, disabled: busy, className: `${iconBtn} disabled:pointer-events-none disabled:opacity-30`, "aria-label": "Regenerate response", children: _jsx(Ico, { d: PATHS.retry, className: cx("h-[15px] w-[15px]", busy && "motion-safe:animate-spin") }) }) })), onFeedback && (_jsxs(_Fragment, { children: [_jsx("span", { className: "mx-1 h-4 w-px bg-border", "aria-hidden": true }), _jsx(Hint, { content: "Good response", children: _jsx("button", { type: "button", onClick: () => onFeedback("like"), "aria-pressed": feedback === "like", "aria-label": "Good response", className: cx(iconBtn, feedback === "like" && chosen), children: _jsx(Ico, { d: PATHS.up, className: "h-[15px] w-[15px]" }) }) }), _jsx(Hint, { content: "Poor response", children: _jsx("button", { type: "button", onClick: () => onFeedback("dislike"), "aria-pressed": feedback === "dislike", "aria-label": "Poor response", className: cx(iconBtn, feedback === "dislike" && chosen), children: _jsx(Ico, { d: PATHS.up, className: "h-[15px] w-[15px] rotate-180" }) }) })] }))] }));
};
export const AIResponse = ({ content = "", status = "complete", modelName, sources = [], onRegenerate, onFeedback, feedback: given = null, className, children, }) => {
    const { copied, copy } = useCopy();
    const [feedback, setFeedback] = useState(given);
    useEffect(() => setFeedback(given), [given]);
    const value = {
        content,
        status,
        modelName,
        sources,
        copied,
        copyContent: () => void copy(content),
        onRegenerate,
        onFeedback: onFeedback
            ? (type) => {
                setFeedback((prev) => (prev === type ? null : type));
                onFeedback(type);
            }
            : undefined,
        feedback,
    };
    return (_jsx(AIResponseContext.Provider, { value: value, children: _jsx("article", { "aria-label": "AI response", "aria-busy": status === "streaming" || status === "generating", 
            // ioiti-ui: the design's surface and border (EasyUI's white and #0b0b0c), glass under the glass material.
            className: cx("w-full min-w-0 rounded-[20px] bg-surface p-4 text-foreground antialiased shadow-sm sm:p-6 glass-card", hair, className), children: children ?? (_jsxs(_Fragment, { children: [_jsx(AIResponseHeader, {}), _jsx(AIResponseContent, {}), sources.length > 0 && _jsx(AIResponseSources, {}), _jsx(AIResponseActions, {})] })) }) }));
};
