import { Avatar } from 'ioiti-ui'

// From the application's own origin: nothing is loaded from another.
const AVATARS = `${import.meta.env.BASE_URL}avatars`

export default function AvatarPicture() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <div className="flex items-center gap-2">
        <Avatar name="Ana María Ortiz" src={`${AVATARS}/ana.svg`} size="sm" />
        <Avatar name="Yuki Sato" src={`${AVATARS}/yuki.svg`} />
        <Avatar name="Omar Haddad" src={`${AVATARS}/omar.svg`} size="lg" hint />
      </div>
      <div className="flex items-center gap-2">
        {/* No such picture: its initials. */}
        <Avatar name="Jonas Weber" src={`${AVATARS}/missing.svg`} size="lg" />
        <span className="text-sm text-muted-foreground">A picture that failed to load</span>
      </div>
    </div>
  )
}
