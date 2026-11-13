import { Button, ToastProvider, useToast } from 'ioiti-ui'
import { useEffect } from 'react'
import { createRoot } from 'react-dom/client'

function Buttons() {
  const toast = useToast()
  useEffect(() => {
    toast({ title: 'Settings saved', variant: 'success' })
  }, [toast])
  return (
    <div className="flex flex-wrap items-center gap-3 p-5">
      <Button size="sm" variant="outline" onClick={() => toast({ title: 'Refreshed' })}>Refresh</Button>
      <Button size="sm" variant="outline" onClick={() => toast({ title: 'Saved', description: 'Toasts come one at a time, at the bottom.', variant: 'success' })}>Save</Button>
      <Button size="sm" variant="outline" onClick={() => toast({ title: 'Could not send', description: 'The server answered 503. Nothing was sent.', variant: 'error' })}>Send</Button>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <ToastProvider>
    <Buttons />
  </ToastProvider>,
)
