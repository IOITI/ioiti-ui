import { SplitButton } from 'ioiti-ui'

const EXPORTS = [
  { value: 'csv', label: 'As CSV' },
  { value: 'json', label: 'As JSON' },
  { value: 'pdf', label: 'As PDF', disabled: true },
]

export default function SplitButtonVariants() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <SplitButton label="Export" size="sm" options={EXPORTS} />
      <SplitButton label="Export" variant="secondary" size="sm" options={EXPORTS} />
      <SplitButton label="Publish" variant="info" options={[{ value: 'later', label: 'Publish later' }]} />
      <SplitButton label="Remove" variant="danger" size="lg" options={[{ value: 'all', label: 'Remove all versions' }]} />
      <SplitButton label="Export" variant="secondary" size="sm" disabled options={EXPORTS} />
    </div>
  )
}
