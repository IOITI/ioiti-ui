import { cn, Panel } from 'ioiti-ui'
import type { ReactNode } from 'react'

interface DemoProps {
  /** The anchor a link can lead to (`#buttons`). */
  id: string
  title: string
  /** When to use it, and what it does for the reader. */
  description?: ReactNode
  /** What it shows of the package, as an application imports it (the gallery's test reads these). */
  names: string[]
  /** The entry it is imported from. */
  from?: 'ioiti-ui' | 'ioiti-ui/react-router'
  /** The classes of the demo's own frame (a column, a grid). */
  className?: string
  children: ReactNode
}

/** A part of the package at work, with the line that imports it. */
export function Demo({ id, title, description, names, from = 'ioiti-ui', className, children }: DemoProps) {
  return (
    <Panel id={id} title={title} description={description}>
      <div data-names={names.join(' ')} className={cn('flex flex-wrap items-center gap-3', className)}>
        {children}
      </div>
      <pre className="mt-5 overflow-x-auto rounded-lg border border-border/60 bg-surface-raised/30 px-3 py-2 font-mono text-[11px] text-muted-foreground">
        {`import { ${names.join(', ')} } from '${from}'`}
      </pre>
    </Panel>
  )
}

/** A rule of the design, in a sentence. */
export function Rule({ title, children }: { title: string; children: ReactNode }) {
  return (
    <li className="space-y-1">
      <p className="text-sm font-medium">{title}</p>
      <p className="text-sm text-muted-foreground">{children}</p>
    </li>
  )
}

/** Code to copy, as written in an application. */
export function Code({ children }: { children: string }) {
  return (
    <pre className="w-full overflow-x-auto rounded-lg border border-border/60 bg-surface-raised/30 p-3 font-mono text-xs leading-relaxed">
      {children}
    </pre>
  )
}
