/** RecoveryLedger. */
export const ledger = {
    /** "Recovery ledger": its title, and the name of its list. */
    title: 'Recovery ledger',
    /** "12 snapshots": how many entries it holds, beside its title. */
    count: (count, { plural }) => plural(count, { one: '# snapshot', other: '# snapshots' }),
    /** "Revert": the button that restores an entry. */
    restore: 'Revert',
    /** "Revert: Saved by Ana": the name of an entry's restore button, its words and the entry's action. */
    restoreEntry: ({ restore, action }) => `${restore}: ${action}`,
    /** "Current head": the badge of the entry in force. */
    current: 'Current head',
    /** "Changes": the name of an entry's diff, a region that scrolls. */
    changes: 'Changes',
};
