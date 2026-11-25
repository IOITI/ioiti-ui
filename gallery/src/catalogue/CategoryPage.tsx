import { PageHeader, Panel, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, TextLink, useTabTitle } from 'ioiti-ui'
import { Navigate, useLocation } from 'react-router'

import { exampleKey, familyPath, summaryOfFamily } from './catalogue'
import { ExamplePanel } from './ExamplePanel'
import { movedTo } from './legacy'
import { Lineage } from './Lineage'
import { InlineMarkdown } from './Markdown'
import type { CategoryInfo, Examples } from './types'

/** Which of a category's families to use, where several answer the same need: each a link to its page, and when. */
function WhichOne({ category }: { category: CategoryInfo }) {
  const { choose } = category
  if (!choose) return null
  return (
    <Panel title={choose.heading} density="compact">
      <Table aria-label={choose.heading}>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Component</TableHeaderCell>
            <TableHeaderCell>When to use it</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {choose.rows.map((row) => {
            const family = category.families.find((each) => each.slug === row.family)
            return (
              <TableRow key={row.family}>
                <TableHeaderCell className="whitespace-nowrap align-top">
                  {family ? (
                    <TextLink href={familyPath(category, family)} variant="hover">
                      {family.name}
                    </TextLink>
                  ) : (
                    row.family
                  )}
                </TableHeaderCell>
                <TableCell className="align-top">
                  <InlineMarkdown text={row.when} />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </Panel>
  )
}

/** A category's page: which of its components to use, then each of them once, at work, leading to its own page. */
export function CategoryPage({ category, examples }: { category: CategoryInfo; examples: Examples }) {
  // A link to a part of the former page at this address, which is none of its components now, leads to its page.
  const { pathname, hash } = useLocation()
  // The page's own, after every example's: an example that draws a PageHeader names the tab first.
  useTabTitle(category.label)
  const part = decodeURIComponent(hash.replace(/^#/, ''))
  const moved = part && !category.families.some((family) => family.slug === part) ? movedTo(pathname, hash) : undefined
  if (moved) return <Navigate replace to={moved} />
  return (
    <>
      <PageHeader title={category.label} description={category.summary} />
      <WhichOne category={category} />
      {category.families.map((family) => {
        const [first] = family.examples
        const path = familyPath(category, family)
        const more = family.examples.length
        return (
          <ExamplePanel
            key={family.slug}
            id={family.slug}
            info={first}
            example={examples[exampleKey(family, first)]}
            code={false}
            title={<TextLink href={path}>{family.name}</TextLink>}
            description={
              <>
                <InlineMarkdown text={summaryOfFamily(family)} />
                <Lineage family={family} />
              </>
            }
            action={
              <TextLink href={path} variant="quiet">
                {more === 1 ? 'Its example, code and props' : `All ${more} examples, code and props`}
              </TextLink>
            }
          />
        )
      })}
    </>
  )
}
