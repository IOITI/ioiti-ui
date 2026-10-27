import { motion, useReducedMotionConfig } from 'framer-motion'
import { useState } from 'react'

import { motionTransitions } from '../lib/motion-tokens.js'
import { cn } from '../lib/utils.js'
import { Hint } from './Hint.js'

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg'

const SIZE: Record<AvatarSize, string> = {
  xs: 'size-5 text-[9px]',
  sm: 'size-6 text-[10px]',
  md: 'size-8 text-xs',
  lg: 'size-10 text-sm',
}

/** The initials of a name: the first letter of its first two words ("Ana María Ortiz": AM). */
function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)
  return words
    .slice(0, 2)
    .map((word) => Array.from(word)[0] ?? '')
    .join('')
    .toUpperCase()
}

interface AvatarProps {
  /** Whose it is: its initials are drawn from it, and a screen reader hears it. */
  name: string
  /** A picture, from the application's own origin; the initials where there is none, or it fails. */
  src?: string
  size?: AvatarSize
  /** The name in a hint, the avatar a stop of the keyboard to show it. */
  hint?: boolean
  className?: string
}

/** A person, as their picture or their initials. */
export function Avatar({ name, src, size = 'md', hint = false, className }: AvatarProps) {
  const [failed, setFailed] = useState(false)
  const picture = src && !failed
  const drawn = (
    <span
      role="img"
      aria-label={name}
      tabIndex={hint ? 0 : undefined}
      className={cn(
        'inline-grid shrink-0 select-none place-items-center overflow-hidden rounded-full bg-surface-raised font-medium text-text-secondary',
        SIZE[size],
        className,
      )}
    >
      {picture ? (
        <img src={src} alt="" className="size-full object-cover" onError={() => setFailed(true)} />
      ) : (
        <span aria-hidden>{initialsOf(name)}</span>
      )}
    </span>
  )
  return hint ? <Hint content={name}>{drawn}</Hint> : drawn
}

interface AvatarGroupProps {
  people: { name: string; src?: string }[]
  /** The avatars shown before "+N" says how many more. */
  max?: number
  size?: AvatarSize
  /** The group's name for a screen reader: "Who works on it". */
  label?: string
  className?: string
}

/**
 * People together, their avatars overlapping: each named in a hint, "+N" naming the rest. An avatar lifts
 * a little under the pointer; not where motion is reduced.
 */
export function AvatarGroup({ people, max = 4, size = 'md', label = 'People', className }: AvatarGroupProps) {
  const reduce = useReducedMotionConfig()
  const shown = people.slice(0, max)
  const rest = people.slice(shown.length)
  return (
    <div role="group" aria-label={label} className={cn('flex items-center -space-x-2', className)}>
      {shown.map((person, index) => (
        <motion.span
          key={`${person.name}-${index}`}
          className="relative inline-flex rounded-full ring-2 ring-background"
          whileHover={reduce ? undefined : { y: -2 }}
          transition={motionTransitions.springSnappy}
        >
          <Avatar name={person.name} src={person.src} size={size} hint />
        </motion.span>
      ))}
      {rest.length > 0 && (
        <span className="relative inline-flex rounded-full ring-2 ring-background">
          <Hint content={rest.map((person) => person.name).join(', ')}>
            <span
              role="img"
              tabIndex={0}
              aria-label={`${rest.length} more: ${rest.map((person) => person.name).join(', ')}`}
              className={cn('inline-grid place-items-center rounded-full bg-surface-raised font-medium text-text-secondary', SIZE[size])}
            >
              <span aria-hidden>+{rest.length}</span>
            </span>
          </Hint>
        </span>
      )}
    </div>
  )
}
