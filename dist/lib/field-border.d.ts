/**
 * A field's border, at rest, under the pointer and in focus: its own (the form's Input's, in both themes and the
 * accent's in focus), or the error's. One set or the other, never both: the error's classes added over the others
 * lost to their `dark:` and `accent:` variants (more specific), and an error showed no red in dark.
 *
 * `focus-within` for a field whose frame holds the control (MultiSelect's chips and its input).
 */
export declare function fieldBorder(error: unknown, focus?: 'focus' | 'focus-within'): string;
/**
 * Whether a field is in error: its own `error`, or `aria-invalid` given to it (Field marks its control so, which
 * any element takes, where an `error` prop would reach the DOM of a control that has none).
 */
export declare function invalidOf(error: unknown, ariaInvalid: unknown): boolean;
