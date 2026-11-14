import { BarList } from 'ioiti-ui'

export default function BarListNarrow() {
  return (
    <div className="max-w-64 rounded-2xl border border-border/70 bg-surface/50 p-4 dark:bg-surface/25">
      <p className="mb-3 text-sm font-medium">Pages most visited</p>
      {/* A label longer than its room ends in an ellipsis; the figure stays whole. */}
      <BarList
        label="Pages most visited this week"
        items={[
          { label: '/orders/returns/new-return-request', value: 12_480 },
          { label: '/catalogue/spring-collection-2027', value: 8_212 },
          { label: '/account/delivery-addresses', value: 3_904 },
          { label: '/help', value: 1_206 },
        ]}
      />
    </div>
  )
}
