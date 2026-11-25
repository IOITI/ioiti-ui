export const notification = {
    // French writes it as English does.
    notifications: 'Notifications',
    unread: (count, { plural }) => plural(count, { one: '# notification non lue', other: '# notifications non lues' }),
    overflow: (most, { number }) => `${number(most)}+`,
    // Notifications (« les notifications ») new: the adjective agrees with them.
    newCount: (count, { plural }) => plural(count, { one: '# nouvelle', other: '# nouvelles' }),
    markAllRead: 'Les marquer toutes comme lues',
    readAll: 'Tout marquer comme lu',
    close: 'Fermer les notifications',
    loading: 'Chargement des notifications',
    empty: 'Aucune notification pour le moment',
    // « Chargées »: « lues » would say they were read by the person.
    readFailed: 'Les notifications n’ont pas pu être chargées.',
    tryAgain: 'Réessayer',
    markRead: 'Marquer comme lue',
    markNotificationRead: 'Marquer la notification comme lue',
};
