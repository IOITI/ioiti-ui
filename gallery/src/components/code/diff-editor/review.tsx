import { Button } from 'ioiti-ui'
import { DiffEditor } from 'ioiti-ui/code'
import { Check, MessageSquare } from 'lucide-react'
import { useState } from 'react'

import { ENVIRONMENTS } from '../../../samples/code'

const PROPOSED = ENVIRONMENTS.replace('production: analyst', 'production: maintainer').replace(
  '  production needs a maintainer.',
  '  production has its maintainer since 28 October.',
)

export default function DiffEditorReview() {
  const [answer, setAnswer] = useState<string | null>(null)
  return (
    <div className="flex w-full flex-col gap-3">
      <DiffEditor
        label="Change to customer 1024"
        language="yaml"
        original={ENVIRONMENTS}
        modified={PROPOSED}
        readOnly
        layout="unified"
        originalLabel="Now"
        modifiedLabel="Proposed"
        actions={
          <>
            <Button size="xs" variant="ghost" leftIcon={<MessageSquare />} onClick={() => setAnswer('Changes asked for')}>
              Ask for changes
            </Button>
            <Button size="xs" leftIcon={<Check />} onClick={() => setAnswer('Approved')}>
              Approve
            </Button>
          </>
        }
      />
      <span className="text-xs text-muted-foreground">{answer ?? 'Read the change, then approve it or ask for changes.'}</span>
    </div>
  )
}
