import { AppBrand, ButtonLink, CodeBlock, Field, NumberInput, PageHeader, SaveBar, SidebarFooterButton, StateChip, useToast } from 'ioiti-ui'
import { RouterLeaveGuard } from 'ioiti-ui/react-router'
import { KeyRound, LogOut, RotateCw } from 'lucide-react'
import { useState } from 'react'

import { Demo } from '../parts'

/** A setting changed and not saved: the bar comes, and leaving the page asks first. */
function Unsaved({ guard = false }: { guard?: boolean }) {
  const toast = useToast()
  const [saved, setSaved] = useState(500)
  const [limit, setLimit] = useState<number | null>(500)
  const [saving, setSaving] = useState(false)
  const dirty = limit !== saved
  return (
    <div className="flex w-full flex-col gap-4">
      <Field label="Daily limit" htmlFor={guard ? 'guarded-limit' : 'unsaved-limit'} className="max-w-xs">
        <NumberInput id={guard ? 'guarded-limit' : 'unsaved-limit'} value={limit} onChange={setLimit} min={0} step={50} suffix="€" />
      </Field>
      {guard && (
        <p className="text-sm text-muted-foreground">
          Change it, then go to <ButtonLink to="/components/forms" variant="link">the forms</ButtonLink>: the page asks first.
        </p>
      )}
      <SaveBar
        open={dirty}
        message="1 unsaved change"
        saving={saving}
        onDiscard={() => setLimit(saved)}
        onSave={() => {
          setSaving(true)
          window.setTimeout(() => {
            setSaved(limit ?? 0)
            setSaving(false)
            toast({ title: 'Saved', variant: 'success' })
          }, 700)
        }}
      />
      {guard && <RouterLeaveGuard when={dirty} />}
    </div>
  )
}

export function Shell() {
  return (
    <>
      <PageHeader
        title="Shell"
        description="The frame of every page: the one around this text. The sidebar lists the menu, the top bar says where the page is, the page scrolls on its own."
      />

      <Demo
        id="app-shell"
        title="AppShell"
        description="Given the menu and the address of the page, it draws the sidebar (beside the page from 768 px up, a drawer below it; ⌘B folds it), the top bar with the trail, and the page in a column of 80rem at most. Its ends are the application's: the brand, a sidebar footer, chips and buttons in the top bar."
        names={['AppShell', 'Sidebar', 'SidebarTrigger', 'PageTrailProvider', 'TopBarTrail', 'useMainScroll']}
        className="flex flex-col items-stretch gap-3"
      >
        <CodeBlock language="tsx" code={`const MENU: Menu = {
  sections: ['Work', 'Settings'],
  entries: [
    { id: 'home', path: '/', label: 'Dashboard', section: 'Work', icon: <LayoutDashboard /> },
    { id: 'orders', path: '/orders', label: 'Orders', section: 'Work', icon: <Receipt /> },
    { id: 'settings', path: '/settings', label: 'Settings', section: 'Settings', icon: <Settings /> },
  ],
}

<AppShell menu={MENU} pathname={location.pathname} appDetail="v1.2.0"
  sidebarFooter={<SidebarFooterButton icon={<LogOut />} label="Sign out" onClick={signOut} />}
  topBarChips={needsRestart && <StateChip … />}
  topBarEnd={<><SearchButton /><ThemeToggle /></>}>
  {page}
</AppShell>`} />
        <p className="text-sm text-muted-foreground">
          A page deeper than the menu (/orders/42) stands under the entry its address starts with; its PageHeader gives
          the trail its name, and the pages between (parents).
        </p>
      </Demo>

      <Demo
        id="page-header"
        title="PageHeader"
        description="The title of a page and what it does, with its actions on the right. It names the tab and ends the trail of the top bar. One a page: this page's own heading is one."
        names={['PageHeader', 'usePageName', 'useTabTitle']}
        className="flex flex-col items-stretch gap-3"
      >
        <CodeBlock language="tsx" code={`<PageHeader
  title="Invoice 2026-0042"
  description="Sent to Acme on 12 Oct."
  parents={[{ label: 'October', href: '/invoices?month=10' }]}
  actions={<ButtonLink to="/invoices/2026-0042.pdf" size="sm">Download</ButtonLink>}
/>`} />
      </Demo>

      <Demo
        id="brand"
        title="The sidebar's ends"
        description="The application's name and its mark at the top (the mark alone once folded); an action at the foot, its icon alone once folded."
        names={['AppBrand', 'SidebarFooterButton']}
      >
        <div className="w-62 space-y-3 rounded-xl border border-border bg-white p-3 dark:bg-neutral-950 glass-bar">
          <AppBrand name="My App" detail="v1.2.0" />
          <div className="border-t border-neutral-200 pt-2 dark:border-neutral-800">
            <SidebarFooterButton icon={<LogOut />} label="Sign out" />
          </div>
        </div>
      </Demo>

      <Demo
        id="state-chip"
        title="StateChip"
        description="A state the user must not miss, in the top bar of every page while it applies: a link to where it is dealt with. On a narrow screen the icon stays; its words are its name, its meaning its hint."
        names={['StateChip']}
      >
        <StateChip
          to="/foundations/usable-by-all"
          tone="warning"
          icon={<RotateCw className="size-3.5" aria-hidden />}
          label="Restart needed"
          hint="The services run an older configuration."
        />
        <StateChip
          to="/foundations/usable-by-all"
          tone="danger"
          icon={<KeyRound className="size-3.5" aria-hidden />}
          label="Sign in again"
          hint="The connection to the bank expired: nothing is sent until it is renewed."
        />
      </Demo>

      <Demo
        id="save-bar"
        title="SaveBar"
        description="The bar of unsaved changes, at the bottom of the page while there are any: what there is to save, Discard and Save. It stays in sight as the page scrolls, and the toasts rise above it."
        names={['SaveBar']}
      >
        <Unsaved />
      </Demo>

      <Demo
        id="leave-guard"
        title="RouterLeaveGuard"
        description="Asks before the page is left with changes not saved: another page of the application (Stay or Leave), or the tab closed (the browser's own question). A change of the query alone is no leaving."
        names={['RouterLeaveGuard']}
        from="ioiti-ui/react-router"
      >
        <Unsaved guard />
      </Demo>

      <Demo
        id="not-found"
        title="A page that is none"
        description="NotFoundPage is the router's catch-all: an address under an entry of the menu suggests that entry. NotFoundState is for a page whose record does not exist (its API answered 404)."
        names={['NotFoundState', 'NotFoundPage', 'NotFound']}
      >
        <ButtonLink to="/components/shell/nothing" size="sm" variant="outline">
          An address that is no page
        </ButtonLink>
        <ButtonLink to="/patterns/not-found" size="sm" variant="outline">
          A record that is not there
        </ButtonLink>
      </Demo>

      <Demo
        id="auth"
        title="AuthLayout"
        description="A sign-in page, outside the shell: one card in the middle of the screen, the theme button in its corner."
        names={['AuthLayout']}
      >
        <ButtonLink to="/patterns/sign-in" size="sm" variant="outline">
          See the sign-in page
        </ButtonLink>
      </Demo>
    </>
  )
}
