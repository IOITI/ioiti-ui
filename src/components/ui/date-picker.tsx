"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays } from "lucide-react";
import { useAnchoredLayer } from "../../lib/anchor.js";
import { invalidOf } from "../../lib/field-border.js";
import { motionTransitions } from "../../lib/motion-tokens.js";
import { cn } from "../../lib/utils.js";
import { Calendar, type CalendarOptions, type DateRange } from "./calendar.js";

function useControllableState<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void
): [T, (next: T) => void] {
  const [internal, setInternal] = React.useState<T>(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? (value as T) : internal;

  const onChangeRef = React.useRef(onChange);
  React.useEffect(() => {
    onChangeRef.current = onChange;
  });

  const set = React.useCallback(
    (next: T) => {
      if (!controlled) setInternal(next);
      onChangeRef.current?.(next);
    },
    [controlled]
  );

  return [current, set];
}

type Side = "bottom" | "top";

const fmt = (d: Date, locale?: string) => new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(d);

/** ioiti-ui: what names and describes the trigger, and says it is wrong: a Field's, a label's elsewhere. */
export interface PickerFieldProps {
  /** The trigger's id, for a `<label htmlFor>` (a Field's `htmlFor`). */
  id?: string;
  /** Its name, where no label names it. */
  "aria-label"?: string;
  /** The id of what names it. */
  "aria-labelledby"?: string;
  /** Read out with it: what a Field around it says under it (its description, its error). */
  "aria-describedby"?: string;
  /** Marked invalid, as a Field with an error marks it: drawn as `error`. */
  "aria-invalid"?: boolean | "true" | "false";
  /** The date chosen is wrong (or missing): the trigger's border in the error's colour, and said. */
  error?: boolean;
}

/* ───────────── shell: trigger + animated popover ───────────── */

function PickerShell({
  text,
  placeholder,
  align = "start",
  side: preferredSide = "auto",
  disabled,
  className,
  field,
  children,
}: {
  text: string | null;
  placeholder: string;
  align?: "start" | "end";
  side?: Side | "auto";
  disabled?: boolean;
  className?: string;
  field: PickerFieldProps;
  children: (api: { close: () => void }) => React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const layerRef = React.useRef<HTMLDivElement>(null);
  const timer = React.useRef<number | undefined>(undefined);
  const invalid = invalidOf(field.error, field["aria-invalid"]);

  // ioiti-ui: a layer in document.body, placed beside its trigger and following it (useAnchoredLayer), its keys its
  // own, the focus in it on the day to choose: EasyUI's was placed by hand inside the picker, which a Field's label
  // around it then held, a click on the calendar's empty space opening or closing it again.
  const layer = useAnchoredLayer({
    open,
    onClose: () => setOpen(false),
    triggerRef,
    layerRef,
    side: preferredSide === "top" ? "top" : "bottom",
    align,
    offset: 8,
    initialFocus: () => layerRef.current?.querySelector<HTMLElement>('[data-date][tabindex="0"]') ?? null,
  });

  // brief beat so the selection pill lands before the popover closes
  const close = React.useCallback(() => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      const a = document.activeElement;
      setOpen(false);
      // only hand focus back if it hasn't moved elsewhere in the meantime
      if (!a || a === document.body || layerRef.current?.contains(a)) triggerRef.current?.focus();
    }, 160);
  }, []);
  React.useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <div className={cn("relative inline-block w-64 max-w-full", className)}>
      <button
        ref={triggerRef}
        id={field.id}
        type="button"
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={field["aria-label"]}
        aria-labelledby={field["aria-labelledby"]}
        aria-describedby={field["aria-describedby"]}
        aria-invalid={invalid || undefined}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={layer.onTriggerKeyDown}
        className={cn(
          // ioiti-ui: the design's focus ring alone (design.css), not one of its own beside it.
          "flex h-10 w-full items-center gap-2.5 rounded-lg border bg-white px-3 text-sm outline-none transition-colors disabled:pointer-events-none disabled:opacity-50 dark:bg-neutral-950",
          // ioiti-ui: its border, or the error's (never both); open, in the accent where the theme has one (accent:).
          invalid
            ? "border-negative/60 hover:border-negative"
            : "border-neutral-200 hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700",
          open &&
            (invalid
              ? "border-negative hover:border-negative"
              : "border-neutral-400 hover:border-neutral-400 dark:border-neutral-600 dark:hover:border-neutral-600 accent:border-brand accent:hover:border-brand")
        )}
      >
        <CalendarDays className="size-4 shrink-0 text-neutral-500 dark:text-neutral-400" />
        <span
          className={cn(
            "truncate",
            text ? "text-neutral-900 dark:text-neutral-100" : "text-neutral-500"
          )}
        >
          {text ?? placeholder}
        </span>
      </button>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                ref={layerRef}
                role="dialog"
                aria-label="Choose date"
                onKeyDown={layer.onLayerKeyDown}
                // A click on its empty space keeps the focus in it, and its keys (Escape) with it.
                tabIndex={-1}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                // ioiti-ui: the motion of everything that floats: springSnappy arriving, easeExit leaving.
                exit={{ opacity: 0, scale: 0.97, transition: motionTransitions.easeExit }}
                transition={motionTransitions.springSnappy}
                style={{
                  ...layer.style,
                  transformOrigin: `${layer.side === "top" ? "bottom" : "top"} ${align === "end" ? "right" : "left"}`,
                }}
                className={cn(
                  // ioiti-ui: glass under the glass material (glass-float).
                  "z-50 w-max max-w-[calc(100vw-2rem)] overflow-auto rounded-xl border border-neutral-200 bg-white shadow-lg shadow-neutral-900/5 dark:border-neutral-800 dark:bg-neutral-950 dark:shadow-black/40 glass-float"
                )}
              >
                {children({ close })}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}

/* ───────────── single date ───────────── */

export interface DatePickerProps extends CalendarOptions, PickerFieldProps {
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  align?: "start" | "end";
  side?: Side | "auto";
  disabled?: boolean;
  className?: string;
}

export function DatePicker({
  value,
  defaultValue = null,
  onChange,
  placeholder = "Pick a date",
  align,
  side,
  disabled,
  className,
  id,
  "aria-label": ariaLabel,
  "aria-labelledby": labelledBy,
  "aria-describedby": describedBy,
  "aria-invalid": ariaInvalid,
  error,
  ...calendar
}: DatePickerProps) {
  const field = { id, "aria-label": ariaLabel, "aria-labelledby": labelledBy, "aria-describedby": describedBy, "aria-invalid": ariaInvalid, error };
  const [date, setDate] = useControllableState<Date | null>(value, defaultValue, onChange);

  return (
    <PickerShell
      text={date ? fmt(date, calendar.locale) : null}
      placeholder={placeholder}
      align={align}
      side={side}
      disabled={disabled}
      className={className}
      field={field}
    >
      {({ close }) => (
        <Calendar
          mode="single"
          value={date}
          onChange={(d) => {
            setDate(d);
            close();
          }}
          {...calendar}
        />
      )}
    </PickerShell>
  );
}

/* ───────────── date range ───────────── */

export interface DateRangePickerProps extends CalendarOptions, PickerFieldProps {
  value?: DateRange;
  defaultValue?: DateRange;
  onChange?: (range: DateRange) => void;
  placeholder?: string;
  align?: "start" | "end";
  side?: Side | "auto";
  disabled?: boolean;
  className?: string;
}

export function DateRangePicker({
  value,
  defaultValue = { from: null, to: null },
  onChange,
  placeholder = "Pick a range",
  align,
  side,
  disabled,
  className,
  id,
  "aria-label": ariaLabel,
  "aria-labelledby": labelledBy,
  "aria-describedby": describedBy,
  "aria-invalid": ariaInvalid,
  error,
  ...calendar
}: DateRangePickerProps) {
  const field = { id, "aria-label": ariaLabel, "aria-labelledby": labelledBy, "aria-describedby": describedBy, "aria-invalid": ariaInvalid, error };
  const [range, setRange] = useControllableState<DateRange>(value, defaultValue, onChange);
  const text = range.from
    ? `${fmt(range.from, calendar.locale)} – ${range.to ? fmt(range.to, calendar.locale) : "…"}`
    : null;

  return (
    <PickerShell
      text={text}
      placeholder={placeholder}
      align={align}
      side={side}
      disabled={disabled}
      className={cn("w-72", className)}
      field={field}
    >
      {({ close }) => (
        <Calendar
          mode="range"
          value={range}
          onChange={(r) => {
            setRange(r);
            if (r.from && r.to) close();
          }}
          {...calendar}
        />
      )}
    </PickerShell>
  );
}
