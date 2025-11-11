import { Controller, Control, FieldValues, Path } from 'react-hook-form'

// 2. Định nghĩa kiểu cho một lựa chọn trong dropdown

type SelectOption = {
    value: string | number
    label: string
    country_id?: number
    country_code?: string
    country_name?: string
}

// 3. Định nghĩa kiểu cho props của SelectField sử dụng Generics
// T extends FieldValues đảm bảo T là một kiểu dữ liệu form hợp lệ của RHF
interface SelectFieldProps<T extends FieldValues> {
    name: Path<T> // Path<T> đảm bảo 'name' là một key hợp lệ của form data T
    control: Control<T>
    label: string
    isNationality?: boolean
    placeholder?: string
    options: SelectOption[]
    disabled?: boolean
    countryApi?: boolean | undefined
}

const SelectField = <T extends FieldValues>({
    name,
    control,
    label,
    isNationality,
    placeholder,
    options = [],
    countryApi,
    ...rest
}: SelectFieldProps<T>) => {
    return (
        // Controller sẽ quản lý state và validation cho component này
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <div>
                    <label htmlFor={name} className='block text-sm font-medium text-gray-700 mb-1'>
                        {label}
                        <span className='text-red-500'>*</span>
                    </label>
                    <select
                        id={name}
                        {...field} // Gắn các props của RHF (onChange, onBlur, value, ref)
                        {...rest}
                        className={`mt-2 ${isNationality ? 'w-full' : 'w-[200px]'}  outline-none border-[1px] border-[#cdcdcd] rounded-[4px] py-[7px] px-[12px] placeholder:text-[12px] text-black focus:border-blue-400 transition duration-300 ease-in text-[15px]`}
                    >
                        <option value=''>{placeholder || '--- Chọn ---'}</option>
                        {options.map((option) => (
                            <option
                                key={countryApi ? option.country_id : option.value}
                                value={countryApi ? option.country_code : option.value}
                            >
                                {countryApi ? option.country_name : option.label}
                            </option>
                        ))}
                    </select>
                    {/* Hiển thị lỗi từ fieldState */}
                    <p className='text-red-500 text-[14px] mt-[2px] min-h-[20px]'>{error?.message}</p>
                </div>
            )}
        />
    )
}

export default SelectField
