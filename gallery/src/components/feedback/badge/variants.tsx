import { Badge } from 'ioiti-ui'

const TONES = [
  { tone: 'neutral', word: 'Draft' },
  { tone: 'success', word: 'Paid' },
  { tone: 'warning', word: 'Due soon' },
  { tone: 'danger', word: 'Overdue' },
] as const

export default function BadgeVariants() {
  return (
    <div className="grid w-fit grid-cols-[auto_repeat(4,auto)] items-center gap-x-4 gap-y-3 text-xs text-muted-foreground">
      {(['soft', 'solid', 'outline'] as const).map((variant) => (
        <div key={variant} className="contents">
          <span className="font-mono">{variant}</span>
          {TONES.map(({ tone, word }) => (
            <span key={tone}>
              <Badge variant={variant} tone={tone}>
                {word}
              </Badge>
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}
