import { Avatar, AvatarGroup } from 'ioiti-ui'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <div className="flex flex-wrap items-center gap-6 p-5">
    <div className="flex items-center gap-2">
      <Avatar name="Ana María Ortiz" size="xs" />
      <Avatar name="Léa Brun" size="sm" />
      <Avatar name="Omar Haddad" />
      <Avatar name="Yuki Sato" size="lg" hint />
    </div>
    <AvatarGroup
      label="Who works on the order"
      max={3}
      people={[{ name: 'Ana María Ortiz' }, { name: 'Léa Brun' }, { name: 'Omar Haddad' }, { name: 'Yuki Sato' }, { name: 'Jonas Weber' }]}
    />
  </div>,
)
