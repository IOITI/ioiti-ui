import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from './ui/button.js';
import { DateRangePicker } from './ui/date-picker.js';
import { useMessages } from './locale-context.js';
import { ALL_TIME, lastDays, rangeParams } from '../lib/dateRange.js';
/** The days of the presets offered by default, each named in the provider's words ("7 days": `date.lastDays`). */
const PRESET_DAYS = [7, 30, 90];
/**
 * Presets first (the ranges people actually ask for), the calendar for anything else: in the provider's words, its
 * locale and its first day of the week (IoitiProvider).
 */
export function DateRangeFilter({ value, onChange, presets, allTime = true, today, minDate, maxDate, }) {
    const words = useMessages().date;
    const offered = presets ?? PRESET_DAYS.map((days) => ({ label: words.lastDays(days), days }));
    const isAllTime = !value.from && !value.to;
    const current = rangeParams(value);
    const rangeOf = (preset) => preset.range ?? lastDays(preset.days ?? 1, today);
    const isPreset = (preset) => {
        const range = rangeParams(rangeOf(preset));
        return range.from === current.from && range.to === current.to;
    };
    return (_jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [offered.map((preset) => (_jsx(Button, { 
                // Filled: the one cue that says which range the page shows.
                variant: isPreset(preset) ? 'primary' : 'outline', size: "sm", "aria-pressed": isPreset(preset), onClick: () => onChange(rangeOf(preset)), children: preset.label }, preset.label))), allTime && (_jsx(Button, { variant: isAllTime ? 'primary' : 'outline', size: "sm", "aria-pressed": isAllTime, onClick: () => onChange(ALL_TIME), children: words.allTime })), _jsx(DateRangePicker, { value: value, onChange: onChange, placeholder: words.customRange, align: "end", minDate: minDate, maxDate: maxDate })] }));
}
