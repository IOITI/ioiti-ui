// The package's two vocabularies of tones (docs/conventions.md): what a state is, and which way a figure goes. Each is
// drawn in the design's colours by the recipes (src/lib/recipes.ts): success and positive in the positive tone, danger
// and negative in the negative one.

/** A state, a status, the weight of a message or an action: neutral, info, success, warning, danger. */
export type StatusTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger'

/** Which way a figure goes: a gain, a loss, neither. */
export type SignTone = 'positive' | 'negative' | 'neutral'
