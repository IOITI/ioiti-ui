import { AnimatePresence, motion } from 'framer-motion'
import { Monitor, Moon, Sun } from 'lucide-react'

import { motionTransitions } from '../lib/motion-tokens.js'
import { PRESSABLE } from '../lib/recipes.js'
import { nextPreference, themeButtonLabel } from '../lib/theme.js'
import { cn } from '../lib/utils.js'

import { useMessages } from './locale-context.js'
import { useTheme } from './theme-context.js'

const ICONS = { system: Monitor, light: Sun, dark: Moon }

/** The props of `ThemeToggle`. */
export interface ThemeToggleProps {
  className?: string
}

/**
 * One button for three states: follow the system, light, dark. Its icon is the
 * state it is in, and its label says both that and what a press does, since an
 * icon alone cannot ("Theme: follows the system (dark now). Press for always light."), in the provider's language.
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { preference, theme, setPreference } = useTheme()
  const words = useMessages().look
  const Icon = ICONS[preference]
  const label = themeButtonLabel(preference, theme, words)
  return (
    <button
      type="button"
      onClick={() => setPreference(nextPreference(preference))}
      aria-label={label}
      // The original design's title, kept: its words the catalogue's, as its name.
      title={label}
      className={cn(
        // The top bar's icon buttons' look (IconButton's).
        `${PRESSABLE} relative grid size-9 shrink-0 place-items-center rounded-lg text-muted-foreground transition-[color,background-color,scale] hover:bg-surface-hover hover:text-foreground focus-ring`,
        className,
      )}
    >
      {/* The icon turns to the state chosen, the one left turning on out of the way. */}
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={preference}
          className="grid place-items-center"
          initial={{ opacity: 0, rotate: -45, scale: 0.8 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 45, scale: 0.8, transition: motionTransitions.easeExit }}
          transition={motionTransitions.springSnappy}
        >
          <Icon className="size-[18px]" aria-hidden />
        </motion.span>
      </AnimatePresence>
    </button>
  )
}
