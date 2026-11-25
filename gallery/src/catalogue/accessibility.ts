/**
 * The families whose guidelines say how they are used without a mouse, under `## Accessibility`: what a screen reader
 * hears (a role, a name, what it says as it changes), then a table of their keys (`| Key | What it does |`). In the
 * order of the categories; the catalogue's test holds each to it.
 */
export const KEYBOARD_FAMILIES = [
  'SplitButton',
  'ConfirmAction',
  'DragToConfirm',
  'Checkbox',
  'Switch',
  'RadioGroup',
  'SegmentedControl',
  'MultiSelect',
  'SelectMenu',
  'Slider',
  'Combobox',
  'NumberInput',
  'OTPInput',
  'InlineEdit',
  'FileUpload',
  'Calendar',
  'DatePicker',
  'TimeRangePicker',
  'StatusIsland',
  'Hint',
  'Tooltip',
  'PeekLink',
  'Popover',
  'DropdownMenu',
  'Dialog',
  'Sheet',
  'ProductTour',
  'Tabs',
  'AppShell',
  'Sidebar',
  'ResizablePanels',
  'UserMenu',
  'LookPicker',
  'NotificationBell',
  'SpotlightSearch',
  'ShortcutsDialog',
  'DataTable',
  'StatCard',
  'LineChart',
  'BarChart',
  'FunnelChart',
  'ActivityHeatmap',
  'DependencyTrace',
  'CodeEditor',
  'DiffEditor',
  'LogViewer',
  'PromptComposer',
]

/**
 * The families among them with nothing of their own but the browser's buttons, links and fields: their section says so
 * in a sentence, without a table.
 */
export const NATIVE_FAMILIES = ['Select', 'DateRangeFilter', 'Breadcrumb', 'ScrollProgressNav', 'TopBarTrail', 'Accordion', 'Disclosure']
