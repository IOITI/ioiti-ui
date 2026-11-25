'use client';

import React, { useState, useRef, useEffect, useId } from 'react';
// ioiti-ui: the list a layer in document.body (createPortal), placed by useAnchoredLayer; a Field's aria-invalid read
// as an error (invalidOf); what is typed found whatever its case and accents (fold).
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { useAnchoredLayer } from '../../lib/anchor.js';
// ioiti-ui: held by its caller or by itself, as every control (useControllableState).
import { useControllableState } from '../../lib/controllable.js';
// ioiti-ui: EasyUI's names kept until 1.0, drawing this one (renamed).
import { renamed } from '../../lib/renamed.js';
import { fieldBorder, invalidOf } from '../../lib/field-border.js';
import { fold } from '../../lib/search.js';
import { cn } from '../../lib/utils.js';
import { motionTransitions } from '../../lib/motion-tokens.js';
import { DISABLED, FLOATING, MENU_ROW } from '../../lib/recipes.js';
// ioiti-ui: its words in the provider's language (`select`).
import { useMessages } from '../locale-context.js';
// ioiti-ui: what a Field or a FormItem around it tells it (its id, its label, what describes it, whether it is wrong),
// its `data-*` attributes and its ref, as a native control takes them.
import { dataAttributes, type DataAttributes } from '../../lib/data-attributes.js';
import { useForwardedRef } from '../../lib/refs.js';
import { useFieldControl } from '../field-context.js';

// ioiti-ui: named after its role, `SelectMenu` (EasyUI's `SpringSelect`, its former name: at the end of the file).
export interface SelectMenuOption {
  value: string;
  label: string;
  disabled?: boolean;
  description?: string;
}

// ioiti-ui: its `data-*` attributes on its outermost element, as an element takes them.
export interface SelectMenuProps extends DataAttributes {
  /** Option list */
  options: SelectMenuOption[];
  /** Currently selected value (controlled) */
  value?: string;
  /** Default selected value (uncontrolled) */
  defaultValue?: string;
  /** Placeholder when no value is selected. ioiti-ui: the provider's language's by default ("Select…"). */
  placeholder?: string;
  /** Change handler */
  onChange?: (value: string) => void;
  /** Visible label */
  label?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Error message */
  error?: string;
  /** Custom class name for the root */
  className?: string;
  /** ioiti-ui: the trigger's id, for a `<label htmlFor>` (a `Field htmlFor`); in a FormItem, the item's. */
  id?: string;
  /** ioiti-ui: the value is sent with the form around it under this name (a hidden input), empty while none is chosen. */
  name?: string;
  /** ioiti-ui: its name, where no `label` is shown. */
  'aria-label'?: string;
  /** ioiti-ui: the id of what names it, in place of its `label`. A Field's label names it without it. */
  'aria-labelledby'?: string;
  /** ioiti-ui: read out with it: what a Field around it says under it (its description, its error). */
  'aria-describedby'?: string;
  /** ioiti-ui: marked invalid, as a Field with an error marks it: drawn as `error`. */
  'aria-invalid'?: boolean | 'true' | 'false';
  /** ioiti-ui: its trigger (the button that shows the value), to focus it. */
  ref?: React.Ref<HTMLButtonElement>;
}

// ioiti-ui: APG's select-only combobox: PageUp and PageDown move ten options, the letters typed within half a second
// are one search.
const PAGE = 10;
const TYPED_FOR = 500;

/** ioiti-ui: the enabled option at `from` or past it going `way`, else the nearest the other way; -1 when none is. */
function enabledFrom(options: SelectMenuOption[], from: number, way: 1 | -1): number {
  const start = Math.min(Math.max(from, 0), options.length - 1);
  for (const step of [way, -way]) {
    for (let i = start; i >= 0 && i < options.length; i += step) {
      if (!options[i].disabled) return i;
    }
  }
  return -1;
}

/**
 * ioiti-ui: the enabled option whose label starts with what was typed, whatever its case and accents. A letter (once,
 * or the same again and again) goes on from the active option to the next it starts, round the list; more letters
 * stay on the active option while it starts so. -1 when none does.
 */
function typedOption(options: SelectMenuOption[], typed: string, active: number): number {
  const search = fold(typed).text;
  const letter = [...search].every((character) => character === search[0]) ? search[0] : undefined;
  const first = letter ? active + 1 : Math.max(active, 0);
  for (let n = 0; n < options.length; n++) {
    const i = (first + n) % options.length;
    if (!options[i].disabled && fold(options[i].label).text.startsWith(letter ?? search)) return i;
  }
  return -1;
}

/**
 * SelectMenu — The dropdown menu follows the trigger with a tiny spring. ioiti-ui: EasyUI's SpringSelect, named after
 * its role.
 * On open, the menu slides down with a slight overshoot; the chevron rotates
 * a hair past 180° before settling. Closing is a smooth ease-back.
 *
 * ioiti-ui: the menu settles without overshoot (springSnappy) and the chevron turns to 180° exactly, as every
 * chevron of the design does.
 *
 * ioiti-ui: a select-only combobox (WAI-ARIA APG): the focus stays on the trigger, whose keys open the list, move in it
 * (the arrows, Home, End, PageUp, PageDown, letters typed) and choose (Enter, Space, Alt+ArrowUp, Tab), the option
 * they are on its `aria-activedescendant`.
 */
export const SelectMenu: React.FC<SelectMenuProps> = ({
  options,
  value,
  defaultValue,
  placeholder: givenPlaceholder,
  onChange,
  label,
  disabled = false,
  error,
  className,
  id,
  name,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  ref,
  ...rest
}) => {
  // ioiti-ui: its placeholder the provider's language's, unless one is given.
  const words = useMessages().select;
  const placeholder = givenPlaceholder ?? words.placeholder;
  const generatedId = useId();
  const rootId = `spring-select-${generatedId}`;
  const labelId = `${rootId}-label`;
  const listId = `${rootId}-listbox`;
  const errorId = `${rootId}-error`;
  // ioiti-ui: named, described and marked by a Field or a FormItem around it too, its own props first (its `label`,
  // what it is given), its id the one their label points to.
  const control = useFieldControl({
    id,
    fallbackId: `${rootId}-trigger`,
    labelledBy: ariaLabelledBy ?? (label ? labelId : undefined),
    named: Boolean(ariaLabel),
    describedBy: [ariaDescribedBy, error ? errorId : undefined].filter(Boolean).join(' ') || undefined,
    invalid: invalidOf(error, ariaInvalid),
  });
  // ioiti-ui: what the combobox points to: its label, its list and each option, its error. The trigger's id may be given.
  const triggerId = control.id ?? `${rootId}-trigger`;
  const optionId = (idx: number) => `${rootId}-option-${idx}`;
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useControllableState<string | undefined>(
    value,
    defaultValue,
    onChange as ((value: string | undefined) => void) | undefined
  );
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  // ioiti-ui: the list as wide as the trigger, read as it opens (inside the root, it took the root's width).
  const [width, setWidth] = useState<number>();
  // ioiti-ui: its trigger given to its caller's ref too.
  const [triggerRef, setTrigger] = useForwardedRef<HTMLButtonElement>(ref);
  // ioiti-ui: the layer in document.body, and the list in it, which scrolls.
  const layerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  // ioiti-ui: what was typed, until it is forgotten.
  const typed = useRef({ text: '', timer: 0 });

  const currentOption = options.find((o) => o.value === current);
  // ioiti-ui: wrong by its `error`, or by `aria-invalid` (a Field's, a FormItem's).
  const invalid = control.invalid;
  // ioiti-ui: the option the keys are on: never one gone from the list, nor one that cannot be chosen.
  const active = options[activeIndex] && !options[activeIndex].disabled ? activeIndex : -1;
  // ioiti-ui: named by what it is given, else by its label, else by its field's; described by a Field's words, then
  // its error.
  const labelledBy = control.labelledBy;
  const describedBy = control.describedBy;

  // ioiti-ui: disabled while it is open, it closes.
  if (disabled && open) setOpen(false);

  // ioiti-ui: a layer in document.body, placed beside the trigger and following it (useAnchoredLayer), a press elsewhere
  // closing it, the focus staying on the trigger: EasyUI's was placed inside the root, cut by a parent that hides what
  // overflows it. Its listeners on the document (a click outside, Escape) and the root's ref are gone with it.
  const layer = useAnchoredLayer({ open, onClose: () => setOpen(false), triggerRef, layerRef, focus: 'keep' });

  // ioiti-ui: the option the keys are on stays in sight, the list's padding (py-1) around it: the list scrolls, never
  // the page.
  useEffect(() => {
    const list = listRef.current;
    const option = active >= 0 ? list?.children[active] : undefined;
    if (!open || !layer.placed || !list || !(option instanceof HTMLElement)) return;
    if (option.offsetTop - 4 < list.scrollTop) list.scrollTop = Math.max(option.offsetTop - 4, 0);
    else if (option.offsetTop + option.offsetHeight + 4 > list.scrollTop + list.clientHeight) {
      list.scrollTop = option.offsetTop + option.offsetHeight + 4 - list.clientHeight;
    }
  }, [open, active, layer.placed]);

  // ioiti-ui: what was typed is not forgotten after the component.
  useEffect(() => {
    const buffer = typed.current;
    return () => window.clearTimeout(buffer.timer);
  }, []);

  // ioiti-ui: where the list opens: on the option chosen, else on the first that can be.
  const startIndex = () => {
    const chosen = options.findIndex((o) => o.value === current && !o.disabled);
    return chosen >= 0 ? chosen : enabledFrom(options, 0, 1);
  };

  // ioiti-ui: the list opened on an option, as wide as the trigger.
  const openList = (at = startIndex()) => {
    setActiveIndex(at);
    setWidth(triggerRef.current?.offsetWidth);
    setOpen(true);
  };

  // ioiti-ui: told of a change only, as a select's `change`: the option chosen again (or left by Tab) says nothing.
  const choose = (opt: SelectMenuOption) => {
    if (opt.value === current) return;
    setCurrent(opt.value);
  };

  const handleSelect = (opt: SelectMenuOption, idx: number) => {
    if (opt.disabled) return;
    choose(opt);
    setOpen(false);
    setActiveIndex(idx);
    triggerRef.current?.focus();
  };

  // ioiti-ui: Enter, Space and Alt+ArrowUp choose the option the keys are on, and close the list.
  const chooseActive = () => {
    if (active >= 0) handleSelect(options[active], active);
    else setOpen(false);
  };

  // ioiti-ui: the option what was typed leads to (typedOption), the letters kept TYPED_FOR ms; none found, the next
  // letter starts a new search.
  const typeAhead = (character: string, from: number) => {
    const buffer = typed.current;
    window.clearTimeout(buffer.timer);
    const found = typedOption(options, buffer.text + character, from);
    buffer.text = found >= 0 ? buffer.text + character : '';
    if (buffer.text) {
      buffer.timer = window.setTimeout(() => {
        buffer.text = '';
      }, TYPED_FOR);
    }
    return found;
  };

  // ioiti-ui: the focus stays on the trigger and its keys do everything (APG's select-only combobox). EasyUI's trigger
  // only opened the list, whose own keys (the arrows, Enter) were out of reach: the list never had the focus.
  const handleTriggerKey = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    const { key, altKey, ctrlKey, metaKey } = e;

    // A letter typed: the option it starts, the list opened on it. A space goes on with the word typed where an option
    // does ("New Y"), and chooses or opens otherwise.
    if (key.length === 1 && !altKey && !ctrlKey && !metaKey && (key !== ' ' || typed.current.text)) {
      const from = open ? active : startIndex();
      const found = typeAhead(key, from);
      if (key !== ' ' || found >= 0) {
        e.preventDefault();
        if (!open) openList(found >= 0 ? found : from);
        else if (found >= 0) setActiveIndex(found);
        return;
      }
    }

    if (!open) {
      // Closed: the arrows (Alt+ArrowDown too), Enter and Space open it on the option chosen; Home and End on the
      // first and the last.
      if (key === 'ArrowDown' || key === 'ArrowUp' || key === 'Enter' || key === ' ') {
        e.preventDefault();
        openList();
      } else if (key === 'Home' || key === 'End') {
        e.preventDefault();
        openList(key === 'Home' ? enabledFrom(options, 0, 1) : enabledFrom(options, options.length - 1, -1));
      }
      return;
    }

    // Open: the keys move past what cannot be chosen, and stop at the ends.
    switch (key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!altKey) setActiveIndex(enabledFrom(options, active + 1, 1));
        return;
      case 'ArrowUp':
        e.preventDefault();
        if (altKey) chooseActive();
        else setActiveIndex(enabledFrom(options, active - 1, -1));
        return;
      case 'Home':
      case 'End':
        e.preventDefault();
        setActiveIndex(key === 'Home' ? enabledFrom(options, 0, 1) : enabledFrom(options, options.length - 1, -1));
        return;
      case 'PageDown':
      case 'PageUp':
        e.preventDefault();
        setActiveIndex(key === 'PageDown' ? enabledFrom(options, active + PAGE, 1) : enabledFrom(options, active - PAGE, -1));
        return;
      case 'Enter':
      case ' ':
        e.preventDefault();
        chooseActive();
        return;
      case 'Tab':
        // Chosen, and the focus goes on, not held.
        if (active >= 0) choose(options[active]);
        setOpen(false);
        return;
      case 'Escape':
        // Closed without a choice, the focus staying here; a dialog around it stays open.
        layer.onTriggerKeyDown(e);
        return;
    }
  };

  return (
    // ioiti-ui: its `data-*` attributes on its outermost element.
    <div {...dataAttributes(rest)} className={cn('relative w-full', className)} id={rootId}>
      {label && (
        <label
          // ioiti-ui: what names the combobox (aria-labelledby). A click on it gives the trigger the focus, as a select's
          // label does, and no click: passed on to the trigger, it opened the list, and opened it again once the press on
          // the label, outside the list, had closed it.
          id={labelId}
          htmlFor={triggerId}
          onClick={(e) => {
            e.preventDefault();
            triggerRef.current?.focus();
          }}
          className="block text-xs font-semibold text-foreground mb-1.5 select-none"
        >
          {label}
        </label>
      )}

      <button
        ref={setTrigger}
        id={triggerId}
        type="button"
        // ioiti-ui: a combobox (APG's select-only): its list, and the option the keys are on while it is open, pointed
        // to; named by its label; described by its error, and marked by it.
        role="combobox"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={open && active >= 0 ? optionId(active) : undefined}
        aria-label={ariaLabel}
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
        // ioiti-ui: opened on the option chosen; the trigger takes the focus (Safari gives none to a button pressed),
        // its keys with it.
        onClick={() => {
          if (disabled) return;
          if (open) setOpen(false);
          else {
            openList();
            triggerRef.current?.focus();
          }
        }}
        onKeyDown={handleTriggerKey}
        // ioiti-ui: Space did its work on its keydown: Firefox would click the button again on its keyup.
        onKeyUp={(e) => {
          if (e.key === ' ') e.preventDefault();
        }}
        // ioiti-ui: the focus gone elsewhere (Tab chose before), the list closes; a press in the list leaves it here.
        onBlur={(e) => {
          if (!layerRef.current?.contains(e.relatedTarget)) setOpen(false);
        }}
        className={cn(
          'relative w-full h-10 px-3.5 pr-9 text-base sm:text-sm rounded-lg border outline-none text-left flex items-center justify-between transition-colors duration-150 focus-ring cursor-pointer',
          'bg-surface',
          // ioiti-ui: its border, or the error's, a Field's `aria-invalid` included.
          fieldBorder(invalid),
          // ioiti-ui: open, the option under the pointer and the one chosen in the accent, where the theme has one (accent:).
          open &&
            (invalid
              ? 'border-negative hover:border-negative'
              : 'border-muted-foreground hover:border-muted-foreground accent:border-brand accent:hover:border-brand'),
          DISABLED,
          currentOption ? 'text-foreground' : 'text-text-subtle'
        )}
      >
        <span className="truncate">{currentOption?.label ?? placeholder}</span>

        {/* ioiti-ui: the field's chevron, turned to 180° by the stylesheet (EasyUI's went to 192° on a spring). */}
        <span className="absolute right-3 flex text-muted-foreground">
          <ChevronDown className={cn('size-4 motion-safe:transition-transform duration-200 ease-fast', open && 'rotate-180')} />
        </span>
      </button>

      {/* ioiti-ui: the value, sent with the form around it under `name`. */}
      {name && <input type="hidden" name={name} value={current ?? ''} disabled={disabled} />}

      {/* ioiti-ui: drawn in document.body, out of every parent that would cut it; its look and its motion EasyUI's. */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                ref={layerRef}
                // ioiti-ui: a press in it leaves the focus on the trigger, which holds the keys; a click still chooses.
                onMouseDown={(e) => e.preventDefault()}
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                // ioiti-ui: it leaves quicker than it came (easeExit), as everything that floats.
                exit={{ opacity: 0, y: -4, scale: 0.98, transition: motionTransitions.easeExit }}
                transition={motionTransitions.springSnappy}
                // The container itself rides the spring: a tiny upward slide that
                // "settles" with the snappy spring, plus a slight overshoot via the
                // scale: 0.98 -> 1 motion.
                // ioiti-ui: at its place beside the trigger, as wide as it, grown from its side of it.
                style={{ ...layer.style, width, transformOrigin: layer.side === 'top' ? 'bottom' : 'top' }}
                // ioiti-ui: glass under the glass material (glass-float). The list scrolls inside it, 15rem high at most
                // and never past the room on its side (the layer's maxHeight), so that it is placed at the height it has.
                className={cn('z-50 flex flex-col overflow-hidden', FLOATING)}
              >
                <ul
                  ref={listRef}
                  // ioiti-ui: the list the combobox controls, named as it is (else by the trigger, which shows its value).
                  // It never takes the focus (no tabIndex): the trigger keeps it. Positioned: its options' offsetTop is
                  // measured from it, to keep the active one in sight.
                  id={listId}
                  role="listbox"
                  aria-labelledby={labelledBy ?? (ariaLabel ? undefined : triggerId)}
                  aria-label={labelledBy ? undefined : ariaLabel}
                  className="relative min-h-0 max-h-60 overflow-auto py-1"
                >
                  {options.map((opt, idx) => {
                    const selected = opt.value === current;
                    return (
                      <li
                        key={opt.value}
                        // ioiti-ui: its id, for the trigger's aria-activedescendant.
                        id={optionId(idx)}
                        role="option"
                        aria-selected={selected}
                        aria-disabled={opt.disabled}
                        // ioiti-ui: the pointer moves the option the keys are on, at a move of its own (pointermove):
                        // mouseenter fired as the keys scrolled the list under a pointer at rest, taking it back.
                        onPointerMove={() => {
                          if (!opt.disabled && idx !== activeIndex) setActiveIndex(idx);
                        }}
                        onClick={() => handleSelect(opt, idx)}
                        className={cn(
                          MENU_ROW,
                          'relative mx-1 justify-between',
                          selected && 'accent:text-brand-text',
                          opt.disabled && 'opacity-50 cursor-not-allowed',
                          activeIndex === idx && !opt.disabled && 'bg-surface-hover accent:bg-brand-soft'
                        )}
                      >
                        <span className="flex flex-col">
                          <span className="leading-tight">{opt.label}</span>
                          {opt.description && (
                            <span className="text-xs text-muted-foreground mt-0.5">
                              {opt.description}
                            </span>
                          )}
                        </span>
                        {selected && <Check className="size-4 text-foreground accent:text-brand-text shrink-0" />}
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}

      {error && (
        <motion.p
          // ioiti-ui: what describes the trigger (aria-describedby).
          id={errorId}
          initial={{ opacity: 0, y: -2 }}
          animate={{ opacity: 1, y: 0 }}
          transition={motionTransitions.springSnappy}
          className="text-xs text-negative font-medium mt-1.5"
          role="alert"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

// ioiti-ui: EasyUI's names, until 1.0: the former name draws the select, and says once, in development, that it is
// deprecated (renamed).
/** @deprecated Use `SelectMenu`. Removed in 1.0. */
export const SpringSelect = renamed(SelectMenu, 'SpringSelect');
/** @deprecated Use `SelectMenuProps`. Removed in 1.0. */
export type SpringSelectProps = SelectMenuProps;
/** @deprecated Use `SelectMenuOption`. Removed in 1.0. */
export type SpringSelectOption = SelectMenuOption;
