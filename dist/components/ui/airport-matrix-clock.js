'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { memo, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { motionTransitions } from '../../lib/motion-tokens.js';
const GLYPH_WIDTH = { md: 'w-[clamp(10px,3.4vw,20px)]', sm: 'w-[9px]' };
const GLYPHS = {
    A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'], B: ['11110', '10001', '10001', '11110', '10001', '10001', '11110'],
    C: ['01111', '10000', '10000', '10000', '10000', '10000', '01111'], D: ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
    E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'], F: ['11111', '10000', '10000', '11110', '10000', '10000', '10000'],
    G: ['01111', '10000', '10000', '10111', '10001', '10001', '01111'], H: ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
    I: ['11111', '00100', '00100', '00100', '00100', '00100', '11111'], J: ['00111', '00010', '00010', '00010', '10010', '10010', '01100'],
    K: ['10001', '10010', '10100', '11000', '10100', '10010', '10001'], L: ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
    M: ['10001', '11011', '10101', '10101', '10001', '10001', '10001'], N: ['10001', '11001', '10101', '10011', '10001', '10001', '10001'],
    O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'], P: ['11110', '10001', '10001', '11110', '10000', '10000', '10000'],
    Q: ['01110', '10001', '10001', '10001', '10101', '10010', '01101'], R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
    S: ['01111', '10000', '10000', '01110', '00001', '00001', '11110'], T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
    U: ['10001', '10001', '10001', '10001', '10001', '10001', '01110'], V: ['10001', '10001', '10001', '10001', '10001', '01010', '00100'],
    W: ['10001', '10001', '10001', '10101', '10101', '10101', '01010'], X: ['10001', '10001', '01010', '00100', '01010', '10001', '10001'],
    Y: ['10001', '10001', '01010', '00100', '00100', '00100', '00100'], Z: ['11111', '00001', '00010', '00100', '01000', '10000', '11111'],
    '0': ['01110', '10001', '10011', '10101', '11001', '10001', '01110'], '1': ['00100', '01100', '00100', '00100', '00100', '00100', '01110'],
    '2': ['01110', '10001', '00001', '00010', '00100', '01000', '11111'], '3': ['11110', '00001', '00001', '01110', '00001', '00001', '11110'],
    '4': ['00010', '00110', '01010', '10010', '11111', '00010', '00010'], '5': ['11111', '10000', '10000', '11110', '00001', '00001', '11110'],
    '6': ['01110', '10000', '10000', '11110', '10001', '10001', '01110'], '7': ['11111', '00001', '00010', '00100', '01000', '01000', '01000'],
    '8': ['01110', '10001', '10001', '01110', '10001', '10001', '01110'], '9': ['01110', '10001', '10001', '01111', '00001', '00001', '01110'],
    ':': ['00000', '00100', '00100', '00000', '00100', '00100', '00000'], '-': ['00000', '00000', '00000', '11111', '00000', '00000', '00000'],
    '/': ['00001', '00010', '00010', '00100', '01000', '01000', '10000'], ' ': ['00000', '00000', '00000', '00000', '00000', '00000', '00000'],
};
const DOTS = Array.from({ length: 35 }, (_, index) => ({ x: index % 5, y: Math.floor(index / 5) }));
const DOT_RADIUS = 0.34;
function createDotPath(char) {
    return DOTS.filter(({ x, y }) => char === null || GLYPHS[char][y][x] === '1')
        .map(({ x, y }) => `M${x - DOT_RADIUS},${y}a${DOT_RADIUS},${DOT_RADIUS} 0 1,0 ${DOT_RADIUS * 2},0a${DOT_RADIUS},${DOT_RADIUS} 0 1,0 ${-DOT_RADIUS * 2},0`)
        .join('');
}
const INACTIVE_DOT_PATH = createDotPath(null);
const GLYPH_PATHS = Object.fromEntries(Object.keys(GLYPHS).map((char) => [char, createDotPath(char)]));
function formatCityTime(date, timeZone, format, showSeconds) {
    const formatter = new Intl.DateTimeFormat(format === '24h' ? 'en-GB' : 'en-US', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        ...(showSeconds ? { second: '2-digit' } : {}),
        ...(format === '24h' ? { hourCycle: 'h23' } : { hour12: true }),
    });
    const parts = formatter.formatToParts(date);
    const part = (type) => parts.find((item) => item.type === type)?.value ?? '';
    const hour = part('hour').padStart(2, '0');
    const minute = part('minute');
    const second = showSeconds ? `:${part('second')}` : '';
    const period = format === '12h' ? part('dayPeriod').toUpperCase() : '';
    return { matrix: `${hour}:${minute}${second}${period ? ` ${period}` : ''}`, accessible: `${hour}:${minute}${second}${period ? ` ${period}` : ''}` };
}
const MatrixGlyph = memo(function MatrixGlyph({ char, size }) {
    return (_jsxs("svg", { "aria-hidden": "true", focusable: "false", viewBox: "-0.5 -0.5 5 7", className: `block h-auto ${GLYPH_WIDTH[size]} overflow-visible`, children: [_jsx("path", { d: INACTIVE_DOT_PATH, fill: "currentColor", opacity: "0.12" }), _jsx("path", { d: GLYPH_PATHS[char] ?? GLYPH_PATHS[' '], fill: "currentColor" })] }));
});
const MatrixCharacter = memo(function MatrixCharacter({ char, index, reduceMotion, rebuildId, size }) {
    const shouldAnimate = rebuildId > 0 && !reduceMotion;
    return (_jsxs("span", { className: `relative inline-flex ${GLYPH_WIDTH[size]} shrink-0 items-center justify-center overflow-hidden align-middle`, "aria-hidden": "true", children: [_jsx(AnimatePresence, { initial: false, mode: "sync", children: _jsx(motion.span, { initial: shouldAnimate ? { y: '72%', opacity: 0.45 } : false, animate: { y: '0%', opacity: 1 }, exit: shouldAnimate ? { y: '-72%', opacity: 0.45 } : { opacity: 0 }, transition: shouldAnimate ? { ...motionTransitions.springSnappy, delay: Math.min(index * 0.012, 0.09) } : { duration: 0 }, className: "absolute inset-0 flex items-center justify-center", children: _jsx(MatrixGlyph, { char: char, size: size }) }, rebuildId) }), _jsx("span", { className: "invisible", children: _jsx(MatrixGlyph, { char: "0", size: size }) })] }));
});
const MatrixText = memo(function MatrixText({ text, reduceMotion, rebuildId, label, size, className = '' }) {
    return (_jsxs("span", { "aria-label": label, className: `inline-flex min-w-0 items-center gap-[clamp(0.5px,0.2vw,2px)] text-current ${className}`, children: [_jsx("span", { "aria-hidden": "true", className: "sr-only", children: label }), Array.from(text.toUpperCase()).map((char, index) => (_jsx(MatrixCharacter, { char: GLYPHS[char] ? char : ' ', index: index, reduceMotion: reduceMotion, rebuildId: rebuildId, size: size }, index)))] }));
});
const AirportMatrixClockRow = memo(function AirportMatrixClockRow({ row, rowIndex, rowCount, reduceMotion, size, }) {
    const [rebuildId, setRebuildId] = useState(0);
    const handlePointerEnter = (event) => {
        if (!reduceMotion && event.pointerType !== 'touch')
            setRebuildId((current) => current + 1);
    };
    return (_jsxs("li", { onPointerEnter: handlePointerEnter, className: `grid items-center gap-2 ${size === 'sm' ? 'grid-cols-[auto_minmax(0,1fr)] gap-3 px-3 py-1.5' : 'grid-cols-[minmax(84px,0.8fr)_minmax(0,1.2fr)] px-3 py-2 sm:grid-cols-[minmax(140px,0.8fr)_minmax(0,1.2fr)] sm:px-5 sm:py-2.5'} ${rowIndex < rowCount - 1 ? 'border-b border-border/50 dark:border-[#363636]/70' : ''}`, children: [_jsx("div", { className: "min-w-0 text-text-primary dark:text-[#F5F5F5]", children: _jsx(MatrixText, { text: row.time.matrix, label: `${row.time.accessible}, ${row.name}`, reduceMotion: reduceMotion, rebuildId: rebuildId, size: size }) }), _jsx("div", { className: "min-w-0 text-text-primary dark:text-[#F5F5F5]", children: _jsx(MatrixText, { text: row.name, label: row.name, reduceMotion: reduceMotion, rebuildId: rebuildId, size: size }) })] }));
});
export function AirportMatrixClock({ cities, format = '24h', showSeconds = false, updateInterval = 1000, title = 'WORLD CLOCK', footer, size = 'md', className = '', }) {
    const reduceMotion = useReducedMotion() ?? false;
    const [now, setNow] = useState(() => Date.now());
    const selectedCities = useMemo(() => cities.slice(0, 5), [cities]);
    useEffect(() => {
        const interval = Number.isFinite(updateInterval) && updateInterval > 0 ? updateInterval : 1000;
        const timer = window.setInterval(() => setNow(Date.now()), interval);
        return () => window.clearInterval(timer);
    }, [updateInterval]);
    const rows = useMemo(() => selectedCities.map((city) => ({ ...city, time: formatCityTime(new Date(now), city.timeZone, format, showSeconds) })), [selectedCities, now, format, showSeconds]);
    return (_jsx("section", { "aria-label": `World times: ${rows.map((row) => `${row.time.accessible} ${row.name}`).join(', ')}`, className: `relative ${size === 'sm' ? 'w-fit' : 'w-full max-w-3xl'} overflow-hidden rounded-xl border border-border bg-[#F5F5F5] text-text-primary shadow-sm [--amc-grid:rgba(0,0,0,0.008)] dark:border-[#363636] dark:bg-[#202020] dark:text-[#F5F5F5] dark:[--amc-grid:rgba(255,255,255,0.01)] glass-card ${className}`, style: { backgroundImage: 'linear-gradient(var(--amc-grid) 1px, transparent 1px), linear-gradient(90deg, var(--amc-grid) 1px, transparent 1px)', backgroundSize: '22px 22px' }, children: _jsxs("div", { children: [title && (_jsx("header", { className: `flex items-center justify-between border-b border-border/70 dark:border-[#363636] ${size === 'sm' ? 'px-3 py-1.5' : 'px-4 py-3 sm:px-6'}`, children: _jsx("p", { className: "font-mono text-[10px] tracking-[0.18em] text-text-muted dark:text-[#8A8A8A]", children: title }) })), _jsx("ul", { className: "m-0 list-none p-0", children: rows.map((row, rowIndex) => (_jsx(AirportMatrixClockRow, { row: row, rowIndex: rowIndex, rowCount: rows.length, reduceMotion: reduceMotion, size: size }, row.id))) }), _jsx("footer", { className: `border-t border-border/70 font-mono text-[9px] tracking-[0.12em] text-text-muted dark:border-[#363636] dark:text-[#8A8A8A] ${size === 'sm' ? 'px-3 py-1.5' : 'px-3 py-2 sm:px-5'}`, children: footer ?? (_jsxs(_Fragment, { children: [rows.length, " CITIES ", _jsx("span", { className: "px-1.5 opacity-50", children: "/" }), " IANA TIME ZONES"] })) })] }) }));
}
