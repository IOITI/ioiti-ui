import { ChangeList, ConfirmAction, RecoveryLedger, useToast } from 'ioiti-ui'
import type { LedgerEntry } from 'ioiti-ui'
import { useState } from 'react'

const VERSIONS: LedgerEntry[] = [
  { id: 'v3', action: 'Saved by Ana', description: 'Spring prices', timestamp: 'Today, 09:40', reference: 'prices-v3.json' },
  {
    id: 'v2',
    action: 'Saved by Malik',
    description: 'Shipping to Spain',
    timestamp: 'Yesterday, 17:05',
    reference: 'prices-v2.json',
    details: {
      content: (
        <ChangeList
          label="What restoring it would change"
          numeric
          changes={[
            { label: 'Paper, A4, 500 sheets', before: '6.40 €', after: '5.90 €' },
            { label: 'Stapler', before: '14.00 €', after: '12.50 €' },
            { label: 'Shipping to Spain', before: '9.90 €' },
          ]}
        />
      ),
    },
  },
  // Kept to be read: it cannot be restored.
  { id: 'v1', action: 'Imported', description: 'First list', timestamp: '7 Nov, 11:20', reference: 'prices.csv', restorable: false },
]

export default function RecoveryLedgerTimeline() {
  const toast = useToast()
  const [current, setCurrent] = useState('v3')
  const [asked, setAsked] = useState<LedgerEntry | null>(null)
  return (
    <>
      <RecoveryLedger
        title="Versions of the price list"
        countLabel={`${VERSIONS.length} versions`}
        currentLabel="Current"
        restoreLabel="Restore"
        currentEntryId={current}
        entries={VERSIONS}
        // It restores nothing itself: the page asks first.
        onRestore={(id) => setAsked(VERSIONS.find((entry) => entry.id === id) ?? null)}
      />
      <ConfirmAction
        open={asked !== null}
        gesture="button"
        title={`Restore “${asked?.description ?? ''}”`}
        description="The price list becomes this version again; the current one is kept in the list, and can be restored."
        confirmLabel="Restore this version"
        onConfirm={() => {
          if (asked) {
            setCurrent(asked.id)
            toast({ title: `“${asked.description}” restored`, variant: 'success' })
          }
          setAsked(null)
        }}
        onClose={() => setAsked(null)}
      />
    </>
  )
}
