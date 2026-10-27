import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { useBlocker } from 'react-router'

import { Button } from '../components/ui/button.js'
import { SettleModal } from '../components/ui/settle-modal.js'

interface RouterLeaveGuardProps {
  /** Whether leaving the page would lose something: changes not saved. */
  when: boolean
  title?: string
  message?: ReactNode
  stayLabel?: string
  leaveLabel?: string
}

interface TextProps {
  title: string
  message: ReactNode
  stayLabel: string
  leaveLabel: string
}

/** Mounted only while there is something to lose: no blocker at rest, which every link would wake. */
function Guard({ title, message, stayLabel, leaveLabel }: TextProps) {
  // Another page only: a change of the query or of the part shown is no leaving.
  const blocker = useBlocker(({ currentLocation, nextLocation }) => currentLocation.pathname !== nextLocation.pathname)
  const blocked = blocker.state === 'blocked'

  // Gone while a page was asked for (saved meanwhile): the page asked for is not left waiting.
  useEffect(
    () => () => {
      if (blocker.state === 'blocked') blocker.reset()
    },
    [blocker],
  )

  return (
    <SettleModal
      open={blocked}
      onClose={() => blocker.reset?.()}
      title={title}
      description={message}
      size="sm"
      footer={
        <>
          <Button variant="destructive" onClick={() => blocker.proceed?.()}>
            {leaveLabel}
          </Button>
          <Button onClick={() => blocker.reset?.()}>{stayLabel}</Button>
        </>
      }
    />
  )
}

/**
 * Asks before the page is left with changes not saved: another page of the application (a dialog, Stay or
 * Leave), or the browser's tab closed or reloaded (the browser's own question). Beside a `SaveBar`, with the
 * same `when`. Needs a data router (`createBrowserRouter`), whose navigations can wait.
 */
export function RouterLeaveGuard({
  when,
  title = 'Leave without saving?',
  message = 'The changes on this page are not saved: leaving it loses them.',
  stayLabel = 'Stay',
  leaveLabel = 'Leave',
}: RouterLeaveGuardProps) {
  useEffect(() => {
    if (!when) return
    const ask = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      // Older browsers ask only when this is set.
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', ask)
    return () => window.removeEventListener('beforeunload', ask)
  }, [when])

  return when ? <Guard title={title} message={message} stayLabel={stayLabel} leaveLabel={leaveLabel} /> : null
}
