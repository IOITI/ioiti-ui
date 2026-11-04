import { Lock } from 'lucide-react'
import type { ReactNode } from 'react'

import { ThemeToggle } from '../components/ThemeToggle.js'
import { useTabTitle } from './page-trail-context.js'

interface AuthLayoutProps {
  /** The heading: the application's name. */
  title: string
  /** What signing in asks for. */
  description?: ReactNode
  /**
   * The application's mark, above the heading in place of the tile and its icon. The heading names the
   * application: a picture that says the name again says nothing more (`alt=""`).
   */
  logo?: ReactNode
  /** In the tile above the heading: a lock by default. Not drawn with a `logo`. */
  icon?: ReactNode
  /**
   * Above the form: what the last attempt came to, or what to do first, as an `Alert` ("This Gitea account is
   * not linked to an account here: sign in with your password, then link it from your profile").
   */
  notice?: ReactNode
  /** Under the form, apart from it at the foot of the card: help, a way further ("Need an account? Ask an administrator."). */
  footer?: ReactNode
  /** The theme can be chosen before signing in: this page is the first one seen. */
  themeToggle?: boolean
  /** The tab's title; the heading by default. */
  tabTitle?: string
  /** The form. */
  children: ReactNode
}

/**
 * The page of a sign-in, outside the shell: one card in the middle of the screen. The application's mark (or a
 * lock) above its name, a notice above the form, help at the card's foot.
 */
export function AuthLayout({ title, description, logo, icon, notice, footer, themeToggle = true, tabTitle, children }: AuthLayoutProps) {
  useTabTitle(tabTitle ?? title)
  return (
    <main className="relative grid min-h-dvh place-items-center p-6">
      {themeToggle && <ThemeToggle className="absolute right-4 top-4" />}
      <div className="w-full max-w-sm rounded-2xl border border-border/70 bg-surface/50 p-8 shadow-elevated dark:bg-surface/25 glass-card">
        <div className="mb-6 flex flex-col gap-1.5">
          {logo ? (
            <div className="mb-3 flex">{logo}</div>
          ) : (
            <div className="mb-3 grid size-10 place-items-center rounded-xl border border-border bg-surface-raised">
              {icon ?? <Lock className="size-4 text-foreground" aria-hidden />}
            </div>
          )}
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        {/* Gone with its notice: an Alert dismissed leaves no room above the form. */}
        {notice && <div className="mb-5 empty:hidden">{notice}</div>}
        {children}
        {footer && <div className="mt-6 border-t border-border/70 pt-5 text-sm text-muted-foreground">{footer}</div>}
      </div>
    </main>
  )
}
