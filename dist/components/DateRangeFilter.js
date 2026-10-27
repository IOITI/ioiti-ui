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
export function DateRangeFilter({ value, onChange }) {
    const isAllTime = !value.from && !value.to;
    const current = rangeParams(value);
    const isPreset = (days) => {
        const preset = rangeParams(lastDays(days));
        return preset.from === current.from && preset.to === current.to;
    };
    return (_jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [PRESETS.map((preset) => (_jsx(Button, { 
                // Filled: the one cue that says which range the page shows.
                variant: isPreset(preset.days) ? 'primary' : 'outline', size: "sm", "aria-pressed": isPreset(preset.days), onClick: () => onChange(lastDays(preset.days)), children: preset.label }, preset.days))), _jsx(Button, { variant: isAllTime ? 'primary' : 'outline', size: "sm", "aria-pressed": isAllTime, onClick: () => onChange(ALL_TIME), children: "All time" }), _jsx(DateRangePicker, { value: value, onChange: onChange, placeholder: "Custom range", align: "end", locale: "en-GB", weekStartsOn: 1 })] }));
}
