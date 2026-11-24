// The colours of a chart's series, from the design's tokens (theme.css). One series takes the series colour,
// which an accent makes its own. Things compared take the four compare colours, in their order and never
// recycled: every pair of them was checked for colour-blind readers, and no fifth colour passes. A fifth
// series is given its colour by the caller, or the muted grey.
import { devWarn } from './dev.js'

const COMPARE = ['var(--chart-compare-1)', 'var(--chart-compare-2)', 'var(--chart-compare-3)', 'var(--chart-compare-4)']

export const SERIES_COLOUR = 'var(--chart-series)'
export const MUTED_COLOUR = 'var(--chart-muted)'
export const POSITIVE_COLOUR = 'var(--chart-positive)'
export const NEGATIVE_COLOUR = 'var(--chart-negative)'
export const GRID_COLOUR = 'var(--chart-grid)'
export const AXIS_COLOUR = 'var(--chart-axis)'

/** The colour of each series, in order: a colour given wins, the design's otherwise. */
export function seriesColours(given: (string | undefined)[]): string[] {
  if (given.length === 1) return [given[0] ?? SERIES_COLOUR]
  return given.map((colour, index) => {
    if (colour) return colour
    if (index < COMPARE.length) return COMPARE[index]
    // Said once for each count, in development only.
    devWarn('chart-series-beyond-four', `${given.length} series`)
    return MUTED_COLOUR
  })
}
