import { Button, ButtonLink, EmptyState, EmptyText, ErrorText, Panel } from 'ioiti-ui'
import { FileCode, Plus } from 'lucide-react'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <div className="grid gap-4 p-5 md:grid-cols-[3fr_2fr]">
    <EmptyState
      headingLevel={3}
      icon={<FileCode />}
      title="No detection rule yet"
      description="Rules pushed to the repository appear here, with what they detect and where they run."
      actions={
        <>
          <ButtonLink to="#write" leftIcon={<Plus className="size-4" />}>Write a rule</ButtonLink>
          <Button variant="outline">Import from Sigma</Button>
        </>
      }
    />
    <div className="flex flex-col gap-4">
      <Panel title="Runs" description="The last runs of the rule.">
        <EmptyText>No run yet: a rule runs once it is deployed.</EmptyText>
      </Panel>
      <div className="space-y-2">
        <Button size="sm" variant="outline">Deploy</Button>
        <ErrorText>Could not deploy: the rule has no query.</ErrorText>
      </div>
    </div>
  </div>,
)
