import { useSyncExternalStore } from 'react'

import { useControllableState } from '../lib/controllable.js'
import { Kbd } from './Kbd.js'
import { useMessages } from './locale-context.js'
import { useShortcut, useShortcutRegistry } from './shortcuts-context.js'
import { SettleModal } from './ui/settle-modal.js'

interface ShortcutsDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** Its title; the provider's language's by default ("Keyboard shortcuts"). */
  title?: string
  /** The key that opens it; `null` for none (a button of the application's opens it). */
  keys?: string | null
}

// Where the words of its last line put the keys that open it, drawn as key caps: the sentence is written around this
// mark, and split at it.
const KEYS_MARK = '\u0000'

/**
 * The application's keyboard shortcuts, listed by group with their keys: those registered with a
 * description (`useShortcut`), while the parts that register them are on the page. `?` opens it, once
 * there is a shortcut to list; AppShell draws it.
 */
export function ShortcutsDialog({ open, onOpenChange, title: givenTitle, keys = '?' }: ShortcutsDialogProps) {
  // Its words in the provider's language, the title given over its own.
  const words = useMessages().shortcuts
  const title = givenTitle ?? words.title
  const [shown, setShown] = useControllableState(open, false, onOpenChange)
  const registry = useShortcutRegistry()
  const all = useSyncExternalStore(registry.subscribe, registry.list, registry.list)
  // What it lists: every shortcut described, but the one that opens it; once, when two parts register the same
  // keys for the same thing (a second sidebar's ⌘B).
  const seen = new Set<string>()
  const listed = all.filter((shortcut) => {
    const id = `${shortcut.keys}\n${shortcut.description}`
    if (!shortcut.description || shortcut.keys === keys || seen.has(id)) return false
    seen.add(id)
    return true
  })

  useShortcut(keys ?? '', () => listed.length > 0 && setShown(!shown), {
    description: listed.length > 0 ? words.showShortcuts : undefined,
    group: words.general,
    enabled: keys !== null,
  })

  const groups = new Map<string, typeof listed>()
  for (const shortcut of listed) {
    const group = shortcut.group ?? words.general
    groups.set(group, [...(groups.get(group) ?? []), shortcut])
  }
  // The last line, its keys where its words put them (none drawn where an application's words name none).
  const again = words.showAgain(KEYS_MARK).split(KEYS_MARK)

  return (
    <SettleModal open={shown} onClose={() => setShown(false)} title={title} size="md">
      <div className="flex flex-col gap-5">
        {Array.from(groups.entries()).map(([group, shortcuts]) => (
          <section key={group}>
            <h3 className="mb-2 text-xs font-medium text-text-secondary">{group}</h3>
            <dl className="flex flex-col divide-y divide-border/40 text-sm">
              {shortcuts.map((shortcut) => (
                <div key={`${shortcut.keys}\n${shortcut.description}`} className="flex items-center justify-between gap-4 py-2">
                  <dt className="text-foreground">{shortcut.description}</dt>
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
            {again[0]}
            {again.length > 1 && (
              <>
                <Kbd keys={keys} />
                {again.slice(1).join('')}
              </>
            )}
          </p>
        )}
      </div>
    </SettleModal>
  )
}
