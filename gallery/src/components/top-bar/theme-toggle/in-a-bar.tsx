import { IconButton, LookPicker, ThemeToggle } from 'ioiti-ui'
import { Search } from 'lucide-react'

export default function ThemeToggleInABar() {
  return (
    <div className="flex h-14 w-full items-center gap-2 rounded-xl border border-border px-4 glass-bar">
      <span className="min-w-0 flex-1 truncate text-sm font-medium">Orders</span>
      <IconButton label="Search" icon={<Search />} />
      <LookPicker />
      {/* Last: AppShell draws it there when given no topBarEnd. */}
      <ThemeToggle />
    </div>
  )
}
