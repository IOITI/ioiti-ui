import { Button, Panel, PanelInset } from 'ioiti-ui'
import { createRoot } from 'react-dom/client'

function Preview() {
  return (
    <div className="grid gap-4 p-5 md:grid-cols-2">
      <Panel title="Latest orders" description="The five sent last." action={<Button size="sm" variant="outline">View all</Button>}>
        <p className="text-sm text-muted-foreground">A panel with a title, a description and an action.</p>
      </Panel>
      <Panel title="With a box in it" description="A figure's detail, set apart.">
        <PanelInset className="text-sm">
          <p className="font-medium">Payout on 14 Nov</p>
          <p className="mt-1 text-xs text-muted-foreground">To the account ending 4410, after the day's refunds.</p>
        </PanelInset>
      </Panel>
      <Panel title="Dense" description="Its body close under the title, for a list." dense>
        <ul className="divide-y divide-border/40 text-xs">
          <li className="py-2.5">First row</li>
          <li className="py-2.5">Second row</li>
        </ul>
      </Panel>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<Preview />)
