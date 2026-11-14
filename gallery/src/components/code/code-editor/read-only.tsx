import { CodeEditor } from 'ioiti-ui/code'

const RESPONSE = `{
  "id": "IT-1042",
  "status": "refused",
  "reason": "The card was declined by its bank: the customer is asked to pay with another card, or by transfer, within 48 hours, after which the order is cancelled and its items go back on sale.",
  "retry_after": "2026-10-29T09:30:00+01:00"
}
`

export default function CodeEditorReadOnly() {
  // Read, selected, searched (⌘F) and copied, not changed; its long line wrapped.
  return <CodeEditor label="The payment's answer" language="json" value={RESPONSE} readOnly wrap />
}
