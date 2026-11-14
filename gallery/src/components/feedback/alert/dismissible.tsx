import { Alert, AlertDescription, AlertTitle, Button } from 'ioiti-ui'
import { useState } from 'react'

export default function AlertDismissible() {
  // A new key draws it again once it has been put away.
  const [shown, setShown] = useState(0)
  const [dismissed, setDismissed] = useState(false)
  return (
    <div className="flex flex-col gap-3">
      <Alert
        key={shown}
        tone="info"
        dismissible
        onDismiss={() => setDismissed(true)}
      >
        <AlertTitle>New: exports by email</AlertTitle>
        <AlertDescription>An export of more than 10,000 rows is sent by email when it is ready.</AlertDescription>
      </Alert>
      {dismissed && (
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-muted-foreground">Put away: onDismiss came once it had folded.</span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setDismissed(false)
              setShown((count) => count + 1)
            }}
          >
            Show it again
          </Button>
        </div>
      )}
    </div>
  )
}
