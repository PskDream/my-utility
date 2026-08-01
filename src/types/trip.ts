export interface TripActivity {
  time: string
  activity: string
  note?: string
  starred?: boolean
  alert?: boolean
}

export interface TripDay {
  day: number
  weekday: string
  date: string
  route: string
  driveInfo?: string
  activities: TripActivity[]
  callout?: string
}

export interface TripMeta {
  title: string
  dateRange: string
  routeSummary: string
  stats: string[]
}
