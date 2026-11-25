/** The toasts and what says a moment: UndoToast, Toast, StatusIsland, RequestStatus. */
export declare const toast: {
    /** "Close notification": a toast's close button. */
    close: string;
    /** "Done": an UndoToast's title, where the application gives none (it should: it says what was done). */
    undoTitle: string;
    /** "Changes will be permanent in a few seconds": an UndoToast's line, where the application gives none. */
    undoDescription: string;
    /** "Undo": an UndoToast's button, where the application names it nothing. */
    undo: string;
    /** "Restored successfully": what an UndoToast says once undone, where the application says nothing. */
    restored: string;
    /** "Import:": StatusIsland's name, said to a screen reader before what its pill shows. */
    islandName: (label: string) => string;
    /** "Close import": the button that closes the opened island, with its name. */
    closeIsland: (label: string) => string;
    /** "Close": RequestStatus's button that puts the card away. */
    dismiss: string;
    /** "Copy payment PY-55102": RequestStatus's button that copies a reference, with its name and value. */
    copyReference: ({ label, value }: {
        label: string;
        value: string;
    }) => string;
};
