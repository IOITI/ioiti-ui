import { AnimatePresence, motion } from 'framer-motion'
import { Palette } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import type { ReactNode } from 'react'

import { ACCENT_LABEL, ACCENTS, lookLabel, MATERIAL_LABEL, MATERIALS } from '../lib/theme.js'
import type { Accent, Material } from '../lib/theme.js'
import { cn } from '../lib/utils.js'

import { Hint } from './Hint.js'
import { useTheme } from './theme-context.js'

// Each accent's fill in both themes, as src/styles/accents.css gives it (a test holds them to it).
// Neutral's is ink, the primary colour of the design as it was.
const ACCENT_SWATCH: Record<Accent, string> = {
  neutral: 'bg-[var(--text-primary)]',
  violet: 'bg-[#7c3aed] dark:bg-[#a78bfa]',
  indigo: 'bg-[#4f46e5] dark:bg-[#818cf8]',
  blue: 'bg-[#2563eb] dark:bg-[#60a5fa]',
}

const MATERIAL_SWATCH: Record<Material, string> = {
  flat: 'border border-border-hover bg-surface-raised',
  glass:
    'border border-white/70 bg-linear-to-br from-indigo-300/80 via-sky-300/80 to-pink-300/80 dark:border-white/20 dark:from-indigo-600/80 dark:via-cyan-700/80 dark:to-pink-800/80',
}

/**
 * The accent and the material, each person's own (kept in this browser, as the theme is): a button
 * for beside the theme's, `topBarEnd={<><LookPicker /><ThemeToggle /></>}`. Until one is picked, the
 * page shows the application's (`ioiti({ accent, material })`). A choice shows at once; Escape, a
 * click elsewhere or the focus leaving close it.
 */
export function LookPicker({ className }: { className?: string }) {
  const { accent, material, setAccent, setMaterial } = useTheme()
  const [open, setOpen] = useState(false)
  const id = useId()
  const root = useRef<HTMLDivElement>(null)
  const button = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  return (
    <div
      ref={root}
      className={cn('relative inline-flex shrink-0', className)}
      onKeyDown={(event) => {
        if (event.key !== 'Escape' || !open) return
        event.stopPropagation()
        setOpen(false)
        button.current?.focus()
      }}
      onBlur={(event) => {
        if (open && !root.current?.contains(event.relatedTarget as Node | null)) setOpen(false)
      }}
    >
      {/* Silent while open: its hint would cover the choices. Kept wrapped, so the button keeps the focus. */}
      <Hint content={open ? '' : 'Accent and material'} side="bottom">
        <button
          ref={button}
          type="button"
          aria-label={lookLabel(accent, material)}
          aria-expanded={open}
          aria-controls={open ? `${id}-choices` : undefined}
          onClick={() => setOpen(!open)}
          className="grid size-9 shrink-0 place-items-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-200/70 hover:text-neutral-900 focus-ring aria-expanded:bg-neutral-200/70 aria-expanded:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white dark:aria-expanded:bg-neutral-800 dark:aria-expanded:text-white"
        >
          <Palette className="size-[18px]" aria-hidden />
        </button>
      </Hint>

      <AnimatePresence>
        {open && (
          <motion.div
            id={`${id}-choices`}
            role="group"
            aria-label="Accent and material"
            // Taken by a click on the panel itself, so that it does not count as the focus leaving.
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.1 } }}
            transition={{ type: 'spring', stiffness: 520, damping: 38, mass: 0.7 }}
            style={{ transformOrigin: 'top right' }}
            className="absolute right-0 top-full z-50 mt-2 w-64 space-y-3 rounded-xl border border-border bg-surface p-3 text-foreground shadow-elevated glass-float"
          >
            <Choices legend="Accent">
              {ACCENTS.map((value) => (
                <Choice key={value} name={`${id}-accent`} checked={accent === value} onSelect={() => setAccent(value)}>
                  <span data-swatch={value} aria-hidden className={cn('size-3 shrink-0 rounded-full', ACCENT_SWATCH[value])} />
                  {ACCENT_LABEL[value]}
                </Choice>
              ))}
            </Choices>
            <Choices legend="Material">
              {MATERIALS.map((value) => (
                <Choice key={value} name={`${id}-material`} checked={material === value} onSelect={() => setMaterial(value)}>
                  <span aria-hidden className={cn('size-3 shrink-0 rounded-[4px]', MATERIAL_SWATCH[value])} />
                  {MATERIAL_LABEL[value]}
                </Choice>
              ))}
            </Choices>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Choices({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-2 text-xs font-medium text-muted-foreground">{legend}</legend>
      <div className="grid grid-cols-2 gap-1.5">{children}</div>
    </fieldset>
  )
}

/** A radio button the size of its label: the global focus ring goes round the whole choice. */
function Choice({ name, checked, onSelect, children }: { name: string; checked: boolean; onSelect: () => void; children: ReactNode }) {
  return (
    <label className="relative flex h-8 cursor-pointer items-center gap-2 rounded-lg border border-border px-2.5 text-[13px] text-text-secondary transition-colors hover:bg-surface-hover hover:text-foreground has-checked:border-border-hover has-checked:bg-surface-raised has-checked:font-medium has-checked:text-foreground accent:has-checked:border-brand">
      <input type="radio" name={name} checked={checked} onChange={onSelect} className="absolute inset-0 size-full cursor-pointer appearance-none rounded-lg" />
      {children}
    </label>
  )
}
