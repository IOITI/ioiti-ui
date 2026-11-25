// The tones of a meter, a progress, a bar of a list, a band of a slider, a reference of a chart: what the state of a
// figure is, the same four everywhere, a status's (StatusTone without info). Their colours are the design's tones, the
// neutral one the accent's where the look has one.

/** A meter's tone: neutral, success, warning, danger. */
export type MeterTone = 'neutral' | 'success' | 'warning' | 'danger'

export const METER_FILL: Record<MeterTone, string> = {
  // In the accent, where the theme has one.
  neutral: 'bg-foreground/70 accent:bg-brand',
  success: 'bg-positive',
  warning: 'bg-warning',
  danger: 'bg-negative',
}

// The track is a faint step of the fill's own colour, so the state reads across the whole bar.
export const METER_TRACK: Record<MeterTone, string> = {
  neutral: 'bg-foreground/10',
  success: 'bg-positive/15',
  warning: 'bg-warning/15',
  danger: 'bg-negative/15',
}

/** The tone's colour for a line or a mark of a chart (a reference line, a band). */
export const METER_COLOUR: Record<MeterTone, string> = {
  neutral: 'var(--chart-axis)',
  success: 'var(--chart-positive)',
  warning: 'var(--warning)',
  danger: 'var(--chart-negative)',
}
