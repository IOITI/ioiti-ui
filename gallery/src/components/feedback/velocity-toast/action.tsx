import { Button, VelocityToast } from 'ioiti-ui'
import { Truck } from 'lucide-react'
import { useState } from 'react'

export default function VelocityToastAction() {
  const [open, setOpen] = useState<'link' | 'button' | null>(null)
  const [retried, setRetried] = useState(0)
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="sm" variant="outline" onClick={() => setOpen('link')}>
        A link, its own icon
      </Button>
      <Button size="sm" variant="outline" onClick={() => setOpen('button')}>
        A button, no bar
      </Button>
      {retried > 0 && <span className="text-sm text-muted-foreground">Retried {retried} time{retried === 1 ? '' : 's'}.</span>}
      <VelocityToast
        open={open === 'link'}
        onDismiss={() => setOpen(null)}
        icon={<Truck className="size-4" />}
        title="Delivery booked"
        description="Tuesday, between 08:00 and 12:00."
        action={{ label: 'See it', href: '/patterns/dashboard' }}
        duration={6000}
      />
      <VelocityToast
        open={open === 'button'}
        onDismiss={() => setOpen(null)}
        variant="error"
        title="The sync stopped"
        description="The warehouse did not answer."
        action={{ label: 'Retry', onClick: () => setRetried((count) => count + 1) }}
        duration={8000}
        showProgress={false}
      />
    </div>
  )
}
