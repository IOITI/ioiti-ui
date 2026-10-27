import { motion } from 'framer-motion'
import { useId, useRef } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'

import { useControllableState } from '../lib/controllable.js'
import { motionTransitions } from '../lib/motion-tokens.js'
import { cn } from '../lib/utils.js'

export interface SegmentedControlOption<T extends string = string> {
  value: T
  label: ReactNode
  /** An icon of lucide-react, before the label. */
  icon?: ReactNode
  disabled?: boolean
  /** As a tab (`role="tablist"`): the id of the panel it shows. */
  panelId?: string
}

export interface SegmentedControlProps<T extends string = string> {
  options: SegmentedControlOption<T>[]
  value?: T
  defaultValue?: T
  onChange?: (value: T) => void
  /** The group's name for a screen reader: what is chosen ("Period"). Or `labelledBy`, a heading's id. */
  label?: string
  labelledBy?: string
  size?: 'sm' | 'md'
  /** As wide as its container, the segments sharing it. */
  fullWidth?: boolean
  /** A choice (`radiogroup`, the default), or the tabs that switch panels (`tablist`). */
  role?: 'radiogroup' | 'tablist'
  className?: string
}

const SIZE = {
  sm: 'h-7 px-2.5 text-xs [&_svg]:size-3.5',
  md: 'h-8 px-3 text-sm [&_svg]:size-4',
}

/**
 * Two to five choices shown at once, one of them chosen, in one bar: the chosen one filled as a primary
 * button is (in the accent, where the look has one), the fill sliding to the next. The arrow keys move
 * and choose, as in a radio group. For a page's sections, `AnimatedTabs`; for a longer list, a `Select`.
 */
export function SegmentedControl<T extends string = string>({
  options,
  value,
  defaultValue,
  onChange,
  label,
  labelledBy,
  size = 'md',
  fullWidth = false,
  role = 'radiogroup',
  className,
}: SegmentedControlProps<T>) {
  const [chosen, choose] = useControllableState<T | undefined>(value, defaultValue, onChange as (value: T | undefined) => void)
  const pill = useId()
  const buttons = useRef<(HTMLButtonElement | null)[]>([])
  const enabled = options.map((option, index) => (option.disabled ? -1 : index)).filter((index) => index >= 0)
  const chosenIndex = options.findIndex((option) => option.value === chosen)
  // The one stop of the keyboard: the chosen segment, or the first that can be chosen.
  const stop = chosenIndex >= 0 && !options[chosenIndex].disabled ? chosenIndex : enabled[0]
  const tabs = role === 'tablist'

  const moveTo = (index: number) => {
    choose(options[index].value)
    buttons.current[index]?.focus()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const at = enabled.indexOf(index)
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key]
    let next: number | undefined
    if (step !== undefined) next = enabled[(at + step + enabled.length) % enabled.length]
    else if (event.key === 'Home') next = enabled[0]
    else if (event.key === 'End') next = enabled[enabled.length - 1]
    if (next === undefined) return
    event.preventDefault()
    moveTo(next)
  }

  return (
    <div
      role={role}
      aria-label={label}
      aria-labelledby={labelledBy}
      aria-orientation={tabs ? 'horizontal' : undefined}
      className={cn(
        'items-center gap-0.5 rounded-lg border border-border bg-surface p-0.5',
        fullWidth ? 'flex w-full' : 'inline-flex',
        className,
      )}
    >
      {options.map((option, index) => {
        const on = index === chosenIndex
        return (
          <button
            key={option.value}
            ref={(element) => {
              buttons.current[index] = element
            }}
            type="button"
            role={tabs ? 'tab' : 'radio'}
            aria-checked={tabs ? undefined : on}
            aria-selected={tabs ? on : undefined}
            aria-controls={tabs ? option.panelId : undefined}
            tabIndex={index === stop ? 0 : -1}
            disabled={option.disabled}
            onClick={() => choose(option.value)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className={cn(
              // The text takes its colour as the fill slides under it, not before it arrives.
              'relative inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md font-medium transition-colors motion-safe:duration-300 motion-safe:ease-soft disabled:cursor-not-allowed disabled:opacity-50',
              SIZE[size],
              fullWidth && 'flex-1',
              on
                ? 'text-[var(--bg)] accent:text-brand-fill-foreground'
                : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary',
            )}
          >
            {on && (
              <motion.span
                layoutId={pill}
                aria-hidden
                className="absolute inset-0 rounded-md bg-[var(--text-primary)] shadow-xs accent:bg-brand accent:bg-(image:--brand-fill)"
                transition={motionTransitions.springMorph}
              />
            )}
            <span className="relative inline-flex items-center gap-1.5">
              {option.icon}
              {option.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
