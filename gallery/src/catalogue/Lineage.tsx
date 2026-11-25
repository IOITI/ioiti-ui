import { TextLink } from 'ioiti-ui'

import { FAMILIES } from './catalogue'
import type { FamilyInfo } from './types'

/**
 * What a family was called, and what replaces it, under its summary (its page, its category's): until 1.0 removes the
 * former names.
 */
export function Lineage({ family }: { family: FamilyInfo }) {
  const replacement = FAMILIES.find((placed) => placed.family.name === family.deprecated)
  return (
    <>
      {family.formerly && <span className="mt-1 block text-xs">Formerly {family.formerly.join(', ')}</span>}
      {family.deprecated && (
        <span className="mt-1 block">
          <strong className="font-medium text-foreground">Deprecated</strong>: use{' '}
          {replacement ? <TextLink href={replacement.path}>{family.deprecated}</TextLink> : family.deprecated}, which takes the same props;
          removed in 1.0.
        </span>
      )}
    </>
  )
}
