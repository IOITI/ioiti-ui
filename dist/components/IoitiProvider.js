import { jsx as _jsx } from "react/jsx-runtime";
import { MotionConfig } from 'framer-motion';
import { AppNameContext } from './app-context.js';
import { ThemeProvider } from './ThemeProvider.js';
/**
 * What every page of an application needs, put around its router: the theme (the system's, or
 * the one chosen), the animations as the system asks, and the application's name.
 */
export function IoitiProvider({ appName, themeStorageKey, reducedMotion = 'user', children }) {
    return (_jsx(AppNameContext.Provider, { value: appName ?? null, children: _jsx(ThemeProvider, { storageKey: themeStorageKey, children: _jsx(MotionConfig, { reducedMotion: reducedMotion, children: children }) }) }));
}
