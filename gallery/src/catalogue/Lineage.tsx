import { TextLink } from 'ioiti-ui'

import { FAMILIES } from './catalogue'
import type { FamilyInfo } from './types'

/** "Formerly SettleModal": what a family was called, until 1.0 removes the former names. */
export function FormerNames({ family }: { family: FamilyInfo }) {
  return family.formerly ? <>Formerly {family.formerly.join(', ')}</> : null
}

/** What replaces a deprecated family, and when it goes: "use Switch, which takes the same props; removed in 1.0." */
export function Replacement({ family, first = false }: { family: FamilyInfo; first?: boolean }) {
  const replacement = FAMILIES.find((placed) => placed.family.name === family.deprecated)
  return (
    <>
      {first ? 'Use' : 'use'} {replacement ? <TextLink href={replacement.path}>{family.deprecated}</TextLink> : family.deprecated}, which
      takes the same props; removed in 1.0.
    </>
  )
}

/**
 * What a family was called, and what replaces it, under its summary (its category's page): until 1.0 removes the
 * former names.
 */
export function Lineage({ family }: { family: FamilyInfo }) {
  return (
    <>
      {family.formerly && (
        <span className="mt-1 block text-xs">
          <FormerNames family={family} />
        </span>
      )}
      {family.deprecated && (
        <span className="mt-1 block">
          <strong className="font-medium text-foreground">Deprecated</strong>: <Replacement family={family} />
        </span>
      )}
    </>
  )
}
