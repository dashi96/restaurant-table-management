'use client'

import React, { useState, useEffect } from 'react'
import { Reservation } from '@/lib/types'
import { useStore } from '@/store/store'

interface ReservationFormProps {
  initialData?: Reservation | null
  onSubmit: (data: Omit<Reservation, 'id' | 'status'>) => void
  onCancel: () => void
}

const ReservationForm: React.FC<ReservationFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const tables = useStore((state) => state.tables)
  const [formData, setFormData] = useState<Partial<Reservation>>(initialData || {})

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData as Omit<Reservation, 'id' | 'status'>)
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <label className='block text-sm font-medium text-gray-700'>Guest Name</label>
        <input
          type='text'
          name='guestName'
          value={formData.guestName || ''}
          onChange={handleChange}
          className='focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-gray-300 shadow-sm'
          required
        />
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700'>Contact Number</label>
        <input
          type='tel'
          name='contactNumber'
          value={formData.contactNumber || ''}
          onChange={handleChange}
          className='focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-gray-300 shadow-sm'
          required
        />
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700'>Party Size</label>
          <input
            type='number'
            name='partySize'
            min='1'
            value={formData.partySize || ''}
            onChange={handleChange}
            className='focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-gray-300 shadow-sm'
            required
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700'>Table</label>
          <select
            name='tableId'
            value={formData.tableId || ''}
            onChange={handleChange}
            className='focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-gray-300 shadow-sm'
          >
            <option value=''>Select a table</option>
            {tables
              .filter((t) => t.status === 'available')
              .map((table) => (
                <option key={table.id} value={table.id}>
                  {table.name} (Capacity: {table.capacity})
                </option>
              ))}
          </select>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700'>Date</label>
          <input
            type='date'
            name='date'
            value={formData.date || ''}
            onChange={handleChange}
            className='focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-gray-300 shadow-sm'
            required
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700'>Time</label>
          <input
            type='time'
            name='time'
            value={formData.time || ''}
            onChange={handleChange}
            className='focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-gray-300 shadow-sm'
            required
          />
        </div>
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700'>Special Requests</label>
        <textarea
          name='specialRequests'
          value={formData.specialRequests || ''}
          onChange={handleChange}
          rows={3}
          className='focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-gray-300 shadow-sm'
        />
      </div>

      <div className='flex justify-end space-x-3'>
        <button
          type='button'
          onClick={onCancel}
          className='rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50'
        >
          Cancel
        </button>
        <button
          type='submit'
          className='bg-primary rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-black hover:bg-green-700'
        >
          {initialData?.id ? 'Update' : 'Create'} Reservation
        </button>
      </div>
    </form>
  )
}

export default ReservationForm
