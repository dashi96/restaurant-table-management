import { Table, Reservation, TableStatus } from './types'

let tables: Table[] = [
  { id: '1', name: 'Table 1', capacity: 4, status: 'available' },
  { id: '2', name: 'Table 2', capacity: 2, status: 'available' },
  { id: '3', name: 'Table 3', capacity: 6, status: 'reserved', reservationId: '101' },
  { id: '4', name: 'Table 4', capacity: 4, status: 'occupied' },
  { id: '5', name: 'VIP Booth', capacity: 8, status: 'available' }
]

let reservations: Reservation[] = [
  {
    id: '101',
    guestName: 'John Smith',
    contactNumber: '+1234567890',
    partySize: 4,
    date: new Date().toISOString().split('T')[0],
    time: '19:00',
    specialRequests: 'Birthday celebration',
    tableId: '3',
    status: 'confirmed'
  }
]

export const db = {
  tables: {
    getAll: () => [...tables],
    getById: (id: string) => tables.find((t) => t.id === id),
    updateStatus: (id: string, status: TableStatus) => {
      tables = tables.map((t) => (t.id === id ? { ...t, status } : t))
    },
    assignReservation: (tableId: string, reservationId: string) => {
      tables = tables.map((t) => (t.id === tableId ? { ...t, status: 'reserved', reservationId } : t))
    },
    seatReservation: (tableId: string) => {
      tables = tables.map((t) => (t.id === tableId ? { ...t, status: 'occupied' } : t))
    },
    releaseTable: (tableId: string) => {
      tables = tables.map((t) => (t.id === tableId ? { ...t, status: 'available', reservationId: null } : t))
    }
  },

  reservations: {
    getAll: () => [...reservations],
    getById: (id: string) => reservations.find((r) => r.id === id),
    create: (reservation: Omit<Reservation, 'id'>) => {
      const newReservation = {
        ...reservation,
        id: `res_${Date.now()}`,
        status: 'confirmed'
      } as Reservation
      reservations.push(newReservation)
      return newReservation
    },
    update: (id: string, updates: Partial<Reservation>) => {
      reservations = reservations.map((r) => (r.id === id ? { ...r, ...updates } : r))
      return reservations.find((r) => r.id === id)
    },
    cancel: (id: string) => {
      const reservation = reservations.find((r) => r.id === id)
      if (reservation && reservation.tableId) {
        db.tables.releaseTable(reservation.tableId)
      }

      reservations = reservations.map((r) => (r.id === id ? { ...r, status: 'cancelled' } : r))
    },
    seat: (id: string) => {
      const reservation = reservations.find((r) => r.id === id)
      if (reservation && reservation.tableId) {
        db.tables.seatReservation(reservation.tableId)
        db.reservations.update(id, { status: 'seated' })
      }
    }
  },

  analytics: {
    getDaily: () => {
      const today = new Date().toISOString().split('T')[0]

      const covers = reservations
        .filter((r) => r.date === today && r.status !== 'cancelled')
        .reduce((sum, r) => sum + r.partySize, 0)

      const hourMap: Record<string, number> = {}
      reservations
        .filter((r) => r.date === today && r.status !== 'cancelled')
        .forEach((res) => {
          const hour = res.time.substring(0, 5)
          if (!hourMap[hour]) hourMap[hour] = 0
          hourMap[hour] += res.partySize
        })

      const peakHours = Object.entries(hourMap)
        .map(([hour, covers]) => ({ hour, covers }))
        .sort((a, b) => b.covers - a.covers)

      const occupiedTables = tables.filter((t) => t.status === 'occupied')
      const avgDiningTime =
        occupiedTables.length > 0
          ? occupiedTables.reduce((sum, t) => {
              const diningTime = Math.floor(Math.random() * 90) + 30
              return sum + diningTime
            }, 0) / occupiedTables.length
          : 75

      return {
        date: today,
        covers,
        peakHours,
        avgDiningTime: Math.round(avgDiningTime)
      }
    }
  }
}
