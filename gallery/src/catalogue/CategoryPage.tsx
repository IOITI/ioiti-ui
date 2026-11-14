import { PageHeader, TextLink } from 'ioiti-ui'
import { Navigate, useLocation } from 'react-router'

import { exampleKey, familyPath, summaryOfFamily } from './catalogue'
import { ExamplePanel } from './ExamplePanel'
import { movedTo } from './legacy'
import { InlineMarkdown } from './Markdown'
import type { CategoryInfo, Examples } from './types'

/** A category's page: each of its components once, at work, leading to its own page. */
export function CategoryPage({ category, examples }: { category: CategoryInfo; examples: Examples }) {
  // A link to a part of the former page at this address, which is none of its components now, leads to its page.
  const { pathname, hash } = useLocation()
  const part = decodeURIComponent(hash.replace(/^#/, ''))
  const moved = part && !category.families.some((family) => family.slug === part) ? movedTo(pathname, hash) : undefined
  if (moved) return <Navigate replace to={moved} />
  return (
    <>
      <PageHeader title={category.label} description={category.summary} />
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
            title={<TextLink to={path}>{family.name}</TextLink>}
            description={<InlineMarkdown text={summaryOfFamily(family)} />}
            action={
              <TextLink to={path} variant="quiet">
                {more === 1 ? 'Its example, code and props' : `All ${more} examples, code and props`}
              </TextLink>
            }
          />
        )
      })}
    </>
  )
}
