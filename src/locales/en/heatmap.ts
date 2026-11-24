import type { MessageKit } from '../../lib/messages.js'

/** ActivityHeatmap. */
export const heatmap = {
  /** "contributions" ("contribution" after 1): the noun after each number, where the application names no unit. */
  unit: (count: number, { plural }: MessageKit) => plural(count, { one: 'contribution', other: 'contributions' }),
  /** "Less": the legend's end of the smallest values. */
  less: 'Less',
  /** "More": the legend's end of the largest values. */
  more: 'More',
  /** "56 contributions per week": the summary of a grid of weekdays and hours, its total. */
  summaryPerWeek: ({ total, unit }: { total: string; unit: string }) => `${total} ${unit} per week`,
  /** "1,234 contributions in the last year": the summary of a calendar of a year, its total. */
  summaryLastYear: ({ total, unit }: { total: string; unit: string }) => `${total} ${unit} in the last year`,
  /** "120 contributions in the last 5 months" ("in the last month"): the summary of a calendar of months, its total. */
  summaryLastMonths: ({ total, unit, months }: { total: string; unit: string; months: number }, { plural }: MessageKit) =>
    `${total} ${unit} ${plural(months, { one: 'in the last month', other: 'in the last # months' })}`,
  /** "12 contributions in the last 4 weeks" ("in the last week"): the summary of a calendar of a few weeks, its total. */
  summaryLastWeeks: ({ total, unit, weeks }: { total: string; unit: string; weeks: number }, { plural }: MessageKit) =>
    `${total} ${unit} ${plural(weeks, { one: 'in the last week', other: 'in the last # weeks' })}`,
  /** "Best Thu, 22 Oct 2026 · +€120.00": the cell of the largest gain on a signed scale, and its value. */
  best: ({ title, value }: { title: string; value: string }) => `Best ${title} · ${value}`,
  /** "worst Fri, 3 Oct 2026 · −€877.16": the cell of the largest loss on a signed scale, said after the best. */
  worst: ({ title, value }: { title: string; value: string }) => `worst ${title} · ${value}`,
  /** "Peak Thu, 22 Oct 2026 · 12": the cell of the largest value, and its value. */
  peak: ({ title, value }: { title: string; value: string }) => `Peak ${title} · ${value}`,
  /** "Mon · 09:00": an hour's cell, its day and its hour in the locale's clock. */
  hourCell: ({ day, hour }: { day: string; hour: string }) => `${day} · ${hour}`,
  /** "Activity heatmap. 12 contributions in the last 4 weeks": the grid's name where the application gives none. */
  label: (summary: string) => `Activity heatmap. ${summary}`,
  /** "Thu, 22 Oct 2026: 3 contributions": what a screen reader is told of the cell reached. */
  status: ({ title, value }: { title: string; value: string }) => `${title}: ${value}`,
}
