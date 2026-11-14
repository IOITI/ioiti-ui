import { StatusHistory } from 'ioiti-ui'
import type { StatusHistorySlot } from 'ioiti-ui'

// October, a day a block: slow on two days, down on one.
const OCTOBER: StatusHistorySlot[] = Array.from({ length: 31 }, (_, index) => {
  const day = index + 1
  return { status: day === 17 ? 'down' : day === 9 || day === 24 ? 'warning' : 'ok', at: `${day} Oct` }
})

export default function StatusHistoryDays() {
  return (
    <StatusHistory
      className="max-w-2xl"
      label="Payments, October"
      slots={OCTOBER}
      unit={{ one: 'day', other: 'days' }}
      scale={['1 Oct', '31 Oct']}
    />
  )
}
