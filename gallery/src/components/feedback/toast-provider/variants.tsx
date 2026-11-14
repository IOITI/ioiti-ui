import { Button, useToast } from 'ioiti-ui'

export default function ToastProviderVariants() {
  const toast = useToast()
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button size="sm" variant="outline" onClick={() => toast({ title: 'Draft saved' })}>
        Default
      </Button>
      <Button size="sm" variant="outline" onClick={() => toast({ title: 'Settings saved', variant: 'success' })}>
        Success
      </Button>
      <Button size="sm" variant="outline" onClick={() => toast({ title: 'Saved without its picture', description: 'The file is over 5 MB.', variant: 'warning' })}>
        Warning
      </Button>
      <Button size="sm" variant="outline" onClick={() => toast({ title: 'Could not send the invoice', description: 'The mail server does not answer.', variant: 'error' })}>
        Error (stays 8 s)
      </Button>
      <Button size="sm" variant="outline" onClick={() => toast({ title: 'Export requested', description: 'It is sent by email when it is ready.', variant: 'info' })}>
        Info
      </Button>
    </div>
  )
}
