import { Check, Loader2, Pencil, X } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'

import { cn } from '../lib/utils.js'
import { Hint } from './Hint.js'
import { ErrorText } from './messages.js'

/** What a save answered: nothing or `true` for done, `false` to stay in the field, words for what went wrong. */
type Saved = void | boolean | string

interface InlineEditProps {
  value: string
  /** Saves the new value; may take its time (a Promise). */
  onSave: (value: string) => Saved | Promise<Saved>
  /** What the value is, for a screen reader: "Name of the run". */
  label: string
  placeholder?: string
  /** `text` in a sentence's size; `title` a heading's (`as` says which). */
  variant?: 'text' | 'title'
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span'
  /** What is wrong with a value, before it is saved. */
  validate?: (value: string) => string | undefined
  readOnly?: boolean
  className?: string
}

/**
 * A value edited where it is shown: a name, a title. It reads as text; a click or Enter turns it into a
 * field, Enter saves and Escape gives up. A save that takes its time shows it; one that fails says why and
 * keeps the field. As Elastic UI's inline edit does.
 */
export function InlineEdit({
  value,
  onSave,
  label,
  placeholder = 'Add a value',
  variant = 'text',
  as: Tag = variant === 'title' ? 'h2' : 'span',
  validate,
  readOnly = false,
  className,
}: InlineEditProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const errorId = useId()
  const reading = useRef<HTMLButtonElement>(null)
  const field = useRef<HTMLInputElement>(null)
  const wasEditing = useRef(false)

  // Into the field when it opens; back on the value when it closes.
  useEffect(() => {
    if (editing) {
      field.current?.focus()
      field.current?.select()
    }
    else if (wasEditing.current) reading.current?.focus()
    wasEditing.current = editing
  }, [editing])

  const title = variant === 'title'
  const size = title ? 'text-lg font-semibold tracking-tight' : 'text-sm'

  const start = () => {
    if (readOnly) return
    setDraft(value)
    setError(null)
    setEditing(true)
  }
  const cancel = () => {
    setEditing(false)
    setError(null)
  }
  const save = async () => {
    if (saving) return
    const wrong = validate?.(draft)
    if (wrong) {
      setError(wrong)
      return
    }
    if (draft === value) {
      cancel()
      return
    }
    setSaving(true)
    setError(null)
    try {
      const answer = await onSave(draft)
      if (typeof answer === 'string') setError(answer)
      else if (answer !== false) setEditing(false)
    } catch {
      setError("Couldn't save. Try again.")
    } finally {
      setSaving(false)
    }
  }
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      void save()
    } else if (event.key === 'Escape') {
      // Its own: not a dialog's or a sheet's around it.
      event.preventDefault()
      event.stopPropagation()
      cancel()
    }
  }

  if (!editing) {
    return (
      <Tag className={cn('min-w-0', size, className)}>
        <button
          ref={reading}
          type="button"
          disabled={readOnly}
          onClick={start}
          className={cn(
            'group -mx-1.5 inline-flex max-w-full items-center gap-1.5 rounded-md px-1.5 py-0.5 text-left transition-colors',
            !readOnly && 'hover:bg-surface-hover',
            readOnly && 'cursor-default',
          )}
        >
          <span className={cn('truncate', value ? 'text-text-primary' : 'text-muted-foreground')}>{value || placeholder}</span>
          {!readOnly && (
            <>
              <Pencil aria-hidden className="size-3.5 shrink-0 text-text-muted opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />
              <span className="sr-only">, edit the {label.toLowerCase()}</span>
            </>
          )}
        </button>
      </Tag>
    )
  }

  return (
    <div className={cn('flex min-w-0 flex-col gap-1', className)}>
      <div className="flex items-center gap-1">
        <input
          ref={field}
          type="text"
          aria-label={label}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          value={draft}
          readOnly={saving}
          placeholder={placeholder}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={onKeyDown}
          className={cn(
            'h-9 min-w-0 flex-1 rounded-md border bg-white px-2 text-text-primary focus:outline-none dark:bg-[#141414]',
            'border-neutral-300 focus:border-neutral-500 dark:border-[#1F1F1F] dark:focus:border-[#4A4A4A] accent:focus:border-brand',
            error && 'border-negative/60 focus:border-negative',
            size,
          )}
        />
        <Hint content="Save">
          <button
            type="button"
            aria-label="Save"
            onClick={() => void save()}
            className="grid size-8 shrink-0 place-items-center rounded-md text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary [&>svg]:size-4"
          >
            {saving ? <Loader2 aria-hidden className="motion-safe:animate-spin" /> : <Check aria-hidden />}
          </button>
        </Hint>
        <Hint content="Cancel">
          <button
            type="button"
            aria-label="Cancel"
            disabled={saving}
            onClick={cancel}
            className="grid size-8 shrink-0 place-items-center rounded-md text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary disabled:opacity-40 [&>svg]:size-4"
          >
            <X aria-hidden />
          </button>
        </Hint>
      </div>
      {error && (
        <span id={errorId}>
          <ErrorText className="text-xs">{error}</ErrorText>
        </span>
      )}
    </div>
  )
}
