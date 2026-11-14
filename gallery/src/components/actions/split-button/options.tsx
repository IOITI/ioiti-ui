import { SplitButton, useToast } from 'ioiti-ui'
import { Play } from 'lucide-react'

export default function SplitButtonOptions() {
  const toast = useToast()
  return (
    <SplitButton
      label="Run again"
      icon={<Play className="size-3.5" />}
      size="sm"
      onClick={() => toast({ title: 'Run started', variant: 'success' })}
      options={[
        { value: 'edit', label: 'Edit and run', description: 'Opens the form with these settings', href: '/components/forms' },
        { value: 'copy', label: 'Duplicate', description: 'Same settings, a new run', onSelect: () => toast({ title: 'Run duplicated' }) },
        { value: 'delete', label: 'Delete', tone: 'danger', onSelect: () => toast({ title: 'Run deleted', variant: 'error' }) },
      ]}
    />
  )
}
