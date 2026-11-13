import { RecoveryLedger } from 'ioiti-ui'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <div className="block w-full p-5">
    <RecoveryLedger
      title="Versions of the price list"
      currentEntryId="v3"
      entries={[
        { id: 'v3', action: 'Saved by Ana', description: 'Spring prices', timestamp: new Date(Date.now() - 3_600_000), reference: 'prices-v3.json' },
        { id: 'v2', action: 'Saved by Malik', description: 'Shipping to Spain', timestamp: new Date(Date.now() - 86_400_000), restorable: true, details: { content: <p className="text-xs">Restoring it changes 3 prices.</p> } },
        { id: 'v1', action: 'Imported', description: 'First list', timestamp: new Date(Date.now() - 7 * 86_400_000), restorable: true },
      ]}
    />
  </div>,
)
