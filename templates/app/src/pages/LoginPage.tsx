import { AuthLayout, Button, Form, FormControl, FormItem, FormLabel, Input } from 'ioiti-ui'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router'

/** A sign-in page outside the shell. It checks nothing: put the application's own sign-in here. */
export function LoginPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')

  const signIn = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void navigate('/')
  }

  return (
    <AuthLayout title="My App" description="Sign in with your password.">
      <Form onSubmit={signIn}>
        <FormItem>
          <FormLabel htmlFor="password">Password</FormLabel>
          <FormControl>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              autoFocus
              showPasswordToggle
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </FormControl>
        </FormItem>
        <Button type="submit" fullWidth disabled={!password}>
          Sign in
        </Button>
      </Form>
    </AuthLayout>
  )
}
