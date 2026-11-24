import { cloneElement, createContext, isValidElement, useCallback, useContext, useId, useLayoutEffect, useMemo, useState } from 'react'
import type { ReactElement, ReactNode } from 'react'

/**
 * What a FormItem holds, drawn: its control; the control a FormControl holds, by the id it gives it (what the
 * control says of itself comes first); a description; a message (what is wrong).
 */
export interface FieldPart {
  kind: 'control' | 'held' | 'description' | 'message'
  /** The id it is drawn with. */
  id: string
}

/**
 * What a field (a FormItem, a Field) tells what it holds: the id its control takes, what describes the control, and
 * whether its value is wrong. The package's controls read it (`useFieldControl`); a control from elsewhere, which
 * cannot, is given the same as props by FormControl or Field (`markControl`).
 */
export interface FieldContextValue {
  /** The id a control without one of its own takes; none where a label around the control names it (a Field's). */
  id?: string
  /** The id of the control drawn in a FormItem, its own or the field's: what its FormLabel names (`htmlFor`). */
  controlId?: string
  /**
   * What describes the control, each id once, its descriptions' before its errors' (`aria-describedby`): a Field's,
   * or the ids a FormItem's FormDescription and FormMessage are drawn with (each its own: two never share one).
   */
  describedBy?: string
  /** Whether its value is wrong: an error given to the field, or a message under its control. */
  invalid: boolean
  /** How a FormItem's parts say they are drawn, with their id, or gone (no part). */
  report?: (key: string, part?: FieldPart) => void
}

export const FieldContext = createContext<FieldContextValue | null>(null)

/** The field around a control, or a part of one; null outside any. */
export function useFieldContext(): FieldContextValue | null {
  return useContext(FieldContext)
}

/** Ids for `aria-describedby`, each once, in the order given; none for nothing. */
export function joinIds(...lists: (string | null | undefined | false)[]): string | undefined {
  const ids = new Set(lists.flatMap((list) => (list ? list.split(/\s+/) : [])).filter(Boolean))
  return ids.size ? [...ids].join(' ') : undefined
}

/**
 * A part of a FormItem says it is drawn, under the id it has, before the page is painted: its control is then
 * described by it, or named by its label. Nothing while `drawn` is false (a FormMessage with nothing to say).
 */
export function useFieldPart(kind: FieldPart['kind'], id: string | undefined, drawn = true): void {
  const report = useContext(FieldContext)?.report
  const key = useId()
  useLayoutEffect(() => {
    if (!report || !id || !drawn) return
    report(key, { kind, id })
    return () => report(key)
  }, [report, key, kind, id, drawn])
}

/**
 * The id of a FormItem's description or message: the one it is given, else its own in a FormItem (none outside
 * one, as before), said to the item while it is drawn, so that the item's control is described by it.
 */
export function useFieldPartId(kind: 'description' | 'message', given: string | undefined, drawn = true): string | undefined {
  const inItem = Boolean(useContext(FieldContext)?.report)
  const own = useId()
  const id = given ?? (inItem ? `${own}-${kind}` : undefined)
  useFieldPart(kind, id, drawn)
  return id
}

/**
 * A control's id, what describes it and whether it is wrong: its own first, then the field's around it, each id
 * once (a Field also gives them as props to a control it cannot tell from one of elsewhere). Its id is said to a
 * FormItem, whose FormLabel then names it.
 */
export function useFieldControl(own: { id?: string; describedBy?: string; invalid?: boolean }) {
  const field = useContext(FieldContext)
  const id = own.id ?? field?.id
  useFieldPart('control', id)
  return {
    id,
    describedBy: joinIds(own.describedBy, field?.describedBy),
    invalid: Boolean(own.invalid) || Boolean(field?.invalid),
  }
}

/**
 * What a FormItem tells what it holds: one id for its control (that of a field around it, else its own), what
 * describes it as its FormDescription and FormMessage are drawn, and whether it is wrong (its `error`, or a message
 * under it). A field around it describes it too.
 */
export function useFormItemField(error: unknown): FieldContextValue {
  const outer = useContext(FieldContext)
  const id = useId()
  const [parts, setParts] = useState<Record<string, FieldPart>>({})
  const report = useCallback((key: string, part?: FieldPart) => {
    setParts((now) => {
      const was = now[key]
      if (part ? was?.kind === part.kind && was.id === part.id : !was) return now
      const next = { ...now }
      if (part) next[key] = part
      else delete next[key]
      return next
    })
  }, [])
  const wrong = Boolean(error)
  return useMemo(() => {
    const drawn = Object.values(parts)
    const of = (kind: FieldPart['kind']) => drawn.filter((part) => part.kind === kind).map((part) => part.id)
    const messages = of('message')
    return {
      id: outer?.id ?? `${id}-control`,
      controlId: of('control')[0] ?? of('held')[0],
      describedBy: joinIds(outer?.describedBy, ...of('description'), ...messages),
      invalid: wrong || messages.length > 0 || Boolean(outer?.invalid),
      report,
    }
  }, [outer, id, parts, wrong, report])
}

interface MarkedProps {
  id?: string
  'aria-describedby'?: string
  'aria-invalid'?: unknown
}

/** The elements that are a control themselves; another (a `div`) holds one, which reads the field. */
const CONTROLS = new Set(['input', 'select', 'textarea', 'button'])

/** Whether a FormControl's child takes the field's id: a control, or a component (which hands it to its own). */
const takesId = (control: ReactNode): control is ReactElement<MarkedProps> =>
  isValidElement<MarkedProps>(control) && (typeof control.type !== 'string' || CONTROLS.has(control.type))

/**
 * A control that cannot read the field (one from outside the package) given what the field says, as props: what
 * describes it after its own description, and `aria-invalid` while it is wrong. Beside its label (`beside`, a
 * FormControl's child), the field's id too where it has none, and nothing on an element that only holds the
 * control. The package's controls read the field as well, and join its ids with their own once each.
 */
export function markControl(control: ReactNode, field: FieldContextValue | null, { beside = false } = {}): ReactNode {
  if (!field || !isValidElement<MarkedProps>(control)) return control
  if (beside && !takesId(control)) return control
  const own = control.props
  const marks: MarkedProps = {
    ...(beside && own.id === undefined && field.id !== undefined ? { id: field.id } : {}),
    ...(field.describedBy ? { 'aria-describedby': joinIds(own['aria-describedby'], field.describedBy) } : {}),
    ...(field.invalid ? { 'aria-invalid': true } : {}),
  }
  return Object.keys(marks).length ? cloneElement(control, marks) : control
}

/** The id of the control beside its label (a FormControl's child), as it is drawn: its own, or the field's. */
export function besideId(control: ReactNode, field: FieldContextValue | null): string | undefined {
  return field && takesId(control) ? (control.props.id ?? field.id) : undefined
}
