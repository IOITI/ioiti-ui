import { motion } from 'framer-motion'
import { useId, useRef } from 'react'
import type { KeyboardEvent, ReactNode, Ref } from 'react'

import { useControllableState } from '../lib/controllable.js'
import { dataAttributes } from '../lib/data-attributes.js'
import { deprecated } from '../lib/deprecated.js'
import type { DataAttributes } from '../lib/data-attributes.js'
import { invalidOf } from '../lib/field-border.js'
import { motionTransitions } from '../lib/motion-tokens.js'
import { DISABLED } from '../lib/recipes.js'
import { cn } from '../lib/utils.js'
import { useFieldControl } from './field-context.js'

export interface SegmentedControlOption<T extends string = string> {
  value: T
  label: ReactNode
  /** An icon of lucide-react, before the label. */
  icon?: ReactNode
  disabled?: boolean
  /** As a tab (`role="tablist"`): the id of the panel it shows. */
  panelId?: string
}

export interface SegmentedControlProps<T extends string = string> extends DataAttributes {
  options: SegmentedControlOption<T>[]
  value?: T
  defaultValue?: T
  onChange?: (value: T) => void
  /** The group's name for a screen reader: what is chosen ("Period"). Or `aria-labelledby`, a heading's id. */
  label?: string
  /** @deprecated Use `aria-labelledby`. Removed in 1.0. */
  labelledBy?: string
  /** Its name, as `label`. */
  'aria-label'?: string
  /** The id of what names the group: a heading. A Field's label names it without it. */
  'aria-labelledby'?: string
  /** Read out with it: what a Field around it says under it (its description, its error). */
  'aria-describedby'?: string
  /** Marked invalid, as a Field with an error marks it. */
  'aria-invalid'?: boolean | 'true' | 'false'
  /** The group's id, for a `<label htmlFor>`; in a FormItem, the item's. */
  id?: string
  /** The name its value is sent under with a form (a hidden input), as a radio's: nothing while none is chosen. */
  name?: string
  size?: 'sm' | 'md'
  /** As wide as its container, the segments sharing it. */
  fullWidth?: boolean
  /** A choice (`radiogroup`, the default), or the tabs that switch panels (`tablist`). */
  role?: 'radiogroup' | 'tablist'
  className?: string
  /** The group (its `radiogroup` or `tablist` element), which holds its segments. */
  ref?: Ref<HTMLDivElement>
}

// The control 32px (sm) or 40px (md) tall, as a button of its size: each segment that less the track's padding (2px)
// and its border (1px), above and below.
const SIZE = {
  sm: 'h-6.5 px-2.5 text-sm [&_svg]:size-3.5',
  md: 'h-8.5 px-3 text-sm [&_svg]:size-4',
}

/**
 * Two to five choices shown at once, one of them chosen, in one bar: the chosen one filled as a primary
 * button is (in the accent, where the look has one), the fill sliding to the next. The arrow keys move
 * and choose, as in a radio group. For a page's sections, `Tabs`; for a longer list, a `Select`.
 */
export function SegmentedControl<T extends string = string>({
  options,
  value,
  defaultValue,
  onChange,
  label,
  labelledBy: formerLabelledBy,
  'aria-label': ariaLabel,
  'aria-labelledby': labelledBy = formerLabelledBy,
  'aria-describedby': describedBy,
  'aria-invalid': ariaInvalid,
  id,
  name,
  size = 'md',
  fullWidth = false,
  role = 'radiogroup',
  className,
  ref,
  ...rest
}: SegmentedControlProps<T>) {
  if (formerLabelledBy !== undefined) deprecated('segmented-control-labelled-by', 'SegmentedControl')
  const [chosen, choose] = useControllableState<T | undefined>(value, defaultValue, onChange as (value: T | undefined) => void)
  const pill = useId()
  const ownName = ariaLabel ?? label
  // Named, described and marked by a Field or a FormItem around it too, its own props first: by its label's words
  // (aria-labelledby: a label names no group), the label pointing to the group's id, so that it names no segment.
  const control = useFieldControl({
    id,
    fallbackId: pill,
    labelledBy,
    named: Boolean(ownName),
    describedBy,
    invalid: invalidOf(undefined, ariaInvalid),
  })
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
      ref={ref}
      {...dataAttributes(rest)}
      role={role}
      id={control.id}
      aria-label={ownName}
      aria-labelledby={control.labelledBy}
      aria-describedby={control.describedBy}
      aria-invalid={control.invalid || undefined}
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
              'relative inline-flex cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-md font-medium transition-colors motion-safe:duration-300 motion-safe:ease-soft',
              DISABLED,
              SIZE[size],
              fullWidth && 'flex-1',
              on
                ? 'text-primary-foreground accent:text-brand-fill-foreground'
                : 'text-text-secondary hover:bg-surface-hover hover:text-foreground',
            )}
          >
            {on && (
              <motion.span
                layoutId={pill}
                // Slides when the choice changes, only: a resize (the sheet it is in, dragged) moves it with
                // its segment, where a spring had it trail behind.
                layoutDependency={chosen}
                aria-hidden
                className="absolute inset-0 rounded-md bg-primary shadow-subtle accent:bg-brand accent:bg-(image:--brand-fill)"
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
      {name && chosen !== undefined && <input type="hidden" name={name} value={chosen} />}
    </div>
  )
}
