/** What a word that takes values is given besides them: the locale, its plurals, its numbers, its lists. */
export interface MessageKit {
    /** The locale the words are said in ("en-GB", "fr-FR"). */
    locale: string;
    /**
     * The form for a count, as the locale's plural rules choose it: `plural(n, { one: '# day', other: '# days' })`.
     * `#` is the count, written as the locale writes numbers.
     */
    plural: (count: number, forms: PluralForms) => string;
    /** A number as the locale writes it ("1,234.5"; "1 234,5" in French). */
    number: (value: number, options?: Intl.NumberFormatOptions) => string;
    /** Words joined as the locale joins them ("a, b and c"; "a, b et c"). */
    list: (items: readonly string[], type?: 'conjunction' | 'disjunction') => string;
}
/** The forms of a word by plural category (`one`, `few`, `many`…); `other` always, which a missing one falls back to. */
export type PluralForms = {
    other: string;
} & Partial<Record<Intl.LDMLPluralRule, string>>;
/** A word: a string, or a function of a value (a count, a name, an object of them) and the locale's kit. */
export type Message = string | ((value: any, kit: MessageKit) => string);
/** A catalogue: namespaces of words. */
export type Catalogue = Record<string, Record<string, Message>>;
/** A word bound to a locale: a function of its value alone. */
export type BoundMessage<T> = T extends (value: infer V, kit: MessageKit) => string ? (value: V) => string : T;
/** A catalogue bound to a locale, as components read it (`useMessages()`). */
export type BoundCatalogue<C> = {
    readonly [N in keyof C]: {
        readonly [K in keyof C[N]]: BoundMessage<C[N][K]>;
    };
};
/** Some of a catalogue's words, by namespace, given over it: an application's own, or a language's. */
export type CatalogueOverride<C> = {
    readonly [N in keyof C]?: Partial<C[N]>;
};
/** The kit of a locale, made once. */
export declare function kitFor(locale: string): MessageKit;
/** A catalogue with some of its words given over (an application's, a language's), namespace by namespace. */
export declare function mergeMessages<C extends Catalogue>(base: C, ...overrides: (CatalogueOverride<C> | undefined)[]): C;
/** A catalogue bound to a locale: each word that takes values called with them alone. Made once per catalogue and locale. */
export declare function bindMessages<C extends Catalogue>(catalogue: C, locale: string): BoundCatalogue<C>;
