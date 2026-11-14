import { Kbd } from 'ioiti-ui'

// Written with mod: ⌘ on an Apple computer, Ctrl elsewhere, chosen for the reader's.
const SHORTCUTS = [
  { keys: 'mod+k', does: 'Search' },
  { keys: 'mod+shift+p', does: 'Command palette' },
  { keys: 'mod+s', does: 'Save' },
  { keys: 'mod+b', does: 'Fold the sidebar' },
  { keys: 'alt+shift+n', does: 'New order' },
]

export default function KbdCombinations() {
  return (
    <dl className="grid max-w-sm grid-cols-[1fr_auto] gap-x-6 gap-y-2.5 text-sm">
      {SHORTCUTS.map((shortcut) => (
        <div key={shortcut.keys} className="contents">
          <dt className="text-muted-foreground">{shortcut.does}</dt>
          <dd className="text-right">
            <Kbd keys={shortcut.keys} />
          </dd>
        </div>
      ))}
    </dl>
  )
}
