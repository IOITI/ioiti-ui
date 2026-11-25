import { Button } from './ui/button.js'
import type { DateRange } from './ui/calendar.js'
import { DateRangePicker } from './ui/date-picker.js'
import { useMessages } from './locale-context.js'
import { ALL_TIME, lastDays, rangeParams } from '../lib/dateRange.js'

/** A range offered at once: the last so many days (ending on `today`), or a range of its own. */
export interface DateRangePreset {
  label: string
  days?: number
  range?: DateRange
}

/** The days of the presets offered by default, each named in the provider's words ("7 days": `date.lastDays`). */
const PRESET_DAYS = [7, 30, 90]

/** The props of `DateRangeFilter`. */
export interface DateRangeFilterProps {
  value: DateRange
  onChange: (range: DateRange) => void
  /** The ranges offered first; the last 7, 30 and 90 days by default ("7 days", in the provider's words). */
  presets?: DateRangePreset[]
  /** An "All time" button, after the presets (in the provider's words). */
  allTime?: boolean
  /** The day the presets of days end on: today by default, the last day there is data for otherwise. */
  today?: Date
  /** The first and the last day the calendar offers. */
  minDate?: Date
  maxDate?: Date
}

/**
 * Presets first (the ranges people actually ask for), the calendar for anything else: in the provider's words, its
 * locale and its first day of the week (IoitiProvider).
 */
export function DateRangeFilter({
  value,
  onChange,
  presets,
  allTime = true,
  today,
  minDate,
  maxDate,
}: DateRangeFilterProps) {
  const words = useMessages().date
  const offered = presets ?? PRESET_DAYS.map((days) => ({ label: words.lastDays(days), days }))
  const isAllTime = !value.from && !value.to
  const current = rangeParams(value)
  const rangeOf = (preset: DateRangePreset): DateRange => preset.range ?? lastDays(preset.days ?? 1, today)
  const isPreset = (preset: DateRangePreset) => {
    const range = rangeParams(rangeOf(preset))
    return range.from === current.from && range.to === current.to
  }
  return (
    <div className="flex flex-wrap items-center gap-2">
      {offered.map((preset) => (
        <Button
          key={preset.label}
          // Filled: the one cue that says which range the page shows.
          variant={isPreset(preset) ? 'primary' : 'outline'}
          size="sm"
          aria-pressed={isPreset(preset)}
          onClick={() => onChange(rangeOf(preset))}
        >
          {preset.label}
        </Button>
      ))}
      {allTime && (
        <Button variant={isAllTime ? 'primary' : 'outline'} size="sm" aria-pressed={isAllTime} onClick={() => onChange(ALL_TIME)}>
          {words.allTime}
        </Button>
      )}
      <DateRangePicker
        value={value}
        onChange={onChange}
        placeholder={words.customRange}
        align="end"
        minDate={minDate}
        maxDate={maxDate}
      />
    </div>
  )
}
