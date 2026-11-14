import { Alert, AlertDescription, AlertTitle, Button, useToast } from 'ioiti-ui'
import { RotateCw } from 'lucide-react'

export default function AlertAction() {
  const toast = useToast()
  return (
    <div className="flex flex-col gap-3">
      <Alert
        tone="warning"
        action={
          <Button size="sm" variant="outline" onClick={() => toast({ title: 'Opening the review' })}>
            Review
          </Button>
        }
      >
        <AlertTitle>Three orders wait for a review</AlertTitle>
        <AlertDescription>They are held until someone looks at them.</AlertDescription>
      </Alert>
      <Alert
        tone="danger"
        action={
          <Button size="sm" variant="outline" leftIcon={<RotateCw />} onClick={() => toast({ title: 'Invoices sent', variant: 'success' })}>
            Try again
          </Button>
        }
      >
        <AlertTitle>The invoices were not sent</AlertTitle>
        <AlertDescription>The mail server did not answer: nothing was sent.</AlertDescription>
      </Alert>
    </div>
  )
}
