import { Button, useToast } from 'ioiti-ui'

export default function ToastProviderAction() {
  const toast = useToast()
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={() =>
          toast({
            title: 'Export ready',
            description: 'orders-2026-10-26.csv',
            variant: 'success',
            action: { label: 'Open it', href: '/patterns/dashboard' },
          })
        }
      >
        One that leads on (a link)
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() =>
          toast({
            title: 'Could not send the invoice',
            description: 'The mail server does not answer.',
            variant: 'error',
            action: { label: 'Retry', onClick: () => toast({ title: 'Invoice sent', variant: 'success' }) },
          })
        }
      >
        One with a button
      </Button>
    </div>
  )
}
