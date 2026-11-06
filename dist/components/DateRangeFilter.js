import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from './ui/button.js';
import { DateRangePicker } from './ui/date-picker.js';
import { ALL_TIME, lastDays, rangeParams } from '../lib/dateRange.js';
const PRESETS = [
    { label: '7 days', days: 7 },
    { label: '30 days', days: 30 },
    { label: '90 days', days: 90 },
];
/** Presets first (the ranges people actually ask for), the calendar for anything else. */
export function DateRangeFilter({ value, onChange, presets = PRESETS, allTime = true, today, minDate, maxDate, }) {
    const isAllTime = !value.from && !value.to;
    const current = rangeParams(value);
    const rangeOf = (preset) => preset.range ?? lastDays(preset.days ?? 1, today);
    const isPreset = (preset) => {
        const range = rangeParams(rangeOf(preset));
        return range.from === current.from && range.to === current.to;
    };
    return (_jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [presets.map((preset) => (_jsx(Button, { 
                // Filled: the one cue that says which range the page shows.
                variant: isPreset(preset) ? 'primary' : 'outline', size: "sm", "aria-pressed": isPreset(preset), onClick: () => onChange(rangeOf(preset)), children: preset.label }, preset.label))), allTime && (_jsx(Button, { variant: isAllTime ? 'primary' : 'outline', size: "sm", "aria-pressed": isAllTime, onClick: () => onChange(ALL_TIME), children: "All time" })), _jsx(DateRangePicker, { value: value, onChange: onChange, placeholder: "Custom range", align: "end", locale: "en-GB", weekStartsOn: 1, minDate: minDate, maxDate: maxDate })] }));
}
