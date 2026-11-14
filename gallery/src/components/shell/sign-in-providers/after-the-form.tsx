import { Button, Form, FormControl, FormItem, FormLabel, Input, SignInProviders } from 'ioiti-ui'
import type { SignInProvider } from 'ioiti-ui'
import { Building2, CreditCard, GitBranch } from 'lucide-react'
import { useState } from 'react'

// Here parts of this page, so that the browser stays: an application's are the server's addresses.
const PROVIDERS: SignInProvider[] = [
  { id: 'company', label: 'Company account', href: '#company', icon: <Building2 className="size-4" /> },
  { id: 'gitea', label: 'Gitea', href: '#gitea', icon: <GitBranch className="size-4" /> },
  {
    id: 'card',
    label: 'Smart card',
    href: '#card',
    icon: <CreditCard className="size-4" />,
    disabled: true,
    hint: 'No card reader on this computer: ask the help desk for one.',
  },
]

export default function SignInProvidersAfterTheForm() {
  // Drawn afresh by Start again: which one is on its way is left to it here (a plain click marks it).
  const [round, setRound] = useState(0)
  return (
    <div className="flex flex-col items-start gap-3">
      <SignInProviders key={round} className="w-full max-w-sm" providers={PROVIDERS} placement="after" divider="or continue with">
        <Form onSubmit={(event) => event.preventDefault()}>
          <FormItem>
            <FormLabel htmlFor="after-email">Email</FormLabel>
            <FormControl>
              <Input id="after-email" type="email" autoComplete="email" />
            </FormControl>
          </FormItem>
          <Button type="submit" fullWidth>
            Send me a sign-in link
          </Button>
        </Form>
      </SignInProviders>
      <Button variant="ghost" size="xs" onClick={() => setRound((was) => was + 1)}>
        Start again
      </Button>
    </div>
  )
}
