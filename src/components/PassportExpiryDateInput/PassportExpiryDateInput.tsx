import React, { useMemo, useEffect, useState } from 'react'
import { Controller, Control, FieldValues, Path } from 'react-hook-form'

// --- Helper Functions ---
const now = new Date()
const currentYear = now.getFullYear()
const currentMonth = now.getMonth() + 1
const currentDay = now.getDate()

const generateExpiryYearOptions = () => {
    const years = []
    // Hộ chiếu thường có hạn 10 năm, ta cho phép chọn trước 15 năm
    for (let i = currentYear; i <= currentYear + 15; i++) {
        years.push({ value: i.toString(), label: i.toString() })
    }
    return years
}

// ----------------------

interface ExpiryDateInputProps<T extends FieldValues> {
    name: Path<T>
    control: Control<T>
    label: string
}

const PassportExpiryDateInput = <T extends FieldValues>({ name, control, label }: ExpiryDateInputProps<T>) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => {
                const [year, setYear] = useState('')
                const [month, setMonth] = useState('')
                const [day, setDay] = useState('')

                // Đồng bộ từ RHF xuống component
                useEffect(() => {
                    if (field.value && typeof field.value === 'string') {
                        const [y, m, d] = field.value.split('-')
                        setYear(y || '')
                        setMonth(m || '')
                        setDay(d || '')
                    }
                }, [field.value])

                // Đồng bộ từ component lên RHF
                useEffect(() => {
                    if (day && month && year) {
                        const newDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
                        if (newDate !== field.value) field.onChange(newDate)
                    } else if (field.value) {
                        field.onChange(undefined)
                    }
                }, [day, month, year, field])

                // === LOGIC ĐỘNG CHO DROPDOWN ===
                const yearOptions = useMemo(() => generateExpiryYearOptions(), [])

                const monthOptions = useMemo(() => {
                    let startMonth = 1
                    if (parseInt(year) === currentYear) {
                        startMonth = currentMonth
                    }
                    const months = []
                    for (let i = startMonth; i <= 12; i++) {
                        months.push({ value: i.toString(), label: `Tháng ${i}` })
                    }
                    return months
                }, [year])

                const dayOptions = useMemo(() => {
                    if (!year || !month) return []
                    let startDay = 1
                    if (parseInt(year) === currentYear && parseInt(month) === currentMonth) {
                        startDay = currentDay
                    }
                    const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate()
                    const days = []
                    for (let i = startDay; i <= daysInMonth; i++) {
                        days.push({ value: i.toString(), label: i.toString() })
                    }
                    return days
                }, [year, month])

                // === TỰ ĐỘNG RESET KHI THAY ĐỔI ===
                useEffect(() => {
                    setMonth('')
                    setDay('')
                }, [year])
                useEffect(() => {
                    setDay('')
                }, [month])

                return (
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                            {label}
                            <span className='text-red-500'>*</span>
                        </label>
                        <div className='flex space-x-2 mt-2'>
                            <select
                                value={day}
                                onChange={(e) => setDay(e.target.value)}
                                className={`mt-1 w-full outline-none border-[1px] border-[#cdcdcd] rounded-[4px] py-[7px] px-[12px] placeholder:text-[12px] text-black focus:border-blue-400 transition duration-300 ease-in text-[15px]}`}
                            >
                                <option value=''>DD</option>
                                {dayOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                                className={`mt-1 w-full outline-none border-[1px] border-[#cdcdcd] rounded-[4px] py-[7px] px-[12px] placeholder:text-[12px] text-black focus:border-blue-400 transition duration-300 ease-in text-[15px]}`}
                            >
                                <option value=''>MMMM</option>
                                {monthOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                className={`mt-1 w-full outline-none border-[1px] border-[#cdcdcd] rounded-[4px] py-[7px] px-[12px] placeholder:text-[12px] text-black focus:border-blue-400 transition duration-300 ease-in text-[15px]}`}
                            >
                                <option value=''>YYYY</option>
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

export default PassportExpiryDateInput
