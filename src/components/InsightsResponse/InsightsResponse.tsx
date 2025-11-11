// src/components/InsightsResponse.tsx

import React from 'react'
import * as T from '~/types/aiTypes'
import {
    UserCircleIcon,
    SparklesIcon,
    ShoppingCartIcon,
    ClockIcon,
    UsersIcon,
    TagIcon,
    MapIcon
} from '@heroicons/react/24/outline'

// (MỚI) Thêm ROUTE_MAP giả lập
const ROUTE_MAP: Record<string, string> = {
    '1-4': 'Hà Nội (HAN) - TP. HCM (SGN)',
    '2-1': 'Đà Nẵng (DAD) - Hà Nội (HAN)',
    '1-2': 'Hà Nội (HAN) - Đà Nẵng (DAD)'
    // Thêm các tuyến bay khác nếu cần
}

interface InsightsResponseProps {
    data: T.InsightsData
    // (ĐÃ XÓA) Xóa 'routesList' khỏi props
}

// ... (StatItem, Card components giữ nguyên) ...
const StatItem: React.FC<{
    icon: React.ElementType
    label: string
    value: React.ReactNode
}> = ({ icon: Icon, label, value }) => (
    <div className='flex items-center space-x-2 text-sm'>
        <Icon className='w-4 h-4 text-gray-500' />
        <span className='text-gray-600'>{label}:</span>
        <span className='font-semibold text-gray-800'>{value || 'N/A'}</span>
    </div>
)

const Card: React.FC<{
    icon: React.ElementType
    title: string
    children: React.ReactNode
}> = ({ icon: Icon, title, children }) => (
    <div className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden'>
        <div className='p-3 bg-gray-50 border-b border-gray-200'>
            <div className='flex items-center space-x-2'>
                <Icon className='w-5 h-5 text-blue-600' />
                <h4 className='font-semibold text-gray-800'>{title}</h4>
            </div>
        </div>
        <div className='p-3 space-y-2'>{children}</div>
    </div>
)

// (CẬP NHẬT) Component chính
const InsightsResponse: React.FC<InsightsResponseProps> = ({ data }) => {
    const { preferences, patterns, insights } = data

    // (CẬP NHẬT) Hàm renderRoutes giờ dùng ROUTE_MAP
    const renderRoutes = (routes: (string | { from: string; to: string })[]): string => {
        if (!routes || routes.length === 0) {
            return 'N/A'
        }

        return routes
            .map((route,index) => {
                // Trường hợp 1: Dữ liệu là string ID (ví dụ: "1-4")
                if (typeof route === 'string') {
                    // Dùng ROUTE_MAP để tra cứu
                    return ROUTE_MAP[index] || route // Nếu không thấy thì trả về ID
                }
                // Trường hợp 2: Dữ liệu là object (ví dụ: { from: "SGN", to: "HAN" })
                if (typeof route === 'object' && route !== null) {
                    return `${route.from || '?'}-${route.to || '?'}`
                }
                return 'N/A'
            })
            .join(', ')
    }

    return (
        <div className='space-y-3'>
            <h3 className='font-semibold text-gray-900'>Phân tích AI về hồ sơ của bạn:</h3>

            {/* 1. Sở thích (Từ Lịch sử TÌM KIẾM) */}
            <Card icon={UserCircleIcon} title='Sở thích (Tìm kiếm)'>
                <StatItem icon={TagIcon} label='Hạng vé' value={preferences.preferred_class} />
                <StatItem icon={UsersIcon} label='Số hành khách' value={preferences.preferred_passengers} />
                <StatItem
                    icon={MapIcon}
                    label='Tuyến bay'
                    value={renderRoutes(preferences.preferred_routes)} // (Sử dụng hàm mới)
                />
                <StatItem icon={ClockIcon} label='Giờ bay' value={preferences.preferred_times?.join(', ')} />
            </Card>

            {/* 2. Hành vi (Từ Lịch sử ĐẶT VÉ) */}
            <Card icon={ShoppingCartIcon} title='Hành vi (Đặt vé)'>
                <StatItem icon={SparklesIcon} label='Tần suất đặt vé' value={patterns.booking_frequency} />
                <StatItem
                    icon={MapIcon}
                    label='Các tuyến đã đặt'
                    value={renderRoutes(patterns.booked_routes)} // (Sử dụng hàm mới)
                />
            </Card>

            {/* 3. Phân tích AI */}
            <Card icon={SparklesIcon} title='Phân tích AI'>
                <StatItem
                    icon={MapIcon}
                    label='Tuyến tìm nhiều nhất'
                    value={renderRoutes(insights.most_searched_routes)} // (Sử dụng hàm mới)
                />
                <StatItem
                    icon={ClockIcon}
                    label='Giờ bay ưu tiên'
                    value={insights.preferred_travel_times?.join(', ')}
                />
            </Card>
        </div>
    )
}

export default InsightsResponse
