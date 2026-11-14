import { Button, OTPInput } from 'ioiti-ui'
import { useState } from 'react'

// The code the made-up server sent.
const SENT = '246810'

export default function OTPInputRefused() {
  const [code, setCode] = useState('135790')
  const [wrong, setWrong] = useState(true)
  return (
    <div className="flex flex-col items-start gap-3">
      <OTPInput
        length={6}
        aria-label="One-time code"
        value={code}
        onChange={(value) => {
          setCode(value)
          setWrong(false)
        }}
        onComplete={(value) => setWrong(value !== SENT)}
        className="grid grid-cols-6 gap-2"
        boxClassName={wrong ? 'border-negative/60 hover:border-negative dark:border-negative/60 dark:hover:border-negative' : undefined}
      />
      <p className="text-sm" aria-live="polite">
        {wrong ? (
          <span className="text-negative">That code is not the one sent: check the last message (it is {SENT} here).</span>
        ) : code === SENT ? (
          <span className="text-positive">Verified.</span>
        ) : (
          <span className="text-muted-foreground">Six digits.</span>
        )}
      </p>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          setCode('')
          setWrong(false)
        }}
      >
        Send another code
      </Button>
    </div>
  )
}
