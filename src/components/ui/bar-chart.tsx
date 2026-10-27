"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { motion, useReducedMotionConfig } from "framer-motion";
import {
  Dot,
  Tooltip,
  clamp,
  cx,
  defaultFormat,
  defaultTick,
  muted,
  useDismissOutside,
  useElementWidth,
} from "../../lib/chart-primitives.js";
// ioiti-ui: the design's colours for series, gains and losses, its grid and axis; an axis that goes below zero.
import {
  AXIS_COLOUR,
  GRID_COLOUR,
  MUTED_COLOUR,
  NEGATIVE_COLOUR,
  POSITIVE_COLOUR,
  SERIES_COLOUR,
  seriesColours,
} from "../../lib/chart-colours.js";
// ioiti-ui: more to say of a category, in the tooltip and the table.
import { detailsText, type ChartDetail } from "../../lib/chart-details.js";
import { niceDomain } from "../../lib/chart-scale.js";
import { motionTransitions } from "../../lib/motion-tokens.js";
import { ChartLegend } from "../ChartLegend.js";

export interface BarSeries {
  key: string;
  label: string;
  color?: string;
}
// ioiti-ui: a value that is missing (`null`) is no bar, and a dash in the tooltip and the table.
export type BarDatum = { label: string } & Record<string, string | number | null>;

export interface BarChartProps {
  data: BarDatum[];
  series: BarSeries[];
  /** grouped: bars side by side · stacked: bars on top of each other (changing it morphs) */
  variant?: "grouped" | "stacked";
  /**
   * ioiti-ui: `series` colours each series (one series in the series colour, things compared in the four
   * compare colours, never recycled); `sign` colours each bar by its sign, a gain's colour up and a loss's
   * down (daily gains and losses).
   */
  tone?: "series" | "sign";
  height?: number;
  formatValue?: (n: number) => string;
  formatTick?: (n: number) => string;
  /** ioiti-ui: a category's heading in the tooltip and its row in the table ("12 Oct 2026" where the axis says "12 Oct"). */
  formatTitle?: (datum: BarDatum, index: number) => string;
  /** ioiti-ui: more to say of a category, under its series' values in the tooltip and in the table. */
  details?: (datum: BarDatum, index: number) => ChartDetail[];
  /** ioiti-ui: the categories the axis names (a time axis's round moments); as many as fit otherwise. */
  tickAt?: (datum: BarDatum, index: number) => boolean;
  /** ioiti-ui: whole numbers on the value axis, for counts. */
  integer?: boolean;
  /**
   * ioiti-ui: one category set apart, a result among those it is set against (a run among random ones), for
   * one series: its bar in the series colour and a line through it, named above; the others in the muted grey.
   */
  marked?: { index: number; label: string };
  showLegend?: boolean;
  /** Entrance animation (also disabled by prefers-reduced-motion) */
  animated?: boolean;
  ariaLabel?: string;
  className?: string;
}

// ioiti-ui: a bar rounded at its far end, its top above zero, its bottom below: the same commands either
// way (and with no rounding), so any two bars still morph into each other.
function barPath(x: number, y: number, w: number, h: number, rTop: number, rBottom: number) {
  const t = Math.max(0, Math.min(rTop, w / 2, h));
  const b = Math.max(0, Math.min(rBottom, w / 2, h - t));
  return (
    `M${x} ${y + h - b}V${y + t}Q${x} ${y} ${x + t} ${y}H${x + w - t}Q${x + w} ${y} ${x + w} ${y + t}` +
    `V${y + h - b}Q${x + w} ${y + h} ${x + w - b} ${y + h}H${x + b}Q${x} ${y + h} ${x} ${y + h - b}Z`
  );
}

// ioiti-ui: a domain of whole numbers, for counts: the nice one stepped by less than one.
function wholeDomain(min: number, max: number) {
  const from = Math.floor(min);
  const to = Math.max(from + 1, Math.ceil(max));
  const ticks: number[] = [];
  for (let tick = from; tick <= to; tick += 1) ticks.push(tick);
  return { min: from, max: to, step: 1, ticks };
}

// ioiti-ui: bars grow in as what arrives does (easeSoft), one category a moment after the other, the
// stagger capped; a change of the data or of the variant then moves them without overshoot.
const STAGGER = 0.03;
const STAGGER_CAP = 0.3;

export function BarChart({
  data,
  series,
  variant = "grouped",
  tone = "series",
  height = 260,
  formatValue = defaultFormat,
  formatTick = defaultTick,
  formatTitle,
  details,
  tickAt,
  integer = false,
  marked,
  showLegend = true,
  animated = true,
  ariaLabel,
  className = "",
}: BarChartProps) {
  // ioiti-ui: reduced as the system asks or IoitiProvider's reducedMotion says.
  const reduce = useReducedMotionConfig();
  const anim = animated && !reduce;
  const [rootRef, width] = useElementWidth<HTMLDivElement>(640);
  const [hidden, setHidden] = useState<string[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const [entered, setEntered] = useState(!anim);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!anim) return;
    const t = setTimeout(() => setEntered(true), ((motionTransitions.easeSoft.duration ?? 0.32) + STAGGER_CAP + 0.1) * 1000);
    return () => clearTimeout(t);
  }, [anim]);
  useDismissOutside(wrapRef, active !== null, useCallback(() => setActive(null), []));

  const colors = seriesColours(series.map((s) => s.color));
  const visible = series.map((s, i) => ({ ...s, color: colors[i], i })).filter((s) => !hidden.includes(s.key));
  const stacked = variant === "stacked";
  const n = data.length;
  // ioiti-ui: a value keeps its sign: a loss is drawn below zero.
  const val = (d: BarDatum, k: string) => {
    const v = d[k];
    return typeof v === "number" && isFinite(v) ? v : 0;
  };
  // ioiti-ui: a value said, or a dash where there is none.
  const said = (d: BarDatum, k: string) => {
    const v = d[k];
    return typeof v === "number" && isFinite(v) ? formatValue(v) : "—";
  };
  // ioiti-ui: stacked by sign: gains piled up from zero, losses down from it.
  const sums = (d: BarDatum) =>
    visible.reduce(
      (s, x) => {
        const v = val(d, x.key);
        return v >= 0 ? { up: s.up + v, down: s.down } : { up: s.up, down: s.down + v };
      },
      { up: 0, down: 0 },
    );
  const extent = data.map((d) => {
    if (stacked) return sums(d);
    const values = visible.map((x) => val(d, x.key));
    return { up: Math.max(0, ...values), down: Math.min(0, ...values) };
  });
  const nice = niceDomain(Math.min(0, ...extent.map((e) => e.down)), Math.max(0, ...extent.map((e) => e.up)), 4);
  // ioiti-ui: counts step by one at least.
  const domain = integer && nice.step < 1 ? wholeDomain(nice.min, nice.max) : nice;
  const ticks = domain.ticks;
  const tickText = ticks.map(formatTick);

  // ioiti-ui: room above the plot for the marked category's name.
  const M = { top: marked ? 22 : 8, right: 6, bottom: 26, left: Math.ceil(Math.max(...tickText.map((s) => s.length)) * 6.4) + 10 };
  const iw = Math.max(10, width - M.left - M.right);
  const ih = height - M.top - M.bottom;
  const y = (v: number) => M.top + ((domain.max - v) / (domain.max - domain.min)) * ih;
  const zero = y(0);
  const stepX = iw / Math.max(1, n);
  const k = Math.max(1, visible.length);
  const gapIn = 3;
  const barW = stacked ? clamp(stepX * 0.62, 4, 46) : clamp((stepX * 0.74 - gapIn * (k - 1)) / k, 3, 34);
  const groupW = stacked ? barW : barW * k + gapIn * (k - 1);
  const labelEvery = Math.max(1, Math.ceil((Math.max(...data.map((d) => d.label.length), 1) * 6.4 + 14) / stepX));
  const radius = Math.min(6, barW / 2);
  // ioiti-ui: a sign's colour; else, with a category marked, the series colour for it and grey for the others.
  const setApart = marked !== undefined && series.length === 1;
  const fillOf = (si: number, v: number, i: number) =>
    tone === "sign"
      ? v >= 0
        ? POSITIVE_COLOUR
        : NEGATIVE_COLOUR
      : setApart
        ? i === marked.index
          ? SERIES_COLOUR
          : MUTED_COLOUR
        : colors[si];
  const titleOf = (i: number) => (formatTitle ? formatTitle(data[i], i) : data[i].label);
  const detailsOf = (i: number) => details?.(data[i], i) ?? [];

  // Geometry of every bar (hidden series collapse onto their group's centre, on the zero line)
  const groupTop = (i: number) => Math.min(y(extent[i].up), zero);
  const bars = data.map((d, i) => {
    const centre = M.left + stepX * i + stepX / 2;
    let up = 0;
    let down = 0;
    const topSeries = [...visible].reverse().find((x) => val(d, x.key) > 0);
    const bottomSeries = [...visible].reverse().find((x) => val(d, x.key) < 0);
    return series.map((s, si) => {
      const vi = visible.findIndex((x) => x.key === s.key);
      const v = val(d, s.key);
      if (vi < 0) return { s, si, v, d: barPath(centre, zero, 0, 0, 0, 0), opacity: 0 };
      if (stacked) {
        if (v >= 0) {
          const y1 = y(up + v);
          const h = Math.max(0, y(up) - y1 - (up > 0 && v > 0 ? 1.5 : 0));
          up += v;
          return { s, si, v, d: barPath(centre - barW / 2, y1, barW, h, topSeries?.key === s.key ? radius : 0, 0), opacity: 1 };
        }
        const y0 = y(down) + (down < 0 ? 1.5 : 0);
        const h = Math.max(0, y(down + v) - y0);
        down += v;
        return { s, si, v, d: barPath(centre - barW / 2, y0, barW, h, 0, bottomSeries?.key === s.key ? radius : 0), opacity: 1 };
      }
      const bx = centre - groupW / 2 + vi * (barW + gapIn);
      const h = Math.abs(y(v) - zero);
      return v >= 0
        ? { s, si, v, d: barPath(bx, zero - h, barW, h, radius, 0), opacity: 1 }
        : { s, si, v, d: barPath(bx, zero, barW, h, 0, radius), opacity: 1 };
    });
  });

  const move = (e: ReactPointerEvent<SVGRectElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    setActive(clamp(Math.floor((e.clientX - box.left) / stepX), 0, n - 1));
  };
  const onKey = (e: ReactKeyboardEvent) => {
    if (e.key === "ArrowRight") setActive((a) => clamp((a ?? -1) + 1, 0, n - 1));
    else if (e.key === "ArrowLeft") setActive((a) => clamp((a ?? n) - 1, 0, n - 1));
    else if (e.key === "Home") setActive(0);
    else if (e.key === "End") setActive(n - 1);
    else if (e.key === "Escape") setActive(null);
    else return;
    e.preventDefault();
  };
  const toggle = (key: string) =>
    setHidden((h) => (h.includes(key) ? h.filter((x) => x !== key) : visible.length > 1 ? [...h, key] : h));

  if (!n) return <p className={`py-10 text-center text-[13px] ${muted}`}>No data</p>;

  const tr = (i: number, si: number) =>
    reduce
      ? { duration: 0 }
      : entered
        ? motionTransitions.springGentle
        : { ...motionTransitions.easeSoft, delay: Math.min(i * STAGGER + si * STAGGER * 0.6, STAGGER_CAP) };

  return (
    <div ref={rootRef} className={cx("w-full", className)}>
      <div ref={wrapRef} className="relative" style={{ height }}>
        <svg
          width={width}
          height={height}
          role="img"
          aria-label={ariaLabel ?? `Bar chart of ${series.map((s) => s.label).join(", ")} across ${n} categories`}
          tabIndex={0}
          onKeyDown={onKey}
          onBlur={() => setActive(null)}
          // ioiti-ui: the focus is the global ring (design.css).
          className="block touch-pan-y overflow-visible rounded-lg"
        >
          {/* grid + y labels */}
          {ticks.map((tick, t) => {
            const gy = y(tick);
            return (
              <g key={t}>
                {/* ioiti-ui: the grid in the design's grid colour, zero on the axis colour. */}
                <line x1={M.left} x2={width - M.right} y1={gy} y2={gy} stroke={tick === 0 ? AXIS_COLOUR : GRID_COLOUR} />
                <motion.text
                  key={tickText[t]}
                  x={M.left - 8}
                  y={gy}
                  textAnchor="end"
                  dominantBaseline="middle"
                  className="fill-muted-foreground text-[11px] tabular-nums"
                  initial={anim ? { opacity: 0 } : false}
                  animate={{ opacity: 1 }}
                  transition={motionTransitions.easeSoft}
                >
                  {tickText[t]}
                </motion.text>
              </g>
            );
          })}

          {/* hover band */}
          <motion.rect
            y={M.top}
            height={ih}
            width={stepX}
            rx={8}
            className="fill-black/[0.04] dark:fill-white/[0.05]"
            initial={false}
            animate={{ x: M.left + stepX * (active ?? 0), opacity: active === null ? 0 : 1 }}
            transition={reduce ? { duration: 0 } : { x: motionTransitions.springSnappy, opacity: motionTransitions.easeFast }}
          />

          {/* bars */}
          {bars.map((group, i) => (
            <g key={i} className="transition-opacity" style={{ opacity: active === null || active === i ? 1 : 0.38 }}>
              {group.map(({ s, si, v, d, opacity }) => (
                <motion.path
                  key={s.key}
                  fill={fillOf(si, v, i)}
                  initial={
                    anim ? { d: barPath(M.left + stepX * i + stepX / 2 - barW / 2, zero, barW, 0, 0, 0), opacity: 0 } : false
                  }
                  animate={{ d, opacity }}
                  transition={tr(i, si)}
                />
              ))}
            </g>
          ))}

          {/* ioiti-ui: the marked category, a line through it named above the plot */}
          {marked && marked.index >= 0 && marked.index < n && (
            <g>
              <line
                x1={M.left + stepX * marked.index + stepX / 2}
                x2={M.left + stepX * marked.index + stepX / 2}
                y1={M.top}
                y2={M.top + ih}
                stroke={SERIES_COLOUR}
                strokeWidth={2}
              />
              <text
                x={clamp(M.left + stepX * marked.index + stepX / 2, M.left + 24, width - M.right - 24)}
                y={M.top - 8}
                textAnchor="middle"
                className="fill-foreground text-[11px]"
              >
                {marked.label}
              </text>
            </g>
          )}

          {/* x labels (ioiti-ui: those asked for, or as many as fit) */}
          {data.map((d, i) =>
            (tickAt ? tickAt(d, i) : i % labelEvery === 0) ? (
              <text
                key={i}
                x={M.left + stepX * i + stepX / 2}
                y={height - 8}
                textAnchor="middle"
                className={cx("text-[11px]", active === i ? "fill-foreground" : "fill-muted-foreground")}
              >
                {d.label}
              </text>
            ) : null,
          )}

          {/* pointer surface */}
          <rect
            x={M.left}
            y={M.top}
            width={iw}
            height={ih}
            fill="transparent"
            onPointerMove={move}
            onPointerDown={move}
            onPointerLeave={(e) => e.pointerType === "mouse" && setActive(null)}
          />
        </svg>

        <Tooltip pos={active === null ? null : { x: M.left + stepX * (active + 0.5), y: groupTop(active) }} boundsWidth={width}>
          {active !== null && (
            <>
              <p className="mb-1.5 font-medium text-foreground">{titleOf(active)}</p>
              <ul className="space-y-1">
                {visible.map((s) => (
                  <li key={s.key} className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Dot color={fillOf(s.i, val(data[active], s.key), active)} />
                      {s.label}
                    </span>
                    <span className="tabular-nums text-foreground">{said(data[active], s.key)}</span>
                  </li>
                ))}
              </ul>
              {stacked && visible.length > 1 && (
                <p className="mt-1.5 flex justify-between gap-4 border-t border-border pt-1.5">
                  <span className="text-muted-foreground">Total</span>
                  <span className="tabular-nums text-foreground">
                    {formatValue(visible.reduce((s, x) => s + val(data[active], x.key), 0))}
                  </span>
                </p>
              )}
              {/* ioiti-ui: what more there is to say of it */}
              {detailsOf(active).length > 0 && (
                <ul className="mt-1.5 space-y-1 border-t border-border pt-1.5">
                  {detailsOf(active).map((detail) => (
                    <li key={detail.label} className="flex items-center justify-between gap-4">
                      <span className="text-muted-foreground">{detail.label}</span>
                      <span className="tabular-nums text-foreground">{detail.value}</span>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </Tooltip>
      </div>

      {/* ioiti-ui: the package's legend, its swatches as the bars are drawn, each a toggle. */}
      {showLegend && series.length > 1 && (
        <ChartLegend
          label="Series"
          className="mt-3"
          items={series.map((s, i) => ({ label: s.label, color: colors[i], shown: !hidden.includes(s.key) }))}
          onToggle={(i) => toggle(series[i].key)}
        />
      )}

      <table className="sr-only">
        <caption>{ariaLabel ?? "Chart data"}</caption>
        <thead>
          <tr>
            <th scope="col">Category</th>
            {series.map((s) => (
              <th key={s.key} scope="col">{s.label}</th>
            ))}
            {details && <th scope="col">Details</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={i}>
              <th scope="row">{titleOf(i)}</th>
              {series.map((s) => (
                <td key={s.key}>{said(d, s.key)}</td>
              ))}
              {details && <td>{detailsText(detailsOf(i))}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
