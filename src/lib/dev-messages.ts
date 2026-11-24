// What devWarn says to a developer, by its id: kept apart from the code that calls it, so that a production build,
// which never reaches devWarn's words, leaves this table out with them (scripts/check-package.mjs holds it).
export const DEV_MESSAGES = {
  'dialog-unnamed':
    'a dialog has neither a title nor an aria-label or aria-labelledby: a screen reader says "dialog" and nothing else. Give it a title, or name it.',
  'chart-series-beyond-four':
    'more series on one chart than the four the design compares: the fifth and those after it are grey unless given a colour.',
} as const

export type DevMessageId = keyof typeof DEV_MESSAGES
