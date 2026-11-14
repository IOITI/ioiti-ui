import { Alert, AlertDescription, AlertTitle, AuthLayout, Button, ButtonLink, Form, FormControl, FormItem, FormLabel, Input } from 'ioiti-ui'
import { useState } from 'react'
import type { FormEvent } from 'react'

export default function AuthLayoutNotice() {
  const [ended, setEnded] = useState(true)
  const [password, setPassword] = useState('')
  const signIn = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setEnded(false)
    setPassword('')
  }
  return (
    <div className="flex flex-col gap-3">
      <div className="h-[34rem] overflow-y-auto rounded-xl border border-border [&>main]:min-h-full">
        <AuthLayout
          title="Invoicing"
          description="Your password, to go on as Léa Brun."
          themeToggle={false}
          notice={
            ended && (
              <Alert tone="warning" dismissible onDismiss={() => setEnded(false)}>
                <AlertTitle>Your session ended</AlertTitle>
                <AlertDescription>After an hour without use. Sign in again to go on where you were.</AlertDescription>
              </Alert>
            )
          }
          footer="Not Léa Brun? Sign out first."
        >
          <Form onSubmit={signIn}>
            <FormItem>
              <FormLabel htmlFor="notice-password">Password</FormLabel>
              <FormControl>
                <Input
                  id="notice-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </FormControl>
            </FormItem>
            <Button type="submit" fullWidth disabled={!password}>
              Sign in again
            </Button>
          </Form>
        </AuthLayout>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <ButtonLink to="/patterns/sign-in?show=signing-in" size="sm" variant="outline">
          On its way to Gitea
        </ButtonLink>
        <ButtonLink to="/patterns/sign-in?show=not-linked" size="sm" variant="outline">
          Back with an account not linked
        </ButtonLink>
      </div>
    </div>
  )
}
