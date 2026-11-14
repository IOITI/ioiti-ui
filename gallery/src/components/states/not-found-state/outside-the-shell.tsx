import { ButtonLink, NotFound } from 'ioiti-ui'
import { House } from 'lucide-react'

export default function NotFoundStateOutsideTheShell() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border">
      {/* The page under both, for a 404 outside the shell: a shared link, a page of its own. */}
      <NotFound
        focusOnMount={false}
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
  )
}
