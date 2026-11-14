import { Button, ButtonLink, EmptyState } from 'ioiti-ui'
import { FileCode, Plus } from 'lucide-react'

export default function EmptyStatePage() {
  return (
    <EmptyState
      // A level under what holds it: 3 here, under this panel's heading.
      headingLevel={3}
      icon={<FileCode />}
      title="No detection rule yet"
      description="Rules pushed to the repository appear here, with what they detect and where they run."
      actions={
        <>
          <ButtonLink to="/components/forms" leftIcon={<Plus className="size-4" />}>
            Write a rule
          </ButtonLink>
          <Button variant="outline">Import from Sigma</Button>
        </>
      }
    />
  )
}
