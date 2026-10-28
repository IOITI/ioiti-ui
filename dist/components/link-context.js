import { createContext, useContext } from 'react';
function navigateWithTheWindow(to) {
    if (typeof to === 'number')
        window.history.go(to);
    else
        window.location.assign(to);
}
// Outside a provider (no router, or a component rendered alone in a test): plain links, and the window's history.
export const LinkContext = createContext({ component: 'a', navigate: navigateWithTheWindow });
/** The link a component draws: the one it was given, else the application's (LinkProvider), else `<a>`. */
export function useLinkComponent(given) {
    const { component } = useContext(LinkContext);
    return given ?? component;
}
/** Follows an address from code, through the application's router when it gave one (LinkProvider). */
export function useNavigateTo() {
    return useContext(LinkContext).navigate;
}
