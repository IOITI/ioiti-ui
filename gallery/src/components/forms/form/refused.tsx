import { Button, Form, FormControl, FormItem, FormLabel, FormMessage, Input } from 'ioiti-ui'
import type { FormEvent } from 'react'
import { useState } from 'react'

export default function FormRefused() {
  const [busy, setBusy] = useState(false)
  const [refused, setRefused] = useState<string | null>(null)

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setBusy(true)
    setRefused(null)
    // The server, answering after a moment: this one refuses every password.
    window.setTimeout(() => {
      setBusy(false)
      setRefused('The address or the password is not right. Try again, or reset the password.')
    }, 900)
  }

  return (
    <Form onSubmit={submit} className="max-w-sm" aria-busy={busy}>
      <FormItem>
        <FormLabel htmlFor="refused-email">Email</FormLabel>
        <FormControl>
          <Input id="refused-email" type="email" autoComplete="username" defaultValue="ana@example.com" />
        </FormControl>
      </FormItem>
      <FormItem>
        <FormLabel htmlFor="refused-password">Password</FormLabel>
        <FormControl>
          <Input id="refused-password" type="password" autoComplete="current-password" showPasswordToggle defaultValue="not the one" />
        </FormControl>
      </FormItem>
      <Button type="submit" fullWidth isLoading={busy} loadingText="Signing in">
        Sign in
      </Button>
      <FormMessage error={refused} />
    </Form>
  )
}
