import type { ReactElement, ReactNode } from 'react'

import { DirectionalTooltip } from './ui/directional-tooltip.js'
import type { TooltipSide } from './ui/directional-tooltip.js'

interface HintProps {
  content: ReactNode
  children: ReactElement
  side?: TooltipSide
  /**
   * For what takes no focus of its own: a disabled control (which takes no pointer either: the
   * wrapper gets its hover and its tap) or a plain text. The wrapper then takes the focus, so that a
   * keyboard reaches the hint too.
   */
  wrap?: boolean
  /** The classes of the span around it: a full-width field keeps its width (`flex w-full`). */
  className?: string
}

/**
 * What a `title` said, shown on hover, on keyboard focus and on a tap, and read by screen readers:
 * a title shows on none of a phone, a keyboard or a disabled control. EasyUI's tooltip.
 */
export function Hint({ content, children, side = 'top', wrap = false, className }: HintProps) {
  // A wrapper with nothing to say would be a stop of the keyboard for nothing. It gives way where the hint is
  // let to (`className="min-w-0"`): a text cut short in it (CopyChip's `truncate="end"`) was never cut, its
  // chip as wide as the whole value, past a phone's screen.
  const said = content !== null && content !== undefined && content !== false && content !== ''
  return (
    <DirectionalTooltip content={content} side={side} wrapperClassName={className}>
      {wrap && said ? (
        <span tabIndex={0} className="inline-flex min-w-0 rounded-md [&>:disabled]:pointer-events-none">
          {children}
        </span>
      ) : (
        children
      )}
    </DirectionalTooltip>
  )
}
