import type { ElementType, ReactNode } from 'react'
import { LoaderCircle, Paperclip, X } from 'lucide-react'

import { CLOSE_SM } from '../lib/recipes.js'
import { cn } from '../lib/utils.js'
import { Hint } from './Hint.js'
import { useLinkComponent } from './link-context.js'

interface AttachmentChipProps {
  /** What it is: a file's name, a record's title. */
  label: string
  /** Beside it: its size, "Uploading…", why it could not be taken. */
  detail?: ReactNode
  /** What kind of thing it is, unless a thumbnail shows it; a paperclip by default. */
  icon?: ReactNode
  /** An image's address, shown small in place of the icon. */
  thumbnail?: string
  /** Where it leads: its label is then a link. */
  href?: string
  /** What draws that link: the application's (LinkProvider) by default; `'a'` for a file the browser opens itself. */
  linkComponent?: ElementType
  /** It can be taken away: a button named "Remove <label>". */
  onRemove?: () => void
  /** `danger`: it could not be taken, `detail` says why. */
  tone?: 'neutral' | 'danger'
  /** While it is made ready (an upload): a spinner in place of its icon, said to screen readers. */
  busy?: boolean
  className?: string
}

/** Longer than this, a label may not hold in a phone's room (10rem of small text): it may be cut, in its middle. */
const LONG = 24

/** What a cut label keeps at its end: a file's extension and the few characters before it (`-v3`, a date's day). */
function endOf(label: string): string {
  const extension = /\.[A-Za-z0-9]{1,8}$/.exec(label)?.[0] ?? ''
  return label.slice(-(extension.length + 6))
}

/**
 * Something attached to a request or a message: a file, a record. A long label is cut in its middle where
 * room ends (a phone), its end kept (a file's extension), the whole of it in a hint and said to screen
 * readers; it may lead somewhere, and be taken away.
 */
export function AttachmentChip({
  label,
  detail,
  icon,
  thumbnail,
  href,
  linkComponent,
  onRemove,
  tone = 'neutral',
  busy = false,
  className,
}: AttachmentChipProps) {
  const applicationLink = useLinkComponent()
  const Link = linkComponent ?? applicationLink
  const danger = tone === 'danger'
  const mark = busy ? (
    <LoaderCircle className="size-3.5 shrink-0 motion-safe:animate-spin" aria-hidden />
  ) : thumbnail ? (
    <img src={thumbnail} alt="" className="size-5 shrink-0 rounded-sm object-cover" />
  ) : (
    <span className="flex shrink-0 [&>svg]:size-3.5" aria-hidden>
      {icon ?? <Paperclip />}
    </span>
  )
  // A long label is cut as CopyChip cuts a value, in its middle: its start gives way where room ends, its end
  // (the extension) stays; what is shown is hidden from screen readers, which hear the whole of it.
  const long = label.length > LONG
  const end = long ? endOf(label) : ''
  const name = long ? (
    <span className="flex min-w-0 max-w-[10rem] sm:max-w-[16rem]">
      <span aria-hidden className="flex min-w-0">
        <span className="min-w-0 overflow-hidden text-ellipsis whitespace-pre">{label.slice(0, -end.length)}</span>
        <span className="shrink-0 whitespace-pre">{end}</span>
      </span>
      <span className="sr-only">{label}</span>
    </span>
  ) : (
    <span className="min-w-0 max-w-[10rem] truncate sm:max-w-[16rem]">{label}</span>
  )
  const named = href ? (
    // The application's link, held in context (LinkProvider): the same component at every render.
    // oxlint-disable-next-line react/static-components
    <Link href={href} className="flex min-w-0 underline-offset-4 hover:underline">
      {name}
    </Link>
  ) : (
    name
  )

  return (
    <span
      aria-busy={busy || undefined}
      className={cn(
        'inline-flex min-h-7 max-w-full items-center gap-1.5 rounded-md border py-0.5 pl-1.5 text-xs',
        onRemove ? 'pr-0.5' : 'pr-2',
        danger
          ? 'border-negative/30 bg-negative/5 text-foreground dark:bg-negative/10'
          : 'border-border bg-surface-raised text-foreground accent:border-brand/25',
        className,
      )}
    >
      <span className={cn('text-muted-foreground', danger && 'text-negative')}>{mark}</span>
      {long ? (
        <Hint content={label} wrap={!href} className="min-w-0">
          {named}
        </Hint>
      ) : (
        named
      )}
      {busy && <span className="sr-only">, being made ready</span>}
      {detail && (
        <span className={cn('min-w-0 shrink truncate tabular-nums text-muted-foreground', danger && 'text-negative')}>
          {detail}
        </span>
      )}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${label}`}
          className={CLOSE_SM}
        >
          <X aria-hidden />
        </button>
      )}
    </span>
  )
}
