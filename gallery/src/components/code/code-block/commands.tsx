import { CodeBlock } from 'ioiti-ui'

export default function CodeBlockCommands() {
  return (
    <div className="flex min-w-0 flex-col gap-4">
      <CodeBlock language="shell" code={'npm install github:IOITI/ioiti-ui#v0.3.0 react react-dom framer-motion\nnpm run dev -- --port 5180'} />
      <CodeBlock
        language="shell"
        label="Wrapped: a long link breaks where the line ends"
        wrap
        code={
          "curl --fail --location --output orders.zip 'https://shop.example.com/api/v1/exports/orders-2026-10/download?expires=1793978445&signature=236e0f11c14ab3c8ae6c84fd13f0fef85137ad50c4e2b1d7a9f3e8c6b5d4a3f2'\nunzip -o orders.zip -d orders-2026-10"
        }
      />
      <CodeBlock
        language="ts"
        label="order.ts"
        code={`export function late(order: Order, now = Date.now()) {
  return now - Date.parse(order.promisedAt) > 2 * DAY
}`}
      />
    </div>
  )
}
