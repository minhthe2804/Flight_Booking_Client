import http from '~/utils/http'
import { SuccessResponse } from '~/types/utils.type'
import { ContactFilter } from '~/types/contact.type'

// --- 1. KIỂU DỮ LIỆU TỪ API ---
export interface Contact {
    contact_id: number
    user_id: number
    first_name: string
    middle_name: string | null
    last_name: string
    phone: string
    email: string
    citizen_id: string | null
    is_primary: boolean
    created_at: string
    updated_at: string
}

// Kiểu cho 1 Liên hệ (dùng cho Form)
export type ContactFormData = Omit<Contact, 'user_id' | 'created_at' | 'updated_at'>

// SỬA: Kiểu cho toàn bộ response (khớp API)
export type ContactListResponse = SuccessResponse<{
    contacts: Contact[]
    pagination: {
        currentPage: number
        totalPages: number
        totalItems: number
        itemsPerPage: number
        hasNextPage: boolean
        hasPrevPage: boolean
    }
}>

// Kiểu cho response chi tiết (Thêm/Sửa)
export type ContactDetailResponse = SuccessResponse<Contact>

// --- 2. HÀM GỌI API ---
export const contactApi = {
    /**
     * Lấy danh sách liên hệ (có filter và phân trang)
     */
    getContacts: (params: ContactFilter) => {
        return http.get<ContactListResponse>('/admin/contacts', { params })
    },

    /**
     * Tạo liên hệ mới
     */
    createContact: (data: Omit<ContactFormData, 'contact_id'>) => {
        return http.post<ContactDetailResponse>('/admin/contacts', data)
    },

    /**
     * Cập nhật một liên hệ
     */
    updateContact: (id: number, data: Partial<ContactFormData>) => {
        return http.put<ContactDetailResponse>(`/admin/contacts/${id}`, data)
    },

    /**
     * Xóa một liên hệ
     */
    deleteContact: (id: number) => {
        return http.delete<SuccessResponse<{}>>(`/admin/contacts/${id}`)
    }
}
