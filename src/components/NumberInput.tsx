import { Minus, Plus } from 'lucide-react'
import { useLayoutEffect, useRef, useState } from 'react'
import type { ChangeEvent, KeyboardEvent, ReactNode } from 'react'

import { useControllableState } from '../lib/controllable.js'
import { cn } from '../lib/utils.js'
import { Hint } from './Hint.js'

interface NumberInputProps {
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
  /** The digits after the point it shows once it leaves the field. */
  precision?: number
  /** A unit before the value, or after it: "€", "ms", "days". */
  prefix?: ReactNode
  suffix?: ReactNode
  /** Its name for a screen reader, where no `<label htmlFor>` names it. */
  label?: string
  id?: string
  name?: string
  placeholder?: string
  disabled?: boolean
  /** A value that is wrong: its border in the negative colour. */
  error?: boolean
  /** The − and + buttons beside it. */
  steppers?: boolean
  className?: string
}

const decimalsOf = (value: number) => (Number.isInteger(value) ? 0 : (String(value).split('.')[1]?.length ?? 0))

/** What was typed, as a number: `null` for nothing, `NaN` for what is not one yet ("-", "1.2.3"). */
function parse(text: string): number | null {
  const clean = text.replace(/\s/g, '').replace(',', '.')
  if (clean === '') return null
  if (!/^-?\d*\.?\d*$/.test(clean) || clean === '-' || clean === '.' || clean === '-.') return Number.NaN
  return Number(clean)
}

/**
 * A number to type, or to change with the arrow keys and the − and + buttons: a limit, a quantity, a delay
 * with its unit. What is typed stays as it is until it leaves the field ("1." on the way to "1.5"); a comma
 * or a point marks the decimals; it keeps to its minimum and maximum. A spin button to a screen reader.
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
}: NumberInputProps) {
  const [current, setCurrent] = useControllableState<number | null>(value, defaultValue, onChange)
  const digits = integer ? 0 : (precision ?? Math.max(decimalsOf(step), 0))
  const toText = (number: number | null) => (number === null ? '' : precision === undefined ? String(number) : number.toFixed(precision))
  const [text, setText] = useState(() => toText(current))

  // A value given from outside, not the one being typed: shown as it is.
  const [shownFor, setShownFor] = useState(current)
  if (current !== shownFor) {
    setShownFor(current)
    if (parse(text) !== current) setText(toText(current))
  }

  const keep = (number: number) => {
    const bounded = Math.min(max ?? Infinity, Math.max(min ?? -Infinity, number))
    return integer ? Math.round(bounded) : Number(bounded.toFixed(Math.max(digits, decimalsOf(step))))
  }
  const set = (number: number | null) => {
    setCurrent(number)
    setShownFor(number)
    setText(toText(number))
  }
  const stepBy = (count: number) => {
    if (disabled) return
    set(keep((current ?? min ?? 0) + count * step))
  }

  const onInput = (event: ChangeEvent<HTMLInputElement>) => {
    const negative = min === undefined || min < 0
    const allowed = integer ? (negative ? /[^\d\s-]/g : /[^\d\s]/g) : negative ? /[^\d\s.,-]/g : /[^\d\s.,]/g
    const typed = event.target.value.replace(allowed, '')
    setText(typed)
    const number = parse(typed)
    if (number === null || !Number.isNaN(number)) {
      setShownFor(number)
      setCurrent(number)
    }
  }
  const onBlur = () => {
    const number = parse(text)
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
  const [pad, setPad] = useState({ left: 0, right: 0 })
  useLayoutEffect(() => {
    setPad({ left: before.current?.offsetWidth ?? 0, right: after.current?.offsetWidth ?? 0 })
  }, [prefix, suffix, steppers])

  const unit = typeof suffix === 'string' ? ` ${suffix}` : ''
  const lead = typeof prefix === 'string' ? `${prefix} ` : ''
  const atMin = min !== undefined && current !== null && current <= min
  const atMax = max !== undefined && current !== null && current >= max

  return (
    <div className={cn('relative flex w-full items-center', className)}>
      {prefix && (
        <span ref={before} aria-hidden className="pointer-events-none absolute left-0 flex h-full items-center pl-3.5 pr-1.5 text-xs text-muted-foreground">
          {prefix}
        </span>
      )}
      {/* Its input first: a label around it names the field, not a button. */}
      <input
        id={id}
        name={name}
        type="text"
        role="spinbutton"
        inputMode={integer ? 'numeric' : 'decimal'}
        autoComplete="off"
        aria-label={label}
        aria-valuenow={current ?? undefined}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuetext={current === null ? undefined : `${lead}${toText(current)}${unit}`}
        aria-invalid={error || undefined}
        value={text}
        placeholder={placeholder}
        disabled={disabled}
        onChange={onInput}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        style={{ paddingLeft: prefix ? pad.left : undefined, paddingRight: pad.right ? pad.right : undefined }}
        // The look of the form's Input.
        className={cn(
          'h-10 w-full rounded-lg border bg-white px-3.5 text-xs tabular-nums text-neutral-900 transition-all duration-150 placeholder:text-muted-foreground dark:bg-[#141414] dark:text-[#FAFAFA]',
          'border-neutral-300 hover:border-neutral-500 dark:border-[#1F1F1F] dark:hover:border-[#4A4A4A]',
          'focus:border-neutral-500 focus:outline-none dark:focus:border-[#4A4A4A] accent:focus:border-brand',
          error && 'border-negative/60 focus:border-negative',
          disabled && 'cursor-not-allowed bg-neutral-100 opacity-30 dark:bg-[#0E0E0E]',
        )}
      />
      {(suffix || steppers) && (
        <span ref={after} className="absolute right-0 flex h-full items-center gap-0.5 pl-1.5 pr-1">
          {suffix && (
            <span aria-hidden className="pointer-events-none pr-1 text-xs text-muted-foreground">
              {suffix}
            </span>
          )}
          {steppers &&
            ([
              ['Decrease', <Minus key="minus" />, -1, atMin],
              ['Increase', <Plus key="plus" />, 1, atMax],
            ] as const).map(([what, icon, by, end]) => (
              <Hint key={what} content={what}>
                <button
                  type="button"
                  // The arrow keys do it from the field: no stop of the keyboard of its own, nor a second control to hear.
                  tabIndex={-1}
                  aria-hidden
                  disabled={disabled || end}
                  onPointerDown={(event) => event.preventDefault()}
                  onClick={() => stepBy(by)}
                  className="grid size-7 place-items-center rounded-md text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary disabled:pointer-events-none disabled:opacity-40 [&>svg]:size-3.5"
                >
                  {icon}
                </button>
              </Hint>
            ))}
        </span>
      )}
    </div>
  )
}
