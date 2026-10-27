import { Button } from './ui/button.js'
import type { DateRange } from './ui/calendar.js'
import { DateRangePicker } from './ui/date-picker.js'
import { ALL_TIME, lastDays, rangeParams } from '../lib/dateRange.js'

/** A range offered at once: the last so many days (ending on `today`), or a range of its own. */
export interface DateRangePreset {
  label: string
  days?: number
  range?: DateRange
}

const PRESETS: DateRangePreset[] = [
  { label: '7 days', days: 7 },
  { label: '30 days', days: 30 },
  { label: '90 days', days: 90 },
]

interface DateRangeFilterProps {
  value: DateRange
  onChange: (range: DateRange) => void
  /** The ranges offered first; the last 7, 30 and 90 days by default. */
  presets?: DateRangePreset[]
  /** An "All time" button, after the presets. */
  allTime?: boolean
  /** The day the presets of days end on: today by default, the last day there is data for otherwise. */
  today?: Date
  /** The first and the last day the calendar offers. */
  minDate?: Date
  maxDate?: Date
}

/** Presets first (the ranges people actually ask for), the calendar for anything else. */
export function DateRangeFilter({
  value,
  onChange,
  presets = PRESETS,
  allTime = true,
  today,
  minDate,
  maxDate,
}: DateRangeFilterProps) {
  const isAllTime = !value.from && !value.to
  const current = rangeParams(value)
  const rangeOf = (preset: DateRangePreset): DateRange => preset.range ?? lastDays(preset.days ?? 1, today)
  const isPreset = (preset: DateRangePreset) => {
    const range = rangeParams(rangeOf(preset))
    return range.from === current.from && range.to === current.to
  }
  return (
    <div className="flex flex-wrap items-center gap-2">
      {presets.map((preset) => (
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
          All time
        </Button>
      )}
      <DateRangePicker
        value={value}
        onChange={onChange}
        placeholder="Custom range"
        align="end"
        locale="en-GB"
        weekStartsOn={1}
        minDate={minDate}
        maxDate={maxDate}
      />
    </div>
  )
}
