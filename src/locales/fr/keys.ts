import type { Messages } from '../en.js'

// The keys as French keyboards print them and French software names them (« Maj+Entrée », « Ctrl+Suppr »), Apple's
// as macOS says them in French (« Commande », « Contrôle », « Option », « Maj »).
export const keys: Messages['keys'] = {
  ctrl: 'Ctrl',
  alt: 'Alt',
  shift: 'Maj',
  meta: 'Méta',
  command: 'Commande',
  control: 'Contrôle',
  option: 'Option',
  enter: 'Entrée',
  escape: 'Échap',
  // As French says it, the key's own name.
  escapeSpoken: 'Échap',
  tab: 'Tab',
  space: 'Espace',
  backspace: 'Retour arrière',
  delete: 'Suppr',
  deleteSpoken: 'Supprimer',
  arrowUp: 'Flèche haut',
  arrowDown: 'Flèche bas',
  arrowLeft: 'Flèche gauche',
  arrowRight: 'Flèche droite',
  pageUp: 'Pg préc',
  pageUpSpoken: 'Page précédente',
  pageDown: 'Pg suiv',
  pageDownSpoken: 'Page suivante',
  home: 'Début',
  end: 'Fin',
  then: 'puis',
}
