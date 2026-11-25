/** NotFoundState, NotFoundPage and NotFound (the 404 they draw): what is not there, and the ways on. */
export const notFound = {
    /** "There is no page here.": NotFoundPage's heading, where it is given none. */
    pageTitle: 'There is no page here.',
    /** "The address does not match any page of this application.": NotFoundPage's words under it. */
    pageDescription: 'The address does not match any page of this application.',
    /** "Back to home": NotFoundState's link home, where it is given none. */
    backToHome: 'Back to home',
    /** "Previous page": NotFoundState's step back in the tab's history, where it is given none. */
    previousPage: 'Previous page',
    /** "This page took a wrong turn.": NotFound's heading, where it is given none. */
    title: 'This page took a wrong turn.',
    /** "The requested page doesn't exist or may have moved.": NotFound's words under it, where it is given none. */
    description: "The requested page doesn't exist or may have moved.",
    /** "Error 404": the badge above the heading, the error's code in it. */
    errorBadge: (code) => `Error ${code}`,
    /** "Error 404: There is no page here.": the page as a screen reader hears it first, its code and its heading. */
    errorHeading: ({ code, title }) => `Error ${code}: ${title}`,
    /** "Go back home": NotFound's link home, where it is given no words of its own. */
    goHome: 'Go back home',
    /** "Go back": NotFound's step back, where it is given no words of its own. */
    goBack: 'Go back',
    /** "Helpful links": the name of the pages it suggests. */
    helpfulLinks: 'Helpful links',
    /** "Maybe you were looking for": the heading of the pages it suggests. */
    suggestions: 'Maybe you were looking for',
    /** "A frosted glass folder covering the number 404": its drawing, for a screen reader. */
    illustration: 'A frosted glass folder covering the number 404',
};
