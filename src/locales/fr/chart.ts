import type { Messages } from '../en.js'

export const chart: Messages['chart'] = {
  noData: 'Aucune donnée',
  tableCaption: 'Données du graphique',
  seriesLegend: 'Séries',
  legend: 'Légende',
  detailsColumn: 'Détails',
  // French writes it as English does.
  total: 'Total',
  namedValue: ({ name, value }) => `${name} : ${value}`,

  lineChartName: (series, { list }) => `Graphique en courbes : ${list(series)}`,
  timeColumn: 'Date',

  fanChartName: (lines, { list }) => `Graphique en éventail : ${list(lines)}`,
  placeColumn: 'Position',
  bandRange: ({ low, high }) => `de ${low} à ${high}`,

  barChartName: ({ series, count }, { list, plural }) =>
    `Graphique à barres : ${list(series)}, sur ${plural(count, { one: '# catégorie', other: '# catégories' })}`,
  categoryColumn: 'Catégorie',

  donutChartName: (total) => `Graphique en anneau. Total : ${total}`,
  gaugeChartName: (total) => `Graphique en jauge. Total : ${total}`,
  otherSegment: 'Autres',
  segmentColumn: 'Secteur',
  valueColumn: 'Valeur',
  shareColumn: 'Part',

  // The stages' names between guillemets: one may start with a vowel, before which « de » would be elided.
  funnelChartName: ({ count, first, last }, { plural }) =>
    `Entonnoir de ${plural(count, { one: '# étape', other: '# étapes' })}, de « ${first} » à « ${last} »`,
  funnelTableCaption: 'Données de l’entonnoir',
  conversionSummary: 'de conversion globale',
  biggestDrop: 'Plus forte perte :',
  funnelCounted: 'Utilisateurs',
  shareOfFirstStage: 'De la première étape',
  // A noun, whatever the funnel counts: « perdus » would have to agree with it.
  lossToNextStage: 'Perte à l’étape suivante',
  noLoss: 'aucune',
  stageColumn: 'Étape',
  firstStageShareColumn: '% de la première étape',

  previousPeriod: 'vs période précédente',
  // « Sans changement », which agrees with no name: « inchangé » would have to agree with the figure's.
  statCardName: ({ name, value, direction, change }) =>
    `${name} : ${value}, ${direction === 'up' ? `en hausse de ${change}` : direction === 'down' ? `en baisse de ${change}` : 'sans changement'}`,
  trendName: ({ name, first, last }) => `${name} : évolution de ${first} à ${last}`,
  trendPoint: (index) => `Point ${index}`,

  sparklineSummary: ({ first, last, high, low }) => `de ${first} à ${last}, maximum ${high}, minimum ${low}`,

  liveChartName: ({ span, value, unit }) =>
    `Graphique en direct sur les dernières ${span}${value === undefined ? '' : `, actuellement ${value} ${unit}`}`,
  liveWindow: (span) => `sur les dernières ${span}`,
  pauseLive: 'Mettre en pause les mises à jour en direct',
  resumeLive: 'Reprendre les mises à jour en direct',
  live: 'En direct',
  paused: 'En pause',
  livePausedStatus: 'Mises à jour en direct en pause',
  now: 'maintenant',
  beforeNow: (span) => `−${span}`,
}
