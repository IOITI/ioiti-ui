export declare const DEV_MESSAGES: {
    readonly 'dialog-unnamed': "a dialog has neither a title nor an aria-label or aria-labelledby: a screen reader says \"dialog\" and nothing else. Give it a title, or name it.";
    readonly 'chart-series-beyond-four': "more series on one chart than the four the design compares: the fifth and those after it are grey unless given a colour.";
    readonly 'locale-unknown': "IoitiProvider's locale is no language tag Intl knows (BCP 47: en-GB, fr-FR): the interface speaks and writes en-GB.";
    readonly 'locale-not-the-page': "IoitiProvider's locale is not the language of the page (<html lang>): a screen reader reads its words with the rules of the language lang names. Give lang the locale.";
    readonly 'undo-toast-untitled': "an UndoToast has no title: it says \"Done\" (toast.undoTitle in the catalogue), which tells nothing of what was done. Give it a title: \"2 files removed\".";
    readonly deprecated: "a name or a value the package deprecated is given: it works until 1.0, which removes it. Give what replaces it (CHANGELOG.md, Deprecated).";
};
export type DevMessageId = keyof typeof DEV_MESSAGES;
