import React, { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { SubmitHandler } from 'react-hook-form'
import { AxiosError } from 'axios'
import { useNavigate, createSearchParams, Link } from 'react-router-dom'
import { omitBy, isNil } from 'lodash'

// Import API và Kiểu
import { flightApi, Flight, FlightFormData, FlightListResponse } from '~/apis/flight.api'

import { path } from '~/constants/path'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faFilter, faTimes } from '@fortawesome/free-solid-svg-icons'
import { airlineApi } from '~/apis/airLine.api'
import { FlightFilter } from '~/types/flight.type'
import { airportApi } from '~/apis/airport.api'
import { aircraftApi } from '~/apis/aircraft.api'
import useFlightQueryConfig from '~/hooks/useSearchFlightQueryConfig'
import FlightForm from './components/FlightForm/FlightForm'
import FlightFilterCard from './components/FlightFilterCard/FlightFilterCard'
import FlightTable from './components/FlightTable/FlightTable'
import Paginate from '~/components/Pagination'

// --- Component Chính ---
export default function AdminFlightPage() {
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    // SỬA: State để chuyển đổi view (Filter/Form)
    const [viewMode, setViewMode] = useState<'filter' | 'form'>('filter')
    const [editingFlight, setEditingFlight] = useState<Flight | null>(null)

    const queryConfig = useFlightQueryConfig()

    const [filters, setFilters] = useState<FlightFilter>(() => {
        const {
            page,
            limit,
            flight_number,
            status,
            airline_id,
            flight_type,
            departure_airport_id,
            arrival_airport_id,
            departure_date_from,
            departure_date_to,
            sortBy,
            order
        } = queryConfig as FlightFilter
        return {
            flight_number,
            status,
            airline_id,
            flight_type,
            departure_airport_id,
            arrival_airport_id,
            departure_date_from,
            departure_date_to,
            sortBy,
            order
        }
    })

    const { data: airlinesData, isLoading: isLoadingAirlines } = useQuery({
        queryKey: ['airlinesList'],
        queryFn: () => airlineApi.getAirlineAdmin({}).then((res) => res.data.data),
        staleTime: Infinity
    })
    const airlines = airlinesData || []

    const { data: airportsData, isLoading: isLoadingAirports } = useQuery({
        queryKey: ['airportsList'],
        queryFn: () => airportApi.getAirportAdmin({}).then((res) => res.data.data),
        staleTime: Infinity
    })
    const airports = airportsData || []

    // SỬA: Thêm API Aircraft
    const { data: aircraftsData, isLoading: isLoadingAircrafts } = useQuery({
        queryKey: ['aircraftsList'],
        queryFn: () => aircraftApi.getAircrafts({}).then((res) => res.data),
        staleTime: Infinity
    })
    const aircrafts = aircraftsData?.data || []
    // === GỌI API (Lấy Chuyến bay) ===
    const { data: flightsData, isLoading: isLoadingFlights } = useQuery<FlightListResponse, Error>({
        queryKey: ['adminFlights', queryConfig],
        queryFn: () => flightApi.getFlights(queryConfig as FlightFilter).then((res) => res.data),
        staleTime: 1000 * 60
    })
    const flights = flightsData?.data || []
    const pagination = flightsData?.meta?.pagination

    // --- MUTATIONS (Thêm/Sửa/Xóa) ---
    const createFlightMutation = useMutation({
        mutationFn: (data: Omit<FlightFormData, 'flight_id'>) => flightApi.createFlight(data),
        onSuccess: () => {
            toast.success('Thêm chuyến bay thành công!')
            queryClient.invalidateQueries({ queryKey: ['adminFlights'] })
            handleShowFilterView() // SỬA: Chuyển về view Filter
        },
        onError: (error: AxiosError<{ message?: string }>) => {
            toast.error(error.response?.data?.message || 'Thêm thất bại')
        }
    })

    const updateFlightMutation = useMutation({
        mutationFn: (data: FlightFormData) => flightApi.updateFlight(data.flight_id, data),
        onSuccess: () => {
            toast.success('Cập nhật chuyến bay thành công!')
            queryClient.invalidateQueries({ queryKey: ['adminFlights'] })
            handleShowFilterView() // SỬA: Chuyển về view Filter
        },
        onError: (error: AxiosError<{ message?: string }>) => {
            toast.error(error.response?.data?.message || 'Cập nhật thất bại')
        }
    })

    const deleteFlightMutation = useMutation({
        mutationFn: (id: number) => flightApi.deleteFlight(id),
        onSuccess: () => {
            toast.success('Xóa chuyến bay thành công!')
            queryClient.invalidateQueries({ queryKey: ['adminFlights'] })
        },
        onError: (error: AxiosError<{ message?: string }>) => {
            toast.error(error.response?.data?.message || 'Xóa thất bại')
        }
    })

    // === HANDLERS ===
    const onSubmitForm: SubmitHandler<FlightFormData> = (data) => {
        if (editingFlight) {
            updateFlightMutation.mutate(data)
        } else {
            const { flight_id, ...dataToSend } = data
            createFlightMutation.mutate(dataToSend)
        }
    }

    // SỬA: Đổi tên
    const handleShowFilterView = () => {
        setEditingFlight(null)
        setViewMode('filter')
    }

    // (Filter handlers giữ nguyên)
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFilters((prev) => ({
            ...prev,
            [name]: value === 'Tất cả' ? '' : value
        }))
    }
    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const newParams = {
            ...queryConfig,
            ...filters,
            page: '1'
        }
        const cleanedParams = omitBy(newParams, (value) => isNil(value) || value === '')
        navigate({
            pathname: path.adminFlight,
            search: createSearchParams(cleanedParams).toString()
        })
    }
    const handleFilterReset = () => {
        setFilters({})
        const newParams = { page: '1', limit: queryConfig.limit || '10' }
        navigate({
            pathname: path.adminFlight,
            search: createSearchParams(newParams).toString()
        })
    }

    const handleEditClick = (flight: Flight) => {
        setEditingFlight(flight)
        setViewMode('form')
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleShowAddForm = () => {
        setEditingFlight(null)
        setViewMode('form')
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleDeleteClick = (id: number) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa chuyến bay này?')) {
            deleteFlightMutation.mutate(id)
        }
    }

    const isLoadingDropdowns = isLoadingAirlines || isLoadingAirports || isLoadingAircrafts

    return (
        <div className='max-w-[1278px] mx-auto py-8 px-4'>
            <h1 className='text-3xl font-bold text-gray-900 text-center mb-8'>Quản lý Chuyến bay</h1>

            {/* SỬA: Bố cục (Render 1 trong 2) */}

            {/* --- KHỐI 1: BỘ LỌC (FILTER) HOẶC FORM --- */}
            {viewMode === 'filter' ? (
                <FlightFilterCard
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onFilterSubmit={handleFilterSubmit}
                    onFilterReset={handleFilterReset}
                    airlines={airlines}
                    airports={airports}
                    isLoading={isLoadingDropdowns}
                />
            ) : (
                <FlightForm
                    editingFlight={editingFlight}
                    onSubmitForm={onSubmitForm}
                    onResetForm={handleShowFilterView} // Khi Hủy/Reset -> Hiện Filter
                    // Truyền dữ liệu dropdowns
                    airlines={airlines}
                    airports={airports}
                    aircrafts={aircrafts}
                    isLoading={isLoadingDropdowns || createFlightMutation.isPending || updateFlightMutation.isPending}
                />
            )}

            <div className='mt-6'>
                <FlightTable
                    flights={flights}
                    isLoading={isLoadingFlights}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                    viewMode={viewMode}
                    onShowAddForm={handleShowAddForm}
                    onShowFilterView={handleShowFilterView}
                />

                <Paginate pageSize={pagination?.totalPages as number} queryConfig={queryConfig} />
            </div>
        </div>
    )
}
