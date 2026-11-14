import { Button, SelectionBasket } from 'ioiti-ui'
import { Archive, GitCompare, Send, Trash2 } from 'lucide-react'
import { useState } from 'react'

export default function SelectionBasketActions() {
  const [selected, setSelected] = useState(3)
  const [done, setDone] = useState<string | null>(null)
  const act = (what: string) => () => {
    setDone(`${what} ${selected} ${selected === 1 ? 'file' : 'files'}`)
    setSelected(0)
  }
  return (
    <div className="space-y-3">
      <SelectionBasket
        mode="inline"
        selectedCount={selected}
        totalCount={40}
        noun={['file', 'files']}
        onClearSelection={() => setSelected(0)}
        onSelectAll={() => setSelected(selected === 40 ? 0 : 40)}
        actions={[
          { id: 'send', label: 'Send for signature', icon: <Send className="size-3.5" />, variant: 'primary', onClick: act('Sent') },
          { id: 'compare', label: 'Compare', icon: <GitCompare className="size-3.5" />, href: '/components/tables/smart-comparison' },
          { id: 'archive', label: 'Archive', icon: <Archive className="size-3.5" />, onClick: act('Archived') },
          { id: 'delete', label: 'Delete', icon: <Trash2 className="size-3.5" />, variant: 'danger', onClick: act('Deleted') },
        ]}
      />
      <div className="flex flex-wrap items-center justify-center gap-3">
        <p className="text-sm text-muted-foreground" role="status">
          {done ?? 'Nothing done yet.'}
        </p>
        {selected === 0 && (
          <Button size="xs" variant="outline" onClick={() => setSelected(3)}>
            Select three again
          </Button>
        )}
      </div>
    </div>
  )
}
