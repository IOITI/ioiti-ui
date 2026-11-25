import { CodeBlock, EmptyText, PageHeader, Panel, ScrollProgressNav, TextLink, useMainScroll, useTabTitle } from 'ioiti-ui'

import { categoryPath, exampleKey, importLine, readmeOf, summaryOfFamily } from './catalogue'
import { ExamplePanel } from './ExamplePanel'
import { FamilyStatus } from './FamilyStatus'
import { GalleryLink, Guidelines, InlineMarkdown } from './Markdown'
import { PropsTables } from './PropsTables'
import { sourceOf } from './shipped'
import type { CategoryInfo, Examples, FamilyInfo } from './types'

interface FamilyPageProps {
  category: CategoryInfo
  family: FamilyInfo
  examples: Examples
}

/**
 * A component's page: where it stands (new, deprecated, since when) and its source, then its examples, each with its
 * code, then its guidelines and its props.
 */
export function FamilyPage({ category, family, examples }: FamilyPageProps) {
  const main = useMainScroll()
  // The page's own, after every example's: an example that draws a PageHeader names the tab first.
  useTabTitle(family.name)
  const readme = readmeOf(family)
  const source = sourceOf(family.name)
  const sections = [
    ...family.examples.map((example) => ({ id: example.id, label: example.title, href: `#${example.id}` })),
    { id: 'guidelines', label: 'Guidelines', href: '#guidelines' },
    { id: 'props', label: 'Props', href: '#props' },
  ]
  return (
    <>
      <PageHeader
        title={family.name}
        description={
          <>
            <InlineMarkdown text={summaryOfFamily(family)} />
            <FamilyStatus family={family} />
          </>
        }
        actions={
          <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {source && (
              <GalleryLink href={source} variant="quiet">
                Its source
              </GalleryLink>
            )}
            <TextLink href={categoryPath(category)} variant="quiet">
              All of {category.label.toLowerCase()}
            </TextLink>
          </span>
        }
      />

      <CodeBlock language="ts" code={importLine(family)} />

      <ScrollProgressNav sections={sections} mode="sticky" containerRef={main ?? undefined} label="On this page" />

      {family.examples.map((example) => (
        <ExamplePanel key={example.id} info={example} example={examples[exampleKey(family, example)]} />
      ))}

      <Panel id="guidelines" title="Guidelines" className="scroll-mt-20">
        {readme ? <Guidelines markdown={readme} /> : <EmptyText>No guidelines yet.</EmptyText>}
      </Panel>

      <Panel id="props" title="Props" description="Read from the package's types." className="scroll-mt-20">
        <PropsTables names={family.names} />
      </Panel>
    </>
  )
}
