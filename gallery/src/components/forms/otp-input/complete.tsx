import { OTPInput } from 'ioiti-ui'
import { useState } from 'react'

export default function OTPInputComplete() {
  const [typed, setTyped] = useState('')
  const [code, setCode] = useState<string | null>(null)
  return (
    <div className="flex flex-col items-start gap-3">
      <label htmlFor="otp-complete" className="text-xs font-semibold text-text-primary">
        The code sent to •••• 0921
      </label>
      <OTPInput
        id="otp-complete"
        length={6}
        aria-label="One-time code"
        className="grid grid-cols-6 gap-2"
        onChange={(value) => {
          setTyped(value)
          if (value.length < 6) setCode(null)
        }}
        onComplete={setCode}
      />
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {code ? `Code entered: ${code}.` : `${typed.length} of 6 digits.`}
      </p>
    </div>
  )
}
