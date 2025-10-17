export interface SuccessResponse<Data> {
    success: boolean
    message: string
    data: Data
}

export interface ErrorResponse<Data> {
    success: boolean
    message: string
    data?: Data
}

export type NoUndefinedField<T> = {
    [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>>
}
