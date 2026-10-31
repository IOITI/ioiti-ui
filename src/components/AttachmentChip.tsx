import type { ElementType, ReactNode } from 'react'
import { LoaderCircle, Paperclip, X } from 'lucide-react'

import { cn } from '../lib/utils.js'
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

/**
 * Something attached to a request or a message: a file, a record. Its label is cut where room ends (a
 * phone), the whole of it said to screen readers; it may lead somewhere, and be taken away.
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
    <img src={thumbnail} alt="" className="size-5 shrink-0 rounded object-cover" />
  ) : (
    <span className="flex shrink-0 [&>svg]:size-3.5" aria-hidden>
      {icon ?? <Paperclip />}
    </span>
  )
  const name = <span className="min-w-0 max-w-[10rem] truncate sm:max-w-[16rem]">{label}</span>

  return (
    <span
      aria-busy={busy || undefined}
      className={cn(
        'inline-flex min-h-7 max-w-full items-center gap-1.5 rounded-lg border py-0.5 pl-1.5 text-xs',
        onRemove ? 'pr-0.5' : 'pr-2',
        danger
          ? 'border-negative/40 bg-negative/5 text-foreground'
          : 'border-border bg-surface-raised text-foreground accent:border-brand/25',
        className,
      )}
    >
      <span className={cn('text-muted-foreground', danger && 'text-negative')}>{mark}</span>
      {href ? (
        // The application's link, held in context (LinkProvider): the same component at every render.
        // oxlint-disable-next-line react/static-components
        <Link href={href} className="flex min-w-0 underline-offset-4 hover:underline">
          {name}
        </Link>
      ) : (
        name
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
          className="grid size-6 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-surface-hover hover:text-foreground"
        >
          <X className="size-3.5" aria-hidden />
        </button>
      )}
    </span>
  )
}
