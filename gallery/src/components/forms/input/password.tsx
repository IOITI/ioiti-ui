import { Field, Input } from 'ioiti-ui'
import { useState } from 'react'

export default function InputPassword() {
  const [password, setPassword] = useState('')
  const [again, setAgain] = useState('')
  const short = password.length > 0 && password.length < 12
  const different = again.length > 0 && again !== password
  return (
    <div className="grid w-full max-w-md gap-4">
      <Field
        label="New password"
        description={password ? `${password.length} characters${short ? ': twelve at least' : ''}` : 'Twelve characters at least'}
      >
        <Input
          type="password"
          autoComplete="new-password"
          showPasswordToggle
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={short}
        />
      </Field>
      <Field label="The same again" error={different ? 'The two passwords differ' : undefined}>
        <Input
          type="password"
          autoComplete="new-password"
          showPasswordToggle
          value={again}
          onChange={(event) => setAgain(event.target.value)}
        />
      </Field>
    </div>
  )
}
