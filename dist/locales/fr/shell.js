export const shell = {
    // As French sites name their skip links.
    skipToPage: 'Aller au contenu',
    navigation: 'Navigation',
    openNavigation: 'Ouvrir la navigation',
    closeNavigation: 'Fermer la navigation',
    // As the French state's design system names its main navigation: a screen reader adds « navigation ».
    mainNavigation: 'Menu principal',
    // « sous », which no elision changes (« de Accueil » would be « d’Accueil »).
    pagesUnder: (entry) => `Les pages sous ${entry}`,
    collapse: 'Réduire',
    collapseTarget: 'la barre latérale',
    expand: 'Développer',
    expandSidebar: 'Développer la barre latérale',
    unseenCounts: 'avec des compteurs',
    unseenWarning: 'avec un avertissement',
    unseenWrong: 'avec un problème',
    entryWithBadge: ({ entry, badge }) => `${entry}, ${badge}`,
    breadcrumb: 'Fil d’Ariane',
    showHiddenPages: 'Afficher les pages masquées',
    home: 'Accueil',
    pageNotFound: 'Page introuvable',
    account: 'Compte',
    signOut: 'Se déconnecter',
    signInDivider: 'ou',
    singleSignOn: 'Authentification unique',
    state: 'État',
    allGood: 'Tout va bien',
    stateButton: ({ label, state }) => `${label} : ${state}`,
    stateLead: ({ lead, counts }) => `${lead} (${counts})`,
    stateCounts: ({ danger, warning, success }, { plural }) => [
        danger > 0 ? plural(danger, { other: '# à corriger' }) : '',
        warning > 0 ? plural(warning, { other: '# à surveiller' }) : '',
        success > 0 ? plural(success, { one: '# bonne nouvelle', other: '# bonnes nouvelles' }) : '',
    ]
        .filter(Boolean)
        .join(', '),
};
