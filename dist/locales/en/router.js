/** The router's parts (ioiti-ui/react-router): RouterErrorPage, RouterLeaveGuard. */
export const router = {
    /** "Sign in to see this page": the heading of a route that answered 401, a session that ended. */
    signInTitle: 'Sign in to see this page',
    /** "Your session may have ended: sign in again to come back to it.": what to do about it. */
    signInDescription: 'Your session may have ended: sign in again to come back to it.',
    /** "Sign in": the link to where a person signs in, where it is given no words. */
    signIn: 'Sign in',
    /** "This page is not yours to see": the heading of a route that answered 403. */
    forbiddenTitle: 'This page is not yours to see',
    /** "Your account may not open it. Ask whoever runs the application for access, or sign in with another account.": what to do about it. */
    forbiddenDescription: 'Your account may not open it. Ask whoever runs the application for access, or sign in with another account.',
    /** "Leave without saving?": RouterLeaveGuard's question, its dialog's title. */
    leaveTitle: 'Leave without saving?',
    /** "The changes on this page are not saved: leaving it loses them.": what is lost. */
    leaveMessage: 'The changes on this page are not saved: leaving it loses them.',
    /** "Stay": the button that stays on the page. */
    stay: 'Stay',
    /** "Leave": the button that leaves it, the changes lost. */
    leave: 'Leave',
};
