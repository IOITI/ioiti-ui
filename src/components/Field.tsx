import { useId, useMemo } from 'react'
import type { ReactNode } from 'react'

import { cn } from '../lib/utils.js'
import { FieldContext, joinIds, markControl, useFieldContext, useFieldLabelFor } from './field-context.js'
import type { FieldContextValue } from './field-context.js'

/** The label: small, in the primary text and semibold, so that it stands out of a form; its description stays muted. */
const LABEL = 'text-xs font-semibold text-foreground'

/** The props of `Field`. */
export interface FieldProps {
  label: ReactNode
  /**
   * What the value is for, or how to write it: under the control, in muted text, read out with it
   * (`aria-describedby`). The label alone names the control.
   */
  description?: ReactNode
  /**
   * What is wrong with the value, under the control: read out with it (`aria-describedby`), and the control marked
   * invalid (`aria-invalid`), which the package's fields draw in the error's colour.
   */
  error?: ReactNode
  /**
   * The control's `id`, for a control that must not sit inside its label: a Combobox (a label passes
   * an option's click on to its field). The label is then beside it, and names it by `htmlFor`; the package's
   * Input, Select, Textarea and switches take it without being given it.
   */
  htmlFor?: string
  className?: string
  /** The control: an Input, a Select, a Combobox, a Switch… */
  children: ReactNode
}

/**
 * A control under its label, the label small and semibold; what it is for, and what is wrong, under it, muted, out
 * of the label (which names the control by itself): they describe it, and an error marks it invalid. The package's
 * controls read them wherever they are in it (in a Hint, beside a button); one from elsewhere, which cannot, is
 * given them as props when it is the Field's child. A control of the package says the id it is drawn with, which the
 * label points to: a group (radios, segments) is then named by the label's words (`aria-labelledby`), and none of
 * its parts by the label itself.
 */
export function Field({ label, description, error, htmlFor, className, children }: FieldProps) {
  const id = useId()
  const outer = useFieldContext()
  const labelId = `${id}-label`
  const descriptionId = `${id}-description`
  const errorId = `${id}-error`
  const described = Boolean(description)
  const wrong = Boolean(error)
  // The id its control says it has, for the label around it; what is said goes on to a FormItem around the Field.
  const { controlId, report } = useFieldLabelFor(outer)
  // In a FormItem, one control: the item's id, its description and its message, and what the item's parts say.
  const field = useMemo<FieldContextValue>(
    () => ({
      ...outer,
      id: htmlFor ?? outer?.id,
      labelledBy: labelId,
      describedBy: joinIds(outer?.describedBy, described ? descriptionId : null, wrong ? errorId : null),
      invalid: wrong || Boolean(outer?.invalid),
      report,
    }),
    [outer, htmlFor, labelId, described, descriptionId, wrong, errorId, report],
  )
  const control = markControl(children, field)

  return (
    <FieldContext.Provider value={field}>
      <div className={cn('flex flex-col gap-1', className)}>
        {htmlFor ? (
          <>
            <label id={labelId} htmlFor={htmlFor} className={LABEL}>
              {label}
            </label>
            {control}
          </>
        ) : (
          <label htmlFor={controlId} className="flex flex-col gap-1">
            <span id={labelId} className={LABEL}>
              {label}
            </span>
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
    </FieldContext.Provider>
  )
}
