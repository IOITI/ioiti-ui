// The unit a strip counts in where it is given none.
const HOURS = { one: 'heure', other: 'heures' };
// What the slots were, after their count and their unit, whatever its gender: « 2 heures de panne ».
const STATE = {
    warning: 'de fonctionnement dégradé',
    down: 'de panne',
    unknown: 'd’état inconnu',
    disabled: 'de désactivation',
};
export const status = {
    // A state in a word, as a status page says it: « En service » and « En panne », which agree with nothing; the others in
    // the masculine, a state's.
    healthOk: 'En service',
    healthWarning: 'Dégradé',
    healthDown: 'En panne',
    healthUnknown: 'Inconnu',
    healthDisabled: 'Désactivé',
    // The same for a figure of either gender.
    stale: 'obsolète',
    loadFailed: 'Chargement impossible',
    refreshFailed: 'Actualisation impossible : affichage des dernières données reçues',
    historyEmpty: 'Aucun historique pour l’instant',
    // The unit is always said, the times between brackets (« à » would not do before a day): « 23 heures de
    // fonctionnement, 1 heure de fonctionnement dégradé (14:00) ».
    historyUp: ({ count, unit = HOURS }, { plural }) => plural(count, { one: `# ${unit.one} de fonctionnement`, other: `# ${unit.other} de fonctionnement` }),
    historyState: ({ status, count, unit = HOURS, times }, { plural, list }) => `${plural(count, { one: `# ${unit.one}`, other: `# ${unit.other}` })} ${STATE[status]} (${list(times)})`,
    historyMore: (count, { plural }) => plural(count, { one: '# autre', other: '# autres' }),
    historyName: ({ label, summary }) => `${label} : ${summary}`,
    remove: 'Retirer',
    dismiss: 'Fermer',
    loadingName: 'Chargement',
    loading: 'Chargement…',
    progress: 'Progression',
    // A step, « une étape ».
    stepCompleted: '(terminée)',
};
