// The public interface of ioiti-ui. Named one by one, never `export *`: what a file keeps for
// itself stays out, and every change here is a change of the package's interface
// (src/index.test.ts holds the list).

export { cn, copyToClipboard, scrollToTop } from './lib/utils.js'
export { isPlainClick } from './lib/links.js'
export { motionTransitions } from './lib/motion-tokens.js'
export {
  DEFAULT_THEME_STORAGE_KEY,
  THEME_KEY_ATTRIBUTE,
  applyTheme,
  nextPreference,
  readPreference,
  resolveTheme,
  systemIsDark,
  themeLabel,
  themeStorageKey,
  watchSystem,
  writePreference,
} from './lib/theme.js'
export type { Theme, ThemePreference } from './lib/theme.js'

export { LinkProvider } from './components/LinkProvider.js'
export { useLinkComponent, useNavigateTo } from './components/link-context.js'
export type { NavigateTo } from './components/link-context.js'

export { Button, buttonClassName } from './components/ui/button.js'
export type { ButtonProps, ButtonSize, ButtonVariant } from './components/ui/button.js'
export { Sidebar, SidebarTrigger, useSidebar } from './components/ui/sidebar.js'
export type { SidebarChild, SidebarItem, SidebarProps, SidebarSection } from './components/ui/sidebar.js'
