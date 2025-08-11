'use client'

import React, { useEffect } from 'react'
import TableGrid from '@/components/TableGrid'
import { useStore } from '@/store/store'
import ReservationForm from '@/components/ReservationForm'
import Modal from '@/components/Modal'
import Button from '@/components/Button'

const HomePage = () => {
  const {
    tables,
    reservations,
    fetchData,
    selectedTable,
    isEditModalOpen,
    closeEditModal,
    openReservationModal,
    isReservationModalOpen,
    closeReservationModal,
    updateTableStatus,
    createReservation,
    updateReservation,
    selectedReservation,
    selectReservation,
    selectTable,
    openEditModal,
    seatReservation,
    refreshAnalytics
  } = useStore()

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleTableClick = (table: any) => {
    selectTable(table)
    openEditModal()
  }

  const handleStatusChange = (status: 'available' | 'occupied' | 'reserved') => {
    if (selectedTable) {
      updateTableStatus(selectedTable.id, status)
      refreshAnalytics()
      closeEditModal()
    }
  }

  const handleCreateReservation = (data: any) => {
    createReservation(data)
    refreshAnalytics()
    closeReservationModal()
    selectReservation(null)
  }

  const handleUpdateReservation = (data: any) => {
    if (!selectedReservation?.id) return
    updateReservation(selectedReservation.id, data)
    refreshAnalytics()
    closeReservationModal()
    selectReservation(null)
  }

  const handleSeatReservation = () => {
    if (selectedTable) {
      seatReservation(selectedTable.id)
      refreshAnalytics()
      closeEditModal()
    }
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-6 flex items-center justify-between'>
        <h1 className='text-secondary text-2xl font-bold'>Restaurant Table Management</h1>
        <Button
          onClick={openReservationModal}
          className='bg-primary rounded-md border border-gray-300 px-4 py-2 text-black hover:bg-green-700'
        >
          + New Reservation
        </Button>
      </div>

      <div className='mb-8'>
        <h2 className='mb-4 text-xl font-semibold'>Floor Plan</h2>
        <TableGrid tables={tables} onTableClick={handleTableClick} />
      </div>

      {/* Table Status Modal */}
      <Modal isOpen={isEditModalOpen} onClose={closeEditModal} title={`Manage ${selectedTable?.name}`}>
        {selectedTable && (
          <div className='space-y-4'>
            <div className='flex space-x-2'>
              <button
                onClick={() => handleStatusChange('available')}
                className={`rounded-md px-4 py-2 text-black ${
                  selectedTable.status === 'available' ? 'bg-green-500' : 'bg-gray-200'
                }`}
              >
                Available
              </button>
              <button
                onClick={() => handleStatusChange('occupied')}
                className={`rounded-md px-4 py-2 text-black ${
                  selectedTable.status === 'occupied' ? 'bg-red-500' : 'bg-gray-200'
                }`}
              >
                Occupied
              </button>
              <button
                onClick={() => handleStatusChange('reserved')}
                className={`rounded-md px-4 py-2 text-black ${
                  selectedTable.status === 'reserved' ? 'bg-yellow-500' : 'bg-gray-200'
                }`}
              >
                Reserved
              </button>
            </div>

            {selectedTable.reservationId && (
              <div className='mt-4 rounded-lg bg-yellow-50 p-3'>
                <div className='flex items-center justify-between'>
                  <h4 className='font-medium'>Reservation Details</h4>
                  <Button
                    className='bg-primary rounded-md border border-gray-300 text-black'
                    onClick={() => {
                      const foundReservation = reservations.find((r) => r.id === selectedTable.reservationId)
                      if (foundReservation) {
                        selectReservation(foundReservation)
                        openReservationModal()
                      }
                    }}
                  >
                    Edit Reservation
                  </Button>
                </div>
                <p>Guest: {reservations.find((r) => r.id === selectedTable.reservationId)?.guestName || 'Unknown'}</p>
                <p>Time: {reservations.find((r) => r.id === selectedTable.reservationId)?.time || 'Unknown'}</p>
                <p>
                  Party Size: {reservations.find((r) => r.id === selectedTable.reservationId)?.partySize || 'Unknown'}
                </p>
                <p>
                  Special Requests:{' '}
                  {reservations.find((r) => r.id === selectedTable.reservationId)?.specialRequests || 'Unknown'}
                </p>
                <button
                  onClick={handleSeatReservation}
                  className='bg-primary mt-2 rounded-md border border-gray-300 px-4 py-2 text-black hover:bg-green-700'
                >
                  Seat Reservation
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Reservation Modal */}
      <Modal
        isOpen={isReservationModalOpen}
        onClose={() => {
          closeReservationModal()
          selectReservation(null)
        }}
        title={selectedReservation ? 'Edit Reservation' : 'Create New Reservation'}
      >
        <ReservationForm
          initialData={selectedReservation}
          onSubmit={selectedReservation ? handleUpdateReservation : handleCreateReservation}
          onCancel={() => {
            closeReservationModal()
            selectReservation(null)
          }}
        />
      </Modal>
    </div>
  )
}

export default HomePage
