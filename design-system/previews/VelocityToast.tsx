import { Button, VelocityToast } from 'ioiti-ui'
import type { VelocityToastAction, VelocityToastVariant } from 'ioiti-ui'
import { useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'

interface Shown {
  id: number
  open: boolean
  title: string
  description?: string
  variant?: VelocityToastVariant
  action?: VelocityToastAction
  duration: number
}

function Preview() {
  const next = useRef(1)
  // One on load, as it would come after an export: it leads on, so it stays 6 s.
  const [toast, setToast] = useState<Shown>({
    id: 0,
    open: true,
    title: 'Export ready',
    description: 'orders-2026-10-26.csv',
    variant: 'success',
    action: { label: 'Open it', href: '#export' },
    duration: 6000,
  })
  const show = (message: Omit<Shown, 'id' | 'open'>) => {
    next.current += 1
    setToast({ ...message, id: next.current, open: true })
  }
  return (
    <div className="flex min-h-[12rem] flex-col items-start gap-2 p-5">
      <div className="flex flex-wrap items-center gap-3">
        <Button size="sm" variant="outline" onClick={() => show({ title: 'Saved', variant: 'success', duration: 4000 })}>
          A success
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => show({ title: 'Could not send the invoice', description: 'The mail server does not answer.', variant: 'error', duration: 8000 })}
        >
          An error (stays longer)
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            show({ title: 'Export ready', description: 'orders-2026-10-26.csv', variant: 'success', action: { label: 'Open it', href: '#export' }, duration: 6000 })
          }
        >
          One that leads on (a link)
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            show({
              title: 'Could not send the invoice',
              description: 'The mail server does not answer.',
              variant: 'error',
              action: { label: 'Retry', onClick: () => setTimeout(() => show({ title: 'Invoice sent', variant: 'success', duration: 4000 }), 300) },
              duration: 8000,
            })
          }
        >
          One with a button
        </Button>
      </div>
      <span className="text-xs text-muted-foreground">Its time stops under the pointer, and while the keyboard is in it.</span>
      <VelocityToast
        key={toast.id}
        open={toast.open}
        onDismiss={() => setToast((shown) => ({ ...shown, open: false }))}
        title={toast.title}
        description={toast.description}
        variant={toast.variant}
        action={toast.action}
        duration={toast.duration}
      />
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<Preview />)
