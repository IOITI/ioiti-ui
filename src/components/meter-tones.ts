// The tones of a meter, a progress, a bar of a list, a band of a slider: what the state of a figure is, the
// same four everywhere. Their colours are the design's tones, the neutral one the accent's where the look has one.

export type MeterTone = 'neutral' | 'positive' | 'warning' | 'negative'

export const METER_FILL: Record<MeterTone, string> = {
  // In the accent, where the theme has one.
  neutral: 'bg-foreground/70 accent:bg-brand',
  positive: 'bg-positive',
  warning: 'bg-warning',
  negative: 'bg-negative',
}

// The track is a faint step of the fill's own colour, so the state reads across the whole bar.
export const METER_TRACK: Record<MeterTone, string> = {
  neutral: 'bg-foreground/10',
  positive: 'bg-positive/15',
  warning: 'bg-warning/15',
  negative: 'bg-negative/15',
}

/** The tone's colour for a line or a mark of a chart (a reference line, a band). */
export const METER_COLOUR: Record<MeterTone, string> = {
  neutral: 'var(--chart-axis)',
  positive: 'var(--chart-positive)',
  warning: 'var(--warning)',
  negative: 'var(--chart-negative)',
}
