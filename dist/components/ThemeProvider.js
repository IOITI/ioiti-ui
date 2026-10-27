import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback, useLayoutEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { applyAccent, applyMaterial, applyTheme, readAccent, readMaterial, readPreference, resolveAccent, resolveMaterial, resolveTheme, shownAccent, shownMaterial, systemIsDark, themeStorageKey, watchSystem, writeAccent, writeMaterial, writePreference, } from '../lib/theme.js';
import { ThemeContext } from './theme-context.js';
/**
 * Holds the theme for the whole interface, a sign-in page included. While the
 * preference is to follow the system, a change of the system setting (a phone
 * going dark in the evening) is followed at once. Holds the accent and the
 * material too: the ones chosen in this browser, else the application's, which
 * the pre-paint script wrote on <html>.
 */
export function ThemeProvider({ storageKey, children }) {
    const key = useMemo(() => themeStorageKey(storageKey), [storageKey]);
    const [preference, setStored] = useState(() => readPreference(key));
    const systemDark = useSyncExternalStore(watchSystem, systemIsDark);
    const theme = resolveTheme(preference, systemDark);
    const [accent, setAccentShown] = useState(() => resolveAccent(readAccent(key), shownAccent()));
    const [material, setMaterialShown] = useState(() => resolveMaterial(readMaterial(key), shownMaterial()));
    // Before the browser paints: no frame in the theme being left.
    useLayoutEffect(() => {
        applyTheme(theme);
    }, [theme]);
    useLayoutEffect(() => {
        applyAccent(accent);
    }, [accent]);
    useLayoutEffect(() => {
        applyMaterial(material);
    }, [material]);
    const setPreference = useCallback((next) => {
        writePreference(next, key);
        setStored(next);
    }, [key]);
    const setAccent = useCallback((next) => {
        writeAccent(next, key);
        setAccentShown(next);
    }, [key]);
    const setMaterial = useCallback((next) => {
        writeMaterial(next, key);
        setMaterialShown(next);
    }, [key]);
    const value = useMemo(() => ({ preference, theme, setPreference, accent, material, setAccent, setMaterial }), [preference, theme, setPreference, accent, material, setAccent, setMaterial]);
    return _jsx(ThemeContext.Provider, { value: value, children: children });
}
