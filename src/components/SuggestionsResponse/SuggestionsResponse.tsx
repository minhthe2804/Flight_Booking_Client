// src/components/SuggestionsResponse.tsx

import React from 'react'
import * as T from '~/types/aiTypes'
import { MapPinIcon, ArrowRightIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline'

interface SuggestionsResponseProps {
    data: T.SuggestionsData
}

// Component con cho gợi ý Sân bay
const AirportCard: React.FC<{ item: T.SuggestionAirport }> = ({ item }) => (
    <div className='flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors'>
        <MapPinIcon className='w-6 h-6 text-blue-600 flex-shrink-0' />
        <div className='flex-1 min-w-0'>
            <p className='font-semibold text-gray-800 truncate'>
                {item.name} ({item.code})
            </p>
            <p className='text-sm text-gray-600 truncate'>{item.city}</p>
        </div>
    </div>
)

// Component con cho gợi ý Tuyến bay
const RouteCard: React.FC<{ item: T.SuggestionRoute }> = ({ item }) => (
    <div className='flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors'>
        <BuildingOfficeIcon className='w-6 h-6 text-green-600 flex-shrink-0' />
        <div className='flex-1 min-w-0'>
            <p className='font-semibold text-gray-800 truncate'>
                Tuyến: {item.departure.city} <ArrowRightIcon className='w-4 h-4 inline-block mx-1' />{' '}
                {item.arrival.city}
            </p>
            <p className='text-sm text-gray-600 truncate'>
                {item.departure.code} <ArrowRightIcon className='w-3 h-3 inline-block mx-1' /> {item.arrival.code}
            </p>
        </div>
    </div>
)

// Component chính
const SuggestionsResponse: React.FC<SuggestionsResponseProps> = ({ data }) => {
    return (
        <div className='space-y-3'>
            <h3 className='font-semibold text-gray-900'>Gợi ý tìm kiếm cho: "{data.query}"</h3>

            {data.suggestions.map((suggestion, index) => {
                // Dùng 'switch' để kiểm tra 'type' và render component tương ứng
                switch (suggestion.type) {
                    case 'airport':
                        return <AirportCard key={index} item={suggestion} />
                    case 'route':
                        return <RouteCard key={index} item={suggestion} />
                    default:
                        return null
                }
            })}
        </div>
    )
}

export default SuggestionsResponse
