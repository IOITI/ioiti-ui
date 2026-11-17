/**
 * A field's border, at rest, under the pointer and in focus: its own (the design's tokens, `muted-foreground` in focus as the text it holds, the
 * accent's where the look has one), or the error's. One set or the other, never both: the error's classes added over
 * the others lost to their `accent:` variants (more specific), and an error showed no red in an accent.
 *
 * `focus-within` for a field whose frame holds the control (MultiSelect's chips and its input).
 */
export function fieldBorder(error: unknown, focus: 'focus' | 'focus-within' = 'focus'): string {
  if (error) {
    return focus === 'focus'
      ? 'border-negative/60 hover:border-negative focus:border-negative'
      : 'border-negative/60 hover:border-negative focus-within:border-negative'
  }
  return focus === 'focus'
    ? 'border-border hover:border-border-hover focus:border-muted-foreground accent:focus:border-brand'
    : 'border-border hover:border-border-hover focus-within:border-muted-foreground accent:focus-within:border-brand'
}

/**
 * Whether a field is in error: its own `error`, or `aria-invalid` given to it (Field marks its control so, which
 * any element takes, where an `error` prop would reach the DOM of a control that has none).
 */
export function invalidOf(error: unknown, ariaInvalid: unknown): boolean {
  return Boolean(error) || ariaInvalid === true || ariaInvalid === 'true'
}
