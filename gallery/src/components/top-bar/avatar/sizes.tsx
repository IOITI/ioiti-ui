import { Avatar } from 'ioiti-ui'

export default function AvatarSizes() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <div className="flex items-center gap-2">
        <Avatar name="Ana María Ortiz" size="xs" />
        <Avatar name="Léa Brun" size="sm" />
        <Avatar name="Omar Haddad" />
        <Avatar name="Yuki Sato" size="lg" />
      </div>
      {/* A stop of the keyboard: the name in a hint, on hover and on focus. */}
      <div className="flex items-center gap-2">
        <Avatar name="Jonas Weber" hint />
        <Avatar name="Priya" hint />
        <span className="text-sm text-muted-foreground">One word, one letter.</span>
      </div>
    </div>
  )
}
