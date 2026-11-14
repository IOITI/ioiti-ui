/**
 * Where the gallery's former pages went: until 0.18 a page held a whole group of components, each a part of it
 * (`/components/data#kpi`); each now has a page of its own. A link to a former part leads to that page.
 */
const MOVED: Record<string, Record<string, string>> = {
  shell: {
    'app-shell': 'shell/app-shell',
    'menu-sections': 'shell/app-shell',
    brand: 'shell/app-shell',
    'page-header': 'layout/page-header',
    'user-menu': 'top-bar/user-menu',
    'state-chip': 'top-bar/state-chip',
    shortcuts: 'top-bar/shortcuts-dialog',
    resizable: 'layout/resizable-panels',
    'save-bar': 'layout/save-bar',
    'leave-guard': 'shell/router-leave-guard',
    'not-found': 'states/not-found-state',
    auth: 'shell/auth-layout',
  },
  actions: {
    button: 'actions/button',
    'button-link': 'actions/button-link',
    'icon-button': 'actions/icon-button',
    'split-button': 'actions/split-button',
    confirm: 'actions/confirm-action',
    drag: 'actions/drag-to-confirm',
    copy: 'actions/copy-button',
    kbd: 'code/kbd',
    export: 'actions/export-button',
  },
  forms: {
    field: 'forms/field',
    form: 'forms/form',
    checkbox: 'choices/checkbox',
    choices: 'choices/spring-select',
    'inline-edit': 'forms/inline-edit',
    'multi-select': 'choices/multi-select',
    number: 'forms/number-input',
    slider: 'choices/slider',
    segmented: 'choices/segmented-control',
    'time-range': 'dates/time-range-picker',
    otp: 'forms/otp-input',
    dates: 'dates/date-picker',
    upload: 'forms/animated-file-upload',
  },
  feedback: {
    alert: 'feedback/alert',
    badge: 'feedback/badge',
    status: 'feedback/status-badge',
    'status-history': 'figures/status-history',
    toasts: 'feedback/toast-provider',
    undo: 'feedback/undo-toast',
    request: 'feedback/request-status',
    loader: 'states/loader',
    progress: 'states/progress-bar',
    skeleton: 'states/skeleton',
    checks: 'feedback/check-list',
  },
  overlays: {
    tooltip: 'overlays/directional-tooltip',
    peek: 'overlays/peek-link',
    popover: 'overlays/popover',
    menu: 'overlays/dropdown-menu',
    tour: 'overlays/product-tour',
    dialog: 'overlays/settle-modal',
    flysheet: 'overlays/flysheet',
    bell: 'top-bar/notification-bell',
    spotlight: 'top-bar/spotlight-search',
    island: 'feedback/dynamic-island',
  },
  navigation: {
    tabs: 'navigation/animated-tabs',
    breadcrumb: 'navigation/breadcrumb',
    stepper: 'navigation/stepper',
    accordion: 'layout/smooth-accordion',
    basket: 'tables/selection-basket',
    progress: 'navigation/scroll-progress-nav',
  },
  data: {
    table: 'tables/table',
    'advanced-table': 'tables/data-table',
    'data-table-parts': 'tables/data-table',
    'description-list': 'tables/description-list',
    code: 'code/code-block',
    changes: 'tables/change-list',
    disclosure: 'layout/disclosure',
    avatar: 'top-bar/avatar',
    'live-value': 'figures/live-value',
    'relative-time': 'dates/relative-time',
    'copy-chip': 'code/copy-chip',
    kpi: 'figures/kpi-tile',
    'kpi-strip': 'figures/kpi-strip',
    'stat-card': 'figures/stat-card',
    signed: 'figures/signed-value',
    timeline: 'tables/interactive-timeline',
    ledger: 'tables/recovery-ledger',
    comparison: 'tables/smart-comparison',
    agent: 'ai/ai-agent-activity',
    response: 'ai/ai-response',
    thinking: 'ai/ai-response',
    'response-parts': 'ai/ai-response',
    composer: 'ai/prompt-composer',
    'attachment-chip': 'ai/attachment-chip',
    clock: 'dates/airport-matrix-clock',
  },
  charts: {
    sparkline: 'charts/sparkline',
    legend: 'charts/chart-legend',
    bar: 'charts/bar-chart',
    line: 'charts/line-chart',
    'bar-list': 'charts/bar-list',
    donut: 'charts/donut-chart',
    heatmap: 'charts/activity-heatmap',
    funnel: 'charts/funnel-chart',
    'live-line': 'charts/live-line-chart',
    trace: 'charts/dependency-trace',
  },
  code: {
    'code-languages': 'code/code-block',
    'code-editor': 'code/code-editor',
    'diff-editor': 'code/diff-editor',
    log: 'code/log-viewer',
  },
}

/** The former pages whose address is no category's now, and the category each led to. */
export const GONE: Record<string, string> = { '/components/data': '/components/tables' }

/**
 * Where a link to a former page's part leads now (`/components/data#kpi`), when it is one: a category kept its
 * former page's address, and a part of it that is one of its components stays where it is.
 */
export function movedTo(pathname: string, hash: string): string | undefined {
  const page = pathname.replace(/\/+$/, '').match(/^\/components\/([^/]+)$/)?.[1]
  const part = decodeURIComponent(hash.replace(/^#/, ''))
  if (!page) return undefined
  const moved = part ? MOVED[page]?.[part] : undefined
  if (moved) return `/components/${moved}`
  return GONE[`/components/${page}`]
}

/** Every former part, with where it leads (the gallery's test follows each). */
export const FORMER_PARTS: { from: string; to: string }[] = Object.entries(MOVED).flatMap(([page, parts]) =>
  Object.entries(parts).map(([part, to]) => ({ from: `/components/${page}#${part}`, to: `/components/${to}` })),
)
