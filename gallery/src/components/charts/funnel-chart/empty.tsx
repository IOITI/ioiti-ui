import { FunnelChart } from 'ioiti-ui'

export default function FunnelChartEmpty() {
  return (
    <div className="max-w-md rounded-xl border border-dashed border-border px-4">
      <FunnelChart ariaLabel="Sign-ups of this week" noun="Sign-ups" stages={[]} emptyText="No sign-up this week yet" />
    </div>
  )
}
