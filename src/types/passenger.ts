// Định nghĩa kiểu cho một tùy chọn số lượng
export interface PassengerCount {
    adult: number
    child: number
    infant: number
}

export type SelectedMeals = { [mealIdKey: string]: number }

export interface Passenger {
    id: number
    fullName: string
    type: 'Người lớn' | 'Trẻ em' | 'Em bé'
    departureBaggageId: string
    returnBaggageId: string
    departureMeals: SelectedMeals
    returnMeals: SelectedMeals
}

export const titles = [
    { value: 'Mr', label: 'Ông' },
    { value: 'Mrs', label: 'Bà' },
    { value: 'Ms', label: 'Cô' }
]

export const passengerTypes = [
    { value: 'adult', label: 'Người lớn' },
    { value: 'child', label: 'Trẻ em' },
    { value: 'infant', label: 'Em bé' }
]

export const genders = [
    { value: 'male', label: 'Nam' },
    { value: 'female', label: 'Nữ' }
]

export interface PassengerAdmin {
    passenger_id: number
    first_name: string 
    middle_name: string | null
    last_name: string
    title: string
    gender: 'male' | 'female' | string
    citizen_id: string | null
    passenger_type: 'adult' | 'child' | 'infant'
    date_of_birth: string 
    nationality: string
    passport_number: string | null
    passport_expiry: string | null
    passport_issuing_country: string | null
}

// (Bao gồm các trường filter VÀ phân trang)
export type PassengerFilterAdmin = Partial<
  Omit<PassengerAdmin, 'passenger_id'> & {
    passenger_id: string 
    page: string
    limit: string
  }
>
