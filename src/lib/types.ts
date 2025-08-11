export type TableStatus = 'available' | 'occupied' | 'reserved'

export interface Table {
  id: string
  name: string
  capacity: number
  status: TableStatus
  reservationId?: string | null
}

export interface Reservation {
  id: string
  guestName: string
  contactNumber: string
  partySize: number
  date: string
  time: string
  specialRequests?: string
  tableId?: string
  status: 'confirmed' | 'seated' | 'completed' | 'cancelled'
}

export interface AnalyticsData {
  date: string
  covers: number
  peakHours: { hour: string; covers: number }[]
  avgDiningTime: number
}
