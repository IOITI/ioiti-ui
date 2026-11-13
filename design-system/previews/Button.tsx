import { Button } from 'ioiti-ui'
import { Pencil, Plus, RefreshCw } from 'lucide-react'
import { createRoot } from 'react-dom/client'

function Preview() {
  return (
    <div className="flex flex-col items-start gap-4 p-5">
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
        <Button size="sm" leftIcon={<Plus />}>New order</Button>
        <Button variant="outline" rightIcon={<RefreshCw />}>Refresh</Button>
        <Button size="lg">Large</Button>
        <Button size="icon" variant="outline" aria-label="Edit"><Pencil /></Button>
        <Button isLoading loadingText="Saving">Save</Button>
        <Button disabled>Disabled</Button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-2 text-sm">
          Maturity: production
          <Button size="xs" variant="ghost" leftIcon={<Pencil />}>Change</Button>
        </span>
        <Button size="sm" variant="ghost" leftIcon={<Pencil />}>Edit</Button>
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<Preview />)
