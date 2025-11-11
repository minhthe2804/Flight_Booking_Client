import { useMemo, useState } from 'react'
import PromotionForm from './components/PromotionForm'
import { SubmitHandler } from 'react-hook-form'
import PromotionTable from './components/PromotionTable'
import PromotionFilterCard from './components/PromotionFilterCard'

export type PromotionType = 'Phần trăm' | 'Trực tiếp'

export interface Promotion {
    id: string // Mã khuyến mãi (e.g., UuDaiT10)
    name: string // Tên khuyến mãi
    type: PromotionType | '' // Dùng "" làm giá trị rỗng
    value: number // Giá trị
    startDate: string // Ngày bắt đầu (YYYY-MM-DD)
    endDate: string // Ngày kết thúc (YYYY-MM-DD)
    description: string
}

// Kiểu dữ liệu cho filter khuyến mãi
export interface PromotionFilter {
    id: string
    name: string
    type: string // Sẽ là 'Tất cả' | 'Phần trăm' | 'Trực tiếp'
    sortBy: string
    order: 'asc' | 'desc'
}

export const mockPromotions: Promotion[] = [
    {
        id: 'UuDaiT10',
        name: 'Ưu đãi tháng 10',
        type: 'Trực tiếp',
        value: 100000.0,
        startDate: '2024-10-01',
        endDate: '2024-10-31',
        description: 'Giảm giá tháng 10'
    },
    {
        id: 'UuDaiT11',
        name: 'Ưu đãi tháng 11',
        type: 'Trực tiếp',
        value: 50000.0,
        startDate: '2024-11-01',
        endDate: '2024-11-30',
        description: 'Giảm giá tháng 11'
    },
    {
        id: 'UuDaiT12',
        name: 'Ưu đãi tháng 12',
        type: 'Phần trăm',
        value: 3.0,
        startDate: '2024-12-01',
        endDate: '2024-12-31',
        description: 'Giảm giá tháng 12'
    }
]

export const promotionTypes = [
    { value: 'Phần trăm', label: 'Phần trăm' },
    { value: 'Trực tiếp', label: 'Trực tiếp' }
]

const initialFilterState: PromotionFilter = {
    id: '',
    name: '',
    type: 'Tất cả',
    sortBy: 'id',
    order: 'asc'
}

export default function Promotion() {
    // State quản lý danh sách khuyến mãi
    const [promotions, setPromotions] = useState<Promotion[]>(mockPromotions)
    // State quản lý khuyến mãi đang được edit
    const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null)

    // State cho các ô input filter
    const [filterInputs, setFilterInputs] = useState<PromotionFilter>(initialFilterState)
    // State cho bộ lọc đã được áp dụng
    const [appliedFilters, setAppliedFilters] = useState<PromotionFilter>(initialFilterState)

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
    const handleFormSubmit: SubmitHandler<Promotion> = (data) => {
        const isEditing = !!editingPromotion

        if (isEditing) {
            setPromotions((prev) => prev.map((p) => (p.id === data.id ? data : p)))
            alert(`Cập nhật khuyến mãi ${data.id} thành công!`)
        } else {
            // Logic Thêm mới
            if (promotions.find((p) => p.id === data.id)) {
                alert(`Mã khuyến mãi ${data.id} đã tồn tại!`)
                return
            }
            setPromotions((prev) => [data, ...prev])
            alert(`Thêm khuyến mãi ${data.id} thành công!`)
        }
        setEditingPromotion(null) // Reset form
    }

    // Nút "Làm mới" trên form
    const handleFormReset = () => {
        setEditingPromotion(null)
    }

    // Nút "Sửa" trong bảng
    const handleEdit = (promotion: Promotion) => {
        setEditingPromotion(promotion)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // Nút "Xóa" trong bảng
    const handleDelete = (id: string) => {
        if (window.confirm(`Bạn có chắc muốn xóa khuyến mãi mã ${id} không?`)) {
            setPromotions((prev) => prev.filter((p) => p.id !== id))
            alert('Xóa khuyến mãi thành công!')
            if (editingPromotion?.id === id) {
                setEditingPromotion(null)
            }
        }
    }

    // Lọc và Sắp xếp danh sách
    const processedPromotions = useMemo(() => {
        let filtered = promotions.filter((p) => {
            return (
                p.id.toLowerCase().includes(appliedFilters.id.toLowerCase()) &&
                p.name.toLowerCase().includes(appliedFilters.name.toLowerCase()) &&
                (appliedFilters.type === 'Tất cả' || p.type === appliedFilters.type)
            )
        })

        // Sắp xếp
        filtered.sort((a, b) => {
            const key = appliedFilters.sortBy as keyof Promotion
            const valA = a[key]
            const valB = b[key]

            let compare = 0
            if (typeof valA === 'number' && typeof valB === 'number') {
                compare = valA - valB
            } else {
                compare = String(valA).toLowerCase().localeCompare(String(valB).toLowerCase())
            }

            return appliedFilters.order === 'asc' ? compare : -compare
        })

        return filtered
    }, [promotions, appliedFilters])

    // --- Render Giao diện ---

    return (
        <main className='flex-1 p-4 md:p-6 bg-gray-100 min-h-screen'>
            <h1 className='text-3xl font-bold mb-6 text-gray-900'>Quản lý khuyến mãi</h1>

            {/* Layout 2 cột: Form và Bộ lọc */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6'>
                {/* Cột chính (2/3) */}
                <div className='lg:col-span-2'>
                    <PromotionForm
                        editingPromotion={editingPromotion}
                        onSubmitForm={handleFormSubmit}
                        onResetForm={handleFormReset}
                    />

                    <PromotionTable promotions={processedPromotions} onEdit={handleEdit} onDelete={handleDelete} />
                </div>

                {/* Cột phụ (1/3) */}
                <div className='lg:col-span-1'>
                    <PromotionFilterCard
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
