import { AvatarGroup } from 'ioiti-ui'

const AVATARS = `${import.meta.env.BASE_URL}avatars`

const TEAM = [
  { name: 'Ana María Ortiz', src: `${AVATARS}/ana.svg` },
  { name: 'Léa Brun' },
  { name: 'Omar Haddad', src: `${AVATARS}/omar.svg` },
  { name: 'Yuki Sato', src: `${AVATARS}/yuki.svg` },
  { name: 'Jonas Weber' },
  { name: 'Priya Natarajan' },
]

export default function AvatarGroupAndMore() {
  return (
    <div className="flex flex-wrap items-center gap-8">
      <AvatarGroup label="Who works on the order" max={3} people={TEAM} />
      <AvatarGroup label="Who watches the delivery" size="sm" people={TEAM.slice(0, 2)} />
      <AvatarGroup label="The whole team" size="lg" max={5} people={TEAM} />
    </div>
  )
}
