import { useSyncExternalStore } from 'react'

import { useControllableState } from '../lib/controllable.js'
import { Kbd } from './Kbd.js'
import { useShortcut, useShortcutRegistry } from './shortcuts-context.js'
import { SettleModal } from './ui/settle-modal.js'

interface ShortcutsDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title?: string
  /** The key that opens it; `null` for none (a button of the application's opens it). */
  keys?: string | null
}

const GENERAL = 'General'

/**
 * The application's keyboard shortcuts, listed by group with their keys: those registered with a
 * description (`useShortcut`), while the parts that register them are on the page. `?` opens it, once
 * there is a shortcut to list; AppShell draws it.
 */
export function ShortcutsDialog({ open, onOpenChange, title = 'Keyboard shortcuts', keys = '?' }: ShortcutsDialogProps) {
  const [shown, setShown] = useControllableState(open, false, onOpenChange)
  const registry = useShortcutRegistry()
  const all = useSyncExternalStore(registry.subscribe, registry.list, registry.list)
  // What it lists: every shortcut described, but the one that opens it.
  const listed = all.filter((shortcut) => shortcut.description && shortcut.keys !== keys)

  useShortcut(keys ?? '', () => listed.length > 0 && setShown(!shown), {
    description: listed.length > 0 ? 'Show the keyboard shortcuts' : undefined,
    group: GENERAL,
    enabled: keys !== null,
  })

  const groups = new Map<string, typeof listed>()
  for (const shortcut of listed) {
    const group = shortcut.group ?? GENERAL
    groups.set(group, [...(groups.get(group) ?? []), shortcut])
  }

  return (
    <SettleModal open={shown} onClose={() => setShown(false)} title={title} size="md">
      <div className="flex flex-col gap-5">
        {Array.from(groups.entries()).map(([group, shortcuts]) => (
          <section key={group}>
            <h3 className="mb-2 text-xs font-medium text-text-secondary">{group}</h3>
            <dl className="flex flex-col divide-y divide-border text-sm">
              {shortcuts.map((shortcut) => (
                <div key={shortcut.keys} className="flex items-center justify-between gap-4 py-2">
                  <dt className="text-text-primary">{shortcut.description}</dt>
                  <dd>
                    <Kbd keys={shortcut.keys} />
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
        {keys && (
          <p className="text-xs text-muted-foreground">
            <Kbd keys={keys} /> shows this list again.
          </p>
        )}
      </div>
    </SettleModal>
  )
}
