import { Button, DirectionalTooltip } from 'ioiti-ui'

export default function DirectionalTooltipSides() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <DirectionalTooltip key={side} content={`On the ${side}`} side={side}>
          <Button size="sm" variant="outline">
            {side}
          </Button>
        </DirectionalTooltip>
      ))}
    </div>
  )
}
