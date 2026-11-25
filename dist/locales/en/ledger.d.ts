import type { MessageKit } from '../../lib/messages.js';
/** RecoveryLedger. */
export declare const ledger: {
    /** "Recovery ledger": its title, and the name of its list. */
    title: string;
    /** "12 snapshots": how many entries it holds, beside its title. */
    count: (count: number, { plural }: MessageKit) => string;
    /** "Revert": the button that restores an entry. */
    restore: string;
    /** "Revert: Saved by Ana": the name of an entry's restore button, its words and the entry's action. */
    restoreEntry: ({ restore, action }: {
        restore: string;
        action: string;
    }) => string;
    /** "Current head": the badge of the entry in force. */
    current: string;
    /** "Changes": the name of an entry's diff, a region that scrolls. */
    changes: string;
};
