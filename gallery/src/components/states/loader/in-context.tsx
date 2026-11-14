import { Button, Loader } from 'ioiti-ui'
import { useState } from 'react'

export default function LoaderInContext() {
  const [waiting, setWaiting] = useState(true)
  return (
    <div className="flex max-w-sm flex-col gap-4">
      <div className="flex items-center gap-3 rounded-xl border border-border p-4">
        {waiting ? (
          <>
            <Loader size={20} label="Waiting for the bank" />
            <div className="min-w-0">
              <p className="text-sm font-medium">Waiting for the bank</p>
              <p className="text-xs text-muted-foreground">It usually answers within a minute.</p>
            </div>
          </>
        ) : (
          <div className="min-w-0">
            <p className="text-sm font-medium">The bank answered</p>
            <p className="text-xs text-muted-foreground">The transfer leaves today.</p>
          </div>
        )}
      </div>
      <Button size="sm" variant="outline" className="self-start" onClick={() => setWaiting((value) => !value)}>
        {waiting ? 'Answer' : 'Wait again'}
      </Button>
    </div>
  )
}
