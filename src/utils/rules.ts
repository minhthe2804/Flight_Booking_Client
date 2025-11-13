import * as yup from 'yup'
import { isValidPhoneNumber } from 'react-phone-number-input'
import { PromotionType } from '~/types/promotion'

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

const getTodayString = () => {
    const today = new Date()
    // Đặt về 0 giờ để so sánh 'min' cho chính xác
    today.setHours(0, 0, 0, 0)
    return today
}

export const passportSchema = yup.object({
    passportNumber: yup
        .string()
        .required('Số hộ chiếu là bắt buộc')
        .min(6, 'Số hộ chiếu phải có ít nhất 6 ký tự')
        .max(20, 'Số hộ chiếu không được vượt quá 20 ký tự')
        .matches(/^[A-Z0-9]+$/, 'Số hộ chiếu chỉ bao gồm chữ cái in hoa và số'),
    passport_issuing_country: yup.string().required('Quốc gia cấp là bắt buộc').max(100, 'Độ dài tối đa là 100 ký tự'),
    passport_expiry: yup
        .string() // 1. Yêu cầu là string (khớp với component)
        .required('Vui lòng chọn ngày hết hạn')
        .test(
            'is-future-date', // Tên của test
            'Hộ chiếu đã hết hạn', // Message lỗi
            (value) => {
                if (!value) return false // Nếu rỗng (dù đã .required)
                // 2. Chuyển chuỗi 'YYYY-MM-DD' thành Date object
                const expiryDate = new Date(value)
                // 3. So sánh
                return expiryDate >= getTodayString()
            }
        )
})

export const passengerSchema = yup.object({
    namePassenger: yup.string().required('Tên là bắt buộc').max(160, 'Độ dài tối đa là 160 kí tự'),
    lastnamePassenger: yup.string().required('Họ là bắt buộc').max(160, 'Độ dài tối đa là 160 kí tự'),
    title: yup.string().required('Vui lòng chọn danh xưng'),
    gender: yup.string().required('Vui lòng chọn giới tính'),
    date_of_birth: yup
        .date()
        .required('Vui lòng chọn ngày sinh')
        .max(new Date(), 'Ngày sinh không hợp lệ')
        .typeError('Ngày, tháng, năm không hợp lệ'),

    nationality: yup.string().required('Vui lòng nhập quốc tịch').max(100, 'Độ dài tối đa là 100 ký tự'),
    citizen_id: yup
        .string()
        .required('CCCD là bắt buộc')
        .matches(/^[0-9]{12}$/, 'CCCD phải đúng 12 chữ số')
})

export const airportSchema = yup
    .object({
        airport_id: yup.number().required(),
        airport_code: yup.string().required('Mã sân bay là bắt buộc').max(3, 'Tối đa 3 ký tự'),
        airport_name: yup.string().required('Tên sân bay là bắt buộc'),
        city: yup.string().required('Thành phố là bắt buộc'),
        country_id: yup.number().required('Quốc gia là bắt buộc').typeError('Quốc gia là bắt buộc'),
        airport_type: yup
            .string()
            .oneOf(['domestic', 'international'], 'Loại sân bay không hợp lệ')
            .required('Loại sân bay là bắt buộc')
    })
    .required()

export const airlineSchema = yup.object({
    airline_id: yup.number().required(),
    airline_name: yup.string().required(),
    airline_code: yup.string().required()
})

export const airplaneSchema = yup
    .object({
        aircraft_id: yup.number().required(),
        model: yup.string().required('Model là bắt buộc'),
        airline_id: yup
            .number()
            .positive('Vui lòng chọn hãng')
            .required('Hãng là bắt buộc')
            .typeError('Hãng bay là bắt buộc'),
        total_seats: yup
            .number()
            .min(1, 'Tổng số ghế phải > 0')
            .required('Tổng số ghế là bắt buộc')
            .typeError('Tổng số ghế phải là số'),
        business_seats: yup
            .number()
            .min(0, 'Số ghế phải >= 0')
            .required('Số ghế Bus là bắt buộc')
            .typeError('Số ghế phải là số')

            .test('seats-check', 'Tổng ghế C và E vượt quá Tổng số ghế', function (value) {
                const { total_seats, economy_seats } = this.parent
                return (value || 0) + (economy_seats || 0) <= total_seats
            }),
        economy_seats: yup
            .number()
            .min(0, 'Số ghế phải >= 0')
            .required('Số ghế Eco là bắt buộc')
            .typeError('Số ghế phải là số')
            .test('seats-check', 'Tổng ghế C và E vượt quá Tổng số ghế', function (value) {
                const { total_seats, business_seats } = this.parent
                return (value || 0) + (business_seats || 0) <= total_seats
            }),

        aircraft_type: yup.string().nullable().defined().default(null)
    })
    .required()

export const customerSchema = yup
    .object({
        id: yup.number().required(), // Dùng 0 cho "thêm mới"
        lastName: yup.string().required('Họ và chữ lót là bắt buộc'),
        firstName: yup.string().required('Tên là bắt buộc'),
        title: yup.string().required('Danh xưng là bắt buộc'),
        cccd: yup
            .string()
            .required('CCCD là bắt buộc')
            .matches(/^[0-9]{12}$/, 'CCCD phải đúng 12 chữ số'),
        dob: yup
            .string()
            .required('Ngày sinh là bắt buộc')
            .matches(/^\d{4}-\d{2}-\d{2}$/, 'Định dạng ngày không hợp lệ'), // YYYY-MM-DD
        nationality: yup.string().required('Quốc tịch là bắt buộc'),
        type: yup
            .mixed<'Người lớn' | 'Trẻ em' | 'Em bé'>()
            .oneOf(['Người lớn', 'Trẻ em', 'Em bé'], 'Loại hành khách không hợp lệ')
            .required('Vui lòng chọn loại hành khách')
    })
    .required()

export const contactPersonSchema = yup
    .object({
        id: yup.number().required(), // Dùng 0 cho "thêm mới"
        lastName: yup.string().required('Họ và chữ lót là bắt buộc'),
        firstName: yup.string().required('Tên là bắt buộc'),
        phone: yup
            .string()
            .required('Số điện thoại là bắt buộc')
            .matches(/^[0-9]{10}$/, 'Số điện thoại phải đúng 10 chữ số'),
        email: yup.string().email('Email không hợp lệ').required('Email là bắt buộc')
    })
    .required()

export const promotionSchema = yup
    .object({
        id: yup
            .string()
            .required('Mã khuyến mãi là bắt buộc')
            .matches(/^[A-Z0-9]+$/, 'Mã chỉ gồm chữ hoa và số'),
        name: yup.string().required('Tên khuyến mãi là bắt buộc'),
        type: yup
            .string()
            .oneOf(['Phần trăm', 'Trực tiếp'], 'Vui lòng chọn loại khuyến mãi')
            .required('Vui lòng chọn loại khuyến mãi') as yup.StringSchema<PromotionType | ''>,

        value: yup
            .number()
            .typeError('Giá trị phải là một con số')
            .min(0, 'Giá trị không được âm')
            .required('Giá trị là bắt buộc'),
        startDate: yup
            .string()
            .required('Ngày bắt đầu là bắt buộc')
            .matches(/^\d{4}-\d{2}-\d{2}$/, 'Định dạng ngày không hợp lệ'),
        endDate: yup
            .string()
            .required('Ngày kết thúc là bắt buộc')
            .matches(/^\d{4}-\d{2}-\d{2}$/, 'Định dạng ngày không hợp lệ')
            // Sửa lỗi endDate test: khai báo rõ kiểu `value`
            .test('is-after-start-date', 'Ngày kết thúc phải sau ngày bắt đầu', function (value: string | undefined) {
                const { startDate } = this.parent as { startDate?: string }
                return !startDate || !value || new Date(value) >= new Date(startDate)
            }),
        description: yup.string().required('Mô tả là bắt buộc')
    })
    .required()

export const flightSearchSchema = yup.object({
    departure: yup.string().required('Vui lòng chọn điểm đi'),
    destination: yup.string().required('Vui lòng chọn điểm đến'),
    startDate: yup.date().nullable().required('Vui lòng chọn ngày đi'),
    endDate: yup.date().nullable().notRequired().default(null),
    isRoundTrip: yup.boolean().required(),
    passengers: yup
        .object({
            adult: yup.number().min(1, 'Phải có ít nhất 1 người lớn').required(),
            child: yup.number().required(),
            infant: yup.number().required()
        })
        .required(),
    class: yup
        .object({
            value: yup.string().required(),
            label: yup.string().required()
        })
        .nullable()
        .required('Vui lòng chọn hạng vé')
})

export const customerSchemaPassenger = yup.object({
    last_name: yup.string().required('Họ là bắt buộc').max(160, 'Độ dài tối đa 160 kí tự'),
    first_name: yup.string().required('Tên là bắt buộc').max(160, 'Độ dài tối đa là 160 kí tự'),

    middle_name: yup.string().nullable().defined(), // Thêm: Tên đệm

    title: yup.string().required('Vui lòng chọn danh xưng'),

    gender: yup.string().required('Vui lòng chọn giới tính'), // Thêm: Giới tính

    citizen_id: yup
        .string()

        .nullable()
        .defined()
        .matches(/^[0-9]{12}$/, 'CCCD phải đúng 12 chữ số'),

    date_of_birth: yup
        .string() // Dùng string cho YYYY-MM-DD
        .required('Vui lòng chọn ngày sinh')
        .matches(/^\d{4}-\d{2}-\d{2}$/, 'Định dạng ngày phải là YYYY-MM-DD')
        .test('is-past-date', 'Ngày sinh không hợp lệ', (value) => {
            if (!value) return true
            return new Date(value) < getTodayString()
        }),

    nationality: yup.string().required('Vui lòng nhập quốc tịch'),

    passenger_type: yup
        .string()

        .oneOf(['adult', 'child', 'infant'], 'Loại hành khách không hợp lệ')
        .required('Vui lòng chọn loại hành khách'),

    passport_number: yup.string().nullable().defined(),

    passport_expiry: yup
        .string()

        .nullable()
        .defined()
        .test('is-future-date', 'Hộ chiếu đã hết hạn', (value) => {
            if (!value) return true // Cho phép rỗng
            return new Date(value) >= getTodayString()
        }),

    passport_issuing_country: yup.string().nullable().defined(),

    passenger_id: yup.number().default(0)
})

// Dùng lại regex phone từ lần trước bạn hỏi
const phoneRegex = /^(0|\+84)(3[2-9]|5[2689]|7[06-9]|8[1-5]|9[0-9])[0-9]{7}$/

export const profileSchema = yup.object({
    // SỬA: Thêm validation cho email
    email: yup.string().email('Email không đúng định dạng').required('Bạn cần nhập email'),

    first_name: yup.string().required('Bạn cần nhập tên').max(160, 'Độ dài tối đa là 160 kí tự'),
    last_name: yup.string().required('Bạn cần nhập họ').max(160, 'Độ dài tối đa là 160 kí tự'),
    middle_name: yup.string().max(160, 'Độ dài tối đa là 160 kí tự').nullable().default(null),
    title: yup.string().required('Bạn cần chọn danh xưng').oneOf(['Mr', 'Mrs', 'Ms'], 'Danh xưng không hợp lệ'),
    phone: yup
        .string()
        .required('Bạn cần phải nhập số điện thoại')
        .matches(phoneRegex, 'Số điện thoại không đúng định dạng')
        .max(20, 'Độ dài tối đa là 20 kí tự'),
    date_of_birth: yup
        .string()
        .required('Bạn cần nhập ngày sinh')
        .matches(/^\d{4}-\d{2}-\d{2}$/, 'Ngày sinh không đúng định dạng YYYY-MM-DD'),
    citizen_id: yup
        .string()
        .required('Bạn cần nhập CCCD')
        .matches(/^[0-9]{12}$/, 'CCCD phải là 12 chữ số')
})

export const changePasswordSchema = yup.object({
    current_password: yup
        .string()
        .required('Bạn cần nhập mật khẩu cũ')
        .min(6, 'Mật khẩu có ít nhất 6 ký tự')
        .max(160, 'Độ dài tối đa là 160 kí tự'),
    new_password: yup
        .string()
        .required('Bạn cần nhập mật khẩu mới')
        .min(6, 'Mật khẩu có ít nhất 6 ký tự')
        .max(160, 'Độ dài tối đa là 160 kí tự'),
    confirm_password: yup
        .string()
        .required('Bạn cần nhập lại mật khẩu mới')
        .min(6, 'Mật khẩu có ít nhất 6 ký tự')
        .max(160, 'Độ dài tối đa là 160 kí tự')
        .oneOf([yup.ref('new_password')], 'Mật khẩu nhập lại không khớp') // Quan trọng
})

export const contactAdminSchema = yup.object({
    contact_id: yup.number().defined().default(0),
    first_name: yup.string().required('Tên là bắt buộc'),
    middle_name: yup.string().nullable().defined().default(null),
    last_name: yup.string().required('Họ là bắt buộc'),
    phone: yup
        .string()
        .required('Số điện thoại là bắt buộc')
        .matches(/^(?:\+84|0)\d{9}$/, 'Số điện thoại không hợp lệ (Bắt đầu +84 hoặc 0, đủ 10 số)'),
    email: yup.string().required('Email là bắt buộc').email('Email không hợp lệ'),
    citizen_id: yup
        .string()
        .nullable()
        .defined()
        .test('citizen_id-match', 'CCCD phải đúng 12 chữ số (nếu có)', (value) => {
            if (!value) return true
            return /^[0-9]{12}$/.test(value)
        }),

    is_primary: yup.boolean().required()
})

export const promotionAdminSchema = yup.object({
    promotion_id: yup.number().required(),
    promotion_code: yup.string().required('Mã code là bắt buộc').uppercase('Mã code phải viết hoa'),
    description: yup.string().required('Mô tả là bắt buộc'),

    discount_type: yup
        .string()
        .oneOf(['percentage', 'fixed_amount'], 'Loại giảm giá không hợp lệ')
        .required('Loại giảm giá là bắt buộc'),

    discount_value: yup
        .number()
        .min(0, 'Giá trị phải lớn hơn 0')
        .required('Giá trị giảm là bắt buộc')
        .typeError('Giá trị phải là số'),

    min_purchase: yup
        .number()
        .min(0, 'Giá trị phải lớn hơn 0')
        .required('Giá trị tối thiểu là bắt buộc')
        .typeError('Giá trị phải là số'),

    start_date: yup.string().required('Ngày bắt đầu là bắt buộc'),
    end_date: yup
        .string()
        .required('Ngày kết thúc là bắt buộc')
        .test('is-after-start', 'Ngày kết thúc phải sau ngày bắt đầu', function (value) {
            const { start_date } = this.parent
            if (!start_date || !value) return true // Bỏ qua nếu 1 trong 2 rỗng
            return new Date(value) >= new Date(start_date)
        }),

    is_active: yup.boolean().required(),

    usage_limit: yup
        .number()
        .min(1, 'Giới hạn phải lớn hơn 0')
        .required('Giới hạn sử dụng là bắt buộc')
        .typeError('Giới hạn phải là số')
})

export type Schema = yup.InferType<typeof schema>
export type UserSchema = yup.InferType<typeof userSchema>
export type PassportFormData = yup.InferType<typeof passportSchema>
export type PassengerFormData = yup.InferType<typeof passengerSchema>
export type ContactFormData = yup.InferType<typeof contactSchema>
export type AirportFormData = yup.InferType<typeof airportSchema>
export type AirplaneFormData = yup.InferType<typeof airplaneSchema>
export type customerFormData = yup.InferType<typeof customerSchema>
export type contactPersonFormData = yup.InferType<typeof contactPersonSchema>
export type promotionFormData = yup.InferType<typeof promotionSchema>
export type SearchFlightForm = yup.InferType<typeof flightSearchSchema>
export type ProfileSchema = yup.InferType<typeof profileSchema>
export type ChangePasswordSchema = yup.InferType<typeof changePasswordSchema>
export type ContactAdminSchema = yup.InferType<typeof contactAdminSchema>
export type PromotionAdminSchema = yup.InferType<typeof promotionAdminSchema>
