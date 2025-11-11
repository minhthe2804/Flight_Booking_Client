import { useMemo, useState } from 'react'
import ContactForm from './components/ContactForm/ContactForm'
import { SubmitHandler } from 'react-hook-form'
import ContactTable from './components/ContactTable'
import ContactFilterCard from './components/ContactFilterCard'

export interface Contact {
    id: number
    lastName: string // Họ và chữ lót
    firstName: string // Tên
    phone: string // Số điện thoại
    email: string // Email
}

// Kiểu dữ liệu cho filter người liên hệ
export interface ContactFilter {
    id: string
    lastName: string
    firstName: string
    phone: string
    email: string
    sortBy: string
    order: 'asc' | 'desc'
}

export const mockContacts: Contact[] = [
    { id: 1, lastName: 'Nguyễn Hoàng', firstName: 'Anh', phone: '0123456789', email: 'nguyenhoanganh@gmail.com' },
    { id: 2, lastName: 'Vũ Ngọc', firstName: 'Minh', phone: '0323456789', email: 'vungocminh@gmail.com' },
    { id: 3, lastName: 'Bùi Ngọc', firstName: 'Hà', phone: '0323456789', email: 'buingoccha@gmail.com' }, // Gõ lại từ ảnh, email có thể khác
    { id: 4, lastName: 'Đặng Quỳnh', firstName: 'Anh', phone: '0423456789', email: 'dangquynhanh@gmail.com' },
    { id: 5, lastName: 'Lê Bảo', firstName: 'Châu', phone: '0783289133', email: 'lebaochau@gmail.com' }
]

const initialFilterState: ContactFilter = {
    id: '',
    lastName: '',
    firstName: '',
    phone: '',
    email: '',
    sortBy: 'id',
    order: 'asc'
}

export default function Contact() {
    // State quản lý danh sách người liên hệ
    const [contacts, setContacts] = useState<Contact[]>(mockContacts)
    // State quản lý người liên hệ đang được edit
    const [editingContact, setEditingContact] = useState<Contact | null>(null)

    // State cho các ô input filter
    const [filterInputs, setFilterInputs] = useState<ContactFilter>(initialFilterState)
    // State cho bộ lọc đã được áp dụng
    const [appliedFilters, setAppliedFilters] = useState<ContactFilter>(initialFilterState)

    // --- Xử lý Logic ---

    // Cập nhật state của filter inputs
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFilterInputs((prev) => ({ ...prev, [name]: value }))
    }

    // Xử lý khi nhấn nút "Tìm kiếm"
    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setAppliedFilters(filterInputs)
    }

    // Xử lý khi nhấn nút "Đặt lại"
    const handleFilterReset = () => {
        setFilterInputs(initialFilterState)
        setAppliedFilters(initialFilterState)
    }

    // Xử lý submit form (Thêm mới / Cập nhật)
    const handleFormSubmit: SubmitHandler<Contact> = (data) => {
        if (data.id !== 0) {
            // data.id !== 0 nghĩa là đang Edit
            setContacts((prev) => prev.map((c) => (c.id === data.id ? data : c)))
            alert(`Cập nhật người liên hệ ${data.lastName} ${data.firstName} thành công!`)
        } else {
            // Logic Thêm mới
            const newId = Math.max(0, ...contacts.map((c) => c.id)) + 1
            const newContact = { ...data, id: newId }

            setContacts((prev) => [newContact, ...prev])
            alert(`Thêm người liên hệ ${newContact.lastName} ${newContact.firstName} thành công!`)
        }
        setEditingContact(null) // Reset form
    }

    // Nút "Làm mới" trên form
    const handleFormReset = () => {
        setEditingContact(null)
    }

    // Nút "Sửa" trong bảng
    const handleEdit = (contact: Contact) => {
        setEditingContact(contact)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // Nút "Xóa" trong bảng
    const handleDelete = (id: number) => {
        if (window.confirm(`Bạn có chắc muốn xóa người liên hệ mã ${id} không?`)) {
            setContacts((prev) => prev.filter((c) => c.id !== id))
            alert('Xóa người liên hệ thành công!')
            if (editingContact?.id === id) {
                setEditingContact(null)
            }
        }
    }

    // Lọc và Sắp xếp danh sách người liên hệ
    const processedContacts = useMemo(() => {
        let filtered = contacts.filter((c) => {
            return (
                String(c.id).includes(appliedFilters.id) &&
                c.lastName.toLowerCase().includes(appliedFilters.lastName.toLowerCase()) &&
                c.firstName.toLowerCase().includes(appliedFilters.firstName.toLowerCase()) &&
                c.phone.includes(appliedFilters.phone) &&
                c.email.toLowerCase().includes(appliedFilters.email.toLowerCase())
            )
        })

        // Sắp xếp
        filtered.sort((a, b) => {
            const key = appliedFilters.sortBy as keyof Omit<Contact, 'email' | 'phone'>

            if (key === 'id') {
                return appliedFilters.order === 'asc' ? a.id - b.id : b.id - a.id
            }

            const valA = String(a[key] || '').toLowerCase()
            const valB = String(b[key] || '').toLowerCase()

            if (valA < valB) return appliedFilters.order === 'asc' ? -1 : 1
            if (valA > valB) return appliedFilters.order === 'asc' ? 1 : -1
            return 0
        })

        return filtered
    }, [contacts, appliedFilters])

    // --- Render Giao diện ---

    return (
        <main className='flex-1 p-4 md:p-6 bg-gray-100 min-h-screen'>
            <h1 className='text-3xl font-bold mb-6 text-gray-900'>Quản lý người liên hệ</h1>

            {/* Layout 2 cột: Form và Bộ lọc */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6'>
                {/* Cột chính (2/3) */}
                <div className='lg:col-span-2'>
                    <ContactForm
                        editingContact={editingContact}
                        onSubmitForm={handleFormSubmit}
                        onResetForm={handleFormReset}
                    />
                    <ContactTable contacts={processedContacts} onEdit={handleEdit} onDelete={handleDelete} />
                </div>

                {/* Cột phụ (1/3) */}
                <div className='lg:col-span-1'>
                    <ContactFilterCard
                        filters={filterInputs}
                        onFilterChange={handleFilterChange}
                        onFilterSubmit={handleFilterSubmit}
                        onFilterReset={handleFilterReset}
                    />
                </div>
            </div>
        </main>
    )
}
