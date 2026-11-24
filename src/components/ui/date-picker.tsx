"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays } from "lucide-react";
import { useAnchoredLayer } from "../../lib/anchor.js";
import { fieldBorder, invalidOf } from "../../lib/field-border.js";
import { motionTransitions } from "../../lib/motion-tokens.js";
import { DISABLED, FLOATING } from "../../lib/recipes.js";
import { cn } from "../../lib/utils.js";
import { Calendar, type CalendarOptions, type DateRange } from "./calendar.js";
import { useLocale, useMessages } from "../locale-context.js";

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

// ioiti-ui: in the locale given, the provider's by default (EasyUI's was the browser's).
const fmt = (d: Date, locale: string) => new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(d);

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
  // ioiti-ui: the provider's words (IoitiProvider).
  const words = useMessages().date;
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
        // ioiti-ui: invalid as its Field says, which a screen reader says of it (global in ARIA 1.1, as axe holds it).
        // oxlint-disable-next-line jsx-a11y/role-supports-aria-props -- ARIA 1.2 lists it for fewer roles than readers honour
        aria-invalid={invalid || undefined}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={layer.onTriggerKeyDown}
        className={cn(
          // ioiti-ui: the design's focus ring alone (design.css), not one of its own beside it.
          "flex h-10 w-full cursor-pointer items-center gap-2.5 rounded-lg border bg-surface px-3.5 text-sm outline-none transition-colors",
          DISABLED,
          // ioiti-ui: its border, or the error's (never both); open, in the accent where the theme has one (accent:).
          fieldBorder(invalid),
          open &&
            (invalid
              ? "border-negative hover:border-negative"
              : "border-muted-foreground hover:border-muted-foreground accent:border-brand accent:hover:border-brand")
        )}
      >
        <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
        <span
          className={cn(
            "truncate",
            text ? "text-foreground" : "text-text-subtle"
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
                aria-label={words.pickerDialog}
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
                  "z-50 w-max max-w-[calc(100vw-2rem)] overflow-auto",
                  FLOATING
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
  // ioiti-ui: the provider's word by default.
  /** What its button says while no day is chosen: "Pick a date" by default, in the provider's words (`date.datePlaceholder`). */
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
  placeholder,
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
  // ioiti-ui: the provider's locale and words where the props give none.
  const preferred = useLocale();
  const words = useMessages().date;
  const locale = calendar.locale ?? preferred.locale;

  return (
    <PickerShell
      text={date ? fmt(date, locale) : null}
      placeholder={placeholder ?? words.datePlaceholder}
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
  // ioiti-ui: the provider's word by default.
  /** What its button says while no range is chosen: "Pick a range" by default, in the provider's words (`date.rangePlaceholder`). */
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
  placeholder,
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
  // ioiti-ui: the provider's locale and words where the props give none; the range written as its language writes one.
  const preferred = useLocale();
  const words = useMessages().date;
  const locale = calendar.locale ?? preferred.locale;
  const text = range.from
    ? words.range({ from: fmt(range.from, locale), to: range.to ? fmt(range.to, locale) : undefined })
    : null;

  return (
    <PickerShell
      text={text}
      placeholder={placeholder ?? words.rangePlaceholder}
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
