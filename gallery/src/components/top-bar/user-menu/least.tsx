import { UserMenu, useToast } from 'ioiti-ui'

export default function UserMenuLeast() {
  const toast = useToast()
  return (
    <div className="flex h-14 w-full items-center justify-end gap-2 rounded-xl border border-border px-4 glass-bar">
      <UserMenu name="Léa Brun" signOutLabel="Log out" onSignOut={() => toast({ title: 'Logged out' })} />
    </div>
  )
}
