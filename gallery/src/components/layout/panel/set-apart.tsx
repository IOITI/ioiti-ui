import { Panel, PanelInset } from 'ioiti-ui'

export default function PanelSetApart() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Panel title="Balance" description="What the account holds tonight.">
        <p className="text-2xl font-semibold tabular-nums">12,480.00 €</p>
        <PanelInset className="mt-4 text-sm">
          <p className="font-medium">Payout on 14 November</p>
          <p className="mt-1 text-xs text-muted-foreground">To the account ending 4410, after the day’s refunds.</p>
        </PanelInset>
      </Panel>
      <Panel title="Returns" description="This week’s, by reason.">
        <div className="grid grid-cols-2 gap-3">
          <PanelInset>
            <p className="text-xs text-muted-foreground">Damaged</p>
            <p className="mt-1 text-lg font-semibold tabular-nums">7</p>
          </PanelInset>
          <PanelInset>
            <p className="text-xs text-muted-foreground">Wrong size</p>
            <p className="mt-1 text-lg font-semibold tabular-nums">12</p>
          </PanelInset>
        </div>
      </Panel>
    </div>
  )
}
