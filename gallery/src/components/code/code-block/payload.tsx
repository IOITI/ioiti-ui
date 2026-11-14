import { CodeBlock } from 'ioiti-ui'

const ORDER = `{
  "id": "IT-1042",
  "customer": "Atelier Brun",
  "status": "paid",
  "total": 1840,
  "lines": 4,
  "gift": false
}`

export default function CodeBlockPayload() {
  return <CodeBlock label="Order IT-1042, as the server sent it" language="json" lineNumbers highlightLines={[4]} code={ORDER} />
}
