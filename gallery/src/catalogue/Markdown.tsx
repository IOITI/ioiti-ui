import { cn, Code, CodeBlock, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, TextLink } from 'ioiti-ui'
import type { TextLinkProps } from 'ioiti-ui'
import { ArrowUpRight } from 'lucide-react'
import type { ReactNode } from 'react'

import { guidelinesOf, inline, leaves, plain, type Block, type Inline, type ListItem } from './markdown-blocks'

const LANGUAGES = new Set(['text', 'json', 'js', 'jsx', 'ts', 'tsx', 'css', 'shell', 'toml', 'yaml', 'diff', 'python'])

type LinkVariant = NonNullable<TextLinkProps['variant']>

/**
 * A link of the gallery: to a part of the page or to one of its pages, through its router; to another site, a plain
 * link that the page is left by, an arrow after its words saying so.
 */
export function GalleryLink({ href, variant, children }: { href: string; variant?: LinkVariant; children: ReactNode }) {
  if (!leaves(href)) {
    return (
      <TextLink href={href} variant={variant}>
        {children}
      </TextLink>
    )
  }
  return (
    <TextLink href={href} variant={variant} reloadDocument>
      {children}
      <ArrowUpRight aria-hidden className="ml-0.5 inline-block size-[0.85em] align-[-0.1em] text-muted-foreground" />
    </TextLink>
  )
}

function Parts({ parts, links }: { parts: Inline[]; links?: LinkVariant }) {
  return (
    <>
      {parts.map((part, index) => {
        switch (part.type) {
          case 'code':
            return <Code key={index}>{part.text}</Code>
          case 'strong':
            return (
              <strong key={index} className="font-medium text-foreground">
                <Parts parts={part.parts} links={links} />
              </strong>
            )
          case 'emphasis':
            return (
              <em key={index}>
                <Parts parts={part.parts} links={links} />
              </em>
            )
          case 'link':
            return (
              <GalleryLink key={index} href={part.href} variant={links}>
                <Parts parts={part.parts} links={links} />
              </GalleryLink>
            )
          default:
            return part.text
        }
      })}
    </>
  )
}

/** A line of the docs: its `code`, its **strong** and *emphasised* words, its links (drawn as `links` says, `inline` by default). */
export function InlineMarkdown({ text, links }: { text: string; links?: LinkVariant }) {
  return <Parts parts={inline(text)} links={links} />
}

/** A list's markers, by how deep it is: a disc, a circle under it, a square under that. */
const MARKERS = ['list-disc', 'list-[circle]', 'list-[square]']

function List({ items, depth = 0 }: { items: ListItem[]; depth?: number }) {
  return (
    <ul
      className={cn(
        MARKERS[Math.min(depth, MARKERS.length - 1)],
        'space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground marker:text-muted-foreground',
        depth > 0 && 'mt-2',
      )}
    >
      {items.map((item, index) => (
        <li key={index}>
          <InlineMarkdown text={item.text} />
          {item.items && <List items={item.items} depth={depth + 1} />}
        </li>
      ))}
    </ul>
  )
}

/** A table of the docs, named by the heading it is under (or by its columns, under none). */
function MarkdownTable({ block, label }: { block: Extract<Block, { type: 'table' }>; label?: string }) {
  const numeric = (column: number) => block.align[column] === 'right'
  const centred = (column: number) => (block.align[column] === 'center' ? 'text-center' : undefined)
  return (
    <Table aria-label={label || block.head.map(plain).join(', ')}>
      <TableHead>
        <TableRow>
          {block.head.map((text, column) => (
            <TableHeaderCell key={column} numeric={numeric(column)} className={centred(column)}>
              <InlineMarkdown text={text} />
            </TableHeaderCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {block.rows.map((row, index) => (
          <TableRow key={index}>
            {row.map((text, column) => (
              <TableCell key={column} numeric={numeric(column)} className={cn('align-top', centred(column))}>
                <InlineMarkdown text={text} />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

/** A heading at its level in the page: its level in the document, `under` levels deeper (a panel's h2 above it). */
function Heading({ level, text, under }: { level: number; text: string; under: number }) {
  const Tag = `h${Math.min(level + under, 6)}` as 'h2'
  return (
    <Tag className="text-sm font-medium">
      <InlineMarkdown text={text} />
    </Tag>
  )
}

function BlockOf({ block, under, label }: { block: Block; under: number; label?: string }) {
  switch (block.type) {
    case 'title':
      return <Heading level={block.level} text={block.text} under={under} />
    case 'paragraph':
      return (
        <p className="text-sm leading-relaxed text-muted-foreground">
          <InlineMarkdown text={block.text} />
        </p>
      )
    case 'list':
      return <List items={block.items} />
    case 'table':
      return <MarkdownTable block={block} label={label} />
    case 'code':
      return (
        <CodeBlock
          code={block.code}
          language={(LANGUAGES.has(block.language) ? block.language : 'text') as 'tsx'}
          wrap
        />
      )
  }
}

/** The blocks, each table named by the last heading before it. */
function Drawn({ blocks, under }: { blocks: Block[]; under: number }) {
  const headings: (string | undefined)[] = []
  blocks.forEach((block, index) => {
    headings[index] = block.type === 'title' ? plain(block.text) : headings[index - 1]
  })
  return (
    <div className="space-y-4">
      {blocks.map((block, index) => (
        <BlockOf key={index} block={block} under={under} label={headings[index]} />
      ))}
    </div>
  )
}

/**
 * Blocks of Markdown as they are, titles included: a page of the docs (docs/conventions.md, the CHANGELOG), its `##`
 * the page's h2, under its h1.
 */
export function MarkdownBlocks({ blocks }: { blocks: Block[] }) {
  return <Drawn blocks={blocks} under={0} />
}

/**
 * A component's guidelines, as the gallery shows them (its README, less its title, summary and "You provide"): in their
 * panel, a `##` its h3.
 */
export function Guidelines({ markdown }: { markdown: string }) {
  return <Drawn blocks={guidelinesOf(markdown)} under={1} />
}
