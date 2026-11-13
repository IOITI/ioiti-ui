# SignInProviders

Single sign-on beside the form of a password: a button the whole width for each provider, a plain link to the server's address for it, which sends the browser on to the provider.

**You provide** `providers` (`[{ id, label, href, icon, disabled, hint }]`), the form as `children`; `placement` (`before` · `after` the form), `divider` (`or`; `''` for a line without words, `null` for none), `pending` with `onPendingChange` (the id on its way), `variant` (`outline` by default), `label` (`Single sign-on`).

```tsx
<SignInProviders
  providers={[{ id: 'gitea', label: 'Sign in with Gitea', icon: <GitBranch className="size-4" />,
    href: '/api/v1/auth/oidc/gitea/login?next=/w/main' }]}
  pending={pending} onPendingChange={setPending}>
  <Form onSubmit={signIn}>…</Form>
</SignInProviders>
```

- Its address is loaded from the server, never through the router: the server sends the browser on to the provider and takes it back.
- Chosen, its button is busy (a spinner, `aria-busy`) and the others are disabled until the browser has left; back from the browser's history they are as they were. A click with ⌘ or Ctrl, for another tab, marks nothing.
- While a password is sent, give `pending` the form's own id so that every provider waits, and disable the fields while anything is pending.
- A provider that cannot be used now is `disabled`, its `hint` saying why.
