import { ChevronRight } from 'lucide-react'
import type { MouseEvent, ReactNode } from 'react'

import { useLinkComponent } from '../components/link-context.js'
import { useMessages } from '../components/locale-context.js'
import { Popover } from '../components/Popover.js'
import { isPlainClick } from '../lib/links.js'
import { PRESSABLE, TONE_MARK, TONE_SOFT } from '../lib/recipes.js'
import { cn } from '../lib/utils.js'
import { byGravity, gravestTone, STATE_TONE, standsOut, stateSentence } from './state-summary.js'
import type { StateItem, StateTone } from './state-summary.js'

// The pill in the gravest tone, as StateChip draws a state: its faint ground, a step stronger under the pointer
// and while it is open. Quiet, it is the top bar's plain button.
const PILL: Record<StateTone, string> = {
  danger: cn(TONE_SOFT.negative, 'hover:bg-negative/10 aria-expanded:bg-negative/10 dark:hover:bg-negative/20 dark:aria-expanded:bg-negative/20'),
  warning: cn(TONE_SOFT.warning, 'hover:bg-warning/10 aria-expanded:bg-warning/10 dark:hover:bg-warning/20 dark:aria-expanded:bg-warning/20'),
  success: cn(TONE_SOFT.positive, 'hover:bg-positive/10 aria-expanded:bg-positive/10 dark:hover:bg-positive/20 dark:aria-expanded:bg-positive/20'),
  neutral: 'text-muted-foreground hover:bg-surface-hover hover:text-foreground aria-expanded:bg-surface-hover',
  ok: 'text-muted-foreground hover:bg-surface-hover hover:text-foreground aria-expanded:bg-surface-hover',
}

interface StateSummaryProps {
  /** The states, each while it applies; the quiet ones too (all is well, a fallback), said once it is opened. */
  items: StateItem[]
  /**
   * Its name: the button's, before what it says ("State: Payments down"), and the panel's; the provider's language's by
   * default ("State").
   */
  label?: string
  /** What it says while nothing stands out and nothing is neutral; the provider's language's by default ("All good"). */
  okLabel?: string
  /** Under the states, in the panel: a link to the page where they all are. */
  footer?: ReactNode
  className?: string
}

/**
 * The states the user must not miss, in one control of the top bar (AppShell's `topBarChips`): the gravest one's
 * words and icon in its tone, "+N" for the others (its icon and how many under 1280px), and a dot while all is well. It opens on every state, the
 * gravest first and the quiet ones after, each a link to where it is dealt with. Where several StateChips would
 * take the top bar's room: one is still a StateChip.
 */
export function StateSummary({ items, label: givenLabel, okLabel: givenOkLabel, footer, className }: StateSummaryProps) {
  // Its words in the provider's language, those given over them.
  const words = useMessages().shell
  const label = givenLabel ?? words.state
  const okLabel = givenOkLabel ?? words.allGood
  const tone = gravestTone(items)
  const ordered = byGravity(items)
  const out = ordered.filter((item) => standsOut(item.tone))
  const quiet = ordered.filter((item) => !standsOut(item.tone))
  const lead = out[0]
  const neutral = quiet.find((item) => item.tone === 'neutral')
  // What it is named holds the words it shows (WCAG 2.5.3, label in name): the gravest state's, then how many of each
  // tone where several stand out ("State: Payments down (1 to fix, 1 to watch)"). What it shows is for the eye: its count,
  // and under 1280px no words (a name given over them would hold none of them at one width or the other).
  const sentence = stateSentence(items, okLabel, words.stateCounts)
  const said = lead && out.length > 1 ? words.stateLead({ lead: lead.label, counts: sentence }) : sentence

  return (
    <Popover
      label={label}
      align="end"
      className="w-[22rem] max-w-[calc(100vw-2rem)] p-1.5"
      trigger={
        <button
          type="button"
          className={cn(
            PRESSABLE,
            'inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full px-2 text-xs font-medium transition-[background-color,color,scale] focus-ring xl:px-2.5 [&_svg]:size-3.5 [&_svg]:shrink-0',
            PILL[tone],
            className,
          )}
        >
          <span className="sr-only">{words.stateButton({ label, state: said })}</span>
          {lead ? (
            <>
              {lead.icon ?? <Dot tone={lead.tone} />}
              {/* Its words from 1280px: the trail before it, and the bar's end after it, take the room under that. */}
              <span aria-hidden className="hidden max-w-48 truncate xl:inline">
                {lead.label}
              </span>
              {out.length > 1 && (
                <span aria-hidden className="tabular-nums">
                  <span className="hidden xl:inline">+{out.length - 1}</span>
                  <span className="xl:hidden">{out.length}</span>
                </span>
              )}
            </>
          ) : (
            <>
              <Dot tone={tone} />
              <span aria-hidden className="hidden sm:inline">
                {neutral?.label ?? okLabel}
              </span>
            </>
          )}
        </button>
      }
    >
      {(close) => (
        <div className="flex flex-col gap-1">
          {out.length > 0 && <StateRows items={out} close={close} />}
          {out.length > 0 && quiet.length > 0 && <div aria-hidden className="mx-2 border-t border-border" />}
          {quiet.length > 0 && <StateRows items={quiet} close={close} quiet />}
          {items.length === 0 && <p className="px-2 py-1.5 text-muted-foreground">{okLabel}</p>}
          {footer && (
            // A link of the footer followed here closes it too, as a state's does.
            // oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
            <div
              className="mt-0.5 border-t border-border px-2 pt-2 pb-1 text-xs"
              onClick={(event: MouseEvent<HTMLDivElement>) => {
                if (isPlainClick(event) && (event.target as HTMLElement).closest('a')) close()
              }}
            >
              {footer}
            </div>
          )}
        </div>
      )}
    </Popover>
  )
}

function Dot({ tone }: { tone: StateTone }) {
  return <span aria-hidden className={cn('size-1.5 shrink-0 rounded-full', TONE_MARK[STATE_TONE[tone]])} />
}

function StateRows({ items, close, quiet = false }: { items: StateItem[]; close: () => void; quiet?: boolean }) {
  const Link = useLinkComponent()
  return (
    <ul className="flex flex-col">
      {items.map((item) => {
        const body = (
          <>
            {quiet ? (
              <span aria-hidden className="grid size-5 shrink-0 place-items-center">
                <Dot tone={item.tone} />
              </span>
            ) : (
              <span aria-hidden className={cn('grid size-5 shrink-0 place-items-center rounded-full [&_svg]:size-3', TONE_SOFT[STATE_TONE[item.tone]])}>
                {item.icon ?? <Dot tone={item.tone} />}
              </span>
            )}
            <span className="min-w-0 flex-1">
              <span className={cn('block', quiet ? 'text-text-secondary' : 'font-medium text-foreground')}>{item.label}</span>
              {item.detail && <span className="mt-0.5 block text-xs text-muted-foreground">{item.detail}</span>}
            </span>
            {item.href && <ChevronRight aria-hidden className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />}
          </>
        )
        const row = 'flex items-start gap-2.5 rounded-lg px-2 py-1.5'
        return (
          <li key={item.id}>
            {item.href ? (
              // The application's link, held in context (LinkProvider): the same component at every render.
              // oxlint-disable-next-line react/static-components
              <Link
                href={item.href}
                className={cn(row, 'transition-colors hover:bg-surface-hover')}
                // Followed here, the panel goes with the page left; opened in another tab, it stays.
                onClick={(event: MouseEvent) => isPlainClick(event) && close()}
              >
                {body}
              </Link>
            ) : (
              <div className={row}>{body}</div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
