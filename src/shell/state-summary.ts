import type { ReactNode } from 'react'

import type { Tone } from '../lib/recipes.js'

/**
 * What a state is, from the gravest: something to fix (`danger`), to watch (`warning`), good news not to miss
 * (`success`), something to know that asks nothing (`neutral`: a connection that fell back to a timer), and
 * all is well (`ok`). The first three stand out in the top bar; the last two are said only once it is opened.
 */
export type StateTone = 'danger' | 'warning' | 'success' | 'neutral' | 'ok'

/** A state, one row of StateSummary. */
export interface StateItem {
  id: string
  tone: StateTone
  /** A lucide icon, as an element (`<KeyRound />`): beside its words, and in the top bar while it is the gravest. */
  icon?: ReactNode
  /** Its words: "Restart needed", "Polling". */
  label: string
  /** What it means and what to do, under its words. */
  detail?: ReactNode
  /** The page where it is dealt with: the row is then a link. */
  href?: string
}

const RANK: Record<StateTone, number> = { ok: 0, neutral: 1, success: 2, warning: 3, danger: 4 }

/** The design's tone of each (recipes.ts): all is well in the positive colour, a neutral state in grey. */
export const STATE_TONE: Record<StateTone, Tone> = {
  danger: 'negative',
  warning: 'warning',
  success: 'positive',
  neutral: 'neutral',
  ok: 'positive',
}

/** Whether a state stands out: it is counted, and the top bar says it without being opened. */
export function standsOut(tone: StateTone): boolean {
  return RANK[tone] >= RANK.success
}

/** The gravest tone among states; `ok` for none. */
export function gravestTone(items: readonly { tone: StateTone }[]): StateTone {
  return items.reduce<StateTone>((gravest, item) => (RANK[item.tone] > RANK[gravest] ? item.tone : gravest), 'ok')
}

/** States from the gravest, in their order otherwise. */
export function byGravity<T extends { tone: StateTone }>(items: readonly T[]): T[] {
  return items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => RANK[b.item.tone] - RANK[a.item.tone] || a.index - b.index)
    .map(({ item }) => item)
}

const COUNTED: { tone: StateTone; words: string }[] = [
  { tone: 'danger', words: 'to fix' },
  { tone: 'warning', words: 'to watch' },
  { tone: 'success', words: 'good news' },
]

/**
 * What the top bar's summary says, for a screen reader and in its tip: the one state that stands out by its
 * words, several by how many of each tone ("1 to fix, 2 to watch"), none by the gravest quiet one's words, or
 * that all is well.
 */
export function stateSentence(items: readonly StateItem[], okLabel: string): string {
  const out = items.filter((item) => standsOut(item.tone))
  if (out.length === 1) return out[0].label
  if (out.length > 1) {
    return COUNTED.map(({ tone, words }) => ({ count: out.filter((item) => item.tone === tone).length, words }))
      .filter(({ count }) => count > 0)
      .map(({ count, words }) => `${count} ${words}`)
      .join(', ')
  }
  return items.find((item) => item.tone === 'neutral')?.label ?? okLabel
}
