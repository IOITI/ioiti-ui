export const ledger = {
    title: 'Points de restauration',
    count: (count, { plural }) => plural(count, { one: '# instantané', other: '# instantanés' }),
    restore: 'Restaurer',
    restoreEntry: ({ restore, action }) => `${restore} : ${action}`,
    current: 'Version actuelle',
    changes: 'Modifications',
};
