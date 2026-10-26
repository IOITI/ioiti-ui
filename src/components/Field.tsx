import type { ReactNode } from 'react'

import { cn } from '../lib/utils.js'

interface FieldProps {
  label: ReactNode
  /** What is wrong with the value, under the control. */
  error?: ReactNode
  /**
   * The control's `id`, for a control that must not sit inside its label: a Combobox (a label passes
   * an option's click on to its field). The label is then beside it, and names it by `htmlFor`.
   */
  htmlFor?: string
  className?: string
  /** The control: an Input, a Select, a Combobox… */
  children: ReactNode
}

/** A control under its label, the label in small secondary text. */
export function Field({ label, error, htmlFor, className, children }: FieldProps) {
  const said = error ? <span className="text-xs text-negative">{error}</span> : null
  if (htmlFor) {
    return (
      <div className={cn('flex flex-col gap-1', className)}>
        <label htmlFor={htmlFor} className="text-xs text-text-secondary">
          {label}
        </label>
        {children}
        {said}
      </div>
    )
  }
  return (
    <label className={cn('flex flex-col gap-1', className)}>
      <span className="text-xs text-text-secondary">{label}</span>
      {children}
      {said}
    </label>
  )
}
