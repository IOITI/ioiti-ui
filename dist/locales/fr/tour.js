export const tour = {
    position: ({ step, count }, { number }) => `${number(step)} sur ${number(count)}`,
    skip: 'Passer',
    goToStep: (step, { number }) => `Aller à l’étape ${number(step)}`,
    back: 'Précédent',
    next: 'Suivant',
    // A button, in the infinitive as French buttons are.
    done: 'Terminer',
};
