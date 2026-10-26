import type { ComponentProps, ReactNode } from 'react'

import { cn } from '../lib/utils.js'
import { Hint } from './Hint.js'

interface IconButtonProps extends Omit<ComponentProps<'button'>, 'children' | 'aria-label'> {
  /** What it does, in words: an icon alone says nothing to a screen reader. */
  label: string
  /** An icon of lucide-react, as an element: `<Search />`. */
  icon: ReactNode
  /** Shown on hover, keyboard focus and a tap (a Hint, under it). */
  hint?: ReactNode
}

/** A button that is an icon alone, as the top bar's: square, quiet until hovered. */
export function IconButton({ label, icon, hint, className, type = 'button', ...props }: IconButtonProps) {
  const button = (
    <button
      type={type}
      aria-label={label}
      className={cn(
        'grid size-9 shrink-0 place-items-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-200/70 hover:text-neutral-900 focus-ring dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white [&>svg]:size-[18px]',
        className,
      )}
      {...props}
    >
      {icon}
    </button>
  )
  return hint ? (
    <Hint content={hint} side="bottom">
      {button}
    </Hint>
  ) : (
    button
  )
}
