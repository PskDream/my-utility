export type TripCategory = 'scenic' | 'walking' | 'food' | 'park' | 'cafe' | 'local' | 'onsen'

export type TripPriority = 'top' | 'secondary' | 'optional'

export interface TripActivity {
  time: string
  activity: string
  note?: string
  categories?: TripCategory[]
  priority?: TripPriority
  alert?: boolean
}

export interface TripDay {
  day: number
  weekday: string
  date: string
  route: string
  theme: string
  feel?: string
  driveInfo?: string
  activities: TripActivity[]
  callout?: string
}

export interface TripPriorityWeight {
  category: TripCategory
  weight: number
}

export interface TripMeta {
  title: string
  dateRange: string
  routeSummary: string
  stats: string[]
  concept: string
  priorityWeights: TripPriorityWeight[]
}

export interface TripHighlights {
  top: string[]
  secondary: string[]
  optional: string[]
}
