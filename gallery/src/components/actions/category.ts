import { MousePointerClick } from 'lucide-react'

import type { CategoryInfo } from '../../catalogue/types'

const actions: CategoryInfo = {
  slug: 'actions',
  label: 'Actions',
  icon: MousePointerClick,
  summary: 'What does something is a button; what leads somewhere is a link, even when it looks like a button.',
  families: [
    {
      slug: 'button',
      name: 'Button',
      names: ['Button'],
      keywords: ['primary', 'submit', 'loading', 'destructive'],
      examples: [
        { id: 'variants', title: 'Variants', description: 'Primary for the one action a page or a dialog is for; outline and ghost for the others; destructive for what removes; success for what completes.' },
        { id: 'sizes', title: 'Sizes', description: 'xs on a line of text or a row of a table, sm beside a section’s heading, md on its own, lg alone on a page. Its icon is as tall as its words, at every size.' },
        { id: 'icons', title: 'With an icon', description: 'An icon before the words says what kind of action it is; after them, where it leads or that it opens more. Icon alone: size="icon" with an aria-label, or an IconButton.' },
        { id: 'states', title: 'Busy and disabled', description: 'Busy, it says what it does and cannot be pressed twice; disabled, it says why in a Hint beside it rather than in a title.' },
        { id: 'long-words', title: 'Words longer than its room', description: 'Held narrower than its words, they end in an ellipsis and its icons stay whole; fullWidth fills a narrow column (a phone’s form).' },
      ],
    },
    {
      slug: 'button-link',
      name: 'ButtonLink',
      names: ['ButtonLink'],
      keywords: ['link', 'navigate', 'router'],
      examples: [
        { id: 'variants', title: 'A link drawn as a button', description: 'It goes through the router, and opens in another tab with ⌘ or Ctrl: every variant and size of Button.' },
        { id: 'nowhere', title: 'Nowhere to go', description: 'Given no address (to={null}), it is a button that cannot be pressed: a “Next day” on the last day.' },
      ],
    },
    {
      slug: 'icon-button',
      name: 'IconButton',
      names: ['IconButton'],
      keywords: ['toolbar', 'top bar', 'icon'],
      examples: [
        { id: 'toolbar', title: 'A toolbar', description: 'An icon alone, named in words for screen readers, quiet until hovered: the top bar’s. Its Hint says more than its name where it needs to.' },
        { id: 'disabled', title: 'Disabled', description: 'A disabled one still says what it would do, on hover and on keyboard focus.' },
      ],
    },
    {
      slug: 'split-button',
      name: 'SplitButton',
      names: ['SplitButton'],
      keywords: ['menu', 'more actions', 'dropdown'],
      examples: [
        { id: 'options', title: 'One action and its variants', description: 'Each option can lead somewhere (a link) or act, say what it does, and be marked as removing.' },
        { id: 'variants', title: 'Variants and sizes', description: 'primary for the page’s main action, secondary beside it; info and danger for a tone. A disabled option stays in the list.' },
      ],
    },
    {
      slug: 'copy-button',
      name: 'CopyButton',
      names: ['CopyButton'],
      keywords: ['clipboard', 'copy'],
      examples: [
        { id: 'sizes', title: 'Its sizes, with or without words', description: 'Copies a value and says it did: a check for two seconds, its hint saying what came of it, and the words for a screen reader. The focus stays on it.' },
        { id: 'in-a-row', title: 'In a row of details', description: 'Beside the value it copies, at the size of the line.' },
      ],
    },
    {
      slug: 'export-button',
      name: 'ExportButton',
      names: ['ExportButton'],
      keywords: ['csv', 'download', 'spreadsheet'],
      single: 'One button, one behaviour: the file it saves is described beside it.',
      examples: [{ id: 'csv', title: 'Rows as a CSV file', description: 'The rows a page shows, saved as a CSV file named with the day; a value that a spreadsheet would read as a formula is neutralised.' }],
    },
    {
      slug: 'confirm-action',
      name: 'ConfirmAction',
      names: ['ConfirmAction'],
      keywords: ['confirm', 'dialog', 'delete', 'are you sure'],
      examples: [
        { id: 'slide', title: 'Slide, for what cannot be undone', description: 'What will happen, in the user’s words, then a gesture: the slide for what cannot be taken back.' },
        { id: 'button', title: 'A button, for the protective direction', description: 'Pausing, stopping, blocking: quick, a plain button.' },
        { id: 'refused', title: 'Refused, or not allowed', description: 'What the server answered stays in the dialog (error); blocked says why the action cannot be taken now.' },
      ],
    },
    {
      slug: 'drag-to-confirm',
      name: 'DragToConfirm',
      names: ['DragToConfirm'],
      keywords: ['slide', 'swipe', 'confirm'],
      examples: [
        { id: 'variants', title: 'Its tones', description: 'Dragged to the end, or Enter once it has the focus. Arrow keys do not confirm.' },
        { id: 'sizes', title: 'Sizes and actions', description: 'Its action type chooses its icon and words; its size follows the room.' },
        { id: 'disabled', title: 'Disabled', description: 'Not yet possible: still readable, not draggable.' },
      ],
    },
  ],
}

export default actions
