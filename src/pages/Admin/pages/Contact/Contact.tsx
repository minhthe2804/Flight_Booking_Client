import React, { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { SubmitHandler } from 'react-hook-form'
import { AxiosError } from 'axios'
import { useNavigate, createSearchParams } from 'react-router-dom'
import { omitBy, isNil } from 'lodash'

// Import các components con

import Paginate from '~/components/Pagination'

// Import API và Kiểu
import { contactApi, Contact, ContactFormData, ContactListResponse } from '~/apis/contact.api'
import { ContactFilter } from '~/types/contact.type' // Kiểu Filter
import useFlightQueryConfig from '~/hooks/useSearchFlightQueryConfig'
import { path } from '~/constants/path' // Giả sử bạn có path.admin_contacts
import ContactFilterCard from './components/ContactFilterCard'
import ContactForm from './components/ContactForm/ContactForm'
import ContactTable from './components/ContactTable'

// --- Component Chính ---
export default function AdminContactPage() {
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const [editingContact, setEditingContact] = useState<Contact | null>(null)

    // 1. Lấy TẤT CẢ params từ URL (page, limit, và các filter)
    const queryConfig = useFlightQueryConfig()

    // 2. 'filters' là state nội bộ, chỉ dùng để điền vào form filter
    const [filters, setFilters] = useState<ContactFilter>(() => {
        const { first_name, last_name, phone, email, citizen_id } = queryConfig as ContactFilter
        return { first_name, last_name, phone, email, citizen_id }
    })

    // === GỌI API ===

    // 3. Gọi API Liên hệ (dùng queryConfig từ URL)
    const { data: contactsData, isLoading: isLoadingContacts } = useQuery<ContactListResponse, Error>({
        queryKey: ['adminContacts', queryConfig],
        queryFn: () => contactApi.getContacts(queryConfig as ContactFilter).then((res) => res.data),
        staleTime: 1000 * 60
    })

    // SỬA: Truy cập đúng cấu trúc API
    const contacts = contactsData?.data?.contacts || []
    const pagination = contactsData?.data?.pagination

    // --- 5. MUTATIONS (Thêm/Sửa/Xóa) ---
    const createContactMutation = useMutation({
        mutationFn: (data: Omit<ContactFormData, 'contact_id'>) => contactApi.createContact(data),
        onSuccess: () => {
            toast.success('Thêm liên hệ thành công!')
            queryClient.invalidateQueries({ queryKey: ['adminContacts'] })
            handleResetForm()
        },
        onError: (error: AxiosError<{ message?: string }>) => {
            toast.error(error.response?.data?.message || 'Thêm thất bại')
        }
    })

    const updateContactMutation = useMutation({
        mutationFn: (data: ContactFormData) => contactApi.updateContact(data.contact_id, data),
        onSuccess: () => {
            toast.success('Cập nhật liên hệ thành công!')
            queryClient.invalidateQueries({ queryKey: ['adminContacts'] })
            handleResetForm()
        },
        onError: (error: AxiosError<{ message?: string }>) => {
            toast.error(error.response?.data?.message || 'Cập nhật thất bại')
        }
    })

    const deleteContactMutation = useMutation({
        mutationFn: (id: number) => contactApi.deleteContact(id),
        onSuccess: () => {
            toast.success('Xóa liên hệ thành công!')
            queryClient.invalidateQueries({ queryKey: ['adminContacts'] })
        },
        onError: (error: AxiosError<{ message?: string }>) => {
            toast.error(error.response?.data?.message || 'Xóa thất bại')
        }
    })

    // === 6. HANDLERS ===
    const onSubmitForm: SubmitHandler<ContactFormData> = (data) => {
        if (editingContact) {
            updateContactMutation.mutate(data)
        } else {
            const { contact_id, ...dataToSend } = data
            createContactMutation.mutate(dataToSend)
        }
    }

    const handleResetForm = () => {
        setEditingContact(null)
    }

    // Cập nhật state filter nội bộ KHI GÕ
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFilters((prev) => ({
            ...prev,
            [name]: value === 'Tất cả' ? '' : value
        }))
    }

    // Hàm Submit filter (Cập nhật URL)
    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const newParams = {
            ...queryConfig,
            ...filters,
            page: '1'
        }
        const cleanedParams = omitBy(newParams, (value) => isNil(value) || value === '')
        navigate({
            pathname: path.adminContact, // Sửa: Dùng path trang admin
            search: createSearchParams(cleanedParams).toString()
        })
    }

    // Hàm Reset filter
    const handleFilterReset = () => {
        setFilters({})
        const newParams = { page: '1', limit: queryConfig.limit || '10' } // Sửa: Mặc định 10
        navigate({
            pathname: path.adminContact, // Sửa: Dùng path trang admin
            search: createSearchParams(newParams).toString()
        })
    }

    const handleEditClick = (contact: Contact) => {
        setEditingContact(contact)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleDeleteClick = (id: number) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa liên hệ này?')) {
            deleteContactMutation.mutate(id)
        }
    }

    return (
        <div className='max-w-[1278px] mx-auto py-8 px-4'>
            <h1 className='text-3xl font-bold text-gray-900 text-center mb-8'>Quản lý Liên hệ</h1>

            <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
                {/* --- CỘT CHÍNH (FORM VÀ BẢNG) --- */}
                <div className='lg:col-span-9 space-y-6'>
                    {/* Form Thêm/Sửa (Luôn hiển thị) */}
                    <ContactForm
                        editingContact={editingContact}
                        onSubmitForm={onSubmitForm}
                        onResetForm={handleResetForm}
                    />

                    {/* Bảng Hiển thị Kết quả */}
                    <ContactTable
                        contacts={contacts}
                        isLoading={isLoadingContacts}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteClick}
                    />

                    {/* Phân trang */}
                    {pagination && pagination.totalPages > 1 && (
                        <Paginate pageSize={pagination.totalPages} queryConfig={queryConfig} />
                    )}
                </div>

                {/* --- CỘT LỌC (FILTER) --- */}
                <div className='lg:col-span-3'>
                    <ContactFilterCard
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onFilterSubmit={handleFilterSubmit}
                        onFilterReset={handleFilterReset}
                    />
                </div>
            </div>
        </div>
    )
}
