import { PageHeader, Panel } from 'ioiti-ui'

import conventions from '../../../docs/conventions.md?raw'
import { MarkdownBlocks } from '../catalogue/Markdown'
import { blocks } from '../catalogue/markdown-blocks'

// The conventions as docs/conventions.md writes them: its title and first paragraph the page's header, the rest below.
const [, intro, ...rest] = blocks(conventions)

export function Conventions() {
  return (
    <>
      <PageHeader title="Conventions" description={intro?.type === 'paragraph' ? intro.text.replace(/`/g, '') : undefined} />
      <Panel>
        <MarkdownBlocks blocks={rest} />
      </Panel>
    </>
  )
}
