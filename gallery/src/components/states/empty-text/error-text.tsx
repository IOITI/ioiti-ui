import { Button, ErrorText } from 'ioiti-ui'
import { Send } from 'lucide-react'
import { useState } from 'react'

export default function EmptyTextErrorText() {
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const send = () => {
    setSending(true)
    setError(null)
    // The request, refused after a moment.
    window.setTimeout(() => {
      setSending(false)
      setError('Could not send the invoice: the mail server does not answer.')
    }, 800)
  }
  return (
    <div className="flex flex-col items-start gap-2">
      <Button size="sm" leftIcon={<Send />} isLoading={sending} loadingText="Sending" onClick={send}>
        Send the invoice
      </Button>
      {/* Under its button, read out at once. */}
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  )
}
