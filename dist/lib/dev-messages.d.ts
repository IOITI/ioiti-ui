export declare const DEV_MESSAGES: {
    readonly 'dialog-unnamed': "a dialog has neither a title nor an aria-label or aria-labelledby: a screen reader says \"dialog\" and nothing else. Give it a title, or name it.";
    readonly 'chart-series-beyond-four': "more series on one chart than the four the design compares: the fifth and those after it are grey unless given a colour.";
};
export type DevMessageId = keyof typeof DEV_MESSAGES;
