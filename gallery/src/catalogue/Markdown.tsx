import { Code, CodeBlock } from 'ioiti-ui'

import { guidelinesOf, inline, type Block } from './markdown'

const LANGUAGES = new Set(['text', 'json', 'js', 'jsx', 'ts', 'tsx', 'css', 'shell', 'toml', 'yaml', 'diff', 'python'])

/** A line of the guidelines: its `code` and its **strong** words. */
export function InlineMarkdown({ text }: { text: string }) {
  return (
    <>
      {inline(text).map((part, index) =>
        part.type === 'code' ? (
          <Code key={index}>{part.text}</Code>
        ) : part.type === 'strong' ? (
          <strong key={index} className="font-medium text-foreground">
            {part.text}
          </strong>
        ) : (
          part.text
        ),
      )}
    </>
  )
}

function BlockOf({ block }: { block: Block }) {
  switch (block.type) {
    case 'title':
      return <h3 className="text-sm font-medium">{block.text}</h3>
    case 'paragraph':
      return (
        <p className="text-sm leading-relaxed text-muted-foreground">
          <InlineMarkdown text={block.text} />
        </p>
      )
    case 'list':
      return (
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground marker:text-muted-foreground">
          {block.items.map((item, index) => (
            <li key={index}>
              <InlineMarkdown text={item} />
            </li>
          ))}
        </ul>
      )
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

/** A component's guidelines, as the gallery shows them (its README, less its title, summary and "You provide"). */
export function Guidelines({ markdown }: { markdown: string }) {
  return (
    <div className="space-y-4">
      {guidelinesOf(markdown).map((block, index) => (
        <BlockOf key={index} block={block} />
      ))}
    </div>
  )
}
