import * as yup from 'yup'
import { isValidPhoneNumber } from 'react-phone-number-input'

const handleConfirmPasswordYup = (refString: string) => {
    return yup
        .string()
        .required('Nhập lại password là bắt buộc')
        .min(6, 'Độ dài từ 6 - 160 ký tự')
        .max(160, 'Độ dài từ 6 - 160 ký tự')
        .oneOf([yup.ref(refString)], 'Nhập lại password không khớp')
}

export const schema = yup.object({
    first_name: yup.string().required('Tên là bắt buộc').max(160, 'Độ dài tối đa là 160 kí tự'),
    last_name: yup.string().required('Họ là bắt buộc').max(160, 'Độ dài tối đa là 160 kí tự'),
    email: yup
        .string()
        .required('Email là bắt buộc')
        .email('Email không đúng định dạng')
        .min(5, 'Độ dài từ 5 - 160 ký tự')
        .max(160, 'Độ dài từ 5 - 160 ký tự'),
    phone: yup
        .string()
        .required('Số điện thoại là bắt buộc')
        .test('is-valid-phone', 'Số điện thoại không hợp lệ', (value) => {
            // value ở đây là chuỗi số điện thoại người dùng nhập vào
            // isValidPhoneNumber sẽ kiểm tra tính hợp lệ của nó trên toàn thế giới
            if (!value) return true // Bỏ qua nếu rỗng, .required() sẽ xử lý
            return isValidPhoneNumber(value)
        }),
    title: yup.string().required('Vui lòng chọn danh xưng'),
    date_of_birth: yup
        .date()
        .required('Vui lòng chọn ngày sinh')
        .max(new Date(), 'Ngày sinh không hợp lệ')
        .typeError('Ngày, tháng, năm không hợp lệ'),

    nationality: yup.string().required('Vui lòng nhập quốc tịch').max(100, 'Độ dài tối đa là 100 ký tự'),
    password: yup
        .string()
        .required('Mật khẩu là bắt buộc')
        .min(6, 'Độ dài từ 6 - 160 ký tự')
        .max(160, 'Độ dài từ 6 - 160 ký tự'),
    confirm_password: handleConfirmPasswordYup('password'),
    search: yup.string().trim().required('Tên sản phẩm là bắt buộc')
})

export const userSchema = yup.object({
    name: yup.string().required('Tên là bắt buộc').max(160, 'Độ dài tối đa là 160 kí tự'),
    lastname: yup.string().required('Họ là bắt buộc').max(160, 'Độ dài tối đa là 160 kí tự'),
    username: yup.string().required('Bạn cần phải nhập họ tên').max(160, 'Độ dài tối đa là 160 kí tự'),
    phone: yup
        .string()
        .required('Bạn cần phải nhập số điện thoại')
        .matches(/^(0|\+84)(3[2-9]|5[2689]|7[06-9]|8[1-5]|9[0-9])[0-9]{7}$/, 'Số điện thoại không đúng định dạng')
        .max(20, 'Độ dài tối đa là 20 kí tự'),
    address: yup.string().required('Bạn cần phải nhập địa chỉ').max(160, 'Độ dài tối đa là 160 kí tự')
})

export const changePasswordSchema = yup.object({
    password: yup
        .string()
        .required('Password là bắt buộc')
        .min(6, 'Độ dài từ 6 - 160 ký tự')
        .max(160, 'Độ dài từ 6 - 160 ký tự'),
    new_password: yup
        .string()
        .required('Password là bắt buộc')
        .min(6, 'Độ dài từ 6 - 160 ký tự')
        .max(160, 'Độ dài từ 6 - 160 ký tự'),
    confirm_password: handleConfirmPasswordYup('new_password')
})

export const contactSchema = yup.object({
    nameContact: yup.string().required('Tên là bắt buộc').max(160, 'Độ dài tối đa là 160 kí tự'),
    lastnameContact: yup.string().required('Họ là bắt buộc').max(160, 'Độ dài tối đa là 160 kí tự'),
    email: yup
        .string()
        .required('Email là bắt buộc')
        .email('Email không đúng định dạng')
        .min(5, 'Độ dài từ 5 - 160 ký tự')
        .max(160, 'Độ dài từ 5 - 160 ký tự'),
    phone: yup
        .string()
        .required('Số điện thoại là bắt buộc')
        .test('is-valid-phone', 'Số điện thoại không hợp lệ', (value) => {
            // value ở đây là chuỗi số điện thoại người dùng nhập vào
            // isValidPhoneNumber sẽ kiểm tra tính hợp lệ của nó trên toàn thế giới
            if (!value) return true // Bỏ qua nếu rỗng, .required() sẽ xử lý
            return isValidPhoneNumber(value)
        })
})

export const passportSchema = yup.object({
    passportNumber: yup
        .string()
        .required('Số hộ chiếu là bắt buộc')
        .min(6, 'Số hộ chiếu phải có ít nhất 6 ký tự')
        .max(20, 'Số hộ chiếu không được vượt quá 20 ký tự')
        .matches(/^[A-Z0-9]+$/, 'Số hộ chiếu chỉ bao gồm chữ cái in hoa và số'),
    issuingCountry: yup.string().required('Vui lòng chọn quốc gia cấp'),
    expiryDate: yup
        .date()
        .required('Ngày hết hạn là bắt buộc')
        .typeError('Ngày hết hạn không hợp lệ')
        // Dòng này là quan trọng nhất cho logic hộ chiếu
        .min(new Date(new Date().setHours(0, 0, 0, 0)), 'Hộ chiếu đã hết hạn')
})

export const passengerSchema = yup.object({
    namePassenger: yup.string().required('Tên là bắt buộc').max(160, 'Độ dài tối đa là 160 kí tự'),
    lastnamePassenger: yup.string().required('Họ là bắt buộc').max(160, 'Độ dài tối đa là 160 kí tự'),
    title: yup.string().required('Vui lòng chọn danh xưng'),
    date_of_birth: yup
        .date()
        .required('Vui lòng chọn ngày sinh')
        .max(new Date(), 'Ngày sinh không hợp lệ')
        .typeError('Ngày, tháng, năm không hợp lệ'),

    nationality: yup.string().required('Vui lòng nhập quốc tịch').max(100, 'Độ dài tối đa là 100 ký tự')
})

export type Schema = yup.InferType<typeof schema>
export type UserSchema = yup.InferType<typeof userSchema>
export type ChangePasswordSchema = yup.InferType<typeof changePasswordSchema>
export type PassportFormData = yup.InferType<typeof passportSchema>
export type PassengerFormData = yup.InferType<typeof passengerSchema>
export type ContactFormData = yup.InferType<typeof contactSchema>
