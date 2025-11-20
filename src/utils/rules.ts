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

const getMinPassportExpiryDate = () => {
    const date = new Date()
    date.setMonth(date.getMonth() + 6)
    // Reset giờ về 0 để so sánh chính xác ngày
    date.setHours(0, 0, 0, 0)
    return date
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
        .string() // 1. Yêu cầu là string
        .required('Vui lòng chọn ngày hết hạn') // Bắt buộc nhập
        .test(
            'is-valid-passport-expiry', // Tên của test
            'Hộ chiếu phải còn hạn ít nhất 6 tháng', // Message lỗi
            (value) => {
                if (!value) return false // Nếu rỗng thì lỗi

                // 2. Chuyển chuỗi 'YYYY-MM-DD' thành Date object
                const expiryDate = new Date(value)

                // 3. So sánh với ngày hiện tại + 6 tháng
                return expiryDate >= getMinPassportExpiryDate()
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

const benefitSchema = yup.object({
    service_id: yup.number().required(),
    name: yup.string().required(),
    type: yup.string().required(),
    value: yup.number().required('Tham số là bắt buộc').typeError('Tham số phải là số'),
    unit: yup.string().nullable().defined(),
    description: yup.string().required()
})

const servicePackageSchema = yup.object({
    package_id: yup.number().optional(), // ID (nếu đang sửa)
    package_name: yup.string().required('Tên gói là bắt buộc'),
    package_code: yup.string().required('Mã code là bắt buộc'),
    class_type: yup.string().oneOf(['economy', 'business']).required(),
    package_type: yup.string().required('Loại gói là bắt buộc'),
    price_multiplier: yup // SỬA: Khớp với payload (number)
        .number()
        .required('Hệ số nhân là bắt buộc')
        .min(0, 'Hệ số phải > 0')
        .typeError('Hệ số phải là số'),
    benefits: yup.array().of(benefitSchema).required()
})

// SỬA: Schema cho Form Hãng bay (chính)
export const airlineFormSchema = yup.object({
    airline_id: yup.number().defined().default(0),
    airline_code: yup.string().required('Mã hãng bay là bắt buộc').max(3, 'Tối đa 3 ký tự'),
    airline_name: yup.string().required('Tên hãng bay là bắt buộc'),
    // SỬA: country_id (Cho phép 0 hoặc undefined, nhưng yêu cầu số dương)
    country_id: yup
        .number()
        .transform((value) => (isNaN(value) ? undefined : value)) // Biến NaN thành undefined
        .required('Quốc gia là bắt buộc')
        .positive('Quốc gia là bắt buộc') // 0 sẽ không hợp lệ
        .typeError('Quốc gia là bắt buộc'),
    logo_url: yup.string().url('Phải là URL hợp lệ').nullable().defined().default(null),
    // SỬA: Dùng 'service_packages' (snake_case)
    service_packages: yup.array().of(servicePackageSchema).min(1, 'Phải có ít nhất 1 gói dịch vụ').required()
})

export const countrySchema = yup.object({
    country_name: yup.string().required('Tên quốc gia là bắt buộc'),
    country_code: yup
        .string()
        .required('Mã quốc gia là bắt buộc')
        .max(3, 'Mã quốc gia tối đa 3 ký tự (VD: VN)')
        .uppercase()
})

// Schema cho 1 Dịch vụ Hành lý (lồng nhau)
const baggageServiceSchema = yup.object({
    baggage_service_id: yup.number().optional(), // ID (nếu đang sửa)
    weight_kg: yup.number().min(0).required('Số kg là bắt buộc').typeError('Phải là số'),
    price: yup.number().min(0).required('Giá là bắt buộc').typeError('Phải là số'),
    description: yup.string().required('Mô tả là bắt buộc')
})

// Schema cho 1 Dịch vụ Suất ăn (lồng nhau)
const mealServiceSchema = yup.object({
    meal_service_id: yup.number().optional(), // ID (nếu đang sửa)
    meal_name: yup.string().required('Tên suất ăn là bắt buộc'),
    meal_description: yup.string().required('Mô tả là bắt buộc'),
    price: yup.number().min(0).required('Giá là bắt buộc').typeError('Phải là số'),
    is_vegetarian: yup.boolean().default(false),
    is_halal: yup.boolean().default(false)
})

// Schema cho Form Chuyến bay (chính)
export const flightFormSchema = yup.object({
    flight_id: yup.number().defined().default(0), // (Dùng cho Sửa)

    // Thông tin cơ bản
    airline_id: yup
        .number()
        .positive('Hãng hàng không là bắt buộc')
        .required('Hãng hàng không là bắt buộc')
        .typeError('Hãng bay là bắt buộc'),
    aircraft_id: yup
        .number()
        .positive('Máy bay là bắt buộc')
        .required('Máy bay là bắt buộc')
        .typeError('Máy bay là bắt buộc'),
    flight_type: yup.string().required('Loại chuyến bay là bắt buộc'),
    status: yup.string().required('Trạng thái là bắt buộc'),

    // Lộ trình
    departure_airport_id: yup
        .number()
        .positive('Sân bay đi là bắt buộc')
        .required('Sân bay đi là bắt buộc')
        .typeError('Sân bay đi là bắt buộc'),
    arrival_airport_id: yup
        .number()
        .positive('Sân bay đến là bắt buộc')
        .required('Sân bay đến là bắt buộc')
        .typeError('Sân bay đến là bắt buộc')
        .notOneOf([yup.ref('departure_airport_id')], 'Sân bay đến không được trùng sân bay đi'),

    departure_time: yup.string().required('Thời gian đi là bắt buộc'),
    arrival_time: yup
        .string()
        .required('Thời gian đến là bắt buộc')
        .test('is-after-departure', 'Giờ đến phải sau giờ đi', function (value) {
            const { departure_time } = this.parent
            if (!departure_time || !value) return true
            return new Date(value) > new Date(departure_time)
        }),

    // Giá vé
    economy_price: yup.number().min(0).required('Giá Economy là bắt buộc').typeError('Giá phải là số'),
    business_price: yup.number().min(0).required('Giá Business là bắt buộc').typeError('Giá phải là số'),

    // Dịch vụ
    baggage_services: yup.array().of(baggageServiceSchema).required(),
    meal_services: yup.array().of(mealServiceSchema).required()
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
export type AirlineFormSchema = yup.InferType<typeof airlineFormSchema>
export type CountryFormData = yup.InferType<typeof countrySchema>
export type FlightFormData = yup.InferType<typeof flightFormSchema>
