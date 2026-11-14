import { ButtonLink, EmptyText, Input, PageHeader, TextLink } from 'ioiti-ui'
import { Search } from 'lucide-react'
import { useSearchParams } from 'react-router'

import { CATEGORIES, categoryPath, FAMILIES, plainSummary, type Placed } from './catalogue'

/** Whether every word asked for is in what a family is called, holds, or does. */
function matches(placed: Placed, words: string[]) {
  const { family, category } = placed
  const text = [family.name, ...family.names, ...(family.keywords ?? []), category.label, plainSummary(family)].join(' ').toLowerCase()
  return words.every((word) => text.includes(word))
}

/** Every component, from A to Z, found by a word (`?q=`), or by its category. */
export function ComponentIndex() {
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const words = query.toLowerCase().split(/\s+/).filter(Boolean)
  const found = FAMILIES.filter((placed) => matches(placed, words)).sort((a, b) => a.family.name.localeCompare(b.family.name))
  const letters = [...new Set(found.map((placed) => placed.family.name[0].toUpperCase()))]

  return (
    <>
      <PageHeader
        title="Components"
        description={`Every component of the package, from A to Z: ${FAMILIES.length} pages in ${CATEGORIES.length} groups, each with its examples, their code, its guidelines and its props.`}
      />

      <div className="max-w-md">
        <Input
          type="search"
          aria-label="Find a component"
          placeholder="A component, a part, a word…"
          leftIcon={<Search className="size-3.5" />}
          value={query}
          onChange={(event) => setParams(event.target.value ? { q: event.target.value } : {}, { replace: true })}
        />
      </div>

      <nav aria-label="Groups of components" className="flex flex-wrap gap-2">
        {CATEGORIES.map((category) => {
          const Icon = category.icon
          return (
            <ButtonLink key={category.slug} to={categoryPath(category)} variant="outline" size="xs" leftIcon={<Icon />}>
              {category.label}
            </ButtonLink>
          )
        })}
      </nav>

      {found.length === 0 ? (
        <EmptyText>No component is called or does “{query}”.</EmptyText>
      ) : (
        letters.map((letter) => (
          <section key={letter} aria-labelledby={`letter-${letter}`} className="space-y-3">
            <h2 id={`letter-${letter}`} className="text-xs font-medium text-muted-foreground">
              {letter}
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {found
                .filter((placed) => placed.family.name[0].toUpperCase() === letter)
                .map(({ family, category, path }) => (
                  <li
                    key={path}
                    className="min-w-0 space-y-1.5 rounded-2xl border border-border/70 bg-surface/50 p-4 dark:bg-surface/25 glass-card glass-edge"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <TextLink to={path} variant="hover">
                        <span className="font-medium">{family.name}</span>
                      </TextLink>
                      <span className="shrink-0 text-xs text-muted-foreground">{category.label}</span>
                    </div>
                    <p className="line-clamp-2 text-xs text-muted-foreground">{plainSummary(family)}</p>
                    {family.names.length > 1 && (
                      <p className="truncate text-xs text-muted-foreground">With {family.names.slice(1).join(', ')}</p>
                    )}
                  </li>
                ))}
            </ul>
          </section>
        ))
      )}
    </>
  )
}
