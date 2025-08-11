'use client'

import React, { useEffect } from 'react'
import AnalyticsDashboard from '@/components/AnalyticsDashboard'
import { useStore } from '@/store/store'

const AnalyticsPage = () => {
  const { analytics, refreshAnalytics } = useStore()

  useEffect(() => {
    refreshAnalytics()
    const interval = setInterval(refreshAnalytics, 30000)
    return () => clearInterval(interval)
  }, [refreshAnalytics])

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-6 flex items-center justify-between'>
        <h1 className='text-secondary text-2xl font-bold'>Restaurant Analytics</h1>
        <button onClick={refreshAnalytics} className='bg-primary rounded-md px-4 py-2 text-white hover:bg-green-700'>
          Refresh Data
        </button>
      </div>

      {analytics ? (
        <AnalyticsDashboard data={analytics} />
      ) : (
        <div className='py-12 text-center'>
          <p className='text-gray-500'>Loading analytics data...</p>
        </div>
      )}
    </div>
  )
}

export default AnalyticsPage
