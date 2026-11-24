export const numberInput = {
    decrease: 'Diminuer',
    increase: 'Augmenter',
    rangeFrom: (label) => `${label}, de`,
    rangeTo: (label) => `${label}, à`,
    rangeValue: ({ from, to }) => `${from} – ${to}`,
    rangeName: 'Plage',
    changeNone: 'stable',
    changeUp: (figure) => `en hausse de ${figure}`,
    changeDown: (figure) => `en baisse de ${figure}`,
};
