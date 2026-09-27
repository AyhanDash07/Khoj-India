import { createContext } from 'react'

import type { Session, User } from '@supabase/supabase-js'
import type { UserRole } from '../types/auth'

export interface AuthContextValue {
  user: User | null
  session: Session | null
  role: UserRole
  loading: boolean
}

export const AuthContext =
  createContext<AuthContextValue | undefined>(undefined)