export type UserRole = 'tourist' | 'local_partner' | 'admin'

export const VALID_ROLES: UserRole[] = ['tourist', 'local_partner', 'admin']
export const DEFAULT_ROLE: UserRole = 'tourist'

export function isUserRole(value: unknown): value is UserRole {
  return (
    typeof value === 'string' &&
    (value === 'tourist' || value === 'local_partner' || value === 'admin')
  )
}

/**
 * Server-side authoritative role resolution.
 * Inspects app_metadata (set only by server/service_role).
 * Defaults strictly to 'tourist' to prevent client role escalation.
 */
export function resolveUserRole(user: {
  app_metadata?: Record<string, unknown>
  user_metadata?: Record<string, unknown>
}): UserRole {
  const appRole = user.app_metadata?.role
  if (isUserRole(appRole)) {
    return appRole
  }

  // Client user_metadata cannot grant privileged roles (local_partner, admin).
  // If user_metadata specifies tourist, accept it, otherwise strictly default to tourist.
  const userRole = user.user_metadata?.role
  if (userRole === 'tourist') {
    return 'tourist'
  }

  return DEFAULT_ROLE
}
