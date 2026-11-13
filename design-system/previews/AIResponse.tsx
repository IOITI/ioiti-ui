import { AIResponse, Button } from 'ioiti-ui'
import { useState } from 'react'
import { createRoot } from 'react-dom/client'

const ANSWER = `## Believable, on few days

The run made **42 trades on 21 days** and beat 97 % of random entries; see [the guide](#agent) and [the
reference](https://example.com/guide).

| Check | Result |
| --- | --- |
| Trades | 42 |
| Random entries beaten | 97 % |

- Stress it before keeping it
- Try \`fast = 14\` on the same days

\`\`\`json
{"fast": 14, "slow": 40}
\`\`\``

const SOURCES = [
  { id: 1, title: 'The October summary', url: '#agent', snippet: 'Its figures, step by step' },
  { id: 2, title: 'A guide', url: 'https://example.com/guide' },
]

function Streamed() {
  const [shown, setShown] = useState(ANSWER.length)
  const streaming = shown < ANSWER.length
  return (
    <div className="space-y-3 p-5">
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          setShown(0)
          const timer = window.setInterval(
            () =>
              setShown((length) => {
                if (length >= ANSWER.length) window.clearInterval(timer)
                return Math.min(ANSWER.length, length + 9)
              }),
            40,
          )
        }}
      >
        Stream it again
      </Button>
      <AIResponse
        content={ANSWER.slice(0, shown)}
        status={streaming ? 'streaming' : 'complete'}
        modelName="Model 2"
        sources={SOURCES}
        onRegenerate={() => setShown(0)}
        onFeedback={() => {}}
      />
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<Streamed />)
