import { Button, ButtonLink, ConfirmAction, CopyButton, DragToConfirm, ExportButton, IconButton, Kbd, PageHeader, SplitButton, useToast } from 'ioiti-ui'
import { Archive, Copy, Download, Pencil, Play, Plus, RefreshCw, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { Demo } from '../parts'

const ROWS = [
  { id: 'IT-1042', name: 'Spring catalogue print run', amount: 1840 },
  { id: 'IT-1041', name: 'Warehouse shelving', amount: 960.5 },
]

function Confirmations() {
  const toast = useToast()
  const [open, setOpen] = useState<'slide' | 'button' | null>(null)
  const [pending, setPending] = useState(false)
  const close = () => setOpen(null)
  const confirm = () => {
    setPending(true)
    window.setTimeout(() => {
      setPending(false)
      close()
      toast({ title: open === 'slide' ? 'Project deleted' : 'Imports paused', variant: 'success' })
    }, 900)
  }
  return (
    <>
      <Button variant="destructive" size="sm" leftIcon={<Trash2 className="size-3.5" />} onClick={() => setOpen('slide')}>
        Delete the project
      </Button>
      <Button variant="outline" size="sm" onClick={() => setOpen('button')}>
        Pause the imports
      </Button>
      <ConfirmAction
        open={open === 'slide'}
        title="Delete this project"
        description="The project, its 42 files and their history are removed for everyone."
        warning="This cannot be undone."
        confirmLabel="Slide to delete"
        doneLabel="Deleted"
        pending={pending}
        onConfirm={confirm}
        onClose={close}
      />
      <ConfirmAction
        open={open === 'button'}
        gesture="button"
        title="Pause the imports"
        description="No new file is imported until they are resumed; what is under way finishes."
        confirmLabel="Pause the imports"
        pending={pending}
        onConfirm={confirm}
        onClose={close}
      />
    </>
  )
}

export function Actions() {
  return (
    <>
      <PageHeader title="Actions" description="What does something is a button; what leads somewhere is a link, even when it looks like a button." />

      <Demo
        id="button"
        title="Button"
        description="Primary for the one action a page or a dialog is for; outline and ghost for the others; destructive for what removes. Pressed, it gives a little; busy, it says what it does."
        names={['Button']}
        className="flex flex-col items-start gap-4"
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="success">Success</Button>
          <Button variant="link">Link style</Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm" leftIcon={<Plus className="size-3.5" />}>
            New order
          </Button>
          <Button size="md" variant="outline" rightIcon={<RefreshCw className="size-4" />}>
            Refresh
          </Button>
          <Button size="lg">Large</Button>
          <Button size="icon" variant="outline" aria-label="Edit">
            <Pencil className="size-4" />
          </Button>
          <Button isLoading loadingText="Saving">
            Save
          </Button>
          <Button disabled>Disabled</Button>
        </div>
      </Demo>

      <Demo
        id="button-link"
        title="ButtonLink"
        description="A link drawn as a button: it opens in another tab with ⌘ or Ctrl, and goes through the router. Given nowhere to go, it is a button that cannot be pressed."
        names={['ButtonLink']}
      >
        <ButtonLink to="/components/forms">Go to the forms</ButtonLink>
        <ButtonLink to="/components/data" variant="outline" size="sm">
          Data display
        </ButtonLink>
        <ButtonLink to={null} variant="outline" size="sm">
          No day before the first
        </ButtonLink>
      </Demo>

      <Demo id="icon-button" title="IconButton" description="An icon alone, named in words for screen readers, quiet until hovered: the top bar's." names={['IconButton']}>
        <IconButton label="Copy the link" icon={<Copy />} />
        <IconButton label="Archive" icon={<Archive />} hint="Archive the project (it stays readable)" />
        <IconButton label="Download" icon={<Download />} disabled />
      </Demo>

      <Demo
        id="split-button"
        title="SplitButton"
        description="One action, and its variants behind the chevron: each option can lead somewhere (a link) or act, say what it does, and be marked as removing."
        names={['SplitButton']}
      >
        <SplitButton
          label="Run again"
          icon={<Play className="size-3.5" />}
          size="sm"
          onClick={() => {}}
          options={[
            { value: 'edit', label: 'Edit and run', description: 'Opens the form with these settings', href: '/components/forms' },
            { value: 'copy', label: 'Duplicate', description: 'Same settings, a new run', onSelect: () => {} },
            { value: 'delete', label: 'Delete', tone: 'danger', onSelect: () => {} },
          ]}
        />
        <SplitButton label="Export" variant="secondary" size="sm" options={[{ value: 'csv', label: 'As CSV' }, { value: 'pdf', label: 'As PDF', disabled: true }]} />
      </Demo>

      <Demo
        id="confirm"
        title="ConfirmAction"
        description="The last step before an action that matters: what will happen, in the user's words, then a gesture. The slide is for what cannot be taken back; a plain button for the protective direction, which must be quick."
        names={['ConfirmAction']}
      >
        <Confirmations />
      </Demo>

      <Demo id="drag" title="DragToConfirm" description="The slide on its own: dragged to the end, or Enter once it has the focus. Arrow keys do not confirm." names={['DragToConfirm']} className="max-w-md">
        <DragToConfirm label="Slide to send" confirmedLabel="Sent" variant="info" autoResetDelay={2500} />
      </Demo>

      <Demo
        id="copy"
        title="CopyButton"
        description="Copies a value and says it did: a check for two seconds, its hint saying what came of it, and the words for a screen reader. The focus stays on it."
        names={['CopyButton']}
      >
        <CopyButton value="sk_test_4f9a2c7e1b" label="Copy the key" />
        <CopyButton value="https://example.com/orders/IT-1042" label="Copy the link" size="sm" />
        <CopyButton value="IT-1042" label="Copy the reference" showLabel size="sm" />
      </Demo>

      <Demo
        id="kbd"
        title="Kbd"
        description="The keys of a shortcut, as this computer writes them: ⌘ on an Apple computer, Ctrl elsewhere. A sequence is one key, then the next."
        names={['Kbd']}
        className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground"
      >
        <span className="inline-flex items-center gap-2">
          Search <Kbd keys="mod+k" />
        </span>
        <span className="inline-flex items-center gap-2">
          Command palette <Kbd keys="mod+shift+p" />
        </span>
        <span className="inline-flex items-center gap-2">
          Go to the orders <Kbd keys="g o" />
        </span>
        <span className="inline-flex items-center gap-2">
          Close <Kbd>Esc</Kbd>
        </span>
      </Demo>

      <Demo id="export" title="ExportButton" description="The rows a page shows, saved as a CSV file named with the day (spreadsheet formulas neutralised)." names={['ExportButton']}>
        <ExportButton
          name="items"
          rows={ROWS}
          columns={[
            { header: 'Id', value: (row) => row.id },
            { header: 'Item', value: (row) => row.name },
            { header: 'Amount', value: (row) => row.amount },
          ]}
        />
      </Demo>
    </>
  )
}
