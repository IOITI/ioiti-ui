import { createContext, useContext } from 'react';
/** The application's name, which ends the title of every tab ("Orders · My App"). None outside IoitiProvider. */
export const AppNameContext = createContext(null);
export function useAppName() {
    return useContext(AppNameContext);
}
