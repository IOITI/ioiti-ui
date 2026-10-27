/**
 * More to say of a point or a category of a chart than its series' values: a day's trades, a group's share
 * won. Shown under the values in the chart's tooltip, and given to screen readers in its table.
 */
export interface ChartDetail {
  label: string
  value: string
}

/** The details as a table's cell says them: "Trades 4, Won 75%". */
export function detailsText(details: readonly ChartDetail[]): string {
  return details.map((detail) => `${detail.label} ${detail.value}`).join(', ')
}
