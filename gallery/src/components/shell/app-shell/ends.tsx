import { AppBrand, SidebarFooterButton, useToast } from 'ioiti-ui'
import { LifeBuoy, LogOut, Warehouse } from 'lucide-react'

// The sidebar's surface, as AppShell draws it: white, ink on dark, glass under the glass material.
const SIDEBAR = 'w-62 space-y-3 rounded-xl border border-border bg-white p-3 dark:bg-neutral-950 glass-bar'
const FOOT = 'space-y-0.5 border-t border-neutral-200 pt-2 dark:border-neutral-800'

export default function AppShellEnds() {
  const toast = useToast()
  return (
    <div className="flex flex-wrap items-start gap-4">
      <div className={SIDEBAR}>
        {/* The mark is the name's first letter by default. */}
        <AppBrand name="My App" detail="v1.2.0" />
        <div className={FOOT}>
          <SidebarFooterButton icon={<LogOut />} label="Sign out" onClick={() => toast({ title: 'Signed out' })} />
        </div>
      </div>
      <div className={SIDEBAR}>
        <AppBrand name="Depot" detail="Warehouse 3" mark={<Warehouse className="size-4" />} />
        <div className={FOOT}>
          <SidebarFooterButton icon={<LifeBuoy />} label="Help" />
          <SidebarFooterButton icon={<LogOut />} label="Sign out" />
        </div>
      </div>
      <div className={SIDEBAR}>
        <AppBrand name="Riverside Freight Operations" detail="Production · eu-west, read only" />
      </div>
    </div>
  )
}
