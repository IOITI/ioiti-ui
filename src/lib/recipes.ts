// The classes each role takes, the same in every component (design-system/guide/README.md): a component names its role
// here rather than writing its own, so that a menu, a toast or a badge of one component looks as another's, and a new
// component takes them. Internal to the package: an application composes the components.

/** The frame of a section of a page (a Panel) and of every card that stands as one, without its material. */
export const SECTION_FRAME = 'rounded-2xl border border-border/70 bg-surface/50 dark:bg-surface/25'

/** A section of a page, and every card that stands as one: a Panel, a data table's frame, a timeline, a ledger. */
export const SECTION = `${SECTION_FRAME} glass-card`

/** What floats beside its trigger: a popover, a menu, a list of options, a date picker, a panel of notifications. */
export const FLOATING = 'rounded-xl border border-border bg-surface text-foreground shadow-elevated glass-float'

/** What says what a control means, or reads a chart: a Hint, a chart's tooltip, the collapsed sidebar's tip. */
export const TOOLTIP = 'rounded-lg border border-border bg-surface text-foreground shadow-elevated glass-float'

/** A dialog, the search, a tour's card: what floats over the whole page. */
export const DIALOG = 'rounded-2xl border border-border bg-surface text-foreground shadow-elevated glass-float'

/** A toast, a bar that floats over the page (a selection's actions). */
export const TOAST = 'rounded-xl border border-border bg-surface text-foreground shadow-elevated glass-float'

/** A row of a menu or of a list of options; what is under the pointer or the keyboard is `bg-surface-hover`. */
export const MENU_ROW =
  'flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm text-foreground outline-none transition-colors'

/** What is behind a dialog, a sheet, the drawer, the search, a tour. */
export const SCRIM = 'bg-neutral-950/40 dark:bg-black/60 backdrop-blur-[2px] glass:bg-[var(--glass-scrim)]'

/** The scrim as an SVG fill, where a mask cuts a hole in it (a tour's step). */
export const SCRIM_FILL = 'fill-black/40 dark:fill-black/60 glass:fill-(--glass-scrim)'

/** What can't be used: half its strength, the pointer saying so. */
export const DISABLED = 'disabled:cursor-not-allowed disabled:opacity-50'

/** A control that is pressed (a button, an icon button): the pointer, and it gives a little, where motion is allowed. */
export const PRESSABLE = `cursor-pointer motion-safe:active:scale-[0.97] ${DISABLED}`

/** The × of a toast, a chip, a popover's header. */
export const CLOSE_SM =
  'grid size-6 shrink-0 cursor-pointer place-items-center rounded-md text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground [&>svg]:size-3.5'

/** The × of a dialog, a sheet, an alert. */
export const CLOSE_MD =
  'grid size-8 shrink-0 cursor-pointer place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground [&>svg]:size-4'

/** What a state, a figure or a message means. The tones keep their colours in every look. */
export type Tone = 'neutral' | 'positive' | 'negative' | 'warning' | 'info'

/** The tone as text: a figure, an error, a word of state. */
export const TONE_TEXT: Record<Tone, string> = {
  neutral: 'text-muted-foreground',
  positive: 'text-positive',
  negative: 'text-negative',
  warning: 'text-warning',
  info: 'text-info',
}

/**
 * The tone's word on a faint ground of its own colour (a soft badge, a chip, an alert's box): 5 % in light, so that
 * the word keeps 4.5:1 on a hovered row too, 10 % in dark (recipes.test.ts measures it).
 */
export const TONE_SOFT: Record<Tone, string> = {
  neutral: 'bg-muted text-text-secondary',
  positive: 'bg-positive/5 text-positive dark:bg-positive/10',
  negative: 'bg-negative/5 text-negative dark:bg-negative/10',
  warning: 'bg-warning/5 text-warning dark:bg-warning/10',
  info: 'bg-info/5 text-info dark:bg-info/10',
}

/** A line in the tone (an outline badge, an alert's border, a field in error). */
export const TONE_LINE: Record<Tone, string> = {
  neutral: 'border-border',
  positive: 'border-positive/30',
  negative: 'border-negative/30',
  warning: 'border-warning/30',
  info: 'border-info/30',
}

/** The tone filled, the page's own colour on it (a solid badge, a count, a destructive action). */
export const TONE_SOLID: Record<Tone, string> = {
  neutral: 'bg-foreground text-background',
  positive: 'bg-positive text-background',
  negative: 'bg-negative text-background',
  warning: 'bg-warning text-background',
  info: 'bg-info text-background',
}

/** A dot in the tone (a live state, a row's marker). */
export const TONE_MARK: Record<Tone, string> = {
  neutral: 'bg-muted-foreground',
  positive: 'bg-positive',
  negative: 'bg-negative',
  warning: 'bg-warning',
  info: 'bg-info',
}
