import { Minus, Plus } from 'lucide-react'
import { useRef, useState } from 'react'
import type { ChangeEvent, KeyboardEvent, ReactNode, Ref } from 'react'

import { useControllableState } from '../lib/controllable.js'
import { dataAttributes } from '../lib/data-attributes.js'
import type { DataAttributes } from '../lib/data-attributes.js'
import { fieldBorder, invalidOf } from '../lib/field-border.js'
import { numberSymbolsOf, parseLocaleNumber } from '../lib/locale.js'
import type { NumberSymbols } from '../lib/locale.js'
import { DISABLED, PRESSABLE } from '../lib/recipes.js'
import { useUnitPadding } from '../lib/unit-padding.js'
import { cn } from '../lib/utils.js'
import { useFieldControl } from './field-context.js'
import { Hint } from './Hint.js'
import { useLocale, useMessages } from './locale-context.js'

export interface NumberInputProps extends DataAttributes {
  /** The value; `null` (or `NaN`) for none, an empty field. */
  value?: number | null
  defaultValue?: number | null
  /** Each value it holds: `null` once emptied. A value being typed ("1.", "-") is not one yet. */
  onChange?: (value: number | null) => void
  min?: number
  max?: number
  /** What the arrows and the buttons add or take away (ten times with Shift, Page Up and Page Down). */
  step?: number
  /** Whole numbers only. */
  integer?: boolean
  /** The digits after the decimal separator it shows once it leaves the field. */
  precision?: number
  /** A unit before the value, or after it: "€", "ms", "days". */
  prefix?: ReactNode
  suffix?: ReactNode
  /** Its name for a screen reader, where no `<label htmlFor>` names it. */
  label?: string
  /** Its field's id, for a `<label htmlFor>`; in a FormItem, the item's. */
  id?: string
  /**
   * The name its value is sent under with a form (a hidden input): the number as code writes it ("1234.5"), whatever
   * the locale shows; empty while there is none.
   */
  name?: string
  placeholder?: string
  disabled?: boolean
  /** A value that is wrong: its border in the negative colour. */
  error?: boolean
  /** Its name, as `label`. */
  'aria-label'?: string
  /** The id of what names it: a heading, a label elsewhere. A Field's label names it without it. */
  'aria-labelledby'?: string
  /** Read out with it: what a Field around it says under it (its description, its error). */
  'aria-describedby'?: string
  /** Marked invalid, as a Field with an error marks it: drawn as `error`. */
  'aria-invalid'?: boolean | 'true' | 'false'
  /** The − and + buttons beside it. */
  steppers?: boolean
  className?: string
  /** Its field (the input), to focus it. */
  ref?: Ref<HTMLInputElement>
}

const decimalsOf = (value: number) => (Number.isInteger(value) ? 0 : (String(value).split('.')[1]?.length ?? 0))

/** The signs read as a minus (parseLocaleNumber's): a hyphen, a true minus, the dashes, a wide one. */
const MINUS_SIGNS = ['-', '−', '‒', '–', '﹣', '－']

/** What was typed, read as the locale writes a number: `null` for nothing, `NaN` for what is not one yet ("-", "1.2.3"). */
function parse(text: string, locale: string): number | null {
  if (text.trim() === '') return null
  return parseLocaleNumber(text, locale)
}

/**
 * A number as the field shows it: with the locale's decimal separator and minus, its digits never grouped (what is
 * edited next is digits, as they are typed); to `precision` decimals where it is given, else all of its own.
 */
function write(value: number, symbols: NumberSymbols, precision: number | undefined): string {
  const plain = precision === undefined ? String(value) : value.toFixed(precision)
  return plain.replace(/^-/, symbols.minus).replace('.', symbols.decimal)
}

/**
 * Whether a character is one a person may type: a digit, a space; a sign where the value may be negative; and where it
 * may have decimals, a point, a comma and the locale's separators (an apostrophe either way where it groups with one).
 */
function typeable(symbols: NumberSymbols, integer: boolean, negative: boolean): (char: string) => boolean {
  const signs = negative ? [...MINUS_SIGNS, symbols.minus] : []
  const separators = integer ? [] : ['.', ',', symbols.decimal, symbols.group, ...(/['’]/.test(symbols.group) ? ["'", '’'] : [])]
  const others = new Set([...signs, ...separators])
  return (char) => /[\d\s]/.test(char) || others.has(char)
}

/**
 * A number to type, or to change with the arrow keys and the − and + buttons: a limit, a quantity, a delay
 * with its unit. What is typed is read as the provider's locale writes a number, and as people type one ("1 234,5" and
 * "1234.5" in French; "1,500" is 1500 in English, "1,5" is 1.5), and stays as it is until it leaves the field ("1." on
 * the way to "1.5"); it is then written in the locale's way, its decimal separator and no groups. It keeps to its
 * minimum and maximum. A spin button to a screen reader.
 */
export function NumberInput({
  value,
  defaultValue = null,
  onChange,
  min,
  max,
  step = 1,
  integer = false,
  precision,
  prefix,
  suffix,
  label,
  id,
  name,
  placeholder,
  disabled = false,
  error = false,
  steppers = true,
  className,
  'aria-label': ariaLabel,
  'aria-labelledby': labelledBy,
  'aria-describedby': describedBy,
  'aria-invalid': ariaInvalid,
  ref,
  ...rest
}: NumberInputProps) {
  // Named, described and marked by a Field or a FormItem around it too, its own props first.
  const ownName = ariaLabel ?? label
  const control = useFieldControl({ id, labelledBy, named: Boolean(ownName), describedBy, invalid: invalidOf(error, ariaInvalid) })
  const invalid = control.invalid
  const { locale } = useLocale()
  const words = useMessages().numberInput
  const symbols = numberSymbolsOf(locale)
  const [held, setCurrent] = useControllableState<number | null>(value, defaultValue, onChange)
  // NaN is none, as null: stepped from its minimum, or 0. Never equal to itself, it would be a new value at
  // every render, each asking for another.
  const current = Number.isNaN(held) ? null : held
  const digits = integer ? 0 : (precision ?? Math.max(decimalsOf(step), 0))
  const toText = (number: number | null) => (number === null ? '' : write(number, symbols, precision))
  const read = (typed: string) => parse(typed, locale)
  const [text, setText] = useState(() => toText(current))

  // A new value from outside (not the one being typed) is shown as it is, and the value is written again in the
  // way of a new locale. A value its caller refused leaves what is being typed alone.
  const [seen, setSeen] = useState({ value: current, locale })
  if (current !== seen.value || locale !== seen.locale) {
    setSeen({ value: current, locale })
    if (read(text) !== current || (locale !== seen.locale && current !== null)) setText(toText(current))
  }

  const keep = (number: number) => {
    const bounded = Math.min(max ?? Infinity, Math.max(min ?? -Infinity, number))
    return integer ? Math.round(bounded) : Number(bounded.toFixed(Math.max(digits, decimalsOf(step))))
  }
  const set = (number: number | null) => {
    setCurrent(number)
    setText(toText(number))
  }
  const stepBy = (count: number) => {
    if (disabled) return
    set(keep((current ?? min ?? 0) + count * step))
  }

  const allowed = typeable(symbols, integer, min === undefined || min < 0)
  const onInput = (event: ChangeEvent<HTMLInputElement>) => {
    const typed = [...event.target.value].filter(allowed).join('')
    setText(typed)
    const number = read(typed)
    if (number === null || !Number.isNaN(number)) setCurrent(number)
  }
  const onBlur = () => {
    const number = read(text)
    if (number === null) set(null)
    else if (Number.isNaN(number)) setText(toText(current))
    else set(keep(number))
  }
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const by = event.shiftKey ? 10 : 1
    if (event.key === 'ArrowUp') stepBy(by)
    else if (event.key === 'ArrowDown') stepBy(-by)
    else if (event.key === 'PageUp') stepBy(10)
    else if (event.key === 'PageDown') stepBy(-10)
    else if (event.key === 'Home' && min !== undefined) set(min)
    else if (event.key === 'End' && max !== undefined) set(max)
    else return
    event.preventDefault()
  }

  // The units and the buttons sit inside the field: its text keeps clear of them.
  const before = useRef<HTMLSpanElement>(null)
  const after = useRef<HTMLSpanElement>(null)
  const pad = useUnitPadding(before, after, [prefix, suffix, steppers])

  const unit = typeof suffix === 'string' ? ` ${suffix}` : ''
  const lead = typeof prefix === 'string' ? `${prefix} ` : ''
  const atMin = min !== undefined && current !== null && current <= min
  const atMax = max !== undefined && current !== null && current >= max

  return (
    <div {...dataAttributes(rest)} className={cn('relative flex w-full items-center', className)}>
      {prefix && (
        <span ref={before} aria-hidden className="pointer-events-none absolute left-0 flex h-full items-center pl-3.5 pr-1.5 text-base sm:text-sm text-muted-foreground">
          {prefix}
        </span>
      )}
      {/* Its input first: a label around it names the field, not a button. Its text is the locale's, as typed: the
          value is sent apart, as a number is written in code. */}
      <input
        ref={ref}
        id={control.id}
        type="text"
        role="spinbutton"
        inputMode={integer ? 'numeric' : 'decimal'}
        autoComplete="off"
        aria-label={ownName}
        aria-labelledby={control.labelledBy}
        aria-valuenow={current ?? undefined}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuetext={current === null ? undefined : `${lead}${toText(current)}${unit}`}
        aria-invalid={invalid || undefined}
        aria-describedby={control.describedBy}
        value={text}
        placeholder={placeholder}
        disabled={disabled}
        onChange={onInput}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        style={{ paddingLeft: prefix ? pad.left : undefined, paddingRight: pad.right ? pad.right : undefined }}
        // The look of the form's Input.
        className={cn(
          'h-10 w-full rounded-lg border bg-surface px-3.5 text-base sm:text-sm tabular-nums text-foreground transition-colors duration-150 placeholder:text-text-subtle',
          fieldBorder(invalid),
          'focus:outline-none',
          DISABLED,
        )}
      />
      {(suffix || steppers) && (
        <span ref={after} className="absolute right-0 flex h-full items-center gap-0.5 pl-1.5 pr-1">
          {suffix && (
            <span aria-hidden className="pointer-events-none pr-1 text-base sm:text-sm text-muted-foreground">
              {suffix}
            </span>
          )}
          {steppers &&
            ([
              ['minus', words.decrease, <Minus key="minus" />, -1, atMin],
              ['plus', words.increase, <Plus key="plus" />, 1, atMax],
            ] as const).map(([key, what, icon, by, end]) => (
              <Hint key={key} content={what}>
                <button
                  type="button"
                  // The arrow keys do it from the field: no stop of the keyboard of its own, nor a second control to hear.
                  tabIndex={-1}
                  aria-hidden
                  disabled={disabled || end}
                  onPointerDown={(event) => event.preventDefault()}
                  onClick={() => stepBy(by)}
                  className={cn(
                    'grid size-6 place-items-center rounded-md text-muted-foreground transition enabled:hover:bg-surface-hover enabled:hover:text-foreground [&>svg]:size-3.5',
                    PRESSABLE,
                  )}
                >
                  {icon}
                </button>
              </Hint>
            ))}
        </span>
      )}
      {name && <input type="hidden" name={name} value={current === null ? '' : String(current)} disabled={disabled} />}
    </div>
  )
}
