import { DynamicIsland, SignedValue } from 'ioiti-ui'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <div className="flex min-h-[10.5rem] flex-col items-start gap-3 p-5">
    <DynamicIsland
      label="Today"
      compact={
        <span className="flex items-center gap-2 text-xs">
          <span className="size-1.5 rounded-full bg-positive" aria-hidden />
          3 orders · <SignedValue value={12.4} kind="percent" />
        </span>
      }
    >
      <div className="space-y-2 p-4 text-sm">
        <p className="font-medium">Today</p>
        <p className="text-muted-foreground">3 orders, 4,210.00 €: 12.4 % more than last Monday.</p>
      </div>
    </DynamicIsland>
    <span className="text-xs text-muted-foreground">Press the pill: it grows into an island over the page, the focus in it. Escape or a press outside closes it.</span>
  </div>,
)
