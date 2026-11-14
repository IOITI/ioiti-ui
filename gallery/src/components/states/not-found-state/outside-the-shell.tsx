import { Button, ButtonLink, NotFound } from 'ioiti-ui'
import { House } from 'lucide-react'
import { useState } from 'react'

export default function NotFoundStateOutsideTheShell() {
  // A page that is none takes the focus as it opens (its heading, read out at once): shown at a press, here.
  const [shown, setShown] = useState(false)
  return shown ? (
    <div className="overflow-hidden rounded-2xl border border-border">
      {/* The page under both, for a 404 outside the shell: a shared link, a page of its own. */}
      <NotFound
        title="This shared link has expired."
        description="A link to a report lasts 30 days. Ask whoever sent it for a new one."
        path="/shared/r/7f3a9c"
        parallax={false}
        footer="Signed in? Your own reports are on your dashboard."
      >
        <ButtonLink to="/patterns/dashboard" leftIcon={<House className="size-4" />}>
          Go to the dashboard
        </ButtonLink>
      </NotFound>
    </div>
  ) : (
    <Button variant="outline" size="sm" onClick={() => setShown(true)}>
      Show the page of an expired link
    </Button>
  )
}
