import { jsx as _jsx } from "react/jsx-runtime";
import { useContext, useMemo } from 'react';
import { LinkContext } from './link-context.js';
/**
 * The application's links, for every component that draws one. What leads to another page is a
 * link, which can be opened in another tab as well as followed; given the router's, it is followed
 * without loading the page again. A component given a link of its own (`linkComponent`) keeps it.
 */
export function LinkProvider({ component, navigate, children }) {
    const outer = useContext(LinkContext);
    const value = useMemo(() => ({ component: component ?? outer.component, navigate: navigate ?? outer.navigate }), [component, navigate, outer]);
    return _jsx(LinkContext.Provider, { value: value, children: children });
}
