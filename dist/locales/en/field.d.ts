import type { MessageKit } from '../../lib/messages.js';
/** Fields and their actions: InlineEdit, SaveBar, the form, OTPInput, CopyChip, CopyButton, ExportButton, CodeBlock, SplitButton. */
export declare const field: {
    /** "Save": InlineEdit's button that saves the value typed, and SaveBar's, where the application says nothing (`saveLabel`). */
    save: string;
    /** "Saving": SaveBar's Save button while the save is on its way. */
    saving: string;
    /** "Cancel": InlineEdit's button that gives up what was typed. */
    cancel: string;
    /** "Add a value": what an empty value says, where the application says nothing (`placeholder`). */
    addValue: string;
    /** "edit the name of the run": said to a screen reader after the value, its label given (it lowercases it). */
    edit: (label: string) => string;
    /** "Couldn’t save. Try again.": what the field says when the save failed without saying why. */
    saveFailed: string;
    /** "Unsaved changes": what the bar says, and its name, where the application says nothing (`message`, `label`). */
    unsavedChanges: string;
    /** "Discard": the button that gives up the changes, where the application says nothing (`discardLabel`). */
    discard: string;
    /** "Show password": the button that shows what a password field holds. */
    showPassword: string;
    /** "Hide password": that button while it is shown. */
    hidePassword: string;
    /** "One-time passcode": OTPInput's name, where the application gives none. */
    otpName: string;
    /** "Digit 2 of 6": the name of a box of OTPInput. */
    otpDigit: ({ index, count }: {
        index: number;
        count: number;
    }, { number }: MessageKit) => string;
    /** "Copy": CopyButton's name and hint, where the application says nothing (`label`); CopyChip's without a label. */
    copy: string;
    /** "Copy the key": CopyChip's button, what it copies given (`label`). */
    copyNamed: (what: string) => string;
    /** "Copied": what the button says once the value is copied. */
    copied: string;
    /** "Couldn’t copy": what it says when the clipboard refused it. */
    copyFailed: string;
    /** "Copy the code": CodeBlock's copy button. */
    copyCode: string;
    /** "Code": the name of CodeBlock's code that scrolls, where it has no label. */
    code: string;
    /** "Export CSV": the button that saves the rows as a CSV file. */
    exportCsv: string;
    /** "More Save options": the name of the chevron and of its menu, its main action's label given (`menuLabel` over it). */
    moreOptions: (label: string) => string;
};
