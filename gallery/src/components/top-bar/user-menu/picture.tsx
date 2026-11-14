import { copyToClipboard, UserMenu, useToast } from 'ioiti-ui'
import { Copy, UserRound } from 'lucide-react'

export default function UserMenuPicture() {
  const toast = useToast()
  return (
    <div className="flex h-14 w-full items-center justify-end gap-2 rounded-xl border border-border px-4 glass-bar">
      <UserMenu
        name="Yuki Sato"
        detail="Warehouse lead"
        avatarSrc={`${import.meta.env.BASE_URL}avatars/yuki.svg`}
        items={[
          { type: 'link', label: 'Profile', href: '/patterns/settings', icon: <UserRound /> },
          {
            label: 'Copy my user ID',
            icon: <Copy />,
            onSelect: () => {
              void copyToClipboard('u-20417').then((copied) =>
                toast(copied ? { title: 'User ID copied' } : { title: 'The browser refused to copy it', variant: 'error' }),
              )
            },
          },
        ]}
        // In an application, the server's address (`/api/v1/auth/logout`), which sends on to the sign-in page.
        signOutHref={`${import.meta.env.BASE_URL}patterns/sign-in`}
      />
    </div>
  )
}
