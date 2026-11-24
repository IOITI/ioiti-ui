import type { Messages } from '../en.js'

export const shortcuts: Messages['shortcuts'] = {
  title: 'Raccourcis clavier',
  general: 'Général',
  navigation: 'Navigation',
  showShortcuts: 'Afficher les raccourcis clavier',
  showAgain: (keys) => `${keys} affiche à nouveau cette liste.`,
  toggleSidebar: 'Réduire ou développer la barre latérale',
}
