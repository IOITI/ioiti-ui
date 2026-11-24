import { BarList, ErrorBoundary, formatMoney, Panel, Switch } from 'ioiti-ui'
import { useState } from 'react'

interface SalesAnswer {
  shops: { name: string; sales: number }[]
}

// What the sales service answers: its shops, each with its sales of the week.
const ANSWER: SalesAnswer = {
  shops: [
    { name: 'North', sales: 18_420 },
    { name: 'Harbour', sales: 12_260 },
    { name: 'Station', sales: 9_310 },
  ],
}

/** A chart of another service's figures. It trusts the answer, as a part often does: one without its shops throws. */
function SalesByShop({ answer }: { answer: SalesAnswer }) {
  return (
    <BarList
      label="Sales by shop"
      items={answer.shops.map((shop) => ({ label: shop.name, value: shop.sales }))}
      format={(value) => formatMoney(value)}
    />
  )
}

export default function ErrorStatePart() {
  const [broken, setBroken] = useState(false)
  return (
    <div className="flex max-w-lg flex-col gap-4">
      <Panel title="Sales of the week" description="Every shop, Monday to today.">
        <p className="mb-4 text-sm">
          {formatMoney(39_990)} <span className="text-muted-foreground">in all</span>
        </p>
        {/* Around the part that may throw, not the panel: the total stays. Its Try again draws the part again. */}
        <ErrorBoundary>
          <SalesByShop answer={broken ? ({} as SalesAnswer) : ANSWER} />
        </ErrorBoundary>
      </Panel>
      <Switch
        label="The service answers without the shops"
        description="The chart throws as it draws; once the answer is whole again, Try again draws it"
        checked={broken}
        onChange={setBroken}
      />
    </div>
  )
}
