export const APP_NAME = 'KHOJ INDIA'

export const APP_DESCRIPTION =
  'Discover India beyond the obvious.'

export const DEFAULT_PAGE_SIZE = 12

export const SUPPORTED_PRESSURE_LEVELS = [
  'Low',
  'Moderate',
  'High',
] as const

export const SUPPORTED_DESTINATION_CATEGORIES = [
  'Heritage',
  'Nature',
  'Culture',
  'Food',
  'Adventure',
  'Hidden Gem',
] as const

export const NAVIGATION_ITEMS = [
  {
    label: 'Explore',
    href: '/explore',
  },
  {
    label: 'Experiences',
    href: '/experiences',
  },
  {
    label: 'Stories',
    href: '/stories',
  },
  {
    label: 'Map',
    href: '/map',
  },
  {
    label: 'Plan with Khoj',
    href: '/plan',
  },
] as const

export const STORAGE_KEYS = {
  authToken: 'auth_token',
  userProfile: 'user_profile',
  preferences: 'preferences',
  savedPlaces: 'saved_places',
  savedExperiences: 'saved_experiences',
  currentTrip: 'current_trip',
  language: 'language',
  offlinePack: 'offline_pack',
} as const