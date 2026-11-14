import { CodeBlock } from 'ioiti-ui'

import { RULE_DIFF } from '../../../samples/code'

export default function CodeBlockDiff() {
  return <CodeBlock label="What changed" language="diff" code={RULE_DIFF} />
}
