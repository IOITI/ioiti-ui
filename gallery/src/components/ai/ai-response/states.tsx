import { AIResponse } from 'ioiti-ui'
import { useState } from 'react'

export default function AIResponseStates() {
  const [tries, setTries] = useState(0)
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {/* Stopped by the reader: what was written stays, said to be stopped. */}
      <AIResponse status="cancelled" content="October had 42 orders from 31 customers. Three of them" />
      {/* Failed: what went wrong, in its words, and a way to try again. */}
      <AIResponse
        status="error"
        content={tries > 0 ? `Still no answer after ${tries + 1} tries: the model is busy.` : 'The model took too long to answer.'}
        onRegenerate={() => setTries(tries + 1)}
      />
      {/* Not asked yet. */}
      <AIResponse status="idle" />
    </div>
  )
}
