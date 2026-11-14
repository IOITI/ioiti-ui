import { Panel, StatusBadge, StatusHistory } from 'ioiti-ui'
import type { StatusHistorySlot } from 'ioiti-ui'

// Two weeks of nightly backups: one failed, one not known (the server was off), switched off over a weekend.
const NIGHTS: StatusHistorySlot[] = [
  ...['1', '2', '3', '4', '5'].map((day) => ({ status: 'ok' as const, at: `${day} Nov` })),
  { status: 'disabled', at: '6 Nov' },
  { status: 'disabled', at: '7 Nov' },
  { status: 'ok', at: '8 Nov' },
  { status: 'unknown', at: '9 Nov' },
  { status: 'ok', at: '10 Nov' },
  { status: 'ok', at: '11 Nov' },
  { status: 'down', at: '12 Nov' },
  { status: 'ok', at: '13 Nov' },
  { status: 'ok', at: '14 Nov' },
]

export default function StatusHistoryInAPanel() {
  return (
    <Panel
      className="max-w-xl"
      title="Nightly backup"
      description="At 02:00, of the whole database, kept 30 days."
      action={<StatusBadge status="ok" />}
    >
      <StatusHistory
        label="Nightly backups, the last 14 nights"
        slots={NIGHTS}
        unit={{ one: 'night', other: 'nights' }}
        summary="Backed up 10 nights of 14: failed on 12 Nov, not known on 9 Nov, switched off on 6 and 7 Nov"
        scale={['1 Nov', 'Last night']}
      />
    </Panel>
  )
}
