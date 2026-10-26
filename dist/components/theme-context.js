import { createContext, useContext } from 'react';
// Outside a provider (a component rendered alone in a test), the interface is as it always was: dark.
export const ThemeContext = createContext({ preference: 'dark', theme: 'dark', setPreference: () => { } });
export function useTheme() {
    return useContext(ThemeContext);
}
