import { cloneElement, isValidElement, useId } from 'react'
import type { ReactNode } from 'react'

import { cn } from '../lib/utils.js'

interface FieldProps {
  label: ReactNode
  /**
   * What the value is for, or how to write it: under the control, in muted text, read out with it
   * (`aria-describedby`, when the control is one element). The label alone names the control then; the error
   * describes it too.
   */
  description?: ReactNode
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

/** The control, described by the ids given, after any description of its own. */
function described(control: ReactNode, ids: string): ReactNode {
  if (!isValidElement<{ 'aria-describedby'?: string }>(control)) return control
  const own = control.props['aria-describedby']
  return cloneElement(control, { 'aria-describedby': own ? `${own} ${ids}` : ids })
}

/** A control under its label, the label in small secondary text; what it is for, and what is wrong, under it. */
export function Field({ label, description, error, htmlFor, className, children }: FieldProps) {
  const id = useId()
  const said = error ? <span className="text-xs text-negative">{error}</span> : null

  if (description) {
    // Out of the label, which names the control by itself: the description and the error describe it.
    const descriptionId = `${id}-description`
    const errorId = `${id}-error`
    const control = described(children, error ? `${descriptionId} ${errorId}` : descriptionId)
    const under = (
      <>
        <span id={descriptionId} className="text-xs text-muted-foreground">
          {description}
        </span>
        {error && (
          <span id={errorId} className="text-xs text-negative">
            {error}
          </span>
        )}
      </>
    )
    return (
      <div className={cn('flex flex-col gap-1', className)}>
        {htmlFor ? (
          <>
            <label htmlFor={htmlFor} className="text-xs text-text-secondary">
              {label}
            </label>
            {control}
          </>
        ) : (
          <label className="flex flex-col gap-1">
            <span className="text-xs text-text-secondary">{label}</span>
            {control}
          </label>
        )}
        {under}
      </div>
    )
  }

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
