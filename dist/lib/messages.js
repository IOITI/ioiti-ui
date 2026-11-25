// The words the package says, by namespace (`date.today`, `format.ago`): a catalogue, English's (`src/locales/en.ts`)
// and the others typed after it. A word that takes values is a function of them and of the locale's kit (its plurals, its
// numbers, its lists): written once with the kit, called with the values alone once bound to a locale.
const kits = new Map();
/** The kit of a locale, made once. */
export function kitFor(locale) {
    const known = kits.get(locale);
    if (known)
        return known;
    const rules = new Intl.PluralRules(locale);
    const integers = new Intl.NumberFormat(locale);
    const lists = {
        conjunction: new Intl.ListFormat(locale, { type: 'conjunction' }),
        disjunction: new Intl.ListFormat(locale, { type: 'disjunction' }),
    };
    const number = (value, options) => options ? new Intl.NumberFormat(locale, options).format(value) : integers.format(value);
    const kit = {
        locale,
        plural: (count, forms) => (forms[rules.select(count)] ?? forms.other).replaceAll('#', number(count)),
        number,
        list: (items, type = 'conjunction') => lists[type].format(items),
    };
    kits.set(locale, kit);
    return kit;
}
/** A catalogue with some of its words given over (an application's, a language's), namespace by namespace. */
export function mergeMessages(base, ...overrides) {
    const merged = { ...base };
    for (const override of overrides) {
        if (!override)
            continue;
        for (const [namespace, words] of Object.entries(override)) {
            if (words)
                merged[namespace] = { ...merged[namespace], ...words };
        }
    }
    return merged;
}
const bound = new WeakMap();
/** A catalogue bound to a locale: each word that takes values called with them alone. Made once per catalogue and locale. */
export function bindMessages(catalogue, locale) {
    let byLocale = bound.get(catalogue);
    if (!byLocale)
        bound.set(catalogue, (byLocale = new Map()));
    const known = byLocale.get(locale);
    if (known)
        return known;
    const kit = kitFor(locale);
    const result = {};
    for (const [namespace, words] of Object.entries(catalogue)) {
        const each = {};
        for (const [key, word] of Object.entries(words))
            each[key] = typeof word === 'function' ? (value) => word(value, kit) : word;
        result[namespace] = each;
    }
    byLocale.set(locale, result);
    return result;
}
