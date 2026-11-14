import { Button, Field, Input, Kbd, ShortcutsDialog, Switch, useShortcut, useToast } from 'ioiti-ui'
import { useState } from 'react'

export default function ShortcutsDialogWhileThere() {
  const toast = useToast()
  const [on, setOn] = useState(true)
  const [open, setOpen] = useState(false)
  const [heard, setHeard] = useState<string | null>(null)
  // With ⌘ or Ctrl: heard in a field too.
  useShortcut(
    'mod+shift+e',
    () => {
      setHeard('Export the orders')
      toast({ title: 'Orders exported', variant: 'success' })
    },
    { description: 'Export the orders', group: 'Orders', enabled: on },
  )
  // Keys alone: they wait while text is typed.
  useShortcut('g o', () => setHeard('Show the open orders'), { description: 'Show the open orders', group: 'Orders', enabled: on })
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-4">
        <Field label="Find an order" htmlFor="shortcut-search" className="w-64">
          <Input id="shortcut-search" placeholder="Try the keys here too" />
        </Field>
        <Switch label="Shortcuts of the orders" checked={on} onChange={setOn} />
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          List them
        </Button>
      </div>
      <p className="inline-flex flex-wrap items-center gap-2 text-sm text-muted-foreground" aria-live="polite">
        <Kbd keys="mod+shift+e" /> or <Kbd keys="g o" />: <span className="font-medium text-foreground">{heard ?? 'nothing heard yet'}</span>
      </p>
      <ShortcutsDialog open={open} onOpenChange={setOpen} keys={null} title="Shortcuts of this page" />
    </div>
  )
}
