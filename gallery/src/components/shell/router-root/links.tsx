import { RouterLink } from 'ioiti-ui/react-router'

// RouterRoot gives it to every component (LinkProvider): TextLink, ButtonLink, the sidebar, the trail draw it.
const LOOK = 'underline underline-offset-2 accent:text-brand-text'

export default function RouterRootLinks() {
  return (
    <ul className="flex flex-col gap-2 text-sm">
      <li>
        <RouterLink href="/components/shell/app-shell" className={LOOK}>
          AppShell
        </RouterLink>
        <span className="text-muted-foreground">: another page, through the router; with ⌘ or Ctrl, in another tab.</span>
      </li>
      <li>
        <RouterLink href="#guidelines" className={LOOK}>
          Its guidelines
        </RouterLink>
        <span className="text-muted-foreground">: a part of this page, a plain link the browser follows in place, the query kept.</span>
      </li>
    </ul>
  )
}
