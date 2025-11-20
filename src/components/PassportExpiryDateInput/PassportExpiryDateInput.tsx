import { useMemo, useEffect, useState } from 'react'
import { Controller, Control, FieldValues, Path } from 'react-hook-form'

// --- Helper Functions ---
const currentYear = new Date().getFullYear()

// Sinh danh sách năm (Từ năm hiện tại -> 15 năm sau)
const generateExpiryYearOptions = () => {
    const years = []
    for (let i = currentYear; i <= currentYear + 15; i++) {
        years.push({ value: i.toString(), label: i.toString() })
    }
    return years
}

interface ExpiryDateInputProps<T extends FieldValues> {
    name: Path<T>
    control: Control<T>
    label: string
    errorMessage?: string
}

const PassportExpiryDateInput = <T extends FieldValues>({
    name,
    control,
    label,
    errorMessage
}: ExpiryDateInputProps<T>) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => {
                const [year, setYear] = useState('')
                const [month, setMonth] = useState('')
                const [day, setDay] = useState('')

                // 1. Đồng bộ từ RHF (Form) xuống State (Component)
                useEffect(() => {
                    if (field.value && typeof field.value === 'string') {
                        const parts = field.value.split('-')
                        if (parts.length === 3) {
                            setYear(parts[0])
                            setMonth(parts[1].replace(/^0+/, '')) // Bỏ số 0 đầu
                            setDay(parts[2].replace(/^0+/, '')) // Bỏ số 0 đầu
                        }
                    } else if (!field.value) {
                        setYear('')
                        setMonth('')
                        setDay('')
                    }
                }, [field.value])

                // 2. Logic xử lý & Gửi lên Form
                useEffect(() => {
                    if (year && month && day) {
                        const y = parseInt(year)
                        const m = parseInt(month)
                        let d = parseInt(day)

                        // Kiểm tra ngày hợp lệ của tháng
                        const daysInMonth = new Date(y, m, 0).getDate()
                        if (d > daysInMonth) {
                            d = daysInMonth
                            setDay(d.toString())
                        }

                        const newDateString = `${y}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`

                        if (newDateString !== field.value) {
                            field.onChange(newDateString)
                        }
                    } else {
                        if (field.value !== null) {
                            field.onChange(null)
                        }
                    }
                }, [year, month, day])

                // === OPTIONS ===
                const yearOptions = useMemo(() => generateExpiryYearOptions(), [])

                const monthOptions = useMemo(() => {
                    const months = []
                    for (let i = 1; i <= 12; i++) {
                        months.push({ value: i.toString(), label: `Tháng ${i}` })
                    }
                    return months
                }, [])

                const dayOptions = useMemo(() => {
                    let maxDay = 31
                    if (year && month) {
                        maxDay = new Date(parseInt(year), parseInt(month), 0).getDate()
                    }

                    const days = []
                    for (let i = 1; i <= maxDay; i++) {
                        days.push({ value: i.toString(), label: i.toString() })
                    }
                    return days
                }, [year, month])

                return (
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1 mt-1'>
                            {label}
                            <span className='text-red-500'> *</span>
                        </label>
                        <div className='grid grid-cols-3 gap-2 mt-2'>
                            {/* Cột 1: NGÀY */}
                            <div className='relative'>
                                <select
                                    value={day}
                                    onChange={(e) => setDay(e.target.value)}
                                    className='w-full outline-none border-[1px] border-[#cdcdcd] rounded-[4px] py-[7px] px-[8px] text-black focus:border-blue-400 transition duration-200 bg-white appearance-none text-sm cursor-pointer'
                                >
                                    <option value=''>Ngày</option>
                                    {dayOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                                <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500'>
                                    <svg
                                        className='fill-current h-4 w-4'
                                        xmlns='http://www.w3.org/2000/svg'
                                        viewBox='0 0 20 20'
                                    >
                                        <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
                                    </svg>
                                </div>
                            </div>

                            {/* Cột 2: THÁNG */}
                            <div className='relative'>
                                <select
                                    value={month}
                                    onChange={(e) => setMonth(e.target.value)}
                                    className='w-full outline-none border-[1px] border-[#cdcdcd] rounded-[4px] py-[7px] px-[8px] text-black focus:border-blue-400 transition duration-200 bg-white appearance-none text-sm cursor-pointer'
                                >
                                    <option value=''>Tháng</option>
                                    {monthOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                                <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500'>
                                    <svg
                                        className='fill-current h-4 w-4'
                                        xmlns='http://www.w3.org/2000/svg'
                                        viewBox='0 0 20 20'
                                    >
                                        <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
                                    </svg>
                                </div>
                            </div>

                            {/* Cột 3: NĂM */}
                            <div className='relative'>
                                <select
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                    className='w-full outline-none border-[1px] border-[#cdcdcd] rounded-[4px] py-[7px] px-[8px] text-black focus:border-blue-400 transition duration-200 bg-white appearance-none text-sm cursor-pointer'
                                >
                                    <option value=''>Năm</option>
                                    {yearOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                                <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500'>
                                    <svg
                                        className='fill-current h-4 w-4'
                                        xmlns='http://www.w3.org/2000/svg'
                                        viewBox='0 0 20 20'
                                    >
                                        <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Hiển thị lỗi */}
                        {errorMessage && <p className='text-red-500 text-[12px] mt-1'>{errorMessage}</p>}

                        {/* SỬA: Thêm dòng ghi chú (Chỉ hiện khi không có lỗi để đỡ rối) */}
                        {!errorMessage && (
                            <p className='text-gray-500 text-[12px] mt-1 italic'>
                                * Hộ chiếu phải còn hạn ít nhất 6 tháng tính từ ngày hôm nay
                            </p>
                        )}
                    </div>
                )
            }}
        />
    )
}

export default PassportExpiryDateInput
