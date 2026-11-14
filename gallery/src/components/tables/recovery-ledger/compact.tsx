import { RecoveryLedger } from 'ioiti-ui'
import { useState } from 'react'

export default function RecoveryLedgerCompact() {
  const [opened, setOpened] = useState<string | null>('b2')
  return (
    <div className="max-w-sm space-y-3">
      <RecoveryLedger
        variant="compact"
        title="Versions of the template"
        countLabel="3 versions"
        currentLabel="Current"
        currentEntryId="b3"
        expandedId={opened}
        onExpandedChange={setOpened}
        entries={[
          { id: 'b3', action: 'Edited by Léa', description: 'A new footer', timestamp: 'Today, 10:02', author: 'Léa Brun' },
          {
            id: 'b2',
            action: 'Edited by Omar',
            description: 'The logo on the left',
            timestamp: 'Monday, 15:48',
            author: 'Omar Haddad',
            details: { preview: 'Restoring it puts the logo back on the left and the old footer under the total.' },
          },
          { id: 'b1', action: 'Created', description: 'From the default template', timestamp: '2 Nov, 09:00' },
        ]}
      />
      <p className="text-sm text-muted-foreground">
        Opened: <span className="text-foreground">{opened ?? 'none'}</span>
      </p>
    </div>
  )
}
