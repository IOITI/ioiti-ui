import { Button, DirectionalTooltip } from 'ioiti-ui'
import { createRoot } from 'react-dom/client'

const SIDES = ['top', 'right', 'bottom', 'left'] as const

createRoot(document.getElementById('root')!).render(
  <div className="flex flex-col items-start gap-6 p-5">
    <span className="text-xs text-muted-foreground">Hover or focus a button: its tooltip comes from that side, or the other one where there is no room.</span>
    <div className="flex flex-wrap items-center gap-6 pb-6">
      {SIDES.map((side) => (
        <DirectionalTooltip key={side} content={`On the ${side}`} side={side}>
          <Button size="sm" variant="outline">
            {side}
          </Button>
        </DirectionalTooltip>
      ))}
    </div>
  </div>,
)
