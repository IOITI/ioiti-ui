import { Badge } from 'ioiti-ui'

import { FormerNames } from './Lineage'
import { isNew, sinceOf } from './shipped'
import type { FamilyInfo } from './types'

/**
 * Where a family stands, under its summary on its page: new (no release has had its name yet, or the gallery's own
 * has), what it was called, the version it first shipped in.
 */
export function FamilyStatus({ family }: { family: FamilyInfo }) {
  const since = sinceOf(family.name)
  return (
    <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
      {isNew(family.name) && <Badge tone="info">New</Badge>}
      {family.formerly && (
        <span>
          <FormerNames family={family} />
        </span>
      )}
      {since && <span>Since {since}</span>}
    </span>
  )
}
