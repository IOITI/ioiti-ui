import { Button } from 'ioiti-ui'
import { Pencil } from 'lucide-react'

export default function ButtonSizes() {
  return (
    <div className="flex flex-col items-start gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button size="xs">Extra small</Button>
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
        <Button size="icon" variant="outline" aria-label="Edit">
          <Pencil />
        </Button>
      </div>
      {/* An "Edit" where each size belongs: on a line of text (xs), beside a heading (sm), on its own (md). */}
      <div className="flex flex-wrap items-center gap-6">
        <span className="inline-flex items-center gap-2 text-sm">
          Maturity: production
          <Button size="xs" variant="ghost" leftIcon={<Pencil />}>
            Change
          </Button>
        </span>
        <span className="inline-flex items-center gap-3">
          <span className="text-sm font-semibold">Delivery</span>
          <Button size="sm" variant="ghost" leftIcon={<Pencil />}>
            Edit
          </Button>
        </span>
        <Button size="md" variant="outline" leftIcon={<Pencil />}>
          Edit
        </Button>
      </div>
    </div>
  )
}
