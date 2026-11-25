export const field = {
    save: 'Enregistrer',
    saving: 'Enregistrement…',
    cancel: 'Annuler',
    addValue: 'Ajouter une valeur',
    // The label as it is given, after a colon: an article before it would agree with it (« le nom », « la date »), which
    // the field does not know.
    edit: (label) => `modifier : ${label}`,
    saveFailed: 'Échec de l’enregistrement. Réessayez.',
    unsavedChanges: 'Modifications non enregistrées',
    discard: 'Ignorer',
    showPassword: 'Afficher le mot de passe',
    hidePassword: 'Masquer le mot de passe',
    otpName: 'Code à usage unique',
    otpDigit: ({ index, count }, { number }) => `Chiffre ${number(index)} sur ${number(count)}`,
    copy: 'Copier',
    // The application's words for what is copied, with their article: « la clé » makes « Copier la clé ».
    copyNamed: (what) => `Copier ${what}`,
    // A noun: « Copié » would agree with what is copied, whose gender the button does not know.
    copied: 'Copie effectuée',
    copyFailed: 'Échec de la copie',
    copyCode: 'Copier le code',
    // « Code » alone would be English's word, which the catalogue's test takes for one left untranslated.
    code: 'Bloc de code',
    exportCsv: 'Exporter en CSV',
    // The main action's label between guillemets, as it is given: a verb (« Enregistrer ») or a noun, whose gender an
    // article or « de » would have to agree with.
    moreOptions: (label) => `Autres options pour « ${label} »`,
};
