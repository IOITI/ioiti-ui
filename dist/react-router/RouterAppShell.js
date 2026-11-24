import { jsx as _jsx } from "react/jsx-runtime";
import { Outlet, useLocation } from 'react-router';
import { AppShell } from '../shell/AppShell.js';
/** AppShell, for the layout route of an application on React Router: the address is the router's. */
export function RouterAppShell({ children, ...props }) {
    const { pathname } = useLocation();
    return (_jsx(AppShell, { ...props, pathname: pathname, children: children ?? _jsx(Outlet, {}) }));
}
