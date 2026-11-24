// The words the package says, by namespace (`date.today`, `format.ago`): a catalogue, English's (`src/locales/en.ts`)
// and the others typed after it. A word that takes values is a function of them and of the locale's kit (its plurals, its
// numbers, its lists): written once with the kit, called with the values alone once bound to a locale.

/** What a word that takes values is given besides them: the locale, its plurals, its numbers, its lists. */
export interface MessageKit {
  /** The locale the words are said in ("en-GB", "fr-FR"). */
  locale: string
  /**
   * The form for a count, as the locale's plural rules choose it: `plural(n, { one: '# day', other: '# days' })`.
   * `#` is the count, written as the locale writes numbers.
   */
  plural: (count: number, forms: PluralForms) => string
  /** A number as the locale writes it ("1,234.5"; "1 234,5" in French). */
  number: (value: number, options?: Intl.NumberFormatOptions) => string
  /** Words joined as the locale joins them ("a, b and c"; "a, b et c"). */
  list: (items: readonly string[], type?: 'conjunction' | 'disjunction') => string
}

/** The forms of a word by plural category (`one`, `few`, `many`…); `other` always, which a missing one falls back to. */
export type PluralForms = { other: string } & Partial<Record<Intl.LDMLPluralRule, string>>

/** A word: a string, or a function of a value (a count, a name, an object of them) and the locale's kit. */
// The value is `any` here so that each word keeps its own type: the catalogue's type is English's (`Messages`).
// oxlint-disable-next-line typescript/no-explicit-any
export type Message = string | ((value: any, kit: MessageKit) => string)

/** A catalogue: namespaces of words. */
export type Catalogue = Record<string, Record<string, Message>>

/** A word bound to a locale: a function of its value alone. */
export type BoundMessage<T> = T extends (value: infer V, kit: MessageKit) => string ? (value: V) => string : T

/** A catalogue bound to a locale, as components read it (`useMessages()`). */
export type BoundCatalogue<C> = { readonly [N in keyof C]: { readonly [K in keyof C[N]]: BoundMessage<C[N][K]> } }

/** Some of a catalogue's words, by namespace, given over it: an application's own, or a language's. */
export type CatalogueOverride<C> = { readonly [N in keyof C]?: Partial<C[N]> }

const kits = new Map<string, MessageKit>()

/** The kit of a locale, made once. */
export function kitFor(locale: string): MessageKit {
  const known = kits.get(locale)
  if (known) return known
  const rules = new Intl.PluralRules(locale)
  const integers = new Intl.NumberFormat(locale)
  const lists = {
    conjunction: new Intl.ListFormat(locale, { type: 'conjunction' }),
    disjunction: new Intl.ListFormat(locale, { type: 'disjunction' }),
  }
  const number = (value: number, options?: Intl.NumberFormatOptions) =>
    options ? new Intl.NumberFormat(locale, options).format(value) : integers.format(value)
  const kit: MessageKit = {
    locale,
    plural: (count, forms) => (forms[rules.select(count)] ?? forms.other).replaceAll('#', number(count)),
    number,
    list: (items, type = 'conjunction') => lists[type].format(items),
  }
  kits.set(locale, kit)
  return kit
}

/** A catalogue with some of its words given over (an application's, a language's), namespace by namespace. */
export function mergeMessages<C extends Catalogue>(base: C, ...overrides: (CatalogueOverride<C> | undefined)[]): C {
  const merged: Record<string, Record<string, Message>> = { ...base }
  for (const override of overrides) {
    if (!override) continue
    for (const [namespace, words] of Object.entries(override) as [string, Record<string, Message> | undefined][]) {
      if (words) merged[namespace] = { ...merged[namespace], ...words }
    }
  }
  return merged as C
}

const bound = new WeakMap<Catalogue, Map<string, Catalogue>>()

/** A catalogue bound to a locale: each word that takes values called with them alone. Made once per catalogue and locale. */
export function bindMessages<C extends Catalogue>(catalogue: C, locale: string): BoundCatalogue<C> {
  let byLocale = bound.get(catalogue)
  if (!byLocale) bound.set(catalogue, (byLocale = new Map()))
  const known = byLocale.get(locale)
  if (known) return known as BoundCatalogue<C>
  const kit = kitFor(locale)
  const result: Catalogue = {}
  for (const [namespace, words] of Object.entries(catalogue)) {
    const each: Record<string, Message> = {}
    for (const [key, word] of Object.entries(words)) each[key] = typeof word === 'function' ? (value: unknown) => word(value, kit) : word
    result[namespace] = each
  }
  byLocale.set(locale, result)
  return result as BoundCatalogue<C>
}
