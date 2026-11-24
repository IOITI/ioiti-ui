import type { Messages } from '../en.js'

// CodeMirror's words begin in small letters where its English does: the search panel's buttons and boxes are read after
// its fields.
export const code: Messages['code'] = {
  original: 'Original',
  modified: 'Modifié',
  side: ({ label, version }) => `${label} : ${version}`,
  changes: (count, { plural }) => (count === 0 ? 'Aucune modification' : plural(count, { one: '# modification', other: '# modifications' })),
  previousChange: 'Modification précédente',
  nextChange: 'Modification suivante',
  find: 'Rechercher',
  replace: 'Remplacer',
  findNext: 'suivant',
  findPrevious: 'précédent',
  selectMatches: 'tout',
  matchCase: 'respecter la casse',
  regexp: 'expression régulière',
  byWord: 'mot entier',
  replaceMatch: 'remplacer',
  replaceAll: 'tout remplacer',
  close: 'fermer',
  currentMatch: 'résultat actuel',
  onLine: 'à la ligne',
  // CodeMirror puts the count where `$` is, and knows no plural: said after a colon, it agrees with any count.
  replacedMatches: 'occurrences remplacées : $',
  replacedMatchOnLine: 'occurrence remplacée à la ligne $',
  goToLine: 'Aller à la ligne',
  go: 'aller',
  controlCharacter: 'Caractère de contrôle',
  selectionDeleted: 'Sélection supprimée',
  foldedLines: 'Lignes repliées',
  unfoldedLines: 'Lignes dépliées',
  foldedTo: 'à',
  foldedCode: 'code replié',
  unfold: 'déplier',
  foldLine: 'Replier la ligne',
  unfoldLine: 'Déplier la ligne',
  // As French editors name them.
  diagnostics: 'Problèmes',
  noDiagnostics: 'Aucun problème',
  // A diff folds four lines at least by default: always a plural.
  unchangedLines: '$ lignes inchangées',
  accept: 'Accepter',
  reject: 'Rejeter',
  revertChunk: 'Rétablir ce bloc',
}
