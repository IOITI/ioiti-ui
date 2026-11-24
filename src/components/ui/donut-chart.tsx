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
  focus,
  muted,
  // ioiti-ui: the numbers and shares in the interface's locale.
  useChartFormat,
  useDismissOutside,
  useElementWidth,
} from "../../lib/chart-primitives.js";
// ioiti-ui: the design's colours for things compared, and its grey for the rest.
import { MUTED_COLOUR, seriesColours } from "../../lib/chart-colours.js";
import { motionTransitions } from "../../lib/motion-tokens.js";
// ioiti-ui: the words in the interface's language.
import { useMessages } from "../locale-context.js";

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
  /** Text above the total in the centre (ioiti-ui: "Total" in the interface's language by default) */
  centerLabel?: string;
  /**
   * ioiti-ui: the name of the segment the fifth and those after it make together: the design compares four
   * colours, never recycled (a segment given its own `color` keeps it, and nothing is grouped then). "Other" in the
   * interface's language by default.
   */
  otherLabel?: string;
  /** ioiti-ui: a value, its total's too: as the interface's locale writes it by default, to a tenth ("1,234.5"). */
  formatValue?: (n: number) => string;
  showLegend?: boolean;
  animated?: boolean;
  /**
   * ioiti-ui: its name for a screen reader, and its table's caption. By default, in the interface's language, "Donut
   * chart. Total 750" ("Gauge chart…" for a gauge) and "Chart data".
   */
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
    // ioiti-ui: drawn for the eye and the pointer: a screen reader has the figures in the table under the chart, a
    // keyboard in the legend (an aria-label on a path, no role that takes one, named nothing).
    <g aria-hidden="true" className="transition-opacity" style={{ opacity: dim ? 0.35 : 1 }}>
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
      />
    </g>
  );
}

export function DonutChart({
  data,
  variant = "donut",
  size = 240,
  thickness = 16,
  centerLabel: givenCenterLabel,
  otherLabel: givenOtherLabel,
  formatValue: givenFormatValue,
  showLegend = true,
  animated = true,
  ariaLabel,
  className = "",
}: DonutChartProps) {
  // ioiti-ui: reduced as the system asks or IoitiProvider's reducedMotion says.
  const reduce = useReducedMotionConfig() ?? false;
  const anim = animated && !reduce;
  // ioiti-ui: the numbers, shares and words in the interface's locale and language, where the application gives none.
  const chartFormat = useChartFormat();
  const words = useMessages().chart;
  const formatValue = givenFormatValue ?? chartFormat.format;
  const centerLabel = givenCenterLabel ?? words.total;
  const otherLabel = givenOtherLabel ?? words.otherSegment;
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

  // ioiti-ui: the words of the interface's language (the catalogue's `chart`), here and below.
  if (!data.length) return <p className={`py-10 text-center text-sm ${muted}`}>{words.noData}</p>;

  return (
    // ioiti-ui: as wide as its container, never as what it drew (contain-inline-size, see useElementWidth).
    <div ref={rootRef} className={cx("w-full contain-inline-size", side ? "flex items-center gap-8" : "flex flex-col items-center gap-5", className)}>
      <div ref={wrapRef} className="relative shrink-0" style={{ width: D, height: H }}>
        <svg
          width={D}
          height={H}
          role="img"
          // ioiti-ui: the interface's language.
          aria-label={ariaLabel ?? (semi ? words.gaugeChartName(formatValue(total)) : words.donutChartName(formatValue(total)))}
          className="block overflow-visible"
        >
          {/* track */}
          <path
            d={semi ? arcPath(centre.x, centre.y, r, S + pad, S + A - pad) : arcPath(centre.x, centre.y, r, 0, Math.PI * 1.9999)}
            fill="none"
            strokeWidth={thickness}
            strokeLinecap="round"
            className="stroke-foreground/5"
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
              <p className={`truncate text-xs ${muted}`}>{act ? act.label : centerLabel}</p>
              <p className="font-semibold leading-tight tracking-[-0.03em] tabular-nums text-foreground" style={{ fontSize: valueSize }}>
                {act ? formatValue(act.value) : <CentreTotal value={total} format={formatValue} fromZero={anim} />}
              </p>
              {/* ioiti-ui: its share as the interface's locale writes a percentage. */}
              {act && <p className={`text-xs tabular-nums ${muted}`}>{chartFormat.share(act.f)}</p>}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {showLegend && (
        // ioiti-ui: named in the interface's language; each share as its locale writes a percentage.
        <ul className={cx("w-full", side ? "max-w-[280px] flex-1" : "max-w-sm")} aria-label={words.legend}>
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
                className={`flex h-10 w-full cursor-pointer items-center gap-3 rounded-lg px-2.5 text-left text-sm transition-[background-color,opacity] duration-150 [-webkit-tap-highlight-color:transparent] [@media(hover:hover)]:hover:bg-surface-hover ${focus}`}
              >
                {/* ioiti-ui: a hidden segment's words stay readable (muted, struck through), its dot faded. */}
                <span className={cx("inline-flex", sg.off && "opacity-40")}>
                  <Dot color={sg.color} />
                </span>
                <span className={cx("min-w-0 flex-1 truncate", sg.off ? "text-muted-foreground line-through" : "text-text-secondary")}>{sg.label}</span>
                <span className={cx("tabular-nums", sg.off ? "text-muted-foreground" : "text-foreground")}>{formatValue(sg.value)}</span>
                <span className={`w-9 text-right text-xs tabular-nums ${muted}`}>{sg.off ? "—" : chartFormat.share(sg.f)}</span>
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
          {/* ioiti-ui: its caption and heads in the interface's language, its shares in its locale. */}
          <caption>{ariaLabel ?? words.tableCaption}</caption>
          <thead>
            <tr>
              <th scope="col">{words.segmentColumn}</th>
              <th scope="col">{words.valueColumn}</th>
              <th scope="col">{words.shareColumn}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => (
              <tr key={i}>
                <th scope="row">{d.label}</th>
                <td>{formatValue(d.value)}</td>
                <td>{allTotal > 0 ? chartFormat.share(Math.max(0, d.value) / allTotal) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
