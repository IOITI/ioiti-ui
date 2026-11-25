"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { useAnchoredLayer } from "../../lib/anchor.js";
// ioiti-ui: held by its caller or by itself, as every control (useControllableState): its own copy is gone.
import { useControllableState } from "../../lib/controllable.js";
// ioiti-ui: a former name said once, in development (deprecated).
import { deprecated } from "../../lib/deprecated.js";
import { fieldBorder, invalidOf } from "../../lib/field-border.js";
import { motionTransitions } from "../../lib/motion-tokens.js";
import { DISABLED, FLOATING, MENU_ROW } from "../../lib/recipes.js";
import { cn } from "../../lib/utils.js";
// ioiti-ui: its words in the provider's language (`select`).
import { useMessages } from "../locale-context.js";
// ioiti-ui: what a Field or a FormItem around it tells it (its id, its label, what describes it, whether it is wrong),
// its `data-*` attributes and its ref, as a native control takes them.
import { dataAttributes, type DataAttributes } from "../../lib/data-attributes.js";
import { useForwardedRef } from "../../lib/refs.js";
import { useFieldControl } from "../field-context.js";

// ioiti-ui: the design's spring for what moves within a layer (springSnappy), not one written here.
const spring = motionTransitions.springSnappy;

export interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  keywords?: string[];
  disabled?: boolean;
}

// ioiti-ui: its `data-*` attributes on its outermost element, as an element takes them.
export interface ComboboxProps extends DataAttributes {
  options: ComboboxOption[];
  value?: string | null;
  defaultValue?: string | null;
  /** ioiti-ui: told of the value chosen, as every control of the package is (`onChange`). */
  onChange?: (value: string | null) => void;
  /** @deprecated Use `onChange`. Removed in 1.0. */
  onValueChange?: (value: string | null) => void;
  /** ioiti-ui: what it says while nothing is chosen; the provider's language's by default ("Select…"). */
  placeholder?: string;
  /** ioiti-ui: its search's placeholder; the provider's language's by default ("Search…"). */
  searchPlaceholder?: string;
  /** ioiti-ui: what its list says when its search finds nothing; the provider's language's by default ("No results."). */
  emptyText?: string;
  align?: "start" | "end";
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
  /** ioiti-ui: the trigger's id, for a `<label htmlFor>`; in a FormItem, the item's. */
  id?: string;
  /** ioiti-ui: the name its value is sent under with a form (a hidden input): the option chosen's, empty while none is. */
  name?: string;
  /** ioiti-ui: the id of what names it (and its search, its list). A Field's label names it without it. */
  "aria-labelledby"?: string;
  /** ioiti-ui: read out with it: what a Field around it says under it (its description, its error). */
  "aria-describedby"?: string;
  /** ioiti-ui: marked invalid, as a Field with an error marks it: drawn as `error`. */
  "aria-invalid"?: boolean | "true" | "false";
  /** ioiti-ui: the choice is wrong (or missing): the trigger's border in the error's colour, and said. */
  error?: boolean;
  /** ioiti-ui: its trigger (the button that shows the value), to focus it. */
  ref?: React.Ref<HTMLButtonElement>;
}

const filterOptions = (options: ComboboxOption[], q: string) =>
  q
    ? options.filter((o) => [o.label, o.description, ...(o.keywords ?? [])].some((s) => s?.toLowerCase().includes(q)))
    : options;

const firstEnabled = (items: ComboboxOption[]) => items.findIndex((o) => !o.disabled);

/** ioiti-ui: the words of the labels that name a control (a Field's htmlFor), its own left out of a label around it. */
function labelWordsOf(control: HTMLButtonElement | null): string | undefined {
  const words = Array.from(control?.labels ?? [], (label) =>
    Array.from(label.childNodes, (node) => (node.contains(control) ? "" : (node.textContent ?? ""))).join(" ")
  )
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  return words || undefined;
}

export function Combobox({
  options,
  value,
  defaultValue = null,
  onChange,
  onValueChange,
  placeholder: givenPlaceholder,
  searchPlaceholder: givenSearchPlaceholder,
  emptyText: givenEmptyText,
  align = "start",
  disabled,
  className,
  "aria-label": ariaLabel,
  id,
  name: formName,
  "aria-labelledby": ownLabelledBy,
  "aria-describedby": ownDescribedBy,
  "aria-invalid": ariaInvalid,
  error,
  ref,
  ...rest
}: ComboboxProps) {
  // ioiti-ui: named, described and marked by a Field or a FormItem around it too, its own props first: by its label's
  // words (aria-labelledby), which name its search and its list as well.
  const control = useFieldControl({
    id,
    labelledBy: ownLabelledBy,
    named: Boolean(ariaLabel),
    describedBy: ownDescribedBy,
    invalid: invalidOf(error, ariaInvalid),
  });
  const labelledBy = control.labelledBy;
  // ioiti-ui: its words in the provider's language, its own props given over them.
  const words = useMessages().select;
  const placeholder = givenPlaceholder ?? words.placeholder;
  const searchPlaceholder = givenSearchPlaceholder ?? words.search;
  const emptyText = givenEmptyText ?? words.noResults;
  // ioiti-ui: `onChange`, as every control; `onValueChange`, its former name, still told where it alone is given.
  if (onValueChange !== undefined) deprecated("combobox-on-value-change", "Combobox");
  const [selected, setSelected] = useControllableState<string | null>(value, defaultValue, onChange ?? onValueChange);
  const [open, setOpen] = React.useState(false);
  // ioiti-ui: its trigger given to its caller's ref too.
  const [triggerRef, setTrigger] = useForwardedRef<HTMLButtonElement>(ref);
  const layerRef = React.useRef<HTMLDivElement>(null);
  const listId = React.useId();
  const invalid = control.invalid;

  // ioiti-ui: a layer in document.body, placed beside its trigger and following it (useAnchoredLayer), its keys its
  // own: EasyUI's was placed by hand inside the combobox, cut by a parent that hides what overflows it.
  const layer = useAnchoredLayer({
    open,
    onClose: () => setOpen(false),
    triggerRef,
    layerRef,
    align,
    offset: 8,
    initialFocus: () => layerRef.current?.querySelector<HTMLElement>("input") ?? null,
  });
  // The list as wide as the trigger at least, read as it opens.
  const [width, setWidth] = React.useState<number>();
  // ioiti-ui: and the words of its label (a Field's htmlFor), which name its search and its list too: read once drawn
  // (named as the search takes the focus), and again as it opens.
  const [labelWords, setLabelWords] = React.useState<string>();
  React.useLayoutEffect(() => {
    setLabelWords(labelWordsOf(triggerRef.current));
    if (open) setWidth(triggerRef.current?.offsetWidth);
  }, [open]);
  // ioiti-ui: its search and its list named as the trigger is (by what it points to, its aria-label or its label's
  // words): they had a placeholder, and no name.
  const name = labelledBy ? { "aria-labelledby": labelledBy } : { "aria-label": ariaLabel ?? labelWords };

  const current = options.find((o) => o.value === selected);

  return (
    // ioiti-ui: its `data-*` attributes on its outermost element.
    <div {...dataAttributes(rest)} className={cn("relative w-64", className)}>
      <button
        ref={setTrigger}
        id={control.id}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        // ioiti-ui: named by its label when it has one (a wrapping <label>, or htmlFor), not by its placeholder.
        aria-label={ariaLabel}
        aria-labelledby={labelledBy}
        aria-describedby={control.describedBy}
        aria-invalid={invalid || undefined}
        aria-controls={open ? listId : undefined}
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            setOpen(true);
          } else layer.onTriggerKeyDown(e);
        }}
        className={cn(
          "flex h-10 w-full cursor-pointer items-center gap-2.5 rounded-lg border bg-surface px-3.5 text-sm outline-none transition-colors",
          DISABLED,
          // ioiti-ui: its border, or the error's (never both); open, the option under the pointer and the one chosen in
          // the accent, where the theme has one (accent:).
          fieldBorder(invalid),
          open &&
            (invalid
              ? "border-negative hover:border-negative"
              : "border-muted-foreground hover:border-muted-foreground accent:border-brand accent:hover:border-brand")
        )}
      >
        {current?.icon && (
          <span className="grid size-4 shrink-0 place-items-center text-muted-foreground [&>svg]:size-4">
            {current.icon}
          </span>
        )}
        <span
          className={cn(
            "flex-1 truncate text-left",
            current ? "text-foreground" : "text-text-subtle"
          )}
        >
          {current?.label ?? placeholder}
        </span>
        <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
      </button>
      {/* ioiti-ui: the value, sent with the form around it under `name`. */}
      {formName && <input type="hidden" name={formName} value={selected ?? ""} disabled={disabled} />}

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                ref={layerRef}
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
                  minWidth: width,
                  transformOrigin: `${layer.side === "top" ? "bottom" : "top"} ${align === "end" ? "right" : "left"}`,
                }}
                className={cn(
                  // ioiti-ui: glass under the glass material (glass-float).
                  "z-50 min-w-[14rem] overflow-hidden",
                  FLOATING
                )}
              >
                <Panel
                  id={listId}
                  name={name}
                  options={options}
                  selected={selected}
                  searchPlaceholder={searchPlaceholder}
                  emptyText={emptyText}
                  onSelect={(v) => {
                    setSelected(v);
                    setOpen(false);
                    triggerRef.current?.focus();
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}

/* mounted only while open, so its state resets every time */
function Panel({
  id,
  name,
  options,
  selected,
  searchPlaceholder,
  emptyText,
  onSelect,
}: {
  id: string;
  // ioiti-ui: what names its search and its list (the trigger's name).
  name: { "aria-label"?: string; "aria-labelledby"?: string };
  options: ComboboxOption[];
  selected: string | null;
  searchPlaceholder: string;
  emptyText: string;
  onSelect: (value: string) => void;
}) {
  const [query, setQuery] = React.useState("");
  const q = query.trim().toLowerCase();
  const items = React.useMemo(() => filterOptions(options, q), [options, q]);
  const [active, setActive] = React.useState(() => {
    const i = options.findIndex((o) => o.value === selected);
    return i >= 0 ? i : firstEnabled(options);
  });
  const [box, setBox] = React.useState<{ y: number; h: number } | null>(null);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const itemRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const byKeyboard = React.useRef(false);

  React.useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  // one highlight that glides to the active row (measured, so it survives scrolling)
  React.useLayoutEffect(() => {
    const el = itemRefs.current[active];
    const scroller = scrollRef.current;
    if (!el || !scroller) {
      setBox(null);
      return;
    }
    setBox({ y: el.offsetTop, h: el.offsetHeight });
    if (byKeyboard.current) {
      byKeyboard.current = false;
      if (el.offsetTop < scroller.scrollTop) scroller.scrollTop = el.offsetTop - 4;
      else if (el.offsetTop + el.offsetHeight > scroller.scrollTop + scroller.clientHeight)
        scroller.scrollTop = el.offsetTop + el.offsetHeight - scroller.clientHeight + 4;
    }
  }, [active, items]);

  const move = (dir: 1 | -1) => {
    if (!items.length) return;
    let i = active;
    for (let n = 0; n < items.length; n++) {
      i = (i + dir + items.length) % items.length;
      if (!items[i].disabled) {
        byKeyboard.current = true;
        setActive(i);
        return;
      }
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      move(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      move(-1);
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      const list = e.key === "Home" ? items : [...items].reverse();
      const idx = firstEnabled(list);
      if (idx >= 0) {
        byKeyboard.current = true;
        setActive(e.key === "Home" ? idx : items.length - 1 - idx);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      const o = items[active];
      if (o && !o.disabled) onSelect(o.value);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 border-b border-border px-3">
        <Search className="size-4 shrink-0 text-muted-foreground" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            const v = e.target.value;
            setQuery(v);
            setActive(firstEnabled(filterOptions(options, v.trim().toLowerCase())));
          }}
          onKeyDown={onKeyDown}
          placeholder={searchPlaceholder}
          role="combobox"
          // ioiti-ui: named as the trigger is, not by its placeholder alone.
          {...name}
          aria-expanded
          aria-controls={id}
          aria-autocomplete="list"
          aria-activedescendant={items[active] ? `${id}-${active}` : undefined}
          className="h-10 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-text-subtle"
        />
      </div>

      <div ref={scrollRef} className="max-h-64 overflow-y-auto overscroll-contain">
        {/* ioiti-ui: named as the trigger is; options alone in it, its padding theirs. */}
        <div id={id} role="listbox" {...name} className={cn("relative", items.length > 0 && "p-1")}>
          {box && items.length > 0 && (
            <motion.div
              aria-hidden
              initial={false}
              animate={{ y: box.y, height: box.h }}
              transition={spring}
              className="pointer-events-none absolute inset-x-1 top-0 rounded-lg bg-surface-hover accent:bg-brand-soft"
            />
          )}

          {items.map((o, i) => (
            <div
              key={o.value}
              id={`${id}-${i}`}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              role="option"
              aria-selected={o.value === selected}
              aria-disabled={o.disabled || undefined}
              onMouseMove={() => !o.disabled && active !== i && setActive(i)}
              onClick={() => !o.disabled && onSelect(o.value)}
              className={cn(MENU_ROW, "relative", o.disabled && "cursor-not-allowed opacity-50")}
            >
              {o.icon && (
                <span className="relative grid size-4 shrink-0 place-items-center [&>svg]:size-4">{o.icon}</span>
              )}
              <span className="relative min-w-0 flex-1">
                <span className="block truncate">
                  <Highlight text={o.label} query={q} />
                </span>
                {o.description && (
                  <span className="block truncate text-xs text-muted-foreground">
                    {o.description}
                  </span>
                )}
              </span>
              {o.value === selected && (
                <motion.span
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={spring}
                  className="relative accent:text-brand-text"
                >
                  <Check className="size-4" />
                </motion.span>
              )}
            </div>
          ))}
        </div>

        {/* ioiti-ui: beside the list, not in it (a list holds options alone): where the list's padding was, its margin. */}
        {items.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="m-1 px-3 py-6 text-center text-sm text-muted-foreground"
          >
            {emptyText}
          </motion.p>
        )}
      </div>
    </>
  );
}

function Highlight({ text, query }: { text: string; query: string }) {
  const i = query ? text.toLowerCase().indexOf(query) : -1;
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <span className="text-foreground underline decoration-foreground/30 underline-offset-[3px]">
        {text.slice(i, i + query.length)}
      </span>
      {text.slice(i + query.length)}
    </>
  );
}
