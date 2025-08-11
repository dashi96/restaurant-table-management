'use client'

import React from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null

  return (
    <div className='bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black'>
      <div className='w-full max-w-md rounded-lg bg-white shadow-xl'>
        <div className='flex items-center justify-between border-b px-4 py-3'>
          <h3 className='text-lg font-semibold'>{title}</h3>
          <button onClick={onClose} className='text-2xl text-gray-500 hover:text-gray-700'>
            &times;
          </button>
        </div>
        <div className='p-4'>{children}</div>
      </div>
    </div>
  )
}

export default Modal
