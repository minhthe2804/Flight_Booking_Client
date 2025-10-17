import { InputHTMLAttributes, useState } from 'react'
import { UseFormRegister } from 'react-hook-form'
import { useMatch } from 'react-router-dom'
import { path } from '~/constants/path'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    classNameInput?: string
    classNameError?: string
    label?: string
    isFont?: boolean
    isRequired?: boolean
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    register?: UseFormRegister<any>
    errorMessage?: string
    name?: string
    errorEmail?: string
    inputEmail?: boolean
    setErrorEmail?: React.Dispatch<React.SetStateAction<string>>
    errorPassword?: string
    inputPassword?: boolean
    setErrorPassword?: React.Dispatch<React.SetStateAction<string>>
}

export default function Input({
    className,
    classNameError = 'text-red-500 text-[14px] mt-[2px] min-h-[20px]',
    classNameInput = 'w-full outline-none border-[1px] border-[#817f7f] rounded-[4px] py-[7px] px-[12px] placeholder:text-[15px] text-black focus:border-blue-400 transition duration-300 ease-in text-[15px]',
    label,
    isFont,
    isRequired,
    name,
    errorMessage,
    register,
    errorEmail,
    errorPassword,
    inputEmail,
    inputPassword,
    setErrorPassword,
    setErrorEmail,
    ...rest
}: InputProps) {
    const registerResult = register && name ? register(name) : {}
    const changepasswordMatch = useMatch(path.changePassword)
    // eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
    const [openEye, setOpenEye] = useState<Boolean>(false)

    const resetErrorEmail = () => {
        if (inputEmail) {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            setErrorEmail && setErrorEmail('')
        }
        if (inputPassword) {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            setErrorPassword && setErrorPassword('')
        }
    }

    const toggleEye = () => {
        setOpenEye((prev) => !prev)
    }

    const handleType = () => {
        if (rest.type === 'password') {
            return openEye ? 'text' : 'password'
        }
        return rest.type
    }

    return (
        <div className={className}>
            {label && (
                <label
                    htmlFor=''
                    className={isFont ? 'text-[16px] text-gray-700 font-semibold' : 'text-[16px] text-[#dddddf]'}
                >
                    {`${label}`}
                    {isRequired && <span className='text-red-500'>*</span>}
                </label>
            )}

            <input
                className={classNameInput}
                {...registerResult}
                {...rest}
                type={handleType() || 'text'}
                onInput={resetErrorEmail}
            />
            {changepasswordMatch && openEye && (
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className={
                        name === 'confirm_password'
                            ? 'absolute top-[8px] right-[-10px] h-5 w-5 cursor-pointer'
                            : 'absolute top-[8px] right-[5px] h-5 w-5 cursor-pointer'
                    }
                    onClick={toggleEye}
                >
                    <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z'
                    />
                    <path strokeLinecap='round' strokeLinejoin='round' d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                </svg>
            )}

            {changepasswordMatch && !openEye && (
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className={
                        name === 'confirm_password'
                            ? 'absolute top-[8px] right-[-10px] h-5 w-5 cursor-pointer'
                            : 'absolute top-[8px] right-[5px] h-5 w-5 cursor-pointer'
                    }
                    onClick={toggleEye}
                >
                    <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88'
                    />
                </svg>
            )}
            <p className={name === 'confirm_password' ? classNameError + 'ml-[14px]' : classNameError}>
                {(errorEmail && errorEmail) || (errorPassword && errorPassword) || errorMessage}
            </p>
        </div>
    )
}
