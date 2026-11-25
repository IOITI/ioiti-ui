import { EmptyText, PageHeader, Panel, TextLink } from 'ioiti-ui'

import changelog from '../../../CHANGELOG.md?raw'
import { InlineMarkdown, MarkdownBlocks } from '../catalogue/Markdown'
import { blocks, plain, type Block } from '../catalogue/markdown-blocks'
import { REPOSITORY } from '../catalogue/shipped'

/**
 * The first version written in sections (Added, Changed…), as scripts/changelog.mjs reads them: the page draws it and
 * those after it. The notes before it are one list, written for the application the design was taken from: on GitHub.
 */
const SECTIONED_FROM = [0, 24, 0]

/** Whether a version's notes are drawn here: what is not released yet, and the versions written in sections. */
const drawn = (label: string) => {
  const parts = /^(\d+)\.(\d+)\.(\d+)/.exec(label)?.slice(1).map(Number)
  if (!parts) return true
  for (let index = 0; index < 3; index += 1) if (parts[index] !== SECTIONED_FROM[index]) return parts[index] > SECTIONED_FROM[index]
  return true
}

interface Version {
  /** Its anchor: `v0.30.0`, `unreleased`. */
  id: string
  /** Its name in the list of versions: `0.30.0`. */
  label: string
  /** Its heading, a link to its release where the CHANGELOG's foot gives one. */
  title: string
  /** The day it was released, as the CHANGELOG writes it. */
  date?: string
  blocks: Block[]
}

/** The CHANGELOG cut at its versions (`## [0.30.0] - 2026-11-24`): what comes before them, then each with its notes. */
function versionsOf(all: Block[]): { before: Block[]; versions: Version[] } {
  const before: Block[] = []
  const versions: Version[] = []
  for (const block of all) {
    if (block.type !== 'title' || block.level !== 2) {
      const notes = versions.at(-1)?.blocks ?? before
      notes.push(block)
      continue
    }
    // Its name (a link where the foot gives one), then its day: `[0.30.0](https://…) - 2026-11-24`.
    const [, title = block.text, date] = /^(.*?)(?:\s+-\s+(\d{4}-\d{2}-\d{2}))?$/.exec(block.text) ?? []
    const label = plain(title)
    versions.push({ id: /^\d/.test(label) ? `v${label}` : label.toLowerCase().replace(/\W+/g, '-'), label, title, date, blocks: [] })
  }
  return { before, versions }
}

// The CHANGELOG as it is written: its title and first paragraph the page's header, what follows them and the list of
// versions in a first panel, then a panel for each version.
const [title, intro, ...rest] = blocks(changelog)
const { before, versions: all } = versionsOf(rest)
const versions = all.filter((version) => drawn(version.label))

export function Changelog() {
  return (
    <>
      <PageHeader
        title={title?.type === 'title' ? plain(title.text) : 'Changelog'}
        description={intro?.type === 'paragraph' ? <InlineMarkdown text={intro.text} /> : undefined}
      />
      <Panel>
        <MarkdownBlocks blocks={before} />
        <nav aria-label="Versions" className="mt-4">
          <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
            {versions.map((version) => (
              <li key={version.id}>
                <TextLink href={`#${version.id}`} variant="hover">
                  {version.label}
                </TextLink>
              </li>
            ))}
          </ul>
        </nav>
      </Panel>
      {versions.map((version) => (
        <Panel
          key={version.id}
          id={version.id}
          title={<InlineMarkdown text={version.title} links="hover" />}
          description={version.date}
          className="scroll-mt-20"
        >
          {version.blocks.length ? <MarkdownBlocks blocks={version.blocks} /> : <EmptyText>Nothing yet.</EmptyText>}
        </Panel>
      ))}
      <p className="text-sm text-muted-foreground">
        Before {SECTIONED_FROM.join('.')}, each version's notes are one list:{' '}
        <TextLink href={`${REPOSITORY}/blob/main/CHANGELOG.md`} reloadDocument>
          CHANGELOG.md, on GitHub
        </TextLink>
        .
      </p>
    </>
  )
}
