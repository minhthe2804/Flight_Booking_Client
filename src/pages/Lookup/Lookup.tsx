import { faInfo, faPlaneUp, faSpinner, faTicket, faReceipt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Button from '~/components/Button'
import { useForm, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useMutation } from '@tanstack/react-query'

import { useState, useMemo } from 'react'
import { BookingPassengerFlight, Lookup as LookupType } from '~/types/lookup.type'
import { isAxiosError } from 'axios'
import { toast } from 'react-toastify'
import {
    formatFlightTimeOnly,
    formatCurrencyVND,
    formatDateForAPI,
    formatDurationLookup,
    formatDateTime
} from '~/utils/utils'
import { lookupApi } from '~/apis/lookup.api'

// 1. Định nghĩa kiểu dữ liệu cho form tìm kiếm
type FormValues = {
    booking_reference: string
}

// 2. Định nghĩa schema validation
const schema = yup.object().shape({
    booking_reference: yup
        .string()
        .required('Vui lòng nhập mã đặt chỗ')
        .length(6, 'Mã đặt chỗ (PNR) phải có 6 ký tự')
        .uppercase('Mã đặt chỗ phải là chữ hoa')
})

// 3. Kiểu dữ liệu cho chuyến bay đã được nhóm
interface GroupedFlight {
    flight: BookingPassengerFlight['flight']
    travel_class: BookingPassengerFlight['travel_class']
    passengers: BookingPassengerFlight['passenger'][]
}

export default function Lookup() {
    // State để lưu trữ dữ liệu booking khi tìm thấy
    const [bookingData, setBookingData] = useState<LookupType | null>(null)

    // 4. Setup react-hook-form
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<FormValues>({
        resolver: yupResolver(schema)
    })

    // 5. Setup useMutation cho việc tìm kiếm
    const searchMutation = useMutation({
        mutationFn: (ref: string) => lookupApi.getlookup(ref),
        onSuccess: (response) => {
            setBookingData(response.data.data)
            toast.success('Tìm thấy thông tin đặt chỗ')
        },
        onError: (error) => {
            if (isAxiosError(error) && error.response?.status === 404) {
                toast.error('Không tìm thấy mã đặt chỗ này.')
            } else {
                toast.error('Đã có lỗi xảy ra, vui lòng thử lại.')
            }
            setBookingData(null) // Xóa dữ liệu cũ nếu lỗi
        }
    })

    // 6. Setup useMutation cho việc tải vé
    const eticketMutation = useMutation({
        mutationFn: (ref: string) => lookupApi.getEticket(ref),
        onSuccess: (response, ref) => {
            // Xử lý tải file PDF
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `eticket-${ref}.pdf`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
            toast.success('Đã tải vé điện tử thành công!')
        },
        onError: () => {
            toast.error('Tải vé điện tử thất bại.')
        }
    })

    // 7. Xử lý khi submit form
    const onSubmit: SubmitHandler<FormValues> = (data) => {
        searchMutation.mutate(data.booking_reference)
    }

    // 8. Xử lý khi nhấn nút "In vé"
    const handleDownloadTicket = () => {
        if (!bookingData) return
        eticketMutation.mutate(bookingData.booking_reference)
    }

    // 9. Xử lý nhóm dữ liệu hành khách theo chuyến bay
    const uniqueFlights = useMemo((): GroupedFlight[] => {
        if (!bookingData) return []

        const flightsMap = new Map<number, GroupedFlight>()

        for (const item of bookingData.passengers) {
            const flightId = item.flight.flight_id

            if (!flightsMap.has(flightId)) {
                // Nếu chuyến bay này chưa có trong map, thêm nó vào
                flightsMap.set(flightId, {
                    flight: item.flight,
                    travel_class: item.travel_class,
                    passengers: [] // Khởi tạo mảng hành khách
                })
            }

            // Thêm hành khách này vào chuyến bay tương ứng
            flightsMap.get(flightId)!.passengers.push(item.passenger)
        }

        // Chuyển Map thành Array để render
        return Array.from(flightsMap.values())
    }, [bookingData])

    // --- SỬA: Helper lấy badge trạng thái ---
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmed':
                return (
                    <span className='bg-green-100 text-green-800 text-xs font-bold px-2.5 py-0.5 rounded border border-green-400 inline-block'>
                        ĐÃ XÁC NHẬN
                    </span>
                )
            case 'pending':
                return (
                    <span className='bg-yellow-100 text-yellow-800 text-xs font-bold px-2.5 py-0.5 rounded border border-yellow-400 inline-block'>
                        CHỜ THANH TOÁN
                    </span>
                )
            case 'cancelled':
                return (
                    <span className='bg-gray-100 text-gray-800 text-xs font-bold px-2.5 py-0.5 rounded border border-gray-400 inline-block'>
                        ĐÃ HỦY
                    </span>
                )
            case 'completed':
                return (
                    <span className='bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded border border-blue-400 inline-block'>
                        ĐÃ HOÀN THÀNH
                    </span>
                )
            case 'pending_cancellation':
                return (
                    <span className='bg-orange-100 text-orange-800 text-xs font-bold px-2.5 py-0.5 rounded border border-orange-400 inline-block'>
                        CHỜ HỦY VÉ
                    </span>
                )
            case 'cancellation_rejected':
                return (
                    <span className='bg-red-100 text-red-800 text-xs font-bold px-2.5 py-0.5 rounded border border-red-400 inline-block'>
                        TỪ CHỐI HỦY
                    </span>
                )
            default:
                return (
                    <span className='bg-gray-100 text-gray-800 text-xs font-bold px-2.5 py-0.5 rounded border border-gray-400 inline-block'>
                        {status}
                    </span>
                )
        }
    }

    return (
        <div className='py-8 bg-gray-50 min-h-screen'>
            <div className='max-w-[1278px] mx-auto px-4'>
                <h1 className='text-3xl font-semibold text-gray-800 text-center'>Tra Cứu Thông Tin Đặt Chỗ</h1>
                <div className='mt-8 max-w-3xl mx-auto'>
                    {/* === FORM TÌM KIẾM === */}
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className='w-full bg-white p-6 rounded-lg shadow-md border border-gray-200'
                    >
                        <div className='flex items-start justify-center'>
                            <div className='flex-grow'>
                                <input
                                    type='text'
                                    {...register('booking_reference')}
                                    className={`text-sm w-full h-12 rounded-l-md outline-none border border-gray-300 text-black p-3 transition duration-200 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${
                                        errors.booking_reference ? 'border-red-500' : ''
                                    }`}
                                    placeholder='Nhập mã đặt chỗ (PNR), ví dụ: DXPOIW'
                                    autoCapitalize='characters'
                                />
                                {errors.booking_reference && (
                                    <p className='text-red-500 text-xs mt-1'>{errors.booking_reference.message}</p>
                                )}
                            </div>
                            <Button
                                type='submit'
                                disabled={searchMutation.isPending}
                                className='w-32 h-12 p-3 flex items-center justify-center text-white text-base rounded-r-md bg-blue-600 hover:bg-blue-700 transition duration-200 ease-in disabled:bg-gray-400'
                            >
                                {searchMutation.isPending ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Tìm kiếm'}
                            </Button>
                        </div>
                    </form>

                    {/* === KẾT QUẢ TÌM KIẾM === */}
                    {bookingData && (
                        <div className='mt-8 space-y-6 animate-fade-in'>
                            {/* === THÔNG TIN CHUNG === */}
                            <div className='w-full rounded-lg shadow-lg border border-gray-200 bg-white'>
                                <div className='w-full rounded-t-lg bg-blue-600 py-3 px-4 flex items-center justify-between'>
                                    <h2 className='text-lg font-semibold text-white'>
                                        Thông tin đặt chỗ #{bookingData.booking_reference}
                                    </h2>
                                    <Button
                                        onClick={handleDownloadTicket}
                                        disabled={eticketMutation.isPending}
                                        className='w-auto h-auto px-3 py-2 text-xs font-semibold text-center text-blue-700 flex justify-center items-center rounded-md bg-white hover:bg-gray-100 transition duration-200 ease-in disabled:bg-gray-300'
                                    >
                                        {eticketMutation.isPending ? (
                                            <FontAwesomeIcon icon={faSpinner} spin className='mr-2' />
                                        ) : (
                                            <FontAwesomeIcon icon={faTicket} className='mr-2' />
                                        )}
                                        In vé điện tử
                                    </Button>
                                </div>
                                <div className='w-full grid grid-cols-1 md:grid-cols-2 py-4 px-5 gap-x-8 gap-y-3 text-sm'>
                                    <p>
                                        <b className='font-semibold text-gray-700'>Ngày đặt:</b>{' '}
                                        <span className='text-gray-900'>
                                            {formatDateForAPI(bookingData.booking_date)}
                                        </span>
                                    </p>
                                    <p>
                                        <b className='font-semibold text-gray-700'>Người liên hệ:</b>{' '}
                                        <span className='text-gray-900'>
                                            {bookingData.passengers[0].passenger.first_name}{' '}
                                            {bookingData.passengers[0].passenger.last_name}
                                        </span>
                                    </p>
                                    <div className='flex items-center gap-2'>
                                        <b className='font-semibold text-gray-700'>Trạng thái vé:</b>{' '}
                                        {getStatusBadge(bookingData.status)}
                                    </div>
                                    <p>
                                        <b className='font-semibold text-gray-700'>SĐT:</b>{' '}
                                        <span className='text-gray-900'>{bookingData.contact_phone}</span>
                                    </p>

                                    {/* SỬA: Format Thanh toán */}
                                    <div className='flex items-center gap-2'>
                                        <b className='font-semibold text-gray-700'>Thanh toán:</b>{' '}
                                        <span
                                            className={`font-bold capitalize ${bookingData.payment_status === 'paid' ? 'text-green-600' : 'text-orange-600'}`}
                                        >
                                            {bookingData.payment_status === 'paid'
                                                ? 'Đã thanh toán'
                                                : 'Chưa thanh toán'}
                                        </span>
                                    </div>

                                    <p>
                                        <b className='font-semibold text-gray-700'>Email:</b>{' '}
                                        <span className='text-gray-900'>{bookingData.contact_email}</span>
                                    </p>
                                    <p>
                                        <b className='font-semibold text-gray-700'>Tổng tiền:</b>{' '}
                                        <span className='text-orange-600 font-bold'>
                                            {formatCurrencyVND(Number(bookingData.total_amount))}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {/* === DANH SÁCH CHUYẾN BAY (Loop) === */}
                            {uniqueFlights.map((group) => (
                                <div
                                    key={group.flight.flight_id}
                                    className='w-full rounded-lg shadow-lg border border-gray-200 bg-white px-5 py-6'
                                >
                                    {/* Thông tin chuyến bay */}
                                    <div className='w-full flex flex-col md:flex-row items-center'>
                                        <div className='text-lg font-bold w-full md:w-[30%] mb-4 md:mb-0'>
                                            <div className='inline-block align-middle'>
                                                <h3>{group.flight.airline.airline_name}</h3>
                                                <p className='text-sm font-normal text-gray-600'>
                                                    {group.flight.flight_number}
                                                </p>
                                            </div>
                                        </div>
                                        <div className='w-full md:w-[70%] flex items-center justify-between font-bold'>
                                            <div className='text-center'>
                                                <p className='text-2xl text-blue-600'>
                                                    {formatFlightTimeOnly(group.flight.departure_time)}
                                                </p>
                                                <p className='text-base text-black mt-1'>
                                                    {group.flight.departure_airport.city} (
                                                    {group.flight.departure_airport.airport_code})
                                                </p>
                                                <p className='text-sm font-normal text-gray-600'>
                                                    {formatDateForAPI(group.flight.departure_time)}
                                                </p>
                                            </div>
                                            <div className='mt-[-20px] flex flex-col items-center text-gray-500 px-2'>
                                                <p className='font-medium text-sm'>
                                                    {formatDurationLookup(
                                                        group.flight.departure_time,
                                                        group.flight.arrival_time
                                                    )}
                                                </p>
                                                <div className='w-24 md:w-36 h-0.5 bg-gray-300 relative my-1'>
                                                    <FontAwesomeIcon
                                                        icon={faPlaneUp}
                                                        className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-1'
                                                    />
                                                </div>
                                            </div>
                                            <div className='text-center'>
                                                <p className='text-2xl text-blue-600'>
                                                    {formatFlightTimeOnly(group.flight.arrival_time)}
                                                </p>
                                                <p className='text-base text-black mt-1'>
                                                    {group.flight.arrival_airport.city} (
                                                    {group.flight.arrival_airport.airport_code})
                                                </p>
                                                <p className='text-sm font-normal text-gray-600'>
                                                    {formatDateForAPI(group.flight.arrival_time)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <hr className='w-full bg-gray-200 h-0.5 mt-6' />
                                    {/* Thông tin gói và hành khách */}
                                    <div className='mt-4'>
                                        <div className='mt-4 rounded-md border border-blue-200 bg-blue-50 w-auto inline-flex h-auto py-2 px-3 items-center text-blue-700 gap-2 font-medium'>
                                            <FontAwesomeIcon icon={faInfo} className='text-sm' title='Thông tin' />
                                            <p>
                                                Hạng vé:{' '}
                                                <span className='font-bold'>{group.travel_class.class_name}</span>
                                            </p>
                                        </div>

                                        <div className='mt-4'>
                                            <h4 className='font-semibold text-gray-800 mb-2'>Danh sách hành khách:</h4>
                                            <ul className='list-disc list-inside text-gray-700 space-y-1'>
                                                {group.passengers.map((pax) => (
                                                    <li key={pax.passenger_id}>
                                                        {pax.last_name} {pax.first_name} ({pax.date_of_birth})
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
