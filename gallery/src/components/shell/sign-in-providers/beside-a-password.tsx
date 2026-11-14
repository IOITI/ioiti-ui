import { Button, Form, FormControl, FormItem, FormLabel, Input, SignInProviders, useToast } from 'ioiti-ui'
import type { SignInProvider } from 'ioiti-ui'
import { GitBranch } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'

const PROVIDERS: SignInProvider[] = [
  // In an application, the server's address that sends the browser on to the provider and takes it back
  // (`/api/v1/auth/oidc/gitea/login?next=/`). Here a part of this page: the browser stays, the button busy.
  { id: 'gitea', label: 'Sign in with Gitea', href: '#gitea', icon: <GitBranch className="size-4" /> },
]

export default function SignInProvidersBesideAPassword() {
  const toast = useToast()
  // What is on its way: a provider's id, or the form's own ("password"), which every provider waits for.
  const [pending, setPending] = useState<string | null>(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const signIn = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPending('password')
    window.setTimeout(() => {
      setPending(null)
      toast({ title: 'Signed in', description: 'An application goes to the page asked for.' })
    }, 1200)
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="w-full max-w-sm">
        <SignInProviders providers={PROVIDERS} pending={pending} onPendingChange={setPending}>
          <Form onSubmit={signIn}>
            <FormItem>
              <FormLabel htmlFor="sso-username">Username</FormLabel>
              <FormControl>
                <Input id="sso-username" autoComplete="username" value={username} disabled={pending !== null} onChange={(event) => setUsername(event.target.value)} />
              </FormControl>
            </FormItem>
            <FormItem>
              <FormLabel htmlFor="sso-password">Password</FormLabel>
              <FormControl>
                <Input
                  id="sso-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  disabled={pending !== null}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </FormControl>
            </FormItem>
            <Button type="submit" fullWidth isLoading={pending === 'password'} disabled={pending !== null || !username || !password}>
              Sign in
            </Button>
          </Form>
        </SignInProviders>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground" aria-live="polite">
        On its way: <span className="font-mono text-foreground">{pending ?? 'nothing'}</span>
        {pending === 'gitea' && (
          <Button variant="ghost" size="xs" onClick={() => setPending(null)}>
            Start again
          </Button>
        )}
      </div>
    </div>
  )
}
