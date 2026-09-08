import { useMemo, useState, type ReactNode } from 'react'

import { AppContext } from './context'

interface AppProviderProps {
  children: ReactNode
}

function AppProvider({ children }: AppProviderProps) {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  )

  const value = useMemo(
    () => ({
      isOnline,
      setIsOnline,
    }),
    [isOnline],
  )

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export default AppProvider