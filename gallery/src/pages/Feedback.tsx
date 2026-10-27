import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  CheckList,
  Loader,
  PageHeader,
  ProgressBar,
  RequestStatus,
  Skeleton,
  SkeletonAvatar,
  SkeletonReveal,
  SkeletonText,
  StatusBadge,
  UndoToast,
  useToast,
} from 'ioiti-ui'
import type { Check, RequestLifecycleStatus } from 'ioiti-ui'
import { useState } from 'react'

import { Demo } from '../parts'

const CHECKS: Check[] = [
  { id: 'tests', label: 'Tests', state: 'pass', detail: '142 passed in 6 s.' },
  { id: 'contrast', label: 'Contrast', state: 'fail', detail: 'One text colour is 4.44:1 on a hovered row.' },
  { id: 'review', label: 'Review', state: 'open', detail: 'Not asked yet.' },
]

const STEPS: { status: RequestLifecycleStatus; title: string; description: string }[] = [
  { status: 'processing', title: 'Asked', description: 'The refund is on its way to the bank.' },
  { status: 'verifying', title: 'Sent, waiting for the answer', description: 'The bank has it; it usually answers within a minute.' },
  { status: 'success', title: 'Refunded', description: 'The customer gets 42.00 € back in two to three days.' },
  { status: 'failed', title: 'Refused', description: 'The bank refused it: the card has expired.' },
  { status: 'unknown', title: 'No news', description: 'No answer for 75 s: look at the order before asking again.' },
]

function Toasts() {
  const toast = useToast()
  return (
    <>
      <Button size="sm" variant="outline" onClick={() => toast({ title: 'Saved', variant: 'success' })}>
        A success
      </Button>
      <Button size="sm" variant="outline" onClick={() => toast({ title: 'Could not send the invoice', description: 'The mail server does not answer.', variant: 'error' })}>
        An error (stays longer)
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          toast({ title: 'Export requested' })
          toast({ title: 'Export ready', variant: 'info' })
        }}
      >
        Two at once (one after the other)
      </Button>
    </>
  )
}

function Undo() {
  const [open, setOpen] = useState(false)
  const [restored, setRestored] = useState(false)
  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          setRestored(false)
          setOpen(true)
        }}
      >
        Remove two files
      </Button>
      {restored && <span className="text-xs text-muted-foreground">Kept: nothing was removed.</span>}
      <UndoToast
        open={open}
        title="2 files removed"
        description="Removed for good in a few seconds"
        duration={8000}
        onUndo={() => setRestored(true)}
        onDismiss={() => setOpen(false)}
      />
    </>
  )
}

function Request() {
  const [step, setStep] = useState(0)
  const current = STEPS[step]
  return (
    <div className="w-full space-y-3">
      <div className="flex flex-wrap gap-2">
        {STEPS.map((item, index) => (
          <Button key={item.status} size="sm" variant={index === step ? 'primary' : 'outline'} aria-pressed={index === step} onClick={() => setStep(index)}>
            {item.status}
          </Button>
        ))}
      </div>
      <RequestStatus
        status={current.status}
        title={current.title}
        description={current.description}
        subject="Refund · order 2026-0042"
        figures={current.status === 'success' ? [{ label: 'Amount', value: '42.00 €' }, { label: 'Card', value: '•••• 4242' }] : undefined}
        reference={{ label: 'Refund', value: 'RF-88213' }}
        link={{ href: '/components/data', label: 'See the order' }}
      />
    </div>
  )
}

function Reveal() {
  const [loading, setLoading] = useState(true)
  return (
    <div className="w-full max-w-sm space-y-3">
      <Button size="sm" variant="outline" onClick={() => setLoading((value) => !value)}>
        {loading ? 'Show what loaded' : 'Load again'}
      </Button>
      <SkeletonReveal
        loading={loading}
        skeleton={
          <div className="flex items-center gap-3">
            <SkeletonAvatar size={40} />
            <SkeletonText lines={2} className="flex-1" />
          </div>
        }
      >
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-full bg-surface-raised text-sm font-semibold">AM</div>
          <div>
            <p className="text-sm font-medium">Ana Martins</p>
            <p className="text-xs text-muted-foreground">Ordered 3 items today</p>
          </div>
        </div>
      </SkeletonReveal>
    </div>
  )
}

export function Feedback() {
  return (
    <>
      <PageHeader title="Feedback" description="What a page tells of itself: a state, a result, a wait. Always a word with a colour." />

      <Demo id="alert" title="Alert" description="A message in the page, by tone. Danger and warning are read out at once." names={['Alert', 'AlertTitle', 'AlertDescription']} className="flex flex-col items-stretch gap-3">
        <Alert tone="info">
          <AlertDescription>Prices are updated every night at 02:00.</AlertDescription>
        </Alert>
        <Alert tone="success">
          <AlertTitle>Import finished</AlertTitle>
          <AlertDescription>1,204 products, 12 new.</AlertDescription>
        </Alert>
        <Alert tone="warning" action={<Button size="sm" variant="outline">Review</Button>}>
          <AlertTitle>Three orders wait for a review</AlertTitle>
          <AlertDescription>They are held until someone looks at them.</AlertDescription>
        </Alert>
        <Alert tone="danger" dismissible>
          <AlertTitle>Could not load</AlertTitle>
          <AlertDescription>The server answered 503. The page tries again in a minute.</AlertDescription>
        </Alert>
      </Demo>

      <Demo id="badge" title="Badge" description="A short state: soft, solid or outline; a dot for what is live." names={['Badge']}>
        <Badge>Draft</Badge>
        <Badge tone="success" dot>
          Paid
        </Badge>
        <Badge tone="warning" dot pulse>
          Syncing
        </Badge>
        <Badge tone="danger" variant="solid">
          Overdue
        </Badge>
        <Badge variant="outline">Long</Badge>
        <Badge onRemove={() => {}}>Filter: open</Badge>
      </Demo>

      <Demo id="status" title="StatusBadge" description="The state of something running, as a health check reports it: always a word beside the colour." names={['StatusBadge']}>
        <StatusBadge status="ok" />
        <StatusBadge status="warning" />
        <StatusBadge status="down" />
        <StatusBadge status="unknown" />
        <StatusBadge status="disabled" />
      </Demo>

      <Demo id="toasts" title="Toasts" description="One at a time, at the bottom centre, each for its whole time: an error stays 8 s; when others wait, the one shown moves along faster." names={['ToastProvider', 'useToast', 'VelocityToast']}>
        <Toasts />
      </Demo>

      <Demo id="undo" title="UndoToast" description="A removal with an Undo instead of a question: nothing is sent before the time runs out, and a pause stops the clock." names={['UndoToast']}>
        <Undo />
      </Demo>

      <Demo id="request" title="RequestStatus" description="Follows something asked to its outcome: asked, sent, done, refused, or no news. It watches, and acts on nothing." names={['RequestStatus']}>
        <Request />
      </Demo>

      <Demo id="loader" title="Loader" description="A wait without a known end, named for screen readers." names={['Loader']}>
        <Loader label="Loading" />
        <Loader variant="dots" label="Loading" />
        <Loader variant="line" label="Loading" />
        <Loader variant="rings" label="Loading" />
      </Demo>

      <Demo
        id="progress"
        title="ProgressBar"
        description="How far a piece of work has come, in words beside the bar and for a screen reader; in a tone when it goes wrong. Its length unknown, the fill breathes. A ratio against a limit is a Meter."
        names={['ProgressBar']}
        className="grid w-full max-w-md gap-4"
      >
        <ProgressBar label="Importing the files" value={42} max={120} valueText="42 of 120 files" />
        <ProgressBar label="Computing the run" value={0.8} max={1} />
        <ProgressBar label="Retrying the upload" value={3} max={5} valueText="Attempt 3 of 5" tone="warning" size="sm" />
        <ProgressBar label="Connecting to the server" />
      </Demo>

      <Demo id="skeleton" title="Skeleton" description="The shape of what is coming, as high as it will be: nothing jumps when it arrives." names={['Skeleton', 'SkeletonText', 'SkeletonAvatar', 'SkeletonReveal']} className="flex flex-col items-stretch gap-4">
        <Skeleton className="h-[7.5rem] w-full max-w-xs rounded-2xl" />
        <Reveal />
      </Demo>

      <Demo id="checks" title="CheckList" description="Checks and what each found: passed, failed and open told apart by an icon, named for screen readers." names={['CheckList', 'CheckIcon']}>
        <CheckList checks={CHECKS} label="Before releasing" className="sm:grid-cols-3" />
      </Demo>
    </>
  )
}
