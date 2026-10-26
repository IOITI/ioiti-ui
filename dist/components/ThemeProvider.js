import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback, useLayoutEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { applyTheme, readPreference, resolveTheme, systemIsDark, themeStorageKey, watchSystem, writePreference, } from '../lib/theme.js';
import { ThemeContext } from './theme-context.js';
/**
 * Holds the theme for the whole interface, a sign-in page included. While the
 * preference is to follow the system, a change of the system setting (a phone
 * going dark in the evening) is followed at once.
 */
export function ThemeProvider({ storageKey, children }) {
    const key = useMemo(() => themeStorageKey(storageKey), [storageKey]);
    const [preference, setStored] = useState(() => readPreference(key));
    const systemDark = useSyncExternalStore(watchSystem, systemIsDark);
    const theme = resolveTheme(preference, systemDark);
    // Before the browser paints: no frame in the theme being left.
    useLayoutEffect(() => {
        applyTheme(theme);
    }, [theme]);
    const setPreference = useCallback((next) => {
        writePreference(next, key);
        setStored(next);
    }, [key]);
    const value = useMemo(() => ({ preference, theme, setPreference }), [preference, theme, setPreference]);
    return _jsx(ThemeContext.Provider, { value: value, children: children });
}
