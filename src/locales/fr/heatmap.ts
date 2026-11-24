import type { Messages } from '../en.js'

export const heatmap: Messages['heatmap'] = {
  unit: (count, { plural }) => plural(count, { one: 'contribution', other: 'contributions' }),
  less: 'Moins',
  more: 'Plus',
  summaryPerWeek: ({ total, unit }) => `${total} ${unit} par semaine`,
  summaryLastYear: ({ total, unit }) => `${total} ${unit} au cours de l’année écoulée`,
  // La période s’accorde avec son nombre : ses mots seuls passent par le pluriel, jamais le total ni l’unité, dont un
  // « # » serait remplacé par ce nombre.
  summaryLastMonths: ({ total, unit, months }, { plural }) =>
    `${total} ${unit} ${plural(months, { one: 'au cours du dernier mois', other: 'au cours des # derniers mois' })}`,
  summaryLastWeeks: ({ total, unit, weeks }, { plural }) =>
    `${total} ${unit} ${plural(weeks, { one: 'au cours de la dernière semaine', other: 'au cours des # dernières semaines' })}`,
  best: ({ title, value }) => `Meilleur : ${title} · ${value}`,
  worst: ({ title, value }) => `pire : ${title} · ${value}`,
  peak: ({ title, value }) => `Pic : ${title} · ${value}`,
  hourCell: ({ day, hour }) => `${day} · ${hour}`,
  label: (summary) => `Carte thermique de l’activité. ${summary}`,
  status: ({ title, value }) => `${title} : ${value}`,
}
