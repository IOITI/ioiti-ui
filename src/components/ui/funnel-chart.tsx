"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import { motion, useReducedMotionConfig } from "framer-motion";
import {
  clamp,
  cx,
  Tooltip,
  // ioiti-ui: the numbers and percentages in the interface's locale.
  useChartFormat,
  useDismissOutside,
  useElementWidth,
} from "../../lib/chart-primitives.js";
import { motionTransitions } from "../../lib/motion-tokens.js";
// ioiti-ui: the words in the interface's language.
import { useMessages } from "../locale-context.js";

/* -------------------------------------------------------------------------- */
/*  FunnelChart                                                               */
/*                                                                            */
/*  Conversion funnel with curved drop-off bridges and loss chips per stage.  */
/*  Hand-written SVG · light and dark · measures its own container.            */
/* -------------------------------------------------------------------------- */

export interface FunnelStage {
  label: string;
  value: number;
  color?: string;
  /** ioiti-ui: what was lost between this stage and the next, in the caller's words ("refused by a rule"). */
  dropLabel?: string;
}

export interface FunnelChartProps {
  stages: FunnelStage[];
  /** ioiti-ui: a stage's value: as the interface's locale writes it by default, to a tenth at most ("1,234.5"). */
  formatValue?: (n: number) => string;
  /** Overall conversion + biggest drop-off line above the chart (default true) */
  showSummary?: boolean;
  animated?: boolean;
  /**
   * ioiti-ui: its name for a screen reader, and its table's caption. By default, in the interface's language, "Funnel
   * with 4 stages from Visited to Paid" and "Funnel data".
   */
  "aria-label"?: string;
  className?: string;
  /**
   * ioiti-ui: what the last stage is of the first, beside its share ("of the visits ended in a purchase"); "overall
   * conversion" in the interface's language by default.
   */
  summaryLabel?: string;
  /**
   * ioiti-ui: what is counted, in the tooltip and the table ("Visits"; EasyUI's "Users", in the interface's language, by
   * default).
   */
  noun?: string;
  /** ioiti-ui: said in place of the chart when there is no stage; "No data" in the interface's language by default. */
  emptyText?: string;
}

const F = { text: 22, bar: 30, bridge: 30 };

// ioiti-ui: secondary text at 4.5:1 in both themes (neutral-500 is 4.0:1 on the dark card).
const MUTED = "text-muted-foreground";
// ioiti-ui: the stages take the ramp of theme.css (--chart-funnel-1 to 5, one hue, the first stage the strongest),
// checked in both themes; EasyUI mixed two hues, indigo to teal.
const RAMP = 5;

export function FunnelChart({
  stages,
  formatValue: givenFormatValue,
  showSummary = true,
  animated = true,
  // ioiti-ui: its name as ARIA writes it, where EasyUI's said `ariaLabel`.
  "aria-label": name,
  className = "",
  summaryLabel: givenSummaryLabel,
  noun: givenNoun,
  emptyText: givenEmptyText,
}: FunnelChartProps) {
  const reduce = useReducedMotionConfig();
  const anim = animated && !reduce;
  // ioiti-ui: the numbers, percentages and words in the interface's locale and language, where the application gives
  // none of its own.
  const chartFormat = useChartFormat();
  const words = useMessages().chart;
  const formatValue = givenFormatValue ?? chartFormat.format;
  const pctText = chartFormat.percent;
  const summaryLabel = givenSummaryLabel ?? words.conversionSummary;
  const noun = givenNoun ?? words.funnelCounted;
  const emptyText = givenEmptyText ?? words.noData;
  const [rootRef, width] = useElementWidth<HTMLDivElement>(480);
  const [active, setActive] = useState<number | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  useDismissOutside(wrapRef, active !== null, useCallback(() => setActive(null), []));

  const n = stages.length;
  const top = Math.max(1e-9, stages[0]?.value ?? 1);
  const maxV = Math.max(top, ...stages.map((s) => s.value));
  const block = F.text + F.bar + F.bridge;
  const H = n * (F.text + F.bar) + Math.max(0, n - 1) * F.bridge;
  const color = (i: number) => stages[i].color ?? `var(--chart-funnel-${Math.min(i, RAMP - 1) + 1})`;
  const w = (i: number) => clamp((width * Math.max(0, stages[i].value)) / maxV, 28, width);
  const bx = (i: number) => (width - w(i)) / 2;
  const pct = (i: number) => (stages[i].value / top) * 100;
  const drop = (i: number) => (stages[i].value > 0 ? (1 - stages[i + 1].value / stages[i].value) * 100 : 0);

  const bridge = (i: number) => {
    const yb = i * block + F.text + F.bar;
    const l1 = bx(i), r1 = l1 + w(i), l2 = bx(i + 1), r2 = l2 + w(i + 1);
    const m = F.bridge / 2;
    return `M${l1} ${yb}L${r1} ${yb}C${r1} ${yb + m} ${r2} ${yb + m} ${r2} ${yb + F.bridge}L${l2} ${yb + F.bridge}C${l2} ${yb + m} ${l1} ${yb + m} ${l1} ${yb}Z`;
  };

  const summary = useMemo(() => {
    if (n < 2) return null;
    let worst = 0;
    for (let i = 0; i < n - 1; i++) if (drop(i) > drop(worst)) worst = i;
    return { conv: pct(n - 1), worst, dropPct: drop(worst) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stages]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") setActive((a) => clamp((a ?? -1) + 1, 0, n - 1));
    else if (e.key === "ArrowUp") setActive((a) => clamp((a ?? n) - 1, 0, n - 1));
    else if (e.key === "Escape") setActive(null);
    else return;
    e.preventDefault();
  };

  if (!n) return <p className={`py-10 text-center text-sm ${MUTED}`}>{emptyText}</p>;
  // ioiti-ui: the bars move without overshoot (springGentle), and arrive as what arrives does (easeSoft).
  const spring = reduce ? { duration: 0 } : motionTransitions.springGentle;
  const cur = active !== null ? stages[active] : null;

  return (
    // ioiti-ui: as wide as its container, never as what it drew (contain-inline-size, see useElementWidth).
    <div ref={rootRef} className={cx("w-full contain-inline-size", className)}>
      {showSummary && summary && (
        <div className="mb-4 flex flex-wrap items-baseline gap-x-5 gap-y-1">
          <p className="text-sm text-foreground">
            <span className="text-[22px] font-semibold tracking-[-0.03em] tabular-nums">{pctText(summary.conv)}</span>{" "}
            <span className={MUTED}>{summaryLabel}</span>
          </p>
          {/* ioiti-ui: the loss named by the caller, in the negative colour of theme.css (rose-500 is 3.7:1 on white);
              the words of the interface's language, the share signed as its locale writes it. */}
          <p className={`text-xs ${MUTED}`}>
            {words.biggestDrop}{" "}
            {stages[summary.worst].dropLabel ?? `${stages[summary.worst].label} → ${stages[summary.worst + 1].label}`}{" "}
            <span className="tabular-nums text-negative">{pctText(-summary.dropPct)}</span>
          </p>
        </div>
      )}

      <div ref={wrapRef} className="relative" style={{ height: H }}>
        <svg
          width={width}
          height={H}
          role="img"
          // ioiti-ui: the interface's language, its stages counted as it counts them ("1 stage").
          aria-label={name ?? words.funnelChartName({ count: n, first: stages[0].label, last: stages[n - 1].label })}
          tabIndex={0}
          onKeyDown={onKey}
          onBlur={() => setActive(null)}
          // ioiti-ui: the global focus ring (EasyUI's outline-none and its own ring are gone).
          className="block touch-pan-y overflow-visible rounded-lg"
        >
          <defs>
            {stages.slice(0, -1).map((_, i) => (
              <linearGradient key={i} id={`fg-${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" style={{ stopColor: color(i), stopOpacity: 0.34 }} />
                <stop offset="1" style={{ stopColor: color(i + 1), stopOpacity: 0.08 }} />
              </linearGradient>
            ))}
          </defs>

          {/* bridges: the "lost" users between two stages */}
          {stages.slice(0, -1).map((_, i) => (
            <motion.path
              key={i}
              fill={`url(#fg-${i})`}
              initial={anim ? { opacity: 0, d: bridge(i) } : false}
              animate={{ opacity: active === null ? 1 : active === i ? 1 : 0.35, d: bridge(i) }}
              transition={anim ? { opacity: { ...motionTransitions.easeSoft, delay: 0.3 + i * 0.1 }, d: spring } : { d: spring, opacity: motionTransitions.easeFast }}
            />
          ))}

          {stages.map((s, i) => {
            const y = i * block;
            const dim = active !== null && active !== i;
            return (
              <g key={i} className="transition-opacity" style={{ opacity: dim ? 0.5 : 1 }}>
                <text x={0} y={y + 14} className={cx("text-xs", active === i ? "fill-foreground" : "fill-muted-foreground")}>
                  {s.label}
                </text>
                <text x={width} y={y + 14} textAnchor="end" className="fill-foreground text-xs tabular-nums">
                  {formatValue(s.value)}
                  {width >= 300 && <tspan className="fill-muted-foreground"> · {pctText(pct(i))}</tspan>}
                </text>
                <motion.rect
                  y={y + F.text}
                  height={F.bar}
                  rx={9}
                  fill={color(i)}
                  initial={anim ? { x: width / 2, width: 0 } : false}
                  animate={{ x: bx(i), width: w(i) }}
                  transition={anim ? { ...motionTransitions.easeSoft, delay: i * 0.09 } : spring}
                />
              </g>
            );
          })}

          {/* drop-off chips */}
          {stages.slice(0, -1).map((_, i) => {
            const yc = i * block + F.text + F.bar + F.bridge / 2;
            const hot = active === i;
            return (
              <motion.g
                key={i}
                initial={anim ? { opacity: 0 } : false}
                animate={{ opacity: active === null || hot ? 1 : 0.4 }}
                transition={{ ...motionTransitions.easeSoft, delay: anim && active === null ? 0.6 + i * 0.1 : 0 }}
              >
                <rect
                  x={width / 2 - 28}
                  y={yc - 10}
                  width={56}
                  height={20}
                  rx={10}
                  className={cx("fill-surface", hot ? "stroke-negative/30" : "stroke-border")}
                />
                <text
                  x={width / 2}
                  y={yc}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className={cx("text-[11px] tabular-nums", hot ? "fill-negative" : "fill-muted-foreground")}
                >
                  {/* ioiti-ui: nothing lost is "0%", not "−0.0%"; a loss signed as the interface's locale writes
                      it. */}
                  {drop(i) === 0 ? chartFormat.share(0) : pctText(-drop(i))}
                </text>
              </motion.g>
            );
          })}

          {/* hit areas */}
          {stages.map((_, i) => (
            <rect
              key={i}
              x={0}
              y={i * block}
              width={width}
              height={i === n - 1 ? F.text + F.bar : block}
              fill="transparent"
              onPointerEnter={() => setActive(i)}
              onPointerDown={() => setActive(i)}
              onPointerLeave={(e) => e.pointerType === "mouse" && setActive(null)}
            />
          ))}
        </svg>

        <Tooltip
          pos={active === null ? null : { x: width / 2, y: active * block + F.text }}
          boundsWidth={width}
        >
          {cur && active !== null && (
            <>
              <p className="mb-1 font-medium text-foreground">{cur.label}</p>
              <p className="flex justify-between gap-4">
                <span className={MUTED}>{noun}</span>
                <span className="tabular-nums text-foreground">{formatValue(cur.value)}</span>
              </p>
              <p className="flex justify-between gap-4">
                {/* ioiti-ui: the interface's language, here and below. */}
                <span className={MUTED}>{words.shareOfFirstStage}</span>
                <span className="tabular-nums text-foreground">{pctText(pct(active))}</span>
              </p>
              {active < n - 1 && (
                <p className="mt-1.5 flex justify-between gap-4 border-t border-border pt-1.5">
                  <span className={MUTED}>{cur.dropLabel ?? words.lossToNextStage}</span>
                  <span className="tabular-nums text-negative">
                    {/* ioiti-ui: the amount lost as the application's format writes it, after a true minus: a
                        format of its own may write none. */}
                    {drop(active) === 0 ? words.noLoss : `−${formatValue(cur.value - stages[active + 1].value)} (${pctText(drop(active))})`}
                  </span>
                </p>
              )}
            </>
          )}
        </Tooltip>
      </div>

      {/* ioiti-ui: the table in a box of its own: a table is never narrower than its rows, and one made 1 px
          wide (sr-only) stood as wide as its text, beyond the page, which then scrolled sideways onto nothing. */}
      <div className="sr-only">
        <table>
          {/* ioiti-ui: its caption and heads in the interface's language. */}
          <caption>{name ?? words.funnelTableCaption}</caption>
          <thead>
            <tr>
              <th scope="col">{words.stageColumn}</th>
              <th scope="col">{noun}</th>
              <th scope="col">{words.firstStageShareColumn}</th>
            </tr>
          </thead>
          <tbody>
            {stages.map((s, i) => (
              <tr key={i}>
                <th scope="row">{s.label}</th>
                <td>{formatValue(s.value)}</td>
                <td>{pctText(pct(i))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
