import classNames from 'classnames'
import { Link, createSearchParams, useLocation } from 'react-router-dom'
import { FlightQueryConfig } from '~/hooks/useSearchFlightQueryConfig'

interface Props {
    queryConfig: FlightQueryConfig
    pageSize: number // Đây là totalPages (tổng số trang)
}

/**
Với range = 2 áp dụng cho khoảng cách đầu, cuối và xung quanh current_page
[1] 2 3 ... 19 20
1 [2] 3 4 ... 19 20 
1 2 [3] 4 5 ... 19 20
1 2 3 [4] 5 6 ... 19 20
1 2 3 4 [5] 6 7 ... 19 20
1 2 ... 4 5 [6] 7 8 ... 19 20
1 2 ... 14 15 [16] 17 18 19 20
1 2 ... 16 17 [18] 19 20
1 2 ... 17 18 [19] 20
1 2 ... 18 19 [20]
 */

const RANGE = 2 // Khoảng cách xung quanh trang hiện tại
export default function Paginate({ queryConfig, pageSize }: Props) {
    // SỬA 1: Lấy 'pathname' động từ hook
    const location = useLocation()

    // SỬA 2: Đặt giá trị mặc định là 1 nếu page undefined (tránh lỗi NaN)
    const page = Number(queryConfig.page || 1)

    // SỬA 3: Logic renderPagination đã được viết lại hoàn toàn
    const renderPagination = () => {
        let dotAfter = false
        let dotBefore = false

        // Hàm render dấu '...'
        const renderDot = (index: number) => {
            return (
                <span
                    key={index}
                    className='mx-1 cursor-default rounded border bg-white px-3 py-1.5 shadow-sm text-sm text-gray-500'
                >
                    ...
                </span>
            )
        }

        return Array(pageSize)
            .fill(0)
            .map((_, index) => {
                const pageNumber = index + 1

                // Điều kiện để hiển thị:
                // 1. Trang 1
                // 2. Trang cuối (pageSize)
                // 3. Các trang trong khoảng [page - RANGE] đến [page + RANGE]
                const inRange = pageNumber >= page - RANGE && pageNumber <= page + RANGE

                if (pageNumber === 1 || pageNumber === pageSize || inRange) {
                    return (
                        <Link
                            to={{
                                // SỬA: Dùng pathname động
                                pathname: location.pathname,
                                search: createSearchParams({
                                    ...queryConfig,
                                    page: pageNumber.toString()
                                }).toString()
                            }}
                            key={index}
                            className={classNames(
                                'mx-1 cursor-pointer rounded border bg-white px-3 py-1.5 shadow-sm text-sm font-medium transition-colors',
                                {
                                    'border-blue-500 text-blue-600 bg-blue-50 font-bold': pageNumber === page, // Sửa: Dùng màu xanh
                                    'border-gray-300 text-gray-700 hover:bg-gray-50': pageNumber !== page
                                }
                            )}
                        >
                            {pageNumber}
                        </Link>
                    )
                }

                // Xử lý dấu '...' (chỉ render 1 lần)

                // Dấu ... sau trang 1
                if (pageNumber > 1 && pageNumber < page - RANGE && !dotBefore) {
                    dotBefore = true
                    return renderDot(index)
                }

                // Dấu ... trước trang cuối
                if (pageNumber < pageSize && pageNumber > page + RANGE && !dotAfter) {
                    dotAfter = true
                    return renderDot(index)
                }

                return null // Ẩn các trang khác
            })
    }

    // Không render gì nếu chỉ có 1 trang
    if (pageSize <= 1) {
        return null
    }

    return (
        <div className='flex flex-wrap justify-center mt-6'>
            {page === 1 ? (
                <span className='mx-1 cursor-not-allowed rounded border bg-white/60 px-3 py-1.5 shadow-sm text-sm text-gray-400'>
                    Trước
                </span>
            ) : (
                <Link
                    to={{
                        pathname: location.pathname, // Sửa: Dùng pathname động
                        search: createSearchParams({
                            ...queryConfig,
                            page: (page - 1).toString()
                        }).toString()
                    }}
                    className='mx-1 cursor-pointer rounded border bg-white px-3 py-1.5 shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50'
                >
                    Trước
                </Link>
            )}

            {renderPagination()}

            {page === pageSize ? (
                <span className='mx-1 cursor-not-allowed rounded border bg-white/60 px-3 py-1.5 shadow-sm text-sm text-gray-400'>
                    Tiếp
                </span>
            ) : (
                <Link
                    to={{
                        pathname: location.pathname, // Sửa: Dùng pathname động
                        search: createSearchParams({
                            ...queryConfig,
                            page: (page + 1).toString()
                        }).toString()
                    }}
                    className='mx-1 cursor-pointer rounded border bg-white px-3 py-1.5 shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50'
                >
                    Tiếp
                </Link>
            )}
        </div>
    )
}
