/** Fields and their actions: InlineEdit, SaveBar, the form, OTPInput, CopyChip, CopyButton, ExportButton, CodeBlock. */
export const field = {
    /** "Save": InlineEdit's button that saves the value typed, and SaveBar's, where the application says nothing (`saveLabel`). */
    save: 'Save',
    /** "Saving": SaveBar's Save button while the save is on its way. */
    saving: 'Saving',
    /** "Cancel": InlineEdit's button that gives up what was typed. */
    cancel: 'Cancel',
    // InlineEdit.
    /** "Add a value": what an empty value says, where the application says nothing (`placeholder`). */
    addValue: 'Add a value',
    /** "edit the name of the run": said to a screen reader after the value, its label given (it lowercases it). */
    edit: (label) => `edit the ${label.toLowerCase()}`,
    /** "Couldn’t save. Try again.": what the field says when the save failed without saying why. */
    saveFailed: 'Couldn’t save. Try again.',
    // SaveBar.
    /** "Unsaved changes": what the bar says, and its name, where the application says nothing (`message`, `label`). */
    unsavedChanges: 'Unsaved changes',
    /** "Discard": the button that gives up the changes, where the application says nothing (`discardLabel`). */
    discard: 'Discard',
    // The form.
    /** "Show password": the button that shows what a password field holds. */
    showPassword: 'Show password',
    /** "Hide password": that button while it is shown. */
    hidePassword: 'Hide password',
    /** "One-time passcode": OTPInput's name, where the application gives none. */
    otpName: 'One-time passcode',
    /** "Digit 2 of 6": the name of a box of OTPInput. */
    otpDigit: ({ index, count }, { number }) => `Digit ${number(index)} of ${number(count)}`,
    // CopyButton, CopyChip, CodeBlock.
    /** "Copy": CopyButton's name and hint, where the application says nothing (`label`); CopyChip's without a label. */
    copy: 'Copy',
    /** "Copy the key": CopyChip's button, what it copies given (`label`). */
    copyNamed: (what) => `Copy ${what}`,
    /** "Copied": what the button says once the value is copied. */
    copied: 'Copied',
    /** "Couldn’t copy": what it says when the clipboard refused it. */
    copyFailed: 'Couldn’t copy',
    /** "Copy the code": CodeBlock's copy button. */
    copyCode: 'Copy the code',
    /** "Code": the name of CodeBlock's code that scrolls, where it has no label. */
    code: 'Code',
    // ExportButton.
    /** "Export CSV": the button that saves the rows as a CSV file. */
    exportCsv: 'Export CSV',
};
