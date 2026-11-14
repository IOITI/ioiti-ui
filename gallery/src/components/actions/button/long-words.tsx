import { Button } from 'ioiti-ui'
import { ChevronsUpDown, Plus } from 'lucide-react'

export default function ButtonLongWords() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button size="sm" variant="outline" className="max-w-40" rightIcon={<ChevronsUpDown />}>
          A workspace with a very long name
        </Button>
        <Button size="sm" className="max-w-36" leftIcon={<Plus />}>
          Add another delivery address
        </Button>
      </div>
      <div className="max-w-xs rounded-xl border border-dashed border-border p-3">
        <Button fullWidth>Place the order</Button>
      </div>
    </div>
  )
}
