"use client";

import {
  type CSSProperties,
  type ElementType,
  type ReactNode,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { motion, useMotionValue, useReducedMotionConfig, useSpring, useTransform, type SpringOptions } from "framer-motion";
import { ArrowUpRight, Home } from "lucide-react";
import { motionTransitions } from "../../lib/motion-tokens.js";
import { cn } from "../../lib/utils.js";
import { Hint } from "../Hint.js";
import { useLinkComponent } from "../link-context.js";
import { BUTTON_LABEL_CLASS, Button, buttonClassName, buttonIconClassName } from "./button.js";

/* -------------------------------------------------------------------------- */
/*  NotFound — a premium 404 page. A frosted-glass folder over a big "404".    */
/*                                                                             */
/*  One file · deps: react 19, framer-motion, tailwindcss · no images.         */
/*  Drop it in as app/not-found.tsx (Next) or your router's catch-all route.   */
/*                                                                             */
/*    <NotFound />                                                             */
/*    <NotFound LinkComponent={Link} suggestions={[{ label: "Docs", href: "/docs" }]} /> */
/* -------------------------------------------------------------------------- */

export interface NotFoundSuggestion {
  label: string;
  href: string;
  description?: string;
}

export interface NotFoundProps {
  errorCode?: string;
  badgeLabel?: string;
  title?: string;
  description?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  homeHref?: string;
  homeLabel?: string;
  showBack?: boolean;
  backLabel?: string;
  secondaryActionLabel?: string;
  onBack?: () => void;
  onSecondaryAction?: () => void;
  children?: ReactNode;
  /**
   * The missing path, shown in a small chip. Left undefined it's read from
   * window.location.pathname after mount (the query string is never shown).
   * Pass `null` to hide it.
   */
  path?: string | null;
  /** Up to 3 helpful destinations */
  suggestions?: NotFoundSuggestion[];
  /** Pass next/link (or your router's Link) so navigation stays client-side. ioiti-ui: the application's link (LinkProvider) by default. */
  LinkComponent?: ElementType;
  /** Pointer parallax on the illustration (desktop, default true) */
  parallax?: boolean;
  footer?: ReactNode;
  className?: string;
  /**
   * ioiti-ui: its heading takes the focus as it appears, so that a screen reader says the page is none: right for a
   * page that replaces the page (the router's catch-all, a record the server does not have), wrong for one drawn in
   * a part of a page (a tab, a sheet), where the focus is someone else's. `true` by default.
   */
  focusOnMount?: boolean;
}

/* ------------------------------ Design space ------------------------------- */
// The illustration is authored on a 460 × 360 stage and scaled to its container.
// Local coordinates have their origin at the artwork's centre; the whole group
// is rotated 8° to match the reference.

const W = 460;
const H = 360;
const CX = 230;
const CY = 185;
const TILT = 8;

const GLASS = { x: -151, y: -31, w: 288, h: 142 };
// Folder outline (tab on the top-left), in glass-local px
const FOLDER =
  "M12 0H64Q72 0 78 6L90 20Q94 26 102 26H276Q288 26 288 38V130Q288 142 276 142H12Q0 142 0 130V12Q0 0 12 0Z";

// ioiti-ui: the pointer followed with the design's soft spring (springSoft), no overshoot.
const FOLLOW = motionTransitions.springSoft as SpringOptions;

// "4": outer outline + the small triangular counter (even-odd)
const FOUR = "M76 0H110V102H124V134H110V154H76V134H0V102ZM76 46V102H36Z";
// "0": outer ellipse + counter (even-odd), centred on (-6,-40)
const ZERO =
  "M-69 -40a63 77 0 1 0 126 0a63 77 0 1 0 -126 0ZM-43 -40a37 49 0 1 1 74 0a37 49 0 1 1 -74 0Z";

/* ------------------------------- Frosted glass ------------------------------ */
// Written as real CSS so it can use @supports (graceful, opaque fallback when
// backdrop-filter isn't available) and a hover transition. No quotes, ">" or "&"
// so it survives any renderer untouched.
// ioiti-ui: the glass is the page's surface frosted, in both themes (the design's tokens), its blur changing on the
// design's curve (--ease-fast); EasyUI's was a blue of its own.
const CSS = `
.np404-glass{
  background:linear-gradient(180deg,color-mix(in oklab,var(--surface) 94%,transparent) 0%,color-mix(in oklab,var(--surface-raised) 94%,transparent) 100%);
  transition:-webkit-backdrop-filter .2s var(--ease-fast),backdrop-filter .2s var(--ease-fast);
}
@supports ((-webkit-backdrop-filter: blur(1px)) or (backdrop-filter: blur(1px))){
  .np404-glass{
    background:linear-gradient(180deg,color-mix(in oklab,var(--surface) 70%,transparent) 0%,color-mix(in oklab,var(--surface) 45%,transparent) 40%,color-mix(in oklab,var(--surface-raised) 65%,transparent) 100%);
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

export function Illustration({ parallax = true }: { parallax?: boolean }) {
  const reduce = useReducedMotionConfig();
  const uid = useId().replace(/:/g, "");
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / W);
    update();
    // ioiti-ui: measured once where there is no ResizeObserver (jsdom).
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Pointer parallax: each layer moves a different amount for depth
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, FOLLOW);
  const sy = useSpring(my, FOLLOW);
  useEffect(() => {
    if (!parallax || reduce) return;
    // ioiti-ui: no parallax where there is no matchMedia (jsdom).
    if (typeof window.matchMedia !== "function" || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const move = (e: PointerEvent) => {
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

  // ioiti-ui: the design's spring for a larger move (springGentle), without EasyUI's overshoot.
  const spring = (delay: number) => (reduce ? { duration: 0 } : { ...motionTransitions.springGentle, delay });

  const layer = "absolute inset-0";
  const svgProps = { viewBox: `0 0 ${W} ${H}`, className: "absolute inset-0 size-full overflow-visible", "aria-hidden": true } as const;
  const group = `translate(${CX} ${CY}) rotate(${TILT})`;
  const anchor: CSSProperties = { position: "absolute", left: CX, top: CY, width: 0, height: 0, transform: `rotate(${TILT}deg)` };

  return (
    <div
      ref={wrapRef}
      role="img"
      aria-label="A frosted glass folder covering the number 404"
      className="np404-hero relative mx-auto w-full max-w-[460px]"
      style={{ aspectRatio: `${W} / ${H}`, opacity: scale === null ? 0 : 1 }}
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* clip shape for the glass (kept in the DOM, zero size) */}
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <clipPath id={`${uid}-folder`} clipPathUnits="objectBoundingBox">
            <path d={FOLDER} transform={`scale(${1 / GLASS.w} ${1 / GLASS.h})`} />
          </clipPath>
        </defs>
      </svg>

      <div className="absolute left-0 top-0 origin-top-left" style={{ width: W, height: H, transform: `scale(${scale ?? 1})` }}>
        <motion.div
          className="absolute inset-0"
          animate={reduce ? undefined : { y: [0, -5, 0] }}
          transition={reduce ? undefined : { ...motionTransitions.easeSoft, repeat: Infinity, duration: 6 }}
        >
          {/* 1 · the back panel. ioiti-ui: a box of the page (surface-raised, its border), not EasyUI's orange. */}
          <motion.div className={layer} style={{ x: panelX, y: panelY }}>
            <motion.div
              className="absolute inset-0"
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={spring(0)}
            >
              <svg {...svgProps}>
                <g transform={group}>
                  <rect x={-140} y={-63} width={285} height={168} rx={9} className="fill-surface-raised stroke-border" strokeWidth={1} />
                </g>
              </svg>
            </motion.div>
          </motion.div>

          {/* 2 · the big 404. ioiti-ui: in the page's ink, seen on the page and the panel alike, without a shadow. */}
          <motion.div className={layer} style={{ x: textX, y: textY }}>
            <motion.div
              className="absolute inset-0"
              initial={reduce ? false : { opacity: 0, y: 22, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={spring(0.08)}
              style={{ transformOrigin: "50% 50%" }}
            >
              <svg {...svgProps}>
                <g transform={group} className="fill-foreground stroke-foreground" strokeWidth={6} strokeLinejoin="round">
                  <path d={FOUR} fillRule="evenodd" transform="translate(-177 -117)" />
                  <path d={ZERO} fillRule="evenodd" />
                  <path d={FOUR} fillRule="evenodd" transform="translate(45 -117)" />
                </g>
              </svg>
            </motion.div>
          </motion.div>

          {/* 3 · frosted-glass folder */}
          <motion.div className={layer} style={{ x: glassX, y: glassY }}>
            <div style={anchor}>
              <motion.div
                style={{ position: "absolute", left: GLASS.x, top: GLASS.y, width: GLASS.w, height: GLASS.h }}
                initial={reduce ? false : { y: 30 }}
                animate={{ y: 0 }}
                whileHover={reduce ? undefined : { y: -6 }}
                transition={spring(0.2)}
              >
                <motion.div
                  className="np404-glass"
                  style={{ position: "absolute", inset: 0, clipPath: `url(#${uid}-folder)`, WebkitClipPath: `url(#${uid}-folder)` }}
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={reduce ? { duration: 0 } : { ...motionTransitions.easeSoft, delay: 0.25 }}
                />
                {/* glass rim. ioiti-ui: a line of the design (border-hover). */}
                <svg width={GLASS.w} height={GLASS.h} viewBox={`0 0 ${GLASS.w} ${GLASS.h}`} className="pointer-events-none absolute inset-0" aria-hidden>
                  <path d={FOLDER} fill="none" className="stroke-border-hover" strokeWidth={1.2} />
                </svg>
              </motion.div>
            </div>
          </motion.div>

          {/* 4 · the X */}
          <motion.div className={layer} style={{ x: markX, y: markY }}>
            <div style={anchor}>
              <motion.div
                style={{ position: "absolute", left: -5 - 28, top: 107 - 28, width: 56, height: 56 }}
                initial={reduce ? false : { scale: 0, rotate: -70 }}
                animate={{ scale: 1, rotate: 0 }}
                whileHover={reduce ? undefined : { rotate: 90 }}
                transition={reduce ? { duration: 0 } : { ...motionTransitions.springGentle, delay: 0.5 }}
              >
                {/* ioiti-ui: in the page's ink, without a shadow. */}
                <svg viewBox="0 0 56 56" width="56" height="56" aria-hidden>
                  <g transform="translate(28 28)" className="fill-foreground">
                    <rect x={-23} y={-5.5} width={46} height={11} rx={5.5} transform="rotate(45)" />
                    <rect x={-23} y={-5.5} width={46} height={11} rx={5.5} transform="rotate(-45)" />
                  </g>
                </svg>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

/* ---------------------------------- Page ----------------------------------- */

// ioiti-ui: the global focus ring is drawn (src/styles/design.css): a white ring on a dark offset suited one theme only.
const focus = "outline-none";

export function NotFound({
  errorCode = "404",
  badgeLabel,
  title = "This page took a wrong turn.",
  description = "The requested page doesn’t exist or may have moved.",
  actionLabel,
  onAction,
  homeHref = "/",
  homeLabel,
  showBack = true,
  backLabel,
  secondaryActionLabel,
  onBack,
  onSecondaryAction,
  children,
  path,
  suggestions,
  LinkComponent,
  parallax = true,
  focusOnMount = true,
  footer,
  className = "",
}: NotFoundProps) {
  const reduce = useReducedMotionConfig();
  // ioiti-ui: the application's link (LinkProvider) unless one is given.
  const Anchor: ElementType = useLinkComponent(LinkComponent);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const headingId = useId();

  const [detected, setDetected] = useState<string | null>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  useEffect(() => {
    setDetected(window.location.pathname);
    setCanGoBack(window.history.length > 1);
    // announce the page to screen readers on navigation. ioiti-ui: unless it is drawn in a part of a page.
    if (focusOnMount) headingRef.current?.focus({ preventScroll: true });
  }, [focusOnMount]);

  const shownPath = path === undefined ? detected : path;
  const effectiveHomeLabel = actionLabel || homeLabel || "Go back home";
  const effectiveBackLabel = secondaryActionLabel || backLabel || "Go back";
  const effectiveGoBack = () => {
    if (onSecondaryAction) return onSecondaryAction();
    if (onBack) return onBack();
    window.history.back();
  };
  const isBackVisible = showBack && (canGoBack || Boolean(onBack) || Boolean(onSecondaryAction) || Boolean(secondaryActionLabel));
  const rise = (delay: number) =>
    reduce
      ? { initial: false as const }
      : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { ...motionTransitions.easeSoft, delay } };

  return (
    // ioiti-ui: a section of the page, under the application's top bar: the shell has the page's <main>, and the page its title.
    <section
      aria-labelledby={headingId}
      // ioiti-ui: without EasyUI's ambient glows (the design draws none).
      className={`relative isolate flex w-full flex-col items-center justify-center overflow-hidden px-5 py-10 text-center text-foreground antialiased sm:px-8 ${className}`}
    >
      <div className="flex w-full max-w-xl flex-col items-center">
        <Illustration parallax={parallax} />

        <p className="sr-only">{`Error ${errorCode}: ${title}`}</p>
        <motion.p {...rise(0.15)} className="mt-2 text-xs font-medium text-muted-foreground">
          {badgeLabel ?? `Error ${errorCode}`}
        </motion.p>

        <motion.h1
          ref={headingRef}
          id={headingId}
          tabIndex={-1}
          {...rise(0.22)}
          className="mt-3 text-balance break-words bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-transparent outline-none sm:text-[44px]"
        >
          {title}
        </motion.h1>

        <motion.p {...rise(0.3)} className="mt-4 max-w-md text-pretty text-base leading-relaxed text-muted-foreground">
          {description}
        </motion.p>

        {shownPath && (
          <motion.div
            {...rise(0.36)}
            className="mt-5 inline-flex max-w-full items-center gap-2 rounded-full bg-surface-raised px-3.5 py-1.5 ring-1 ring-border"
          >
            <span className="size-1.5 shrink-0 rounded-full bg-negative" aria-hidden />
            {/* ioiti-ui: the whole address in a Hint, shown on hover, keyboard focus and a tap, where a title shows on none. */}
            <Hint content={shownPath.length > 80 ? shownPath : null} wrap className="min-w-0">
              <code className="block truncate font-mono text-xs text-muted-foreground">
                {shownPath.length > 80 ? `${shownPath.slice(0, 79)}…` : shownPath}
              </code>
            </Hint>
          </motion.div>
        )}

        {children ? (
          <motion.div {...rise(0.42)} className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
            {children}
          </motion.div>
        ) : (
          <motion.div {...rise(0.42)} className="mt-8 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
            {/* ioiti-ui: the design's buttons (Button, and its classes on the link home), at its heights, with lucide's
                icons: EasyUI's were pills of their own, 44 px high. */}
            {onAction ? (
              <Button leftIcon={<Home />} onClick={onAction}>
                {effectiveHomeLabel}
              </Button>
            ) : (
              <Anchor
                href={homeHref}
                className={buttonClassName({ className: "transition motion-safe:active:scale-[0.97] [-webkit-tap-highlight-color:transparent]" })}
              >
                <span className={buttonIconClassName()}>
                  <Home />
                </span>
                <span className={BUTTON_LABEL_CLASS}>{effectiveHomeLabel}</span>
              </Anchor>
            )}

            {isBackVisible && (
              <Button variant="outline" onClick={effectiveGoBack}>
                {effectiveBackLabel}
              </Button>
            )}
          </motion.div>
        )}

        {suggestions && suggestions.length > 0 && (
          <motion.nav {...rise(0.5)} aria-label="Helpful links" className="mt-12 w-full">
            <p className="mb-3 text-xs font-medium text-muted-foreground">Maybe you were looking for</p>
            <ul className="grid grid-cols-1 gap-2.5 text-left sm:grid-cols-3">
              {suggestions.slice(0, 3).map((s) => (
                <li key={s.href}>
                  <Anchor
                    href={s.href}
                    className={cn(
                      "group flex h-full flex-col rounded-2xl bg-surface p-4 ring-1 ring-border transition-[background-color,box-shadow] [-webkit-tap-highlight-color:transparent] [@media(hover:hover)]:hover:bg-surface-hover [@media(hover:hover)]:hover:ring-border-hover",
                      focus
                    )}
                  >
                    <span className="flex items-center justify-between gap-2 text-sm font-medium text-foreground">
                      {s.label}
                      {/* ioiti-ui: lucide's arrow, not one drawn here. */}
                      <ArrowUpRight
                        aria-hidden
                        className="size-3.5 shrink-0 text-muted-foreground motion-safe:transition-transform duration-200 ease-fast [@media(hover:hover)]:group-hover:-translate-y-0.5 [@media(hover:hover)]:group-hover:translate-x-0.5"
                      />
                    </span>
                    {s.description && <span className="mt-1 text-xs leading-snug text-muted-foreground">{s.description}</span>}
                  </Anchor>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}

        {footer && <motion.div {...rise(0.58)} className="mt-12 text-xs text-muted-foreground">{footer}</motion.div>}
      </div>
    </section>
  );
}

export default NotFound;
