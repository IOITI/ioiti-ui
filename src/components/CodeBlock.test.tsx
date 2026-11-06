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

  it('keep every character, in order, in every language', () => {
    const samples: [Parameters<typeof highlightCode>[1], string][] = [
      ['toml', '[rule]\nname = "a # not a comment" # a comment\nrisk = 47\ntags = ["x", \'y\']\n[[rule.threat]]\nnote = """\nline\n"""\n'],
      ['yaml', '---\nkey: value # c\nlist:\n  - &a 1\n  - *a\nblock: |\n  kept\n  as text\nquoted: "x: y"\n'],
      ['diff', 'diff --git a/x b/x\n--- a/x\n+++ b/x\n@@ -1,2 +1,2 @@ ctx\n-old\n+new\n same\n\\ No newline at end of file'],
    ]
    for (const [language, code] of samples) {
      expect(highlightCode(code, language).map((token) => token.text).join(''), language).toBe(code)
    }
  })

  it('read toml: tables, keys, strings, numbers, booleans and comments', () => {
    expect(kinds('[rule]\nname = "Admin" # why\nrisk_score = 47\nenabled = true\n[[rule.threat]]', 'toml')).toEqual([
      'namespace:[rule]',
      'type:name',
      'operator:=',
      'string:"Admin"',
      'comment:# why',
      'type:risk_score',
      'operator:=',
      'number:47',
      'type:enabled',
      'operator:=',
      'keyword:true',
      'namespace:[[rule.threat]]',
    ])
  })

  it('read yaml: keys, values, anchors, comments and a block scalar', () => {
    const tokens = kinds('name: Admin login # why\ncount: 3\nenabled: true\nitems:\n  - &first one\n  - *first\nnote: |\n  any: text\n', 'yaml')
    expect(tokens).toContain('namespace:name')
    expect(tokens).toContain('string:Admin login')
    expect(tokens).toContain('comment:# why')
    expect(tokens).toContain('number:3')
    expect(tokens).toContain('keyword:true')
    expect(tokens).toContain('builtin:&first')
    expect(tokens).toContain('builtin:*first')
    // A block scalar's lines are text, whatever they look like.
    expect(tokens).toContain('string:  any: text')
    expect(tokens).not.toContain('namespace:any')
  })

  it('read a diff: its files, its hunks, what was added and removed', () => {
    const tokens = highlightCode('--- a/rule.toml\n+++ b/rule.toml\n@@ -3 +3 @@ [rule]\n-risk_score = 47\n+risk_score = 73\n context', 'diff')
    expect(tokens.filter((token) => token.text.trim()).map((token) => `${token.kind}:${token.text.trim()}`)).toEqual([
      'keyword:--- a/rule.toml',
      'keyword:+++ b/rule.toml',
      'namespace:@@ -3 +3 @@',
      'plain:[rule]',
      'deleted:-risk_score = 47',
      'inserted:+risk_score = 73',
      'plain:context',
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

  it('marks a diff\'s added and removed lines at their edge, as well as in their tone', () => {
    const { container } = render(<CodeBlock language="diff" code={'@@ -1 +1 @@\n-old\n+new\n same'} copyable={false} />)
    const lines = Array.from(container.querySelectorAll('code > span'))
    expect(lines[1]).toHaveClass('shadow-[inset_2px_0_0_var(--negative)]')
    expect(lines[2]).toHaveClass('shadow-[inset_2px_0_0_var(--positive)]')
    expect(lines[3].className).not.toContain('shadow-')
    expect(screen.getByText('+new')).toHaveClass('text-(--positive)')
  })

  it('scrolls a long line sideways, or wraps it, a word longer than the line breaking too', () => {
    const url = 'https://dac.example.test/api/v1/rta/packages/linux-' + 'a'.repeat(64) + '/download?expires=1&signature=' + 'f'.repeat(64)
    const { container, rerender } = render(<CodeBlock language="shell" code={`curl --fail ${url}`} copyable={false} />)
    expect(container.querySelector('pre')).toHaveClass('whitespace-pre')
    expect(container.querySelector('code')).toHaveClass('min-w-fit')

    rerender(<CodeBlock language="shell" code={`curl --fail ${url}`} copyable={false} wrap />)
    expect(container.querySelector('pre')).toHaveClass('whitespace-pre-wrap', 'wrap-anywhere')
    expect(container.querySelector('pre')).not.toHaveClass('break-words')
    // Not as wide as its longest word, which would push it past its box.
    expect(container.querySelector('code')).not.toHaveClass('min-w-fit')
  })

  it('has an inline form for a sentence', () => {
    render(<Code>useToast</Code>)
    expect(screen.getByText('useToast').tagName).toBe('CODE')
  })
})
