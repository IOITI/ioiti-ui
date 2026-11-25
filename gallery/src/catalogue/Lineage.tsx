import type { FamilyInfo } from './types'

/** "Formerly SettleModal": what a family was called, names 1.0 removed (the codemod rewrites them). */
export function FormerNames({ family }: { family: FamilyInfo }) {
  return family.formerly ? <>Formerly {family.formerly.join(', ')}</> : null
}

/** What a family was called, under its summary (its category's page). */
export function Lineage({ family }: { family: FamilyInfo }) {
  return family.formerly ? (
    <span className="mt-1 block text-xs">
      <FormerNames family={family} />
    </span>
  ) : null
}
