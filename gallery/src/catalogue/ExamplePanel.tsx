import { CodeBlock, Disclosure, Panel } from 'ioiti-ui'
import type { ReactNode } from 'react'

import type { Example, ExampleInfo } from './types'

interface ExamplePanelProps {
  info: ExampleInfo
  example: Example | undefined
  /** In place of its title: a category's page names the family, linked to its page. */
  title?: ReactNode
  description?: ReactNode
  /** What leads further, in its header (a category's "All 4 examples"). */
  action?: ReactNode
  /** Its source, under it, folded: a category's page leaves it to the family's. */
  code?: boolean
  /** Its anchor; the example's id by default. */
  id?: string
}

/** An example at work, and the file it is (folded under "Code"), which an application can start from. */
export function ExamplePanel({ info, example, title, description, action, code = true, id }: ExamplePanelProps) {
  return (
    <Panel id={id ?? info.id} title={title ?? info.title} description={description ?? info.description} action={action} className="scroll-mt-20">
      <div data-example={info.id} className="min-w-0">
        {example ? <example.Component /> : <p className="text-sm text-negative">No file for this example.</p>}
      </div>
      {code && example && (
        <Disclosure className="mt-5" summary="Code">
          <CodeBlock className="mt-3" language="tsx" code={example.source.trimEnd()} maxHeight={520} />
        </Disclosure>
      )}
    </Panel>
  )
}
