import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ArrowLeft, Home } from 'lucide-react';
import { ButtonLink } from '../components/ButtonLink.js';
import { useNavigateTo } from '../components/link-context.js';
import { Button } from '../components/ui/button.js';
import { NotFound } from '../components/ui/not-found.js';
import { menuEntry, PAGE_NOT_FOUND } from './navigation.js';
import { usePageName, useTabTitle, useTrail } from './page-trail-context.js';
const HOME = { href: '/', label: 'Back to home' };
const BACK = { label: 'Previous page' };
/**
 * What a page shows when its address names nothing: the router's catch-all, or
 * a page whose record the server does not have (its 404). EasyUI's 404, named
 * in the trail and the tab as any page is, with the way home and back.
 */
export function NotFoundState({ title, description, name = title, parents, suggestions, pathname, home = HOME, back = BACK }) {
    const navigate = useNavigateTo();
    const trail = useTrail();
    usePageName(name, parents);
    useTabTitle(name);
    const path = pathname ?? trail?.pathname ?? window.location.pathname;
    return (_jsxs(NotFound, { title: title, description: description, path: path, suggestions: suggestions, children: [home && (_jsx(ButtonLink, { to: home.href, leftIcon: _jsx(Home, { className: "size-4" }), children: home.label })), back && (_jsx(Button, { variant: "outline", leftIcon: _jsx(ArrowLeft, { className: "size-4" }), onClick: () => navigate(-1), children: back.label }))] }));
}
/**
 * The page of an address that is no page (the router's catch-all, `path: '*'`). An address under
 * an entry of the menu that leads nowhere (an old link, a typo) suggests that entry.
 */
export function NotFoundPage({ title = 'There is no page here.', description = 'The address does not match any page of this application.', ...props }) {
    const trail = useTrail();
    const path = props.pathname ?? trail?.pathname ?? window.location.pathname;
    const entry = trail ? menuEntry(trail.menu, path) : undefined;
    return (_jsx(NotFoundState, { title: title, description: description, name: PAGE_NOT_FOUND, suggestions: entry && entry.path !== '/' ? [{ label: entry.label, href: entry.path, description: entry.section }] : undefined, ...props }));
}
