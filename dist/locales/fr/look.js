// A theme said in a sentence, lower case: « sombre », « clair ».
const THEME = { light: 'clair', dark: 'sombre' };
export const look = {
    theme: 'Thème',
    system: 'Système',
    light: 'Clair',
    dark: 'Sombre',
    systemNow: (theme) => `Comme cet appareil : ${THEME[theme]} pour l’instant`,
    themeButton: ({ state, press }) => `Thème : ${state}. ${press}.`,
    followsSystem: (theme) => `suit le système (${THEME[theme]} pour l’instant)`,
    alwaysLight: 'toujours clair',
    alwaysDark: 'toujours sombre',
    pressToFollowSystem: 'Appuyer pour suivre le système',
    pressForLight: 'Appuyer pour un thème toujours clair',
    pressForDark: 'Appuyer pour un thème toujours sombre',
    // « Couleur », as macOS and Windows say an accent (« couleur d’accentuation »), short enough for a heading.
    accentAndMaterial: 'Couleur et matière',
    lookName: ({ accent, material }) => `Couleur et matière : ${accent.toLowerCase()}, ${material.toLowerCase()}`,
    lookDescription: ({ accent, material }) => `${accent}, ${material.toLowerCase()}`,
    accent: 'Couleur',
    material: 'Matière',
    accentNeutral: 'Neutre',
    accentViolet: 'Violet',
    accentIndigo: 'Indigo',
    accentBlue: 'Bleu',
    accentBloom: 'Floraison',
    accentLagoon: 'Lagon',
    // The northern lights (« aurore boréale »): « Aurore » alone would be the dawn.
    accentAurora: 'Boréale',
    accentDusk: 'Crépuscule',
    accentGolden: 'Heure dorée',
    // What it is beside glass, and of either gender (« matière opaque »).
    materialFlat: 'Opaque',
    materialGlass: 'Verre',
};
