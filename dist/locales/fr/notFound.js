export const notFound = {
    pageTitle: 'Il n’y a pas de page ici.',
    pageDescription: 'L’adresse ne correspond à aucune page de cette application.',
    backToHome: 'Retour à l’accueil',
    previousPage: 'Page précédente',
    // « S’égarer », as French says a page lost: « prendre un mauvais virage » would be English's turn word for word.
    title: 'Cette page s’est égarée.',
    description: 'La page demandée n’existe pas ou a peut-être été déplacée.',
    errorBadge: (code) => `Erreur ${code}`,
    errorHeading: ({ code, title }) => `Erreur ${code} : ${title}`,
    goHome: 'Retour à l’accueil',
    goBack: 'Revenir en arrière',
    helpfulLinks: 'Liens utiles',
    suggestions: 'Vous cherchiez peut-être',
    illustration: 'Un dossier en verre dépoli qui recouvre le nombre 404',
};
