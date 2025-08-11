'use client'

import React from 'react'
import { Table } from '@/lib/types'

interface TableGridProps {
  tables: Table[]
  onTableClick: (table: Table) => void
}

const TableGrid: React.FC<TableGridProps> = ({ tables, onTableClick }) => {
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'available':
        return 'table-available'
      case 'occupied':
        return 'table-occupied'
      case 'reserved':
        return 'table-reserved'
      default:
        return 'bg-gray-100'
    }
  }

  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
      {tables.map((table) => (
        <div
          key={table.id}
          className={`cursor-pointer rounded-lg border-2 p-4 shadow-md transition-all ${getStatusClass(table.status)}`}
          onClick={() => onTableClick(table)}
        >
          <div className='flex items-center justify-between'>
            <h3 className='text-lg font-bold'>{table.name}</h3>
            <span className='rounded-full px-2 py-1 text-xs font-semibold capitalize'>{table.status}</span>
          </div>
          <p className='mt-2'>Capacity: {table.capacity}</p>
          {table.reservationId && <p className='mt-1 text-sm text-gray-600'>Reserved</p>}
        </div>
      ))}
    </div>
  )
}

export default TableGrid
