import { AnimatedNumber, Button, DescriptionList, formatMoney } from 'ioiti-ui'
import { useState } from 'react'

const TOTALS = [18240.5, 23950, 9874.25]

export default function AnimatedNumberFormats() {
  const [at, setAt] = useState(0)
  const total = TOTALS[at]
  return (
    <div className="max-w-md space-y-4">
      <DescriptionList
        divided
        items={[
          { term: 'Two decimals', details: <AnimatedNumber value={total} decimals={2} /> },
          { term: 'Compact', details: <AnimatedNumber value={total * 120} compact decimals={1} /> },
          { term: 'A prefix and a suffix', details: <AnimatedNumber value={total / 100} prefix="≈" suffix=" orders" /> },
          // The application's own format: its digits roll, the rest stays.
          { term: 'Written by the page', details: <AnimatedNumber value={total} text={formatMoney(total, 'EUR')} /> },
        ]}
      />
      <Button size="sm" variant="outline" onClick={() => setAt((at + 1) % TOTALS.length)}>
        Another total
      </Button>
    </div>
  )
}
