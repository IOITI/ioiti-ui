import { Button, ButtonLink, PageHeader } from 'ioiti-ui'
import { Download, Plus } from 'lucide-react'

export default function PageHeaderActions() {
  return (
    // The page's own column in an application; a box here.
    <div className="rounded-xl border border-border p-4 sm:p-6">
      <PageHeader
        title="Orders"
        description="Every order of the last 90 days, newest first."
        actions={
          <>
            <Button variant="outline" size="sm" leftIcon={<Download />}>
              Export
            </Button>
            <ButtonLink to="/components/forms" size="sm" leftIcon={<Plus />}>
              New order
            </ButtonLink>
          </>
        }
      />
    </div>
  )
}
