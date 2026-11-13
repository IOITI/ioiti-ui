import { SpringSelect } from 'ioiti-ui'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <div className="flex max-w-sm flex-col gap-3 p-5">
    <SpringSelect
      label="Plan"
      defaultValue="team"
      options={[
        { value: 'solo', label: 'Solo', description: 'One user' },
        { value: 'team', label: 'Team', description: 'Up to ten users' },
        { value: 'company', label: 'Company', description: 'Unlimited', disabled: true },
      ]}
    />
    <p className="text-xs text-muted-foreground">Press it: the list springs open under it.</p>
  </div>,
)
