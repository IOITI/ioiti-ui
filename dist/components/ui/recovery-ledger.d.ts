import React from 'react';
export interface LedgerEntry {
    id: string;
    /** ioiti-ui: optional (a caller may say the date in `action`). */
    timestamp?: Date | string;
    action: string;
    description: string;
    author?: string;
    /** ioiti-ui: a name shown in the footer, as written (a file's). */
    reference?: string;
    details?: {
        diff?: string;
        preview?: string;
        metadata?: Record<string, any>;
        /** ioiti-ui: what the entry opens on, drawn as given (the changes a restore would make). */
        content?: React.ReactNode;
    };
    restorable?: boolean;
}
export interface RecoveryLedgerProps {
    /** Array of chronological version history or state recovery entries. */
    entries: LedgerEntry[];
    /** Currently active / restored state entry ID. */
    currentEntryId?: string;
    /** Revert / restore callback. ioiti-ui: the caller opens its confirmation there; the ledger restores nothing itself. */
    onRestore?: (id: string) => Promise<void> | void;
    /** Entry selection handler. */
    onSelect?: (id: string) => void;
    /** ioiti-ui: the entry opened, when the caller holds it (null: none). */
    expandedId?: string | null;
    /** ioiti-ui: called with the entry opened, or null once it is closed. */
    onExpandedChange?: (id: string | null) => void;
    /** ioiti-ui: the header's title. */
    title?: string;
    /** ioiti-ui: beside the title. */
    countLabel?: string;
    /** ioiti-ui: the text of the restore button. */
    restoreLabel?: string;
    /** ioiti-ui: the badge of the current entry. */
    currentLabel?: string;
    /** Visual presentation mode. Default is 'timeline'. */
    variant?: 'timeline' | 'compact';
    /** Custom CSS class names. */
    className?: string;
}
export declare const RecoveryLedger: React.FC<RecoveryLedgerProps>;
