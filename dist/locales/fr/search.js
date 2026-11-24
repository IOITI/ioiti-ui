export const search = {
    label: 'Recherche rapide',
    // French writes it as English does.
    placeholder: 'Rechercher…',
    search: 'Rechercher',
    searchIn: (list) => `Rechercher dans ${list}`,
    back: 'Retour',
    // The list's title between guillemets: one may start with a vowel, before which « de » would be elided.
    backFrom: (list) => `Sortir de « ${list} »`,
    close: 'Fermer',
    recent: 'Récents',
    recentSearches: 'Recherches récentes',
    opensList: 'Ouvre sa liste',
    searching: 'Recherche en cours…',
    results: ({ count, more }, { plural }) => count === 0
        ? 'Aucun résultat'
        : `${plural(count, { one: '# résultat', other: '# résultats' })}${more > 0 ? `, ${plural(more, { one: '# autre', other: '# autres' })}` : ''}`,
    inList: ({ list, results }) => `${list} : ${results}`,
    noResultsFor: (query) => `Aucun résultat pour « ${query} »`,
    more: (count, { plural }) => plural(count, { one: '# autre résultat : précisez votre recherche.', other: '# autres résultats : précisez votre recherche.' }),
    failed: 'La recherche a échoué.',
    tryAgain: 'Réessayer',
};
