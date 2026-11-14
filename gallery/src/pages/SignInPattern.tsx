import {
  Alert,
  AlertDescription,
  AlertTitle,
  AuthLayout,
  Button,
  ButtonLink,
  Form,
  FormControl,
  FormItem,
  FormLabel,
  Input,
  SignInProviders,
  useToast,
} from 'ioiti-ui'
import type { SignInProvider } from 'ioiti-ui'
import { ArrowLeft, GitBranch } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useHref, useSearchParams } from 'react-router'

/**
 * A sign-in page, outside the shell: a password, or single sign-on through Gitea. It checks nothing here.
 * `?show=signing-in` shows it on its way to Gitea; `?show=not-linked`, back from Gitea with an account the
 * application does not know.
 */
export function SignInPattern() {
  const toast = useToast()
  const [params] = useSearchParams()
  const shown = params.get('show')
  // In an application, the server's address that sends the browser on to Gitea, which sends it back to the
  // server, then to the page asked for: `/api/v1/auth/oidc/gitea/login?next=/w/main`. The gallery has no server:
  // the page is loaded again at once, as it would come back with an account that is not linked.
  const backFromGitea = useHref('/patterns/sign-in?show=not-linked')
  const providers: SignInProvider[] = [{ id: 'gitea', label: 'Sign in with Gitea', href: backFromGitea, icon: <GitBranch className="size-4" /> }]

  // What is on its way: Gitea, or the password ("password"), which every provider waits for.
  const [pending, setPending] = useState<string | null>(shown === 'signing-in' ? 'gitea' : null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const sending = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(sending.current), [])

  const signIn = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPending('password')
    sending.current = window.setTimeout(() => {
      setPending(null)
      toast({ title: 'Signed in', description: 'The gallery checks nothing: an application goes to its first page here.' })
    }, 1200)
  }

  return (
    <AuthLayout
      title="My App"
      description="Sign in with Gitea, or with your password."
      tabTitle="Sign-in page"
      logo={
        <span
          aria-hidden
          className="grid size-10 place-items-center rounded-xl bg-foreground text-base font-bold text-background accent:bg-brand accent:bg-(image:--brand-fill) accent:text-brand-fill-foreground"
        >
          M
        </span>
      }
      notice={
        shown === 'not-linked' && (
          <Alert tone="warning">
            <AlertTitle>This Gitea account is not linked to an account here</AlertTitle>
            <AlertDescription>Sign in with your password, then link Gitea from your profile.</AlertDescription>
          </Alert>
        )
      }
      footer={
        <div className="flex flex-col items-start gap-3">
          <p>Need an account? Ask an administrator.</p>
          <ButtonLink to="/components/shell/auth-layout" variant="ghost" size="sm" leftIcon={<ArrowLeft className="size-3.5" />} className="-ml-3">
            Back to the gallery
          </ButtonLink>
        </div>
      }
    >
      <SignInProviders providers={providers} pending={pending} onPendingChange={setPending}>
        <Form onSubmit={signIn}>
          <FormItem>
            <FormLabel htmlFor="username">Username</FormLabel>
            <FormControl>
              <Input
                id="username"
                autoComplete="username"
                value={username}
                disabled={pending !== null}
                onChange={(event) => setUsername(event.target.value)}
              />
            </FormControl>
          </FormItem>
          <FormItem>
            <FormLabel htmlFor="password">Password</FormLabel>
            <FormControl>
              <Input
                id="password"
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
    </AuthLayout>
  )
}
