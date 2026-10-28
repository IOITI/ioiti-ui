import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useBlocker } from 'react-router';
import { Button } from '../components/ui/button.js';
import { SettleModal } from '../components/ui/settle-modal.js';
/** Whether an address is the one given or under it: `/settings/mail` is under `/settings`, `/settingsx` is not. */
function isUnder(pathname, root) {
    const base = root.replace(/\/+$/, '');
    return base === '' || pathname === base || pathname.startsWith(`${base}/`);
}
/** Mounted only while there is something to lose: no blocker at rest, which every link would wake. */
function Guard({ within, allowed, title, message, stayLabel, leaveLabel }) {
    // Another page only: a change of the query or of the part shown is no leaving, nor one of the page's
    // own views, nor an address it is allowed to go to.
    const blocker = useBlocker(({ currentLocation, nextLocation }) => {
        const next = nextLocation.pathname;
        if (next === currentLocation.pathname)
            return false;
        if (within !== undefined && isUnder(currentLocation.pathname, within) && isUnder(next, within))
            return false;
        return !allowed?.(next);
    });
    const blocked = blocker.state === 'blocked';
    // Gone while a page was asked for (saved meanwhile): the page asked for is not left waiting.
    useEffect(() => () => {
        if (blocker.state === 'blocked')
            blocker.reset();
    }, [blocker]);
    return (_jsx(SettleModal, { open: blocked, onClose: () => blocker.reset?.(), title: title, description: message, size: "sm", footer: _jsxs(_Fragment, { children: [_jsx(Button, { variant: "destructive", onClick: () => blocker.proceed?.(), children: leaveLabel }), _jsx(Button, { onClick: () => blocker.reset?.(), children: stayLabel })] }) }));
}
/**
 * Asks before the page is left with changes not saved: another page of the application (a dialog, Stay or
 * Leave), or the browser's tab closed or reloaded (the browser's own question). Beside a `SaveBar`, with the
 * same `when`. Needs a data router (`createBrowserRouter`), whose navigations can wait.
 */
export function RouterLeaveGuard({ when, within, allowed, title = 'Leave without saving?', message = 'The changes on this page are not saved: leaving it loses them.', stayLabel = 'Stay', leaveLabel = 'Leave', }) {
    useEffect(() => {
        if (!when)
            return;
        const ask = (event) => {
            event.preventDefault();
            // Older browsers ask only when this is set.
            event.returnValue = '';
        };
        window.addEventListener('beforeunload', ask);
        return () => window.removeEventListener('beforeunload', ask);
    }, [when]);
    return when ? (_jsx(Guard, { within: within, allowed: allowed, title: title, message: message, stayLabel: stayLabel, leaveLabel: leaveLabel })) : null;
}
