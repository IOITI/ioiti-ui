// What devWarn says to a developer, by its id: kept apart from the code that calls it, so that a production build,
// which never reaches devWarn's words, leaves this table out with them (scripts/check-package.mjs holds it).
export const DEV_MESSAGES = {
    'dialog-unnamed': 'a dialog has neither a title nor an aria-label or aria-labelledby: a screen reader says "dialog" and nothing else. Give it a title, or name it.',
    'chart-series-beyond-four': 'more series on one chart than the four the design compares: the fifth and those after it are grey unless given a colour.',
    'locale-unknown': "IoitiProvider's locale is no language tag Intl knows (BCP 47: en-GB, fr-FR): the interface speaks and writes en-GB.",
    'locale-not-the-page': "IoitiProvider's locale is not the language of the page (<html lang>): a screen reader reads its words with the rules of the language lang names. Give lang the locale.",
    'undo-toast-untitled': 'an UndoToast has no title: it says "Done" (toast.undoTitle in the catalogue), which tells nothing of what was done. Give it a title: "2 files removed".',
    deprecated: 'a name or a value the package deprecated is given: it works until 1.0, which removes it. Give what replaces it (CHANGELOG.md, Deprecated).',
};
