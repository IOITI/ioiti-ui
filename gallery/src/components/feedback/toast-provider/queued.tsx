import { Button, useToast } from 'ioiti-ui'

export default function ToastProviderQueued() {
  const toast = useToast()
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          toast({ title: 'Export requested' })
          toast({ title: 'Export ready', tone: 'info' })
        }}
      >
        Two at once
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          for (const file of ['invoice-0040.pdf', 'invoice-0041.pdf', 'invoice-0042.pdf']) toast({ title: `${file} sent`, tone: 'success' })
          toast({ title: 'Could not send invoice-0043.pdf', description: 'The address bounced.', tone: 'danger' })
        }}
      >
        A burst of four
      </Button>
    </div>
  )
}
