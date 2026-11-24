import { Home, RefreshCw, RotateCcw, TriangleAlert, WifiOff } from 'lucide-react'
import { useContext, useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

import { ButtonLink } from '../components/ButtonLink.js'
import { Button } from '../components/ui/button.js'
import { errorDetails, errorKind } from '../lib/errors.js'
import type { ErrorKind } from '../lib/errors.js'
import { TONE_TEXT } from '../lib/recipes.js'
import { useScrollRegion } from '../lib/scroll-region.js'
import { cn } from '../lib/utils.js'
import type { Crumb } from './navigation.js'
import { TabTitleContext, usePageName, useTabTitle } from './page-trail-context.js'

// The bundler's, or Node's in the tests: no type of Node in the package's own (as src/lib/dev.ts).
declare const process: { env: { NODE_ENV?: string } }

export interface ErrorStateProps {
  /** The heading, what failed ("The orders could not be loaded"); by default, words for the kind of error. */
  title?: string
  /** What happened, and what to do about it; by default, words for the kind of error. */
  description?: ReactNode
  /**
   * What was thrown or caught. Its kind chooses the words and the way out (a part of the application that failed to
   * load is reloaded, not tried again); in development, its message and stack are under "Details".
   */
  error?: unknown
  /** What tries again (a request made again, a boundary's `reset`): a "Try again" button; none without it. */
  onRetry?: () => void
  /** Trying again, under way: its button busy, and no second press. */
  retrying?: boolean
  /** The way home, a link; `null` for none (a part of a page has none by default). */
  home?: { href: string; label: string } | null
  /**
   * A page (the default): it names the top bar's trail and the browser's tab, its heading is the page's (level 1),
   * and takes the focus as it appears. `false`: a part of a page (a panel's content), smaller, naming nothing, said
   * to a screen reader where the focus is.
   */
  page?: boolean
  /** What the trail and the tab call the page, the heading by default (a page only). */
  name?: string
  /** The pages between its entry of the menu and itself, as PageHeader takes them (a page only). */
  parents?: Crumb[]
  /**
   * Its heading takes the focus as it appears: a page's does (but in a shell drawn in a part of a page, which names no
   * tab), a part's does not.
   */
  focusOnMount?: boolean
  /** The level of its heading: 1 for a page, 3 for a part (under a panel's) by default. */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
  /** In place of the kind's icon, in the neutral tone: a lock for a page the person may not see. */
  icon?: ReactNode
  className?: string
}

const HOME = { href: '/', label: 'Back to home' }

// What each kind says: its words with a Try again and without one (nothing to press says nothing of pressing).
const WORDS: Record<ErrorKind, { page: string; part: string; retry: string; wait: string; icon: ReactNode; tone: string }> = {
  other: {
    page: 'Something went wrong',
    part: 'This part could not be shown',
    retry: 'Try again; if it fails again, come back to it later.',
    wait: 'Come back to it later; if it fails again, tell whoever runs the application.',
    icon: <TriangleAlert />,
    tone: TONE_TEXT.negative,
  },
  offline: {
    page: 'The server could not be reached',
    part: 'The server could not be reached',
    retry: 'Check the connection, then try again.',
    wait: 'Check the connection, then come back to it.',
    icon: <WifiOff />,
    tone: TONE_TEXT.warning,
  },
  chunk: {
    page: 'This page could not be loaded',
    part: 'This part could not be loaded',
    retry: 'A new version of the application may have been published since this page was opened: reloading gets it.',
    wait: 'A new version of the application may have been published since this page was opened: reloading gets it.',
    icon: <RefreshCw />,
    tone: TONE_TEXT.info,
  },
}

/**
 * What a page, or a part of one, shows in place of itself when it failed: what went wrong, in words for its kind,
 * and the way on (try again, reload, home). AppShell shows it for a page that throws, the shell kept; ErrorBoundary
 * for a part; RouterErrorPage for a route that failed to load. For an address that names nothing, NotFoundState.
 */
export function ErrorState(props: ErrorStateProps) {
  return props.page === false ? <ErrorPart {...props} /> : <ErrorPage {...props} />
}

/** A page that failed: named in the trail and the tab, as any page. */
function ErrorPage(props: ErrorStateProps) {
  const words = WORDS[errorKind(props.error)]
  const title = props.title ?? words.page
  usePageName(props.name ?? title, props.parents)
  useTabTitle(props.name ?? title)
  // A shell drawn in a part of a page (a demo) names no tab, and its page takes no focus from the page around it.
  const ownsTheTab = useContext(TabTitleContext)
  return <ErrorView {...props} title={title} focusOnMount={props.focusOnMount ?? ownsTheTab} page />
}

/** A part of a page that failed: naming nothing, said where the focus is. */
function ErrorPart(props: ErrorStateProps) {
  const words = WORDS[errorKind(props.error)]
  return <ErrorView {...props} title={props.title ?? words.part} focusOnMount={props.focusOnMount ?? false} page={false} />
}

function ErrorView({
  title,
  description,
  error,
  onRetry,
  retrying = false,
  home,
  page,
  focusOnMount,
  headingLevel,
  icon,
  className,
}: ErrorStateProps & { title: string; page: boolean; focusOnMount: boolean }) {
  const kind = errorKind(error)
  const words = WORDS[kind]
  const root = useRef<HTMLDivElement>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    if (focusOnMount) heading.current?.focus({ preventScroll: true })
  }, [focusOnMount])

  // Its Try again worked: the error goes, its button with it, and the focus goes to the page (its main) rather than to
  // nothing. Tried and failed again, the new error's heading has it already.
  const retried = useRef(false)
  useEffect(() => {
    const landing = root.current?.closest<HTMLElement>('main')
    return () => {
      if (!retried.current || !landing) return
      requestAnimationFrame(() => {
        const now = document.activeElement
        if ((now && now !== document.body && now.isConnected) || !landing.isConnected) return
        if (!landing.hasAttribute('tabindex')) landing.tabIndex = -1
        landing.focus({ preventScroll: true })
      })
    }
  }, [])

  const Heading = `h${headingLevel ?? (page ? 1 : 3)}` as const
  const way = home === undefined ? (page ? HOME : null) : home
  // A part of the application that failed to load comes back by reloading the page: trying again loads the same.
  const again = kind === 'chunk' ? () => window.location.reload() : onRetry
  const retry =
    again &&
    (() => {
      retried.current = true
      again()
    })
  const details = process.env.NODE_ENV !== 'production' && error !== undefined ? errorDetails(error) : ''
  // A stack longer than its box: a stop of the keyboard, which scrolls it.
  const detailsText = useRef<HTMLPreElement>(null)
  const detailsRegion = useScrollRegion(detailsText, { label: 'Details', key: details })

  return (
    <div
      ref={root}
      // A part that failed is said where the focus is; a page's heading takes the focus, which says it.
      role={page ? undefined : 'alert'}
      className={cn('flex flex-col items-center whitespace-normal text-center', page ? 'gap-2 px-6 py-16' : 'gap-1 px-4 py-6', className)}
    >
      <div
        aria-hidden
        className={cn(
          'grid place-items-center rounded-xl border border-border bg-surface-raised',
          icon ? 'text-muted-foreground' : words.tone,
          page ? 'mb-3 size-12 [&>svg]:size-6' : 'mb-2 size-8 [&>svg]:size-4',
        )}
      >
        {icon ?? words.icon}
      </div>
      <Heading
        ref={heading}
        tabIndex={-1}
        className={cn('text-balance break-words font-semibold text-foreground outline-none', page ? 'text-2xl tracking-tight' : 'text-sm')}
      >
        {title}
      </Heading>
      <p className={cn('text-pretty text-muted-foreground', page ? 'max-w-md text-sm' : 'max-w-sm text-xs')}>{description ?? (again ? words.retry : words.wait)}</p>
      {(again || way) && (
        <div className={cn('flex flex-wrap items-center justify-center gap-2', page ? 'mt-4' : 'mt-3')}>
          {again && (
            <Button
              size={page ? 'md' : 'sm'}
              variant={way ? 'primary' : 'outline'}
              isLoading={retrying}
              leftIcon={kind === 'chunk' ? <RefreshCw className="size-4" /> : <RotateCcw className="size-4" />}
              onClick={retry}
            >
              {kind === 'chunk' ? 'Reload' : 'Try again'}
            </Button>
          )}
          {way && (
            <ButtonLink to={way.href} variant={again ? 'outline' : 'primary'} size={page ? 'md' : 'sm'} leftIcon={<Home className="size-4" />}>
              {way.label}
            </ButtonLink>
          )}
        </div>
      )}
      {/* What a developer needs to mend it, in development only: a production build keeps none of it. */}
      {details && (
        <details className={cn('w-full max-w-2xl text-left', page ? 'mt-6' : 'mt-3')}>
          <summary className="cursor-pointer text-xs text-muted-foreground">Details</summary>
          <pre
            ref={detailsText}
            {...detailsRegion}
            className="mt-2 max-h-60 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-border bg-surface-raised p-3 font-mono text-[13px] text-foreground"
          >
            {details}
          </pre>
        </details>
      )}
    </div>
  )
}
