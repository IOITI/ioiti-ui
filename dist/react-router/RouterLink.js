import { jsx as _jsx } from "react/jsx-runtime";
import { Link } from 'react-router';
/**
 * React Router's link for the components that hand their link an `href`, as an `<a>` takes it:
 * `Link` reads `to`, and without it every link would lead to the page already shown.
 */
export function RouterLink({ href = '', ...props }) {
    return _jsx(Link, { to: href, ...props });
}
