import { Button, OTPInput } from 'ioiti-ui'
import { useState } from 'react'

export default function OTPInputChecking() {
  const [code, setCode] = useState('')
  const [state, setState] = useState<'typing' | 'checking' | 'verified'>('typing')
  const check = () => {
    setState('checking')
    // The server, answering after a moment.
    window.setTimeout(() => setState('verified'), 1200)
  }
  return (
    <div className="flex flex-col items-start gap-3">
      <OTPInput
        length={4}
        aria-label="Code of the card reader"
        value={code}
        onChange={setCode}
        onComplete={check}
        disabled={state !== 'typing'}
        className="grid grid-cols-4 gap-2"
      />
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {state === 'checking' ? 'Checking the code…' : state === 'verified' ? `Verified: the reader ${code} is paired.` : 'Four digits, shown on the reader.'}
      </p>
      {state === 'verified' && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setCode('')
            setState('typing')
          }}
        >
          Pair another reader
        </Button>
      )}
    </div>
  )
}
