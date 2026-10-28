"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotionConfig,
  useTransform,
} from "framer-motion";
import {
  Dot,
  clamp,
  cx,
  defaultFormat,
  focus,
  muted,
  useDismissOutside,
  useElementWidth,
} from "../../lib/chart-primitives.js";
// ioiti-ui: the design's colours for things compared, and its grey for the rest.
import { MUTED_COLOUR, seriesColours } from "../../lib/chart-colours.js";
import { motionTransitions } from "../../lib/motion-tokens.js";

export interface DonutDatum {
  label: string;
  value: number;
  color?: string;
}

export interface DonutChartProps {
  data: DonutDatum[];
  /** donut: full ring · semi: half-ring gauge */
  variant?: "donut" | "semi";
  /** Largest diameter in px (it shrinks to fit its container) */
  size?: number;
  thickness?: number;
  /** Text above the total in the centre */
  centerLabel?: string;
  /**
   * ioiti-ui: the name of the segment the fifth and those after it make together: the design compares four
   * colours, never recycled (a segment given its own `color` keeps it, and nothing is grouped then).
   */
  otherLabel?: string;
  formatValue?: (n: number) => string;
  showLegend?: boolean;
  animated?: boolean;
  ariaLabel?: string;
  className?: string;
}

const pt = (cxp: number, cyp: number, r: number, a: number) => ({ x: cxp + r * Math.sin(a), y: cyp - r * Math.cos(a) });
function arcPath(cxp: number, cyp: number, r: number, a0: number, a1: number) {
  const p0 = pt(cxp, cyp, r, a0);
  const p1 = pt(cxp, cyp, r, a1);
  return `M${p0.x.toFixed(2)} ${p0.y.toFixed(2)}A${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`;
}

// ioiti-ui: named for what it is (the package exports an AnimatedNumber of its own); it counts up as what
// arrives does (easeSoft), at once where motion is reduced.
function CentreTotal({ value, format, fromZero }: { value: number; format: (n: number) => string; fromZero?: boolean }) {
  const reduce = useReducedMotionConfig();
  const mv = useMotionValue(fromZero && !reduce ? 0 : value);
  const fmt = useRef(format);
  fmt.current = format;
  const text = useTransform(mv, (v) => fmt.current(v));
  useEffect(() => {
    const c = animate(mv, value, reduce ? { duration: 0 } : motionTransitions.easeSoft);
    return () => c.stop();
  }, [value, mv, reduce]);
  return <motion.span>{text}</motion.span>;
}

function Arc({
  centre,
  r,
  a0,
  a1,
  color,
  width,
  dim,
  animated,
  reduce,
  delay,
  label,
  onEnter,
  onLeave,
  onClick,
}: {
  centre: { x: number; y: number };
  r: number;
  a0: number;
  a1: number;
  color: string;
  width: number;
  dim: boolean;
  animated: boolean;
  reduce: boolean;
  delay: number;
  label: string;
  onEnter: () => void;
  onLeave: () => void;
  onClick: () => void;
}) {
  const s = useMotionValue(a0);
  const e = useMotionValue(animated ? a0 : a1);
  const w = useMotionValue(width);
  const first = useRef(true);
  const d = useTransform<number, string>([s, e], ([x, y]) => arcPath(centre.x, centre.y, r, x, Math.max(y, x + 0.0004)));

  // ioiti-ui: the arcs sweep in as what arrives does, then move without overshoot (springGentle); at once
  // where motion is reduced, which MotionConfig does not do for a value animated by hand.
  useEffect(() => {
    const intro = first.current && animated;
    const change = reduce ? { duration: 0 } : motionTransitions.springGentle;
    const c1 = animate(s, a0, intro ? { duration: 0 } : change);
    const c2 = animate(e, a1, intro ? { ...motionTransitions.easeSoft, delay } : change);
    first.current = false;
    return () => {
      c1.stop();
      c2.stop();
    };
  }, [a0, a1, animated, reduce, delay, s, e]);
  useEffect(() => {
    const c = animate(w, width, reduce ? { duration: 0 } : motionTransitions.springSnappy);
    return () => c.stop();
  }, [width, w, reduce]);

  return (
    <g className="transition-opacity" style={{ opacity: dim ? 0.35 : 1 }}>
      <motion.path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" />
      <motion.path
        d={d}
        fill="none"
        stroke="transparent"
        strokeWidth={30}
        strokeLinecap="round"
        pointerEvents="stroke"
        style={{ cursor: "pointer" }}
        onPointerEnter={onEnter}
        onPointerLeave={onLeave}
        onClick={onClick}
        aria-label={label}
      />
    </g>
  );
}

export function DonutChart({
  data,
  variant = "donut",
  size = 240,
  thickness = 16,
  centerLabel = "Total",
  otherLabel = "Other",
  formatValue = defaultFormat,
  showLegend = true,
  animated = true,
  ariaLabel,
  className = "",
}: DonutChartProps) {
  // ioiti-ui: reduced as the system asks or IoitiProvider's reducedMotion says.
  const reduce = useReducedMotionConfig() ?? false;
  const anim = animated && !reduce;
  const [rootRef, rootW] = useElementWidth<HTMLDivElement>(560);
  const [hidden, setHidden] = useState<number[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  useDismissOutside(wrapRef, active !== null, useCallback(() => setActive(null), []));

  const semi = variant === "semi";
  const side = showLegend && rootW >= 520;
  const D = Math.round(Math.max(120, Math.min(size, side ? rootW * 0.42 : rootW)));
  const grow = thickness + 6;
  const r = D / 2 - grow / 2 - 1;
  const cy = semi ? r + grow / 2 + 1 : D / 2;
  const H = semi ? Math.round(r + grow + 3) : D;
  const centre = { x: D / 2, y: cy };

  // ioiti-ui: four segments in the compare colours, the rest one segment in the design's grey.
  const grouped = data.length > 4 && data.slice(4).some((d) => !d.color);
  const shown: DonutDatum[] = grouped
    ? [...data.slice(0, 4), { label: otherLabel, value: data.slice(4).reduce((s, d) => s + Math.max(0, d.value), 0), color: MUTED_COLOUR }]
    : data;
  const colors = seriesColours(shown.map((d) => d.color));
  const items = shown.map((d, i) => ({ ...d, i, color: colors[i], off: hidden.includes(i) }));
  const total = items.reduce((s, x) => s + (x.off ? 0 : Math.max(0, x.value)), 0);
  const S = semi ? -Math.PI / 2 : 0;
  const A = semi ? Math.PI : Math.PI * 2;
  const pad = 3.5 / r + thickness / 2 / r; // arc gap + round cap
  let acc = 0;
  const segs = items.map((it) => {
    const f = it.off || total === 0 ? 0 : Math.max(0, it.value) / total;
    const a0 = S + acc * A;
    acc += f;
    const a1 = S + acc * A;
    const room = a1 - a0 - 2 * pad;
    const mid = (a0 + a1) / 2;
    return { ...it, f, a0: room > 0 ? a0 + pad : mid, a1: room > 0 ? a1 - pad : mid };
  });

  const toggle = (i: number) =>
    setHidden((h) => (h.includes(i) ? h.filter((x) => x !== i) : items.length - h.length > 1 ? [...h, i] : h));
  const act = active !== null ? segs[active] : null;
  const valueSize = clamp(D * 0.15, 22, 38);
  const allTotal = data.reduce((s, d) => s + Math.max(0, d.value), 0);

  if (!data.length) return <p className={`py-10 text-center text-[13px] ${muted}`}>No data</p>;

  return (
    // ioiti-ui: as wide as its container, never as what it drew (contain-inline-size, see useElementWidth).
    <div ref={rootRef} className={cx("w-full contain-inline-size", side ? "flex items-center gap-8" : "flex flex-col items-center gap-5", className)}>
      <div ref={wrapRef} className="relative shrink-0" style={{ width: D, height: H }}>
        <svg
          width={D}
          height={H}
          role="img"
          aria-label={ariaLabel ?? `${semi ? "Gauge" : "Donut"} chart. Total ${formatValue(total)}`}
          className="block overflow-visible"
        >
          {/* track */}
          <path
            d={semi ? arcPath(centre.x, centre.y, r, S + pad, S + A - pad) : arcPath(centre.x, centre.y, r, 0, Math.PI * 1.9999)}
            fill="none"
            strokeWidth={thickness}
            strokeLinecap="round"
            className="stroke-black/[0.05] dark:stroke-white/[0.06]"
          />
          {segs.map((sg, i) => (
            <Arc
              key={i}
              centre={centre}
              r={r}
              a0={sg.a0}
              a1={sg.a1}
              color={sg.color}
              width={sg.off ? 0 : active === i ? thickness + 4 : thickness}
              dim={active !== null && active !== i}
              animated={anim}
              reduce={reduce}
              delay={Math.min(0.06 + i * 0.06, 0.3)}
              label={`${sg.label}: ${formatValue(sg.value)}`}
              onEnter={() => setActive(i)}
              onLeave={() => setActive(null)}
              onClick={() => setActive((a) => (a === i ? null : i))}
            />
          ))}
        </svg>

        {/* centre readout */}
        <div className={cx("pointer-events-none absolute inset-x-0 flex flex-col items-center text-center", semi ? "bottom-0 justify-end" : "inset-y-0 justify-center")}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active ?? "total"}
              className="max-w-[70%]"
              initial={{ opacity: 0, y: reduce ? 0 : 4 }}
              animate={{ opacity: 1, y: 0 }}
              // ioiti-ui: in as what arrives, out quicker (easeFast, easeExit).
              exit={{ opacity: 0, y: reduce ? 0 : -4, transition: motionTransitions.easeExit }}
              transition={motionTransitions.easeFast}
            >
              <p className={`truncate text-[12px] ${muted}`}>{act ? act.label : centerLabel}</p>
              <p className="font-semibold leading-tight tracking-[-0.03em] tabular-nums text-foreground" style={{ fontSize: valueSize }}>
                {act ? formatValue(act.value) : <CentreTotal value={total} format={formatValue} fromZero={anim} />}
              </p>
              {act && <p className={`text-[12px] tabular-nums ${muted}`}>{Math.round(act.f * 100)}%</p>}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {showLegend && (
        <ul className={cx("w-full", side ? "max-w-[280px] flex-1" : "max-w-sm")} aria-label="Legend">
          {segs.map((sg, i) => (
            <li key={i}>
              <button
                type="button"
                aria-pressed={!sg.off}
                onClick={() => toggle(i)}
                onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
                onPointerLeave={(e) => e.pointerType === "mouse" && setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className={`flex h-11 w-full items-center gap-3 rounded-xl px-2.5 text-left text-[13px] transition-[background-color,opacity] duration-150 [-webkit-tap-highlight-color:transparent] sm:h-10 [@media(hover:hover)]:hover:bg-black/[0.04] dark:[@media(hover:hover)]:hover:bg-white/[0.05] ${focus}`}
              >
                {/* ioiti-ui: a hidden segment's words stay readable (muted, struck through), its dot faded. */}
                <span className={cx("inline-flex", sg.off && "opacity-40")}>
                  <Dot color={sg.color} />
                </span>
                <span className={cx("min-w-0 flex-1 truncate", sg.off ? "text-text-muted line-through" : "text-text-secondary")}>{sg.label}</span>
                <span className={cx("tabular-nums", sg.off ? "text-text-muted" : "text-foreground")}>{formatValue(sg.value)}</span>
                <span className={`w-9 text-right text-[12px] tabular-nums ${muted}`}>{sg.off ? "—" : `${Math.round(sg.f * 100)}%`}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* ioiti-ui: the figures for screen readers, every segment (those grouped as one included), the table in
          a box of its own: a table is never narrower than its rows, and one made 1 px wide (sr-only) stood as
          wide as its text, beyond the page, which then scrolled sideways onto nothing. */}
      <div className="sr-only">
        <table>
          <caption>{ariaLabel ?? "Chart data"}</caption>
          <thead>
            <tr>
              <th scope="col">Segment</th>
              <th scope="col">Value</th>
              <th scope="col">Share</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => (
              <tr key={i}>
                <th scope="row">{d.label}</th>
                <td>{formatValue(d.value)}</td>
                <td>{allTotal > 0 ? `${Math.round((Math.max(0, d.value) / allTotal) * 100)}%` : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
