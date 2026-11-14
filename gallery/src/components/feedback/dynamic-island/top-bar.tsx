import { DynamicIsland, IconButton, SignedValue } from 'ioiti-ui'
import { Bell } from 'lucide-react'

export default function DynamicIslandTopBar() {
  return (
    // A top bar as an application's: the pill keeps its place in it, the island opens over what is under it.
    <div className="min-h-32">
      <div className="flex h-14 items-center gap-3 rounded-xl border border-border px-4 glass-bar">
        <span className="w-24 truncate text-sm font-medium">Orders</span>
        <div className="flex flex-1 justify-center">
          <DynamicIsland
            label="Today"
            compact={
              <span className="flex items-center gap-2 text-xs">
                <span className="size-1.5 rounded-full bg-positive" aria-hidden />
                3 orders · <SignedValue value={12.4} kind="percent" />
              </span>
            }
          >
            <div className="space-y-2 pr-6 text-sm">
              <p className="font-medium">Today</p>
              <p className="text-muted-foreground">3 orders, 4,210.00 €: 12.4 % more than last Monday.</p>
            </div>
          </DynamicIsland>
        </div>
        <div className="flex w-24 justify-end">
          <IconButton label="Notifications" icon={<Bell />} />
        </div>
      </div>
    </div>
  )
}
