type Role = 'User' | 'Admin'
export interface User {
    id: number
    email: string
    first_name: string
    last_name: string
    citizen_id: string
    roles: Role[]
}
