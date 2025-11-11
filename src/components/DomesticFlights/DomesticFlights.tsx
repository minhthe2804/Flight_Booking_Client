import React, { useState, useCallback, useRef, useEffect } from 'react'
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'

import { getFlights } from '~/apis/flight.api'
import { Flight } from '~/types/flight.type'
import { path } from '~/constants/path'
import FlightCard from '~/components/FlightCard/FlightCard'

// Skeleton Component
const FlightSkeleton: React.FC = () => (
    <div className='flex-shrink-0 w-full sm:w-[calc((100%-20px)/2)] lg:w-[calc((100%-40px)/3)]'>
        <div className='rounded-lg w-full h-[180px] shadow-md bg-white border border-gray-200 animate-pulse'>
            <div className='p-4'>
                <div className='flex items-center gap-3 mb-3'>
                    <div className='w-10 h-10 rounded-full bg-gray-200'></div>
                    <div>
                        <div className='h-3 bg-gray-200 rounded w-16 mb-1'></div>
                        <div className='h-4 bg-gray-200 rounded w-24'></div>
                    </div>
                </div>
                <div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
                <div className='h-3 bg-gray-200 rounded w-1/4 mb-4'></div>
                <div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
                <div className='h-3 bg-gray-200 rounded w-1/4'></div>
            </div>
        </div>
    </div>
)

export default function DomesticFlights() {
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(false)

    const {
        data: flightData,
        isLoading,
        isError
    } = useQuery({
        queryKey: ['domestic_flights'],
        queryFn: getFlights,
        staleTime: 1000 * 60 * 10
    })

    const flights = flightData?.data.data || []

    const checkScrollButtons = useCallback(() => {
        const container = scrollContainerRef.current
        if (!container) return
        const { scrollLeft, scrollWidth, clientWidth } = container
        setCanScrollLeft(scrollLeft > 2)
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2)
    }, [])

    const handleScroll = useCallback((direction: 'left' | 'right') => {
        const container = scrollContainerRef.current
        if (container) {
            const scrollAmount = container.clientWidth * 0.8
            container.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            })
        }
    }, [])

    useEffect(() => {
        if (!isLoading && flights.length > 0) {
            checkScrollButtons()
        }
        window.addEventListener('resize', checkScrollButtons)
        return () => {
            window.removeEventListener('resize', checkScrollButtons)
        }
    }, [isLoading, flights, checkScrollButtons])

    if (!isLoading && (isError || flights.length === 0)) {
        return null
    }

    return (
        <div className='mt-8'>
            <div className='max-w-[1278px] mx-auto relative'>
                <div className='flex justify-between items-center mb-5'>
                    <div className='flex items-center gap-3'>
                        <h2 className='text-2xl font-bold text-gray-900'>Đặt chuyến bay nội địa</h2>
                    </div>
                </div>

                <div
                    ref={scrollContainerRef}
                    onScroll={checkScrollButtons}
                    className='flex overflow-x-auto gap-5 pb-8 
                     scrollbar-none [&::-webkit-scrollbar]:hidden'
                >
                    {isLoading
                        ? Array.from({ length: 3 }).map((_, index) => <FlightSkeleton key={index} />)
                        : flights.map((flight: Flight) => (
                              <div
                                  className='flex-shrink-0 w-full sm:w-[calc((100%-20px)/2)] lg:w-[calc((100%-40px)/3)]'
                                  key={flight.flight_id}
                              >
                                  <FlightCard flight={flight} />
                              </div>
                          ))}
                </div>

                {canScrollLeft && (
                    <button
                        onClick={() => handleScroll('left')}
                        className='absolute left-0 top-1/2 -translate-y-1/2 z-10
                       w-8 h-8 rounded-full bg-white shadow-lg border border-gray-200
                       flex items-center justify-center text-gray-700
                       hover:bg-gray-100 transition-all
                       -translate-x-1/2'
                        aria-label='Cuộn sang trái'
                    >
                        <FontAwesomeIcon icon={faChevronLeft} className='w-4 h-4' />
                    </button>
                )}

                {canScrollRight && (
                    <button
                        onClick={() => handleScroll('right')}
                        className='absolute right-0 top-1/2 -translate-y-1/2 z-10
                       w-8 h-8 rounded-full bg-white shadow-lg border border-gray-200
                       flex items-center justify-center text-gray-700
                       hover:bg-gray-100 transition-all
                       translate-x-1/2'
                        aria-label='Cuộn sang phải'
                    >
                        <FontAwesomeIcon icon={faChevronRight} className='w-4 h-4' />
                    </button>
                )}
            </div>
        </div>
    )
}
