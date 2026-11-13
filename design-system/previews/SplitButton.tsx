import { SplitButton } from 'ioiti-ui'
import { Play } from 'lucide-react'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <div className="flex flex-wrap items-center gap-3 p-5">
    <SplitButton
      label="Run again"
      icon={<Play className="size-3.5" />}
      size="sm"
      onClick={() => {}}
      options={[
        { value: 'edit', label: 'Edit and run', description: 'Opens the form with these settings', onSelect: () => {} },
        { value: 'copy', label: 'Duplicate', description: 'Same settings, a new run', onSelect: () => {} },
        { value: 'delete', label: 'Delete', tone: 'danger', onSelect: () => {} },
      ]}
    />
    <SplitButton label="Export" variant="secondary" size="sm" options={[{ value: 'csv', label: 'As CSV' }, { value: 'pdf', label: 'As PDF', disabled: true }]} />
  </div>,
)
