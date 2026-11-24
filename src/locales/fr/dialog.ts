import type { Messages } from '../en.js'

export const dialog: Messages['dialog'] = {
  close: 'Fermer',
  resize: 'Redimensionner',
  width: (pixels, { number }) => `${number(pixels)} px`,
  content: 'Contenu',
  cancel: 'Annuler',
  working: 'En cours…',
  // What was done (« c’est terminé »), not a button.
  done: 'Terminé',
  slideToConfirm: 'Glisser pour confirmer',
  confirmed: 'Confirmé ✓',
}
