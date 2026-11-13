import { Button, Form, FormControl, FormItem, FormLabel, Input, SignInProviders } from 'ioiti-ui'
import type { SignInProvider } from 'ioiti-ui'
import { GitBranch } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { createRoot } from 'react-dom/client'

const PROVIDERS: SignInProvider[] = [{ id: 'gitea', label: 'Sign in with Gitea', href: '#gitea', icon: <GitBranch className="size-4" /> }]

/** The providers beside the form of a password; `pending` given, it stays on its way. */
function SignIn({ caption, stuck }: { caption: string; stuck?: string }) {
  // What is on its way: Gitea, or the password ("password"), which every provider waits for.
  const [pending, setPending] = useState<string | null>(stuck ?? null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const sending = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(sending.current), [])
  // The frame has no server: whatever was on its way comes back after a moment.
  const wait = (id: string | null) => {
    if (stuck) return
    setPending(id)
    if (id !== null) sending.current = window.setTimeout(() => setPending(null), 1500)
  }
  const signIn = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    wait('password')
  }
  const id = stuck ? 'busy' : 'rest'
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-muted-foreground">{caption}</p>
      <SignInProviders providers={PROVIDERS} pending={pending} onPendingChange={wait}>
        <Form onSubmit={signIn}>
          <FormItem>
            <FormLabel htmlFor={`${id}-username`}>Username</FormLabel>
            <FormControl>
              <Input
                id={`${id}-username`}
                autoComplete="username"
                value={username}
                disabled={pending !== null}
                onChange={(event) => setUsername(event.target.value)}
              />
            </FormControl>
          </FormItem>
          <FormItem>
            <FormLabel htmlFor={`${id}-password`}>Password</FormLabel>
            <FormControl>
              <Input
                id={`${id}-password`}
                type="password"
                autoComplete="current-password"
                showPasswordToggle
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
  )
}

createRoot(document.getElementById('root')!).render(
  <div className="grid gap-10 p-5 sm:grid-cols-2">
    <SignIn caption="Single sign-on beside the form of a password" />
    <SignIn caption="On its way to Gitea: the others wait until the browser has left" stuck="gitea" />
  </div>,
)
