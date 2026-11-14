import { Table2 } from 'lucide-react'

import type { CategoryInfo } from '../../catalogue/types'

const tables: CategoryInfo = {
  slug: 'tables',
  label: 'Tables and lists',
  icon: Table2,
  summary: 'Records side by side or one after another: tables that scroll in their own frame, terms and their details, changes, steps and versions.',
  families: [
    {
      slug: 'table',
      name: 'Table',
      names: ['Table', 'TableHead', 'TableBody', 'TableRow', 'TableHeaderCell', 'TableCell'],
      keywords: ['rows', 'columns', 'grid', 'figures'],
      examples: [
        { id: 'records', title: 'Records in a panel', description: 'Compact, the default: 12 px, rows apart by a line. Ids in mono, the name in the primary text, figures on the right in digits of one width.' },
        { id: 'dense', title: 'Figures side by side', description: 'density="dense": 14 px, narrow cells, for figures read across. Each row named by its first cell, a header cell.' },
        { id: 'row-action', title: 'A row’s action', description: 'The id that leads to the record is a link; what acts on the row is an xs button at its end, which says what came of it.' },
        { id: 'narrow', title: 'Wider than its room', description: 'A table wider than the page scrolls sideways in its own frame, never the page.' },
        { id: 'empty', title: 'Nothing to show', description: 'An EmptyState, compact, across its columns: what there is not, and what would bring something.' },
      ],
    },
    {
      slug: 'data-table',
      name: 'DataTable',
      names: ['DataTable', 'AdvancedDataTable', 'DataTableToolbar', 'DataTableFilters', 'DataTableContent', 'DataTablePagination'],
      keywords: ['data grid', 'search', 'sort', 'filter', 'pagination', 'bulk actions'],
      examples: [
        { id: 'orders', title: 'Search, sort, filter, open', description: 'Records to search, sort, filter and open, a page at a time. Its filters are one group of buttons: a list to tick for each column, each option with the rows it would leave (a search past seven), and two options as an on/off pair. A selection shows the basket of what can be done with it.' },
        { id: 'states', title: 'Loading, failed, empty', description: 'While the rows come, lines that breathe; refused, what the server said; none at all, the page’s own words (emptyTitle), which a search that finds nothing does not take.' },
        { id: 'parts', title: 'Composed from its parts', description: 'DataTable and its parts, for a page that puts its toolbar or its paging elsewhere: here the paging above the rows, with page sizes of its own.' },
        { id: 'held-state', title: 'Its state held by the page', description: 'state and onStateChange: the search, the filters, the sort and the page held by the page, which would keep them in its address for a link or a reload to show the same rows.' },
        { id: 'held-selection', title: 'A selection the page holds', description: 'selectedRowIds and onSelectionChange: the page knows what is selected; isRowSelectable leaves out the rows that cannot be (orders already sent).' },
      ],
    },
    {
      slug: 'selection-basket',
      name: 'SelectionBasket',
      names: ['SelectionBasket'],
      keywords: ['bulk actions', 'selection', 'toolbar'],
      examples: [
        { id: 'inline', title: 'Under a list', description: 'The count, select all, clear, and the actions, a disabled one saying why. It shows while something is selected; a data table shows one under itself.' },
        { id: 'contained', title: 'Over its list', description: 'mode="contained" floats at the foot of the box that holds the list (positioned), over its last rows: give the list room under them.' },
        { id: 'actions', title: 'Its actions', description: 'primary for what the selection is for, danger for what removes, default for the rest; an action that leads to another page is a link.' },
      ],
    },
    {
      slug: 'description-list',
      name: 'DescriptionList',
      names: ['DescriptionList'],
      keywords: ['key value', 'details', 'properties', 'summary'],
      examples: [
        { id: 'rows', title: 'A summary in rows', description: 'rows, the default: each term and its details on one line, the details at the end. Boxed for a total, divided for a longer list; numeric lines figures up.' },
        { id: 'columns', title: 'A record’s details', description: 'columns: the terms in a column of their own (termWidth), the details beside them, a long one wrapping under itself.' },
        { id: 'grid', title: 'Figures side by side', description: 'grid: two to four columns from a small screen up, one on a phone; each term over its figure.' },
        { id: 'inline', title: 'Facts in a line', description: 'inline, compressed: a few facts under a heading, wrapping as the room ends.' },
      ],
    },
    {
      slug: 'smart-comparison',
      name: 'SmartComparison',
      names: ['SmartComparison'],
      keywords: ['compare', 'plans', 'pricing', 'matrix'],
      examples: [
        { id: 'plans', title: 'Plans compared', description: 'Plans side by side, row by row, in categories: a search over the rows and “Differences only”. The featured plan is set apart; below 640 px one plan is shown at a time.' },
        { id: 'offers', title: 'In the page’s words', description: 'Any things to compare (carriers here): a value as a node with its text in keys, a colour before each name, and every word of the matrix the page’s.' },
      ],
    },
    {
      slug: 'change-list',
      name: 'ChangeList',
      names: ['ChangeList'],
      keywords: ['diff', 'before after', 'changes', 'audit'],
      examples: [
        { id: 'changes', title: 'Before and after', description: 'A value changed is struck through, then its new one; what is added says New, what is removed says Removed. Screen readers hear “from … to …”.' },
        { id: 'groups', title: 'Changes by part', description: 'groups: the changes under the part of the settings they belong to.' },
        { id: 'before-confirming', title: 'Before it is confirmed', description: 'What a change will do, in the dialog that applies it; or, after it, what was done.' },
      ],
    },
    {
      slug: 'interactive-timeline',
      name: 'InteractiveTimeline',
      names: ['InteractiveTimeline'],
      keywords: ['history', 'events', 'activity', 'steps'],
      examples: [
        { id: 'order', title: 'What happened to an order', description: 'Step by step, with its moments and figures: a step opens on its description; one with only a title and a time has nothing to open.' },
        { id: 'statuses', title: 'Every status', description: 'Done and under way in blue (the accent’s colour), a warning amber, a failure red, what is to come grey; a badge only with statusLabel. A step can name who did it and its commit.' },
        { id: 'open', title: 'Always open', description: 'collapsible={false}: each step shows what it holds, nothing folds; for a short history read whole.' },
      ],
    },
    {
      slug: 'recovery-ledger',
      name: 'RecoveryLedger',
      names: ['RecoveryLedger'],
      keywords: ['versions', 'history', 'restore', 'undo'],
      examples: [
        { id: 'timeline', title: 'Versions to restore', description: 'Newest first, the current one marked; an earlier one opens on what restoring it would change. Restore asks first: the ledger restores nothing itself.' },
        { id: 'compact', title: 'Compact', description: 'variant="compact", without the line, for a side panel; the entry opened held by the page (expandedId).' },
      ],
    },
  ],
}

export default tables
