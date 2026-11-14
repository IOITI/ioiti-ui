import { Layers } from 'lucide-react'

import type { CategoryInfo } from '../../catalogue/types'

const overlays: CategoryInfo = {
  slug: 'overlays',
  label: 'Overlays',
  icon: Layers,
  summary: 'What floats over the page, from a hint to a dialog: drawn in the document’s body, kept on the screen, closed by Escape or a press elsewhere.',
  families: [
    {
      slug: 'hint',
      name: 'Hint',
      names: ['Hint'],
      keywords: ['tooltip', 'title', 'help', 'disabled', 'describe'],
      examples: [
        { id: 'controls', title: 'On a control', description: 'What more there is to know of a control, its label saying what it does: shown on hover, on keyboard focus and on a tap, read as its description.' },
        { id: 'disabled', title: 'Why it is disabled', description: 'A disabled control takes neither the pointer nor the focus: wrap gives the hint a wrapper that does. A title would show on none of a phone, a keyboard or a disabled control.' },
        { id: 'text', title: 'On words, on a field', description: 'Words take no focus of their own: wrap makes them a stop of the keyboard. A full-width field keeps its width (className).' },
        { id: 'sides', title: 'Its sides', description: 'On top by default; on the side asked, or the other one when there is no room.' },
      ],
    },
    {
      slug: 'directional-tooltip',
      name: 'DirectionalTooltip',
      names: ['DirectionalTooltip'],
      keywords: ['tooltip', 'arrow', 'placement'],
      examples: [
        { id: 'sides', title: 'Its sides', description: 'The tooltip under Hint: on the side asked, or the other one when there is no room, its arrow on its trigger. Hint is what pages use.' },
        { id: 'align', title: 'Aligned on its trigger', description: 'Along the side it is on: on the trigger’s start, its centre or its end.' },
        { id: 'timing', title: 'Delay, distance, arrow', description: '150 ms before it shows, 8 px away, with its arrow: each can be changed, for a design preview more than a page.' },
      ],
    },
    {
      slug: 'peek-link',
      name: 'PeekLink',
      names: ['PeekLink', 'PeekCard'],
      keywords: ['preview', 'hover card', 'peek'],
      examples: [
        { id: 'link', title: 'A link previewed', description: 'Its page previewed on hover, on keyboard focus and on a first tap, without leaving the page; a second tap, or a click, follows it.' },
        { id: 'card', title: 'On any trigger', description: 'PeekCard puts the card on another element, which keeps its own focus and click: above or below it, at once or after a delay, with its own link.' },
        { id: 'in-a-table', title: 'In a table', description: 'A reference previewed in its row: a few lines of the record, read as the card opens.' },
      ],
    },
    {
      slug: 'popover',
      name: 'Popover',
      names: ['Popover'],
      keywords: ['filters', 'panel', 'settings', 'floating'],
      examples: [
        { id: 'form', title: 'A form inside', description: 'Filters, applied by its own button, which closes it. The focus goes in; Escape, a Tab past its end or a press elsewhere closes it, the focus back on its button.' },
        { id: 'settings', title: 'A few settings', description: 'At the end of a row, under its icon button and aligned on its end: each box applies at once. The page stays in use.' },
        { id: 'placement', title: 'Placed and sized', description: 'On the side asked where there is room; as wide as its content, a number of pixels or its trigger; opened and closed by the page (open, onOpenChange).' },
      ],
    },
    {
      slug: 'dropdown-menu',
      name: 'DropdownMenu',
      names: ['DropdownMenu', 'ContextMenu'],
      keywords: ['menu', 'actions', 'more', 'context menu', 'right click'],
      examples: [
        { id: 'actions', title: 'Actions on a thing', description: 'Each acts, leads somewhere or is ticked; more in a sub-menu, which takes the menu’s place. The arrows move, a letter jumps, Escape closes; what removes comes last.' },
        { id: 'groups', title: 'Groups and descriptions', description: 'Under their headings, a second line where an item needs one; what cannot be done now stays in the list, disabled.' },
        { id: 'ticked', title: 'Boxes and a choice', description: 'A box ticked keeps the menu open, a choice of one closes it: the settings of a table.' },
        { id: 'context-menu', title: 'At the pointer', description: 'ContextMenu: a right click, a long press, Shift+F10 or the menu key on what it is the menu of.' },
      ],
    },
    {
      slug: 'settle-modal',
      name: 'SettleModal',
      names: ['SettleModal'],
      keywords: ['dialog', 'modal', 'popup'],
      examples: [
        { id: 'sizes', title: 'Its widths', description: 'Four widths, and a full one for two things side by side. It settles in from what opened it, keeps the focus, and gives it back.' },
        { id: 'form', title: 'A form', description: 'One field and what is wrong with it; the primary button submits the form, busy until the answer comes.' },
        { id: 'decision', title: 'A choice to make', description: 'No × and no closing by a click beside it: the reader answers. Escape still closes it.' },
      ],
    },
    {
      slug: 'flysheet',
      name: 'Flysheet',
      names: ['Flysheet', 'FlysheetTrigger', 'FlysheetContent', 'FlysheetHeader', 'FlysheetTitle', 'FlysheetDescription', 'FlysheetBody', 'FlysheetFooter', 'FlysheetClose'],
      keywords: ['sheet', 'drawer', 'side panel', 'flyout'],
      examples: [
        { id: 'record', title: 'A record beside the page', description: 'From the right, widened by its edge or the arrow keys on it; a child sheet beside its parent, or over it on a narrow screen.' },
        { id: 'sides', title: 'From each side', description: 'From the left for filters, the close button outside; from the top or the bottom, swiped away on a touch screen.' },
        { id: 'sizes', title: 'Its widths', description: 'sm, md (the default) and lg, or any number of pixels.' },
        { id: 'push', title: 'Beside the page', description: 'type="push": from a window 1024 px wide, the page makes room for it and stays in use; narrower, it covers the page.' },
        { id: 'non-modal', title: 'Without a backdrop', description: 'modal={false}: the page stays in use under it. onOpenChange says why it closed.' },
      ],
    },
    {
      slug: 'product-tour',
      name: 'ProductTour',
      names: ['ProductTour'],
      keywords: ['onboarding', 'walkthrough', 'tour', 'spotlight'],
      examples: [
        { id: 'tour', title: 'A tour of a panel', description: 'One part at a time, the page dimmed around it and scrolled to it, its step beside it (on a phone, at the bottom); a welcome and a goodbye in the middle.' },
        { id: 'followed', title: 'Started anywhere, followed', description: 'From any step (startAt), each step said as the reader moves (onStepChange), and how it ended: done, skip or dismiss.' },
      ],
    },
  ],
}

export default overlays
