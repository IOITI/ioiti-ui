import type { MessageKit } from '../../lib/messages.js'

/** LogViewer. */
export const log = {
  /** "Nothing logged yet.": shown while there is no line. */
  empty: 'Nothing logged yet.',
  /** "Search Build log": the name of its search field, with the log's. */
  search: (label: string) => `Search ${label}`,
  /** "Search": its search field's placeholder. */
  searchPlaceholder: 'Search',
  /** "3 of 12": which of the lines found is in sight, among how many. */
  matchPosition: ({ index, count }: { index: number; count: number }) => `${index} of ${count}`,
  /** "No match": the search found nothing. */
  noMatch: 'No match',
  /** "Previous match": the button that goes to the line found before. */
  previousMatch: 'Previous match',
  /** "Previous match (Shift+Enter)": its hint, with its keys. */
  previousMatchHint: (keys: string) => `Previous match (${keys})`,
  /** "Next match": the button that goes to the line found after. */
  nextMatch: 'Next match',
  /** "Next match (Enter)": its hint, with its keys. */
  nextMatchHint: (keys: string) => `Next match (${keys})`,
  /** "Wrap long lines": the button that wraps them, or not. */
  wrap: 'Wrap long lines',
  /** "Long lines wrapped": its hint while they are. */
  wrapped: 'Long lines wrapped',
  /** "Long lines scroll sideways": its hint while they are not. */
  unwrapped: 'Long lines scroll sideways',
  /** "Copy the log": the button that copies the lines shown. */
  copy: 'Copy the log',
  /** "Download the log": the button that saves them as a file. */
  download: 'Download the log',
  /** "Download as build.log": its hint, with the file's name. */
  downloadAs: (name: string) => `Download as ${name}`,
  /** "25 earlier lines dropped": the lines no longer kept, above the first one shown. */
  dropped: (count: number, { plural }: MessageKit) => plural(count, { one: '# earlier line dropped', other: '# earlier lines dropped' }),
  /** "Jump to the end": the button that follows the newest lines again. */
  jumpToEnd: 'Jump to the end',
}
