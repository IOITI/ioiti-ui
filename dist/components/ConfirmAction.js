import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useControllableState } from '../lib/controllable.js';
import { useMessages } from './locale-context.js';
import { Alert, AlertDescription } from './ui/alert.js';
import { Button } from './ui/button.js';
import { DragToConfirm } from './ui/drag-to-confirm.js';
import { Dialog } from './ui/settle-modal.js';
/**
 * The last step before an action that matters. The user reads what is about
 * to happen, then has to drag the slider to the end (with a keyboard: focus it
 * and press Enter): a deliberate gesture, not a button under the cursor.
 */
export function ConfirmAction({ open, defaultOpen = false, onOpenChange, title, description, confirmLabel, warning, gesture = 'slide', doneLabel, workingLabel, cancelLabel, pending = false, blocked = false, error, onConfirm, onClose, }) {
    const words = useMessages().dialog;
    // Open, held by the page or by the dialog (useControllableState); what closes it tells onOpenChange and onClose, never
    // while what it confirms is under way.
    const [shown, setShown] = useControllableState(open, defaultOpen, onOpenChange);
    const close = () => {
        setShown(false);
        onClose?.();
    };
    return (_jsx(Dialog, { open: shown, onOpenChange: (next) => {
            if (!next && !pending)
                close();
        }, title: title, closeOnBackdrop: !pending, showCloseButton: !pending, size: "md", footer: _jsxs(_Fragment, { children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: close, disabled: pending, children: cancelLabel ?? words.cancel }), gesture === 'button' && (_jsx(Button, { size: "sm", pending: pending, disabled: blocked, onClick: onConfirm, children: confirmLabel }))] }), children: _jsxs("div", { className: "space-y-4", children: [warning && (_jsx(Alert, { tone: "warning", children: _jsx(AlertDescription, { children: warning }) })), _jsx("div", { className: "text-sm leading-relaxed text-text-secondary", children: description }), error && (_jsx(Alert, { tone: "danger", role: "alert", children: _jsx(AlertDescription, { children: error }) })), gesture === 'slide' && (_jsx(DragToConfirm
                // A fresh slider every time the dialog opens or an attempt failed.
                , { label: confirmLabel, confirmedLabel: pending ? (workingLabel ?? words.working) : (doneLabel ?? words.done), tone: "warning", autoResetDelay: 0, haptic: false, disabled: pending || blocked, onConfirm: onConfirm }, `${shown}-${error ?? ''}`))] }) }));
}
