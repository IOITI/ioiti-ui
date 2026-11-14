import { BarList } from 'ioiti-ui'

export default function BarListAgainstALimit() {
  return (
    <div className="grid max-w-3xl gap-8 sm:grid-cols-2">
      <div className="min-w-0 space-y-3">
        <p className="text-sm font-medium">Disks, out of 500 GB each</p>
        {/* max: a full bar is the disk's size, not the largest value; a tone says which is near its limit. */}
        <BarList
          label="Space used on each disk, out of 500 GB"
          max={500}
          format={(value) => `${value} GB`}
          items={[
            { label: 'Database', value: 468, tone: 'negative' },
            { label: 'Backups', value: 402, tone: 'warning' },
            { label: 'Uploads', value: 251 },
            { label: 'Logs', value: 96 },
          ]}
        />
      </div>
      <div className="min-w-0 space-y-3">
        <p className="text-sm font-medium">Services, share of checks passed</p>
        <BarList
          label="Share of health checks passed this week"
          max={100}
          format={(value) => `${value.toFixed(1)}%`}
          items={[
            { label: 'Payments', value: 99.9, tone: 'positive' },
            { label: 'Search', value: 98.2, tone: 'positive' },
            { label: 'Mail', value: 91.4, tone: 'warning' },
          ]}
        />
      </div>
    </div>
  )
}
