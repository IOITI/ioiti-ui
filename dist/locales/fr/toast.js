export const toast = {
    close: 'Fermer la notification',
    undoTitle: 'Action effectuée',
    undoDescription: 'Les modifications seront définitives dans quelques secondes',
    undo: 'Annuler',
    restored: 'Restauration réussie',
    islandName: (label) => `${label} :`,
    closeIsland: (label) => `Fermer ${label.toLowerCase()}`,
    dismiss: 'Fermer',
    copyReference: ({ label, value }) => `Copier ${label.toLowerCase()} ${value}`,
};
