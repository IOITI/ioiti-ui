export const date = {
    previousMonth: 'Mois précédent',
    nextMonth: 'Mois suivant',
    pickerDialog: 'Choisir une date',
    datePlaceholder: 'Sélectionner une date',
    rangePlaceholder: 'Sélectionner une période',
    range: ({ from, to }) => `${from} – ${to ?? '…'}`,
    lastDays: (count, { plural }) => plural(count, { one: '# jour', other: '# jours' }),
    allTime: 'Toute la période',
    customRange: 'Période personnalisée',
};
