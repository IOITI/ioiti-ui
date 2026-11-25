import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CalendarClock, ChevronDown, Pause, Play, RefreshCw } from 'lucide-react';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useControllableState } from '../lib/controllable.js';
import { dataAttributes } from '../lib/data-attributes.js';
import { formatTimeRange, formatTimeRangeEnd, parseDateMath, relativeEnd, TIME_UNITS } from '../lib/date-math.js';
import { fieldBorder, invalidOf } from '../lib/field-border.js';
import { PRESSABLE } from '../lib/recipes.js';
import { cn } from '../lib/utils.js';
import { useLocale, useMessages } from './locale-context.js';
import { NumberInput } from './NumberInput.js';
import { Popover } from './Popover.js';
import { SegmentedControl } from './SegmentedControl.js';
import { Button } from './ui/button.js';
import { Calendar } from './ui/calendar.js';
import { DrawCheckbox } from './ui/draw-checkbox.js';
import { FieldContext, useFieldControl } from './field-context.js';
import { Select } from './ui/form.js';
// The ranges commonly used by default, each named as formatTimeRange names it ("Today", "Last 15 minutes"): the list and
// the button say a range in the same words.
const COMMON_RANGES = [
    { from: 'now/d', to: 'now/d' },
    { from: 'now/w', to: 'now/w' },
    { from: 'now-15m', to: 'now' },
    { from: 'now-30m', to: 'now' },
    { from: 'now-1h', to: 'now' },
    { from: 'now-24h', to: 'now' },
    { from: 'now-7d', to: 'now' },
    { from: 'now-30d', to: 'now' },
    { from: 'now-90d', to: 'now' },
    { from: 'now-1y', to: 'now' },
];
/** A list of units, each named for the count beside it (`count ?? 1`, what is applied while the field is empty). */
function unitOptions(words, count, units) {
    return units.map((unit) => ({ value: unit, label: words.unitOption({ count: count ?? 1, unit }) }));
}
const SECTION = 'mb-1.5 text-xs font-medium text-text-secondary';
const REFRESH_UNITS = [
    { value: 's', ms: 1000 },
    { value: 'm', ms: 60_000 },
    { value: 'h', ms: 3_600_000 },
];
/**
 * What a popover of the picker holds: its own fields, never the field of a Field or a FormItem the picker is in (its
 * id, what describes it): its Selects would take them, twice over.
 */
function OwnFields({ children }) {
    return _jsx(FieldContext.Provider, { value: null, children: children });
}
/** The interval in its largest whole unit: 90 s is 90 seconds, 120 s two minutes. */
function inUnits(interval) {
    const unit = [...REFRESH_UNITS].reverse().find((each) => interval >= each.ms && interval % each.ms === 0) ?? REFRESH_UNITS[0];
    return { count: Math.max(1, Math.round(interval / unit.ms)), unit: unit.value };
}
/** "Every 30 s", "Every 5 min", or "Off", in the words given. */
function refreshInWords({ interval, paused }, words) {
    if (paused || interval <= 0)
        return words.refreshOff;
    return words.refreshEvery(inUnits(interval));
}
/** Calls `refresh` every interval while not paused, and not while the page's tab is hidden. */
function useRefreshTimer({ interval, paused }, refresh) {
    const latest = useRef(refresh);
    useEffect(() => {
        latest.current = refresh;
    });
    useEffect(() => {
        if (paused || interval <= 0 || typeof document === 'undefined')
            return;
        let timer;
        const stop = () => {
            clearInterval(timer);
            timer = undefined;
        };
        const start = () => {
            stop();
            if (document.visibilityState !== 'hidden')
                timer = setInterval(() => latest.current(), interval);
        };
        start();
        document.addEventListener('visibilitychange', start);
        return () => {
            stop();
            document.removeEventListener('visibilitychange', start);
        };
    }, [interval, paused]);
}
function RefreshEvery({ settings, onChange }) {
    const { count, unit } = inUnits(settings.interval || 60_000);
    const ms = (each) => REFRESH_UNITS.find((option) => option.value === each)?.ms ?? 1000;
    const id = useId();
    const words = useMessages().timeRange;
    return (_jsxs("section", { "aria-labelledby": id, children: [_jsx("h3", { id: id, className: SECTION, children: words.refreshInterval }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-20", children: _jsx(NumberInput, { label: words.refreshInterval, value: count, min: 1, integer: true, steppers: false, onChange: (typed) => typed !== null && onChange({ ...settings, interval: typed * ms(unit) }) }) }), _jsx("div", { className: "w-28", children: _jsx(Select, { "aria-label": words.refreshUnit, value: unit, options: unitOptions(words, count, REFRESH_UNITS.map((each) => each.value)), onChange: (event) => onChange({ ...settings, interval: count * ms(event.target.value) }) }) }), _jsx(Button, { size: "sm", variant: settings.paused ? 'primary' : 'outline', leftIcon: settings.paused ? _jsx(Play, { className: "size-3.5" }) : _jsx(Pause, { className: "size-3.5" }), onClick: () => onChange({ interval: settings.interval || count * ms(unit), paused: !settings.paused }), children: settings.paused ? words.startRefresh : words.stopRefresh })] })] }));
}
/**
 * Refreshes what a page shows on a timer: a button saying how often ("Every 30 s", "Off") that opens
 * where it is set and stopped. It waits while the page's tab is hidden, and starts again when it is back.
 */
export function AutoRefresh({ value, onChange, onRefresh, className }) {
    useRefreshTimer(value, onRefresh);
    const words = useMessages().timeRange;
    const on = !value.paused && value.interval > 0;
    return (_jsx(Popover, { label: words.autoRefresh, align: "end", trigger: _jsx(Button, { variant: "outline", size: "sm", className: className, leftIcon: _jsx(RefreshCw, { className: cn('size-3.5', on && 'motion-safe:animate-spin [animation-duration:3s]') }), children: refreshInWords(value, words) }), children: _jsx(OwnFields, { children: _jsx(RefreshEvery, { settings: value, onChange: onChange }) }) }));
}
/* ---------------------------------------------------------------------------------------------------- */
/*  The time range                                                                                       */
/* ---------------------------------------------------------------------------------------------------- */
const pad = (number) => String(number).padStart(2, '0');
const localIso = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
function QuickSelect({ apply, commonlyUsed, recentlyUsed, nameOf, refresh, onRefreshChange, }) {
    const [past, setPast] = useState(true);
    const [count, setCount] = useState(15);
    const [unit, setUnit] = useState('m');
    const quickId = useId();
    const commonId = useId();
    const recentId = useId();
    const words = useMessages().timeRange;
    const span = `${count ?? 1}${unit}`;
    return (_jsxs("div", { className: "flex w-[22rem] max-w-[calc(100vw-2rem)] flex-col gap-4", children: [_jsxs("section", { "aria-labelledby": quickId, children: [_jsx("h3", { id: quickId, className: SECTION, children: words.quickSelect }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-24", children: _jsx(Select, { "aria-label": words.beforeOrAfterNow, value: past ? 'last' : 'next', options: [
                                        { value: 'last', label: words.lastOption },
                                        { value: 'next', label: words.nextOption },
                                    ], onChange: (event) => setPast(event.target.value === 'last') }) }), _jsx("div", { className: "w-16", children: _jsx(NumberInput, { label: words.howMany, value: count, onChange: setCount, min: 1, integer: true, steppers: false }) }), _jsx("div", { className: "w-28", children: _jsx(Select, { "aria-label": words.unit, value: unit, options: unitOptions(words, count, TIME_UNITS), onChange: (event) => setUnit(event.target.value) }) }), _jsx(Button, { size: "sm", onClick: () => apply(past ? { from: `now-${span}`, to: 'now' } : { from: 'now', to: `now+${span}` }), children: words.apply })] })] }), _jsxs("section", { "aria-labelledby": commonId, children: [_jsx("h3", { id: commonId, className: SECTION, children: words.commonlyUsed }), _jsx("ul", { className: "grid grid-cols-2 gap-x-3 gap-y-0.5", children: commonlyUsed.map((common) => (_jsx("li", { children: _jsx("button", { type: "button", onClick: () => apply(common.range), className: "w-full cursor-pointer rounded-md px-1.5 py-1 text-left text-sm text-foreground transition-colors hover:bg-surface-hover accent:text-brand-text", children: common.label }) }, common.label))) })] }), recentlyUsed.length > 0 && (_jsxs("section", { "aria-labelledby": recentId, children: [_jsx("h3", { id: recentId, className: SECTION, children: words.recentlyUsed }), _jsx("ul", { className: "flex flex-col gap-0.5", children: recentlyUsed.map((range) => (_jsx("li", { children: _jsx("button", { type: "button", onClick: () => apply(range), className: "w-full cursor-pointer rounded-md px-1.5 py-1 text-left text-sm text-foreground transition-colors hover:bg-surface-hover", children: nameOf(range) }) }, `${range.from} ${range.to}`))) })] })), refresh && onRefreshChange && _jsx(RefreshEvery, { settings: refresh, onChange: onRefreshChange })] }));
}
/** One end of the range: a moment on the calendar, a time from now, or now. */
function EndEditor({ which, value, onChange, locale, weekStartsOn, }) {
    const words = useMessages().timeRange;
    const relative = relativeEnd(value);
    const [mode, setMode] = useState(value.trim() === 'now' ? 'now' : relative ? 'relative' : 'absolute');
    const panel = useId();
    // Now, as it was when the panel opened: what the end moves from.
    const [opened] = useState(() => Date.now());
    const date = parseDateMath(value, { now: opened, roundUp: which === 'end', weekStartsOn }) ?? new Date(opened);
    const [count, setCount] = useState(relative?.count ?? 15);
    const [unit, setUnit] = useState(relative?.unit ?? 'm');
    const [past, setPast] = useState(relative?.past ?? true);
    const [roundToUnit, setRoundToUnit] = useState(relative?.round !== undefined);
    const relativeText = (next) => {
        const c = next.count === undefined ? count : next.count;
        const u = next.unit ?? unit;
        const p = next.past ?? past;
        const r = next.roundToUnit ?? roundToUnit;
        return `now${p ? '-' : '+'}${c ?? 1}${u}${r ? `/${u}` : ''}`;
    };
    const time = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
    // Each tab says which panel it shows (aria-controls), and each panel is named by its tab's words, which carry an id
    // (SegmentedControl gives its tabs none).
    const labelledBy = (each) => `${panel}-${each}-tab`;
    const tab = (each, name) => ({
        value: each,
        label: _jsx("span", { id: labelledBy(each), children: name }),
        panelId: `${panel}-${each}`,
    });
    return (_jsxs("div", { className: "flex w-[19rem] max-w-[calc(100vw-2rem)] flex-col gap-3", children: [_jsx(SegmentedControl, { role: "tablist", label: which === 'start' ? words.startTabs : words.endTabs, size: "sm", fullWidth: true, value: mode, onChange: (next) => {
                    setMode(next);
                    if (next === 'now')
                        onChange('now');
                    else if (next === 'relative')
                        onChange(relativeText({}));
                    else
                        onChange(localIso(date));
                }, options: [tab('absolute', words.absolute), tab('relative', words.relative), tab('now', words.nowTab)] }), mode === 'absolute' && (_jsxs("div", { id: `${panel}-absolute`, role: "tabpanel", "aria-labelledby": labelledBy('absolute'), className: "flex flex-col gap-2", children: [_jsx(Calendar, { mode: "single", value: date, locale: locale, weekStartsOn: weekStartsOn, onChange: (day) => {
                            if (!day)
                                return;
                            const next = new Date(day);
                            next.setHours(date.getHours(), date.getMinutes(), 0, 0);
                            onChange(localIso(next));
                        } }), _jsxs("label", { className: "flex items-center justify-between gap-3 text-xs text-text-secondary", children: [words.time, _jsx("input", { type: "time", value: time, onChange: (event) => {
                                    const [hours, minutes] = event.target.value.split(':').map(Number);
                                    if (Number.isNaN(hours) || Number.isNaN(minutes))
                                        return;
                                    const next = new Date(date);
                                    next.setHours(hours, minutes, 0, 0);
                                    onChange(localIso(next));
                                }, 
                                // Its focus as the form's Input shows it: a field that takes text has no ring.
                                className: cn('h-10 rounded-lg border bg-surface px-3.5 text-base sm:text-sm tabular-nums text-foreground transition-colors', fieldBorder(false)) })] })] })), mode === 'relative' && (_jsxs("div", { id: `${panel}-relative`, role: "tabpanel", "aria-labelledby": labelledBy('relative'), className: "flex flex-col gap-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-16", children: _jsx(NumberInput, { label: words.howMany, value: count, min: 0, integer: true, steppers: false, onChange: (typed) => {
                                        setCount(typed);
                                        if (typed !== null)
                                            onChange(relativeText({ count: typed }));
                                    } }) }), _jsx("div", { className: "w-28", children: _jsx(Select, { "aria-label": words.unit, value: unit, options: unitOptions(words, count, TIME_UNITS), onChange: (event) => {
                                        const next = event.target.value;
                                        setUnit(next);
                                        onChange(relativeText({ unit: next }));
                                    } }) }), _jsx("div", { className: "w-28", children: _jsx(Select, { "aria-label": words.beforeOrAfterNow, value: past ? 'ago' : 'later', options: [
                                        { value: 'ago', label: words.agoOption },
                                        { value: 'later', label: words.fromNowOption },
                                    ], onChange: (event) => {
                                        const next = event.target.value === 'ago';
                                        setPast(next);
                                        onChange(relativeText({ past: next }));
                                    } }) })] }), _jsx(DrawCheckbox, { label: words.roundTo(unit), checked: roundToUnit, onChange: (event) => {
                            const next = event.target.checked;
                            setRoundToUnit(next);
                            onChange(relativeText({ roundToUnit: next }));
                        } })] })), mode === 'now' && (_jsxs("div", { id: `${panel}-now`, role: "tabpanel", "aria-labelledby": labelledBy('now'), className: "flex flex-col gap-2 text-sm text-muted-foreground", children: [_jsx("p", { children: words.nowExplained }), _jsx(Button, { size: "sm", variant: "outline", onClick: () => onChange('now'), children: which === 'start' ? words.setStartToNow : words.setEndToNow })] }))] }));
}
/**
 * A range of time, said as people say it ("Last 15 minutes", "Today") and kept true as time goes by:
 * a range chosen in two clicks (quick select, the ranges commonly used, those recently used), or its two
 * ends set one by one (a moment on the calendar, a time from now, now) and applied with Update; refreshed
 * by a press, or on a timer. As Elastic UI's super date picker does.
 */
export function TimeRangePicker({ value, defaultValue = { from: 'now-15m', to: 'now' }, onChange, onRefresh, loading = false, commonlyUsed, refresh, onRefreshChange, locale, weekStartsOn, className, id, name, 'aria-label': ariaLabel, 'aria-labelledby': labelledBy, 'aria-describedby': describedBy, 'aria-invalid': ariaInvalid, ref, ...rest }) {
    // A group of buttons, named, described and marked by a Field or a FormItem around it too, its own props first: by
    // its label's words (aria-labelledby: a label names no group), the label pointing to it, so that it names no button.
    const groupId = useId();
    const control = useFieldControl({
        id,
        fallbackId: groupId,
        labelledBy,
        named: Boolean(ariaLabel),
        describedBy,
        invalid: invalidOf(undefined, ariaInvalid),
    });
    const grouped = Boolean(ariaLabel || control.labelledBy || control.describedBy || control.invalid);
    // The provider's locale, week, clock and words, where the props give none.
    const provider = useLocale();
    const words = useMessages().timeRange;
    const tag = locale ?? provider.locale;
    const firstDay = weekStartsOn ?? provider.weekStartsOn;
    const say = useMemo(() => ({ words, hourCycle: provider.hourCycle, weekStartsOn: firstDay }), [words, provider.hourCycle, firstDay]);
    const offered = useMemo(() => commonlyUsed ?? COMMON_RANGES.map((range) => ({ label: formatTimeRange(range, tag, say), range })), [commonlyUsed, tag, say]);
    const [applied, setApplied] = useControllableState(value, defaultValue, onChange);
    const [draft, setDraft] = useState(applied);
    const [seen, setSeen] = useState(applied);
    if (applied.from !== seen.from || applied.to !== seen.to) {
        setSeen(applied);
        setDraft(applied);
    }
    const [recent, setRecent] = useState([]);
    const [dates, setDates] = useState(false);
    const [quickOpen, setQuickOpen] = useState(false);
    useRefreshTimer(refresh ?? { interval: 0, paused: true }, () => onRefresh?.(applied));
    const changed = draft.from !== applied.from || draft.to !== applied.to;
    const start = parseDateMath(draft.from, { weekStartsOn: firstDay });
    const end = parseDateMath(draft.to, { roundUp: true, weekStartsOn: firstDay });
    const invalid = !start || !end || start.getTime() > end.getTime();
    const apply = (range) => {
        setApplied(range);
        setDraft(range);
        setSeen(range);
        setRecent((now) => [range, ...now.filter((each) => each.from !== range.from || each.to !== range.to)].slice(0, 5));
        setQuickOpen(false);
        setDates(false);
        onRefresh?.(range);
    };
    const endButton = (which) => {
        const text = which === 'start' ? draft.from : draft.to;
        const wrong = which === 'start' ? !start || invalid : !end || invalid;
        return (_jsx(Popover, { label: which === 'start' ? words.startOfRange : words.endOfRange, trigger: _jsx("button", { type: "button", className: cn('h-8 min-w-0 cursor-pointer truncate rounded-lg px-2 text-sm tabular-nums transition-colors hover:bg-surface-hover', wrong ? 'text-negative' : 'text-foreground'), children: formatTimeRangeEnd(text, tag, { ...say, roundUp: which === 'end' }) }), children: _jsx(OwnFields, { children: _jsx(EndEditor, { which: which, value: text, locale: tag, weekStartsOn: firstDay, onChange: (next) => setDraft((now) => (which === 'start' ? { ...now, from: next } : { ...now, to: next })) }) }) }));
    };
    return (_jsxs("div", { ref: ref, ...dataAttributes(rest), id: control.id, role: grouped ? 'group' : undefined, "aria-label": ariaLabel, "aria-labelledby": control.labelledBy, "aria-describedby": control.describedBy, "aria-invalid": control.invalid || undefined, className: cn('flex w-full min-w-0 items-center gap-2', className), children: [name && [applied.from, applied.to].map((end, index) => _jsx("input", { type: "hidden", name: name, value: end }, index)), _jsxs("div", { className: cn('flex h-10 min-w-0 flex-1 items-center gap-1 rounded-lg border bg-surface px-1', control.invalid ? fieldBorder(true, 'focus-within') : 'border-border'), children: [_jsx(Popover, { label: words.quickSelect, open: quickOpen, onOpenChange: setQuickOpen, trigger: _jsxs("button", { type: "button", "aria-label": words.quickSelect, className: cn('inline-flex h-8 shrink-0 items-center gap-0.5 rounded-lg px-1.5 text-muted-foreground transition hover:bg-surface-hover hover:text-foreground [&>svg]:size-4', PRESSABLE), children: [_jsx(CalendarClock, { "aria-hidden": true }), _jsx(ChevronDown, { "aria-hidden": true, className: "!size-3" })] }), children: _jsx(OwnFields, { children: _jsx(QuickSelect, { apply: apply, commonlyUsed: offered, recentlyUsed: recent, nameOf: (range) => formatTimeRange(range, tag, say), refresh: refresh, onRefreshChange: onRefreshChange }) }) }), _jsx("span", { "aria-hidden": true, className: "h-5 w-px shrink-0 bg-border" }), dates || changed ? (_jsxs("div", { className: "flex min-w-0 flex-1 items-center gap-1", children: [endButton('start'), _jsx("span", { "aria-hidden": true, className: "text-xs text-muted-foreground", children: words.arrow }), endButton('end')] })) : (_jsxs("button", { type: "button", onClick: () => setDates(true), className: "h-8 min-w-0 flex-1 cursor-pointer truncate rounded-lg px-2 text-left text-sm text-foreground transition-colors hover:bg-surface-hover", children: [formatTimeRange(applied, tag, say), _jsx("span", { className: "sr-only", children: words.showEnds })] }))] }), changed ? (_jsx(Button, { size: "md", disabled: invalid, onClick: () => apply(draft), leftIcon: _jsx(RefreshCw, { className: "size-4" }), children: words.update })) : (_jsx(Button, { size: "md", variant: "outline", pending: loading, loadingText: words.refreshing, onClick: () => onRefresh?.(applied), leftIcon: _jsx(RefreshCw, { className: "size-4" }), children: words.refresh }))] }));
}
