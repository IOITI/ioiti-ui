import { OTPInput } from 'ioiti-ui'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <div className="flex flex-col items-start gap-3 p-5">
    <OTPInput length={6} aria-label="One-time code" className="grid grid-cols-6 gap-2" />
    <p className="text-xs text-muted-foreground">Type, or paste a code: a password manager’s or a phone’s autofill fills every box.</p>
  </div>,
)
