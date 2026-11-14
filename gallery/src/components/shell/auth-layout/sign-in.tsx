import { AuthLayout, Button, ButtonLink, Form, FormControl, FormItem, FormLabel, Input, useToast } from 'ioiti-ui'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'

export default function AuthLayoutSignIn() {
  const toast = useToast()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [sending, setSending] = useState(false)
  const signIn = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSending(true)
    window.setTimeout(() => {
      setSending(false)
      toast({ title: 'Signed in', description: 'An application goes to the page asked for.' })
    }, 1000)
  }
  return (
    // In a box of this page: an application gives it the whole screen, where it centres its card.
    <div className="h-[38rem] overflow-y-auto rounded-xl border border-border">
      <AuthLayout
        className="min-h-full"
        title="My App"
        description="Sign in with your username and password."
        logo={
          <span
            aria-hidden
            className="grid size-10 place-items-center rounded-xl bg-foreground text-base font-bold text-background accent:bg-brand accent:bg-(image:--brand-fill) accent:text-brand-fill-foreground"
          >
            M
          </span>
        }
        footer={
          <div className="flex flex-col items-start gap-2">
            <p>Need an account? Ask an administrator.</p>
            <ButtonLink to="/patterns/sign-in" variant="link" rightIcon={<ArrowRight />}>
              The whole page
            </ButtonLink>
          </div>
        }
      >
        <Form onSubmit={signIn}>
          <FormItem>
            <FormLabel htmlFor="auth-username">Username</FormLabel>
            <FormControl>
              <Input id="auth-username" autoComplete="username" value={username} disabled={sending} onChange={(event) => setUsername(event.target.value)} />
            </FormControl>
          </FormItem>
          <FormItem>
            <FormLabel htmlFor="auth-password">Password</FormLabel>
            <FormControl>
              <Input
                id="auth-password"
                type="password"
                autoComplete="current-password"
                showPasswordToggle
                value={password}
                disabled={sending}
                onChange={(event) => setPassword(event.target.value)}
              />
            </FormControl>
          </FormItem>
          <Button type="submit" fullWidth isLoading={sending} loadingText="Signing in" disabled={sending || !username || !password}>
            Sign in
          </Button>
        </Form>
      </AuthLayout>
    </div>
  )
}
