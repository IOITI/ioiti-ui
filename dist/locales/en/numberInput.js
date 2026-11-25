/** NumberInput, Slider and RangeSlider, and a figure's change said in words (KpiChange: KpiTile's, KpiStrip's). */
export const numberInput = {
    /** "Decrease": the hint of NumberInput's − button. */
    decrease: 'Decrease',
    /** "Increase": the hint of NumberInput's + button. */
    increase: 'Increase',
    /** "Price, from": the name of a RangeSlider's lower thumb, its label first. */
    rangeFrom: (label) => `${label}, from`,
    /** "Price, to": the name of a RangeSlider's upper thumb, its label first. */
    rangeTo: (label) => `${label}, to`,
    /** "20 € – 80 €": the range a RangeSlider holds, written above it. */
    rangeValue: ({ from, to }) => `${from} – ${to}`,
    /** "Range": a RangeSlider's name where its label is not text and it is given no `aria-label`. */
    rangeName: 'Range',
    /** "unchanged": a change of nothing, for a screen reader. */
    changeNone: 'unchanged',
    /** "up 2.5%": a rise, for a screen reader (which reads a sign badly), its figure without the sign. */
    changeUp: (figure) => `up ${figure}`,
    /** "down 0.3%": a fall, for a screen reader, its figure without the sign. */
    changeDown: (figure) => `down ${figure}`,
};
