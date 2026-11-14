import { Compass } from 'lucide-react'

import type { CategoryInfo } from '../../catalogue/types'

const navigation: CategoryInfo = {
  slug: 'navigation',
  label: 'Navigation',
  icon: Compass,
  summary: 'Tabs, trails, steps, the parts of a page: what has an address is a link, which a ⌘-click opens in another tab.',
  families: [
    {
      slug: 'animated-tabs',
      name: 'AnimatedTabs',
      names: ['AnimatedTabs'],
      keywords: ['tabs', 'tablist', 'views', 'pill'],
      examples: [
        { id: 'views', title: 'Views of one thing', description: 'A tablist and its panel, named by the tab shown: one stop of the keyboard, whose arrows, Home and End move and choose. A badge counts what a view holds.' },
        { id: 'variants', title: 'Variants', description: 'default for a page’s views; pill, rounded, for a short choice over a chart or a list (glass is drawn as the pill). The background slides to the tab chosen.' },
        { id: 'controlled', title: 'Held by the page', description: 'The page holds the tab shown (activeTab, onChange): a button elsewhere can change it, and the page reads it. An icon before a name says what kind of view it is.' },
        { id: 'links', title: 'Tabs with an address', description: 'A view the address names (?view=) is a link: a plain click shows it in place, ⌘ or Ctrl opens it in another tab, which reads its view from the address.' },
        { id: 'narrow', title: 'More tabs than room', description: 'Where they do not all fit (a phone, a side panel), the row scrolls sideways in itself, each name on one line; the tab cut at its end says there is more.' },
      ],
    },
    {
      slug: 'breadcrumb',
      name: 'Breadcrumb',
      names: ['Breadcrumb'],
      keywords: ['trail', 'path', 'where am i'],
      examples: [
        { id: 'trail', title: 'Where a page is', description: 'From Home to the page, each step a link but the last, which is the page itself. The top bar draws one on every page: a page does not add a second.' },
        { id: 'separators', title: 'Separators', description: 'A chevron by default; a slash for a path the reader thinks of as one (a folder, a repository).' },
        { id: 'folded', title: 'Too many steps', description: 'Past maxItems (4 by default), the middle folds into “…”, a button that unfolds it, the focus on the first step it shows.' },
        { id: 'one-line', title: 'On one line', description: 'wrap={false}, the top bar’s: in a narrow room the steps are cut short with an ellipsis, the page’s own name first, rather than going to a second line.' },
      ],
    },
    {
      slug: 'stepper',
      name: 'Stepper',
      names: ['Stepper', 'StepPanels'],
      keywords: ['wizard', 'steps', 'progress', 'multi-step form'],
      examples: [
        { id: 'horizontal', title: 'A task in steps', description: 'The steps above, the current one’s panel under them, Back and Next under the panel. A step done can be gone back to: its number is a button.' },
        { id: 'vertical', title: 'Vertical', description: 'orientation="vertical" beside the panel, for steps whose descriptions say more, or a narrow column. The line fills down to the step under way.' },
        { id: 'review', title: 'The last step reviews', description: 'What will be sent, read once more before anything is: each step’s answers, a step back to change one, then the one primary action.' },
      ],
    },
    {
      slug: 'text-link',
      name: 'TextLink',
      names: ['TextLink'],
      keywords: ['link', 'anchor', 'router', 'view all'],
      examples: [
        { id: 'inline', title: 'In running text', description: 'inline, the default: underlined, in the accent’s colour where one is chosen. Its words say where it leads, never “here”.' },
        { id: 'in-a-list', title: 'In a list or a table', description: 'hover, where every name is a link: underlined under the pointer only, so that a column of them reads as names.' },
        { id: 'panel-action', title: 'A panel’s way further', description: 'quiet, in a panel’s header: small and muted until hovered, the “View all” of a list cut short.' },
      ],
    },
    {
      slug: 'scroll-progress-nav',
      name: 'ScrollProgressNav',
      names: ['ScrollProgressNav'],
      keywords: ['table of contents', 'on this page', 'scrollspy', 'sections'],
      examples: [
        { id: 'sticky', title: 'Sticky, in what scrolls', description: 'mode="sticky" at the top of what scrolls, which containerRef names: the line along its top says how far, the part being read is marked, each part is a link to its place. This page’s own bar is one, on the page’s scroll.' },
        { id: 'inline', title: 'Inline, above what it follows', description: 'mode="inline" outside the frame it follows: it stays where it is put and marks the part read in the frame below. Parts without an address are buttons.' },
      ],
    },
  ],
}

export default navigation
