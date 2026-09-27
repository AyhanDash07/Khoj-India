export type UserRole = 'tourist' | 'local_partner' | 'admin'

export const DEFAULT_ROLE: UserRole = 'tourist'

export function isUserRole(value: unknown): value is UserRole {
  return (
    typeof value === 'string' &&
    (value === 'tourist' || value === 'local_partner' || value === 'admin')
  )
}
