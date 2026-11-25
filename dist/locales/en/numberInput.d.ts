/** NumberInput, Slider and RangeSlider, and a figure's change said in words (KpiChange: KpiTile's, KpiStrip's). */
export declare const numberInput: {
    /** "Decrease": the hint of NumberInput's − button. */
    decrease: string;
    /** "Increase": the hint of NumberInput's + button. */
    increase: string;
    /** "Price, from": the name of a RangeSlider's lower thumb, its label first. */
    rangeFrom: (label: string) => string;
    /** "Price, to": the name of a RangeSlider's upper thumb, its label first. */
    rangeTo: (label: string) => string;
    /** "20 € – 80 €": the range a RangeSlider holds, written above it. */
    rangeValue: ({ from, to }: {
        from: string;
        to: string;
    }) => string;
    /** "Range": a RangeSlider's name where its label is not text and it is given no `aria-label`. */
    rangeName: string;
    /** "unchanged": a change of nothing, for a screen reader. */
    changeNone: string;
    /** "up 2.5%": a rise, for a screen reader (which reads a sign badly), its figure without the sign. */
    changeUp: (figure: string) => string;
    /** "down 0.3%": a fall, for a screen reader, its figure without the sign. */
    changeDown: (figure: string) => string;
};
