import { Button, DirectionalTooltip } from 'ioiti-ui'

export default function DirectionalTooltipAlign() {
  return (
    <div className="flex flex-col items-start gap-3">
      {(['start', 'center', 'end'] as const).map((align) => (
        <DirectionalTooltip key={align} content={`Aligned on its ${align}`} side="right" align={align}>
          <Button variant="outline" className="h-20 w-56">
            align=&quot;{align}&quot;
          </Button>
        </DirectionalTooltip>
      ))}
      <div className="flex flex-wrap gap-3">
        {(['start', 'center', 'end'] as const).map((align) => (
          <DirectionalTooltip key={align} content={`Under it, on its ${align}`} side="bottom" align={align}>
            <Button variant="outline" className="w-56">
              bottom, {align}
            </Button>
          </DirectionalTooltip>
        ))}
      </div>
    </div>
  )
}
