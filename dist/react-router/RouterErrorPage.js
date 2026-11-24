import { jsx as _jsx } from "react/jsx-runtime";
import { Lock } from 'lucide-react';
import { useEffect } from 'react';
import { isRouteErrorResponse, useLocation, useNavigate, useNavigation, useRouteError } from 'react-router';
import { reportOnce, useErrorReporter } from '../components/error-context.js';
import { ErrorState } from '../shell/ErrorState.js';
import { NotFoundPage } from '../shell/NotFoundState.js';
/**
 * What a route shows when it fails (a route's `errorElement`): its loader threw, its page threw as it drew, or its
 * code failed to load. A response of 404 is the page not found; 401, a session to sign in again; 403, a page the person
 * may not see; anything else, an ErrorState whose Try again runs the route again (its loader, its page), the shell's
 * `pending` bar showing meanwhile. On a route under the shell's (`RouterAppShell`'s) that holds every page, the shell
 * stays around it; on the root, it stands alone, its links then loading their page.
 */
export function RouterErrorPage({ report = true, signIn, focusOnMount }) {
    const error = useRouteError();
    const location = useLocation();
    const navigate = useNavigate();
    const navigation = useNavigation();
    const reporter = useErrorReporter();
    useEffect(() => {
        if (report)
            reportOnce(reporter, error, { source: 'route' });
    }, [error, report, reporter]);
    if (isRouteErrorResponse(error)) {
        if (error.status === 404)
            return _jsx(NotFoundPage, { focusOnMount: focusOnMount });
        if (error.status === 401) {
            return (_jsx(ErrorState, { title: "Sign in to see this page", description: "Your session may have ended: sign in again to come back to it.", error: error, icon: _jsx(Lock, {}), home: signIn ? { href: signIn.href, label: signIn.label ?? 'Sign in' } : undefined, focusOnMount: focusOnMount }));
        }
        if (error.status === 403) {
            return (_jsx(ErrorState, { title: "This page is not yours to see", description: "Your account may not open it. Ask whoever runs the application for access, or sign in with another account.", error: error, icon: _jsx(Lock, {}), focusOnMount: focusOnMount }));
        }
    }
    // The same address again: the router drops the error of a location it leaves, which a revalidation it answers at
    // once may never do, and runs the route's loaders again, the shell saying the page on its way (`pending`).
    const retry = () => void navigate({ pathname: location.pathname, search: location.search, hash: location.hash }, { replace: true });
    return _jsx(ErrorState, { error: error, onRetry: retry, retrying: navigation.state !== 'idle', focusOnMount: focusOnMount });
}
