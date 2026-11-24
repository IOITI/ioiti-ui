import { jsx as _jsx } from "react/jsx-runtime";
import { MotionConfig } from 'framer-motion';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { applyReducedMotion } from '../lib/motion.js';
import { AppNameContext } from './app-context.js';
import { ErrorReporterContext } from './error-context.js';
import { createShortcutRegistry, ShortcutsContext } from './shortcuts-context.js';
import { ThemeProvider } from './ThemeProvider.js';
/**
 * What every page of an application needs, put around its router: the theme (the system's, or
 * the one chosen), the animations as the system asks, the application's name, and the registry of
 * its keyboard shortcuts (useShortcut).
 */
export function IoitiProvider({ appName, themeStorageKey, reducedMotion = 'user', onError, children }) {
    // For the stylesheets (motion.css), before the browser paints.
    useLayoutEffect(() => {
        applyReducedMotion(reducedMotion);
        return () => applyReducedMotion('user');
    }, [reducedMotion]);
    // The application's keyboard shortcuts, its own.
    const [shortcuts] = useState(createShortcutRegistry);
    // The application's reporter, read when an error comes: one function for the pages, whatever is given at each render.
    const onErrorRef = useRef(onError);
    useEffect(() => {
        onErrorRef.current = onError;
    });
    const report = useCallback((error, details) => onErrorRef.current?.(error, details), []);
    return (_jsx(AppNameContext.Provider, { value: appName ?? null, children: _jsx(ErrorReporterContext.Provider, { value: onError ? report : null, children: _jsx(ShortcutsContext.Provider, { value: shortcuts, children: _jsx(ThemeProvider, { storageKey: themeStorageKey, children: _jsx(MotionConfig, { reducedMotion: reducedMotion, children: children }) }) }) }) }));
}
