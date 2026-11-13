import { Button, SettleModal } from 'ioiti-ui'
import { useState } from 'react'
import { createRoot } from 'react-dom/client'

function Preview() {
  const [size, setSize] = useState<'sm' | 'md' | 'lg' | 'xl' | null>(null)
  return (
    <div className="flex min-h-[21rem] flex-col items-start gap-2 p-5">
      <div className="flex flex-wrap items-center gap-3">
        {(['sm', 'md', 'lg', 'xl'] as const).map((each) => (
          <Button key={each} size="sm" variant="outline" onClick={() => setSize(each)}>
            {each}
          </Button>
        ))}
      </div>
      <span className="text-xs text-muted-foreground">Press a width: the dialog opens over the page, the focus in it. Escape or a click outside closes it.</span>
      <SettleModal
        open={size !== null}
        onClose={() => setSize(null)}
        size={size ?? 'md'}
        title="Rename the project"
        description="Its address stays the same: links to it keep working."
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setSize(null)}>
              Cancel
            </Button>
            <Button size="sm" onClick={() => setSize(null)}>
              Rename
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">
          Drawn in the document's body, whatever opened it; the focus moves in, stays in, and goes back to what opened it.
          Escape or a click outside closes it.
        </p>
      </SettleModal>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<Preview />)
