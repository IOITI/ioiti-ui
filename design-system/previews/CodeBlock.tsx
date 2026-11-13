import { Code, CodeBlock } from 'ioiti-ui'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <div className="grid w-full gap-4 p-5 md:grid-cols-2">
    <CodeBlock
      label="Order IT-1042, as the server sent it"
      language="json"
      lineNumbers
      highlightLines={[4]}
      code={`{
  "id": "IT-1042",
  "customer": "Atelier Brun",
  "status": "paid",
  "total": 1840,
  "lines": 4,
  "gift": false
}`}
    />
    <div className="flex min-w-0 flex-col gap-4">
      <CodeBlock language="shell" code={'npm install github:IOITI/ioiti-ui#v0.16.0 react react-dom framer-motion\nnpm run dev -- --port 5180'} />
      <CodeBlock
        language="ts"
        label="order.ts"
        code={`export function late(order: Order, now = Date.now()) {
  return order.status === 'open' && now - order.placed > 3 * DAY
}`}
      />
      <p className="text-sm text-muted-foreground">
        Inline, a reference is <Code>IT-1042</Code> and a key <Code>orders.export</Code>.
      </p>
    </div>
  </div>,
)
