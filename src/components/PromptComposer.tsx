import { useId, useLayoutEffect, useRef, useState } from 'react'
import type { ClipboardEvent, DragEvent, KeyboardEvent, ReactNode } from 'react'
import { ArrowUp, Square } from 'lucide-react'

import { cn } from '../lib/utils.js'
import { Hint } from './Hint.js'

interface PromptSuggestion {
  /** What the chip says. */
  label: string
  /** What it puts in the field, to be read and sent. */
  prompt: string
}

interface PromptComposerProps {
  value: string
  onValueChange: (value: string) => void
  /** The text sent, without its spaces around. */
  onSubmit: (value: string) => void
  /** While `busy`: the request under way stopped. Without it, nothing can be sent until it ends. */
  onStop?: () => void
  busy?: boolean
  disabled?: boolean
  /** Why nothing can be sent: shown on the button's hint, on hover, focus and tap. */
  disabledReason?: ReactNode
  /** The field's name, said to screen readers, and shown unless `hideLabel`. */
  label: string
  hideLabel?: boolean
  placeholder?: string
  /** Requests to start from: a chip fills the field, which is then read and sent as typed. */
  suggestions?: PromptSuggestion[]
  /** Under the field: what a request costs, the model it goes to. */
  footer?: ReactNode
  /**
   * Under the field, before the footer: what the request goes with (a model's menu, a meter). Each is kept
   * whole; where they do not all fit beside the send button (a phone), they wrap onto another line.
   */
  controls?: ReactNode
  maxLength?: number
  minRows?: number
  /** Longer, the field scrolls. */
  maxRows?: number
  /**
   * It floats over what scrolls under it, at a page's foot, with no band behind it: its frame lifted by a shadow,
   * blurred glass under the glass material.
   */
  floating?: boolean
  /** Above the field, inside its frame: what the request goes with (`AttachmentChip`s). Each wraps whole. */
  attachments?: ReactNode
  /**
   * Files dropped on its frame (shown while one is dragged over it) or pasted into its field (a screenshot):
   * given here, what to do with them the application's. A paste of text stays a paste. Not while `disabled`.
   */
  onFiles?: (files: File[]) => void
  className?: string
}

/** Whether a drag carries files (a selection of text does not). */
function carriesFiles(event: DragEvent<HTMLElement>): boolean {
  return Array.from(event.dataTransfer?.types ?? []).includes('Files')
}

// A line of the field when the browser says none (jsdom): its text is 14 px on 1.5.
const FALLBACK_LINE_HEIGHT = 21

/**
 * A request typed to an assistant: a field that grows with its text, sent with Enter (a new line with
 * Shift+Enter; on a touch screen, Enter is a new line and the button sends), stopped while it is
 * answered, and requests to start from. What it goes with is shown above the field (`attachments`), and
 * files dropped on it or pasted into it are handed over (`onFiles`).
 */
export function PromptComposer({
  value,
  onValueChange,
  onSubmit,
  onStop,
  busy = false,
  disabled = false,
  disabledReason,
  label,
  hideLabel = false,
  placeholder,
  suggestions = [],
  footer,
  controls,
  maxLength,
  minRows = 2,
  maxRows = 10,
  floating = false,
  attachments,
  onFiles,
  className,
}: PromptComposerProps) {
  const id = useId()
  const field = useRef<HTMLTextAreaElement>(null)
  // A drag of files over the frame: entered and left once for each element under it, so counted.
  const [dragged, setDragged] = useState(0)
  const takesFiles = !!onFiles && !disabled
  const over = maxLength !== undefined && value.length > maxLength
  const canSend = !disabled && !busy && value.trim() !== '' && !over

  // Its height follows its text, from minRows to maxRows.
  useLayoutEffect(() => {
    const element = field.current
    if (!element) return
    const style = window.getComputedStyle(element)
    const line = Number.parseFloat(style.lineHeight) || FALLBACK_LINE_HEIGHT
    const padding = (Number.parseFloat(style.paddingTop) || 0) + (Number.parseFloat(style.paddingBottom) || 0)
    element.style.height = 'auto'
    const wanted = Math.max(element.scrollHeight, line * minRows + padding)
    element.style.height = `${Math.min(wanted, line * maxRows + padding)}px`
  }, [value, minRows, maxRows])

  function send() {
    if (canSend) onSubmit(value.trim())
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing) return
    // On a touch screen, Enter is the keyboard's new line: the button sends.
    if (window.matchMedia?.('(pointer: coarse)').matches) return
    event.preventDefault()
    send()
  }

  function onPaste(event: ClipboardEvent<HTMLTextAreaElement>) {
    const files = Array.from(event.clipboardData?.files ?? [])
    if (!takesFiles || files.length === 0) return
    event.preventDefault()
    onFiles?.(files)
  }

  const dropping = takesFiles && dragged > 0
  const frameDrag = takesFiles
    ? {
        onDragEnter: (event: DragEvent<HTMLDivElement>) => {
          if (!carriesFiles(event)) return
          event.preventDefault()
          setDragged((count) => count + 1)
        },
        onDragOver: (event: DragEvent<HTMLDivElement>) => {
          if (!carriesFiles(event)) return
          event.preventDefault()
          event.dataTransfer.dropEffect = 'copy'
        },
        onDragLeave: (event: DragEvent<HTMLDivElement>) => {
          if (carriesFiles(event)) setDragged((count) => Math.max(0, count - 1))
        },
        onDrop: (event: DragEvent<HTMLDivElement>) => {
          const files = Array.from(event.dataTransfer?.files ?? [])
          setDragged(0)
          if (files.length === 0) return
          event.preventDefault()
          onFiles?.(files)
        },
      }
    : {}

  function suggest(prompt: string) {
    onValueChange(prompt)
    const element = field.current
    if (!element) return
    element.focus()
    // At the end of what it put, once React has written it.
    requestAnimationFrame(() => element.setSelectionRange(prompt.length, prompt.length))
  }

  const reason = disabled && !busy ? disabledReason : undefined
  const sendButton = (
    <button
      type="button"
      onClick={send}
      disabled={!canSend}
      aria-label="Send"
      className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-[opacity,transform] duration-150 active:scale-95 disabled:opacity-40 accent:bg-(image:--brand-fill) accent:text-brand-fill-foreground"
    >
      <ArrowUp className="h-4 w-4" aria-hidden />
    </button>
  )

  return (
    <div className={cn('min-w-0', className)}>
      <label htmlFor={id} className={cn('mb-1.5 block text-sm font-medium text-foreground', hideLabel && 'sr-only')}>
        {label}
      </label>
      {suggestions.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5" role="group" aria-label="Requests to start from">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.label}
              type="button"
              disabled={disabled || busy}
              onClick={() => suggest(suggestion.prompt)}
              className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted-foreground transition-colors duration-150 hover:border-border-hover hover:text-foreground disabled:opacity-50"
            >
              {suggestion.label}
            </button>
          ))}
        </div>
      )}
      <div
        {...frameDrag}
        data-dropping={dropping || undefined}
        className={cn(
          'rounded-2xl border border-border bg-surface transition-colors duration-150 focus-within:border-border-hover',
          // Glass's edge would hide the border that shows its focus: the focus is said over it.
          floating && 'shadow-[var(--shadow-elevated)] glass-float glass:focus-within:border-border-hover',
          // Files dragged over it: where they would go.
          dropping && 'border-dashed border-neutral-500 bg-surface-hover dark:border-neutral-400 accent:border-brand',
        )}
      >
        {attachments && (
          <div className="flex flex-wrap gap-1.5 px-3 pt-2.5" role="group" aria-label="Attached">
            {attachments}
          </div>
        )}
        <textarea
          ref={field}
          id={id}
          value={value}
          rows={minRows}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={over || undefined}
          onChange={(event) => onValueChange(event.target.value)}
          onKeyDown={onKeyDown}
          onPaste={onPaste}
          className="block w-full resize-none overflow-y-auto bg-transparent px-3.5 pt-3 text-sm leading-normal text-foreground outline-none placeholder:text-muted-foreground disabled:opacity-60"
        />
        <div className="flex items-center justify-between gap-3 px-3 pb-2.5 pt-1">
          {/* What does not fit beside the send button wraps under itself, never under the button: the controls
              onto another line, each whole, and the footer onto its own, cut short there. */}
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1">
            {controls && <div className="-ml-1 flex min-w-0 flex-wrap items-center gap-1">{controls}</div>}
            <div className="min-w-0 max-w-full truncate text-xs text-muted-foreground">
              {maxLength !== undefined && (
                <span className={cn('tabular-nums', over && 'text-negative')}>
                  {value.length.toLocaleString()} / {maxLength.toLocaleString()}
                  {footer ? ' · ' : ''}
                </span>
              )}
              {footer}
            </div>
          </div>
          {busy && onStop ? (
            <button
              type="button"
              onClick={onStop}
              aria-label="Stop"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border bg-surface-hover text-foreground transition-transform duration-150 active:scale-95"
            >
              <Square className="h-3.5 w-3.5 fill-current" aria-hidden />
            </button>
          ) : reason ? (
            <Hint content={reason} wrap>
              {sendButton}
            </Hint>
          ) : (
            sendButton
          )}
        </div>
      </div>
    </div>
  )
}
