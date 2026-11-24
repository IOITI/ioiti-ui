import type { Messages } from '../en.js'

export const select: Messages['select'] = {
  placeholder: 'Sélectionner…',
  search: 'Rechercher…',
  noResults: 'Aucun résultat.',

  choosePlaceholder: 'Choisir…',
  nothingMatches: 'Aucun résultat',
  removeChoice: (label) => `Retirer ${label}`,
  hiddenChoices: (labels, { list }) => list(labels),
  clear: 'Effacer',
  // « Choix », which does not change with its number nor its gender, whatever is chosen: one alone is taken back (« -le »).
  atMost: (max, { plural }) =>
    plural(max, {
      one: '# choix au maximum : retirez-le pour en faire un autre.',
      other: '# choix au maximum : retirez-en un pour en faire un autre.',
    }),
  create: (text) => `Ajouter « ${text} »`,
}
