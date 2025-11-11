type Role = 'User' | 'Admin'
export interface User {
    id: number
    email: string
    first_name: string
    middle_name: string
    last_name: string
    title: string
    phone: string
    date_of_birth: string
    citizen_id: string
    roles: Role[]
}


