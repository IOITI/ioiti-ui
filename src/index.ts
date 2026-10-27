// The public interface of ioiti-ui. Named one by one, never `export *`: what a file keeps for
// itself stays out, and every change here is a change of the package's interface
// (src/index.test.ts holds the list).

// Helpers.
export { cn, copyToClipboard, scrollToTop } from './lib/utils.js'
export { isPlainClick } from './lib/links.js'
export { motionTransitions } from './lib/motion-tokens.js'
export {
  ACCENTS,
  DEFAULT_THEME_STORAGE_KEY,
  MATERIALS,
  THEME_KEY_ATTRIBUTE,
  applyTheme,
  nextPreference,
  readPreference,
  resolveTheme,
  systemIsDark,
  themeLabel,
  themeStorageKey,
  watchSystem,
  writePreference,
} from './lib/theme.js'
export type { Accent, Material, Theme, ThemePreference } from './lib/theme.js'
export {
  formatBytes,
  formatClock,
  formatDateTime,
  formatDay,
  formatDuration,
  formatMoney,
  formatMoneyCompact,
  formatNumber,
  formatPercent,
  formatRelative,
  formatSpan,
  formatTime,
  formatWait,
  toIsoDay,
  toneOf,
} from './lib/format.js'
export type { Tone } from './lib/format.js'
export { downloadCsv, toCsv } from './lib/csv.js'
export type { CsvColumn } from './lib/csv.js'
export { ALL_TIME, lastDays, rangeParams } from './lib/dateRange.js'
export { formatTimeRange, resolveTimeRange } from './lib/date-math.js'
export type { TimeRange } from './lib/date-math.js'
export { useNow } from './lib/now.js'
export type { Check, CheckState } from './lib/checks.js'
export { HEALTH_STATUS_LABEL } from './lib/health.js'
export type { HealthStatus } from './lib/health.js'

// What an application puts around its pages.
export { IoitiProvider } from './components/IoitiProvider.js'
export { useAppName } from './components/app-context.js'
export { LinkProvider } from './components/LinkProvider.js'
export { useLinkComponent, useNavigateTo } from './components/link-context.js'
export type { NavigateTo } from './components/link-context.js'
export { LookPicker } from './components/LookPicker.js'
export { ThemeProvider } from './components/ThemeProvider.js'
export { ThemeToggle } from './components/ThemeToggle.js'
export { useTheme } from './components/theme-context.js'
export type { ThemeState } from './components/theme-context.js'
export { ToastProvider } from './components/ToastProvider.js'
export { useToast } from './components/toast-context.js'
export type { ShowToast, ToastMessage } from './components/toast-context.js'

// The shell: the frame of every page, its menu, the trail of the top bar, the page's name.
export { AppBrand, AppShell, SidebarFooterButton } from './shell/AppShell.js'
export type { AppShellProps } from './shell/AppShell.js'
export { AuthLayout } from './shell/AuthLayout.js'
export { NotFoundPage, NotFoundState } from './shell/NotFoundState.js'
export type { NotFoundStateProps } from './shell/NotFoundState.js'
export { PageTrailProvider, TopBarTrail } from './shell/PageTrail.js'
export { StateChip } from './shell/StateChip.js'
export { DEFAULT_HOME, PAGE_NOT_FOUND, UNNAMED, menuEntry, sidebarSections, trailFor } from './shell/navigation.js'
export type { Crumb, Menu, MenuEntry, PageName } from './shell/navigation.js'
export { usePageName, usePageTrail, useTabTitle, useTrail } from './shell/page-trail-context.js'
export { useMainScroll } from './components/main-scroll-context.js'

// The blocks pages are made of.
export { ButtonLink } from './components/ButtonLink.js'
export { ChangeList } from './components/ChangeList.js'
export type { Change, ChangeGroup } from './components/ChangeList.js'
export { ChartLegend } from './components/ChartLegend.js'
export type { ChartLegendItem } from './components/ChartLegend.js'
export { CheckIcon, CheckList } from './components/CheckList.js'
export { Code, CodeBlock } from './components/CodeBlock.js'
export type { CodeLanguage, CodeToken, CodeTokenKind } from './lib/highlight.js'
export { ConfirmAction } from './components/ConfirmAction.js'
export { CopyButton } from './components/CopyButton.js'
export { DateRangeFilter } from './components/DateRangeFilter.js'
export { DescriptionList } from './components/DescriptionList.js'
export type { DescriptionItem } from './components/DescriptionList.js'
export { Disclosure } from './components/Disclosure.js'
export { ContextMenu, DropdownMenu } from './components/DropdownMenu.js'
export type {
  DropdownMenuAction,
  DropdownMenuCheckbox,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLink,
  DropdownMenuRadioGroup,
  DropdownMenuSeparator,
  DropdownMenuSubmenu,
} from './components/DropdownMenu.js'
export { ExportButton } from './components/ExportButton.js'
export { EmptyText, ErrorText } from './components/messages.js'
export { Field } from './components/Field.js'
export { Hint } from './components/Hint.js'
export { IconButton } from './components/IconButton.js'
export { InlineEdit } from './components/InlineEdit.js'
export { Kbd } from './components/Kbd.js'
export { KpiGrid, KpiTile, Meter } from './components/KpiTile.js'
export type { MeterTone } from './components/meter-tones.js'
export { LineChart } from './components/LineChart.js'
export type { LineChartProps, LineMarker, LinePoint, LineReference, LineSeries } from './components/LineChart.js'
export { PageHeader, Panel } from './components/Panel.js'
export { MultiSelect } from './components/MultiSelect.js'
export type { MultiSelectOption } from './components/MultiSelect.js'
export { NumberInput } from './components/NumberInput.js'
export { PeekLink } from './components/PeekLink.js'
export { Popover } from './components/Popover.js'
export { BarList, ProgressBar } from './components/ProgressBar.js'
export type { BarListItem } from './components/ProgressBar.js'
export { QueryState, SignedValue, StatusBadge } from './components/status.js'
export { SegmentedControl } from './components/SegmentedControl.js'
export type { SegmentedControlOption, SegmentedControlProps } from './components/SegmentedControl.js'
export { RangeSlider, Slider } from './components/Slider.js'
export type { SliderLevel, SliderTick } from './components/Slider.js'
export { Sparkline } from './components/Sparkline.js'
export { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from './components/Table.js'
export { TextLink } from './components/TextLink.js'
export { AutoRefresh, TimeRangePicker } from './components/TimeRangePicker.js'
export type { CommonRange, RefreshSettings } from './components/TimeRangePicker.js'
export type { TableDensity } from './components/Table.js'

// The components, from EasyUI (src/components/ui/: docs/easyui-changes.md says what was changed).
export { ActivityHeatmap } from './components/ui/activity-heatmap.js'
export type { ActivityHeatmapProps, DivergingColors, HeatDay } from './components/ui/activity-heatmap.js'
export {
  AdvancedDataTable,
  DataTable,
  DataTableContent,
  DataTableFilters,
  DataTablePagination,
  DataTableToolbar,
  useDataTable,
} from './components/ui/advanced-data-table.js'
export type {
  AdvancedDataTableProps,
  ColumnDef,
  DataTableContentProps,
  DataTableContextValue,
  DataTableFiltersProps,
  DataTablePaginationProps,
  DataTableProps,
  DataTableSelectionBasket,
  DataTableToolbarProps,
  DataTableViewMode,
  SortDirection,
} from './components/ui/advanced-data-table.js'
export {
  AgentActivityHeader,
  AgentActivityItem,
  AgentActivityTimeline,
  AIAgentActivity,
  useAgentActivity,
} from './components/ui/ai-agent-activity.js'
export type {
  ActivityStatus,
  ActivityType,
  AgentActivityContextValue,
  AgentActivityHeaderProps,
  AgentActivityItemData,
  AgentActivityItemProps,
  AgentActivityTimelineProps,
  AIAgentActivityProps,
} from './components/ui/ai-agent-activity.js'
export { AirportMatrixClock } from './components/ui/airport-matrix-clock.js'
export type { AirportMatrixCity, AirportMatrixClockProps } from './components/ui/airport-matrix-clock.js'
export { Alert, AlertDescription, AlertTitle } from './components/ui/alert.js'
export type { AlertProps, AlertTone } from './components/ui/alert.js'
export { AnimatedFileUpload } from './components/ui/animated-file-upload.js'
export type {
  AnimatedFileUploadProps,
  FileUploadStatus,
  UploadFileItem,
  UploadResult,
} from './components/ui/animated-file-upload.js'
export { AnimatedNumber } from './components/ui/animated-number.js'
export type { AnimatedNumberProps } from './components/ui/animated-number.js'
export { AnimatedTabs } from './components/ui/animated-tabs.js'
export type { AnimatedTabsProps, TabItem } from './components/ui/animated-tabs.js'
export { Badge } from './components/ui/badge.js'
export type { BadgeProps, BadgeTone, BadgeVariant } from './components/ui/badge.js'
export { BarChart } from './components/ui/bar-chart.js'
export type { BarChartProps, BarDatum, BarSeries } from './components/ui/bar-chart.js'
export { Breadcrumb } from './components/ui/breadcrumb.js'
export type { BreadcrumbItem, BreadcrumbProps } from './components/ui/breadcrumb.js'
export { Button, buttonClassName } from './components/ui/button.js'
export type { ButtonProps, ButtonSize, ButtonVariant } from './components/ui/button.js'
export { Calendar } from './components/ui/calendar.js'
export type {
  CalendarOptions,
  CalendarProps,
  CalendarRangeProps,
  CalendarSingleProps,
  DateRange,
} from './components/ui/calendar.js'
export { Combobox } from './components/ui/combobox.js'
export type { ComboboxOption, ComboboxProps } from './components/ui/combobox.js'
export { DatePicker, DateRangePicker } from './components/ui/date-picker.js'
export type { DatePickerProps, DateRangePickerProps } from './components/ui/date-picker.js'
export { DependencyTrace } from './components/ui/dependency-trace.js'
export type { DependencyTraceProps, TraceConnection, TraceNode, TraceStatus } from './components/ui/dependency-trace.js'
export { DirectionalTooltip } from './components/ui/directional-tooltip.js'
export type { DirectionalTooltipProps, TooltipAlign, TooltipSide } from './components/ui/directional-tooltip.js'
export { DonutChart } from './components/ui/donut-chart.js'
export type { DonutChartProps, DonutDatum } from './components/ui/donut-chart.js'
export { DragToConfirm } from './components/ui/drag-to-confirm.js'
export type {
  DragConfirmActionType,
  DragConfirmSize,
  DragConfirmVariant,
  DragToConfirmProps,
} from './components/ui/drag-to-confirm.js'
export { DrawCheckbox as Checkbox } from './components/ui/draw-checkbox.js'
export type { DrawCheckboxProps as CheckboxProps } from './components/ui/draw-checkbox.js'
export { DynamicIsland } from './components/ui/dynamic-island.js'
export type { DynamicIslandProps, DynamicIslandState } from './components/ui/dynamic-island.js'
export {
  Flysheet,
  FlysheetBody,
  FlysheetClose,
  FlysheetContent,
  FlysheetDescription,
  FlysheetFooter,
  FlysheetHeader,
  FlysheetTitle,
  FlysheetTrigger,
} from './components/ui/flysheet.js'
export type {
  FlysheetCloseReason,
  FlysheetContentProps,
  FlysheetPadding,
  FlysheetProps,
  FlysheetSide,
  FlysheetSize,
  FlysheetType,
} from './components/ui/flysheet.js'
export {
  Form,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  RadioGroup,
  RadioGroupItem,
  Select,
  Switch,
  Textarea,
} from './components/ui/form.js'
export type {
  FormItemProps,
  FormLabelProps,
  FormMessageProps,
  FormProps,
  InputProps,
  RadioGroupItemProps,
  RadioGroupProps,
  RadioOption,
  SelectOption,
  SelectProps,
  SwitchProps,
  TextareaProps,
} from './components/ui/form.js'
export { FunnelChart } from './components/ui/funnel-chart.js'
export type { FunnelChartProps, FunnelStage } from './components/ui/funnel-chart.js'
export { InteractiveTimeline } from './components/ui/interactive-timeline.js'
export type {
  InteractiveTimelineProps,
  TimelineItem,
  TimelineMetric,
  TimelineStatus,
} from './components/ui/interactive-timeline.js'
export { LiveLineChart } from './components/ui/live-line-chart.js'
export type { LiveLineChartProps } from './components/ui/live-line-chart.js'
export { Loader } from './components/ui/loader.js'
export type { LoaderProps } from './components/ui/loader.js'
export { NotFound } from './components/ui/not-found.js'
export type { NotFoundProps, NotFoundSuggestion } from './components/ui/not-found.js'
export { NotificationBell } from './components/ui/notification-bell.js'
export type { Notification, NotificationBellProps, NotificationTone } from './components/ui/notification-bell.js'
export { OTPInput } from './components/ui/otp-input.js'
export type { OTPInputProps } from './components/ui/otp-input.js'
export { PeekCard } from './components/ui/peek-card.js'
export type { PeekCardProps } from './components/ui/peek-card.js'
export { RecoveryLedger } from './components/ui/recovery-ledger.js'
export type { LedgerEntry, RecoveryLedgerProps } from './components/ui/recovery-ledger.js'
export { RequestStatus } from './components/ui/request-status.js'
export type { RequestLifecycleStatus, RequestStatusFigure, RequestStatusProps } from './components/ui/request-status.js'
export { ScrollProgressNav } from './components/ui/scroll-progress-nav.js'
export type { NavSectionItem, ScrollProgressNavProps } from './components/ui/scroll-progress-nav.js'
export { SelectionBasket } from './components/ui/selection-basket.js'
export type { SelectionActionItem, SelectionBasketProps } from './components/ui/selection-basket.js'
export { SettleModal } from './components/ui/settle-modal.js'
export type { SettleModalProps } from './components/ui/settle-modal.js'
export { Sidebar, SidebarTrigger, useSidebar } from './components/ui/sidebar.js'
export type { SidebarChild, SidebarItem, SidebarProps, SidebarSection } from './components/ui/sidebar.js'
export { Skeleton, SkeletonAvatar, SkeletonReveal, SkeletonText } from './components/ui/skeleton.js'
export type {
  SkeletonAvatarProps,
  SkeletonProps,
  SkeletonRevealProps,
  SkeletonTextProps,
} from './components/ui/skeleton.js'
export { SmartComparison } from './components/ui/smart-comparison.js'
export type {
  ComparisonCategory,
  ComparisonFeature,
  ComparisonPlan,
  SmartComparisonProps,
} from './components/ui/smart-comparison.js'
export { SmoothAccordion } from './components/ui/smooth-accordion.js'
export type { AccordionItem, SmoothAccordionProps } from './components/ui/smooth-accordion.js'
export { SplitButton } from './components/ui/split-button.js'
export type { SplitButtonOption, SplitButtonProps, SplitButtonSize } from './components/ui/split-button.js'
export { SpotlightSearch } from './components/ui/spotlight-search.js'
export type { SpotlightSearchItem, SpotlightSearchProps } from './components/ui/spotlight-search.js'
export { SpringSelect } from './components/ui/spring-select.js'
export type { SpringSelectOption, SpringSelectProps } from './components/ui/spring-select.js'
export { StatCard, StatGrid } from './components/ui/stat-card.js'
export type { StatCardProps } from './components/ui/stat-card.js'
export { StepPanels, Stepper } from './components/ui/stepper.js'
export type { Step, StepPanelsProps, StepperProps } from './components/ui/stepper.js'
export { StretchSwitch } from './components/ui/stretch-switch.js'
export type { StretchSwitchProps } from './components/ui/stretch-switch.js'
export { UndoToast } from './components/ui/undo-toast.js'
export type { UndoToastPosition, UndoToastProps, UndoToastVariant } from './components/ui/undo-toast.js'
export { VelocityToast } from './components/ui/velocity-toast.js'
export type { VelocityToastPosition, VelocityToastProps, VelocityToastVariant } from './components/ui/velocity-toast.js'
