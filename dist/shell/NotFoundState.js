import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ArrowLeft, Home } from 'lucide-react';
import { ButtonLink } from '../components/ButtonLink.js';
import { useNavigateTo } from '../components/link-context.js';
import { useMessages } from '../components/locale-context.js';
import { Button } from '../components/ui/button.js';
import { NotFound } from '../components/ui/not-found.js';
import { menuEntry } from './navigation.js';
import { usePageName, useTabTitle, useTrail } from './page-trail-context.js';
/**
 * What a page shows when its address names nothing: the router's catch-all, or
 * a page whose record the server does not have (its 404). EasyUI's 404, named
 * in the trail and the tab as any page is, with the way home and back.
 */
export function NotFoundState({ title, description, name = title, parents, suggestions, pathname, home: givenHome, back: givenBack, focusOnMount = true, }) {
    // The ways on in the provider's language, those given over them (`null`, none).
    const words = useMessages().notFound;
    const home = givenHome === undefined ? { href: '/', label: words.backToHome } : givenHome;
    const back = givenBack === undefined ? { label: words.previousPage } : givenBack;
    const navigate = useNavigateTo();
    const trail = useTrail();
    usePageName(name, parents);
    useTabTitle(name);
    const path = pathname ?? trail?.pathname ?? window.location.pathname;
    return (_jsxs(NotFound, { title: title, description: description, path: path, suggestions: suggestions, focusOnMount: focusOnMount, children: [home && (_jsx(ButtonLink, { to: home.href, leftIcon: _jsx(Home, { className: "size-4" }), children: home.label })), back && (_jsx(Button, { variant: "outline", leftIcon: _jsx(ArrowLeft, { className: "size-4" }), onClick: () => navigate(-1), children: back.label }))] }));
}
/**
 * The page of an address that is no page (the router's catch-all, `path: '*'`). An address under
 * an entry of the menu that leads nowhere (an old link, a typo) suggests that entry. Its heading ("There is no page
 * here."), its words and its name in the trail ("Page not found") are the provider's language's, where none are given.
 */
export function NotFoundPage({ title, description, ...props }) {
    const { notFound: words, shell } = useMessages();
    const trail = useTrail();
    const path = props.pathname ?? trail?.pathname ?? window.location.pathname;
    // The shell's query goes with the shell's address, not with another one given.
    const entry = trail ? menuEntry(trail.menu, path, props.pathname === undefined ? trail.search : '') : undefined;
    return (_jsx(NotFoundState, { title: title ?? words.pageTitle, description: description ?? words.pageDescription, name: shell.pageNotFound, suggestions: entry && entry.path !== '/' ? [{ label: entry.label, href: entry.path, description: entry.section }] : undefined, ...props }));
}
