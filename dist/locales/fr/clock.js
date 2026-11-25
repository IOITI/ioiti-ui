export const clock = {
    title: 'Horloge mondiale',
    name: 'Heures dans le monde',
    cities: (count, { plural }) => plural(count, { one: '# ville', other: '# villes' }),
    timeZones: 'fuseaux horaires IANA',
    row: ({ time, city }) => `${time}, ${city}`,
};
