import { Lock } from 'lucide-react'
import type { ReactNode } from 'react'

import { ThemeToggle } from '../components/ThemeToggle.js'
import { useTabTitle } from './page-trail-context.js'

interface AuthLayoutProps {
  /** The heading: the application's name. */
  title: string
  /** What signing in asks for. */
  description?: ReactNode
  /** In the tile above the heading: a lock by default. */
  icon?: ReactNode
  /** The theme can be chosen before signing in: this page is the first one seen. */
  themeToggle?: boolean
  /** The tab's title; the heading by default. */
  tabTitle?: string
  /** The form. */
  children: ReactNode
}

/** The page of a sign-in, outside the shell: one card in the middle of the screen. */
export function AuthLayout({ title, description, icon, themeToggle = true, tabTitle, children }: AuthLayoutProps) {
  useTabTitle(tabTitle ?? title)
  return (
    <main className="relative grid min-h-dvh place-items-center p-6">
      {themeToggle && <ThemeToggle className="absolute right-4 top-4" />}
      <div className="w-full max-w-sm rounded-2xl border border-border/70 bg-surface/50 p-8 shadow-elevated dark:bg-surface/25 glass-card">
        <div className="mb-6 flex flex-col gap-1.5">
          <div className="mb-3 grid size-10 place-items-center rounded-xl border border-border bg-surface-raised">
            {icon ?? <Lock className="size-4 text-foreground" aria-hidden />}
          </div>
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        {children}
      </div>
    </main>
  )
}
