import type { MessageKit } from '../../lib/messages.js'
import type { Messages } from '../en.js'

export const log: Messages['log'] = {
  empty: 'Rien n’a encore été journalisé.',
  search: (label: string) => `Rechercher dans ${label}`,
  searchPlaceholder: 'Rechercher',
  matchPosition: ({ index, count }: { index: number; count: number }) => `${index} sur ${count}`,
  noMatch: 'Aucun résultat',
  previousMatch: 'Résultat précédent',
  previousMatchHint: (keys: string) => `Résultat précédent (${keys})`,
  nextMatch: 'Résultat suivant',
  nextMatchHint: (keys: string) => `Résultat suivant (${keys})`,
  wrap: 'Retour automatique à la ligne',
  wrapped: 'Les longues lignes passent à la ligne',
  unwrapped: 'Les longues lignes défilent horizontalement',
  copy: 'Copier le journal',
  download: 'Télécharger le journal',
  downloadAs: (name: string) => `Télécharger sous le nom ${name}`,
  dropped: (count: number, { plural }: MessageKit) =>
    plural(count, { one: '# ligne précédente retirée', other: '# lignes précédentes retirées' }),
  jumpToEnd: 'Aller à la fin',
}
