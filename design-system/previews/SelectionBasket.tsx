import { Button, SelectionBasket } from 'ioiti-ui'
import { GitCompare, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { createRoot } from 'react-dom/client'

function Preview() {
  const [selected, setSelected] = useState(2)
  return (
    <div className="w-full space-y-3 p-5">
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => setSelected((count) => Math.min(count + 1, 12))}>
          Select one more
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setSelected(0)}>
          Clear
        </Button>
      </div>
      <SelectionBasket
        mode="inline"
        selectedCount={selected}
        totalCount={12}
        noun={['run', 'runs']}
        onClearSelection={() => setSelected(0)}
        onSelectAll={() => setSelected(12)}
        actions={[
          { id: 'compare', label: 'Compare', icon: <GitCompare className="size-3.5" />, href: '#compare', disabled: selected < 2 || selected > 4, title: 'Two to four runs can be compared' },
          { id: 'remove', label: 'Remove', icon: <Trash2 className="size-3.5" />, variant: 'danger', onClick: () => setSelected(0) },
        ]}
      />
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<Preview />)
