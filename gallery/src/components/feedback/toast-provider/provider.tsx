import { Button, ToastProvider, useToast } from 'ioiti-ui'

/** A page under its own provider: what calls useToast is inside it. */
function Basket() {
  const toast = useToast()
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="sm" variant="outline" onClick={() => toast({ title: 'Added to the basket', variant: 'success' })}>
        Add to the basket
      </Button>
      <span className="text-sm text-muted-foreground">Its toast comes 6rem from the bottom, above a bar of that height.</span>
    </div>
  )
}

export default function ToastProviderProvider() {
  // Once, around the application: IoitiProvider and RouterRoot include one. wrapperClassName lifts its toasts.
  return (
    <ToastProvider wrapperClassName="bottom-24">
      <Basket />
    </ToastProvider>
  )
}
