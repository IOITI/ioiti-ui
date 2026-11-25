"use client";

import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { motion, useReducedMotionConfig } from "framer-motion";
import {
  Tooltip,
  clamp,
  cx,
  useDismissOutside,
  useElementWidth,
} from "../../lib/chart-primitives.js";
import type { HourCycle, WeekDay } from "../../lib/locale.js";
import { motionTransitions } from "../../lib/motion-tokens.js";
import { useLocale, useMessages } from "../locale-context.js";

export interface HeatDay {
  /** "YYYY-MM-DD" or a Date */
  date: string | Date;
  value: number;
  /** ioiti-ui: a line under the value in the cell's tooltip (what it is made of). */
  detail?: string;
}

/** ioiti-ui: signed values, gains on one side and losses on the other, each in steps of size (smallest first). */
export interface DivergingColors {
  positive: string[];
  negative: string[];
}

export interface ActivityHeatmapProps {
  /** calendar: one cell per day (GitHub style) · hours: weekday × hour grid */
  mode?: "calendar" | "hours";
  /** calendar mode */
  data?: HeatDay[];
  /** hours mode: a row per row label × a column per hour. ioiti-ui: null for a cell with nothing. */
  matrix?: (number | null)[][];
  /**
   * hours mode row names (default Mon…Sun). ioiti-ui: as many rows as names; by default the days Monday first, as the
   * provider's locale names them.
   */
  rowLabels?: string[];
  /** ioiti-ui: hours mode, the hours shown as columns (default 0 to 23). */
  hours?: number[];
  /** ioiti-ui: hours mode, a line under each cell's value in its tooltip. */
  details?: (string | null | undefined)[][];
  /** Most weeks to show. Narrow screens automatically show fewer (default 53) */
  weeks?: number;
  /** Last day shown (default: latest date in data) */
  endDate?: string | Date;
  /** ioiti-ui: calendar mode, no day drawn before it (the start of a period). */
  startDate?: string | Date;
  /**
   * 0 = Sunday, 1 = Monday. ioiti-ui: any day (… 6 = Saturday); by default the provider's first day of the week
   * (IoitiProvider: Monday in en-GB), not Sunday.
   */
  weekStart?: WeekDay;
  color?: string;
  /** ioiti-ui: signed values on two scales, in place of `color`. */
  diverging?: DivergingColors;
  /**
   * Plural noun used in the tooltip / summary. ioiti-ui: written after each number as given; by default the provider's
   * word, which counts ("1 contribution", "12 contributions": `heatmap.unit`).
   */
  unit?: string;
  /** ioiti-ui: how a value is written (its unit included), in place of the number and `unit`. */
  format?: (value: number) => string;
  /** ioiti-ui: in place of the total over the grid. */
  summary?: ReactNode;
  /** ioiti-ui: what a cell with nothing says. */
  emptyText?: string;
  /** ioiti-ui: the two ends of the legend (default Less, More, in the provider's words). */
  legend?: [string, string];
  /** Smallest cell size in px before weeks are dropped (default 11) */
  minCell?: number;
  animated?: boolean;
  /** ioiti-ui: the grid's name; by default "Activity heatmap." and its summary, in the provider's words. */
  "aria-label"?: string;
  className?: string;
}

const DAY_MS = 86_400_000;
const toDay = (d: string | Date): number | null => {
  if (d instanceof Date) return isNaN(+d) ? null : Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / DAY_MS);
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(d);
  if (m) return Math.floor(Date.UTC(+m[1], +m[2] - 1, +m[3]) / DAY_MS);
  const p = new Date(d);
  return isNaN(+p) ? null : toDay(p);
};
const weekday = (day: number) => (((day + 4) % 7) + 7) % 7; // 0 = Sunday
const LEVEL_MIX = [0, 28, 52, 76, 100];
const ALL_HOURS = Array.from({ length: 24 }, (_, hour) => hour);
// ioiti-ui: hours mode's rows, Monday first (the data's layout), by Date#getDay's numbers.
const MONDAY_FIRST = [1, 2, 3, 4, 5, 6, 0];

/**
 * ioiti-ui: what the grid writes, in a locale and its clock (EasyUI's English, as en-GB and en-US write it): dates in
 * full ("Wed, 22 Oct 2026"), months, the days of the week (by Date#getDay's numbers), hours, and numbers to a tenth with
 * a true minus, as the package's formats write them (Intl writes a hyphen).
 */
function namesOf(locale: string, hourCycle: HourCycle) {
  const dayFmt = new Intl.DateTimeFormat(locale, { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
  const monthFmt = new Intl.DateTimeFormat(locale, { month: "short", timeZone: "UTC" });
  const shortFmt = new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" });
  const narrowFmt = new Intl.DateTimeFormat(locale, { weekday: "narrow", timeZone: "UTC" });
  const hourFmt = new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit", hourCycle, timeZone: "UTC" });
  const numberFmt = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 });
  // 3 Jan 2021 was a Sunday.
  const week = Array.from({ length: 7 }, (_, d) => new Date(Date.UTC(2021, 0, 3 + d)));
  return {
    day: (day: number) => dayFmt.format(new Date(day * DAY_MS)),
    month: (day: number) => monthFmt.format(new Date(day * DAY_MS)),
    short: week.map((d) => shortFmt.format(d)),
    narrow: week.map((d) => narrowFmt.format(d)),
    hour: (hour: number) => hourFmt.format(Date.UTC(2021, 0, 3, hour)),
    number: (value: number) =>
      numberFmt
        .formatToParts(value)
        .map((part) => (part.type === "minusSign" ? "−" : part.value))
        .join(""),
  };
}

/** ioiti-ui: a value as it is written, to a tenth (half away from zero, as Intl rounds): the count its unit agrees with. */
const asWritten = (value: number) => (Math.sign(value) * Math.round(Math.abs(value) * 10)) / 10;

interface HeatCell {
  c: number;
  r: number;
  v: number;
  title: string;
  /** ioiti-ui: whether the cell has a value (a day or an hour with nothing has none). */
  has: boolean;
  detail?: string;
}

export function ActivityHeatmap({
  mode = "calendar",
  data = [],
  matrix,
  rowLabels: rowLabelsGiven,
  hours: columnHours = ALL_HOURS,
  details,
  weeks = 53,
  endDate,
  startDate,
  weekStart: weekStartGiven,
  // ioiti-ui: the design's series colour (EasyUI's was an emerald, too close to the gain scale).
  color = "var(--chart-series)",
  diverging,
  unit,
  format,
  summary: summaryText,
  emptyText,
  legend,
  minCell = 11,
  animated = true,
  // ioiti-ui: its name as ARIA writes it, where EasyUI's said `ariaLabel`.
  "aria-label": name,
  className = "",
}: ActivityHeatmapProps) {
  const reduce = useReducedMotionConfig();
  const anim = animated && !reduce;
  // ioiti-ui: the provider's locale, first day of the week, clock and words (IoitiProvider) where the props give none.
  const { locale, weekStartsOn, hourCycle } = useLocale();
  const words = useMessages().heatmap;
  const names = useMemo(() => namesOf(locale, hourCycle), [locale, hourCycle]);
  const weekStart = weekStartGiven ?? weekStartsOn;
  const rowLabels = useMemo(() => rowLabelsGiven ?? MONDAY_FIRST.map((d) => names.short[d]), [rowLabelsGiven, names]);
  const [less, more] = legend ?? [words.less, words.more];
  const [rootRef, width] = useElementWidth<HTMLDivElement>(720);
  const [active, setActive] = useState<{ c: number; r: number } | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  useDismissOutside(wrapRef, active !== null, useCallback(() => setActive(null), []));

  const hours = mode === "hours";
  // ioiti-ui: as many rows as names in hours mode (EasyUI's were seven).
  const rows = hours ? rowLabels.length : 7;
  const narrow = width < 440;
  const LW = hours ? (narrow ? 30 : 36) : narrow ? 18 : 30;
  const TOP = 18;
  const gap = hours ? (narrow ? 2 : 3) : 3;
  const innerW = Math.max(40, width - LW);

  // columns that fit
  const cols = hours ? columnHours.length : clamp(Math.min(weeks, Math.floor((innerW + gap) / (minCell + gap))), 4, weeks);
  // ioiti-ui: an hour's cells 64 px wide at most: two hours with values drew two bars across the panel.
  const cw = Math.min(hours ? 64 : Infinity, (innerW - (cols - 1) * gap) / cols);
  const cell = hours ? cw : Math.min(cw, 16);
  const ch = hours ? clamp(cw, 10, 22) : cell;
  const cwEff = hours ? cw : cell;

  // ioiti-ui: the application's unit as it gives it, or the provider's word, which agrees with the count.
  const unitOf = useCallback((v: number) => unit ?? words.unit(asWritten(v)), [unit, words]);
  const write = useCallback((v: number) => (format ? format(v) : `${names.number(v)} ${unitOf(v)}`), [format, names, unitOf]);

  // build cells
  const model = useMemo(() => {
    const out: HeatCell[] = [];
    let first = 0;
    let endDay = 0;
    if (hours) {
      const m = matrix ?? [];
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++) {
          const raw = m[r]?.[c];
          const has = raw !== null && raw !== undefined && Number.isFinite(Number(raw));
          const v = has ? (diverging ? Number(raw) : Math.max(0, Number(raw))) : 0;
          out.push({
            c,
            r,
            v,
            has,
            detail: details?.[r]?.[c] ?? undefined,
            // ioiti-ui: the hour in the locale's clock.
            title: words.hourCell({ day: rowLabels[r] ?? "", hour: names.hour(columnHours[c]) }),
          });
        }
    } else {
      const map = new Map<number, number>();
      const notes = new Map<number, string>();
      let maxDay = -Infinity;
      for (const d of data) {
        const day = toDay(d.date);
        if (day === null) continue;
        const value = Number.isFinite(d.value) ? (diverging ? d.value : Math.max(0, d.value)) : 0;
        map.set(day, (map.get(day) ?? 0) + value);
        if (d.detail) notes.set(day, d.detail);
        maxDay = Math.max(maxDay, day);
      }
      endDay = (endDate ? toDay(endDate) : null) ?? (isFinite(maxDay) ? maxDay : (toDay(new Date()) as number));
      const startDay = startDate ? toDay(startDate) : null;
      const lastColStart = endDay - ((weekday(endDay) - weekStart + 7) % 7);
      first = lastColStart - (cols - 1) * 7;
      for (let c = 0; c < cols; c++)
        for (let r = 0; r < 7; r++) {
          const day = first + c * 7 + r;
          if (day > endDay || (startDay !== null && day < startDay)) continue;
          out.push({ c, r, v: map.get(day) ?? 0, has: map.has(day), detail: notes.get(day), title: names.day(day) });
        }
    }
    // ioiti-ui: the steps are of size, gains and losses together, so that one shade is one size on either side.
    const nz = out.filter((x) => x.v !== 0).map((x) => Math.abs(x.v)).sort((a, b) => a - b);
    const q = (p: number) => nz[Math.min(nz.length - 1, Math.floor(p * nz.length))] ?? 0;
    const t1 = q(0.25), t2 = q(0.5), t3 = q(0.75);
    const level = (v: number) => {
      const size = Math.abs(v);
      return size <= 0 ? 0 : size <= t1 ? 1 : size <= t2 ? 2 : size <= t3 ? 3 : 4;
    };
    const total = out.reduce((s, x) => s + x.v, 0);
    const best = out.reduce<HeatCell | null>((b, x) => (!b || x.v > b.v ? x : b), null);
    const worst = out.reduce<HeatCell | null>((b, x) => (!b || x.v < b.v ? x : b), null);
    return { cells: out, level, total, best, worst, first, endDay, active: nz.length };
  }, [hours, rows, matrix, rowLabels, columnHours, details, data, endDate, startDate, weekStart, cols, diverging, names, words]);

  const byKey = useMemo(() => new Map(model.cells.map((x) => [`${x.c}:${x.r}`, x])), [model.cells]);
  const gx = (c: number) => LW + c * (cwEff + gap);
  const gy = (r: number) => TOP + r * (ch + gap);
  const svgH = TOP + rows * ch + (rows - 1) * gap + 2;

  // month / hour labels
  const topLabels = useMemo(() => {
    const out: { c: number; text: string }[] = [];
    if (hours) {
      // ioiti-ui: every hour when there is room for it (EasyUI labelled every third or sixth of 24).
      const pitch = cwEff + gap;
      const every = pitch >= 20 ? 1 : pitch >= 12 ? 3 : 6;
      for (let c = 0; c < cols; c += every) out.push({ c, text: names.number(columnHours[c]) });
    } else {
      let prev = -1;
      let lastC = -9;
      for (let c = 0; c < cols; c++) {
        const m = new Date((model.first + c * 7) * DAY_MS).getUTCMonth();
        if (m !== prev) {
          if (prev !== -1 && c - lastC >= 3 && c <= cols - 2) {
            out.push({ c, text: names.month(model.first + c * 7) });
            lastC = c;
          } else if (prev === -1 && cols > 6) {
            out.push({ c, text: names.month(model.first + c * 7) });
            lastC = c;
          } else if (prev !== -1 && out.length === 1 && out[0].c === 0 && c <= cols - 2) {
            // ioiti-ui: the first column's month gives way to the next one when that starts within three weeks
            // (a period of 26 July to 23 October was labelled July, its August dropped).
            out[0] = { c, text: names.month(model.first + c * 7) };
            lastC = c;
          }
          prev = m;
        }
      }
    }
    return out;
  }, [hours, cols, cwEff, gap, columnHours, model.first, names]);

  // ioiti-ui: the days as the locale names them, narrow under 440 px (its own narrow names, not a first letter: French
  // writes "lun." and "L"); Monday, Wednesday and Friday in calendar mode, on their rows from the first day of the week.
  const rowNames = hours
    ? rowLabels
        .map((l, r) => ({ r, text: !narrow ? l : rowLabelsGiven ? l.slice(0, 1) : names.narrow[MONDAY_FIRST[r]] }))
        .filter((x) => !narrow || x.r % 2 === 0)
    : [1, 3, 5].map((k) => {
        const r = (k - weekStart + 7) % 7;
        return { r, text: narrow ? names.narrow[k] : names.short[k] };
      });

  const locate = (e: ReactPointerEvent<SVGRectElement>) => {
    // ioiti-ui: the rect's own box starts where the cells do (EasyUI took the labels' room off it again: the cell
    // found was a column and a row off the one under the pointer).
    const box = e.currentTarget.getBoundingClientRect();
    const c = Math.floor((e.clientX - box.left) / (cwEff + gap));
    const r = Math.floor((e.clientY - box.top) / (ch + gap));
    if (c < 0 || r < 0 || c >= cols || r >= rows || !byKey.has(`${c}:${r}`)) return setActive(null);
    setActive({ c, r });
  };
  // ioiti-ui: the keyboard starts on the first cell of the last column there is: a period that starts in the middle
  // of its only week has no Monday, and from a cell that is not drawn the keys led nowhere.
  const start = useMemo(() => {
    for (let r = 0; r < rows; r++) if (byKey.has(`${cols - 1}:${r}`)) return { c: cols - 1, r };
    return { c: cols - 1, r: 0 };
  }, [byKey, cols, rows]);
  const onKey = (e: ReactKeyboardEvent) => {
    const dc = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    const dr = e.key === "ArrowDown" ? 1 : e.key === "ArrowUp" ? -1 : 0;
    if (e.key === "Escape") return setActive(null);
    if (!dc && !dr) return;
    e.preventDefault();
    setActive((a) => {
      const from = a ?? start;
      const next = { c: clamp(from.c + dc, 0, cols - 1), r: clamp(from.r + dr, 0, rows - 1) };
      return byKey.has(`${next.c}:${next.r}`) ? next : from;
    });
  };

  const cur = active ? byKey.get(`${active.c}:${active.r}`) : null;
  const total = model.total;
  // ioiti-ui: in the provider's words, its unit agreeing with the total.
  const totalSaid = { total: names.number(total), unit: unitOf(total) };
  // ioiti-ui: the cells said above the grid: the largest value (a gain on a signed scale) and the largest loss.
  const best = model.best && model.best.v > 0 ? model.best : null;
  const worst = model.worst && model.worst.v < 0 ? model.worst : null;
  const summary =
    summaryText ??
    (hours
      ? words.summaryPerWeek(totalSaid)
      : cols >= 52
        ? words.summaryLastYear(totalSaid)
        : cols >= 8
          ? words.summaryLastMonths({ ...totalSaid, months: Math.round(cols / 4.345) })
          : words.summaryLastWeeks({ ...totalSaid, weeks: cols }));
  const lvlFill = (v: number, l: number): CSSProperties =>
    l === 0
      ? {}
      : diverging
      ? { fill: (v > 0 ? diverging.positive : diverging.negative)[l - 1] }
      : { fill: `color-mix(in srgb, ${color} ${LEVEL_MIX[l]}%, transparent)` };
  // ioiti-ui: what a cell says, in its tooltip and to a screen reader.
  const said = (x: HeatCell) => (x.has ? [write(x.v), x.detail].filter(Boolean).join(", ") : emptyText ?? write(0));

  return (
    // ioiti-ui: as wide as its container, never as what it drew (contain-inline-size, see useElementWidth).
    <div ref={rootRef} className={cx("w-full contain-inline-size", className)}>
      <style
        dangerouslySetInnerHTML={{
          __html:
            "@keyframes cj-cell{from{opacity:0;transform:scale(.4)}to{opacity:1;transform:scale(1)}}" +
            ".cj-cell{transform-box:fill-box;transform-origin:center;animation:cj-cell .55s var(--ease-soft) both;animation-delay:var(--d,0s)}" +
            "@media (prefers-reduced-motion: reduce){.cj-cell{animation:none}}",
        }}
      />

      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="text-sm font-medium tabular-nums text-foreground">{summary}</p>
        {/* ioiti-ui: the best and the worst on a signed scale, each value on one line (a phone broke "−877.16 €" after its
            sign). Small text in the muted colour (4.5:1 in both themes). In the provider's words. */}
        {diverging ? (
          best || worst ? (
            <p className="text-xs text-muted-foreground">
              {best && (
                <Valued say={(value) => words.best({ title: best.title, value })} value={write(best.v)} className="whitespace-nowrap tabular-nums" />
              )}
              {best && worst && " · "}
              {worst && (
                <Valued say={(value) => words.worst({ title: worst.title, value })} value={write(worst.v)} className="whitespace-nowrap tabular-nums" />
              )}
            </p>
          ) : null
        ) : (
          best && (
            <p className="text-xs text-muted-foreground">
              <Valued say={(value) => words.peak({ title: best.title, value })} value={names.number(best.v)} className="tabular-nums" />
            </p>
          )
        )}
      </div>

      <div ref={wrapRef} className="relative" style={{ height: svgH }}>
        {/* ioiti-ui: the global focus ring (EasyUI's own was a white one in the dark). */}
        <svg
          width={width}
          height={svgH}
          role="img"
          aria-label={name ?? words.label(typeof summary === "string" ? summary : "")}
          tabIndex={0}
          onKeyDown={onKey}
          onBlur={() => setActive(null)}
          className="block touch-pan-y overflow-visible rounded-md"
        >
          {topLabels.map((l) => (
            <text key={l.c} x={gx(l.c)} y={11} className="fill-muted-foreground text-[11px]">
              {l.text}
            </text>
          ))}
          {rowNames.map((l) => (
            <text key={l.r} x={0} y={gy(l.r) + ch / 2} dominantBaseline="middle" className="fill-muted-foreground text-[11px]">
              {l.text}
            </text>
          ))}

          {/* crosshair bands (hours mode) */}
          {hours && (
            <>
              <motion.rect
                x={LW - 2}
                width={cols * (cwEff + gap)}
                height={ch + 4}
                rx={5}
                className="fill-surface-hover"
                initial={false}
                animate={{ y: gy(active?.r ?? 0) - 2, opacity: active ? 1 : 0 }}
                transition={reduce ? { duration: 0 } : motionTransitions.easeFast}
              />
              <motion.rect
                y={TOP - 2}
                width={cwEff + 4}
                height={rows * (ch + gap)}
                rx={5}
                className="fill-surface-hover"
                initial={false}
                animate={{ x: gx(active?.c ?? 0) - 2, opacity: active ? 1 : 0 }}
                transition={reduce ? { duration: 0 } : motionTransitions.easeFast}
              />
            </>
          )}

          {model.cells.map((x) => {
            const l = model.level(x.v);
            return (
              <rect
                key={`${x.c}:${x.r}`}
                x={gx(x.c)}
                y={gy(x.r)}
                width={cwEff}
                height={ch}
                rx={Math.min(3, cwEff / 4)}
                className={cx(anim && "cj-cell", l === 0 && "fill-foreground/5")}
                style={{ ...lvlFill(x.v, l), ["--d" as string]: anim ? `${(x.c * 0.012 + x.r * 0.02).toFixed(3)}s` : undefined } as CSSProperties}
              />
            );
          })}

          {/* active ring */}
          <motion.rect
            width={cwEff + 2}
            height={ch + 2}
            rx={Math.min(4, cwEff / 3)}
            fill="none"
            strokeWidth={1.5}
            // ioiti-ui: in the accent, where the theme has one (accent:).
            className="stroke-foreground accent:stroke-brand"
            initial={false}
            animate={{ x: gx(active?.c ?? 0) - 1, y: gy(active?.r ?? 0) - 1, opacity: active ? 1 : 0 }}
            transition={reduce ? { duration: 0 } : motionTransitions.easeFast}
          />

          <rect
            x={LW}
            y={TOP}
            width={cols * (cwEff + gap)}
            height={rows * (ch + gap)}
            fill="transparent"
            onPointerMove={locate}
            onPointerDown={locate}
            onPointerLeave={(e) => e.pointerType === "mouse" && setActive(null)}
          />
        </svg>

        <Tooltip pos={active ? { x: gx(active.c) + cwEff / 2, y: gy(active.r) } : null} boundsWidth={width}>
          {cur && (
            <>
              <p className="font-medium tabular-nums text-foreground">
                {cur.has ? (format ? write(cur.v) : <>{names.number(cur.v)} <span className="font-normal text-muted-foreground">{unitOf(cur.v)}</span></>) : emptyText ?? write(0)}
              </p>
              <p className="mt-0.5 text-muted-foreground">{cur.title}</p>
              {cur.has && cur.detail && <p className="mt-0.5 text-muted-foreground">{cur.detail}</p>}
            </>
          )}
        </Tooltip>
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {cur ? words.status({ title: cur.title, value: said(cur) }) : ""}
      </p>

      <div className="mt-3 flex items-center justify-end gap-2 text-xs text-muted-foreground">
        {less}
        <span className="flex gap-[3px]" aria-hidden>
          {diverging ? (
            // ioiti-ui: the largest losses at the left, nothing in the middle, the largest gains at the right.
            <>
              {[...diverging.negative].reverse().map((fill, i) => (
                <span key={`n${i}`} className="size-[11px] rounded-[3px]" style={{ background: fill }} />
              ))}
              <span className="size-[11px] rounded-[3px] bg-foreground/5" />
              {diverging.positive.map((fill, i) => (
                <span key={`p${i}`} className="size-[11px] rounded-[3px]" style={{ background: fill }} />
              ))}
            </>
          ) : (
            LEVEL_MIX.map((m, i) => (
              <span
                key={i}
                className={cx("size-[11px] rounded-[3px]", i === 0 && "bg-foreground/5")}
                style={i === 0 ? undefined : { background: `color-mix(in srgb, ${color} ${m}%, transparent)` }}
              />
            ))
          )}
        </span>
        {more}
      </div>
    </div>
  );
}

// ioiti-ui: where a word puts the value it is given, found again in what it says.
const MARK = "\u0000";

/**
 * ioiti-ui: a word that says a value ("Best Thu, 22 Oct 2026 · €120.00"), the value in a span of its own wherever its
 * language puts it.
 */
function Valued({ say, value, className }: { say: (value: string) => string; value: string; className: string }) {
  const [before, ...after] = say(MARK).split(MARK);
  return (
    <>
      {before}
      {after.length > 0 && <span className={className}>{value}</span>}
      {after.join(value)}
    </>
  );
}
