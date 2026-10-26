import { AuthLayout, Button, ButtonLink, Form, FormControl, FormItem, FormLabel, Input } from 'ioiti-ui'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'

/** A sign-in page, outside the shell: it checks nothing here. */
export function SignInPattern() {
  const [password, setPassword] = useState('')
  return (
    <AuthLayout title="My App" description="Sign in with your password." tabTitle="Sign-in page">
      <div data-names="AuthLayout">
        <Form onSubmit={(event) => event.preventDefault()}>
          <FormItem>
            <FormLabel htmlFor="password">Password</FormLabel>
            <FormControl>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
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
        <ButtonLink to="/components/shell" variant="ghost" size="sm" leftIcon={<ArrowLeft className="size-3.5" />} className="mt-4">
          Back to the gallery
        </ButtonLink>
      </div>
    </AuthLayout>
  )
}
