import type { MessageKit } from '../../lib/messages.js';
/** Dialogs and confirmations: Dialog, Sheet, ConfirmAction, DragToConfirm. */
export declare const dialog: {
    /** "Close": a dialog's or a sheet's close button. */
    close: string;
    /** "Resize": the name of a sheet's edge, dragged or moved with the arrow keys to change its width. */
    resize: string;
    /** "400 px": the sheet's width, said by that edge. */
    width: (pixels: number, { number }: MessageKit) => string;
    /** "Content": the name of a sheet's body that scrolls, where the sheet has no title. */
    content: string;
    /** "Cancel": ConfirmAction's button that closes it, where the application names it nothing. */
    cancel: string;
    /** "Working…": what its slider says while the action is under way. */
    working: string;
    /** "Done": what its slider says once the action is done. */
    done: string;
    /** "Slide to confirm": DragToConfirm's words, where the application gives none. */
    slideToConfirm: string;
    /** "Confirmed ✓": what it says once confirmed. */
    confirmed: string;
};
