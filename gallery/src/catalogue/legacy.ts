/**
 * Where the gallery's former pages went: until 0.18 a page held a whole group of components, each a part of it
 * (`/components/data#kpi`); each now has a page of its own. A link to a former part leads to that page. Until 0.31, a
 * component copied from EasyUI kept EasyUI's name, and its page's address that name (RENAMED, below).
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
    choices: 'choices/select-menu',
    'inline-edit': 'forms/inline-edit',
    'multi-select': 'choices/multi-select',
    number: 'forms/number-input',
    slider: 'choices/slider',
    segmented: 'choices/segmented-control',
    'time-range': 'dates/time-range-picker',
    otp: 'forms/otp-input',
    dates: 'dates/date-picker',
    upload: 'forms/file-upload',
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
    tooltip: 'overlays/tooltip',
    peek: 'overlays/peek-link',
    popover: 'overlays/popover',
    menu: 'overlays/dropdown-menu',
    tour: 'overlays/product-tour',
    dialog: 'overlays/dialog',
    flysheet: 'overlays/sheet',
    bell: 'top-bar/notification-bell',
    spotlight: 'top-bar/spotlight-search',
    island: 'feedback/status-island',
  },
  navigation: {
    tabs: 'navigation/tabs',
    breadcrumb: 'navigation/breadcrumb',
    stepper: 'navigation/stepper',
    accordion: 'layout/accordion',
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
    comparison: 'tables/comparison-table',
    agent: 'ai/ai-agent-activity',
    response: 'ai/ai-response',
    thinking: 'ai/ai-response',
    'response-parts': 'ai/ai-response',
    composer: 'ai/prompt-composer',
    'attachment-chip': 'ai/attachment-chip',
    clock: 'dates/world-clock',
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
 * The components given the name of their role in 0.31.0 (their former names still work until 1.0: FamilyInfo's
 * `formerly`): a page's former address, in its category, and its address now. Its examples kept their anchors.
 */
const RENAMED: Record<string, string> = {
  'overlays/settle-modal': 'overlays/dialog',
  'overlays/flysheet': 'overlays/sheet',
  'choices/spring-select': 'choices/select-menu',
  'feedback/velocity-toast': 'feedback/toast',
  'layout/smooth-accordion': 'layout/accordion',
  'overlays/directional-tooltip': 'overlays/tooltip',
  'navigation/animated-tabs': 'navigation/tabs',
  'forms/animated-file-upload': 'forms/file-upload',
  'dates/airport-matrix-clock': 'dates/world-clock',
  'tables/smart-comparison': 'tables/comparison-table',
  'feedback/dynamic-island': 'feedback/status-island',
}

/** The former addresses of the components renamed, each a route of its own (router.tsx), and where each leads. */
export const FORMER_ADDRESSES: { from: string; to: string }[] = Object.entries(RENAMED).map(([from, to]) => ({
  from: `/components/${from}`,
  to: `/components/${to}`,
}))

/**
 * Where a link to a former page's part leads now (`/components/data#kpi`), when it is one: a category kept its
 * former page's address, and a part of it that is one of its components stays where it is. A component's former
 * address leads to its page, at the same example (`/components/overlays/settle-modal#form`).
 */
export function movedTo(pathname: string, hash: string): string | undefined {
  const path = pathname.replace(/\/+$/, '')
  const family = path.match(/^\/components\/([^/]+\/[^/]+)$/)?.[1]
  if (family && RENAMED[family]) return `/components/${RENAMED[family]}${hash}`
  const page = path.match(/^\/components\/([^/]+)$/)?.[1]
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
