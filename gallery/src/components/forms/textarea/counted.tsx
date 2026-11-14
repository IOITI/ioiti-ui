import { Field, Textarea } from 'ioiti-ui'
import { useState } from 'react'

const LIMIT = 160

export default function TextareaCounted() {
  const [text, setText] = useState('Your order IT-1042 left the warehouse this morning; it should reach you on Thursday.')
  const over = text.length - LIMIT
  return (
    <div className="w-full max-w-lg">
      <Field
        label="Text message to the customer"
        description={`${text.length} of ${LIMIT} characters`}
        error={over > 0 ? `${over} characters too many: a longer message is sent as two` : undefined}
      >
        <Textarea rows={3} value={text} onChange={(event) => setText(event.target.value)} />
      </Field>
    </div>
  )
}
