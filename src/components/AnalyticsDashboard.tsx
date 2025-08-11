'use client'

import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { AnalyticsData } from '@/lib/types'

interface AnalyticsDashboardProps {
  data: AnalyticsData
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ data }) => {
  const sortedHours = [...data.peakHours].sort((a, b) => {
    const timeA = parseInt(a.hour.replace(':', ''))
    const timeB = parseInt(b.hour.replace(':', ''))
    return timeA - timeB
  })

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        <div className='rounded-lg bg-white p-4 shadow'>
          <h3 className='text-lg font-semibold text-gray-700'>Daily Covers</h3>
          <p className='text-primary text-3xl font-bold'>{data.covers}</p>
          <p className='mt-1 text-sm text-gray-600'>Total guests today</p>
        </div>

        <div className='rounded-lg bg-white p-4 shadow'>
          <h3 className='text-lg font-semibold text-gray-700'>Avg Dining Time</h3>
          <p className='text-primary text-3xl font-bold'>{data.avgDiningTime} min</p>
          <p className='mt-1 text-sm text-gray-600'>Current average</p>
        </div>

        <div className='rounded-lg bg-white p-4 shadow'>
          <h3 className='text-lg font-semibold text-gray-700'>Peak Hour</h3>
          <p className='text-primary text-3xl font-bold'>
            {
              data.peakHours.reduce((max, hour) => (hour.covers > max.covers ? hour : max), { hour: '', covers: 0 })
                .hour
            }
          </p>
          <p className='mt-1 text-sm text-gray-600'>Most busy time</p>
        </div>
      </div>

      <div className='rounded-lg bg-white p-4 shadow'>
        <h3 className='mb-4 text-lg font-semibold text-gray-700'>Covers by Hour</h3>
        <ResponsiveContainer width='100%' height={300}>
          <BarChart data={sortedHours}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='hour' />
            <YAxis label={{ value: 'Guests', angle: -90, position: 'insideLeft' }} />
            <Tooltip
              formatter={(value) => [`${value} guests`, 'Number of guests']}
              labelFormatter={(label) => `Time: ${label}`}
            />
            <Bar dataKey='covers' name='Guests' fill='#88d498' radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default AnalyticsDashboard
