const EMPTY = '—';
const MINUS = '−';
function isNumber(value) {
    return typeof value === 'number' && Number.isFinite(value);
}
function signed(value, text) {
    if (value > 0)
        return `+${text}`;
    if (value < 0)
        return `${MINUS}${text}`;
    return text;
}
/** An amount of money, with an explicit sign when `withSign` (profit and loss). */
export function formatMoney(value, currency = 'EUR', withSign = false) {
    if (!isNumber(value))
        return EMPTY;
    const text = new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: currency || 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Math.abs(value));
    return withSign ? signed(value, text) : value < 0 ? `${MINUS}${text}` : text;
}
/** Compact money for axis ticks: 1.2K, 3.4M. */
export function formatMoneyCompact(value) {
    const text = new Intl.NumberFormat('en-GB', {
        notation: 'compact',
        maximumFractionDigits: 1,
    }).format(Math.abs(value));
    return value < 0 ? `${MINUS}${text}` : text;
}
export function formatPercent(value, withSign = false, digits = 2) {
    if (!isNumber(value))
        return EMPTY;
    const text = `${Math.abs(value).toFixed(digits)}%`;
    return withSign ? signed(value, text) : value < 0 ? `${MINUS}${text}` : text;
}
export function formatNumber(value, digits = 0) {
    if (!isNumber(value))
        return EMPTY;
    return new Intl.NumberFormat('en-GB', {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    }).format(value);
}
function parseDate(value) {
    if (!value)
        return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
}
function yearIn(date, timeZone) {
    return new Intl.DateTimeFormat('en-GB', { timeZone, year: 'numeric' }).format(date);
}
/**
 * A timestamp shown in the time zone given (the one the application's data is
 * about, not the browser's). The year is left out while it is this year's, and
 * written otherwise: a history may go back further than twelve months.
 */
export function formatDateTime(value, timeZone, withSeconds = true, now = new Date()) {
    const date = parseDate(value);
    if (!date)
        return EMPTY;
    return new Intl.DateTimeFormat('en-GB', {
        timeZone,
        day: '2-digit',
        month: 'short',
        year: yearIn(date, timeZone) === yearIn(now, timeZone) ? undefined : 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: withSeconds ? '2-digit' : undefined,
        hour12: false,
    }).format(date);
}
export function formatTime(value, timeZone) {
    const date = parseDate(value);
    if (!date)
        return EMPTY;
    return new Intl.DateTimeFormat('en-GB', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    }).format(date);
}
/** A time of day to the millisecond ("09:31:02.120"), for moments less than a second apart. */
export function formatClock(value, timeZone) {
    const date = parseDate(value);
    if (!date)
        return EMPTY;
    return new Intl.DateTimeFormat('en-GB', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        fractionalSecondDigits: 3,
        hour12: false,
    }).format(date);
}
/** A short wait: "190 ms" under a second, "3.4 s" under a minute, then as `formatSpan`. */
export function formatWait(milliseconds) {
    const wait = Math.max(0, milliseconds);
    if (wait < 1000)
        return `${Math.round(wait)} ms`;
    if (wait < 60_000)
        return `${(wait / 1000).toFixed(1)} s`;
    return formatSpan(wait / 1000);
}
/** A calendar day ("2026-10-11") as "11 Oct 2026", never shifted across time zones: a day is already a day somewhere. */
export function formatDay(value, withYear = true) {
    if (!value)
        return EMPTY;
    const [year, month, day] = value.split('-').map(Number);
    if (!year || !month || !day)
        return value;
    return new Intl.DateTimeFormat('en-GB', {
        timeZone: 'UTC',
        day: '2-digit',
        month: 'short',
        year: withYear ? 'numeric' : undefined,
    }).format(new Date(Date.UTC(year, month - 1, day)));
}
/** "3 min", "2 h 05", "4 d" between two instants. */
export function formatDuration(milliseconds) {
    const totalSeconds = Math.max(0, Math.round(milliseconds / 1000));
    if (totalSeconds < 60)
        return `${totalSeconds} s`;
    const totalMinutes = Math.floor(totalSeconds / 60);
    if (totalMinutes < 60)
        return `${totalMinutes} min`;
    const hours = Math.floor(totalMinutes / 60);
    if (hours < 48)
        return `${hours} h ${String(totalMinutes % 60).padStart(2, '0')}`;
    return `${Math.floor(hours / 24)} d`;
}
/**
 * A length of time with its seconds: "50 s", "1 min 50 s", "12 min", "2 h 05 min".
 * For what is measured to the ten seconds, where `formatDuration` would round the point away.
 */
export function formatSpan(seconds) {
    const total = Math.max(0, Math.round(seconds));
    if (total < 60)
        return `${total} s`;
    const minutes = Math.floor(total / 60);
    if (minutes < 60)
        return total % 60 ? `${minutes} min ${total % 60} s` : `${minutes} min`;
    return `${Math.floor(minutes / 60)} h ${String(minutes % 60).padStart(2, '0')} min`;
}
/** A moment from now: "in 5 min", "18 min ago"; now itself, to the second, "0 s ago" (never "in 0 s"). */
export function formatRelative(value, now = Date.now()) {
    const date = parseDate(value);
    if (!date)
        return EMPTY;
    const difference = date.getTime() - now;
    const duration = formatDuration(Math.abs(difference));
    return difference >= 500 ? `in ${duration}` : `${duration} ago`;
}
/** ISO day (YYYY-MM-DD) of a local Date, for an API's `from` / `to` parameters. */
export function toIsoDay(date) {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
}
export function toneOf(value) {
    if (!isNumber(value) || value === 0)
        return 'neutral';
    return value > 0 ? 'positive' : 'negative';
}
/** A size on disk, in the units a person reads: 48.2 kB, 14.0 MB. */
export function formatBytes(bytes) {
    if (bytes === null || bytes === undefined)
        return '-';
    const units = ['B', 'kB', 'MB', 'GB'];
    let size = bytes;
    let unit = 0;
    while (size >= 1000 && unit < units.length - 1) {
        size /= 1000;
        unit += 1;
    }
    return `${unit === 0 || size >= 100 ? Math.round(size) : size.toFixed(1)} ${units[unit]}`;
}
