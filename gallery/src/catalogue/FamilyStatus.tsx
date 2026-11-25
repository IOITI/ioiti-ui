import { Badge } from 'ioiti-ui'

import { FormerNames, Replacement } from './Lineage'
import { isNew, sinceOf } from './shipped'
import type { FamilyInfo } from './types'

/**
 * Where a family stands, under its summary on its page: new (no release has had its name yet, or the gallery's own
 * has), deprecated, what it was called, the version it first shipped in; then what replaces it, where it is deprecated.
 */
export function FamilyStatus({ family }: { family: FamilyInfo }) {
  const since = sinceOf(family.name)
  return (
    <>
      <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
        {isNew(family.name) && <Badge tone="info">New</Badge>}
        {family.deprecated && <Badge tone="danger">Deprecated</Badge>}
        {family.formerly && (
          <span>
            <FormerNames family={family} />
          </span>
        )}
        {since && <span>Since {since}</span>}
      </span>
      {family.deprecated && (
        <span className="mt-1 block">
          <Replacement family={family} first />
        </span>
      )}
    </>
  )
}
