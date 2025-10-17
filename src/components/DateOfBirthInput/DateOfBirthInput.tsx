import { useEffect, useState } from 'react'
import { Controller, Control, FieldValues, Path } from 'react-hook-form'

// --- Helper Functions để tạo options ---
const generateYearOptions = () => {
    const currentYear = new Date().getFullYear()
    const years = []
    for (let i = currentYear; i >= currentYear - 100; i--) {
        years.push({ value: i.toString(), label: i.toString() })
    }
    return years
}

const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: (i + 1).toString(),
    label: `Tháng ${i + 1}`
}))

const yearOptions = generateYearOptions()
// ------------------------------------

interface DateOfBirthInputProps<T extends FieldValues> {
    name: Path<T>
    control: Control<T>
    label: string
}

const DateOfBirthInput = <T extends FieldValues>({ name, control, label }: DateOfBirthInputProps<T>) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => {
                // 1. TẠO STATE NỘI BỘ
                const [dateParts, setDateParts] = useState({
                    day: '',
                    month: '',
                    year: ''
                })

                // 2. ĐỒNG BỘ TỪ RHF VÀO STATE NỘI BỘ (khi field.value thay đổi)
                useEffect(() => {
                    if (field.value) {
                        const [year, month, day] = field.value.split('-')
                        setDateParts({
                            day: parseInt(day).toString(),
                            month: parseInt(month).toString(),
                            year
                        })
                    } else {
                        // Reset nếu field.value là null/undefined
                        setDateParts({ day: '', month: '', year: '' })
                    }
                }, [field.value])

                // 3. ĐỒNG BỘ TỪ STATE NỘI BỘ LÊN RHF (khi người dùng chọn)
                useEffect(() => {
                    const { day, month, year } = dateParts
                    if (day && month && year) {
                        // Khi đủ 3 giá trị, cập nhật react-hook-form
                        field.onChange(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`)
                    } else if (field.value) {
                        // Nếu đang có giá trị nhưng người dùng xóa 1 trong 3,
                        // thì xóa giá trị trong react-hook-form
                        field.onChange(undefined)
                    }
                }, [dateParts, field])

                const handleDateChange = (part: 'day' | 'month' | 'year', value: string) => {
                    // Chỉ cập nhật state nội bộ
                    setDateParts((prev) => ({ ...prev, [part]: value }))
                }

                // Logic để tạo số ngày động theo tháng và năm
                const daysInMonth = (y: string, m: string) => new Date(parseInt(y), parseInt(m), 0).getDate()
                const numDays = dateParts.year && dateParts.month ? daysInMonth(dateParts.year, dateParts.month) : 31
                const dayOptions = Array.from({ length: numDays }, (_, i) => ({
                    value: (i + 1).toString(),
                    label: (i + 1).toString()
                }))

                // Xử lý khi ngày đã chọn không hợp lệ (vd: 31/2)
                useEffect(() => {
                    if (parseInt(dateParts.day) > numDays) {
                        setDateParts((prev) => ({ ...prev, day: '' }))
                    }
                }, [numDays, dateParts.day])

                return (
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                            {label}
                            <span className='text-red-500'>*</span>
                        </label>
                        <div className='flex space-x-2 mt-2'>
                            {/* --- Ô chọn Ngày --- */}
                            <select
                                value={dateParts.day} // Dùng state nội bộ
                                onChange={(e) => handleDateChange('day', e.target.value)}
                                className={`mt-1 w-full outline-none border-[1px] border-[#cdcdcd] rounded-[4px] py-[7px] px-[12px] placeholder:text-[12px] text-black focus:border-blue-400 transition duration-300 ease-in text-[15px]`}
                            >
                                <option value=''>Ngày</option>
                                {dayOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>

                            {/* --- Ô chọn Tháng --- */}
                            <select
                                value={dateParts.month} // Dùng state nội bộ
                                onChange={(e) => handleDateChange('month', e.target.value)}
                                className={`mt-1 w-full outline-none border-[1px] border-[#cdcdcd] rounded-[4px] py-[7px] px-[12px] placeholder:text-[12px] text-black focus:border-blue-400 transition duration-300 ease-in text-[15px]`} // Sửa lỗi thừa dấu '
                            >
                                <option value=''>Tháng</option>
                                {monthOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>

                            {/* --- Ô chọn Năm --- */}
                            <select
                                value={dateParts.year} // Dùng state nội bộ
                                onChange={(e) => handleDateChange('year', e.target.value)}
                                className={`mt-1 w-full outline-none border-[1px] border-[#cdcdcd] rounded-[4px] py-[7px] px-[12px] placeholder:text-[12px] text-black focus:border-blue-400 transition duration-300 ease-in text-[15px]`}
                            >
                                <option value=''>Năm</option>
                                {yearOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {error && <p className='text-red-500 text-[14px] mt-[2px] min-h-[20px]'>{error.message}</p>}
                    </div>
                )
            }}
        />
    )
}

export default DateOfBirthInput
