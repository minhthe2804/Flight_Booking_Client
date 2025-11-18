export interface SuccessResponse<Data> {
    success: boolean
    message: string
    data: Data
    meta: {
        pagination: {
            currentPage: number
            totalPages: number
            totalItems: number
            itemsPerPage: number
            hasNextPage: boolean
            hasPrevPage: boolean
        }
    }
}

export interface ErrorResponse<Data> {
    success: boolean
    message: string
    data?: Data
}

export type NoUndefinedField<T> = {
    [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>>
}
