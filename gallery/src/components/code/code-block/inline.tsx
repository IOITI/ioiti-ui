import { Code } from 'ioiti-ui'

export default function CodeBlockInline() {
  return (
    <div className="max-w-prose space-y-2 text-sm text-muted-foreground">
      <p>
        A toast is shown with <Code>useToast()</Code>, and leaves on its own after <Code>4 s</Code>.
      </p>
      <p>
        Set <Code>maturity = &quot;production&quot;</Code> once the rule has run a week without a false alarm; its file is{' '}
        <Code>rules/large_order.toml</Code>.
      </p>
    </div>
  )
}
