/**
 * A field's border, at rest, under the pointer and in focus: its own (the form's Input's, in both themes and the
 * accent's in focus), or the error's. One set or the other, never both: the error's classes added over the others
 * lost to their `dark:` and `accent:` variants (more specific), and an error showed no red in dark.
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
    ? 'border-neutral-300 hover:border-neutral-500 dark:border-[#1F1F1F] dark:hover:border-[#4A4A4A] focus:border-neutral-500 dark:focus:border-[#4A4A4A] accent:focus:border-brand'
    : 'border-neutral-300 hover:border-neutral-500 dark:border-[#1F1F1F] dark:hover:border-[#4A4A4A] focus-within:border-neutral-500 dark:focus-within:border-[#4A4A4A] accent:focus-within:border-brand'
}

/**
 * Whether a field is in error: its own `error`, or `aria-invalid` given to it (Field marks its control so, which
 * any element takes, where an `error` prop would reach the DOM of a control that has none).
 */
export function invalidOf(error: unknown, ariaInvalid: unknown): boolean {
  return Boolean(error) || ariaInvalid === true || ariaInvalid === 'true'
}
