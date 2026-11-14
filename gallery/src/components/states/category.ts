import { Hourglass } from 'lucide-react'

import type { CategoryInfo } from '../../catalogue/types'

const states: CategoryInfo = {
  slug: 'states',
  label: 'Loading and empty',
  icon: Hourglass,
  summary: 'Every page waits, comes back empty, fails or names what is not there: the design says each the same way everywhere.',
  families: [
    {
      slug: 'loader',
      name: 'Loader',
      names: ['Loader'],
      keywords: ['spinner', 'loading', 'wait', 'busy'],
      examples: [
        { id: 'variants', title: 'Variants', description: 'A wait without a known end, named for screen readers: an arc, dots, a line or rings.' },
        { id: 'sizes', title: 'Sizes', description: 'In pixels: 16 on a line of text, 24 in a card, 32 (the default) on its own.' },
        { id: 'colours', title: 'Colours, and still', description: 'A token for another colour, which has its value in both themes; reduceMotion makes it only fade.' },
        { id: 'in-context', title: 'Beside what it waits for', description: 'Small, before the words that say what is awaited. A block that loads is a skeleton, not a loader over it.' },
      ],
    },
    {
      slug: 'skeleton',
      name: 'Skeleton',
      names: ['Skeleton', 'SkeletonText', 'SkeletonAvatar', 'SkeletonReveal'],
      keywords: ['placeholder', 'loading', 'shimmer'],
      examples: [
        { id: 'shapes', title: 'Its shapes', description: 'A block sized by its class, lines of text, a round avatar: the shape of what is coming, as high as it will be.' },
        { id: 'loaded', title: 'Revealing what loaded', description: 'SkeletonReveal swaps the skeleton for the content, which fades in: nothing jumps when it arrives.' },
        { id: 'list', title: 'A list as it loads', description: 'As many rows as will come, each as high as a row.' },
      ],
    },
    {
      slug: 'progress-bar',
      name: 'ProgressBar',
      names: ['ProgressBar'],
      keywords: ['progress', 'upload', 'import', 'percentage'],
      examples: [
        { id: 'values', title: 'Its value in words', description: 'How far a piece of work has come, in words beside the bar and for a screen reader; the percentage when no words are given. A long label wraps.' },
        { id: 'tones', title: 'Tones and sizes', description: 'Neutral while it runs, positive once done, warning and negative when it goes wrong; sm in a card or a row.' },
        { id: 'indeterminate', title: 'Of unknown length', description: 'Without a value, the fill breathes: work under way whose end is not known.' },
        { id: 'running', title: 'Work under way', description: 'The value as the work gives it, then its outcome in its tone. A ratio against a limit is a Meter.' },
      ],
    },
    {
      slug: 'query-state',
      name: 'QueryState',
      names: ['QueryState'],
      keywords: ['loading', 'error', 'fetch', 'query', 'refresh'],
      examples: [
        { id: 'states', title: 'Loading, failed, refreshed', description: 'Loading shows the shape of what comes, as high as it will be. A failure says what went wrong; a failed refresh keeps what is on screen and says so above it.' },
        { id: 'empty', title: 'Loaded, with nothing', description: 'Data that came back empty is the page’s to say: an EmptyState where the rows would be.' },
      ],
    },
    {
      slug: 'empty-state',
      name: 'EmptyState',
      names: ['EmptyState'],
      keywords: ['empty', 'no data', 'zero', 'blank', 'first use'],
      examples: [
        { id: 'page', title: 'Nothing yet', description: 'What there is not under a heading, why, and what to do about it: a link to create, a button for another way.' },
        { id: 'compact', title: 'Compact, in a panel', description: 'Smaller and closer inside a panel, its heading one level under the panel’s; nothing matched, with the way back to something.' },
        { id: 'in-a-table', title: 'Across a table’s columns', description: 'In one cell spanning the columns: the table keeps its head, which says what would be there.' },
      ],
    },
    {
      slug: 'empty-text',
      name: 'EmptyText',
      names: ['EmptyText', 'ErrorText'],
      keywords: ['empty', 'error message', 'no results'],
      examples: [
        { id: 'in-a-list', title: 'A list with nothing', description: 'One quiet line, which says what would be there and when it comes.' },
        { id: 'in-a-table', title: 'In a table', description: 'Across the columns of a table that has no row: for a heading and a way to something, an EmptyState.' },
        { id: 'error-text', title: 'What went wrong', description: 'ErrorText, under the button whose action failed: read out at once, in the negative colour.' },
      ],
    },
    {
      slug: 'not-found-state',
      name: 'NotFoundState',
      names: ['NotFoundState', 'NotFoundPage', 'NotFound'],
      keywords: ['404', 'not found', 'missing', 'catch-all'],
      examples: [
        { id: 'record', title: 'A record that is not there', description: 'A page whose record does not exist (its API answered 404): what is missing, pages it may have been, the way home and back.' },
        { id: 'catch-all', title: 'An address that is no page', description: 'NotFoundPage, the router’s catch-all: an address under an entry of the menu suggests that entry.' },
        { id: 'outside-the-shell', title: 'Outside the shell', description: 'NotFound, the page under both, for a 404 with no shell around it: its own actions, a line at its foot.' },
      ],
    },
  ],
}

export default states
