import { CodeBlock, Panel, TextLink } from 'ioiti-ui'
import type { ReactNode } from 'react'

import { FAMILIES } from './catalogue/catalogue'

interface DemoProps {
  /** The anchor a link can lead to (`#buttons`). */
  id: string
  title: string
  /** When to use it, and what it does for the reader. */
  description?: ReactNode
  /** What it shows of the package, as an application imports it. */
  names: string[]
  /** The entry it is imported from. */
  from?: 'ioiti-ui' | 'ioiti-ui/react-router' | 'ioiti-ui/code'
  /** The demo's own layout (a column, a grid), in place of a row that wraps. */
  className?: string
  children: ReactNode
}

/**
 * A part of the package at work on a page of the foundations or of the patterns, with the line that imports it,
 * and links to the pages of the components it shows (their examples, guidelines and props).
 */
export function Demo({ id, title, description, names, from = 'ioiti-ui', className, children }: DemoProps) {
  const pages = FAMILIES.filter(({ family }) => names.some((name) => family.names[0] === name))
  return (
    <Panel id={id} title={title} description={description} className="scroll-mt-20">
      <div className={className ?? 'flex flex-wrap items-center gap-3'}>{children}</div>
      <CodeBlock className="mt-5" language="ts" copyable={false} code={`import { ${names.join(', ')} } from '${from}'`} />
      {pages.length > 0 && (
        <p className="mt-3 text-xs text-muted-foreground">
          More of {pages.length === 1 ? 'it' : 'them'}:{' '}
          {pages.map(({ family, path }, index) => (
            <span key={path}>
              {index > 0 ? ', ' : ''}
              <TextLink to={path}>{family.name}</TextLink>
            </span>
          ))}
          .
        </p>
      )}
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
