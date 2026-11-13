# AuthLayout

A sign-in page, outside the shell: one card in the middle of the screen, the application's mark above its name, a notice above the form, help at the card's foot, the theme button in its corner.

**You provide** `title` (the application's name), `description` (what signing in asks for), `logo` (its mark, `alt=""`) or `icon` (in the tile, a lock by default), `notice` (an `Alert`: what the last attempt came to), `footer` (help: "Need an account? Ask an administrator."), the form as `children`; `themeToggle` (`true`; `false` for none), `tabTitle` (the heading by default).

```tsx
<AuthLayout title="My App" logo={<img src="/logo.svg" alt="" className="h-10" />}
  notice={error === 'not-linked' && (
    <Alert tone="warning">
      <AlertTitle>This Gitea account is not linked to an account here</AlertTitle>
      <AlertDescription>Sign in with your password, then link Gitea from your profile.</AlertDescription>
    </Alert>
  )}
  footer="Need an account? Ask an administrator.">
  <SignInProviders providers={providers} pending={pending} onPendingChange={setPending}>
    <Form onSubmit={signIn}>…</Form>
  </SignInProviders>
</AuthLayout>
```

- The card is `surface` at 50% (25% on dark), `border` at 70%, `radius-2xl`, `shadow-elevated`; `glass-card` under glass. A notice gone takes no room.
- The theme can be chosen before signing in: this page is the first one seen. It sits inside `IoitiProvider` (the theme's provider), outside `AppShell`.
- Single sign-on goes in `SignInProviders` around the form; the submit is a full-width primary `Button`.
