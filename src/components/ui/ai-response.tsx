"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
// ioiti-ui: reduced motion as IoitiProvider says it too (useReducedMotionConfig), not the system's alone.
import { AnimatePresence, motion, useReducedMotionConfig } from "framer-motion";
import { motionTransitions } from "../../lib/motion-tokens.js";
import { cn, copyToClipboard } from "../../lib/utils.js";
import { CodeBlock } from "../CodeBlock.js";
import { Hint } from "../Hint.js";
import { useLinkComponent } from "../link-context.js";
import type { CodeLanguage } from "../../lib/highlight.js";

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
export function safeHref(raw: string | null | undefined, allowed: string[] = ALLOWED_PROTOCOLS): string | null {
  if (!raw) return null;
  const value = raw.trim();
  // eslint-disable-next-line no-control-regex
  if (!value || /[\u0000-\u001f\u007f]/.test(value)) return null;

  let url: URL;
  try {
    url = new URL(value, RELATIVE_BASE);
  } catch {
    return null;
  }

  // Relative reference: "/docs", "./x", "#section", "?q=1"
  if (url.origin === RELATIVE_BASE) return value;

  if (!allowed.includes(url.protocol)) return null;
  if (url.username || url.password) return null; // https://trusted.com@evil.com tricks
  return url.href; // normalized, never the raw string
}

function hostOf(href: string): string {
  try {
    const u = new URL(href, RELATIVE_BASE);
    if (u.origin === RELATIVE_BASE) return "";
    if (u.protocol === "mailto:") return "email";
    return u.hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

const isExternal = (href: string) => {
  try {
    return new URL(href, RELATIVE_BASE).origin !== RELATIVE_BASE;
  } catch {
    return false;
  }
};

/* ========================================================================== */
/*  Types + context                                                           */
/* ========================================================================== */

export type AIResponseStatus = "idle" | "generating" | "streaming" | "complete" | "error" | "cancelled";

export interface AIResponseSource {
  id: string | number;
  title: string;
  url?: string;
  snippet?: string;
  sourceType?: "doc" | "github" | "web" | "api" | string;
}

export interface AIResponseContextValue {
  content: string;
  status: AIResponseStatus;
  modelName?: string;
  sources: AIResponseSource[];
  copied: boolean;
  copyContent: () => void;
  onRegenerate?: () => void;
  onFeedback?: (type: "like" | "dislike") => void;
  feedback?: "like" | "dislike" | null;
  // ioiti-ui: the accent's colour comes from the look (accents.css), not from a prop: accentColor is gone.
}

const AIResponseContext = createContext<AIResponseContextValue | null>(null);

export function useAIResponseContext() {
  const ctx = useContext(AIResponseContext);
  if (!ctx) throw new Error("AIResponse compound components must be used within <AIResponse>");
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
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = useCallback(async (text: string) => {
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

function Ico({ d, className = "h-3.5 w-3.5", sw = 1.7 }: { d: string; className?: string; sw?: number }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}

/* ---------------------------------- Styles --------------------------------- */

// ioiti-ui: the design's tokens, a value for each theme, in place of EasyUI's neutrals and black/white washes;
// no focus ring of its own (design.css draws the one ring).
const muted = "text-muted-foreground";
const hair = "ring-1 ring-border";
const wash = "bg-surface-hover";
const iconBtn = "grid h-8 min-w-8 place-items-center rounded-lg text-muted-foreground transition-[color,background-color,transform] duration-150 active:scale-[0.94] [-webkit-tap-highlight-color:transparent] max-sm:h-10 max-sm:min-w-10 [@media(hover:hover)]:hover:bg-surface-hover [@media(hover:hover)]:hover:text-foreground";

/* ========================================================================== */
/*  Markdown (small, streaming-friendly, never touches innerHTML)             */
/* ========================================================================== */

type Block =
  | { type: "heading"; level: 1 | 2 | 3 | 4; text: string }
  | { type: "paragraph"; text: string }
  | { type: "code"; lang: string; code: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "quote"; text: string }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "hr" };

const RE = {
  fence: /^\s*```(.*)$/,
  heading: /^(#{1,4})\s+(.*)$/,
  ul: /^\s*[-*+]\s+(.*)$/,
  ol: /^\s*\d+[.)]\s+(.*)$/,
  quote: /^\s*>\s?(.*)$/,
  hr: /^\s*([-*_])(\s*\1){2,}\s*$/,
  tableDiv: /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/,
};

const splitRow = (l: string) =>
  l.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((s) => s.trim());

function parseMarkdown(raw: string): Block[] {
  const lines = raw.replace(/\r\n?/g, "\n").split("\n");
  const out: Block[] = [];
  let i = 0;

  const startsBlock = (idx: number) => {
    const l = lines[idx];
    return (
      RE.fence.test(l) || RE.heading.test(l) || RE.hr.test(l) || RE.ul.test(l) || RE.ol.test(l) || RE.quote.test(l) ||
      (l.includes("|") && idx + 1 < lines.length && RE.tableDiv.test(lines[idx + 1]))
    );
  };

  while (i < lines.length) {
    const line = lines[i];

    const fence = line.match(RE.fence);
    if (fence) {
      const code: string[] = [];
      i++;
      while (i < lines.length && !RE.fence.test(lines[i])) code.push(lines[i++]);
      i++; // closing fence (may be missing while streaming)
      out.push({ type: "code", lang: fence[1].trim() || "text", code: code.join("\n") });
      continue;
    }

    if (line.includes("|") && i + 1 < lines.length && RE.tableDiv.test(lines[i + 1])) {
      const headers = splitRow(line);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].includes("|") && lines[i].trim()) rows.push(splitRow(lines[i++]));
      out.push({ type: "table", headers, rows });
      continue;
    }

    const h = line.match(RE.heading);
    if (h) {
      out.push({ type: "heading", level: h[1].length as 1 | 2 | 3 | 4, text: h[2] });
      i++;
      continue;
    }

    if (RE.hr.test(line)) {
      out.push({ type: "hr" });
      i++;
      continue;
    }

    if (RE.quote.test(line)) {
      const q: string[] = [];
      while (i < lines.length && RE.quote.test(lines[i])) q.push(lines[i++].match(RE.quote)![1]);
      out.push({ type: "quote", text: q.join(" ") });
      continue;
    }

    const isUl = RE.ul.test(line);
    if (isUl || RE.ol.test(line)) {
      const re = isUl ? RE.ul : RE.ol;
      const items: string[] = [];
      while (i < lines.length && re.test(lines[i])) items.push(lines[i++].match(re)![1]);
      out.push({ type: "list", ordered: !isUl, items });
      continue;
    }

    if (!line.trim()) {
      i++;
      continue;
    }

    const para: string[] = [];
    while (i < lines.length && lines[i].trim() && !(para.length && startsBlock(i))) para.push(lines[i++]);
    out.push({ type: "paragraph", text: para.join(" ") });
  }
  return out;
}

const INLINE = /(`[^`\n]+`|\*\*[^*\n]+\*\*|\*[^*\s][^*\n]*\*|\[[^\]\n]+\]\([^)\s]+(?:\s+"[^"]*")?\))/g;

// ioiti-ui: a same-site address (/runs/42) is drawn by the application's link, so that its router follows it.
function Link({ href, children }: { href: string | undefined; children: React.ReactNode }) {
  const AppLink = useLinkComponent();
  const safe = safeHref(href);
  if (!safe) {
    // Unsafe or unparseable → plain text, never a link
    return (
      // ioiti-ui: a hint in place of the title.
      <Hint content="Link blocked for your safety" wrap>
        <span className="underline decoration-dotted decoration-muted-foreground underline-offset-4">
          {children}
        </span>
      </Hint>
    );
  }
  const external = isExternal(safe);
  const host = hostOf(safe);
  const className = "inline-flex items-baseline gap-0.5 break-words rounded-sm font-medium text-foreground underline decoration-border underline-offset-[3px] transition-[text-decoration-color] duration-150 [@media(hover:hover)]:hover:decoration-current";
  if (!external) {
    return (
      <AppLink href={safe} className={className}>
        {children}
      </AppLink>
    );
  }
  return (
    // ioiti-ui: a hint in place of the title.
    <Hint content={host ? `${host} — ${safe}` : safe}>
      <a href={safe} target="_blank" rel="noopener noreferrer nofollow ugc" referrerPolicy="no-referrer" className={className}>
        {children}
        <Ico d={PATHS.external} className="h-[0.7em] w-[0.7em] translate-y-[0.05em] self-center text-muted-foreground" sw={2} />
      </a>
    </Hint>
  );
}

function renderInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  // A fresh regex per call: renderInline recurses, and a shared /g regex would
  // have its lastIndex clobbered by the nested call (infinite loop).
  const re = new RegExp(INLINE.source, "g");
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const t = m[0];
    const k = m.index;
    if (t.startsWith("`")) {
      nodes.push(
        <code key={k} className={`rounded-md px-1.5 py-0.5 font-mono text-[0.86em] text-foreground ${wash} ${hair}`}>
          {t.slice(1, -1)}
        </code>,
      );
    } else if (t.startsWith("**")) {
      nodes.push(<strong key={k} className="font-semibold text-foreground">{renderInline(t.slice(2, -2))}</strong>);
    } else if (t.startsWith("*")) {
      nodes.push(<em key={k}>{renderInline(t.slice(1, -1))}</em>);
    } else {
      const parts = t.match(/^\[([^\]]+)\]\(([^)\s]+)/);
      if (parts) nodes.push(<Link key={k} href={parts[2]}>{renderInline(parts[1])}</Link>);
    }
    last = re.lastIndex;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function Caret() {
  const reduce = useReducedMotionConfig();
  return (
    <motion.span
      aria-hidden
      data-caret=""
      className="ml-[3px] inline-block h-[1.05em] w-[2px] translate-y-[0.2em] rounded-full bg-current"
      animate={reduce ? { opacity: 0.7 } : { opacity: [1, 0.15, 1] }}
      transition={reduce ? undefined : { repeat: Infinity, duration: 1.1, ease: "easeInOut" }}
    />
  );
}

/* ========================================================================== */
/*  Code                                                                      */
/* ========================================================================== */

// ioiti-ui: the package's own CodeBlock (its colours, its copy button, its frame) draws a fence; EasyUI's
// CodeBlock, which would have shadowed it among the exports, is gone. A fence's language is coloured when
// the CodeBlock knows it, and said above it.
const LANGUAGES: Record<string, CodeLanguage> = {
  json: "json", js: "js", javascript: "js", jsx: "jsx", ts: "ts", typescript: "ts", tsx: "tsx", css: "css",
  sh: "shell", bash: "shell", shell: "shell", zsh: "shell",
};

/* ========================================================================== */
/*  Header                                                                    */
/* ========================================================================== */

export interface AIResponseHeaderProps {
  title?: string;
  modelBadge?: string;
  timestamp?: string;
  icon?: React.ReactNode;
  className?: string;
}

// ioiti-ui: the orb in the colours of the things compared (chart-colours), the accent's under a look with one.
function Orb({ active }: { active: boolean }) {
  const reduce = useReducedMotionConfig();
  return (
    <motion.span
      aria-hidden
      className="relative block h-[18px] w-[18px] shrink-0 rounded-full bg-[conic-gradient(from_200deg,var(--chart-compare-1),var(--chart-compare-2),var(--chart-compare-3),var(--chart-compare-4),var(--chart-compare-1))] ring-1 ring-border accent:bg-(image:--brand-fill)"
      animate={active && !reduce ? { rotate: 360 } : { rotate: 0 }}
      transition={active && !reduce ? { repeat: Infinity, duration: 7, ease: "linear" } : { duration: 0.3 }}
    />
  );
}

const Shimmer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const reduce = useReducedMotionConfig();
  return (
    <motion.span
      // ioiti-ui: the shimmer between the muted text and the text, in both themes.
      className="bg-[linear-gradient(90deg,var(--muted-foreground)_35%,var(--foreground)_50%,var(--muted-foreground)_65%)] bg-clip-text text-transparent"
      style={{ backgroundSize: "250% 100%" }}
      animate={reduce ? undefined : { backgroundPosition: ["120% 0", "-120% 0"] }}
      transition={reduce ? undefined : { repeat: Infinity, duration: 1.8, ease: "linear" }}
    >
      {children}
    </motion.span>
  );
};

export const AIResponseHeader: React.FC<AIResponseHeaderProps> = ({
  title = "Assistant",
  modelBadge,
  timestamp,
  icon,
  className,
}) => {
  const { status, modelName } = useAIResponseContext();
  const badge = modelBadge || modelName;
  const busy = status === "streaming" || status === "generating";

  return (
    <header className={cx("flex items-center justify-between gap-3", className)}>
      <div className="flex min-w-0 items-center gap-2.5">
        {icon ?? <Orb active={busy} />}
        <span className="truncate text-[13px] font-medium tracking-[-0.01em] text-foreground">{title}</span>
        {badge && <span className={`truncate text-[12px] ${muted}`}>{badge}</span>}
      </div>

      <div className={`flex shrink-0 items-center gap-3 text-[12px] ${muted}`} role="status" aria-live="polite">
        {status === "streaming" && (
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-positive" aria-hidden />
            Streaming
          </span>
        )}
        {status === "generating" && <Shimmer>Thinking</Shimmer>}
        {status === "cancelled" && <span>Stopped</span>}
        {timestamp && <span className="hidden tabular-nums sm:inline">{timestamp}</span>}
      </div>
    </header>
  );
};

/* ========================================================================== */
/*  Content                                                                   */
/* ========================================================================== */

export interface AIResponseContentProps {
  className?: string;
}

export const AIResponseContent: React.FC<AIResponseContentProps> = ({ className }) => {
  const { content, status, onRegenerate } = useAIResponseContext();
  const reduce = useReducedMotionConfig();
  const blocks = useMemo(() => parseMarkdown(content), [content]);
  const streaming = status === "streaming";

  if (status === "generating" && !content) {
    return (
      <div className="space-y-2.5 py-5" role="status" aria-label="Generating response">
        {["w-3/4", "w-11/12", "w-1/2"].map((w, i) => (
          <motion.div
            key={i}
            className={`h-2.5 rounded-full bg-surface-hover ${w}`}
            animate={reduce ? undefined : { opacity: [0.5, 1, 0.5] }}
            transition={reduce ? undefined : { repeat: Infinity, duration: 1.6, delay: i * 0.15, ease: "easeInOut" }}
          />
        ))}
      </div>
    );
  }

  if (status === "error") {
    return (
      <div role="alert" className="my-5 flex items-start gap-3 rounded-xl bg-negative/[0.06] p-4 ring-1 ring-negative/25">
        <Ico d={PATHS.alert} className="mt-0.5 h-4 w-4 shrink-0 text-negative" />
        <div className="min-w-0 flex-1 text-[13px] leading-relaxed">
          <p className="font-medium text-foreground">Couldn’t finish this response</p>
          <p className={`mt-0.5 break-words ${muted}`}>{content || "The connection dropped or the model timed out."}</p>
          {onRegenerate && (
            <button type="button" onClick={onRegenerate} className="mt-2 rounded-md text-[12.5px] font-medium text-foreground underline decoration-border underline-offset-4">
              Try again
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!content) {
    return <p className={`py-8 text-center text-[13px] ${muted}`}>Ready when you are.</p>;
  }

  const lastIdx = blocks.length - 1;
  const caretAt = (idx: number) => streaming && idx === lastIdx;
  const enter = streaming && !reduce ? { opacity: 0, y: 5 } : false;

  return (
    <div
      aria-live={streaming ? "polite" : "off"}
      aria-busy={streaming}
      className={cx("min-w-0 space-y-4 py-5 text-[14.5px] leading-[1.7] tracking-[-0.003em] text-foreground", className)}
    >
      {blocks.map((b, idx) => {
        const key = `${idx}-${b.type}`;
        const caret = caretAt(idx) ? <Caret /> : null;
        const wrap = (node: React.ReactNode) => (
          <motion.div key={key} className="min-w-0" initial={enter} animate={{ opacity: 1, y: 0 }} transition={EASE_OUT}>
            {node}
          </motion.div>
        );

        switch (b.type) {
          case "heading": {
            const size = { 1: "text-[19px]", 2: "text-[16.5px]", 3: "text-[15px]", 4: "text-[14.5px]" }[b.level];
            return wrap(
              <h3 className={`${size} pt-2 font-semibold leading-snug tracking-[-0.02em] text-foreground`}>
                {renderInline(b.text)}
                {caret}
              </h3>,
            );
          }
          case "paragraph":
            return wrap(<p className="break-words">{renderInline(b.text)}{caret}</p>);
          case "code":
            // ioiti-ui: the package's code block, which scrolls a long line in itself.
            return wrap(<CodeBlock code={b.code} language={LANGUAGES[b.lang.toLowerCase()] ?? "text"} label={b.lang} className="my-4" />);
          case "list": {
            const Tag = b.ordered ? "ol" : "ul";
            return wrap(
              <Tag className={cx("space-y-1.5 pl-5 marker:text-muted-foreground", b.ordered ? "list-decimal marker:tabular-nums" : "list-disc")}>
                {b.items.map((it, j) => (
                  <li key={j} className="break-words pl-1">
                    {renderInline(it)}
                    {caret && j === b.items.length - 1 ? caret : null}
                  </li>
                ))}
              </Tag>,
            );
          }
          case "quote":
            return wrap(
              <blockquote className="border-l-2 border-border pl-4 text-muted-foreground">
                {renderInline(b.text)}
                {caret}
              </blockquote>,
            );
          case "hr":
            return wrap(<hr className="border-border" />);
          case "table":
            return wrap(
              // ioiti-ui: positioned, so that what it scrolls (its words for screen readers too) stays in it.
              <div className={`relative overflow-x-auto rounded-xl ${hair}`}>
                <table className="w-full min-w-[320px] border-collapse text-left text-[13px]">
                  <thead>
                    <tr className={`${wash} text-[11.5px] font-medium ${muted}`}>
                      {b.headers.map((h, j) => (
                        <th key={j} scope="col" className="px-3.5 py-2.5 font-medium">{renderInline(h)}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {b.rows.map((row, r) => (
                      <tr key={r}>
                        {row.map((cell, c) => (
                          <td key={c} className="px-3.5 py-2.5 text-foreground">{renderInline(cell)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>,
            );
        }
      })}
      {streaming && blocks[lastIdx]?.type !== undefined && ["code", "table", "hr"].includes(blocks[lastIdx].type) && <Caret />}
    </div>
  );
};

/* ========================================================================== */
/*  Sources                                                                   */
/* ========================================================================== */

export interface AIResponseSourcesProps {
  sources?: AIResponseSource[];
  title?: string;
  defaultExpanded?: boolean;
  className?: string;
}

export const AIResponseSources: React.FC<AIResponseSourcesProps> = ({
  sources: propSources,
  title = "Sources",
  defaultExpanded = false,
  className,
}) => {
  const { sources: ctx } = useAIResponseContext();
  const AppLink = useLinkComponent();
  const reduce = useReducedMotionConfig();
  const sources = propSources ?? ctx;
  const [open, setOpen] = useState(defaultExpanded);
  if (!sources?.length) return null;

  return (
    <div className={cx("pt-2", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="inline-flex h-8 items-center gap-1.5 rounded-lg pr-2 text-[12.5px] text-muted-foreground transition-colors duration-150 [@media(hover:hover)]:hover:text-foreground"
      >
        <Ico d={PATHS.chevron} className={cx("h-3.5 w-3.5 transition-transform duration-200", open && "rotate-180")} />
        {title}
        <span className="tabular-nums text-muted-foreground">{sources.length}</span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.ul
            // ioiti-ui: a height is not reduced by MotionConfig: reduced, the list appears.
            initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduce ? { opacity: 1 } : { height: "auto", opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={SPRING}
            className="overflow-hidden"
          >
            {sources.map((s, i) => {
              const href = safeHref(s.url);
              const host = href ? hostOf(href) : "";
              const inner = (
                <>
                  <span className="mt-px w-4 shrink-0 text-right text-[11.5px] tabular-nums text-muted-foreground">{i + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline gap-2">
                      <span className="truncate text-[13px] font-medium text-foreground">{s.title}</span>
                      {host && <span className="shrink-0 text-[11.5px] text-muted-foreground">{host}</span>}
                    </span>
                    {s.snippet && <span className={`mt-0.5 line-clamp-1 block text-[12px] ${muted}`}>{s.snippet}</span>}
                  </span>
                  {href && isExternal(href) && <Ico d={PATHS.external} className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />}
                </>
              );
              const row = "flex items-start gap-3 rounded-xl px-2.5 py-2";
              const linkRow = `${row} transition-colors duration-150 [@media(hover:hover)]:hover:bg-surface-hover`;
              return (
                <li key={s.id ?? i}>
                  {href && isExternal(href) ? (
                    // ioiti-ui: a hint in place of the title.
                    <Hint content={href}>
                      <a href={href} target="_blank" rel="noopener noreferrer nofollow ugc" referrerPolicy="no-referrer" className={linkRow}>
                        {inner}
                      </a>
                    </Hint>
                  ) : href ? (
                    // ioiti-ui: a same-site source is the application's link.
                    <AppLink href={href} className={linkRow}>
                      {inner}
                    </AppLink>
                  ) : s.url ? (
                    <Hint content="Link blocked for your safety" wrap className="flex w-full">
                      <div className={cx(row, "w-full")}>{inner}</div>
                    </Hint>
                  ) : (
                    <div className={row}>{inner}</div>
                  )}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ========================================================================== */
/*  Tools summary                                                             */
/* ========================================================================== */

export interface AIResponseToolsSummaryProps {
  toolCount: number;
  tools?: Array<{ name: string; status?: "success" | "running" | "error"; duration?: string }>;
  onToggleDetails?: () => void;
  className?: string;
}

// ioiti-ui: the design's tones, a value for each theme.
const DOT = { success: "bg-positive", running: "animate-pulse bg-warning", error: "bg-negative" } as const;

export const AIResponseToolsSummary: React.FC<AIResponseToolsSummaryProps> = ({
  toolCount,
  tools = [],
  onToggleDetails,
  className,
}) => {
  const reduce = useReducedMotionConfig();
  const [open, setOpen] = useState(false);
  if (toolCount <= 0) return null;

  return (
    <div className={cx("pt-1", className)}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => {
          setOpen((v) => !v);
          onToggleDetails?.();
        }}
        className={`inline-flex h-8 items-center gap-2 rounded-full bg-surface-hover pl-3 pr-2.5 text-[12.5px] text-muted-foreground ${hair} transition-[color,background-color,transform] duration-150 active:scale-[0.98] [@media(hover:hover)]:hover:text-foreground`}
      >
        <Ico d={PATHS.tool} className="h-3 w-3" />
        Used {toolCount} {toolCount === 1 ? "tool" : "tools"}
        <Ico d={PATHS.chevron} className={cx("h-3 w-3 transition-transform duration-200", open && "rotate-180")} />
      </button>

      <AnimatePresence initial={false}>
        {open && tools.length > 0 && (
          <motion.ul
            // ioiti-ui: see the sources.
            initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduce ? { opacity: 1 } : { height: "auto", opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={SPRING}
            className="overflow-hidden"
          >
            {tools.map((t, i) => (
              <li key={i} className="flex items-center justify-between gap-3 px-1 py-1.5 text-[12.5px]">
                <span className="flex min-w-0 items-center gap-2.5">
                  <span className={cx("h-1.5 w-1.5 shrink-0 rounded-full", DOT[t.status ?? "success"])} aria-hidden />
                  <span className="truncate font-mono text-foreground">{t.name}</span>
                  <span className="sr-only">{t.status ?? "success"}</span>
                </span>
                {t.duration && <span className="shrink-0 tabular-nums text-muted-foreground">{t.duration}</span>}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ========================================================================== */
/*  Actions                                                                   */
/* ========================================================================== */

export interface AIResponseActionsProps {
  className?: string;
}

export const AIResponseActions: React.FC<AIResponseActionsProps> = ({ className }) => {
  const { copied, copyContent, onRegenerate, onFeedback, feedback, status } = useAIResponseContext();
  const busy = status === "streaming" || status === "generating";
  const chosen = "bg-surface-hover !text-foreground";

  // ioiti-ui: each title a hint (a disabled button's on its focusable wrapper); feedback only when it goes somewhere.
  return (
    <div className={cx("-ml-2 flex items-center gap-0.5 pt-3", className)}>
      <Hint content={copied ? "Copied" : "Copy"}>
        <button type="button" onClick={copyContent} className={iconBtn} aria-label={copied ? "Response copied" : "Copy response"}>
          <Ico d={copied ? PATHS.check : PATHS.copy} className={cx("h-[15px] w-[15px]", copied && "text-positive")} sw={copied ? 2.2 : 1.7} />
        </button>
      </Hint>

      {onRegenerate && (
        <Hint content="Regenerate" wrap={busy}>
          <button type="button" onClick={onRegenerate} disabled={busy} className={`${iconBtn} disabled:pointer-events-none disabled:opacity-30`} aria-label="Regenerate response">
            <Ico d={PATHS.retry} className={cx("h-[15px] w-[15px]", busy && "motion-safe:animate-spin")} />
          </button>
        </Hint>
      )}

      {onFeedback && (
        <>
          <span className="mx-1 h-4 w-px bg-border" aria-hidden />

          <Hint content="Good response">
            <button
              type="button"
              onClick={() => onFeedback("like")}
              aria-pressed={feedback === "like"}
              aria-label="Good response"
              className={cx(iconBtn, feedback === "like" && chosen)}
            >
              <Ico d={PATHS.up} className="h-[15px] w-[15px]" />
            </button>
          </Hint>
          <Hint content="Poor response">
            <button
              type="button"
              onClick={() => onFeedback("dislike")}
              aria-pressed={feedback === "dislike"}
              aria-label="Poor response"
              className={cx(iconBtn, feedback === "dislike" && chosen)}
            >
              <Ico d={PATHS.up} className="h-[15px] w-[15px] rotate-180" />
            </button>
          </Hint>
        </>
      )}
    </div>
  );
};

/* ========================================================================== */
/*  Root                                                                      */
/* ========================================================================== */

export interface AIResponseProps {
  /** Markdown text. Safe to stream into: unfinished code fences and lists render fine */
  content?: string;
  status?: AIResponseStatus;
  /** ioiti-ui: no default (EasyUI's "EasyAI 2.0"): without one, no badge. */
  modelName?: string;
  sources?: AIResponseSource[];
  onRegenerate?: () => void;
  onFeedback?: (type: "like" | "dislike") => void;
  /** ioiti-ui: the feedback given before (kept by the application), shown pressed. */
  feedback?: "like" | "dislike" | null;
  className?: string;
  /** Custom composition using the compound parts. Defaults to header + content + sources + actions */
  children?: React.ReactNode;
}

export const AIResponse: React.FC<AIResponseProps> = ({
  content = "",
  status = "complete",
  modelName,
  sources = [],
  onRegenerate,
  onFeedback,
  feedback: given = null,
  className,
  children,
}) => {
  const { copied, copy } = useCopy();
  const [feedback, setFeedback] = useState<"like" | "dislike" | null>(given);
  useEffect(() => setFeedback(given), [given]);

  const value: AIResponseContextValue = {
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

  return (
    <AIResponseContext.Provider value={value}>
      <article
        aria-label="AI response"
        aria-busy={status === "streaming" || status === "generating"}
        // ioiti-ui: the design's surface and border (EasyUI's white and #0b0b0c), glass under the glass material.
        className={cx(
          "w-full min-w-0 rounded-[20px] bg-surface p-4 text-foreground antialiased shadow-sm sm:p-6 glass-card",
          hair,
          className,
        )}
      >
        {children ?? (
          <>
            <AIResponseHeader />
            <AIResponseContent />
            {sources.length > 0 && <AIResponseSources />}
            <AIResponseActions />
          </>
        )}
      </article>
    </AIResponseContext.Provider>
  );
};
