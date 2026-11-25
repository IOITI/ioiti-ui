/** The toasts and what says a moment: UndoToast, Toast, StatusIsland, RequestStatus. */
export const toast = {
    /** "Close notification": a toast's close button. */
    close: 'Close notification',
    /** "Done": an UndoToast's title, where the application gives none (it should: it says what was done). */
    undoTitle: 'Done',
    /** "Changes will be permanent in a few seconds": an UndoToast's line, where the application gives none. */
    undoDescription: 'Changes will be permanent in a few seconds',
    /** "Undo": an UndoToast's button, where the application names it nothing. */
    undo: 'Undo',
    /** "Restored successfully": what an UndoToast says once undone, where the application says nothing. */
    restored: 'Restored successfully',
    /** "Import:": StatusIsland's name, said to a screen reader before what its pill shows. */
    islandName: (label) => `${label}:`,
    /** "Close import": the button that closes the opened island, with its name. */
    closeIsland: (label) => `Close ${label.toLowerCase()}`,
    /** "Close": RequestStatus's button that puts the card away. */
    dismiss: 'Close',
    /** "Copy payment PY-55102": RequestStatus's button that copies a reference, with its name and value. */
    copyReference: ({ label, value }) => `Copy ${label.toLowerCase()} ${value}`,
};
