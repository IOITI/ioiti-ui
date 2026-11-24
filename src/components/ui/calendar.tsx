"use client";

import * as React from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
// ioiti-ui: held by its caller or by itself, as every control (useControllableState): its own copy is gone.
import { useControllableState } from "../../lib/controllable.js";
import { motionTransitions } from "../../lib/motion-tokens.js";
import { PRESSABLE } from "../../lib/recipes.js";
import { cn } from "../../lib/utils.js";
import type { WeekDay } from "../../lib/locale.js";
import { useLocale, useMessages } from "../locale-context.js";

// ioiti-ui: the design's spring for what moves within a layer (springSnappy), not one written here.
const spring = motionTransitions.springSnappy;

const slide: Variants = {
  enter: (d: number) => ({ x: d * 24, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: d * -24, opacity: 0 }),
};

export type DateRange = { from: Date | null; to: Date | null };

interface CalendarBase {
  defaultMonth?: Date;
  minDate?: Date;
  maxDate?: Date;
  isDateDisabled?: (date: Date) => boolean;
  // ioiti-ui: any day a locale's weeks start on (0 Sunday … 6 Saturday), not only Sunday or Monday; by default the
  // provider's (IoitiProvider), not Sunday.
  /** The day the weeks start on (0 Sunday, 1 Monday … 6 Saturday): IoitiProvider's by default, its locale's (Monday in en-GB). */
  weekStartsOn?: WeekDay;
  // ioiti-ui: the provider's locale by default, not the browser's.
  /** The locale its month and days are written in (a picker's button too): IoitiProvider's by default (en-GB outside one). */
  locale?: string;
  className?: string;
}
export type CalendarOptions = Omit<CalendarBase, "className">;

export interface CalendarSingleProps extends CalendarBase {
  mode?: "single";
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (date: Date | null) => void;
}
export interface CalendarRangeProps extends CalendarBase {
  mode: "range";
  value?: DateRange;
  defaultValue?: DateRange;
  onChange?: (range: DateRange) => void;
}
export type CalendarProps = CalendarSingleProps | CalendarRangeProps;

/* ── date helpers (no dependencies) ── */
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const addMonths = (d: Date, n: number) => {
  const first = new Date(d.getFullYear(), d.getMonth() + n, 1);
  const last = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  return new Date(first.getFullYear(), first.getMonth(), Math.min(d.getDate(), last));
};
const isSameDay = (a?: Date | null, b?: Date | null) =>
  !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const isSameMonth = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

const EMPTY: DateRange = { from: null, to: null };
const toRange = (v: Date | null | DateRange | undefined): DateRange | undefined =>
  v === undefined ? undefined : v === null ? EMPTY : v instanceof Date ? { from: v, to: null } : v;

export function Calendar(props: CalendarProps) {
  const { defaultMonth, minDate, maxDate, isDateDisabled, className } = props;
  // ioiti-ui: the provider's locale, first day of the week and words (IoitiProvider) where the props give none:
  // EasyUI's weeks started on Sunday, its names were the browser's and its words English.
  const preferred = useLocale();
  const words = useMessages().date;
  const locale = props.locale ?? preferred.locale;
  const weekStartsOn = props.weekStartsOn ?? preferred.weekStartsOn;
  const isRange = props.mode === "range";
  const uid = React.useId();

  const [selected, setSelected] = useControllableState<DateRange>(
    toRange(props.value),
    toRange(props.defaultValue) ?? EMPTY,
    (next) => {
      if (props.mode === "range") props.onChange?.(next);
      else props.onChange?.(next.from);
    }
  );
  const { from, to } = selected;

  const today = React.useMemo(() => startOfDay(new Date()), []);
  const [view, setView] = React.useState(() => {
    const base = defaultMonth ?? from ?? today;
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });
  const [dir, setDir] = React.useState(1);
  const [focus, setFocus] = React.useState<Date>(from ?? today);
  const [hover, setHover] = React.useState<Date | null>(null);
  const gridRef = React.useRef<HTMLDivElement>(null);
  const shouldFocus = React.useRef(false);

  const min = minDate ? startOfDay(minDate) : null;
  const max = maxDate ? startOfDay(maxDate) : null;
  const disabled = (d: Date) => (!!min && d < min) || (!!max && d > max) || !!isDateDisabled?.(d);

  const y = view.getFullYear();
  const m = view.getMonth();
  const canPrev = !min || new Date(y, m, 0) >= min;
  const canNext = !max || new Date(y, m + 1, 1) <= max;

  const go = (target: Date, direction?: number) => {
    setDir(direction ?? (target > view ? 1 : -1));
    setView(new Date(target.getFullYear(), target.getMonth(), 1));
  };

  const monthFmt = React.useMemo(() => new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }), [locale]);
  const dayFmt = React.useMemo(() => new Intl.DateTimeFormat(locale, { dateStyle: "full" }), [locale]);
  const weekdays = React.useMemo(() => {
    const f = new Intl.DateTimeFormat(locale, { weekday: "narrow" });
    // 1 Aug 2021 is a Sunday
    return Array.from({ length: 7 }, (_, i) => f.format(new Date(2021, 7, 1 + ((weekStartsOn + i) % 7))));
  }, [locale, weekStartsOn]);

  const dim = new Date(y, m + 1, 0).getDate();
  const offset = (new Date(y, m, 1).getDay() - weekStartsOn + 7) % 7;
  const cells = Array.from({ length: 42 }, (_, i) => {
    const n = i - offset + 1;
    return n < 1 || n > dim ? null : new Date(y, m, n);
  });
  const tabDate = isSameMonth(focus, view) ? focus : new Date(y, m, 1);

  const pick = (d: Date) => {
    if (disabled(d)) return;
    setFocus(d);
    if (!isRange) setSelected({ from: d, to: null });
    else if (!from || to || d < from) setSelected({ from: d, to: null });
    else setSelected({ from, to: d });
  };

  const rangeEnd = isRange && from ? (to ?? (hover && hover > from ? hover : null)) : null;

  const onKeyDown = (e: React.KeyboardEvent) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>("[data-date]");
    if (!el) return;
    const [yy, mm, dd] = el.dataset.date!.split("-").map(Number);
    const cur = new Date(yy, mm - 1, dd);
    const col = (cur.getDay() - weekStartsOn + 7) % 7;
    let next: Date | null = null;
    if (e.key === "ArrowLeft") next = addDays(cur, -1);
    else if (e.key === "ArrowRight") next = addDays(cur, 1);
    else if (e.key === "ArrowUp") next = addDays(cur, -7);
    else if (e.key === "ArrowDown") next = addDays(cur, 7);
    else if (e.key === "Home") next = addDays(cur, -col);
    else if (e.key === "End") next = addDays(cur, 6 - col);
    else if (e.key === "PageUp") next = addMonths(cur, e.shiftKey ? -12 : -1);
    else if (e.key === "PageDown") next = addMonths(cur, e.shiftKey ? 12 : 1);
    if (!next) return;
    e.preventDefault();
    if (min && next < min) next = min;
    if (max && next > max) next = max;
    shouldFocus.current = true;
    setFocus(next);
    if (!isSameMonth(next, view)) go(next);
  };

  React.useEffect(() => {
    if (!shouldFocus.current) return;
    shouldFocus.current = false;
    gridRef.current?.querySelector<HTMLElement>(`[data-date="${dayKey(focus)}"]`)?.focus();
  }, [focus, view]);

  return (
    <div className={cn("w-fit select-none p-3", className)}>
      {/* header */}
      <div className="mb-2 flex h-8 items-center gap-1">
        {/* ioiti-ui: its buttons named in the provider's words. */}
        <NavButton label={words.previousMonth} disabled={!canPrev} onClick={() => go(addMonths(view, -1), -1)}>
          <ChevronLeft className="size-4" />
        </NavButton>
        <div className="relative h-5 flex-1 overflow-hidden text-center text-sm font-medium text-foreground">
          <AnimatePresence initial={false} custom={dir}>
            <motion.span
              key={y * 12 + m}
              custom={dir}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={spring}
              aria-live="polite"
              className="absolute inset-0"
            >
              {monthFmt.format(view)}
            </motion.span>
          </AnimatePresence>
        </div>
        <NavButton label={words.nextMonth} disabled={!canNext} onClick={() => go(addMonths(view, 1), 1)}>
          <ChevronRight className="size-4" />
        </NavButton>
      </div>

      {/* weekdays */}
      <div className="flex" aria-hidden>
        {weekdays.map((w, i) => (
          <div key={i} className="grid h-8 w-9 place-items-center text-xs text-muted-foreground">
            {w}
          </div>
        ))}
      </div>

      {/* days */}
      <div className="-m-1 overflow-hidden p-1">
        <div
          ref={gridRef}
          role="grid"
          aria-label={monthFmt.format(view)}
          onKeyDown={onKeyDown}
          onMouseLeave={() => setHover(null)}
          className="relative h-[216px]"
        >
          <AnimatePresence initial={false} custom={dir}>
            <motion.div
              key={y * 12 + m}
              custom={dir}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={spring}
              className="absolute inset-0"
            >
              {Array.from({ length: 6 }, (_, r) => (
                <div key={r} role="row" className="flex">
                  {cells.slice(r * 7, r * 7 + 7).map((d, col) => {
                    if (!d) return <div key={col} role="gridcell" className="h-9 w-9" />;

                    const isStart = isSameDay(d, from);
                    const isEnd = !isStart && isRange && isSameDay(d, to);
                    const picked = isStart || isEnd;
                    const inBand =
                      isRange && !!from && !!rangeEnd && !isSameDay(from, rangeEnd) && d >= from && d <= rangeEnd;
                    const off = disabled(d);
                    const isToday = isSameDay(d, today);

                    return (
                      <div
                        key={col}
                        role="gridcell"
                        aria-selected={picked || inBand}
                        className={cn(
                          "relative h-9 w-9",
                          // ioiti-ui: the range, the day picked and today in the accent, where the theme has one (accent:).
                          inBand && "bg-surface-hover accent:bg-brand-soft",
                          inBand && (isSameDay(d, from) || col === 0 || d.getDate() === 1) && "rounded-l-lg",
                          inBand && (isSameDay(d, rangeEnd) || col === 6 || d.getDate() === dim) && "rounded-r-lg"
                        )}
                      >
                        <button
                          type="button"
                          data-date={dayKey(d)}
                          tabIndex={isSameDay(d, tabDate) ? 0 : -1}
                          aria-label={dayFmt.format(d)}
                          aria-disabled={off || undefined}
                          aria-current={isToday ? "date" : undefined}
                          onClick={() => pick(d)}
                          onMouseEnter={() => setHover(d)}
                          className={cn(
                            // ioiti-ui: the design's focus ring alone (design.css), not one of its own beside it.
                            "relative grid size-9 cursor-pointer place-items-center rounded-lg text-sm tabular-nums outline-none transition-colors",
                            picked ? "text-primary-foreground accent:text-brand-foreground" : "text-foreground",
                            !picked && !off && (inBand ? "hover:bg-current/10" : "hover:bg-surface-hover"),
                            "aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
                          )}
                        >
                          {picked && (
                            <motion.span
                              layoutId={isRange ? `${uid}-${isStart ? "start" : "end"}` : `${uid}-sel`}
                              transition={spring}
                              className="absolute inset-0 rounded-lg bg-primary accent:bg-brand"
                            />
                          )}
                          {/* ioiti-ui: a day is an option of the grid: it does not give under a press. */}
                          <span className="relative">{d.getDate()}</span>
                          {isToday && !picked && (
                            <span className="absolute bottom-1 size-1 rounded-full bg-muted-foreground accent:bg-brand" />
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function NavButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "grid size-8 place-items-center rounded-lg text-muted-foreground outline-none transition enabled:hover:bg-surface-hover enabled:hover:text-foreground",
        PRESSABLE
      )}
    >
      {children}
    </button>
  );
}
