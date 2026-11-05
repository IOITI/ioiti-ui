import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Alert, AlertDescription } from './ui/alert.js';
import { Button } from './ui/button.js';
import { DragToConfirm } from './ui/drag-to-confirm.js';
import { SettleModal } from './ui/settle-modal.js';
/**
 * The last step before an action that matters. The user reads what is about
 * to happen, then has to drag the slider to the end (with a keyboard: focus it
 * and press Enter): a deliberate gesture, not a button under the cursor.
 */
export function ConfirmAction({ open, title, description, confirmLabel, warning, gesture = 'slide', doneLabel = 'Done', workingLabel = 'Working…', cancelLabel = 'Cancel', pending = false, blocked = false, error, onConfirm, onClose, }) {
    return (_jsx(SettleModal, { open: open, onClose: pending ? () => { } : onClose, title: title, closeOnBackdrop: !pending, hideCloseButton: pending, size: "md", footer: _jsxs(_Fragment, { children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: onClose, disabled: pending, children: cancelLabel }), gesture === 'button' && (_jsx(Button, { size: "sm", isLoading: pending, disabled: blocked, onClick: onConfirm, children: confirmLabel }))] }), children: _jsxs("div", { className: "space-y-4", children: [warning && (_jsx(Alert, { tone: "warning", children: _jsx(AlertDescription, { children: warning }) })), _jsx("div", { className: "text-sm leading-relaxed text-text-secondary", children: description }), error && (_jsx(Alert, { tone: "danger", role: "alert", children: _jsx(AlertDescription, { children: error }) })), gesture === 'slide' && (_jsx(DragToConfirm
                // A fresh slider every time the dialog opens or an attempt failed.
                , { label: confirmLabel, confirmedLabel: pending ? workingLabel : doneLabel, variant: "warning", autoResetDelay: 0, haptic: false, disabled: pending || blocked, onConfirm: onConfirm }, `${open}-${error ?? ''}`))] }) }));
}
