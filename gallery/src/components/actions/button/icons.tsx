import { Button } from 'ioiti-ui'
import { ArrowRight, Download, Plus, RefreshCw, Trash2 } from 'lucide-react'

export default function ButtonIcons() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button leftIcon={<Plus />}>New order</Button>
      <Button variant="outline" rightIcon={<RefreshCw />}>
        Refresh
      </Button>
      <Button variant="secondary" leftIcon={<Download />}>
        Download
      </Button>
      <Button variant="ghost" rightIcon={<ArrowRight />}>
        Continue
      </Button>
      <Button variant="destructive" leftIcon={<Trash2 />}>
        Delete
      </Button>
    </div>
  )
}
