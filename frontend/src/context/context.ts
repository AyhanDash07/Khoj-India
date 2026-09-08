import { createContext } from 'react'

export interface AppContextValue {
  isOnline: boolean
  setIsOnline: (value: boolean) => void
}

export const AppContext = createContext<AppContextValue | undefined>(
  undefined,
)