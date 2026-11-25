export const ai = {
    linkBlocked: 'Lien bloqué pour votre sécurité',
    emailHost: 'e-mail',
    table: 'Tableau',
    plainText: 'texte',
    // French writes it as English does.
    assistant: 'Assistant',
    streaming: 'Rédaction en cours',
    thinking: 'Réflexion en cours',
    // The answer (« la réponse ») stopped.
    stopped: 'Interrompue',
    generating: 'Génération de la réponse',
    unfinished: 'Impossible de terminer cette réponse',
    unfinishedReason: 'La connexion a été interrompue ou le modèle a mis trop de temps à répondre.',
    tryAgain: 'Réessayer',
    idle: 'Prêt quand vous l’êtes.',
    // French writes it as English does.
    sources: 'Sources',
    toolsUsed: (count, { plural }) => plural(count, { one: '# outil utilisé', other: '# outils utilisés' }),
    toolSuccess: 'succès',
    toolRunning: 'en cours',
    toolError: 'erreur',
    // The answer (« la réponse ») copied.
    copied: 'Copiée',
    copy: 'Copier',
    responseCopied: 'Réponse copiée',
    copyResponse: 'Copier la réponse',
    regenerate: 'Régénérer',
    regenerateResponse: 'Régénérer la réponse',
    goodResponse: 'Bonne réponse',
    poorResponse: 'Mauvaise réponse',
    response: 'Réponse de l’IA',
    activityTitle: 'Activité',
    activityRunning: 'En cours',
    // « 1 étape sur 3 terminée », « 2 étapes sur 3 terminées »: the steps named, which the words after them agree with.
    stepsDone: ({ done, count }, { plural, number }) => plural(done, { one: `# étape sur ${number(count)} terminée`, other: `# étapes sur ${number(count)} terminées` }),
    notStarted: 'Pas encore commencé',
    expandAll: 'Tout développer',
    collapseAll: 'Tout réduire',
    // French writes it as English does.
    codeSnippet: 'Code',
    noActivity: 'Aucune activité enregistrée',
    // Nouns, as headings: what was asked (« la demande ») and what came back.
    inputLabel: 'Demande',
    outputLabel: 'Réponse',
    // French writes it as English does.
    notesLabel: 'Notes',
    metadataEntry: (key) => `${key} :`,
    send: 'Envoyer',
    stop: 'Arrêter',
    suggestions: 'Demandes suggérées',
    attachments: 'Pièces jointes',
    attachmentPreparing: ', en cours de préparation',
    // « Retirer », not « Supprimer »: it is taken off the request, not deleted.
    removeAttachment: (label) => `Retirer ${label}`,
};
