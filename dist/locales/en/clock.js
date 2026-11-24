/** AirportMatrixClock. */
export const clock = {
    /** "World clock": the board's heading, where it is given none. */
    title: 'World clock',
    /** "World times": the board's name for a screen reader, where it has no heading. */
    name: 'World times',
    /** "3 cities": the board's last line, where it is given none, before the slash. */
    cities: (count, { plural }) => plural(count, { one: '# city', other: '# cities' }),
    /** "IANA time zones": the board's last line, where it is given none, after the slash. */
    timeZones: 'IANA time zones',
    /** "22:52, Paris": a row as a screen reader reads it, its time and its city. */
    row: ({ time, city }) => `${time}, ${city}`,
};
