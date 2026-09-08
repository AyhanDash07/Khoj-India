export type PressureLevel = 'Low' | 'Moderate' | 'High'

export type DestinationCategory =
  | 'Heritage'
  | 'Nature'
  | 'Culture'
  | 'Food'
  | 'Adventure'
  | 'Hidden Gem'

export interface Destination {
  id?: string
  name: string
  region: string
  description: string
  category: DestinationCategory
  image?: string
  impactScore?: number
  pressure?: PressureLevel
}

export interface Experience {
  id?: string
  title: string
  location: string
  description: string
  category: string
  host?: string
  impactScore?: number
}

export interface Story {
  id?: string
  title: string
  location: string
  description: string
  category: string
  author?: string
}

export interface UserProfile {
  id: string
  name: string
  email: string
  avatarUrl?: string
}

export interface Trip {
  id: string
  title: string
  startDate?: string
  endDate?: string
  destinations: string[]
}