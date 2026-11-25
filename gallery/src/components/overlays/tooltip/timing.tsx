import { Button, Tooltip } from 'ioiti-ui'

export default function TooltipTiming() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Tooltip content="At once" delayDuration={0}>
        <Button size="sm" variant="outline">
          No delay
        </Button>
      </Tooltip>
      <Tooltip content="After 600 ms" delayDuration={600}>
        <Button size="sm" variant="outline">
          A longer delay
        </Button>
      </Tooltip>
      <Tooltip content="16 px away" offset={16}>
        <Button size="sm" variant="outline">
          Further away
        </Button>
      </Tooltip>
      <Tooltip content="Without its arrow" showArrow={false}>
        <Button size="sm" variant="outline">
          No arrow
        </Button>
      </Tooltip>
    </div>
  )
}
