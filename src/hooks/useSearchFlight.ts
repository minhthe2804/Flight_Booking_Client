import { yupResolver } from '@hookform/resolvers/yup'

import { useNavigate } from 'react-router-dom'
import { addDays, format } from 'date-fns'
import { path } from '~/constants/path'
import { Control, useForm, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { flightSearchSchema, SearchFlightForm } from '~/utils/rules'
import { PassengerCount } from '~/types/passenger'
import { toast } from 'react-toastify'

// Logic tính ngày hôm nay (giống như trong Header của bạn)
const now = new Date()
const cutoffHour = 22
const today = new Date(now.setHours(0, 0, 0, 0) + (now.getHours() >= cutoffHour ? 24 * 60 * 60 * 1000 : 0))

interface UseSearchFlightsReturn {
    control: Control<SearchFlightForm>
    watch: UseFormWatch<SearchFlightForm>
    setValue: UseFormSetValue<SearchFlightForm>
    onSubmitSearch: (e?: React.BaseSyntheticEvent) => Promise<void>
    handleQuantityChange: (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        type: keyof PassengerCount,
        change: number
    ) => void // Thêm hàm này vào kiểu trả về
    today: Date
    maxDate: Date
}
const MAX_PASSENGERS = 7 // Giới hạn tổng số hành khách

export default function useSearchFlights(): UseSearchFlightsReturn {
    const navigate = useNavigate()
    const maxDate = addDays(today, 30)

    // Khởi tạo useForm với defaultValues và resolver
    const { control, handleSubmit, watch, setValue } = useForm<SearchFlightForm>({
        defaultValues: {
            departure: '',
            destination: '',
            startDate: today,
            endDate: null,
            isRoundTrip: false,
            passengers: { adult: 1, child: 0, infant: 0 },
            class: { value: 'economy', label: 'Phổ thông' }
        },
        resolver: yupResolver(flightSearchSchema)
    })

    // Lấy giá trị hành khách hiện tại bằng watch để kiểm tra
    const currentPassengers = watch('passengers')

    const handleQuantityChange = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        type: keyof PassengerCount,
        change: number // +1 hoặc -1
    ) => {
        event.preventDefault()

        const { adult, child, infant } = currentPassengers
        const currentTotal = adult + child + infant
        const currentValue = currentPassengers[type]

        if (change > 0) {
            // 1. Kiểm tra tổng giới hạn
            if (currentTotal + 1 > MAX_PASSENGERS) {
                toast.warn(`Số lượng hành khách tối đa là ${MAX_PASSENGERS}.`)
                return // Không cho tăng
            }
            // 2. Kiểm tra giới hạn em bé so với người lớn
            if (type === 'infant' && infant + 1 > adult) {
                toast.warn('Số lượng em bé không được vượt quá số lượng người lớn.')
                return // Không cho tăng em bé
            }
            // Nếu không vi phạm, tăng bình thường
            setValue(`passengers.${type}`, currentValue + 1)
        }
        // --- Logic khi GIẢM (-) ---
        else if (change < 0) {
            // 1. Kiểm tra số lượng tối thiểu (không thể < 0, riêng adult không thể < 1)
            if (type === 'adult' && adult - 1 < 1) {
                toast.warn('Phải có ít nhất 1 người lớn.')
                return // Không cho giảm người lớn
            }
            if (currentValue - 1 < 0) {
                return // Không cho giảm dưới 0 với child/infant
            }
            // 2. Kiểm tra ràng buộc em bé khi giảm người lớn
            if (type === 'adult' && adult - 1 < infant) {
                toast.warn('Số lượng người lớn phải bằng hoặc nhiều hơn số lượng em bé.')
                return // Không cho giảm người lớn
            }
            // Nếu không vi phạm, giảm bình thường
            setValue(`passengers.${type}`, currentValue - 1)
        }
    }

    // --- SỬA LOGIC ONSUBMIT ---
    const onSubmit = (data: SearchFlightForm) => {
        // 1. Trích xuất mã sân bay ban đầu
        const origin_departure_code = data.departure.split(' - ')[0] // Lưu lại điểm đi gốc
        const origin_arrival_code = data.destination.split(' - ')[0] // Lưu lại điểm đến gốc

        // 2. Định dạng ngày
        const departure_date = data.startDate ? format(data.startDate, 'yyyy-MM-dd') : ''
        const return_date = data.isRoundTrip && data.endDate ? format(data.endDate, 'yyyy-MM-dd') : ''

        // 3. Lấy thông tin hành khách, hạng vé (giữ nguyên)
        const { adult, child, infant } = data.passengers
        const class_code = data.class ? data.class.value.toUpperCase() : 'ECONOMY'

        // 4. Tạo query string
        const params = new URLSearchParams()

        // --- Thêm các tham số cho API chiều ĐI ---
        params.append('departure_airport_code', origin_departure_code) // Dùng mã đi gốc
        params.append('arrival_airport_code', origin_arrival_code) // Dùng mã đến gốc
        params.append('departure_date', departure_date)
        params.append('adults', adult.toString())
        params.append('children', child.toString())
        params.append('infants', infant.toString())
        params.append('class_code', class_code)

        // --- Thêm các tham số chiều VỀ (nếu là khứ hồi) để trang sau đọc ---
        if (data.isRoundTrip && return_date) {
            params.append('is_round_trip', 'true') // Đánh dấu là khứ hồi
            params.append('return_date', return_date)
            // Lưu lại sân bay gốc để trang sau biết chiều về bay từ đâu đến đâu
            params.append('origin_departure_code', origin_departure_code)
            params.append('origin_arrival_code', origin_arrival_code)
        }

        // 5. Điều hướng (giữ nguyên)
        navigate({
            pathname: path.searchFlight,
            search: params.toString()
        })
    }

    // 7. Trả về các helpers
    return {
        control,
        watch,
        setValue,
        onSubmitSearch: handleSubmit(onSubmit), // Bọc hàm onSubmit bằng handleSubmit
        handleQuantityChange,
        today,
        maxDate
    }
}
