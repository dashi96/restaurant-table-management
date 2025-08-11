import { create } from 'zustand'
import { Table, Reservation, AnalyticsData, TableStatus } from '@/lib/types'
import { db } from '@/lib/db'

interface StoreState {
  tables: Table[]
  reservations: Reservation[]
  analytics: AnalyticsData | null
  selectedTable: Table | null
  selectedReservation: Reservation | null
  isEditModalOpen: boolean
  isReservationModalOpen: boolean

  fetchData: () => void
  selectTable: (table: Table | null) => void
  selectReservation: (reservation: Reservation | null) => void
  updateTableStatus: (tableId: string, status: TableStatus) => void
  createReservation: (data: Omit<Reservation, 'id' | 'status'>) => void
  updateReservation: (id: string, updates: Partial<Reservation>) => void
  cancelReservation: (id: string) => void
  seatReservation: (tableId: string) => void
  openEditModal: () => void
  closeEditModal: () => void
  openReservationModal: () => void
  closeReservationModal: () => void

  refreshAnalytics: () => void
}

export const useStore = create<StoreState>((set) => ({
  tables: [],
  reservations: [],
  analytics: null,
  selectedTable: null,
  selectedReservation: null,
  isEditModalOpen: false,
  isReservationModalOpen: false,

  fetchData: () => {
    set({
      tables: db.tables.getAll(),
      reservations: db.reservations.getAll(),
      analytics: db.analytics.getDaily()
    })
  },

  refreshAnalytics: () => {
    set({ analytics: db.analytics.getDaily() })
  },

  selectTable: (table) => set({ selectedTable: table }),
  selectReservation: (reservation) => set({ selectedReservation: reservation }),

  updateTableStatus: (tableId, status) => {
    db.tables.updateStatus(tableId, status)
    set({ tables: db.tables.getAll() })
  },

  createReservation: (data) => {
    const reservation = db.reservations.create({
      ...data,
      status: 'confirmed'
    })
    if (data.tableId) {
      db.tables.assignReservation(data.tableId, reservation.id)
    }
    set({
      reservations: db.reservations.getAll(),
      tables: db.tables.getAll(),
      analytics: db.analytics.getDaily()
    })
  },

  updateReservation: (id, updates) => {
    db.reservations.update(id, updates)
    set({
      reservations: db.reservations.getAll(),
      tables: db.tables.getAll(),
      analytics: db.analytics.getDaily()
    })
  },

  cancelReservation: (id) => {
    db.reservations.cancel(id)
    set({ reservations: db.reservations.getAll(), analytics: db.analytics.getDaily() })
  },

  seatReservation: (tableId) => {
    db.tables.seatReservation(tableId)
    set({ tables: db.tables.getAll(), analytics: db.analytics.getDaily() })
  },

  openEditModal: () => set({ isEditModalOpen: true }),
  closeEditModal: () => set({ isEditModalOpen: false }),
  openReservationModal: () => set({ isReservationModalOpen: true }),
  closeReservationModal: () => set({ isReservationModalOpen: false })
}))
