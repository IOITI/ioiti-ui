import { CodeBlock } from 'ioiti-ui'

import { ENVIRONMENTS, RULE } from '../../../samples/code'

export default function CodeBlockConfiguration() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <CodeBlock label="rules/large_order.toml" language="toml" lineNumbers code={RULE} />
      <CodeBlock label="customers/1024/config.yaml" language="yaml" code={ENVIRONMENTS} />
    </div>
  )
}
