// What a locale (a BCP 47 tag: "en-GB", "fr-FR", "en-US") says beyond its words: the day its weeks start on, its clock
// (24 or 12 hours), how it writes a number and reads one typed. From Intl, which knows them, where the browser says
// them; from CLDR's own table where it does not (Firefox has no `Intl.Locale#getWeekInfo`).

/** A day of the week as `Date#getDay` numbers it: 0 Sunday, 1 Monday … 6 Saturday. */
export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6

/** A clock of 24 hours ("22:52") or of 12 ("10:52 PM"). */
export type HourCycle = 'h23' | 'h12'

/** The locale the package speaks when nothing says another: its English, its formats, as it always has. */
export const DEFAULT_LOCALE = 'en-GB'

// CLDR's first day of the week (supplemental weekData) for the regions that do not start on Monday, the world's default.
const SUNDAY_FIRST = new Set(
  'AG AS BD BR BS BT BW BZ CA CN CO DM DO ET GT GU HK HN ID IL IN JM JP KE KH KR LA MH MM MO MT MX MZ NI NP PA PE PH PK PR PT PY SA SG SV TH TT TW UM US VE VI WS YE ZA ZW'.split(
    ' ',
  ),
)
const SATURDAY_FIRST = new Set('AE AF BH DJ DZ EG IQ IR JO KW LY OM QA SD SY'.split(' '))
const FRIDAY_FIRST = new Set(['MV'])

interface WeekInfo {
  /** 1 Monday … 7 Sunday. */
  firstDay: number
}

/** A tag Intl takes, or the default one: a mistyped locale shows the package's own, never a crash. */
function localeOf(locale: string): Intl.Locale {
  try {
    return new Intl.Locale(locale)
  } catch {
    return new Intl.Locale(DEFAULT_LOCALE)
  }
}

/** The day a locale's weeks start on: Monday in France and Britain, Sunday in the United States. */
export function firstDayOf(locale: string): WeekDay {
  const tag = localeOf(locale) as Intl.Locale & { getWeekInfo?: () => WeekInfo; weekInfo?: WeekInfo }
  const info = tag.getWeekInfo?.() ?? tag.weekInfo
  if (info) return (info.firstDay % 7) as WeekDay
  // Its region, or the one its language is most likely spoken in ("en" is American English, "fr" French).
  const region = tag.region ?? tag.maximize().region ?? ''
  if (SUNDAY_FIRST.has(region)) return 0
  if (SATURDAY_FIRST.has(region)) return 6
  if (FRIDAY_FIRST.has(region)) return 5
  return 1
}

/** A locale's clock: 24 hours in Britain and France, 12 in the United States. */
export function hourCycleOf(locale: string): HourCycle {
  const cycle = new Intl.DateTimeFormat(localeOf(locale).toString(), { hour: 'numeric' }).resolvedOptions().hourCycle
  return cycle === 'h11' || cycle === 'h12' ? 'h12' : 'h23'
}

/** How a locale writes a number: its decimal separator, the one between groups of thousands, its minus. */
export interface NumberSymbols {
  decimal: string
  group: string
  minus: string
}

const symbols = new Map<string, NumberSymbols>()

export function numberSymbolsOf(locale: string): NumberSymbols {
  const known = symbols.get(locale)
  if (known) return known
  const parts = new Intl.NumberFormat(localeOf(locale).toString()).formatToParts(-12345.6)
  const part = (type: string, fallback: string) => parts.find((each) => each.type === type)?.value ?? fallback
  const found = { decimal: part('decimal', '.'), group: part('group', ','), minus: part('minusSign', '-') }
  symbols.set(locale, found)
  return found
}

// Spaces a person or a locale puts between groups (French writes a narrow no-break one), and the minus signs.
const SPACES = /[\s    ]/g
const MINUSES = /^[-−‒–﹣－]/

/**
 * A number typed by a person, read as its locale writes one, and as people type it whatever their locale: "1 234,5"
 * and "1234.5" are 1234.5 in French. With both a dot and a comma, the last of them is the decimal one ("1.234,5",
 * "1,234.5"); a separator alone between groups of three is the locale's grouping one ("1,500" is 1500 in English,
 * "1.500" in German); any other is decimal ("1,5" is 1.5 in English too). Anything else: NaN.
 */
export function parseLocaleNumber(text: string, locale: string = DEFAULT_LOCALE): number {
  const { decimal, group, minus } = numberSymbolsOf(locale)
  let rest = text.replace(SPACES, '').replace(minus, '-').replace(MINUSES, '-')
  const negative = rest.startsWith('-')
  if (negative || rest.startsWith('+')) rest = rest.slice(1)
  // Apostrophes group thousands in Switzerland ("1'234.5", "1’234.5").
  rest = rest.replace(/['’]/g, '')
  if (!/^[\d.,]+$/.test(rest) || !/\d/.test(rest)) return Number.NaN

  const separators = [...rest].filter((char) => char === '.' || char === ',')
  let integer = rest
  let fraction = ''
  if (separators.length > 0) {
    const kinds = new Set(separators)
    if (kinds.size === 2) {
      // Both: the last one written is the decimal one, the other groups.
      const at = Math.max(rest.lastIndexOf('.'), rest.lastIndexOf(','))
      const grouping = rest[at] === '.' ? ',' : '.'
      if (rest.slice(at + 1).includes(grouping)) return Number.NaN
      integer = rest.slice(0, at).split(grouping).join('')
      fraction = rest.slice(at + 1)
      if (!groupsOfThree(rest.slice(0, at), grouping)) return Number.NaN
    } else {
      const separator = separators[0]
      const pieces = rest.split(separator)
      // Grouping before three digits, never after a 0 nor before nothing ("0,123" and ",500" are decimals).
      const grouped = pieces.length > 2 || (separator === group && separator !== decimal && pieces[1].length === 3 && /^[1-9]/.test(pieces[0]))
      if (grouped) {
        if (!groupsOfThree(rest, separator)) return Number.NaN
        integer = pieces.join('')
      } else {
        ;[integer, fraction] = pieces
      }
    }
  }
  if (integer === '' && fraction === '') return Number.NaN
  const value = Number(`${integer || '0'}.${fraction || '0'}`)
  return negative ? -value : value
}

/**
 * Whether a number's integer part is grouped as thousands are: by threes after its first group ("1,234,567"), or by
 * twos before its last three, as India groups them ("1,23,456"); not "12,34".
 */
function groupsOfThree(text: string, separator: string): boolean {
  const [first, ...others] = text.split(separator)
  const last = others.length - 1
  return /^[1-9]\d{0,2}$/.test(first) && others.every((each, at) => each.length === 3 || (at < last && each.length === 2))
}
