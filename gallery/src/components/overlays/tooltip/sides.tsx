import { Button, Tooltip } from 'ioiti-ui'

export default function TooltipSides() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Tooltip key={side} content={`On the ${side}`} side={side}>
          <Button size="sm" variant="outline">
            {side}
          </Button>
        </Tooltip>
      ))}
    </div>
  )
}
