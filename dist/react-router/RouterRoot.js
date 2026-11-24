import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { LinkProvider } from '../components/LinkProvider.js';
import { ToastProvider } from '../components/ToastProvider.js';
import { RouterLink } from './RouterLink.js';
/**
 * The root route of an application on React Router: every link of ioiti-ui goes through the
 * router (opened in another tab with a modifier, as any link), and the toasts are shown.
 */
export function RouterRoot({ children, toastWrapperClassName }) {
    const navigate = useNavigate();
    const navigateTo = useCallback((to) => {
        if (typeof to === 'number')
            void navigate(to);
        else
            void navigate(to);
    }, [navigate]);
    return (_jsx(LinkProvider, { component: RouterLink, navigate: navigateTo, children: _jsx(ToastProvider, { wrapperClassName: toastWrapperClassName, children: children ?? _jsx(Outlet, {}) }) }));
}
