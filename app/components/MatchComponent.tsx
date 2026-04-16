'use client';

import React, { useState } from 'react'
import { MatchType } from '@/models/matchSchema'
import Link from 'next/link'

interface MatchComponentProps {
  match: MatchType
}

export const MatchComponent = ({match} : MatchComponentProps) => {

  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  return (
    <div 
      className='w-64 min-w-64 h-fit p-2 bg-white rounded-lg flex flex-col hover:cursor-pointer'
      onClick={() => setShowDropdown(!showDropdown)}
    >
      <h1 className=''>
        {`${match.teamOneName}`} <span className='text-sm font-medium'>vs</span> {`${match.teamTwoName}`}
      </h1>
      <h2 className='text-sm text-gray-600'>
        {`${match.date.toDateString()}, ${match.league}`}
      </h2>
      <h2 className='text-sm text-gray-600'>
        {`${match.sport}, ${match.division}`}
      </h2>
      {showDropdown && <div className='absolute flex flex-col my-20 bg-gray-600 text-white p-2 gap-2 rounded '>
        <div>Edit Results</div>
        <div>Update Info</div>
      </div>}
    </div>
  )
}
