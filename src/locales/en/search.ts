import type { MessageKit } from '../../lib/messages.js'

/** SpotlightSearch. */
export const search = {
  /** "Spotlight Search": the palette's name, where the application gives none; what ⌘K is listed as. */
  label: 'Spotlight Search',
  /** "Search…": the field's placeholder, where the application gives none. */
  placeholder: 'Search…',
  /** "Search": the field's name. */
  search: 'Search',
  /** "Search Orders": the field's name in an entry's list. */
  searchIn: (list: string) => `Search ${list}`,
  /** "Back": the hint of the button that goes back from an entry's list, beside its key. */
  back: 'Back',
  /** "Back from Orders": that button's name. */
  backFrom: (list: string) => `Back from ${list}`,
  /** "Close": the button drawn as Escape, which closes the palette. */
  close: 'Close',
  /** "Recent": the heading of the entries chosen last. */
  recent: 'Recent',
  /** "Recent searches": the heading of the searches made before. */
  recentSearches: 'Recent searches',
  /** "Opens its list": what an entry with a list of its own says of itself. */
  opensList: 'Opens its list',
  /** "Searching…": said to a screen reader while entries are found. */
  searching: 'Searching…',
  /** "2 results, 11 more": said to a screen reader once typing pauses; "No results" for none. */
  results: ({ count, more }: { count: number; more: number }, { plural, number }: MessageKit) =>
    count === 0
      ? 'No results'
      : `${plural(count, { one: '# result', other: '# results' })}${more > 0 ? `, ${number(more)} more` : ''}`,
  /** "Orders: 2 results": the same in an entry's list, its title first. */
  inList: ({ list, results }: { list: string; results: string }) => `${list}: ${results}`,
  /** "No results found for “zz”": what the list says when nothing is found. */
  noResultsFor: (query: string) => `No results found for “${query}”`,
  /** "11 more: type to narrow them down.": the entries found past the most listed. */
  more: (count: number, { number }: MessageKit) => `${number(count)} more: type to narrow them down.`,
  /** "The search failed.": what went wrong, where the application says nothing. */
  failed: 'The search failed.',
  /** "Try again": the button that searches again. */
  tryAgain: 'Try again',
}
