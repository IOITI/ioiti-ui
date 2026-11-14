import { AIResponse, Button } from 'ioiti-ui'
import { useEffect, useState } from 'react'

import { ANSWER, SOURCES } from '../../../samples/ai'

// The answer in words, each with the spaces after it: what a model sends, a few at a time.
const WORDS = ANSWER.split(/(?<=\s)/)

export default function AIResponseStreaming() {
  const [shown, setShown] = useState(WORDS.length)
  const [feedback, setFeedback] = useState<'like' | 'dislike' | null>(null)
  const streaming = shown < WORDS.length
  // A moment of thinking before the first word, then three words every 40 ms.
  useEffect(() => {
    if (!streaming) return
    const timer = window.setTimeout(() => setShown((count) => Math.min(WORDS.length, count + 3)), shown === 0 ? 800 : 40)
    return () => window.clearTimeout(timer)
  }, [shown, streaming])
  const ask = () => {
    setFeedback(null)
    setShown(0)
  }
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <Button size="sm" variant="outline" onClick={ask} disabled={streaming}>
          Stream it again
        </Button>
        <span className="text-xs text-muted-foreground">Feedback: {feedback === 'like' ? 'good' : feedback === 'dislike' ? 'poor' : 'none yet'}</span>
      </div>
      <AIResponse
        content={WORDS.slice(0, shown).join('')}
        status={shown === 0 ? 'generating' : streaming ? 'streaming' : 'complete'}
        modelName="Model 2"
        sources={SOURCES}
        onRegenerate={ask}
        feedback={feedback}
        onFeedback={(type) => setFeedback((was) => (was === type ? null : type))}
      />
    </div>
  )
}
