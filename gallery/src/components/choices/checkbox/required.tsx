import { Button, Checkbox } from 'ioiti-ui'
import type { FormEvent } from 'react'
import { useState } from 'react'

export default function CheckboxRequired() {
  const [accepted, setAccepted] = useState(false)
  const [missing, setMissing] = useState(false)
  const [sent, setSent] = useState(false)
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMissing(!accepted)
    setSent(accepted)
  }
  return (
    <form onSubmit={submit} noValidate className="flex max-w-md flex-col items-start gap-3">
      <div className="flex flex-col gap-1">
        <Checkbox
          label="I accept the terms of delivery"
          description="Returns within 30 days, at the customer's cost"
          checked={accepted}
          onChange={(event) => {
            setAccepted(event.target.checked)
            if (event.target.checked) setMissing(false)
          }}
          aria-invalid={missing || undefined}
          aria-errormessage={missing ? 'terms-missing' : undefined}
        />
        {missing && (
          <span id="terms-missing" className="pl-6.5 text-xs text-negative">
            The order is placed once the terms are accepted
          </span>
        )}
      </div>
      <Button type="submit" size="sm">
        Place the order
      </Button>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {sent ? 'Order placed.' : 'Not placed yet.'}
      </p>
    </form>
  )
}
