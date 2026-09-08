export interface HomepageSection {
  id: string
  eyebrow: string
  title: string
  description: string
}

export const homepageSections: HomepageSection[] = [
  {
    id: 'intelligence',
    eyebrow: 'Khoj Intelligence',
    title: 'Travel begins with a feeling.',
    description:
      'Tell Khoj what you are looking for, and discover places, experiences and journeys that match the way you want to travel.',
  },
  {
    id: 'hidden-india',
    eyebrow: 'Hidden India',
    title: 'Go beyond the obvious.',
    description:
      'Discover places where fewer crowds, living culture and local communities create a different kind of journey.',
  },
  {
    id: 'experiences',
    eyebrow: 'Local Experiences',
    title: 'Meet the people behind the place.',
    description:
      'From food and crafts to traditions and everyday life, discover experiences connected to local communities.',
  },
  {
    id: 'stories',
    eyebrow: 'Khoj Stories',
    title: 'Every place has a story.',
    description:
      'Explore the people, history, food and traditions that give destinations their identity.',
  },
  {
    id: 'map',
    eyebrow: 'Khoj Map',
    title: 'See India differently.',
    description:
      'Explore destinations through discovery, community, safety, accessibility and tourism intelligence.',
  },
  {
    id: 'impact',
    eyebrow: 'Responsible Travel',
    title: 'Travel should leave something good behind.',
    description:
      'Understand how your journey can support local communities, culture and more responsible tourism.',
  },
]