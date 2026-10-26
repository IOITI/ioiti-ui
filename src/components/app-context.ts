import { createContext, useContext } from 'react'

/** The application's name, which ends the title of every tab ("Orders · My App"). None outside IoitiProvider. */
export const AppNameContext = createContext<string | null>(null)

export function useAppName(): string | null {
  return useContext(AppNameContext)
}
