import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'

import { highlightCode, splitLines } from '../lib/highlight.js'
import type { CodeLanguage, CodeToken, CodeTokenKind } from '../lib/highlight.js'
import { cn } from '../lib/utils.js'
import { CopyButton } from './CopyButton.js'

// The design's code colours (theme.css), each written out whole for Tailwind to find it.
const COLOUR: Record<CodeTokenKind, string> = {
  keyword: 'text-(--code-keyword)',
  string: 'text-(--code-string)',
  number: 'text-(--code-number)',
  comment: 'text-(--code-comment)',
  function: 'text-(--code-function)',
  namespace: 'text-(--code-namespace)',
  type: 'text-(--code-type)',
  builtin: 'text-(--code-builtin)',
  operator: 'text-(--code-operator)',
  plain: '',
}

interface CodeBlockProps {
  code: string
  /** How it is coloured: `text` not at all. */
  language?: CodeLanguage
  /** Another language's tokens, from the code: its own tokeniser. */
  highlight?: (code: string) => CodeToken[]
  /** Above the code: a file's name, what the code is. */
  label?: ReactNode
  /** The lines numbered, from 1 or from the number given. */
  lineNumbers?: boolean | number
  /** Lines to look at, by their number (from 1, or from `lineNumbers`). */
  highlightLines?: number[]
  /** Taller code scrolls inside it. */
  maxHeight?: number | string
  /** Long lines wrapped, rather than scrolled sideways. */
  wrap?: boolean
  /** A button that copies the code. */
  copyable?: boolean
  className?: string
}

/**
 * Code to read and copy: a payload, a configuration, a command. Coloured in the design's code colours
 * (json, js and ts with jsx, css, shell), on a surface every one of them is read on at 4.5:1. As Elastic
 * UI's code block does.
 */
export function CodeBlock({
  code,
  language = 'text',
  highlight,
  label,
  lineNumbers = false,
  highlightLines = [],
  maxHeight,
  wrap = false,
  copyable = true,
  className,
}: CodeBlockProps) {
  const lines = useMemo(() => splitLines(highlight ? highlight(code) : highlightCode(code, language)), [code, language, highlight])
  const first = typeof lineNumbers === 'number' ? lineNumbers : 1
  const numbered = lineNumbers !== false
  const marked = new Set(highlightLines)
  const scroll: CSSProperties | undefined = maxHeight === undefined ? undefined : { maxHeight }
  // Code that overflows is a region the keyboard can scroll; code that fits is no stop for it.
  const pre = useRef<HTMLPreElement>(null)
  const [scrolls, setScrolls] = useState(false)
  useLayoutEffect(() => {
    const element = pre.current
    if (!element) return
    const measure = () => setScrolls(element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight)
    measure()
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [code, wrap, maxHeight])
  const copy = copyable && <CopyButton value={code} label="Copy the code" size="sm" />

  return (
    <figure className={cn('relative min-w-0 overflow-hidden rounded-xl border border-border bg-surface', className)}>
      {label && (
        <figcaption className="flex items-center justify-between gap-3 border-b border-border py-1 pl-3 pr-1.5 text-xs text-text-secondary">
          <span className="truncate">{label}</span>
          {copy}
        </figcaption>
      )}
      {!label && copy && <div className="absolute right-1.5 top-1.5 z-10">{copy}</div>}
      <pre
        ref={pre}
        tabIndex={scrolls ? 0 : undefined}
        role={scrolls ? 'region' : undefined}
        aria-label={scrolls ? (typeof label === 'string' ? label : 'Code') : undefined}
        style={scroll}
        className={cn(
          'overflow-auto py-3 font-mono text-[12.5px] leading-relaxed text-text-primary',
          wrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre',
          !label && copyable && 'pr-10',
        )}
      >
        <code className="block min-w-fit">
          {lines.map((tokens, index) => {
            const number = first + index
            return (
              <span
                key={index}
                className={cn('block px-3', marked.has(number) && 'bg-surface-hover shadow-[inset_2px_0_0_var(--chart-series)]')}
              >
                {numbered && (
                  <span aria-hidden className="mr-4 inline-block w-6 select-none text-right text-text-muted">
                    {number}
                  </span>
                )}
                {/* An empty line keeps its height (each line is a block: a copy of a selection keeps its breaks). */}
                {tokens.length === 0
                  ? '\u200b'
                  : tokens.map((token, at) => (
                      <span key={at} className={COLOUR[token.kind]}>
                        {token.text}
                      </span>
                    ))}
              </span>
            )
          })}
        </code>
      </pre>
    </figure>
  )
}

/** A word of code in a sentence: a name, a value, a key. */
export function Code({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <code className={cn('rounded-md border border-border bg-surface px-1.5 py-0.5 font-mono text-[0.85em] text-text-primary', className)}>
      {children}
    </code>
  )
}
