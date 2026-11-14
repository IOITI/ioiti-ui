import { cloneElement, isValidElement, useId } from 'react'
import type { ReactNode } from 'react'

import { cn } from '../lib/utils.js'

/** The label: small, in the primary text and semibold, so that it stands out of a form; its description stays muted. */
const LABEL = 'text-xs font-semibold text-text-primary'

interface FieldProps {
  label: ReactNode
  /**
   * What the value is for, or how to write it: under the control, in muted text, read out with it
   * (`aria-describedby`, when the control is one element). The label alone names the control.
   */
  description?: ReactNode
  /**
   * What is wrong with the value, under the control: read out with it (`aria-describedby`), and the control marked
   * invalid (`aria-invalid`), which the package's fields draw in the error's colour.
   */
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

/**
 * The control, described by the ids given (after any description of its own), and marked invalid while there is an
 * error: `aria-invalid`, which any element takes, and which the package's fields draw as their `error`.
 */
function marked(control: ReactNode, ids: string | undefined, invalid: boolean): ReactNode {
  if (!isValidElement<{ 'aria-describedby'?: string; 'aria-invalid'?: unknown }>(control)) return control
  const own = control.props['aria-describedby']
  return cloneElement(control, {
    ...(ids ? { 'aria-describedby': own ? `${own} ${ids}` : ids } : {}),
    ...(invalid ? { 'aria-invalid': true } : {}),
  })
}

/**
 * A control under its label, the label small and semibold; what it is for, and what is wrong, under it, muted, out
 * of the label (which names the control by itself): they describe it, and an error marks it invalid.
 */
export function Field({ label, description, error, htmlFor, className, children }: FieldProps) {
  const id = useId()
  const descriptionId = `${id}-description`
  const errorId = `${id}-error`
  const ids = [description ? descriptionId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined
  const control = marked(children, ids, Boolean(error))

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {htmlFor ? (
        <>
          <label htmlFor={htmlFor} className={LABEL}>
            {label}
          </label>
          {control}
        </>
      ) : (
        <label className="flex flex-col gap-1">
          <span className={LABEL}>{label}</span>
          {control}
        </label>
      )}
      {description && (
        <span id={descriptionId} className="text-xs text-muted-foreground">
          {description}
        </span>
      )}
      {error && (
        <span id={errorId} className="text-xs text-negative">
          {error}
        </span>
      )}
    </div>
  )
}
