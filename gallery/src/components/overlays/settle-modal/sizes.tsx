import { Button, SettleModal } from 'ioiti-ui'
import { useState } from 'react'

type Size = 'sm' | 'md' | 'lg' | 'xl' | 'full'

const VERSIONS = [
  { name: 'Before', lines: ['Standing desk × 2 — 1,240.00 €', 'Desk lamp × 4 — 360.00 €', 'Delivery — 240.00 €'] },
  { name: 'After', lines: ['Standing desk × 2 — 1,240.00 €', 'Desk lamp × 6 — 540.00 €', 'Delivery — free'] },
]

export default function SettleModalSizes() {
  const [size, setSize] = useState<Size | null>(null)
  // The last one opened: its width stays while it leaves.
  const [last, setLast] = useState<Size>('md')
  const close = () => setSize(null)
  return (
    <div className="flex flex-wrap items-center gap-2">
      {(['sm', 'md', 'lg', 'xl', 'full'] as const).map((each) => (
        <Button
          key={each}
          size="sm"
          variant="outline"
          onClick={() => {
            setLast(each)
            setSize(each)
          }}
        >
          {each}
        </Button>
      ))}
      <SettleModal
        open={size !== null}
        onClose={close}
        size={last}
        title={last === 'full' ? 'Compare the two versions' : 'Rename the project'}
        description={last === 'full' ? 'Two things side by side: the full width.' : 'Its address stays the same: links to it keep working.'}
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={close}>
              Cancel
            </Button>
            <Button size="sm" onClick={close}>
              {last === 'full' ? 'Keep the new one' : 'Rename'}
            </Button>
          </>
        }
      >
        {last === 'full' ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {VERSIONS.map((version) => (
              <div key={version.name} className="rounded-xl border border-border p-4">
                <p className="text-sm font-medium">{version.name}</p>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {version.lines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            The {last} width. Drawn in the document’s body, whatever opened it; the focus moves in, stays in, and goes back to what
            opened it. Escape or a click outside closes it.
          </p>
        )}
      </SettleModal>
    </div>
  )
}
