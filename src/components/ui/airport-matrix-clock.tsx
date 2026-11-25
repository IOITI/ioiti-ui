'use client';

import { memo, useEffect, useId, useMemo, useState, type PointerEvent, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotionConfig } from 'framer-motion';
import { motionTransitions } from '../../lib/motion-tokens.js';
import { SECTION } from '../../lib/recipes.js';
import { useLocale, useMessages } from '../locale-context.js';


// ioiti-ui: the cities are the caller's, each with its IANA zone; EasyUI's list of 32 (five countries, no Paris), its
// country and city selectors and its add and remove buttons are gone.
export interface WorldClockCity {
  id: string;
  name: string;
  timeZone: string;
}

// ioiti-ui: named after its role, `WorldClock` (EasyUI's `AirportMatrixClock`, its former name, removed in 1.0).
export interface WorldClockProps {
  /** ioiti-ui: one to five cities, each with its IANA time zone. */
  cities: WorldClockCity[];
  /** ioiti-ui: 24 hours or 12; the provider's clock by default (IoitiProvider's: 24 hours in en-GB and fr-FR, 12 in en-US). */
  format?: '12h' | '24h';
  /** Include seconds in each city time. */
  showSeconds?: boolean;
  /** Refresh cadence in milliseconds. Defaults to one second. */
  updateInterval?: number;
  /** ioiti-ui: the board's heading ("World clock" by default, in the provider's words: `clock.title`); null for none. */
  title?: string | null;
  /** ioiti-ui: the board's last line, in the caller's words ("3 cities / IANA time zones" by default, in the provider's). */
  footer?: ReactNode;
  /** ioiti-ui: 'sm', a board for the side of a page's header (EasyUI's characters are up to 20 px wide). */
  size?: 'md' | 'sm';
  className?: string;
}

const GLYPH_WIDTH = { md: 'w-[clamp(10px,3.4vw,20px)]', sm: 'w-[9px]' } as const;

const GLYPHS: Readonly<Record<string, readonly string[]>> = {
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

function createDotPath(char: string | null) {
  return DOTS.filter(({ x, y }) => char === null || GLYPHS[char][y][x] === '1')
    .map(({ x, y }) => `M${x - DOT_RADIUS},${y}a${DOT_RADIUS},${DOT_RADIUS} 0 1,0 ${DOT_RADIUS * 2},0a${DOT_RADIUS},${DOT_RADIUS} 0 1,0 ${-DOT_RADIUS * 2},0`)
    .join('');
}

const INACTIVE_DOT_PATH = createDotPath(null);
const GLYPH_PATHS = Object.fromEntries(Object.keys(GLYPHS).map((char) => [char, createDotPath(char)])) as Record<string, string>;


// ioiti-ui: the time in the locale given, the provider's (EasyUI's was en-GB's for 24 hours, en-US's for 12): a screen
// reader's line as the locale writes it, the board's in what its characters draw (Latin digits, ':', the period in
// capitals).
function formatCityTime(date: Date, timeZone: string, format: '12h' | '24h', showSeconds: boolean, locale: string) {
  const options: Intl.DateTimeFormatOptions = {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    ...(showSeconds ? { second: '2-digit' as const } : {}),
    ...(format === '24h' ? { hourCycle: 'h23' as const } : { hour12: true }),
  };
  const accessible = new Intl.DateTimeFormat(locale, options).format(date);
  const parts = new Intl.DateTimeFormat(locale, { ...options, numberingSystem: 'latn' }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value ?? '';
  const hour = part('hour').padStart(2, '0');
  const minute = part('minute');
  const second = showSeconds ? `:${part('second')}` : '';
  const period = format === '12h' ? boardPeriod(part('dayPeriod'), date, timeZone) : '';
  return { matrix: `${hour}:${minute}${second}${period ? ` ${period}` : ''}`, accessible };
}

// ioiti-ui: the period as the board draws it: the locale's letters in capitals ("PM"; "p. m." is "PM", Finnish "ip." "IP"),
// or AM and PM where the locale writes it in a script the board has no characters for (午後). The hour is read in en-GB,
// a number computed, never shown.
function boardPeriod(written: string, date: Date, timeZone: string) {
  const letters = written.normalize('NFD').toUpperCase().replace(/[^A-Z]/g, '');
  if (letters) return letters;
  const hour = Number(new Intl.DateTimeFormat('en-GB', { timeZone, hour: '2-digit', hourCycle: 'h23' }).format(date));
  return hour < 12 ? 'AM' : 'PM';
}

const MatrixGlyph = memo(function MatrixGlyph({ char, size }: { char: string; size: 'md' | 'sm' }) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="-0.5 -0.5 5 7" className={`block h-auto ${GLYPH_WIDTH[size]} overflow-visible`}>
      <path d={INACTIVE_DOT_PATH} fill="currentColor" opacity="0.12" />
      <path d={GLYPH_PATHS[char] ?? GLYPH_PATHS[' ']} fill="currentColor" />
    </svg>
  );
});

const MatrixCharacter = memo(function MatrixCharacter({ char, index, reduceMotion, rebuildId, size }: { char: string; index: number; reduceMotion: boolean; rebuildId: number; size: 'md' | 'sm' }) {
  const shouldAnimate = rebuildId > 0 && !reduceMotion;
  return (
    <span className={`relative inline-flex ${GLYPH_WIDTH[size]} shrink-0 items-center justify-center overflow-hidden align-middle`} aria-hidden="true">
      <AnimatePresence initial={false} mode="sync">
        <motion.span
          key={rebuildId}
          initial={shouldAnimate ? { y: '72%', opacity: 0.45 } : false}
          animate={{ y: '0%', opacity: 1 }}
          exit={shouldAnimate ? { y: '-72%', opacity: 0.45 } : { opacity: 0 }}
          transition={shouldAnimate ? { ...motionTransitions.springSnappy, delay: Math.min(index * 0.012, 0.09) } : { duration: 0 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <MatrixGlyph char={char} size={size} />
        </motion.span>
      </AnimatePresence>
      <span className="invisible"><MatrixGlyph char="0" size={size} /></span>
    </span>
  );
});

// ioiti-ui: drawn for the eye alone, its characters pictures: its row says it as text (an aria-label on a span, no role
// that takes one, was no name a screen reader reads, and the words beside it were hidden from it).
const MatrixText = memo(function MatrixText({ text, reduceMotion, rebuildId, size, className = '' }: { text: string; reduceMotion: boolean; rebuildId: number; size: 'md' | 'sm'; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex min-w-0 items-center gap-[clamp(0.5px,0.2vw,2px)] text-current ${className}`}
    >
      {/* ioiti-ui: a letter with an accent drawn as the letter (Montréal, Zürich): the board has no accents, and drew a blank. */}
      {Array.from(text.normalize('NFD').replace(/\p{M}/gu, '').toUpperCase()).map((char, index) => (
        <MatrixCharacter key={index} char={GLYPHS[char] ? char : ' '} index={index} reduceMotion={reduceMotion} rebuildId={rebuildId} size={size} />
      ))}
    </span>
  );
});


type WorldClockRowData = WorldClockCity & { time: ReturnType<typeof formatCityTime> };

const WorldClockRow = memo(function WorldClockRow({
  row, rowIndex, rowCount, reduceMotion, size,
}: {
  row: WorldClockRowData;
  rowIndex: number;
  rowCount: number;
  reduceMotion: boolean;
  size: 'md' | 'sm';
}) {
  const words = useMessages().clock;
  const [rebuildId, setRebuildId] = useState(0);
  const handlePointerEnter = (event: PointerEvent<HTMLLIElement>) => {
    if (!reduceMotion && event.pointerType !== 'touch') setRebuildId((current) => current + 1);
  };

  return (
    <li
      onPointerEnter={handlePointerEnter}
      className={`grid items-center gap-2 ${size === 'sm' ? 'grid-cols-[auto_minmax(0,1fr)] gap-3 px-3 py-1.5' : 'grid-cols-[minmax(84px,0.8fr)_minmax(0,1.2fr)] px-3 py-2 sm:grid-cols-[minmax(140px,0.8fr)_minmax(0,1.2fr)] sm:px-5 sm:py-2.5'} ${rowIndex < rowCount - 1 ? 'border-b border-border/40' : ''}`}
    >
      {/* ioiti-ui: what a screen reader reads of the row, a text: its time and its city, in the provider's words. */}
      <span className="sr-only">{words.row({ time: row.time.accessible, city: row.name })}</span>
      <div className="min-w-0 text-foreground">
        <MatrixText text={row.time.matrix} reduceMotion={reduceMotion} rebuildId={rebuildId} size={size} />
      </div>
      <div className="min-w-0 text-foreground">
        <MatrixText text={row.name} reduceMotion={reduceMotion} rebuildId={rebuildId} size={size} />
      </div>
    </li>
  );
});

export function WorldClock({
  cities,
  format,
  showSeconds = false,
  updateInterval = 1000,
  title,
  footer,
  size = 'md',
  className = '',
}: WorldClockProps) {
  // ioiti-ui: the provider's locale, clock and words where the props give none (null keeps the board without a title).
  const { locale, hourCycle } = useLocale();
  const words = useMessages().clock;
  const clock = format ?? (hourCycle === 'h12' ? '12h' : '24h');
  const heading = title === undefined ? words.title : title;
  const reduceMotion = useReducedMotionConfig() ?? false;
  const [now, setNow] = useState(() => Date.now());
  const selectedCities = useMemo(() => cities.slice(0, 5), [cities]);

  useEffect(() => {
    const interval = Number.isFinite(updateInterval) && updateInterval > 0 ? updateInterval : 1000;
    const timer = window.setInterval(() => setNow(Date.now()), interval);
    return () => window.clearInterval(timer);
  }, [updateInterval]);

  const rows = useMemo(() => selectedCities.map((city) => (
    { ...city, time: formatCityTime(new Date(now), city.timeZone, clock, showSeconds, locale) }
  )), [selectedCities, now, clock, showSeconds, locale]);

  // ioiti-ui: the region named by its title (or "World times" without one): each row says its time and its city
  // itself, which the region's name said again.
  const titleId = useId();
  return (
    <section
      aria-labelledby={heading ? titleId : undefined}
      aria-label={heading ? undefined : words.name}
      className={`relative ${size === 'sm' ? 'w-fit' : 'w-full max-w-3xl'} overflow-hidden ${SECTION} text-foreground [--amc-grid:color-mix(in_srgb,var(--foreground)_1%,transparent)] glass-card ${className}`}
      style={{ backgroundImage: 'linear-gradient(var(--amc-grid) 1px, transparent 1px), linear-gradient(90deg, var(--amc-grid) 1px, transparent 1px)', backgroundSize: '22px 22px' }}
    >
      <div>
        {/* ioiti-ui: its heading and its last line in sentence case, as every label (EasyUI's were capitals, spaced). */}
        {heading && (
          <header className={`flex items-center justify-between border-b border-border/70 ${size === 'sm' ? 'px-3 py-1.5' : 'px-4 py-3 sm:px-6'}`}>
            <p id={titleId} className="text-xs font-medium text-muted-foreground">{heading}</p>
          </header>
        )}
        <ul className="m-0 list-none p-0">
          {rows.map((row, rowIndex) => (
            <WorldClockRow key={row.id} row={row} rowIndex={rowIndex} rowCount={rows.length} reduceMotion={reduceMotion} size={size} />
          ))}
        </ul>
        {/* ioiti-ui: a light value in front of EasyUI's dark-only footer colours. */}
        <footer className={`border-t border-border/70 text-xs text-muted-foreground ${size === 'sm' ? 'px-3 py-1.5' : 'px-3 py-2 sm:px-5'}`}>
          {/* ioiti-ui: in the provider's words, the count of cities agreeing with it ("1 city"). */}
          {footer ?? (
            <>
              {words.cities(rows.length)} <span className="px-1.5 opacity-50">/</span> {words.timeZones}
            </>
          )}
        </footer>
      </div>
    </section>
  );
}
