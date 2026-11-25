export const layout = {
    panel: 'Panneau',
    resize: 'Redimensionner',
    // The application's words for the panel, with their article: « l’éditeur » makes « Redimensionner l’éditeur ».
    resizePanel: (panel) => `Redimensionner ${panel}`,
    contents: 'Sommaire',
    sectionMenu: 'Afficher ou masquer le menu des sections',
    backToTop: 'Retour en haut',
    dependencyGraph: 'Graphe des dépendances',
    nodeStatus: ({ name, status }) => `${name} : ${status}`,
    traceStatus: (status) => ` : ${status}`,
    traceCalls: (names, { list }) => `appelle ${list(names)}`,
    // What calls it is the subject, the node traced its object (« l’ », whatever its gender): « appelé par » would agree
    // with the node.
    traceCalledBy: (names, { list, plural }) => `${list(names)} ${plural(names.length, { one: 'l’appelle', other: 'l’appellent' })}`,
    traceHint: 'Survolez un nœud ou placez-y le focus pour suivre ce qu’il appelle et ce qui l’appelle',
    connections: (count, { plural }) => plural(count, { one: '# connexion', other: '# connexions' }),
    timelineItem: ({ title, status }) => `${title} : ${status}`,
    // A state after the item's title, in the masculine, a state's; « en cours », « en attente » and « en échec » agree
    // with nothing.
    timelineCompleted: 'terminé',
    timelineInProgress: 'en cours',
    timelinePending: 'en attente',
    timelineFailed: 'en échec',
    timelineWarning: 'avertissement',
    copyCommit: 'Copier le hash du commit',
    copyCommitNamed: (hash) => `Copier le hash du commit ${hash}`,
    // The hash, « le hash ».
    commitCopied: 'Copié',
    open: 'Ouvrir',
    people: 'Personnes',
    peopleList: (names, { list }) => list(names),
    morePeople: (names, { list, plural }) => `${plural(names.length, { one: '# autre', other: '# autres' })} : ${list(names)}`,
};
