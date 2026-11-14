import { UserMenu, useNavigateTo } from 'ioiti-ui'
import { Palette, Settings, UserRound } from 'lucide-react'

export default function UserMenuInTheTopBar() {
  const navigate = useNavigateTo()
  return (
    // The end of a top bar (AppShell's topBarEnd).
    <div className="flex h-14 w-full items-center justify-end gap-2 rounded-xl border border-border px-4 glass-bar">
      <UserMenu
        name="Ana María Ortiz"
        detail="Analyst"
        items={[
          { type: 'link', label: 'Profile', href: '/patterns/settings', icon: <UserRound /> },
          { type: 'link', label: 'Settings', href: '/patterns/settings', icon: <Settings /> },
          { type: 'link', label: 'Themes', description: 'The looks, side by side', href: '/foundations/themes', icon: <Palette /> },
        ]}
        // The theme, then the accent and the material: this gallery's own, changed at once.
        appearance
        // A request in an application, then the sign-in page.
        onSignOut={() => navigate('/patterns/sign-in')}
      />
    </div>
  )
}
