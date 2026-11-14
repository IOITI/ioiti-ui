import { Button, SignInProviders } from 'ioiti-ui'
import type { SignInProvider } from 'ioiti-ui'
import { Building2, GitBranch } from 'lucide-react'
import { useState } from 'react'

// Here parts of this page, so that the browser stays: an application's are the server's addresses.
const PROVIDERS: SignInProvider[] = [
  { id: 'company', label: 'Sign in with your company account', href: '#company', icon: <Building2 className="size-4" /> },
  { id: 'gitea', label: 'Sign in with Gitea', href: '#gitea', icon: <GitBranch className="size-4" /> },
]

export default function SignInProvidersAlone() {
  const [pending, setPending] = useState<string | null>(null)
  return (
    <div className="flex flex-col gap-4">
      <SignInProviders className="w-full max-w-sm" providers={PROVIDERS} variant="secondary" pending={pending} onPendingChange={setPending} />
      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground" aria-live="polite">
        On its way: <span className="font-mono text-foreground">{pending ?? 'nothing'}</span>
        {pending && (
          <Button variant="ghost" size="xs" onClick={() => setPending(null)}>
            Start again
          </Button>
        )}
      </div>
    </div>
  )
}
