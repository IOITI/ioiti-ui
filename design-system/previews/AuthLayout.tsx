import {
  Alert,
  AlertDescription,
  AlertTitle,
  AuthLayout,
  Button,
  Form,
  FormControl,
  FormItem,
  FormLabel,
  Input,
  SignInProviders,
  ThemeProvider,
  ToastProvider,
  useTheme,
  useToast,
} from 'ioiti-ui'
import type { SignInProvider } from 'ioiti-ui'
import { GitBranch } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { createRoot } from 'react-dom/client'

// The frame gives its theme as data-theme on <html>. The theme's context comes from ThemeProvider alone, which
// writes the theme on <html> from what the browser keeps: the frame's look is kept for it first, so that it starts
// on the frame's, and a press changes the frame as it changes a page (data-theme with it, which the tokens follow).
const KEY = 'ioiti-ui-preview.AuthLayout'
const root = document.documentElement
const frameTheme = () => (root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light')

/** Keeps the frame's look for the provider: true where it will start on it (the browser keeps things). */
function keepFrameLook(): boolean {
  try {
    localStorage.setItem(KEY, frameTheme())
    localStorage.removeItem(`${KEY}.accent`)
    localStorage.removeItem(`${KEY}.material`)
    return localStorage.getItem(KEY) === frameTheme()
  } catch {
    return false
  }
}

function FrameTheme({ children }: { children: ReactNode }) {
  const [start, setStart] = useState(() => ({ round: 0, kept: keepFrameLook() }))
  const own = useRef<string | null>(null)
  // The frame changes its theme: the provider starts again on it.
  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (root.getAttribute('data-theme') === own.current) {
        own.current = null
        return
      }
      const kept = keepFrameLook()
      setStart((before) => ({ round: before.round + 1, kept }))
    })
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [])
  // Nothing kept: the provider would follow the system, maybe not the frame. The context's default, then.
  if (!start.kept) return <>{children}</>
  return (
    <ThemeProvider key={start.round} storageKey={KEY}>
      <FrameFollows own={own} />
      {children}
    </ThemeProvider>
  )
}

/** The theme shown, said on <html> as the frame says it. */
function FrameFollows({ own }: { own: { current: string | null } }) {
  const { theme } = useTheme()
  useLayoutEffect(() => {
    if (root.getAttribute('data-theme') === theme) return
    own.current = theme
    root.setAttribute('data-theme', theme)
  }, [theme, own])
  return null
}

/**
 * A sign-in page, outside the shell: a password, or single sign-on through Gitea. It checks nothing here. The frame
 * has no server: Gitea's button comes back at once, as with an account the application does not know.
 */
function SignIn() {
  const toast = useToast()
  const [notLinked, setNotLinked] = useState(false)
  // What is on its way: Gitea, or the password ("password"), which every provider waits for.
  const [pending, setPending] = useState<string | null>(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const sending = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(sending.current), [])
  const providers: SignInProvider[] = [{ id: 'gitea', label: 'Sign in with Gitea', href: '#gitea', icon: <GitBranch className="size-4" /> }]

  const onPendingChange = (id: string | null) => {
    setPending(id)
    if (id !== 'gitea') return
    sending.current = window.setTimeout(() => {
      setPending(null)
      setNotLinked(true)
    }, 1500)
  }
  const signIn = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPending('password')
    sending.current = window.setTimeout(() => {
      setPending(null)
      toast({ title: 'Signed in', description: 'Nothing is checked here: an application goes to its first page.' })
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
        notLinked && (
          <Alert tone="warning">
            <AlertTitle>This Gitea account is not linked to an account here</AlertTitle>
            <AlertDescription>Sign in with your password, then link Gitea from your profile.</AlertDescription>
          </Alert>
        )
      }
      footer={<p>Need an account? Ask an administrator.</p>}
    >
      <SignInProviders providers={providers} pending={pending} onPendingChange={onPendingChange}>
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

createRoot(document.getElementById('root')!).render(
  <FrameTheme>
    <ToastProvider>
      <SignIn />
    </ToastProvider>
  </FrameTheme>,
)
