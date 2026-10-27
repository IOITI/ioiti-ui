import type { ComponentProps } from 'react';
/**
 * React Router's link for the components that hand their link an `href`, as an `<a>` takes it:
 * `Link` reads `to`, and without it every link would lead to the page already shown.
 */
export declare function RouterLink({ href, ...props }: ComponentProps<'a'>): import("react").JSX.Element;
