import type { Messages } from '../en.js'

export const upload: Messages['upload'] = {
  dropTitle: 'Déposez des fichiers ici',
  dropSubtitle: 'ou parcourez votre appareil',
  upTo: (size) => `(jusqu’à ${size})`,
  // « Importer », as French software says it (« téléverser » is the official word, rarely written).
  label: 'Importer des fichiers',
  // The file (« le fichier ») ready.
  ready: 'Prêt',
  processing: 'Traitement…',
  uploading: (progress) => `Importation ${progress}`,
  files: (count, { number }) => `Fichiers (${number(count)})`,
  clearCompleted: 'Retirer les fichiers importés',
  tooLarge: (size) => `Le fichier dépasse la taille maximale autorisée (${size})`,
  failed: 'Échec de l’importation',
  // « d’importer » before the name: a name starting with a vowel would elide « de ».
  retry: (name) => `Réessayer d’importer ${name}`,
  remove: (name) => `Retirer ${name}`,
}
