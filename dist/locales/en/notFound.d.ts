/** NotFoundState, NotFoundPage and NotFound (the 404 they draw): what is not there, and the ways on. */
export declare const notFound: {
    /** "There is no page here.": NotFoundPage's heading, where it is given none. */
    pageTitle: string;
    /** "The address does not match any page of this application.": NotFoundPage's words under it. */
    pageDescription: string;
    /** "Back to home": NotFoundState's link home, where it is given none. */
    backToHome: string;
    /** "Previous page": NotFoundState's step back in the tab's history, where it is given none. */
    previousPage: string;
    /** "This page took a wrong turn.": NotFound's heading, where it is given none. */
    title: string;
    /** "The requested page doesn't exist or may have moved.": NotFound's words under it, where it is given none. */
    description: string;
    /** "Error 404": the badge above the heading, the error's code in it. */
    errorBadge: (code: string) => string;
    /** "Error 404: There is no page here.": the page as a screen reader hears it first, its code and its heading. */
    errorHeading: ({ code, title }: {
        code: string;
        title: string;
    }) => string;
    /** "Go back home": NotFound's link home, where it is given no words of its own. */
    goHome: string;
    /** "Go back": NotFound's step back, where it is given no words of its own. */
    goBack: string;
    /** "Helpful links": the name of the pages it suggests. */
    helpfulLinks: string;
    /** "Maybe you were looking for": the heading of the pages it suggests. */
    suggestions: string;
    /** "A frosted glass folder covering the number 404": its drawing, for a screen reader. */
    illustration: string;
};
