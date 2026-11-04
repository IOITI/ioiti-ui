import { AuthLayout, Button, Form, FormControl, FormItem, FormLabel, Input, SignInProviders } from 'ioiti-ui'
import type { SignInProvider } from 'ioiti-ui'
import { KeyRound } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router'

// Single sign-on: your server's address that sends the browser on to the identity provider (a placeholder here).
// Its page is loaded from the server, not through the router. None: the password alone.
const PROVIDERS: SignInProvider[] = [
  { id: 'sso', label: 'Sign in with SSO', href: '/api/auth/sso/login', icon: <KeyRound className="size-4" /> },
]

/** A sign-in page outside the shell. It checks nothing: put the application's own sign-in here. */
export function LoginPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')

  const signIn = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void navigate('/')
  }

  return (
    <AuthLayout title="My App" description="Sign in with single sign-on, or with your password." tabTitle="Sign in">
      <SignInProviders providers={PROVIDERS}>
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
      </SignInProviders>
    </AuthLayout>
  )
}
