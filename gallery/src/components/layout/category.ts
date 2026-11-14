import { LayoutTemplate } from 'lucide-react'

import type { CategoryInfo } from '../../catalogue/types'

const layout: CategoryInfo = {
  slug: 'layout',
  label: 'Page layout',
  icon: LayoutTemplate,
  summary: 'What a page is made of: its header, the panels its sections sit in, what folds open, what is resized, and the bar of what is not saved yet.',
  families: [
    {
      slug: 'page-header',
      name: 'PageHeader',
      names: ['PageHeader'],
      keywords: ['title', 'heading', 'h1', 'actions', 'page title'],
      examples: [
        { id: 'actions', title: 'Title, description, actions', description: 'The page’s first block: its title, what it holds in a sentence, its actions on the right (a link drawn as a button to create, a button to act). One a page: it names the tab.' },
        { id: 'deeper', title: 'A page deeper than the menu', description: 'parents gives the trail the pages between the menu and this one. Under a record’s header, name says which of its tabs is shown, the heading keeping the record.' },
        { id: 'long-title', title: 'A long title, a narrow column', description: 'Its title and description wrap; its actions go under them once the room is short, as on a phone.' },
      ],
    },
    {
      slug: 'panel',
      name: 'Panel',
      names: ['Panel', 'PanelInset'],
      keywords: ['card', 'section', 'box', 'container', 'surface'],
      examples: [
        { id: 'parts', title: 'Title, description, action', description: 'Every section of a page sits in one: a hairline border, the surface at half its strength, soft corners. Its title is a section’s; its action, on the right, a small outline button or a quiet link.' },
        { id: 'set-apart', title: 'A box set apart', description: 'PanelInset: a figure’s detail, a note, a shade off the panel (a faint tint of it under glass), never a second card.' },
        { id: 'dense', title: 'Dense, holding a table', description: 'dense brings the body close under the title: for a list or a table whose first row is the content.' },
      ],
    },
    {
      slug: 'resizable-panels',
      name: 'ResizablePanels',
      names: ['ResizablePanels', 'ResizablePanel', 'ResizableHandle'],
      keywords: ['split', 'splitter', 'pane', 'drag', 'resize'],
      examples: [
        { id: 'side-by-side', title: 'Side by side', description: 'Each panel sized by the handle between them: dragged, or with the arrow keys once it has the focus (Shift for more, Home and End, Enter folds the preview away, a double click back). Under 640 px, one under the other.' },
        { id: 'one-over-the-other', title: 'One over the other', description: 'direction="vertical": a query over its results. onSizesChange tells the shares once a handle has moved them, to keep them.' },
      ],
    },
    {
      slug: 'disclosure',
      name: 'Disclosure',
      names: ['Disclosure'],
      keywords: ['details', 'summary', 'collapse', 'expand', 'more'],
      examples: [
        { id: 'plain', title: 'In the flow of a page', description: 'More, shown on demand: what a setting does, the details of a request. The browser’s own: find in the page opens it on what it finds.' },
        { id: 'boxed', title: 'Boxed', description: 'variant="boxed", in a border of its own: the figures of a chart as a table, under it. Its height follows what it holds.' },
        { id: 'controlled', title: 'Opened from outside', description: 'open and onOpenChange: a link elsewhere on the page opens it, and its state is the page’s to keep.' },
      ],
    },
    {
      slug: 'smooth-accordion',
      name: 'SmoothAccordion',
      names: ['SmoothAccordion'],
      keywords: ['faq', 'accordion', 'questions', 'collapse'],
      examples: [
        { id: 'one-at-a-time', title: 'One at a time', description: 'Questions and their answers: opening one closes the other. A subtitle says more of a question.' },
        { id: 'several', title: 'Several open', description: 'allowMultiple: each opens and closes on its own, for answers compared side by side; defaultOpen opens a few at first.' },
      ],
    },
    {
      slug: 'save-bar',
      name: 'SaveBar',
      names: ['SaveBar'],
      keywords: ['unsaved', 'save', 'discard', 'dirty', 'bottom bar'],
      examples: [
        { id: 'unsaved', title: 'Unsaved changes', description: 'At the bottom of the page while there is something to save: what, Discard and Save, and why it cannot be saved yet (empty the limit). It stays in sight as the page scrolls; the toasts rise above it.' },
        { id: 'failed', title: 'A save that failed', description: 'What the server answered stays in the bar, said at once to a screen reader, until the next try: here the first save fails.' },
        { id: 'states', title: 'Its states', description: 'Saving (its buttons wait), not valid yet (Save disabled, the reason in error), with another action before Discard, and words of the page’s own.' },
      ],
    },
  ],
}

export default layout
