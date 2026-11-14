import { Button, Kbd, ShortcutsDialog, useNavigateTo, useShortcut } from 'ioiti-ui'
import { Keyboard } from 'lucide-react'
import { useState } from 'react'

export default function ShortcutsDialogFromAButton() {
  const navigate = useNavigateTo()
  const [open, setOpen] = useState(false)
  // Heard while this part is on the page, listed under their group.
  useShortcut('g f', () => navigate('/components/forms'), { description: 'Go to the forms', group: 'Navigation' })
  useShortcut('g c', () => navigate('/components/charts'), { description: 'Go to the charts', group: 'Navigation' })
  useShortcut('g d', () => navigate('/patterns/dashboard'), { description: 'Go to the dashboard', group: 'Navigation' })
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
      <Button variant="outline" size="sm" leftIcon={<Keyboard />} onClick={() => setOpen(true)}>
        Keyboard shortcuts
      </Button>
      <span className="inline-flex flex-wrap items-center gap-2">
        or press <Kbd keys="?" /> (the application’s list), then <Kbd keys="g f" /> for the forms
      </span>
      {/* No key of its own: AppShell's list opens on ?, this one from its button. */}
      <ShortcutsDialog open={open} onOpenChange={setOpen} keys={null} />
    </div>
  )
}
