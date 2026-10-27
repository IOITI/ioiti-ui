import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { highlightCode } from '../lib/highlight.js'
import { Code, CodeBlock } from './CodeBlock.js'

const kinds = (code: string, language: Parameters<typeof highlightCode>[1]) =>
  highlightCode(code, language)
    .filter((token) => token.text.trim())
    .map((token) => `${token.kind}:${token.text}`)

describe('the code colours', () => {
  it('read json: its keys, strings, numbers and words', () => {
    expect(kinds('{"id": "IT-1042", "total": 18.4, "paid": true}', 'json')).toEqual([
      'operator:{',
      'namespace:"id"',
      'operator::',
      'string:"IT-1042"',
      'operator:,',
      'namespace:"total"',
      'operator::',
      'number:18.4',
      'operator:,',
      'namespace:"paid"',
      'operator::',
      'keyword:true',
      'operator:}',
    ])
  })

  it('read typescript: keywords, calls, namespaces, types, comments', () => {
    const tokens = kinds("// a total\nexport function total(order: Order) { return Math.round(order.amount * 1.2) }", 'ts')
    expect(tokens).toContain('comment:// a total')
    expect(tokens).toContain('keyword:export')
    expect(tokens).toContain('function:total')
    expect(tokens).toContain('type:Order')
    expect(tokens).toContain('namespace:Math')
    expect(tokens).toContain('builtin:round')
    expect(tokens).toContain('number:1.2')
  })

  it('read a shell: the command, its flags, its variables', () => {
    expect(kinds('npm install --save-dev $PACKAGE # the latest', 'shell')).toEqual([
      'function:npm',
      'plain:install',
      'keyword:--save-dev',
      'namespace:$PACKAGE',
      'comment:# the latest',
    ])
  })

  it('read css: at-rules, properties, custom properties and values', () => {
    const tokens = kinds('@import "ioiti-ui/styles.css";\n.card { color: var(--text-primary); padding: 12px; }', 'css')
    expect(tokens).toContain('keyword:@import')
    expect(tokens).toContain('namespace:color')
    expect(tokens).toContain('function:var')
    expect(tokens).toContain('type:--text-primary')
    expect(tokens).toContain('number:12px')
  })
})

describe('CodeBlock', () => {
  it('shows its code line by line, numbered and marked where asked, with a button that copies it', () => {
    const { container } = render(
      <CodeBlock label="order.json" language="json" lineNumbers highlightLines={[2]} code={'{\n  "id": "IT-1042"\n}'} />,
    )
    expect(screen.getByRole('figure')).toHaveTextContent('order.json')
    expect(screen.getByRole('button', { name: 'Copy the code' })).toBeInTheDocument()
    const lines = Array.from(container.querySelectorAll('code > span'))
    expect(lines).toHaveLength(3)
    expect(lines[1]).toHaveTextContent('2 "id": "IT-1042"')
    expect(lines[1]).toHaveClass('bg-surface-hover')
  })

  it('colours a token in its code colour', () => {
    render(<CodeBlock language="json" code='{"paid": true}' copyable={false} />)
    expect(screen.getByText('true')).toHaveClass('text-(--code-keyword)')
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('has an inline form for a sentence', () => {
    render(<Code>useToast</Code>)
    expect(screen.getByText('useToast').tagName).toBe('CODE')
  })
})
