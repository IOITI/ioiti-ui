// A unit counted: « 15 minutes », « il y a 2 ans ».
const COUNTED = {
    s: { one: 'seconde', other: 'secondes', feminine: true },
    m: { one: 'minute', other: 'minutes', feminine: true },
    h: { one: 'heure', other: 'heures', feminine: true },
    d: { one: 'jour', other: 'jours', feminine: false },
    w: { one: 'semaine', other: 'semaines', feminine: true },
    M: { one: 'mois', other: 'mois', feminine: false },
    y: { one: 'an', other: 'ans', feminine: false },
};
// Beside « dernier » or « prochain », a year is an « année »: « 2 dernières années », never « 2 derniers ans ».
const BESIDE_ADJECTIVE = { ...COUNTED, y: { one: 'année', other: 'années', feminine: true } };
// What a moment is rounded to: « arrondi à la minute ».
const ROUNDED_TO = {
    s: 'à la seconde',
    m: 'à la minute',
    h: 'à l’heure',
    d: 'au jour',
    w: 'à la semaine',
    M: 'au mois',
    y: 'à l’année',
};
/** « 15 minutes », « 1 an ». */
const counted = ({ count, unit }, { plural }) => plural(count, { one: `# ${COUNTED[unit].one}`, other: `# ${COUNTED[unit].other}` });
const LAST = { masculine: ['dernier', 'derniers'], feminine: ['dernière', 'dernières'] };
const NEXT = { masculine: ['prochain', 'prochains'], feminine: ['prochaine', 'prochaines'] };
/**
 * « 15 dernières minutes », « 7 prochains jours »: the adjective after the count, agreeing with the unit. One alone is
 * said without its count, as French says it: « Dernière heure », « Prochain mois ».
 */
function spanWith(adjective, { count, unit }, { plural }) {
    const noun = BESIDE_ADJECTIVE[unit];
    const [one, other] = adjective[noun.feminine ? 'feminine' : 'masculine'];
    if (count === 1)
        return `${one.charAt(0).toUpperCase()}${one.slice(1)} ${noun.one}`;
    return plural(count, { one: `# ${one} ${noun.one}`, other: `# ${other} ${noun.other}` });
}
// AutoRefresh's button: « Toutes les minutes », « Toutes les 5 min ».
const EVERY_ONE = { s: 'Toutes les secondes', m: 'Toutes les minutes', h: 'Toutes les heures' };
const SHORT = { s: 's', m: 'min', h: 'h' };
export const timeRange = {
    today: 'Aujourd’hui',
    yesterday: 'Hier',
    todaySoFar: 'Aujourd’hui jusqu’à présent',
    thisWeek: 'Cette semaine',
    thisWeekSoFar: 'Cette semaine jusqu’à présent',
    lastWeek: 'La semaine dernière',
    thisMonth: 'Ce mois-ci',
    thisMonthSoFar: 'Ce mois-ci jusqu’à présent',
    lastMonth: 'Le mois dernier',
    thisYear: 'Cette année',
    thisYearSoFar: 'Cette année jusqu’à présent',
    lastSpan: (span, kit) => spanWith(LAST, span, kit),
    nextSpan: (span, kit) => spanWith(NEXT, span, kit),
    now: 'maintenant',
    ago: (span, kit) => `il y a ${counted(span, kit)}`,
    later: (span, kit) => `dans ${counted(span, kit)}`,
    rounded: ({ moved, unit }) => `${moved}, arrondi ${ROUNDED_TO[unit]}`,
    ends: ({ from, to }) => `${from} → ${to}`,
    arrow: '→',
    showEnds: ' : afficher son début et sa fin',
    quickSelect: 'Sélection rapide',
    beforeOrAfterNow: 'Avant ou après maintenant',
    // The three controls read as a sentence: « Depuis | 15 | minutes », « D’ici | 15 | minutes ». French puts « dernières »
    // after the count, which a list before it cannot say.
    lastOption: 'Depuis',
    nextOption: 'D’ici',
    howMany: 'Combien',
    unit: 'Unité',
    // Agreeing with the count beside it: « 1 heure », « 2 heures ».
    unitOption: ({ count, unit }, { plural }) => plural(count, { one: COUNTED[unit].one, other: COUNTED[unit].other }),
    apply: 'Appliquer',
    commonlyUsed: 'Plages courantes',
    recentlyUsed: 'Plages récentes',
    startOfRange: 'Le début de la plage',
    endOfRange: 'La fin de la plage',
    // A date, which the tabs agree with: « Absolue », « Relative ».
    startTabs: 'Date de début',
    endTabs: 'Date de fin',
    absolute: 'Absolue',
    relative: 'Relative',
    nowTab: 'Maintenant',
    time: 'Heure',
    // « 15 | minutes | plus tôt »: « il y a » comes before the count, which a list after it cannot say.
    agoOption: 'plus tôt',
    fromNowOption: 'plus tard',
    roundTo: (unit) => `Arrondir ${ROUNDED_TO[unit]}`,
    nowExplained: 'Maintenant, c’est l’instant où la plage est lue : chaque actualisation le fait avancer.',
    setStartToNow: 'Mettre le début à maintenant',
    setEndToNow: 'Mettre la fin à maintenant',
    update: 'Mettre à jour',
    refresh: 'Actualiser',
    refreshing: 'Actualisation',
    autoRefresh: 'Actualisation',
    refreshOff: 'Désactivée',
    refreshEvery: ({ count, unit }, { number }) => (count === 1 ? EVERY_ONE[unit] : `Toutes les ${number(count)} ${SHORT[unit]}`),
    refreshInterval: 'Actualiser toutes les',
    refreshUnit: 'Unité de l’actualisation',
    startRefresh: 'Démarrer',
    stopRefresh: 'Arrêter',
};
