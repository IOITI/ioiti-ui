/** The router's parts (ioiti-ui/react-router): RouterErrorPage, RouterLeaveGuard. */
export declare const router: {
    /** "Sign in to see this page": the heading of a route that answered 401, a session that ended. */
    signInTitle: string;
    /** "Your session may have ended: sign in again to come back to it.": what to do about it. */
    signInDescription: string;
    /** "Sign in": the link to where a person signs in, where it is given no words. */
    signIn: string;
    /** "This page is not yours to see": the heading of a route that answered 403. */
    forbiddenTitle: string;
    /** "Your account may not open it. Ask whoever runs the application for access, or sign in with another account.": what to do about it. */
    forbiddenDescription: string;
    /** "Leave without saving?": RouterLeaveGuard's question, its dialog's title. */
    leaveTitle: string;
    /** "The changes on this page are not saved: leaving it loses them.": what is lost. */
    leaveMessage: string;
    /** "Stay": the button that stays on the page. */
    stay: string;
    /** "Leave": the button that leaves it, the changes lost. */
    leave: string;
};
