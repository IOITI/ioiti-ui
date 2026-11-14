import { Button, DirectionalTooltip } from 'ioiti-ui'

export default function DirectionalTooltipTiming() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <DirectionalTooltip content="At once" delayDuration={0}>
        <Button size="sm" variant="outline">
          No delay
        </Button>
      </DirectionalTooltip>
      <DirectionalTooltip content="After 600 ms" delayDuration={600}>
        <Button size="sm" variant="outline">
          A longer delay
        </Button>
      </DirectionalTooltip>
      <DirectionalTooltip content="16 px away" offset={16}>
        <Button size="sm" variant="outline">
          Further away
        </Button>
      </DirectionalTooltip>
      <DirectionalTooltip content="Without its arrow" showArrow={false}>
        <Button size="sm" variant="outline">
          No arrow
        </Button>
      </DirectionalTooltip>
    </div>
  )
}
